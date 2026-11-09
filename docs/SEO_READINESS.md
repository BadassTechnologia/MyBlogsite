# Search discovery readiness

## Local implementation

- Categories remain accessible with `noindex, follow` while they have no published posts.
- A category with at least one non-draft article automatically becomes indexable and appears once in the sitemap. All pagination pages are registered with Eleventy.
- Sitemap excludes drafts, noindex pages, empty category pages and the 404. Ordinary pages omit lastmod unless an explicit `updated` value is supplied; articles can fall back to their explicit publication date. Use ISO dates for `date` and `updated`; change updated only for substantive revisions.
- Article templates already provide canonical URLs, unique title/description fallbacks, social metadata and links from blog/category listings. Article JSON-LD now supports dateModified and breadcrumbs. The editorial team is an Organization, not an invented individual.
- Editorial and corrections policy is linked from About, Contact and the footer. Email remains pending.
- LinkedIn uses the public company URL https://www.linkedin.com/company/144024555/ on About, Contact, the footer and sameAs metadata. The supplied admin dashboard URL is not published. `LINKEDIN_URL` can override the default.

## Search Console: account steps still required

1. Sign into Google Search Console and add the Domain property `bloogsite.com`.
2. If not already verified, add Google's exact TXT verification record in Cloudflare DNS. Preserve existing DNS records. DNS verification needs no repository change. URL-prefix verification can alternatively use the existing GOOGLE_SITE_VERIFICATION environment variable, with Google's exact token.
3. After the approved changes are deployed, submit https://bloogsite.com/sitemap.xml.
4. Inspect the homepage and the first genuinely published article with URL Inspection. Check selected canonical, crawl permission, page fetch and indexing status. Request indexing for important new articles; repeated submissions do not guarantee indexing.
5. Empty category exclusions are intentional. After publication, verify the populated category loses noindex and enters the sitemap.

## Live observations — 2026-11-07

Homepage and Finance category returned HTTP 200 and self-referencing canonical URLs. Homepage had no noindex directive or X-Robots-Tag blocking header. Public robots.txt allows crawling except /admin/. Requests bearing Googlebot, OAI-SearchBot and PerplexityBot user agents returned 200 from this connection. This does not verify real bot IP access or account-level Cloudflare rules. Review Cloudflare security events for actual crawler challenges before changing security settings.

Production sitemap had only the first paginated category and deployment-time lastmod values. Local corrections require a separately authorized deployment.

No Search Console or Cloudflare account changes were made. Search inclusion, ranking and AI citation are not guaranteed by these changes.
