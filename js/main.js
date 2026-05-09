(function () {
  var y = document.getElementById("year");
  if (y) y.textContent = String(new Date().getFullYear());

  document.body.addEventListener("click", function (e) {
    var btn = e.target && e.target.closest && e.target.closest("#cookie-prefs-reset");
    if (!btn) return;
    try {
      localStorage.removeItem("slodkotu_cookie_prefs");
    } catch (err) {}
    try {
      var lg = window.SlodkoTuI18n && window.SlodkoTuI18n.getLang && window.SlodkoTuI18n.getLang();
      window.location.href =
        lg && lg !== "pl" ? "index.html?lang=" + encodeURIComponent(lg) : "index.html";
    } catch (e2) {
      window.location.href = "index.html";
    }
  });

  document.querySelectorAll(".faq__item").forEach(function (d) {
    var s = d.querySelector("summary");
    if (!s) return;
    s.setAttribute("aria-expanded", d.open ? "true" : "false");
    d.addEventListener("toggle", function () {
      s.setAttribute("aria-expanded", d.open ? "true" : "false");
    });
  });

  document.querySelectorAll("[data-faq]").forEach(function (root) {
    root.addEventListener("toggle", function (e) {
      var t = e.target;
      if (!(t instanceof HTMLDetailsElement) || !t.open) return;
      root.querySelectorAll("details").forEach(function (d) {
        if (d !== t) d.removeAttribute("open");
      });
    });
  });
})();
