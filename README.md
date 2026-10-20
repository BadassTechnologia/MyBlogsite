# Bloogsite

Bloogsite is a static editorial site built with Eleventy and Decap CMS. GitHub
stores the source and Cloudflare Pages is the intended production host.

## Local development

Requirements:

- Node.js 22.16.0, recorded in `.node-version`
- npm

Install dependencies and start the local preview:

```bash
npm install
npm run start
```

Create the deployable output:

```bash
npm run build
```

Eleventy writes the finished site to `_site/`.

## Cloudflare Pages build configuration

Create a Pages project using the GitHub repository
`BadassTechnologia/MyBlogsite` and configure:

| Setting | Value |
|---|---|
| Production branch | `main` |
| Build command | `npm run build` |
| Build output directory | `_site` |
| Root directory | repository root |
| Node version | `22.16.0` from `.node-version` |

Do not add production secrets to the repository. Cloudflare automatically
serves the generated top-level `_site/404.html` for missing static routes. The
generated `_headers` file contains the response headers required by this site.

## Production identity

The canonical origin is configured once in `src/_data/site.js`:

```text
https://bloogsite.com
```

Templates use this value for canonical links, Open Graph URLs, the RSS feed,
the sitemap, and `robots.txt`. The public language and feed locale are `en` and
`en-US` respectively.

Cloudflare Pages initially supplies a `*.pages.dev` preview address. Verify the
preview before attaching `bloogsite.com`. After the custom domain works, add
`www.bloogsite.com` and configure a permanent redirect so only one hostname is
canonical. Redirecting the `pages.dev` address to the custom domain is an
account-side Cloudflare rule and is intentionally not performed by this
repository.

## Decap CMS authentication

The admin panel is available at `/admin/`. Its configuration uses Decap's
GitHub backend and the repository `BadassTechnologia/MyBlogsite`.

Netlify Identity and Git Gateway have been removed from the public site. Decap
requires a GitHub OAuth proxy before live CMS login will work. The intended
proxy origin is:

```text
https://auth.bloogsite.com
```

Complete these account-side steps after the Pages preview is working:

1. Deploy the Cloudflare Worker from Decap's documented `decap-proxy` template.
2. Attach the custom Worker domain `auth.bloogsite.com`.
3. Create a GitHub OAuth App owned by the GitHub account or organization that
   controls the repository.
4. Set the OAuth App homepage URL to `https://auth.bloogsite.com`.
5. Set its callback URL to `https://auth.bloogsite.com/callback`.
6. Store `GITHUB_OAUTH_ID` and `GITHUB_OAUTH_SECRET` as encrypted Worker
   secrets. Never put either value in this repository or in Pages source.
7. If the repository is private, configure the proxy's private-repository
   setting as described by its documentation.
8. Visit `https://bloogsite.com/admin/`, authenticate with the authorized
   GitHub account, create a draft, save it, and confirm the editorial workflow
   opens the expected GitHub branch or pull request before publishing.

Relevant documentation:

- [Decap GitHub OAuth proxy overview](https://decapcms.org/docs/backends-overview/#using-github-with-an-oauth-proxy)
- [Decap Cloudflare Worker template](https://github.com/sterlingwes/decap-proxy)
- [Cloudflare Pages Git integration](https://developers.cloudflare.com/pages/configuration/git-integration/)

## Custom-domain cutover and rollback

Do not change DNS until the `pages.dev` deployment passes review.

1. Verify the homepage, category pages, representative articles, search,
   `/admin/`, feed, sitemap, `robots.txt`, security headers, and a missing URL
   on the Pages preview.
2. In the Pages project, add `bloogsite.com` under **Custom domains**.
3. Confirm Cloudflare provisions HTTPS and the domain resolves to the verified
   Pages deployment.
4. Add `www.bloogsite.com` and redirect it permanently to
   `https://bloogsite.com` while preserving paths and query strings.
5. Redirect the `pages.dev` hostname to the canonical domain after both custom
   hostnames work.
6. Recheck canonical URLs, social previews, RSS, sitemap, CMS authentication,
   and unknown-route 404 responses on the production hostname.

If cutover verification fails, remove or disable the new custom-domain mapping
or restore the previous DNS record, then continue using the last verified host
while the issue is corrected. DNS and deployment changes require explicit
owner approval.

## Publishing workflow

- Posts are Markdown files in `src/posts/`.
- Shared page templates live in `src/_includes/`.
- Categories come from `src/_data/categories.json`.
- Uploaded article media belongs in `src/assets/img/uploads/`.
- Saving or publishing through Decap writes to GitHub.
- A push to `main` triggers a Cloudflare Pages production build after the Git
  integration is connected.

The newsletter signup remains intentionally disabled until a provider account,
consent wording, and privacy policy are approved. No placeholder endpoint is
shipped to production.

## Social links

Public social destinations are maintained in `src/_data/site.js`. The current
list includes YouTube, Instagram, the Reddit community and profile, Discord,
and Threads. Add the complete WhatsApp Channel URL only after it is available;
the supplied screenshot truncated that address.

## Project structure

```text
src/
  _data/                 site, category, and author data
  _includes/             shared layouts and article components
  posts/                 Markdown articles
  assets/                CSS, JavaScript, and images
  _headers               Cloudflare Pages response headers
  robots.njk             generated robots.txt
  sitemap.njk            generated sitemap.xml
  feed.njk               generated RSS feed
admin/
  index.html             Decap CMS application
  config.yml             CMS repository, authentication, and content schema
eleventy.config.js       Eleventy collections, filters, and passthrough files
.node-version            Cloudflare and local Node version
```

## Repository conventions

### Generated `_site` output

This repository currently commits `_site/` as a generated snapshot. When a
source change affects rendered pages, generate and review the corresponding
`_site/` output before committing it. Never edit `_site/` by hand.

Cloudflare Pages also generates `_site/` from source during every deployment.
If the repository later adopts a generated-only policy, remove `_site/` from
Git and add it to `.gitignore` in one deliberate change.

### Local and generated noise

`.gitignore` excludes dependencies, macOS metadata, local environment files,
logs, temporary files, and common editor settings. Never commit `.env` files,
OAuth credentials, Cloudflare API tokens, or GitHub tokens.

### Legacy CMS archive and Netlify configuration

`knowledgeopedia-cms.zip` is a legacy recovery snapshot and is not a build
input. `netlify.toml` is retained temporarily as rollback history; Cloudflare
Pages does not read it. Neither file is the current deployment source of truth.

### Unpublished India travel draft

`src/posts/best-places-in-india-to-travel.md` remains unpublished until it has
researched content and approved imagery.

## Adding categories

Add the category to `src/_data/categories.json`, then add the matching option
to the category field in `admin/config.yml`. This keeps navigation, category
pages, and the editor aligned.
