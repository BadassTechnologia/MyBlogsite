---
title: "Anthropic and Self-Improving AI: What Claude Can Do and What Comes Next"
date: 2026-11-24
category: tech
excerpt: "Understand how Anthropic measures Claude's contribution to AI research, what recursive self-improvement would require, and which evidence to watch next."
draft: true
---
{add banner image here}

An AI model can write the script for an experiment and still have no authority to decide whether the experiment matters. It can finish the script, run a test, and summarize the results while a researcher sets the goal and checks every consequential decision. Both the labor saved and the decisions left with the researcher matter when people say an AI is starting to improve itself.

Anthropic's internal measurements give that discussion a concrete starting point. The company reported that Claude led an estimated 26 percent of the model research and development work covered by its prototype index in August 2026. In Anthropic's terminology, leading a task includes human supervision. The company reported zero fully autonomous work in the measured subset at that point. The two findings describe different levels of involvement, and both are necessary to interpret the number.

## What is recursive self-improvement?

For a frontier AI company, recursive self-improvement would mean that a model or model-based system can direct the work needed to build a more capable successor, and that the successor can use its improved abilities to do the same. The recursive part is the feedback across generations. The second system takes part in creating the third, and its improvements affect how that next round proceeds.

An individual chat response does not usually rewrite the model's learned parameters. A model can nevertheless contribute to the process that produces later systems. It can propose an experiment, automate an analysis, help engineers improve training software, or inspect whether a benchmark really measures the intended behavior. If those contributions improve a future system, there is a feedback relationship even though a human-directed organization still controls the work.

A practical way to read claims about this topic is to ask for the smallest unit of work the claim covers. Is the evidence about making a code change, executing a whole experiment, or deciding which research direction to pursue? These activities sit at different levels of the development process. Progress in one gives a reason to investigate the others, but each needs its own evidence.

| What the system does | What a researcher still does | What the example can establish |
| --- | --- | --- |
| Suggests an edit to an experiment script | Selects the edit, runs tests, and judges the result | Assistance with a defined implementation task |
| Executes a specified experiment and writes a report | Chooses the question, sets the limits, and approves conclusions | More independent execution within a supervised project |
| Chooses and evaluates a line of experiments | May still set resources and approve model training and release | Some research planning ability within the tested conditions |
| Builds a stronger successor that can repeat the process | The degree of human intervention must be measured across the whole sequence | Evidence relevant to a recursive improvement claim |

[Image suggestion: Diagram showing separate loops for human-supervised experiments and successive model generations, with review and approval points labeled.]

## How does Anthropic measure Claude's role in research?

Anthropic published a prototype research and development automation index. Its method starts by building a list of the work its staff do across the model development process. In the methodology appendix, the company describes sampling staff work using internal records and using Claude to organize the resulting activities into a hierarchy. That hierarchy helps the team compare similar work across periods. The index also weights work, so a small task category and a larger part of research do not automatically count equally.

The scale runs from AL0, where AI has no role, to AL5, where it operates fully autonomously. At AL3, a model can perform substantial work while a human directs it closely. At AL4, the model can carry out most of a task from a higher-level instruction while a person supervises. Anthropic describes those levels as collaboration and leadership respectively. The names matter because a chart labeled AI leads could otherwise sound as if the model had independently chosen the organization's research agenda.

The August 2026 estimate of 26 percent refers to the work represented by the index at the level where Claude was judged to lead. It takes neither the place of a count of staff hours saved nor the place of a measure of how much better a later model became. To turn it into a time-saving claim, a researcher would need a counterfactual timeline for comparable tasks without the assistance. To link it to capability improvements, researchers would also need evidence of which tasks changed the eventual training or deployment outcomes.

The company also reported that the proportion at or above the collaboration level exceeded 90 percent in August. That breadth can coexist with a lower share at the leadership level. Imagine a lab in which nearly all teams ask for help drafting tests, analyzing results, or debugging code, while some of those teams give a model a larger assignment under supervision. The first number could rise before the second because getting useful input and delegating most of a task are different events.

## What are the limits of the numbers?

The index is a first-party measurement of Anthropic's own work. Its results depend on which material was sampled, how tasks were grouped, and how the researchers assigned weights and automation levels. A judge that reviews transcripts or summaries can miss a gap between what a record says and what actually happened. A model used to classify work can also share blind spots with the model whose contribution it is judging. Anthropic identifies such issues and discusses outside verification as a possible improvement.

The granularity of a task has a large effect on interpretation. Consider a team that develops one evaluation. If it breaks the job into 100 code changes, a model could complete 60 changes while the team decides what should be evaluated and whether the final test is valid. If the team counts the entire evaluation as one task, the same history strikes a different reader as one supervised research project. The choice of task boundaries and weights should therefore accompany the headline figure whenever comparisons are made.

It is also possible for human review to become a bigger share of the remaining work as AI handles more execution. Say a script that previously took four hours can now be produced in 30 minutes, but the reviewer still needs two hours to reproduce a suspicious result. The elapsed time changes from six hours to two and a half, even before accounting for coordination. A headline implying that the entire job became eight times faster would confuse the speed of implementation with the speed of the project.

A more useful follow-up would address the reliability of the index over time. Did the team preserve the same definitions and weighting? Did the reviewers agree on what counts as supervision? Did a third party reproduce the classification on a sample? Answers to those questions would help a reader decide whether a rising number reflects genuine changes in the work or changes in how it is measured.

## What would show a stronger feedback loop?

Start with a repeatable outcome. If a research system proposes a change that makes a successor perform better on one benchmark, check whether the improvement appears on tests the system did not use to guide its work. A method that only raises the number it can see may be fitting that test. A change that transfers across independently chosen tasks gives stronger evidence that the successor acquired a broader ability.

Next, establish what it cost to get that outcome. Consider two hypothetical successors. The first improves at writing short programs after receiving more training compute. The second reaches the same improvement with the same compute as its predecessor because the research system found a more effective training change. Both can be interesting. The second gives a clearer reason to attribute part of the improvement to the research contribution. A fair comparison keeps resource use visible and records which engineering or experimental decisions humans made.

Then observe more than one cycle. If a successor helps build a third model, compare its role with the original model's role using the same task definitions and tests. Does it formulate better hypotheses, identify unreliable results earlier, or successfully handle work that previously required a specialist? A single successful experiment can be important without revealing how quickly or consistently the feedback loop can repeat.

Finally, account for errors that only appear later. A system might improve measured coding performance while quietly weakening an evaluation of another capability. Independent review should check both the promised gains and possible regressions. Preserve records of who could change the tests, approve a training run, set resource limits, and stop a project. That record makes it easier to examine where responsibility and control rested when outcomes are disputed.

## What could happen next?

One plausible path is continued automation of execution under human ownership. Researchers may delegate more coding, data analysis, and experiment preparation while setting the scientific questions and deciding whether results hold up. In that scenario, the biggest gains would occur where execution is currently slow and the work has clear checks. Projects with hard-to-judge outcomes could remain limited by review capacity. An increase in the number of experiments would help only if teams can identify which results are trustworthy.

Another possibility is delegation of larger research work packages. A team could set a question and a compute budget, then ask a supervised system to plan several tests and explain the trade-offs among them. The person reviewing the result would need enough visibility to replay important steps. The organization would also need explicit points where a human takes over, such as approval of an expensive run or arbitration when separate evaluations disagree.

A stronger possibility is an AI-led sequence that spans planning, implementation, training, and evidence of improvement in the next model. Several constraints could shape its pace. Training runs consume hardware and time. Access to suitable data and evaluation environments can be limited. Useful discoveries can be hard to distinguish from random variation. Some decisions require independent checks even if the underlying work can be automated. Improvements in coding and planning make this scenario worth measuring, while the overall speed remains an empirical question.

Faster cycles have practical consequences for oversight. A review process designed around long intervals between major changes can become overloaded if improvements arrive more frequently. A lab could track who accepted each consequential change and reserve time to test the resulting system before using it to advance the next round. The feasibility of that approach depends on the speed of the work, how much the reviewers can observe, and whether the organization enforces the review points it defines.

## Which signals should you track in 2027?

Look for information about what remains human-directed. A useful update should say whether researchers continued choosing problems, authorizing resources, and signing off on results. The better reports will distinguish active direction from supervision or a final approval. They may also identify tasks that still require frequent intervention despite strong performance in a controlled benchmark.

Look for like-for-like comparisons. A chart becomes easier to interpret when task definitions, scoring, relevant resources, and exclusions are disclosed. If a new release uses a different evaluation, examine whether the older model was tested on it too. If a study reports hours saved, check whether it includes review, rework, and the time spent preparing instructions. Apparent improvements that survive those comparisons tell you more than an isolated estimate.

Look for signs that measured improvements transfer into real research results. A reproducible result on an experiment can matter more than a higher count of completed tasks. Evidence spanning multiple development rounds, with independent evaluations, would make a stronger case for feedback that compounds. Evidence of persistent intervention or recurring failures would clarify where the loop still depends on people.

## What Anthropic's evidence supports today

Anthropic's reported measurements point to greater Claude participation in the company's model development. The August 2026 figures describe extensive collaboration and supervised leadership over part of the measured work. They give readers a baseline for following the next claim about self-improving AI. Start by checking which layer of the development process the claim covers, then ask who set the goals and approved the result, and finally look at whether any capability gains carried forward to another generation.

## References

- [Anthropic Institute methodology and findings on measuring the pace of AI development](https://www.anthropic.com/institute/measuring-pace-of-ai-development)
- [Anthropic Institute discussion of recursive self-improvement](https://www.anthropic.com/institute/recursive-self-improvement)
