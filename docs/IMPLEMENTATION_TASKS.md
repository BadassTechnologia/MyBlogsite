# Bloogsite implementation backlog

This backlog records the missing features and unfinished production work found in the repository on 2026-10-20. It is ordered so an agent can implement one task at a time without silently expanding the scope.

## How agents should use this backlog

1. Select the first `Ready` task whose dependencies are complete.
2. Read the listed files and inspect the current diff before editing. The working tree already contains user changes.
3. Change authored source files. Treat `_site/` as generated output rather than the source of truth.
4. Keep the task inside its stated scope. Record a newly discovered dependency instead of folding unrelated work into the task.
5. Run the checks named in the acceptance criteria when verification is part of the task.
6. Do not deploy, push, publish, discard existing changes, or replace user-provided configuration without explicit approval.
7. Update the task status only after every acceptance criterion is satisfied.

Status values: `Ready`, `Blocked`, `In progress`, `Done`.

Use this handoff prompt to start one task:

```text
Implement only TASK_ID from docs/IMPLEMENTATION_TASKS.md. Read the full ticket,
inspect the current working tree and relevant source files, preserve unrelated
changes, and satisfy every acceptance criterion. Do not deploy, push, publish,
or perform a destructive cleanup. When finished, report changed files, checks
performed, remaining limitations, and whether the ticket can be marked Done.
```

## Recommended sequence

| Order | Task | Outcome | Status |
|---:|---|---|---|
| 1 | KOP-001 | Repository hygiene and generated-output policy | Done |
| 2 | KOP-002 | Production site identity and configuration | Done |
| 3 | KOP-003 | Brand, author, and social-sharing assets | Blocked: final brand assets or approval to create them required |
| 4 | KOP-004 | About, Contact, Privacy, and Terms pages | Blocked: owner/contact/legal details required |
| 5 | KOP-005 | Accessible responsive header and navigation | Done |
| 6 | KOP-006 | Functional article and category search | Done |
| 7 | KOP-007 | Working newsletter subscription | Blocked: newsletter provider/account required |
| 8 | KOP-008 | Article-card and image resilience | Done |
| 9 | KOP-009 | Article reading experience | Done |
| 10 | KOP-010 | Structured data and metadata hardening | Depends on KOP-002 and KOP-003 |
| 11 | KOP-011 | CMS schema and editorial workflow alignment | Depends on KOP-002 and KOP-003 |
| 12 | KOP-012 | 404 page and broken-route recovery | Done |
| 13 | KOP-013 | Performance and external-resource pass | Depends on KOP-003 and KOP-008 |
| 14 | KOP-014 | Automated content and link validation | Depends on KOP-002 and KOP-004 |
| 15 | KOP-015 | Replace or hide placeholder articles | Depends on editorial queue tasks |
| 16 | KOP-017 | Cloudflare Pages migration readiness | Done; account-side OAuth and deployment remain |
| 17 | KOP-018 | Automated responsive-image pipeline | Depends on KOP-003 and KOP-008 |
| 18 | KOP-019 | Privacy-conscious analytics and measurement plan | Depends on KOP-002 and KOP-004 |
| 19 | KOP-020 | Advertising and affiliate monetization readiness | Post-launch; depends on KOP-004, KOP-010, and publishable content |
| 20 | KOP-021 | Moderated article comments | Post-launch; provider and moderation policy required |
| 21 | KOP-016 | Final publish-readiness audit | Depends on all release blockers |

---

## KOP-001 — Repository hygiene and generated-output policy

**Status:** Done  
**Use:** `$knowledgeopedia-publish-check`  
**Problem:** macOS `.DS_Store` files, generated `_site/` changes, a legacy ZIP, and an empty extensionless post make the repository noisy and make reviews harder.

**Scope**

- Review `.gitignore` and add appropriate rules for OS metadata, dependencies, and local-only files.
- Decide and document whether `_site/` is committed or generated only during builds; apply that policy consistently without deleting user work.
- Investigate `src/posts/best places-in-india-to-travel`; either turn it into a valid draft Markdown post or remove it through a recoverable, explicitly approved action.
- Classify `knowledgeopedia-cms.zip` as required archive or removable legacy artifact. Do not delete it without approval.

**Likely files:** `.gitignore`, `README.md`, `src/posts/best places-in-india-to-travel`.

**Acceptance criteria**

- A new build or ordinary local work no longer adds `.DS_Store` or dependency noise.
- The policy for `_site/` is written in the README and matches Git tracking behavior.
- The extensionless post and ZIP each have an explicit documented disposition.
- Existing uncommitted source changes remain intact.

**Completed 2026-10-20:** added repository ignore rules; retained the existing
committed `_site/` snapshot policy and documented how it is maintained; converted
the extensionless India travel placeholder into a valid unpublished Markdown
draft; retained and classified `knowledgeopedia-cms.zip` as a legacy recovery
archive pending an explicitly approved cleanup.

---

## KOP-002 — Production site identity and configuration

**Status:** Done  
**Use:** `$knowledgeopedia-publish-check`  
**Needs from owner:** canonical domain or Netlify URL, confirmed site name/capitalization, social handle, and preferred locale.

**Problem:** `your-site-name.netlify.app` remains in site data, CMS configuration, robots, sitemap output, and documentation.

**Scope**

- Replace every production URL placeholder from one shared source where practical.
- Align canonical URLs, Open Graph URLs, RSS URLs, sitemap URLs, robots sitemap reference, CMS `site_url`, and `display_url`.
- Confirm the Twitter/X handle; omit the metadata if no real handle exists.
- Document where future domain changes must be made.

**Likely files:** `src/_data/site.js`, `src/robots.txt`, `admin/config.yml`, `README.md`, templates consuming `site.url`.

**Acceptance criteria**

- `rg "your-site-name|YOUR_"` finds no production-site placeholder except deliberately documented examples.
- Generated canonical, feed, sitemap, robots, and CMS URLs point to the same HTTPS origin.
- Metadata does not advertise a nonexistent social account.

**Completed 2026-10-20:** configured the canonical `https://bloogsite.com`
origin, Bloogsite identity, `en-US` locale, absolute feed/sitemap/robots and
social metadata sources, real supplied social destinations, and omitted the
unconfirmed Twitter/X handle.

---

## KOP-003 — Brand, author, and social-sharing assets

**Status:** Blocked  
**Use:** `$knowledgeopedia-ui` and, if approved, `$imagegen`  
**Needs from owner:** supplied files or approval to create original assets and use the provided author photo.

**Problem:** the CMS logo, default social image, and both author avatars are referenced but missing. The homepage and article covers rely on random Picsum images.

**Scope**

- Add a logo or wordmark suitable for the site and CMS.
- Add a 1200×630 default social-sharing image.
- Add real or intentionally designed author avatars with sensible fallback behavior.
- Define descriptive filenames, dimensions, compression, and allowed formats.
- Replace the homepage hero placeholder with a brand-relevant asset.

**Likely files:** `src/assets/img/`, `src/_data/authors.json`, `src/_data/site.js`, `admin/config.yml`, `src/index.njk`.

**Acceptance criteria**

- Every referenced local asset exists and renders.
- Images have explicit dimensions or stable aspect ratios and meaningful alternative text when informative.
- Social preview image is absolute in generated metadata.
- No publish-ready page depends on a random Picsum image.

---

## KOP-004 — About, Contact, Privacy, and Terms pages

**Status:** Blocked  
**Use:** `$knowledgeopedia-content` and `$knowledgeopedia-ui`  
**Needs from owner:** contact method, publisher identity, jurisdiction, analytics/cookie details, newsletter provider, and approved legal wording.

**Problem:** About and Contact links point to `#`; Privacy and Terms links point to pages that do not exist.

**Scope**

- Create About and Contact pages using the shared layout.
- Create Privacy Policy and Terms pages based only on confirmed site practices and owner-provided legal details.
- Replace header and footer placeholders with real routes.
- Add clear active-navigation behavior where applicable.

**Likely files:** `src/about.njk`, `src/contact.njk`, `src/privacy-policy.njk`, `src/terms.njk`, `src/_includes/base.njk`, `src/assets/css/style.css`.

**Acceptance criteria**

- Every visible header/footer link has a real destination and returns a page.
- Contact details do not expose private information beyond the owner's choice.
- Legal pages accurately reflect the site's actual services; no invented compliance claims.
- Pages are readable on mobile and keyboard accessible.

---

## KOP-005 — Accessible responsive header and navigation

**Status:** Done  
**Use:** `$knowledgeopedia-ui`

**Problem:** the current desktop navigation has no full mobile menu, depends on hover for the category menu, and does not expose complete ARIA state or robust keyboard behavior.

**Scope**

- Add semantic header/navigation landmarks and a mobile menu button.
- Make the category menu usable by keyboard, touch, hover, and click.
- Manage `aria-expanded`, focus order, Escape-to-close, and outside-click behavior.
- Provide visible focus styles and active-page indication.
- Keep navigation useful if JavaScript fails.

**Likely files:** `src/_includes/base.njk`, `src/assets/css/style.css`.

**Acceptance criteria**

- All navigation destinations are reachable with keyboard alone.
- Mobile navigation works at narrow widths without horizontal overflow.
- Menu state is conveyed programmatically and visually.
- Hover-only behavior is not required for any link.
- Existing category generation remains data-driven.

**Completed 2026-10-20:** added semantic primary navigation, separate menu
disclosure controls, responsive mobile behavior, current-page states, visible
focus, Escape and outside-click closing, synchronized ARIA state, and a fully
visible no-JavaScript fallback while retaining data-driven category links.

---

## KOP-006 — Functional article and category search

**Status:** Done  
**Use:** `$knowledgeopedia-ui`

**Problem:** homepage and category search fields are decorative and have no labels or search behavior.

**Scope**

- Choose a static-site search approach appropriate for 28+ posts. Prefer a small local index and progressive enhancement before adding a hosted dependency.
- Support title, excerpt, and category matching.
- Create an accessible results experience with a clear empty state and result count.
- Decide whether category search filters category cards or links to the full article search.

**Likely files:** `src/index.njk`, `src/categories.njk`, `eleventy.config.js`, `src/assets/css/style.css`, a small source JavaScript file if required.

**Acceptance criteria**

- Search produces relevant results for title, excerpt, and category terms.
- Input has a visible or programmatic label.
- Results and no-results state are announced accessibly.
- Search does not require a paid service or leak search terms unless explicitly chosen.
- The no-JavaScript page still exposes normal article/category navigation.

**Completed 2026-10-20:** added a generated local index for published articles,
dependency-free title/excerpt/category matching, in-place category filtering,
visible labels, live result counts and empty states, keyboard-operable submit
controls, and no-JavaScript guidance while preserving all normal navigation.

---

## KOP-007 — Working newsletter subscription

**Status:** Blocked  
**Use:** `$knowledgeopedia-ui`  
**Needs from owner:** newsletter provider, account identifier, consent wording, and success/error behavior.

**Problem:** the form posts to `YOUR_BUTTONDOWN_USERNAME` and opens a popup, so it cannot subscribe anyone.

**Scope**

- Configure a real provider endpoint or remove the form until one exists.
- Add a real label, privacy/consent copy, loading state, success state, and error state.
- Avoid unnecessary popup behavior.

**Likely files:** `src/index.njk`, `src/assets/css/style.css`, privacy page.

**Acceptance criteria**

- A real test subscription reaches the configured list when the owner authorizes testing.
- Failure is visible and preserves the entered address for correction.
- Consent copy links to the privacy policy.
- No placeholder account identifier remains.

---

## KOP-008 — Article-card and image resilience

**Status:** Done  
**Use:** `$knowledgeopedia-ui`

**Problem:** cards assume every article has a valid image, title, and excerpt; image elements lack useful alt text and explicit dimensions.

**Scope**

- Create a reusable article-card include used by the homepage and category pages.
- Add meaningful alt behavior, lazy loading below the fold, dimensions/aspect ratio, and a deterministic fallback image.
- Handle missing excerpts and unknown category values gracefully.
- Keep the full card understandable to assistive technology without repetitive link text.

**Likely files:** new `src/_includes/article-card.njk`, `src/index.njk`, `src/category-page.njk`, `src/assets/css/style.css`.

**Acceptance criteria**

- Homepage and category listings use one shared card component.
- A post with a missing optional field does not break layout or produce `undefined` text.
- Images do not cause avoidable layout shifts.
- Card links have clear accessible names.

**Completed 2026-10-20:** consolidated homepage and category listings into a
shared article-card component with safe metadata fallbacks, a local deterministic
image fallback, reserved image dimensions, lazy loading, CMS image-description
support, and concise accessible link names tied to each article title and excerpt.

---

## KOP-009 — Article reading experience

**Status:** Done  
**Use:** `$knowledgeopedia-ui`

**Problem:** article pages provide the body and author box but lack reading aids and onward discovery.

**Scope**

- Improve typography, line length, heading spacing, lists, tables, code blocks, quotes, and embedded media.
- Add estimated reading time based on rendered article text.
- Add related articles from the same category with duplicate/current-post exclusion.
- Add previous/next or return-to-category navigation if it remains useful after related posts.
- Ensure video embeds are responsive and restrict supported providers or sanitize input.

**Likely files:** `eleventy.config.js`, `src/_includes/post.njk`, `src/assets/css/style.css`.

**Acceptance criteria**

- Long-form content is readable from small phones through desktop screens.
- Reading time is deterministic and omitted gracefully when unavailable.
- Related content never includes the current article and links to valid posts.
- Embedded media remains within the viewport and has an accessible title.

**Completed 2026-10-20:** improved long-form typography and responsive content
styles, added deterministic reading time, same-category related articles with
current-post exclusion, category onward navigation, and allowlisted responsive
YouTube/Vimeo embeds with accessible titles.

---

## KOP-010 — Structured data and metadata hardening

**Status:** Depends on KOP-002 and KOP-003  
**Use:** `$knowledgeopedia-publish-check`

**Problem:** basic metadata exists, but article/site structured data, robust title rules, image fallbacks, and metadata validation are incomplete.

**Scope**

- Add valid JSON-LD for `WebSite`, `Organization` or `Person`, `BreadcrumbList`, and `BlogPosting` where appropriate.
- Ensure article metadata includes author, publication date, category, canonical URL, and a real image.
- Prevent duplicate branding in titles and invalid canonical URLs.
- Ensure feed and sitemap exclude drafts and utility output where appropriate.

**Likely files:** `src/_includes/base.njk`, `src/_includes/post.njk`, `src/sitemap.njk`, `src/feed.njk`, `src/_data/site.js`.

**Acceptance criteria**

- Representative homepage and article structured data passes a validator without errors.
- Canonical and social URLs are absolute and share the configured origin.
- Draft posts do not appear in listings, RSS, or sitemap.
- Metadata remains valid when optional author/image fields are missing.

---

## KOP-011 — CMS schema and editorial workflow alignment

**Status:** Depends on KOP-002 and KOP-003  
**Use:** `$knowledgeopedia-content` and `$knowledgeopedia-publish-check`

**Problem:** category choices are duplicated between JSON and CMS configuration, author editing may not match the JSON file shape, and media/preview behavior has not been verified.

**Scope**

- Verify Decap CMS can read, create, save, preview, draft, and publish a post with the current frontmatter.
- Correct the author collection schema if its list wrapper does not match `authors.json`.
- Document the single procedure for adding a category to data and CMS options.
- Add field guidance for excerpts, cover-image alt text, citations, update dates, and drafts as needed.
- Confirm media uploads land in the intended repository path.

**Likely files:** `admin/config.yml`, `admin/index.html`, `src/_data/authors.json`, `src/posts/posts.11tydata.json`, `README.md`.

**Acceptance criteria**

- A test draft round-trip preserves every supported field without corrupting JSON or frontmatter.
- New media renders through the public path.
- Category and author instructions are documented and consistent.
- Editorial workflow does not publish a draft unintentionally.

---

## KOP-012 — 404 page and broken-route recovery

**Status:** Done  
**Use:** `$knowledgeopedia-ui`

**Problem:** there is no custom not-found page to help visitors recover from stale or mistyped links.

**Scope**

- Create a branded `404.html` through Eleventy.
- Offer links to home, categories, recent posts, and search.
- Configure Netlify behavior only if Eleventy's output is insufficient.

**Likely files:** `src/404.njk`, `src/assets/css/style.css`, optionally `netlify.toml`.

**Acceptance criteria**

- An unknown route shows the custom page with an actual 404 response in the chosen hosting setup.
- Recovery links work.
- Page is usable on mobile and by keyboard.

**Completed 2026-10-20:** added a branded, responsive Eleventy 404 page with
keyboard-visible recovery links to home, search, categories, and recent posts,
plus an explicit non-forced Netlify fallback that preserves the HTTP 404 status.

---

## KOP-013 — Performance and external-resource pass

**Status:** Depends on KOP-003 and KOP-008  
**Use:** `$knowledgeopedia-ui`

**Problem:** the site loads Google Fonts, the Netlify Identity widget on every page, and unoptimized remote images; current performance has not been measured.

**Scope**

- Measure representative homepage, category, and article pages before changing performance behavior.
- Load the Identity widget only where login redirection is needed, or justify global loading.
- Review font strategy and add preconnect, subset/self-host, or system fallback based on measured benefit.
- Optimize local image formats, responsive sizes, lazy loading, and cacheable assets.
- Remove unused client script and avoid adding a framework for small interactions.

**Likely files:** `src/_includes/base.njk`, `src/index.njk`, `src/assets/`, `src/assets/css/style.css`, `netlify.toml`.

**Acceptance criteria**

- Before/after evidence is recorded for agreed representative pages.
- No avoidable third-party script loads on ordinary reading pages.
- Images have responsive sizing and stable layout.
- Changes do not reduce accessibility or break CMS login.

---

## KOP-014 — Automated content and link validation

**Status:** Depends on KOP-002 and KOP-004  
**Use:** `$knowledgeopedia-publish-check`

**Problem:** malformed frontmatter, unknown categories, missing local images, placeholder tokens, and broken internal links can currently reach a build unnoticed.

**Scope**

- Add a lightweight validation command that checks required post fields, valid category/author references, valid dates, missing local assets, and production placeholders.
- Add a generated-site link check for internal routes.
- Keep checks deterministic and fast enough for local use and CI.
- Document how to run them.

**Likely files:** `package.json`, a focused validation script, README, optional GitHub workflow only with owner approval.

**Acceptance criteria**

- The command exits nonzero with a precise file-level message for each controlled failure.
- It catches an unknown category, missing image, malformed date, placeholder production token, and broken internal route.
- Normal validation does not depend on paid services.

---

## KOP-015 — Replace or hide placeholder articles

**Status:** Depends on editorial queue tasks  
**Use:** `$knowledgeopedia-content`

**Problem:** 27 of 28 Markdown posts are placeholder demonstrations and are currently treated as published content.

**Scope**

- Until each post is rewritten, set it to draft or remove it from public collections without losing the draft source.
- Complete editorial queue tasks individually; do not mass-generate superficial articles.
- Replace Picsum covers with lawful, relevant assets before publication.
- Add source links for claims that need support.

**Acceptance criteria**

- No placeholder paragraph is visible on the generated public site.
- Every public post has a genuine article, valid metadata, real or approved imagery, and appropriate sourcing.
- Drafts stay available to editors without entering RSS, sitemap, homepage, or category listings.

---

## KOP-016 — Final publish-readiness audit

**Status:** Blocked until release blockers are complete  
**Use:** `$knowledgeopedia-publish-check`

**Scope**

- Review source changes, build output, representative pages, navigation, search, newsletter, CMS, metadata, feed, sitemap, robots, 404 behavior, mobile layout, keyboard behavior, images, and content completeness.
- Confirm secrets are absent and all production values are intentional.
- Produce a blocker list and a clear recommendation; do not deploy.

**Acceptance criteria**

- All release blockers are closed or explicitly accepted by the owner.
- The build and validation commands complete successfully.
- Representative workflows work from a clean checkout.
- The audit concludes `Ready to publish` before any deployment is requested.

---

## KOP-017 — Cloudflare Pages migration readiness

**Status:** Done  
**Use:** `$knowledgeopedia-publish-check`  
**Needs from owner:** final domain, GitHub repository access, and selection of the Decap CMS authentication approach. Deployment and DNS changes require separate approval.

**Problem:** the repository is configured around Netlify Identity, Git Gateway, redirects, and a Netlify production origin, while the intended host is Cloudflare Pages.

**Scope**

- Document the Cloudflare Pages build command, output directory, production branch, and supported Node version.
- Replace or isolate Netlify-specific runtime dependencies so ordinary public pages do not require Netlify services.
- Choose and configure a Decap CMS authentication approach compatible with Cloudflare Pages, without committing secrets.
- Translate required redirects and response headers to Cloudflare-compatible configuration.
- Add a reversible cutover checklist covering the temporary `pages.dev` preview, custom domain, `www` redirect, HTTPS, DNS, rollback, and post-cutover verification.
- Prepare configuration locally; do not connect accounts, change DNS, or deploy without explicit approval.

**Likely files:** `admin/config.yml`, `admin/index.html`, `netlify.toml`, Cloudflare configuration files if required, `README.md`, `src/_data/site.js`.

**Acceptance criteria**

- A clean checkout has one documented Cloudflare Pages build command and output directory.
- The generated public site has no unnecessary Netlify Identity or Git Gateway dependency.
- CMS authentication architecture, required secrets, callback URLs, and local testing procedure are documented.
- Redirects, security headers, 404 behavior, canonical URLs, feed, sitemap, and robots behavior have Cloudflare equivalents.
- The migration plan includes a rollback path and keeps deployment, DNS, and domain purchase as explicitly approved actions.

**Completed 2026-10-20:** documented the Cloudflare Pages build and cutover,
pinned the Node build version, added Cloudflare response headers, retained the
native generated 404 behavior, removed public Netlify Identity and Git Gateway
dependencies, configured Decap's GitHub backend for the real repository and
planned OAuth origin, and documented secrets, callback URLs, verification, and
rollback. Creating the GitHub OAuth App, deploying its Worker, connecting
Pages, and changing DNS remain account-side actions requiring owner approval.

---

## KOP-018 — Automated responsive-image pipeline

**Status:** Depends on KOP-003 and KOP-008  
**Use:** `$knowledgeopedia-ui`

**Problem:** fifty or more image-led articles can create unnecessary bandwidth, slow mobile rendering, and inconsistent visual quality when authors upload oversized or poorly compressed files.

**Scope**

- Add a build-time image workflow appropriate for Eleventy that creates responsive derivatives from local source images.
- Generate modern formats such as AVIF or WebP with a dependable fallback where browser support or source format requires it.
- Define standard cover-image aspect ratios and sensible output widths for cards, article headers, and social previews.
- Render `srcset`, `sizes`, intrinsic dimensions, and appropriate eager/lazy loading behavior through shared templates.
- Keep original licensed source assets or document the retention policy; never upscale small images to disguise insufficient resolution.
- Document upload dimensions, file-size guidance, rights/attribution requirements, and meaningful alt-text expectations for editors.

**Likely files:** `eleventy.config.js`, `package.json`, `src/_includes/article-card.njk`, `src/_includes/post.njk`, `src/assets/img/`, `README.md`.

**Acceptance criteria**

- Representative card and article images generate multiple responsive widths without visible distortion.
- Browsers receive a suitable derivative rather than the largest source file at every viewport size.
- Image markup reserves layout space and preserves existing fallback and alternative-text behavior.
- The build fails with a clear message for an unsupported or missing required source image.
- The editorial image requirements and repeatable build procedure are documented.

---

## KOP-019 — Privacy-conscious analytics and measurement plan

**Status:** Depends on KOP-002 and KOP-004  
**Use:** `$knowledgeopedia-publish-check`  
**Needs from owner:** approved analytics provider, measurement goals, retention settings, and consent approach for the target regions.

**Problem:** the site has no defined way to determine which articles, categories, search terms, referrals, newsletter prompts, or monetization placements create value.

**Scope**

- Define a small measurement plan for content views, category interest, internal search usage, referral sources, newsletter conversions, and outbound affiliate clicks.
- Evaluate Cloudflare Web Analytics or another privacy-conscious provider against the approved data and consent requirements.
- Document data collected, retention, access, and how analytics can be disabled or replaced.
- Add tracking only after the privacy policy accurately describes it and the owner approves the provider.
- Exclude sensitive form contents, personal data, and full search-query URLs from event payloads.

**Likely files:** `src/_includes/base.njk`, `src/assets/js/`, `src/privacy-policy.njk`, `README.md`.

**Acceptance criteria**

- Every collected metric has a stated decision it supports.
- No personal data, email address, article draft, or sensitive search input is sent as analytics metadata.
- Analytics failure or blocking does not affect navigation, search, reading, or CMS use.
- The privacy policy and implementation describe the same data practices.
- A documented verification method confirms events without inflating production analytics during testing.

---

## KOP-020 — Advertising and affiliate monetization readiness

**Status:** Depends on KOP-004, KOP-010, and publishable content  
**Use:** `$knowledgeopedia-ui`, `$knowledgeopedia-content`, and `$knowledgeopedia-publish-check`  
**Needs from owner:** chosen advertising or affiliate providers, account approval, placement policy, disclosure wording, and consent requirements. Do not activate advertising before explicit approval.

**Problem:** adding advertising after traffic grows can damage reading experience, layout stability, performance, trust, and privacy when placements and disclosures are introduced without constraints.

**Scope**

- Define eligible placement zones that preserve article readability and do not resemble navigation or editorial content.
- Reserve stable dimensions for permitted ad slots to limit layout shift, with responsive behavior and no obstruction on small screens.
- Establish maximum ad density, excluded page types, prohibited formats, and a rule against autoplay or deceptive interactions.
- Add reusable sponsored-content and affiliate-disclosure patterns with accessible labels.
- Document consent, privacy-policy, `ads.txt`, tax/business, and provider-review dependencies without inventing legal conclusions.
- Add provider-neutral placeholders or feature flags only when useful for layout testing; do not load advertising scripts until the owner selects and approves a provider.
- Define performance and revenue measurements so low-value placements can be removed.

**Likely files:** `src/_includes/post.njk`, `src/_includes/base.njk`, reusable ad/disclosure includes, `src/assets/css/style.css`, `src/privacy-policy.njk`, `src/ads.txt`, `README.md`.

**Acceptance criteria**

- The site renders normally with monetization disabled and loads no advertising network scripts by default.
- Test placeholders do not cause avoidable layout shifts, obscure content, trap keyboard focus, or create horizontal overflow.
- Affiliate and sponsored relationships are clearly disclosed before or near affected content and remain understandable to assistive technology.
- The policy defines placement limits and performance budgets for mobile and desktop pages.
- Enabling a real provider remains a separate, reviewable task requiring owner approval and updated privacy/legal information.

---

## KOP-021 — Moderated article comments

**Status:** Post-launch; provider and moderation policy required  
**Use:** `$knowledgeopedia-ui` and `$knowledgeopedia-publish-check`  
**Needs from owner:** selection between GitHub-account comments, an ad-supported hosted service, or a separately hosted comment backend; moderation rules; notification preferences; and privacy wording.

**Problem:** a static Cloudflare Pages site has no comment database or moderation service, and an unplanned third-party embed can add tracking, advertisements, spam, accessibility problems, and substantial page weight.

**Scope**

- Compare Giscus, a broadly accessible hosted provider, and a self-hosted option against reader login friction, moderation, spam controls, privacy, accessibility, data export, performance, and ongoing cost.
- Define which article types allow comments and whether threads close automatically after a chosen period.
- Document moderation rules covering spam, abuse, personal information, misinformation, appeals, and removal requests.
- Load the selected comment client only on eligible article pages and preferably only after reader interaction or when the section approaches the viewport.
- Provide a useful fallback when scripts, cookies, the provider, or authentication are unavailable.
- Update the privacy policy before activation and document how comments can be exported or migrated.

**Likely files:** `src/_includes/post.njk`, a reusable comments include, `src/assets/css/style.css`, `src/assets/js/`, `src/privacy-policy.njk`, `README.md`.

**Acceptance criteria**

- Comments remain disabled until the provider and moderation policy are explicitly approved.
- The chosen implementation clearly explains any required third-party account before the reader starts commenting.
- The comments section is keyboard accessible, responsive, and does not block article rendering when the provider fails.
- Spam reporting, moderation, deletion requests, and comment ownership are documented and tested.
- Comment scripts do not load on pages where discussion is disabled and stay within the agreed performance budget.

---

# Editorial replacement queue

Each row is a separate implementation task. Use `$knowledgeopedia-content`; research time-sensitive claims from current primary or authoritative sources. Default each unfinished article to `draft: true`.

| Task | Post | Category | Evidence/risk note | Status |
|---|---|---|---|---|
| KOP-C001 | `how-ai-is-changing-software-development.md` | AI/Tech | Current product and labor claims need recent sources | Ready |
| KOP-C002 | `top-10-javascript-tips.md` | Tech | Verify behavior against current language/browser docs | Ready |
| KOP-C003 | `the-rise-of-edge-computing.md` | Tech | Use standards/vendor primary sources; separate examples from trends | Ready |
| KOP-C004 | `prompt-engineering-basics.md` | AI Tools | Use current model/provider guidance; avoid universal rules | Ready |
| KOP-C005 | `automating-your-workflow-with-ai.md` | AI Tools | Include privacy, review, and failure-mode guidance | Ready |
| KOP-C006 | `best-ai-writing-assistants-in-2026.md` | AI Tools | Time-sensitive comparison; disclose evaluation method | Ready |
| KOP-C007 | `self-taught-vs-bootcamp.md` | Education | Avoid unsupported salary/outcome claims | Ready |
| KOP-C008 | `study-techniques-that-actually-work.md` | Education | Prefer learning-science research and cautious claims | Ready |
| KOP-C009 | `free-resources-for-lifelong-learners.md` | Education | Verify every resource remains free and available | Ready |
| KOP-C010 | `understanding-index-funds.md` | Finance | High-stakes; educational framing and authoritative sources | Ready |
| KOP-C011 | `building-your-first-budget.md` | Finance | Clearly state assumptions; avoid personal financial advice | Ready |
| KOP-C012 | `emergency-funds-101.md` | Finance | High-stakes; discuss ranges and circumstances, not absolutes | Ready |
| KOP-C013 | `designing-a-morning-routine.md` | Lifestyle | Avoid overpromising productivity or health effects | Ready |
| KOP-C014 | `minimalism-for-beginners.md` | Lifestyle | Practical examples; avoid moralizing | Ready |
| KOP-C015 | `work-life-balance-in-remote-jobs.md` | Lifestyle | Cover differing roles, caregivers, and boundaries | Ready |
| KOP-C016 | `sleep-habits-for-better-focus.md` | Health | High-stakes; use reputable medical sources and safety language | Ready |
| KOP-C017 | `desk-stretches-for-developers.md` | Health | High-stakes; contraindications and qualified sources | Ready |
| KOP-C018 | `understanding-mental-fatigue.md` | Health | High-stakes; avoid diagnosis and include help-seeking guidance | Ready |
| KOP-C019 | `budget-travel-in-southeast-asia.md` | Travel | Prices, visas, and safety information are time-sensitive | Ready |
| KOP-C020 | `working-remotely-from-anywhere.md` | Travel | Visas, taxes, and connectivity claims need current sources | Ready |
| KOP-C021 | `a-weekend-guide-to-kyoto.md` | Travel | Verify openings, transport, etiquette, and seasonal assumptions | Ready |
| KOP-C022 | `understanding-your-audience.md` | Marketing | Add a concrete research workflow and ethical data use | Ready |
| KOP-C023 | `writing-copy-that-converts.md` | Marketing | Include examples without invented conversion statistics | Ready |
| KOP-C024 | `growth-hacks-for-small-businesses.md` | Marketing | Replace hype framing with testable growth experiments | Ready |
| KOP-C025 | `what-s-trending-in-tech-this-month.md` | Trending | Must be dated and sourced; consider recurring content model | Ready |
| KOP-C026 | `viral-tools-worth-trying.md` | Trending | Define selection/evaluation criteria and update date | Ready |
| KOP-C027 | `this-week-in-startups.md` | Trending | Must be dated, sourced, and refreshed or archived promptly | Ready |
| KOP-C028 | `best-places-in-india-to-travel.md` | Travel | New unpublished draft; define audience/season and verify transport, safety, and access details | Ready |

The existing `tech-career-roadmaps-worth-following-in-2026.md` contains original-looking content but still requires a separate fact, link, date, image, and editorial review before publication.

# Feature ideas after launch

These are enhancements rather than release blockers. Create separate tickets only after the core backlog is stable.

- Topic tags in addition to primary categories
- Author archive pages
- Bookmarks or reading list stored locally
- Dark theme respecting system preference
- Table of contents for long articles
- Updated-at metadata and revision notes
- Pagination for category archives as the library grows
- Webmention/comments only after moderation and privacy requirements are defined
- Author and content backup/recovery drill after the Cloudflare and CMS workflow is finalized
