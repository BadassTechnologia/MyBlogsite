(function () {
  "use strict";
  if (!window.CMS || !window.React) return;

  var h = window.React.createElement;

  function PostPreview(props) {
    var entry = props.entry;
    var title = entry.getIn(["data", "title"]) || "Untitled article";
    var category = entry.getIn(["data", "category"]) || "General";
    var author = entry.getIn(["data", "author"]) || "ashok";
    var image = entry.getIn(["data", "image"]);
    var imageAlt = entry.getIn(["data", "imageAlt"]) || "";
    var date = entry.getIn(["data", "date"]);
    var body = props.widgetFor("body");

    return h("div", { className: "cms-site-preview" },
      h("header", { className: "cms-preview-header" }, h("strong", null, "Bloogsite"), h("span", null, "Article preview")),
      h("article", { className: "post-page" },
        image ? h("img", { className: "post-hero-img", src: image, alt: imageAlt }) : null,
        h("span", { className: "tag" }, category.replace(/-/g, " ")),
        h("h1", null, title),
        h("div", { className: "post-meta" },
          h("span", null, author === "ashok" ? "Bloogsite Editorial Team" : "Guest Author"),
          h("span", null, "·"),
          h("span", null, date ? new Date(date).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" }) : "Draft")
        ),
        h("div", { className: "post-body" }, body)
      )
    );
  }

  window.CMS.registerPreviewStyle("/assets/css/style.css");
  window.CMS.registerPreviewStyle("/admin/preview.css");
  window.CMS.registerPreviewTemplate("posts", PostPreview);
})();
