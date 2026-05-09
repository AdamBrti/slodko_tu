/**
 * UI language: PL (default HTML), EN, DE. Preference: localStorage + ?lang= in URL.
 * Requires js/legal-i18n.js before this file for legal page bodies.
 */
(function () {
  "use strict";

  var LANG_KEY = "slodkotu-lang";

  var PAGE_META = {
    index: {
      en: {
        title: "SłodkoTu — sugar paste hair removal, spray tan | beauty studio Szczecin Zdroje",
        description:
          "Intimate beauty studio in Zdroje: sugar paste depilation and spray tan. Szczecin — also welcoming guests from Gryfino, Chojna, Widuchowa, Banie and Stare Czarnowo.",
      },
      de: {
        title: "SłodkoTu — Zucker-Paste-Haarentfernung, Spray-Tan | Beauty-Studio Stettin Zdroje",
        description:
          "Kleines Beauty-Studio in Zdroje: Haarentfernung mit Zuckerpaste und Spray-Tan. Stettin — willkommen u. a. aus Gryfino, Chojna, Widuchowa, Banie und Stare Czarnowo.",
      },
    },
    cennik: {
      en: {
        title: "Pricing — SłodkoTu | sugar depilation and spray tan Szczecin Zdroje",
        description:
          "SłodkoTu price guide in Szczecin Zdroje: sugar waxing, bikini, spray tan. Overview and sample prices — contact us to confirm.",
      },
      de: {
        title: "Preise — SłodkoTu | Zuckerpaste und Spray-Tan Stettin Zdroje",
        description:
          "Preisübersicht SłodkoTu in Stettin Zdroje: Zuckerpaste, Bikini, Spray-Tan — zur Bestätigung kontaktieren Sie uns.",
      },
    },
    privacy: {
      en: {
        title: "Privacy policy — SłodkoTu",
        description: "Who processes data at SłodkoTu: contact, purposes, third-party tools, your rights.",
      },
      de: {
        title: "Datenschutzerklärung — SłodkoTu",
        description: "Wer Daten bei SłodkoTu verarbeitet: Kontakt, Zwecke, Drittanbieter, Ihre Rechte.",
      },
    },
    cookies: {
      en: {
        title: "Cookie policy — SłodkoTu",
        description: "How SłodkoTu uses cookies and similar technologies on this website.",
      },
      de: {
        title: "Cookie-Richtlinie — SłodkoTu",
        description: "Wie SłodkoTu Cookies und ähnliche Technologien auf dieser Website nutzt.",
      },
    },
    terms: {
      en: {
        title: "Terms of service — SłodkoTu",
        description: "Rules for booking, cancellations and visits at SłodkoTu beauty studio.",
      },
      de: {
        title: "Leistungsbedingungen — SłodkoTu",
        description: "Regeln für Terminbuchung, Absagen und Ablauf im Beauty-Studio SłodkoTu.",
      },
    },
  };

  var M = { en: {}, de: {} };

  function normalizeLang(v) {
    if (v === "en" || v === "de" || v === "pl") return v;
    return "pl";
  }

  function readLangFromStorage() {
    try {
      return normalizeLang(localStorage.getItem(LANG_KEY));
    } catch (e) {
      return "pl";
    }
  }

  function getLang() {
    var raw = null;
    try {
      raw = new URLSearchParams(window.location.search).get("lang");
    } catch (e) {}
    if (raw === "en" || raw === "de" || raw === "pl") return raw;
    var s = readLangFromStorage();
    if (s === "en" || s === "de") return s;
    return "pl";
  }

  function setLang(lang) {
    lang = normalizeLang(lang);
    try {
      localStorage.setItem(LANG_KEY, lang);
    } catch (e) {}
    try {
      var u = new URL(window.location.href);
      if (lang === "pl") u.searchParams.delete("lang");
      else u.searchParams.set("lang", lang);
      window.history.replaceState({}, "", u.pathname + u.search + u.hash);
    } catch (e2) {}
    apply(lang);
  }

  function cacheStaticMeta() {
    var root = document.documentElement;
    if (root.dataset.i18nTitlePl === undefined) root.dataset.i18nTitlePl = document.title;
    var md = document.querySelector('meta[name="description"]');
    if (md && root.dataset.i18nDescPl === undefined) root.dataset.i18nDescPl = md.getAttribute("content") || "";
  }

  function cacheTextBases() {
    document.querySelectorAll("[data-i18n]").forEach(function (el) {
      if (el.dataset.i18nBase === undefined) el.dataset.i18nBase = el.textContent;
    });
    document.querySelectorAll("[data-i18n-html]").forEach(function (el) {
      if (el.dataset.i18nBase === undefined) el.dataset.i18nBase = el.innerHTML;
    });
    document.querySelectorAll("[data-i18n-aria]").forEach(function (el) {
      if (el.dataset.i18nAriaBase === undefined) el.dataset.i18nAriaBase = el.getAttribute("aria-label") || "";
    });
    document.querySelectorAll("[data-i18n-wa]").forEach(function (el) {
      if (el.dataset.i18nWaBase === undefined) el.dataset.i18nWaBase = el.getAttribute("href") || "";
    });
    document.querySelectorAll("[data-i18n-alt]").forEach(function (el) {
      if (el.dataset.i18nAltBase === undefined) el.dataset.i18nAltBase = el.getAttribute("alt") || "";
    });
  }

  function applyPageMeta(lang) {
    var pageId = document.body.getAttribute("data-i18n-page") || "";
    cacheStaticMeta();
    var root = document.documentElement;
    if (lang === "pl") {
      document.title = root.dataset.i18nTitlePl || document.title;
      var mdPl = document.querySelector('meta[name="description"]');
      if (mdPl && root.dataset.i18nDescPl) mdPl.setAttribute("content", root.dataset.i18nDescPl);
      return;
    }
    var pm = PAGE_META[pageId] && PAGE_META[pageId][lang];
    if (!pm) return;
    if (pm.title) document.title = pm.title;
    var md = document.querySelector('meta[name="description"]');
    if (md && pm.description) md.setAttribute("content", pm.description);
  }

  function applyI18nNodes(lang) {
    document.querySelectorAll("[data-i18n]").forEach(function (el) {
      var key = el.getAttribute("data-i18n");
      if (lang === "pl") {
        el.textContent = el.dataset.i18nBase != null ? el.dataset.i18nBase : el.textContent;
        return;
      }
      var t = M[lang] && M[lang][key];
      if (t != null && t !== "") el.textContent = t;
    });
    document.querySelectorAll("[data-i18n-html]").forEach(function (el) {
      var key = el.getAttribute("data-i18n-html");
      if (lang === "pl") {
        el.innerHTML = el.dataset.i18nBase != null ? el.dataset.i18nBase : el.innerHTML;
        return;
      }
      var h = M[lang] && M[lang][key];
      if (h != null && h !== "") el.innerHTML = h;
    });
    document.querySelectorAll("[data-i18n-aria]").forEach(function (el) {
      var key = el.getAttribute("data-i18n-aria");
      if (lang === "pl") {
        var b = el.dataset.i18nAriaBase;
        if (b) el.setAttribute("aria-label", b);
        return;
      }
      var t = M[lang] && M[lang][key];
      if (t) el.setAttribute("aria-label", t);
    });
    document.querySelectorAll("[data-i18n-wa]").forEach(function (el) {
      var key = el.getAttribute("data-i18n-wa");
      if (lang === "pl") {
        var hb = el.dataset.i18nWaBase;
        if (hb) el.setAttribute("href", hb);
        return;
      }
      var msg = M[lang] && M[lang][key];
      if (msg) el.setAttribute("href", "https://wa.me/48910000001?text=" + encodeURIComponent(msg));
    });
    document.querySelectorAll("[data-i18n-alt]").forEach(function (el) {
      var key = el.getAttribute("data-i18n-alt");
      if (lang === "pl") {
        var ab = el.dataset.i18nAltBase;
        if (ab != null) el.setAttribute("alt", ab);
        return;
      }
      var t = M[lang] && M[lang][key];
      if (t) el.setAttribute("alt", t);
    });
  }

  function applyLegalBodies(lang) {
    document.querySelectorAll("[data-i18n-legal]").forEach(function (el) {
      var id = el.getAttribute("data-i18n-legal");
      if (!id) return;
      if (!el._i18nLegalPl) el._i18nLegalPl = el.innerHTML;
      if (lang === "pl") {
        el.innerHTML = el._i18nLegalPl;
        return;
      }
      var pack = window.SLODKOTU_LEGAL_I18N && window.SLODKOTU_LEGAL_I18N[lang];
      if (pack && pack[id]) el.innerHTML = pack[id];
    });
  }

  function patchInternalLinks(lang) {
    var names = /^(index\.html|cennik\.html|polityka-prywatnosci\.html|polityka-cookies\.html|regulamin\.html)$/i;
    document.querySelectorAll('a[href]').forEach(function (a) {
      var href = a.getAttribute("href");
      if (!href || /^(https?:|mailto:|tel:|#)/i.test(href)) return;
      var hash = "";
      var pathPart = href;
      var hashIdx = href.indexOf("#");
      if (hashIdx >= 0) {
        hash = href.slice(hashIdx);
        pathPart = href.slice(0, hashIdx);
      }
      var qIdx = pathPart.indexOf("?");
      var path = qIdx >= 0 ? pathPart.slice(0, qIdx) : pathPart;
      var qs = qIdx >= 0 ? pathPart.slice(qIdx + 1) : "";
      if (!names.test(path)) return;
      var params = new URLSearchParams(qs);
      if (lang === "pl") params.delete("lang");
      else params.set("lang", lang);
      var nextQs = params.toString();
      a.setAttribute("href", path + (nextQs ? "?" + nextQs : "") + hash);
    });
  }

  function updateLangSwitchUI(lang) {
    document.querySelectorAll(".lang-switch__btn").forEach(function (btn) {
      var l = btn.getAttribute("data-lang");
      var on = l === lang;
      btn.classList.toggle("is-active", on);
      btn.setAttribute("aria-pressed", on ? "true" : "false");
    });
  }

  function wireLangSwitch() {
    document.querySelectorAll(".lang-switch__btn").forEach(function (btn) {
      btn.addEventListener("click", function () {
        var l = btn.getAttribute("data-lang");
        if (l) setLang(l);
      });
    });
  }

  function apply(lang) {
    lang = normalizeLang(lang);
    document.documentElement.lang = lang;
    applyPageMeta(lang);
    applyI18nNodes(lang);
    applyLegalBodies(lang);
    patchInternalLinks(lang);
    updateLangSwitchUI(lang);
  }

  function mergeMessages() {
    var en = {
      skip_to_content: "Skip to content",
      brand_home_aria: "SłodkoTu — home",
      nav_aria: "Main navigation",
      nav_about: "About",
      nav_services: "Services",
      nav_pricing: "Pricing",
      nav_gallery: "Gallery",
      nav_faq: "FAQ",
      nav_contact: "Contact",
      nav_book: "Book a visit",
      aria_lang_pick: "Language",
      aria_quick_contact: "Quick contact",
      aria_float_contact: "Quick contact",
      aria_wa: "WhatsApp",
      aria_phone: "Call",
      aria_ig: "Instagram",
      cookie_banner_aria: "Cookies and embedded content",
      cookie_essential: "Essential only",
      cookie_accept: "I accept",
      footer_privacy: "Privacy",
      footer_cookies: "Cookies",
      footer_terms: "Terms",
      footer_home: "Home",
      footer_pricing: "Pricing",
      wa_booking: "Hello, I'd like to book an appointment.",
      wa_booking_long: "Hello, I'd like to book a visit at SłodkoTu.",
      wa_cennik: "Hello, I'm asking about pricing and a time slot.",
      legal_privacy_h1: "Privacy policy",
      legal_cookies_h1: "Cookie policy",
      legal_terms_h1: "Terms of service",
      hero_aria_bg: "Studio mood — soft light, intimate treatment room",
      hero_kicker: "Beauty studio · Szczecin, Zdroje",
      hero_script_place: "Szczecin — Zdroje",
      hero_lead:
        "Smooth skin, a natural glow and calm time just for you. Sugar paste and spray tan tailored to your skin.",
      hero_cta_wa: "Book via WhatsApp",
      hero_cta_ig: "Instagram",
      about_sign: "You matter here",
      trust_title: "How people find us",
      trust_strip:
        "Most clients come from word of mouth or after a first hair removal elsewhere did not work out.",
      services_title: "Services",
      services_subtitle: "Two specialties — full attention to your skin.",
      service_sugar_title: "Sugar paste hair removal",
      service_sugar_text: "Warm paste and a calm pace — also for sensitive skin and bikini.",
      service_sugar_cta_html:
        'See more <span class="service-card__arrow" aria-hidden="true">→</span>',
      service_tan_title: "Spray tanning",
      service_tan_text: "Even, natural colour without sun — great before a wedding, shoot or simply for you.",
      service_tan_cta_html:
        'See more <span class="service-card__arrow" aria-hidden="true">→</span>',
      gallery_title: "Studio atmosphere",
      gallery_subtitle: "Warm light, a calm pace and care without rush.",
      gallery_note: "Soft light, calm and a moment just for you.",
      prep_title: "How to prepare for your visit?",
      prep_lead: "Short tips to make your treatment as comfortable as possible.",
      prep_sugar_h3: "Sugar hair removal",
      prep_tan_h3: "Spray tanning",
      prep_sugar_li1: "Clean skin, without heavy oils before the appointment.",
      prep_sugar_li2: "Hair length about 0.5 cm — ideal for paste work.",
      prep_sugar_li3: "Gentle exfoliation the day before (unless contraindicated).",
      prep_tan_li1: "Exfoliate 24 hours before the visit.",
      prep_tan_li2: "On the day, clean skin — no scented creams or deodorant on the area.",
      prep_tan_li3: "Loose, darker clothing after the session for comfort.",
      review_stars_aria: "Rating: 5 out of 5 stars",
      reviews_title: "Client reviews",
      reviews_subtitle: "Words from people who trusted us — quietly, without pushy ads.",
      faq_title: "Frequently asked questions",
      contact_title: "Get in touch",
      contact_subtitle: "Easiest on WhatsApp or phone.",
      contact_big_phone: "Phone",
      contact_big_wa: "WhatsApp",
      contact_big_ig: "Instagram",
      contact_map_zoom: "Larger map",
      cennik_back: "← Back to services",
      cennik_h1: "Pricing",
      price_from: "from … PLN",
      price_extra: "add-on … PLN",
      price_quote_ind: "individual quote",
    };

    en.hero_title =
      "Sugar paste hair removal<br />and spray tanning";
    en.hero_trust =
      "Booking in a few messages · easy reach from Gryfino, Chojna, Widuchowa, Banie and Stare Czarnowo";
    en.about_title = "A place where you can slow down";
    en.about_p1_html =
      'At <span class="brand-mark"><span class="brand-mark__slodko">Słodko</span><span class="brand-mark__tu">Tu</span></span> we focus on cleanliness and a calm rhythm. <strong>An intimate beauty studio in Zdroje</strong> — a quiet space designed for comfort, without “factory” pressure.';
    en.about_p2_html =
      "We perform sugar paste hair removal and spray tan with care for your skin. We welcome guests from <strong>Gryfino, Chojna, Widuchowa, Banie and Stare Czarnowo</strong>, from across Szczecin and nearby — e.g. Police or Goleniów.";
    en.review1_quote =
      "“Quiet, clean, no rush. Finally hair removal where I don’t tense up.”";
    en.review1_meta = "Anonymous guest · Zdroje";
    en.review2_quote =
      "“The spray tan looked natural in my wedding photos — exactly what I asked for.”";
    en.review2_meta = "Anonymous guest · Szczecin";
    en.review3_quote =
      "“With sensitive skin I finally found a method without irritation. I recommend the studio.”";
    en.review3_meta = "Anonymous guest · Gryfino";
    en.faq_q1 = "Does sugar paste hair removal hurt?";
    en.faq_a1 =
      "It often feels like a quick tug — many people find it gentler than wax. We adjust the pace to you.";
    en.faq_q2 = "How long does a spray tan last?";
    en.faq_a2 =
      "Usually about 5–10 days at full glow, depending on aftercare. We give tips so the colour fades evenly.";
    en.faq_q3 = "How should I prepare for a spray tan?";
    en.faq_a3 =
      "Exfoliate the day before; on the day, clean skin with no scented products on the area; wear loose, dark clothes after the visit.";
    en.faq_q4 = "How long does a spray tan visit take in Szczecin?";
    en.faq_a4 =
      "Usually about 20–40 minutes, depending on how many areas we cover. We’ll confirm when you book — no rush.";
    en.faq_q5 = "Is sugar paste suitable for sensitive skin?";
    en.faq_a5 =
      "Yes — the paste mainly coats the hair, not live skin like wax often does, which usually means less irritation.";
    en.faq_q6 = "Do you offer bikini sugar paste hair removal?";
    en.faq_a6 =
      "Yes — bikini with sugar paste is a standard service. We choose the technique for your skin; in Zdroje, Szczecin we prioritise discretion and calm.";
    en.faq_q7 = "Is the studio easy to reach from Gryfino or nearby?";
    en.faq_a7 =
      "Yes — the studio is in <strong>Zdroje, Szczecin</strong>. From Gryfino, Chojna or Widuchowa it’s usually a short drive; Banie and Stare Czarnowo are also convenient. Message us — we’ll help with directions.";
    en.faq_q8 = "Do you welcome clients from other districts and outside Szczecin?";
    en.faq_a8 =
      "Yes — we welcome guests from across Szczecin and the region. The Zdroje studio is intimate; we’ll find a convenient time via WhatsApp or phone.";
    en.contact_line1_html =
      '<span class="contact-aside__ic" aria-hidden="true">◎</span> Studio in Zdroje — Szczecin, West Pomerania';
    en.contact_line_ig_html =
      '<span class="contact-aside__ic" aria-hidden="true">@</span> <a href="https://instagram.com/" rel="noopener noreferrer">Instagram</a><span class="contact-aside__suffix"> · profile coming soon</span>';
    en.contact_hint =
      "Full address in Zdroje and directions are sent after you book.";
    en.contact_trust =
      "A short first message is enough to pick a time. We reply on WhatsApp and phone — no long forms.";
    en.contact_map_ph_html =
      'The neighbourhood map loads here after you choose <strong>I accept</strong> in the cookie notice (your browser then connects to OpenStreetMap — like opening a map site). <a href="https://www.openstreetmap.org/?mlat=53.4085&amp;mlon=14.5825#map=15/53.4085/14.5825" rel="noopener noreferrer">Open map in a new tab</a>.';
    en.footer_index_html =
      '<strong class="brand-mark"><span class="brand-mark__slodko">Słodko</span><span class="brand-mark__tu">Tu</span></strong> — beauty studio Szczecin Zdroje · <a href="cennik.html">Pricing</a> · sugar paste · spray tan';
    en.footer_cennik_html =
      '<strong class="brand-mark"><span class="brand-mark__slodko">Słodko</span><span class="brand-mark__tu">Tu</span></strong> — beauty studio Szczecin Zdroje · <a href="cennik.html">Pricing</a>';
    en.footer_sub_html =
      '<strong class="brand-mark"><span class="brand-mark__slodko">Słodko</span><span class="brand-mark__tu">Tu</span></strong> — beauty studio Szczecin Zdroje · <a href="index.html">Home</a> · <a href="cennik.html">Pricing</a>';
    en.footer_legal_short_html =
      '<strong class="brand-mark"><span class="brand-mark__slodko">Słodko</span><span class="brand-mark__tu">Tu</span></strong> · <a href="index.html">Home</a>';
    en.cookie_banner_html_index =
      'Google Fonts and the OpenStreetMap map load only after you choose <strong>I accept</strong>. <strong>Essential only</strong> keeps the page without those extras (you can still open the map in a separate tab from Contact). <a href="polityka-cookies.html">Cookie policy</a> · <a href="polityka-prywatnosci.html">Privacy</a>.';
    en.cookie_banner_html_cennik =
      'Google Fonts load after you choose <strong>I accept</strong>. <strong>Essential only</strong> uses system fonts. <a href="polityka-cookies.html">Cookies</a> · <a href="polityka-prywatnosci.html">Privacy</a>.';
    en.cookie_banner_html_short =
      'Google Fonts and the OSM map load after <strong>I accept</strong>. Details: <a href="polityka-cookies.html">cookie policy</a> and <a href="polityka-prywatnosci.html">privacy</a>.';
    en.cookie_banner_html_min =
      'Google Fonts and OSM map after <strong>I accept</strong>. <a href="polityka-cookies.html">Cookies</a> · <a href="polityka-prywatnosci.html">Privacy</a>';
    en.legal_privacy_meta_html =
      'Effective from <time datetime="2026-05-09">9 May 2026</time>. We keep it short and clear — if anything is unclear, write or call and we’ll explain.';
    en.legal_cookies_meta_html =
      'Short information for the <span class="brand-mark"><span class="brand-mark__slodko">Słodko</span><span class="brand-mark__tu">Tu</span></span> website. From <time datetime="2026-05-09">9 May 2026</time>.';
    en.legal_terms_meta_html =
      'Applies to beauty services at <span class="brand-mark"><span class="brand-mark__slodko">Słodko</span><span class="brand-mark__tu">Tu</span></span>. From <time datetime="2026-05-09">9 May 2026</time>. Draft text — align with your practice; consult a lawyer if in doubt.';
    en.cennik_subtitle =
      "First, a short explanation of the treatments — then boxes with guide prices and options. The final amount is agreed after consultation and area selection.";
    en.cennik_sugar_h2 = "Sugar paste hair removal";
    en.cennik_sugar_p1 =
      "Sugar paste hair removal uses a paste made from sugar, water and lemon juice — no resin or typical wax chemistry. The paste mainly coats the hair, not the skin, so the treatment is often less painful and gentler on sensitive skin.";
    en.cennik_sugar_p2 =
      "The paste works at a temperature close to body heat without “burning” the skin. It can remove shorter hair than wax (even about 3–5 mm, depending on the area). You can expect smoothness for several weeks and slower regrowth with regular visits.";
    en.price_sugar_basic_label = "Basic — single areas";
    en.price_sugar_basic_hint = "Guide price per area";
    en.price_sugar_pack_label = "Extended — packages";
    en.price_sugar_pack_hint = "Combining several areas in one visit";
    en.price_row_underarms = "Underarms";
    en.price_row_legs = "Lower legs / thighs (one section)";
    en.price_row_bikini_cl = "Classic bikini";
    en.price_row_bikini_deep = "Deep bikini";
    en.price_row_legs_full = "Full legs";
    en.price_row_combo1 = "Legs + classic bikini";
    en.price_row_combo2 = "Legs + deep bikini";
    en.price_row_pack_neck_down = "“Neck down” package (as agreed)";
    en.cennik_tan_h2 = "Spray tanning";
    en.cennik_tan_p1 =
      "Spray tanning applies a cosmetic with DHA to the skin — without UV. DHA reacts with the outer layer of the skin and develops a tan that sets over several to several hours after the visit.";
    en.cennik_tan_p2 =
      "We can choose a shade from very subtle to a stronger glow. Popular before weddings, shoots or holidays. After application, aftercare and first-shower tips matter — you’ll receive them at the visit.";
    en.price_tan_body_label = "Basic — body";
    en.price_tan_body_hint = "One depth level to choose";
    en.price_tan_extra_label = "Extended and add-ons";
    en.price_tan_extra_hint = "Deeper tone or extra areas";
    en.price_row_torso = "Application: torso + arms";
    en.price_row_body_no_face = "Application: full body (no face)";
    en.price_row_body_face = "Application: full body + face";
    en.price_row_tone_extra = "Darker / more intense tone";
    en.price_row_legs_only = "Legs only or arms only";
    en.price_row_contour = "Contour / glow (per studio offer)";
    en.price_row_trial = "Trial before an important event (separate visit)";
    en.cennik_note_html =
      '“From … PLN” amounts and add-ons are indicative — ask for the <strong>current price list</strong> when booking via WhatsApp or phone. You can list areas when you message us for a preliminary quote.';
    en.img_gallery_1 = "Studio interior — linen and soft light";
    en.img_gallery_2 = "Sugar paste and ceramics in the treatment room";
    en.img_gallery_3 = "Skin detail in natural light";
    en.img_gallery_4 = "Intimate studio — a calm moment before the treatment";
    en.img_gallery_5 = "Linen, towels and simple interior details";
    en.img_gallery_6 = "Even, natural tan matched to your skin";
    en.img_prep_left = "Sugar paste, linen and ceramics — preparation for the treatment";
    en.img_prep_right = "Fine mist and even glow after application";
    en.img_about_media = "SłodkoTu logo — studio photos coming soon";

    var de = {
      skip_to_content: "Zum Inhalt springen",
      brand_home_aria: "SłodkoTu — Startseite",
      nav_aria: "Hauptnavigation",
      nav_about: "Über uns",
      nav_services: "Leistungen",
      nav_pricing: "Preise",
      nav_gallery: "Galerie",
      nav_faq: "FAQ",
      nav_contact: "Kontakt",
      nav_book: "Termin buchen",
      aria_lang_pick: "Sprache",
      aria_quick_contact: "Schnellkontakt",
      aria_float_contact: "Schnellkontakt",
      aria_wa: "WhatsApp",
      aria_phone: "Anrufen",
      aria_ig: "Instagram",
      cookie_banner_aria: "Cookies und eingebettete Inhalte",
      cookie_essential: "Nur notwendige",
      cookie_accept: "Akzeptieren",
      footer_privacy: "Datenschutz",
      footer_cookies: "Cookies",
      footer_terms: "AGB",
      footer_home: "Startseite",
      footer_pricing: "Preise",
      wa_booking: "Guten Tag, ich möchte einen Termin buchen.",
      wa_booking_long: "Guten Tag, ich möchte einen Termin bei SłodkoTu buchen.",
      wa_cennik: "Guten Tag, ich möchte Preise und einen Termin erfragen.",
      legal_privacy_h1: "Datenschutzerklärung",
      legal_cookies_h1: "Cookie-Richtlinie",
      legal_terms_h1: "Leistungsbedingungen",
      hero_aria_bg: "Studio-Stimmung — weiches Licht, ruhiger Behandlungsraum",
      hero_kicker: "Beauty-Studio · Stettin, Zdroje",
      hero_script_place: "Stettin — Zdroje",
      hero_lead:
        "Glatte Haut, natürlicher Glow und ruhige Zeit nur für Sie. Zuckerpaste und Spray-Tan, abgestimmt auf Ihre Haut.",
      hero_cta_wa: "Über WhatsApp buchen",
      hero_cta_ig: "Instagram",
      about_sign: "Hier sind Sie wichtig",
      trust_title: "Wie Sie uns finden",
      trust_strip:
        "Die meisten Kundinnen kommen über Empfehlung oder nach einer ersten, weniger gelungenen Enthaarung woanders.",
      services_title: "Leistungen",
      services_subtitle: "Zwei Schwerpunkte — volle Aufmerksamkeit für Ihre Haut.",
      service_sugar_title: "Haarentfernung mit Zuckerpaste",
      service_sugar_text: "Warme Paste und ruhiges Tempo — auch bei empfindlicher Haut und Bikini.",
      service_sugar_cta_html:
        'Mehr erfahren <span class="service-card__arrow" aria-hidden="true">→</span>',
      service_tan_title: "Spray-Tan",
      service_tan_text:
        "Gleichmäßiger, natürlicher Farbton ohne Sonne — ideal vor Hochzeit, Shooting oder einfach für Sie.",
      service_tan_cta_html:
        'Mehr erfahren <span class="service-card__arrow" aria-hidden="true">→</span>',
      gallery_title: "Studio-Atmosphäre",
      gallery_subtitle: "Warmes Licht, ruhiges Tempo und Pflege ohne Hetze.",
      gallery_note: "Weiches Licht, Ruhe und ein Moment nur für sich.",
      prep_title: "Wie bereite ich den Besuch vor?",
      prep_lead: "Kurze Tipps, damit die Behandlung für Sie möglichst angenehm ist.",
      prep_sugar_h3: "Zuckerpaste",
      prep_tan_h3: "Spray-Tan",
      prep_sugar_li1: "Haut sauber, ohne starke Öle vor der Behandlung.",
      prep_sugar_li2: "Haarlänge ca. 0,5 cm — ideal für die Paste.",
      prep_sugar_li3: "Am Tag davor sanftes Peeling (sofern keine Kontraindikation).",
      prep_tan_li1: "Peeling 24 Stunden vor dem Termin.",
      prep_tan_li2: "Am Behandlungstag „auf Null“ — ohne parfümierte Cremes/Deo auf der Zone.",
      prep_tan_li3: "Danach lockere, dunklere Kleidung — angenehmer nach der Anwendung.",
      review_stars_aria: "Bewertung: 5 von 5 Sternen",
      reviews_title: "Stimmen von Kundinnen",
      reviews_subtitle: "Worte von Menschen, die uns vertraut haben — ohne aufdringliche Werbung.",
      faq_title: "Häufige Fragen",
      contact_title: "Kontakt",
      contact_subtitle: "Am einfachsten per WhatsApp oder Telefon.",
      contact_big_phone: "Telefon",
      contact_big_wa: "WhatsApp",
      contact_big_ig: "Instagram",
      contact_map_zoom: "Karte vergrößern",
      cennik_back: "← Zurück zu den Leistungen",
      cennik_h1: "Preise",
      price_from: "ab … PLN",
      price_extra: "Aufpreis … PLN",
      price_quote_ind: "individuelles Angebot",
    };

    de.hero_title =
      "Haarentfernung mit Zuckerpaste<br />und Spray-Tanning";
    de.hero_trust =
      "Termin in wenigen Nachrichten · gut erreichbar aus Gryfino, Chojna, Widuchowa, Banie und Stare Czarnowo";
    de.about_title = "Ein Ort, an dem Sie Tempo rausnehmen können";
    de.about_p1_html =
      'Bei <span class="brand-mark"><span class="brand-mark__slodko">Słodko</span><span class="brand-mark__tu">Tu</span></span> legen wir Wert auf Sauberkeit und einen ruhigen Ablauf. <strong>Kleines Beauty-Studio in Zdroje</strong> — ein ruhiger Ort mit Fokus auf Komfort, ohne „Fabrik“-Druck.';
    de.about_p2_html =
      "Haarentfernung mit Zuckerpaste und Spray-Tan machen wir mit Blick auf Ihre Haut. Willkommen aus <strong>Gryfino, Chojna, Widuchowa, Banie und Stare Czarnowo</strong>, aus ganz Stettin und der Umgebung — z. B. Police oder Goleniów.";
    de.review1_quote =
      "„Ruhig, sauber, ohne Hetze. Endlich Enthaarung, bei der ich mich nicht anspanne.“";
    de.review1_meta = "Anonyme Kundin · Zdroje";
    de.review2_quote =
      "„Der Spray-Tan wirkte auf den Hochzeitsfotos natürlich — genau so wollte ich es.“";
    de.review2_meta = "Anonyme Kundin · Stettin";
    de.review3_quote =
      "„Bei empfindlicher Haut endlich eine Methode ohne Reizungen. Studio empfehle ich gern.“";
    de.review3_meta = "Anonyme Kundin · Gryfino";
    de.faq_q1 = "Tut Haarentfernung mit Zuckerpaste weh?";
    de.faq_a1 =
      "Es fühlt sich oft wie ein kurzer Ruck an — vielen ist es angenehmer als Wachs. Wir passen das Tempo an Sie an.";
    de.faq_q2 = "Wie lange hält ein Spray-Tan?";
    de.faq_a2 =
      "Meist etwa 5–10 Tage voller Glanz, je nach Pflege. Sie bekommen Tipps, damit die Farbe gleichmäßig ausklingt.";
    de.faq_q3 = "Wie bereite ich mich auf Spray-Tan vor?";
    de.faq_a3 =
      "Peeling am Vortag; am Tag selbst saubere Haut ohne parfümierte Produkte auf der Zone; danach lockere, dunklere Kleidung.";
    de.faq_q4 = "Wie lange dauert ein Spray-Tan-Termin in Stettin?";
    de.faq_a4 =
      "In der Regel ca. 20–40 Minuten, je nach Flächen. Genaueres nennen wir bei der Buchung — ohne Hetze.";
    de.faq_q5 = "Ist Zuckerpaste für empfindliche Haut geeignet?";
    de.faq_a5 =
      "Ja — die Paste umfasst vor allem das Haar, nicht so stark die lebende Haut wie Wachs, oft mit weniger Reizungen.";
    de.faq_q6 = "Machen Sie Bikini mit Zuckerpaste?";
    de.faq_a6 =
      "Ja — Bikini mit Zuckerpaste ist Standard. Technik passen wir der Haut an; in Zdroje, Stettin, achten wir auf Diskretion und Ruhe.";
    de.faq_q7 = "Ist das Studio von Gryfino oder aus der Nähe gut erreichbar?";
    de.faq_a7 =
      "Ja — das Studio liegt in <strong>Zdroje, Stettin</strong>. Von Gryfino, Chojna oder Widuchowa ist es meist kurz; auch von Banie oder Stare Czarnowo gut. Schreiben Sie uns — wir helfen mit der Route.";
    de.faq_q8 = "Nehmen Sie Kundinnen aus anderen Stadtteilen und von außerhalb Stettins?";
    de.faq_a8 =
      "Ja — willkommen aus ganz Stettin und der Region. Das Studio in Zdroje ist klein; wir finden einen passenden Termin per WhatsApp oder Telefon.";
    de.contact_line1_html =
      '<span class="contact-aside__ic" aria-hidden="true">◎</span> Studio in Zdroje — Stettin, Woiwodschaft Westpommern';
    de.contact_line_ig_html =
      '<span class="contact-aside__ic" aria-hidden="true">@</span> <a href="https://instagram.com/" rel="noopener noreferrer">Instagram</a><span class="contact-aside__suffix"> · Profil folgt</span>';
    de.contact_hint =
      "Vollständige Adresse in Zdroje und Wegbeschreibung senden wir nach der Terminbuchung.";
    de.contact_trust =
      "Eine kurze erste Nachricht reicht für die Terminwahl. Wir antworten per WhatsApp und Telefon — ohne langes Formular.";
    de.contact_map_ph_html =
      'Die Karte der Umgebung lädt hier nach <strong>Akzeptieren</strong> im Cookie-Hinweis (Verbindung zu OpenStreetMap — wie beim Öffnen einer Karten-Website). <a href="https://www.openstreetmap.org/?mlat=53.4085&amp;mlon=14.5825#map=15/53.4085/14.5825" rel="noopener noreferrer">Karte in neuem Tab öffnen</a>.';
    de.footer_index_html =
      '<strong class="brand-mark"><span class="brand-mark__slodko">Słodko</span><span class="brand-mark__tu">Tu</span></strong> — Beauty-Studio Stettin Zdroje · <a href="cennik.html">Preise</a> · Zuckerpaste · Spray-Tan';
    de.footer_cennik_html =
      '<strong class="brand-mark"><span class="brand-mark__slodko">Słodko</span><span class="brand-mark__tu">Tu</span></strong> — Beauty-Studio Stettin Zdroje · <a href="cennik.html">Preise</a>';
    de.footer_sub_html =
      '<strong class="brand-mark"><span class="brand-mark__slodko">Słodko</span><span class="brand-mark__tu">Tu</span></strong> — Beauty-Studio Stettin Zdroje · <a href="index.html">Startseite</a> · <a href="cennik.html">Preise</a>';
    de.footer_legal_short_html =
      '<strong class="brand-mark"><span class="brand-mark__slodko">Słodko</span><span class="brand-mark__tu">Tu</span></strong> · <a href="index.html">Startseite</a>';
    de.cookie_banner_html_index =
      'Google Fonts und die OpenStreetMap-Karte laden erst nach <strong>Akzeptieren</strong>. <strong>Nur notwendige</strong> lässt die Seite ohne diese Elemente (Karte trotzdem im Kontakt per neuem Tab). <a href="polityka-cookies.html">Cookie-Richtlinie</a> · <a href="polityka-prywatnosci.html">Datenschutz</a>.';
    de.cookie_banner_html_cennik =
      'Google Fonts laden nach <strong>Akzeptieren</strong>. <strong>Nur notwendige</strong> nutzt Systemschriften. <a href="polityka-cookies.html">Cookies</a> · <a href="polityka-prywatnosci.html">Datenschutz</a>.';
    de.cookie_banner_html_short =
      'Google Fonts und OSM-Karte nach <strong>Akzeptieren</strong>. Details: <a href="polityka-cookies.html">Cookie-Richtlinie</a> und <a href="polityka-prywatnosci.html">Datenschutz</a>.';
    de.cookie_banner_html_min =
      'Google Fonts und OSM-Karte nach <strong>Akzeptieren</strong>. <a href="polityka-cookies.html">Cookies</a> · <a href="polityka-prywatnosci.html">Datenschutz</a>';
    de.legal_privacy_meta_html =
      'Gültig ab <time datetime="2026-05-09">9. Mai 2026</time>. Kurz und verständlich — bei Fragen schreiben oder anrufen, wir erklären es gern.';
    de.legal_cookies_meta_html =
      'Kurzbeschreibung für die Website <span class="brand-mark"><span class="brand-mark__slodko">Słodko</span><span class="brand-mark__tu">Tu</span></span>. Ab <time datetime="2026-05-09">9. Mai 2026</time>.';
    de.legal_terms_meta_html =
      'Gilt für Beauty-Leistungen im Studio <span class="brand-mark"><span class="brand-mark__slodko">Słodko</span><span class="brand-mark__tu">Tu</span></span>. Ab <time datetime="2026-05-09">9. Mai 2026</time>. Entwurf — an Ihre Praxis anpassen; bei Zweifeln juristisch prüfen.';
    de.cennik_subtitle =
      "Zuerst kurz, worum es bei den Behandlungen geht — dann Kästen mit Richtpreisen und Varianten. Den Endpreis vereinbaren wir nach Beratung und Zonenauswahl.";
    de.cennik_sugar_h2 = "Haarentfernung mit Zuckerpaste";
    de.cennik_sugar_p1 =
      "Zuckerpaste entfernt Haare mit Paste aus Zucker, Wasser und Zitronensaft — ohne Harz und typische Wachs-Chemie. Die Paste liegt vor allem am Haar, nicht an der Haut, daher oft weniger schmerzhaft und sanfter bei empfindlicher Haut.";
    de.cennik_sugar_p2 =
      "Die Paste arbeitet nahe Körpertemperatur ohne „Versengen“ der Haut. Auch kürzere Haare als beim Wachs sind möglich (ca. 3–5 mm, je nach Zone). Ergebnis: Glätte für mehrere Wochen und langsameres Nachwachsen bei regelmäßigen Terminen.";
    de.price_sugar_basic_label = "Basis — einzelne Zonen";
    de.price_sugar_basic_hint = "Richtpreis pro Zone";
    de.price_sugar_pack_label = "Erweitert — Pakete";
    de.price_sugar_pack_hint = "Mehrere Zonen in einem Besuch";
    de.price_row_underarms = "Achseln";
    de.price_row_legs = "Unterschenkel / Oberschenkel (ein Bereich)";
    de.price_row_bikini_cl = "Klassischer Bikini";
    de.price_row_bikini_deep = "Tiefer Bikini";
    de.price_row_legs_full = "Beine komplett";
    de.price_row_combo1 = "Beine + klassischer Bikini";
    de.price_row_combo2 = "Beine + tiefer Bikini";
    de.price_row_pack_neck_down = "Paket „von Hals abwärts“ (nach Absprache)";
    de.cennik_tan_h2 = "Spray-Tanning";
    de.cennik_tan_p1 =
      "Spray-Tanning (Spray Tan) bringt ein kosmetisches Produkt mit DHA auf die Haut — ohne UV. DHA reagiert mit der Hornschicht und entwickelt einen Bräunungston in den Stunden nach dem Besuch.";
    de.cennik_tan_p2 =
      "Der Ton reicht von sehr dezent bis kräftiger Glow — oft vor Hochzeit, Shooting oder Urlaub. Danach sind Pflegehinweise und erste Dusche wichtig — erhalten Sie beim Termin.";
    de.price_tan_body_label = "Basis — Körper";
    de.price_tan_body_hint = "Eine Farbtiefe zur Wahl";
    de.price_tan_extra_label = "Erweitert und Zusätze";
    de.price_tan_extra_hint = "Intensiverer Ton oder Extra-Zonen";
    de.price_row_torso = "Anwendung: Torso + Arme";
    de.price_row_body_no_face = "Anwendung: ganzer Körper (ohne Gesicht)";
    de.price_row_body_face = "Anwendung: ganzer Körper + Gesicht";
    de.price_row_tone_extra = "Dunklerer / intensiverer Ton";
    de.price_row_legs_only = "Nur Beine oder nur Arme";
    de.price_row_contour = "Kontur / Glow (laut Studio-Angebot)";
    de.price_row_trial = "Probe vor wichtigem Anlass (separater Termin)";
    de.cennik_note_html =
      'Beträge „ab … PLN“ und Aufpreise sind Richtwerte — den <strong>aktuellen Preis</strong> erfragen Sie bei Buchung per WhatsApp oder Telefon. Nennen Sie gern Zonen — wir schätzen vorab ein.';
    de.img_gallery_1 = "Studio-Innenraum — Leinen und weiches Licht";
    de.img_gallery_2 = "Zuckerpaste und Keramik im Behandlungsraum";
    de.img_gallery_3 = "Hautdetail im natürlichen Licht";
    de.img_gallery_4 = "Kleines Studio — ruhiger Moment vor der Behandlung";
    de.img_gallery_5 = "Leinen, Handtücher und schlichte Details";
    de.img_gallery_6 = "Gleichmäßiger, natürlicher Ton passend zur Haut";
    de.img_prep_left = "Zuckerpaste, Leinen und Keramik — Vorbereitung";
    de.img_prep_right = "Feiner Nebel und gleichmäßiger Glow nach der Anwendung";
    de.img_about_media = "Logo SłodkoTu — Studiofotos folgen";

    M.en = en;
    M.de = de;
  }

  mergeMessages();

  function init() {
    cacheStaticMeta();
    cacheTextBases();
    var raw = null;
    try {
      raw = new URLSearchParams(window.location.search).get("lang");
    } catch (e) {}
    var lang = getLang();
    if ((raw !== "en" && raw !== "de" && raw !== "pl") && (lang === "en" || lang === "de")) {
      try {
        var u = new URL(window.location.href);
        u.searchParams.set("lang", lang);
        window.history.replaceState({}, "", u.pathname + u.search + u.hash);
      } catch (e2) {}
    }
    apply(lang);
    wireLangSwitch();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }

  window.SlodkoTuI18n = { getLang: getLang, setLang: setLang, apply: apply };
})();
