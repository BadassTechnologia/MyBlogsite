module.exports = function (eleventyConfig) {

  // Copy static assets and the Decap CMS admin panel as-is
  eleventyConfig.addPassthroughCopy("src/assets");
  eleventyConfig.addPassthroughCopy("admin");
  eleventyConfig.addPassthroughCopy({ "src/_headers": "_headers" });

  // All published posts, newest first
  eleventyConfig.addCollection("posts", function (collectionApi) {
    return collectionApi
      .getFilteredByGlob("src/posts/*.md")
      .filter((post) => !post.data.draft)
      .sort((a, b) => b.date - a.date);
  });

  // Posts grouped by category slug -> { tech: [...], finance: [...] }
  eleventyConfig.addCollection("postsByCategory", function (collectionApi) {
    const posts = collectionApi
      .getFilteredByGlob("src/posts/*.md")
      .filter((post) => !post.data.draft);

    const grouped = {};
    posts.forEach((post) => {
      const cat = post.data.category;
      if (!cat) return;
      if (!grouped[cat]) grouped[cat] = [];
      grouped[cat].push(post);
    });

    Object.keys(grouped).forEach((cat) => {
      grouped[cat].sort((a, b) => b.date - a.date);
    });

    return grouped;
  });

  eleventyConfig.addCollection("topArticles", function (collectionApi) {
    const posts = collectionApi
      .getFilteredByGlob("src/posts/*.md")
      .filter((post) => !post.data.draft);
    const selected = posts.filter((post) => post.data.topArticle || post.data.featured);
    return (selected.length ? selected : posts)
      .sort((a, b) => b.date - a.date)
      .slice(0, 5);
  });

  // Public HTML pages for the sitemap. Drafts, utility output, and the 404
  // recovery page must not be advertised as indexable production content.
  eleventyConfig.addCollection("sitemapPages", function (collectionApi) {
    return collectionApi
      .getAll()
      .filter((item) =>
        item.url
        && item.outputPath
        && item.outputPath.endsWith(".html")
        && !item.data.draft
        && item.url !== "/404.html"
      );
  });

  eleventyConfig.addFilter("limit", function (arr, n) {
    return (arr || []).slice(0, n);
  });

  eleventyConfig.addFilter("readableDate", function (dateObj) {
    if (!dateObj) return "";
    const d = new Date(dateObj);
    return d.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  });

  eleventyConfig.addFilter("catName", function (slug, cats) {
    const c = (cats || []).find((c) => c.slug === slug);
    if (c) return c.name;
    if (!slug) return "General";
    return String(slug)
      .replace(/[-_]+/g, " ")
      .replace(/\b\w/g, (letter) => letter.toUpperCase());
  });

  eleventyConfig.addFilter("absoluteUrl", function (url, base) {
    try {
      return new URL(url, base).toString();
    } catch (e) {
      return url;
    }
  });

  eleventyConfig.addFilter("rfc822Date", function (dateObj) {
    if (!dateObj) return "";
    return new Date(dateObj).toUTCString();
  });

  eleventyConfig.addFilter("json", function (value) {
    return JSON.stringify(value == null ? "" : value)
      .replace(/</g, "\\u003c")
      .replace(/>/g, "\\u003e")
      .replace(/&/g, "\\u0026");
  });

  eleventyConfig.addFilter("isoDate", function (dateObj) {
    if (!dateObj) return "";
    return new Date(dateObj).toISOString();
  });

  eleventyConfig.addFilter("readingTime", function (html) {
    if (!html) return null;
    const text = String(html)
      .replace(/<script[\s\S]*?<\/script>/gi, " ")
      .replace(/<style[\s\S]*?<\/style>/gi, " ")
      .replace(/<[^>]+>/g, " ")
      .replace(/&(?:[a-z]+|#\d+|#x[a-f\d]+);/gi, " ")
      .replace(/\s+/g, " ")
      .trim();
    if (!text) return null;
    return Math.max(1, Math.ceil(text.split(" ").length / 200));
  });

  eleventyConfig.addFilter("relatedPosts", function (posts, currentUrl, limit = 3) {
    return (posts || [])
      .filter((post) => post && post.url && post.url !== currentUrl)
      .slice(0, limit);
  });

  eleventyConfig.addFilter("safeEmbedUrl", function (value) {
    if (!value) return "";
    try {
      const url = new URL(value);
      if (url.protocol !== "https:") return "";
      const host = url.hostname.toLowerCase();
      const isYouTube = ["www.youtube.com", "youtube.com", "www.youtube-nocookie.com"].includes(host)
        && url.pathname.startsWith("/embed/");
      const isVimeo = host === "player.vimeo.com" && url.pathname.startsWith("/video/");
      return isYouTube || isVimeo ? url.toString() : "";
    } catch (error) {
      return "";
    }
  });

  return {
    dir: {
      input: "src",
      includes: "_includes",
      data: "_data",
      output: "_site",
    },
    markdownTemplateEngine: "njk",
    htmlTemplateEngine: "njk",
  };
};
