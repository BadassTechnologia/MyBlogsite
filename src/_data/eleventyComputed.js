module.exports = {
  noindex: (data) => Boolean(data.noindex || data.draft || data.page?.url === "/404.html" ||
    (data.cat && !(data.collections?.postsByCategory?.[data.cat.slug] || []).length)),
};
