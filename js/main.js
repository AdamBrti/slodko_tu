(function () {
  function applySiteConfig() {
    var cfg = window.SLODKOTU_SITE;
    if (!cfg || !cfg.phoneWaDigits) return;
    var wa = String(cfg.phoneWaDigits).replace(/\D/g, "");
    var tel = cfg.phoneTel || "+" + wa;
    var disp = cfg.phoneDisplay || tel;

    document.querySelectorAll('a[href*="wa.me"]').forEach(function (a) {
      var h = a.getAttribute("href");
      if (!h) return;
      a.setAttribute("href", h.replace(/wa\.me\/\d+/, "wa.me/" + wa));
    });

    document.querySelectorAll('a[href^="tel:"]').forEach(function (a) {
      a.setAttribute("href", "tel:" + tel.replace(/\s/g, ""));
    });

    document.querySelectorAll("[data-phone-display]").forEach(function (el) {
      el.textContent = disp;
    });

    var igUrl = cfg.instagramUrl;
    document.querySelectorAll(".js-instagram-link").forEach(function (a) {
      if (!igUrl) {
        a.setAttribute("hidden", "");
        a.setAttribute("aria-hidden", "true");
        a.style.display = "none";
      } else {
        a.removeAttribute("hidden");
        a.removeAttribute("aria-hidden");
        a.style.display = "";
        a.setAttribute("href", igUrl);
      }
    });

    document.querySelectorAll(".js-instagram-line").forEach(function (el) {
      if (!igUrl) {
        el.setAttribute("hidden", "");
        el.style.display = "none";
      } else {
        el.removeAttribute("hidden");
        el.style.display = "";
      }
    });

    function applyOptionalExternalUrl(url, linkClass, lineClass) {
      var ok = url && /^https?:\/\//i.test(String(url).trim());
      document.querySelectorAll(linkClass).forEach(function (a) {
        if (!ok) {
          a.setAttribute("hidden", "");
          a.setAttribute("aria-hidden", "true");
          a.style.display = "none";
        } else {
          a.removeAttribute("hidden");
          a.removeAttribute("aria-hidden");
          a.style.display = "";
          a.setAttribute("href", String(url).trim());
          a.setAttribute("rel", "noopener noreferrer");
        }
      });
      document.querySelectorAll(lineClass).forEach(function (el) {
        if (!ok) {
          el.setAttribute("hidden", "");
          el.style.display = "none";
        } else {
          el.removeAttribute("hidden");
          el.style.display = "";
        }
      });
    }

    applyOptionalExternalUrl(cfg.facebookUrl, ".js-facebook-link", ".js-facebook-line");
    applyOptionalExternalUrl(cfg.booksyUrl, ".js-booksy-link", ".js-booksy-line");

    var mapsOpen =
      (cfg.googleMapsOpenUrl && String(cfg.googleMapsOpenUrl).trim()) || "";
    var mapsReviews =
      (cfg.googleMapsReviewsUrl && String(cfg.googleMapsReviewsUrl).trim()) || mapsOpen;
    if (mapsOpen) {
      document.querySelectorAll(".js-maps-link").forEach(function (a) {
        a.setAttribute("href", mapsOpen);
        a.setAttribute("rel", "noopener noreferrer");
        if (!a.getAttribute("target")) a.setAttribute("target", "_blank");
      });
    }
    if (mapsReviews) {
      document.querySelectorAll(".js-maps-reviews-link").forEach(function (a) {
        a.setAttribute("href", mapsReviews);
        a.setAttribute("rel", "noopener noreferrer");
        if (!a.getAttribute("target")) a.setAttribute("target", "_blank");
      });
    }

    var pub =
      cfg.publicSiteUrl && /^https?:\/\//i.test(String(cfg.publicSiteUrl).trim())
        ? String(cfg.publicSiteUrl).trim().replace(/\/+$/, "")
        : "";
    document.querySelectorAll('script[type="application/ld+json"]').forEach(function (script) {
      try {
        var raw = script.textContent;
        raw = raw.replace(
          /"telephone"\s*:\s*"\+?\d+"/g,
          '"telephone": "' + tel.replace(/\s/g, "") + '"'
        );
        if (pub) {
          var data = JSON.parse(raw);
          var graph = data && data["@graph"];
          if (Array.isArray(graph)) {
            for (var i = 0; i < graph.length; i++) {
              var node = graph[i];
              if (node && node["@type"] === "BeautySalon") {
                node.url = pub + "/";
                node.image = pub + "/Logo%20S%C5%82odko%20Tu.jpg";
                if (cfg.addressStreet) {
                  node.address = node.address || {};
                  node.address["@type"] = "PostalAddress";
                  node.address.streetAddress = cfg.addressStreet;
                  node.address.postalCode = cfg.addressPostalCode || "";
                  node.address.addressLocality = cfg.addressLocality || "Szczecin";
                  node.address.addressNeighborhood = cfg.addressNeighborhood || "";
                  node.address.addressRegion = "Zachodniopomorskie";
                  node.address.addressCountry = "PL";
                }
                if (cfg.geoLat != null && cfg.geoLng != null) {
                  node.geo = {
                    "@type": "GeoCoordinates",
                    latitude: cfg.geoLat,
                    longitude: cfg.geoLng,
                  };
                }
                if (mapsOpen) node.hasMap = mapsOpen;
              }
            }
            raw = JSON.stringify(data);
          }
        }
        script.textContent = raw;
      } catch (e) {}
    });

    document.querySelectorAll("[data-i18n-wa]").forEach(function (el) {
      el.dataset.i18nWaBase = el.getAttribute("href") || "";
    });
  }

  var y = document.getElementById("year");
  if (y) y.textContent = String(new Date().getFullYear());

  applySiteConfig();
  document.addEventListener("slodkotu-i18n-applied", applySiteConfig);

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

  (function initCredLightbox() {
    var openBtn = document.getElementById("cred-open-lightbox");
    var dlg = document.getElementById("cred-lightbox-dialog");
    if (!openBtn || !dlg) return;

    var closeTargets = dlg.querySelectorAll("[data-cred-lightbox-close]");

    function onKeydown(e) {
      if (e.key === "Escape") close();
    }

    function open() {
      dlg.removeAttribute("hidden");
      document.body.style.overflow = "hidden";
      var closeBtn = dlg.querySelector(".cred-lightbox__close");
      if (closeBtn) closeBtn.focus();
      document.addEventListener("keydown", onKeydown);
    }

    function close() {
      dlg.setAttribute("hidden", "");
      document.body.style.overflow = "";
      document.removeEventListener("keydown", onKeydown);
      openBtn.focus();
    }

    openBtn.addEventListener("click", open);
    closeTargets.forEach(function (el) {
      el.addEventListener("click", close);
    });
  })();

  /**
   * Zwijanie przełącznika języków przy scrollu w dół — tylko desktop (min-width: 900px),
   * zgodnie z @media nagłówka w CSS. Na telefonach nagłówek ma zawijane wiersze; animacja
   * max-width na .site-header__lang zmienia wysokość sticky bara → skoki scrollY i „miganie”.
   */
  var header = document.querySelector(".site-header");
  if (header && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    var mqlDesktop = window.matchMedia("(min-width: 900px)");
    var lastScrollY = 0;
    var langCollapsed = false;
    var scrollTicking = false;

    function setLangCollapsed(on) {
      if (on === langCollapsed) return;
      langCollapsed = on;
      header.classList.toggle("site-header--lang-hidden", on);
    }

    function readScrollY() {
      return window.scrollY || document.documentElement.scrollTop || 0;
    }

    function onScrollFrame() {
      scrollTicking = false;
      if (!mqlDesktop.matches) {
        setLangCollapsed(false);
        return;
      }
      var y = readScrollY();
      var dy = y - lastScrollY;
      lastScrollY = y;
      if (y < 48) {
        setLangCollapsed(false);
      } else if (dy > 14 && y > 88) {
        setLangCollapsed(true);
      } else if (dy < -14) {
        setLangCollapsed(false);
      }
    }

    function onScroll() {
      if (!scrollTicking) {
        scrollTicking = true;
        requestAnimationFrame(onScrollFrame);
      }
    }

    function syncScrollCollapseForViewport() {
      window.removeEventListener("scroll", onScroll);
      if (mqlDesktop.matches) {
        lastScrollY = readScrollY();
        window.addEventListener("scroll", onScroll, { passive: true });
      } else {
        setLangCollapsed(false);
      }
    }

    if (mqlDesktop.addEventListener) {
      mqlDesktop.addEventListener("change", syncScrollCollapseForViewport);
    } else if (mqlDesktop.addListener) {
      mqlDesktop.addListener(syncScrollCollapseForViewport);
    }
    syncScrollCollapseForViewport();
  }
})();
