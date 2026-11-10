const linkedinCandidate = process.env.LINKEDIN_URL || "https://www.linkedin.com/company/144024555/";
const linkedinUrl = /^https:\/\/(www\.)?linkedin\.com\/(company|in)\//.test(linkedinCandidate) ? linkedinCandidate : "";

const socialLinks = [
  { name: "YouTube", url: "https://www.youtube.com/@Badass_Technologia" },
  { name: "Instagram", url: "https://www.instagram.com/badass_technologia/" },
  { name: "Reddit community", url: "https://www.reddit.com/r/Badass_Technologia/" },
  ...(linkedinUrl ? [{ name: "LinkedIn", url: linkedinUrl }] : []),
  { name: "Discord", url: "https://discord.gg/X5X2bkgp" },
  { name: "Threads", url: "https://www.threads.com/@badass_technologia" },
  { name: "X", url: "https://x.com/BadassT16598" },
];

const assetVersion = (
  process.env.CF_PAGES_COMMIT_SHA ||
  process.env.GITHUB_SHA ||
  process.env.COMMIT_REF ||
  "local"
).slice(0, 12);

module.exports = {
  linkedinUrl,
  name: "Bloogsite",
  tagline: "Read Beyond the Obvious.",
  subline:
    "Practical guides across technology, finance, careers, health, travel, and modern life so you can act with confidence.",
  url: "https://bloogsite.com",
  language: "en",
  locale: "en-US",
  defaultDescription:
    "Read Beyond the Obvious. Practical guides across technology, finance, careers, health, travel, and modern life so you can act with confidence.",
  defaultImage: "/assets/img/article-fallback.svg",
  twitterHandle: "@BadassT16598",
  googleAnalyticsId: process.env.GOOGLE_ANALYTICS_ID || "G-S42N5YN3CV",
  googleSiteVerification: process.env.GOOGLE_SITE_VERIFICATION || "",
  assetVersion,
  socialLinks,
  socialUrls: socialLinks.map((social) => social.url),
};
