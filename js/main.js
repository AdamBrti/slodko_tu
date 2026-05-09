(function () {
  var y = document.getElementById("year");
  if (y) y.textContent = String(new Date().getFullYear());

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
