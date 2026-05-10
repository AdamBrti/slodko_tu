/**
 * Zgoda na cookies / osadzenia (OpenStreetMap, Google Fonts).
 * Klucz localStorage: slodkotu_cookie_prefs — wartości: "essential" | "full"
 */
(function () {
  var STORAGE_KEY = "slodkotu_cookie_prefs";
  var VAL_ESSENTIAL = "essential";
  var VAL_FULL = "full";

  var GFONTS =
    "https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;1,400;1,500&family=Manrope:wght@400;500;600;700&display=swap";

  function getPref() {
    try {
      return localStorage.getItem(STORAGE_KEY);
    } catch (e) {
      return null;
    }
  }

  function setPref(v) {
    try {
      localStorage.setItem(STORAGE_KEY, v);
    } catch (e) {}
  }

  function injectFonts() {
    if (document.getElementById("slodkotu-gfonts")) return;
    var a = document.createElement("link");
    a.rel = "preconnect";
    a.href = "https://fonts.googleapis.com";
    a.id = "slodkotu-preconnect-g";
    document.head.appendChild(a);
    var b = document.createElement("link");
    b.rel = "preconnect";
    b.href = "https://fonts.gstatic.com";
    b.crossOrigin = "anonymous";
    b.id = "slodkotu-preconnect-gs";
    document.head.appendChild(b);
    var c = document.createElement("link");
    c.rel = "stylesheet";
    c.href = GFONTS;
    c.id = "slodkotu-gfonts";
    document.head.appendChild(c);
  }

  function mapIframeTitle() {
    var lang = (document.documentElement.getAttribute("lang") || "pl").toLowerCase().slice(0, 2);
    var titles = {
      pl: "Mapa okolicy — Szczecin, Zdroje",
      en: "Area map — Szczecin, Zdroje",
      de: "Karte der Umgebung — Stettin, Zdroje",
    };
    return titles[lang] || titles.pl;
  }

  function injectMap() {
    var slot = document.getElementById("contact-map-slot");
    if (!slot) return;
    var src = slot.getAttribute("data-osm-src");
    if (!src || slot.querySelector("iframe.contact-map")) return;
    var ph = document.getElementById("contact-map-placeholder");
    var ifr = document.createElement("iframe");
    ifr.className = "contact-map";
    ifr.title = mapIframeTitle();
    ifr.loading = "lazy";
    ifr.setAttribute("referrerpolicy", "no-referrer-when-downgrade");
    ifr.src = src;
    slot.insertBefore(ifr, slot.firstChild);
    if (ph) ph.remove();
  }

  function setBodyBannerClass(on) {
    if (on) document.body.classList.add("cookie-banner-visible");
    else document.body.classList.remove("cookie-banner-visible");
  }

  function hideBanner(el) {
    if (el) {
      el.hidden = true;
      el.setAttribute("aria-hidden", "true");
    }
    setBodyBannerClass(false);
  }

  function showBanner(el) {
    if (!el) return;
    el.hidden = false;
    el.removeAttribute("aria-hidden");
    setBodyBannerClass(true);
  }

  function applyPref(pref) {
    if (pref === VAL_FULL) {
      injectFonts();
      injectMap();
    }
  }

  function wireBanner(banner) {
    var btnE = banner.querySelector("[data-cookie-essential]");
    var btnA = banner.querySelector("[data-cookie-accept]");
    if (btnE) {
      btnE.addEventListener("click", function () {
        setPref(VAL_ESSENTIAL);
        hideBanner(banner);
      });
    }
    if (btnA) {
      btnA.addEventListener("click", function () {
        setPref(VAL_FULL);
        applyPref(VAL_FULL);
        hideBanner(banner);
      });
    }
  }

  function init() {
    var pref = getPref();
    var banner = document.getElementById("cookie-consent-banner");

    if (pref === VAL_FULL) {
      applyPref(VAL_FULL);
      if (banner) hideBanner(banner);
      return;
    }

    if (pref === VAL_ESSENTIAL) {
      if (banner) hideBanner(banner);
      return;
    }

    if (banner) {
      wireBanner(banner);
      showBanner(banner);
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
