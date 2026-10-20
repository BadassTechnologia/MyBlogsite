(function () {
  "use strict";

  function normalize(value) {
    return String(value || "")
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLocaleLowerCase()
      .trim();
  }

  function queryTokens(query) {
    return normalize(query).split(/\s+/).filter(Boolean);
  }

  function matchesTokens(value, tokens) {
    var searchable = normalize(value);
    return tokens.every(function (token) {
      return searchable.indexOf(token) !== -1;
    });
  }

  function resultMessage(count, singularName, pluralName, query) {
    if (!count) return "No " + pluralName + " found for “" + query + "”. Try a broader term.";
    return count + " " + (count === 1 ? singularName : pluralName) + " found for “" + query + "”.";
  }

  function setupArticleSearch(form) {
    var input = form.querySelector("#article-search");
    var status = document.querySelector("#article-search-status");
    var results = document.querySelector("#article-search-results");
    var list = document.querySelector("#article-search-list");
    var indexPromise;

    if (!input || !status || !results || !list) return;

    function loadIndex() {
      if (!indexPromise) {
        indexPromise = fetch("/search-index.json", {
          headers: { Accept: "application/json" }
        }).then(function (response) {
          if (!response.ok) throw new Error("Search index unavailable");
          return response.json();
        });
      }
      return indexPromise;
    }

    function clearResults() {
      list.replaceChildren();
      results.hidden = true;
    }

    function renderResults(posts, query) {
      var fragment = document.createDocumentFragment();

      posts.forEach(function (post) {
        var item = document.createElement("li");
        var link = document.createElement("a");
        var category = document.createElement("span");
        var title = document.createElement("strong");
        var excerpt = document.createElement("span");

        item.className = "search-result-item";
        link.className = "search-result-link";
        link.href = post.url;
        category.className = "search-result-category";
        category.textContent = post.category;
        title.className = "search-result-title";
        title.textContent = post.title;
        excerpt.className = "search-result-excerpt";
        excerpt.textContent = post.excerpt || "Open this article to read more.";

        link.append(category, title, excerpt);
        item.appendChild(link);
        fragment.appendChild(item);
      });

      list.replaceChildren(fragment);
      results.hidden = posts.length === 0;
      status.textContent = resultMessage(posts.length, "article", "articles", query);
    }

    function search() {
      var query = input.value.trim();
      var tokens = queryTokens(query);

      if (!tokens.length) {
        clearResults();
        status.textContent = "Type a word or phrase to search the article library.";
        return;
      }

      status.textContent = "Searching articles…";

      loadIndex()
        .then(function (posts) {
          var matches = posts.filter(function (post) {
            return matchesTokens([post.title, post.excerpt, post.category].join(" "), tokens);
          });
          renderResults(matches, query);
        })
        .catch(function () {
          clearResults();
          status.textContent = "Search is temporarily unavailable. Browse the featured articles and categories below.";
        });
    }

    form.addEventListener("submit", function (event) {
      event.preventDefault();
      search();
    });
    input.addEventListener("input", search);
  }

  function setupCategorySearch(form) {
    var input = form.querySelector("#category-search");
    var status = document.querySelector("#category-search-status");
    var cards = Array.prototype.slice.call(document.querySelectorAll("[data-category-card]"));

    if (!input || !status || !cards.length) return;

    function filterCategories() {
      var query = input.value.trim();
      var tokens = queryTokens(query);
      var visibleCount = 0;

      cards.forEach(function (card) {
        var visible = !tokens.length || matchesTokens(card.dataset.searchText, tokens);
        card.hidden = !visible;
        if (visible) visibleCount += 1;
      });

      if (!tokens.length) {
        status.textContent = cards.length + " categories available.";
      } else {
        status.textContent = resultMessage(visibleCount, "category", "categories", query);
      }
    }

    form.addEventListener("submit", function (event) {
      event.preventDefault();
      filterCategories();
    });
    input.addEventListener("input", filterCategories);
  }

  document.querySelectorAll("[data-search-mode]").forEach(function (form) {
    if (form.dataset.searchMode === "articles") setupArticleSearch(form);
    if (form.dataset.searchMode === "categories") setupCategorySearch(form);
  });
})();
