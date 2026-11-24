---
title: "How to Use SQLite WAL Mode Without Surprising Database Locks"
date: 2026-11-24
category: tech
excerpt: "Enable SQLite WAL mode, reproduce reader and writer behavior in two terminals, and diagnose lock waits, checkpoint lag, and backup mistakes."
draft: true
---
{add banner image here}

Your dashboard keeps reading while a background worker records new events. Then a burst of requests arrives, another worker tries to write, and the application reports that the database is locked. Enabling write-ahead logging can help the dashboard and worker share the file, but the second worker still needs to wait for the first writer. The distinction determines whether you should adjust a timeout, shorten a transaction, or change the way the application queues its writes.

SQLite write-ahead logging, or WAL mode, is worth testing when a single host needs to serve reads while committing frequent changes to a local database. This guide uses a disposable file and two SQLite command-line sessions to show the difference between a reader holding an old snapshot and a writer holding the write lock. It then turns those observations into checks you can apply to a service with connection pooling, scheduled jobs, and backups.

## What does WAL mode change?

In WAL mode, SQLite records modified pages in a separate write-ahead log. A commit makes a transaction visible through the log. A checkpoint copies committed pages back into the main database file. Readers can use the main file together with the log to see a consistent version of the database for the life of their read transaction.

Imagine a dashboard opening a read transaction when the events table contains ten rows. A worker commits an eleventh row while the dashboard is still reading. The dashboard can finish reading its original ten-row snapshot. A new read transaction can see eleven. That independence is what helps during normal overlap between reports and writes. Keep in mind that an explicit read transaction can retain an old view even after the application has displayed the first results.

A WAL file typically sits beside the main database and ends in `-wal`. SQLite also uses a shared-memory index, typically represented by a `-shm` file. Give the database directory the permissions the runtime needs to manage these sidecars. Deployments that share a live database over a network filesystem across hosts need another design, because WAL participants need to coordinate on the same host. A container on a single host can still be unsuitable if the underlying volume has incompatible locking or shared-memory behavior.

[Image suggestion: A two-lane diagram showing a reader retaining its snapshot as a writer appends and commits a new event.]

## Step 1. Enable WAL on a disposable database

Open two terminal windows and keep both in the same working directory. Create that directory somewhere on a local filesystem. Start the SQLite shell in terminal A with the command below. Use a new file, since the example intentionally creates and changes a table.

    sqlite3 wal-demo.db

Run the following SQL in terminal A. The event labels are plain text so you can identify each transaction in later output.

    SELECT sqlite_version();
    PRAGMA journal_mode = WAL;
    CREATE TABLE events (
      id INTEGER PRIMARY KEY,
      label TEXT NOT NULL
    );
    INSERT INTO events (label) VALUES ('initial');

The mode change should return `wal`. If it returns another mode, stop the exercise and investigate why the database could not make the transition. Inspect where the file lives, whether the process can write the database and directory, and whether another connection already has the file open. A configuration statement and its returned value are two separate pieces of evidence. Record the returned value when enabling WAL during a real migration.

Now open the same file with `sqlite3 wal-demo.db` in terminal B. Run `PRAGMA journal_mode;` and confirm it returns `wal`. WAL mode persists for the database across connections. Other settings you will use below, such as the busy handler timeout, are connection-level. In an application pool, configure those settings as each connection is initialized.

Check the SQLite library version from inside your actual application as well. The command-line binary, a runtime's bundled SQLite library, and the binding shipped in a container may differ. The SQLite project documents a WAL-reset issue associated with a narrow pattern involving multiple connections writing or checkpointing at the same time. Compare the deployed library with the fixed versions listed by SQLite and test your runtime or distribution update before exposing the configuration to concurrent production traffic.

## Step 2. Watch a reader keep its original snapshot

In terminal A, start a read transaction and query the events table. The first query establishes the read snapshot for this example.

    BEGIN;
    SELECT id, label FROM events ORDER BY id;

Leave terminal A open and run this insert in terminal B. The insert executes as its own transaction because B has no explicit transaction open.

    INSERT INTO events (label) VALUES ('worker committed');
    SELECT COUNT(*) FROM events;

Terminal B should return a count of two. Go back to terminal A and query the count twice, with a commit between the queries.

    SELECT COUNT(*) FROM events;
    COMMIT;
    SELECT COUNT(*) FROM events;

Expect one for the first count and two for the second. Both readers saw the correct answer for their transaction. A page that intentionally holds a consistent snapshot while reading related tables can benefit from this behavior. A polling loop that expects to refresh its results should release each earlier read transaction before polling again.

In a service, a read can last longer than its SQL execution time. A handler may stream a result set to a client, walk a large cursor while building a response, or leave an explicit transaction open after a failed request. Measure the time between opening and closing the read transaction. If the cursor remains open as the application waits on a slow client, the snapshot may persist long after the query produced its first row.

## Step 3. Reproduce contention between writers

In terminal A, acquire a write transaction but leave it open. The label makes it easy to tell which changes reach the database in the next step.

    BEGIN IMMEDIATE;
    INSERT INTO events (label) VALUES ('first writer');

In terminal B, set a short, illustrative wait and try a second insert while A is still holding its transaction.

    PRAGMA busy_timeout = 1500;
    INSERT INTO events (label) VALUES ('second writer');

Terminal B should wait briefly and then report that the database is locked if terminal A still holds the write transaction. Commit in terminal A and then repeat the insert in terminal B. Query the rows in B to confirm both writer labels appear once. A service should choose its timeout by measuring expected writer overlap and accounting for its request deadline. The example uses 1,500 milliseconds because it makes the experiment observable without requiring a long wait.

A busy timeout gives a connection a chance to wait for some locks to clear. It cannot refresh a stale read snapshot. For example, one transaction may read a value, another connection may commit a change, and the original read transaction may then try to write. If SQLite reports `SQLITE_BUSY_SNAPSHOT` on that promotion, roll back and start a new transaction so the application can repeat its decision using current data. Check how your SQLite binding surfaces extended result codes, because a wrapper can present multiple SQLite errors with similar text.

Use `BEGIN IMMEDIATE` selectively for operations known to write. Acquiring the write transaction before reading lets that operation resolve writer contention up front. Starting every report that way would make purely read-oriented work reserve the writer slot. Give reads and writes their own paths, and release the writer promptly once its database changes are complete.

## Diagnose long transactions and checkpoint lag separately

When the WAL grows, start by asking whether the log is being reused and whether checkpoint progress is keeping up with writes. A file can retain allocated space after SQLite has checkpointed its contents and later reuse that space. A growing file paired with an old read snapshot and lagging checkpoint progress gives you a more actionable lead than file size alone.

In a disposable run, leave a reader open from terminal A and execute additional writes from B. Then run this from B while B has no transaction open:

    PRAGMA wal_checkpoint(PASSIVE);

The pragma reports three integers. In WAL mode, the second and third report the total number of frames in the log and the number checkpointed, respectively. Passive checkpointing can make partial progress if readers are still using older snapshots. Compare repeated samples alongside write volume and transaction ages. Treat the command as an operation that may do checkpoint work, so run it at an appropriate cadence rather than on every request.

If a recurring export holds an old read open for a long time, shorten its lifetime or run the export from a separate consistent backup. Splitting the export into several reads can also reduce snapshot age if the export contract permits seeing changes between pages. Where a financial or audit export requires a single consistent view, use the backup route or design the query and delivery path so the snapshot can close as soon as the necessary data is captured.

Avoid using an aggressive checkpoint as a quick fix during a traffic spike. A checkpoint mode that waits for active readers can shift the delay to the connection issuing it. Start by identifying which requests and jobs own the oldest transactions. Then test any checkpoint policy change under the same mix of dashboard reads and worker writes that exposed the problem. Compare tail latency and WAL growth before and after the change.

## Tune the application around its transaction boundaries

Suppose a worker receives a batch of notifications from an external service and writes each notification to an events table. Fetch and parse the batch before starting a write transaction. Once data is validated, start the transaction, execute the inserts, and commit. If the worker currently calls the external service inside the transaction, every slow network response lengthens the time other writers must wait.

Batching avoids repeated transaction overhead but changes the duration of each write. Try several realistic batch sizes during a load test and record both completed events per second and the slowest user-facing writes. A large batch can look efficient while a scheduled worker runs alone and make the dashboard's interactive updates miss their latency budget when both workloads overlap.

Give retries a limit that fits the caller's deadline. A failed write followed by a retry also needs a plan for duplicate requests. For example, store the external notification's stable ID in a column with a uniqueness constraint so the same event can be recognized if the worker repeats the operation. For application operations that mix a database update and an outside side effect, decide how to record and reconcile the side effect separately so a database retry cannot repeat it blindly.

| Observation | First thing to check | What you can change |
| --- | --- | --- |
| Writes fail during a scheduled job | Time the job holds a write transaction | Validate input before writing and test smaller batches |
| A read-then-write operation fails after another update | The binding's extended SQLite result code | Restart the transaction and recalculate against a fresh snapshot |
| The WAL grows during exports | Age of the oldest read transaction and checkpoint progress | Shorten cursor lifetime or export from a consistent backup |
| One deployment has more lock errors than staging | Runtime SQLite version, storage, and pool configuration | Align settings and repeat a mixed read and write test |

## Back up the live database with SQLite-aware tooling

When the database is active, copying just the main file can omit committed changes that are still in the log. Use SQLite's Online Backup API or another SQLite-aware backup procedure. In the SQLite shell, the following example creates a separate snapshot using a new destination filename:

    .backup wal-demo-snapshot.db

Open the destination file by itself and run `PRAGMA integrity_check;`. A healthy result is `ok`. Also check the part of the data that matters to your service. In this demonstration, query the event labels and count the rows. In a real restore drill, check expected tables, recent records, and any application migration metadata before starting a copy of the service against the restored file.

Keep backup and restore inputs deliberate. A live WAL can contain database state that matters for recovery, and the live process owns its sidecars. Use the normal database interfaces while the application is running. When testing restore, restore to a fresh location and make the application point to that location explicitly. A successful file copy is a useful intermediate signal, while a readable database and a successful application check are what establish that you can use the backup.

## Decide if a single SQLite writer fits your service

A single-host application with short writes and frequent reads is a good starting point for evaluating WAL. If writers still conflict, examine whether the application already has a natural place to serialize them. A background job queue can route event imports through one consumer, while interactive requests retain a separate path with measured transaction durations. Test the queue with a backlog before adopting it, because high throughput can still come with unacceptable time spent waiting for a job to start.

For workloads spread across several hosts that must access the same live data, or workloads whose simultaneous writes consistently exceed what one writer can handle, evaluate a client-server database. Use the measurements from the two-session experiment to guide that decision. Write lock time, request latency, checkpoint lag, and recoverability are the dimensions that matter to the application owner.

Start by reproducing the read snapshot and two-writer examples. Then measure the longest production-like reader and writer and restore one backup in a clean directory. Those three checks give you evidence about whether WAL improves the service you actually run.

## References

- [SQLite documentation on write-ahead logging, concurrency, and the WAL-reset issue](https://sqlite.org/wal.html)
- [SQLite PRAGMA documentation for journal mode, timeouts, and checkpoint tests](https://sqlite.org/pragma.html)
- [SQLite Online Backup API documentation](https://sqlite.org/backup.html)
- [SQLite command-line shell documentation](https://sqlite.org/cli.html)
