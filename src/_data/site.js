const socialLinks = [
  { name: "YouTube", url: "https://www.youtube.com/@Badass_Technologia" },
  { name: "Instagram", url: "https://www.instagram.com/badass_technologia/" },
  { name: "Reddit community", url: "https://www.reddit.com/r/Badass_Technologia/" },
  { name: "Reddit profile", url: "https://www.reddit.com/user/Badass_Technologia/" },
  { name: "Discord", url: "https://discord.gg/X5X2bkgp" },
  { name: "Threads", url: "https://www.threads.com/@badass_technologia" },
  { name: "WhatsApp", url: "https://whatsapp.com/channel/0029VbBN5fE8V0tknvqCd828" },
  { name: "X", url: "https://x.com/BadassT16598" },
];

module.exports = {
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
  socialLinks,
  socialUrls: socialLinks.map((social) => social.url),
};
