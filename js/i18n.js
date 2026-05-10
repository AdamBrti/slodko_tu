/**
 * UI language: PL (default HTML), EN, DE. Preference: localStorage + ?lang= in URL.
 * Requires js/legal-i18n.js before this file for legal page bodies.
 */
(function () {
  "use strict";

  function waDigits() {
    try {
      var c = window.SLODKOTU_SITE;
      if (c && c.phoneWaDigits) return String(c.phoneWaDigits).replace(/\D/g, "");
    } catch (e) {}
    return "48796579332";
  }

  var LANG_KEY = "slodkotu-lang";

  var PAGE_META = {
    index: {
      en: {
        title: "SłodkoTu — sugar hair removal & spray tan Szczecin-Zdroje | beauty studio",
        description:
          "Sugar paste and spray tan in Zdroje, Szczecin. Smooth skin, natural glow, book via WhatsApp — easy from Gryfino and nearby.",
      },
      de: {
        title: "SłodkoTu — Zuckerpaste & Spray-Tan Stettin-Zdroje | Beauty-Studio",
        description:
          "Haarentfernung mit Zuckerpaste und Spray-Tan in Zdroje, Stettin. Natürlicher Glow, Termin per WhatsApp — gut erreichbar aus Gryfino und Umgebung.",
      },
    },
    cennik: {
      en: {
        title: "Guide prices — SłodkoTu | sugar paste and spray tan Szczecin Zdroje",
        description:
          "A short overview of popular treatments at SłodkoTu in Zdroje. Full pricing is agreed individually when you get in touch.",
      },
      de: {
        title: "Orientierungspreise — SłodkoTu | Zuckerpaste und Spray-Tan Stettin Zdroje",
        description:
          "Kurzer Überblick über häufige Leistungen bei SłodkoTu in Zdroje. Den vollständigen Preis klären wir individuell im Kontakt.",
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
      if (msg) el.setAttribute("href", "https://wa.me/" + waDigits() + "?text=" + encodeURIComponent(msg));
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
      aria_wa_primary: "Book a visit — WhatsApp",
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
      hero_kicker: "Beauty studio · Szczecin-Zdroje",
      hero_lead: "Sugar paste and spray tan — calm visits, with real care for your skin.",
      hero_cta_wa: "Book via WhatsApp",
      hero_cta_ig: "Instagram",
      about_sign: "You matter here",
      trust_title: "How people find us",
      trust_strip:
        "Most clients come from word of mouth or after a first hair removal elsewhere did not work out.",
      services_title: "Sugar hair removal & spray tan — Szczecin",
      services_subtitle: "Choose a visit that leaves your skin smooth, even and confident.",
      service_sugar_title: "Sugar paste hair removal",
      service_sugar_text: "A gentler alternative to wax — great for underarms, legs and bikini, including sensitive skin.",
      service_sugar_cta_html:
        'Guide prices — sugar paste <span class="service-card__arrow" aria-hidden="true">→</span>',
      service_tan_title: "Spray tanning",
      service_tan_text: "A natural sun-kissed look without UV — weddings, shoots, holidays or an everyday fresh glow.",
      service_tan_cta_html:
        'Spray tan — guide prices <span class="service-card__arrow" aria-hidden="true">→</span>',
      gallery_title: "Studio atmosphere",
      gallery_subtitle: "Warm light and a clean space — so you can really switch off.",
      gallery_note: "Linen, ceramics and soft light — one calm visual story.",
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
      reviews_subtitle: "Short voices after visits — no hype.",
      faq_title: "Frequently asked questions",
      contact_title: "Book a visit",
      contact_subtitle: "WhatsApp or phone — no long forms.",
      contact_big_phone: "Phone",
      contact_big_wa: "WhatsApp",
      contact_big_ig: "Instagram",
      contact_map_zoom: "Larger map",
      cennik_back: "← Back to services",
      cennik_h1: "Guide prices",
      price_from: "from … PLN",
      price_extra: "add-on … PLN",
      price_quote_ind: "Individual pricing",
      wa_booking_short: "Hello — this is my first message.",
      wa_skin: "Hello — I’d like help choosing a treatment for my skin.",
      wa_directions: "Hello — asking for directions to the studio.",
      wa_faq: "I have a question after reading the FAQ — writing from the SłodkoTu website.",
      hero_cta_pricing: "See pricing",
      hero_trust_row_aria: "At a glance",
      hero_trust_1: "Szczecin-Zdroje",
      hero_trust_2: "Quick replies",
      hero_trust_3: "Easy from Gryfino & nearby",
      trust_badges_title: "First things first",
      trust_badge_1: "Intimate studio in Zdroje",
      trust_badge_2: "Sensitive skin — gentle method",
      trust_badge_3: "Book via WhatsApp",
      trust_badge_4: "Convenient from Gryfino & the area",
      cta_band_services_h: "Book a visit",
      cta_band_services_p:
        "Want to choose areas or ask about availability? Message us — we reply clearly and to the point.",
      cta_band_services_btn: "Ask about a slot",
      process_title: "What does the first visit look like?",
      process_step1_title: "You message on WhatsApp",
      process_step1_text: "A short note is enough — we’ll agree time and scope.",
      process_step2_title: "We match the service to your skin",
      process_step2_text: "If needed, we advise on zones and prep.",
      process_step3_title: "You come for your appointment",
      process_step3_text: "No unnecessary paperwork — focus on results and comfort.",
      process_cta_btn: "Send the first message",
      why_title: "Why sugar paste and spray tan?",
      why_sugar_h3: "Sugar hair removal",
      why_sugar_p:
        "The paste works mainly on the hair, not pulling live skin like wax often does — usually less irritation, a comfortable option for bikini and sensitive skin.",
      why_tan_h3: "Spray tanning",
      why_tan_p:
        "DHA gives an even, natural tone without sunbeds. We adjust the shade to your complexion — fresh-looking skin without excess.",
      local_title: "Beauty studio in Zdroje — travel from Gryfino & nearby",
      local_p_html:
        "We’re in <strong>Zdroje, Szczecin</strong> — easy to reach from the right bank, <strong>Gryfino, Chojna, Widuchowa, Banie and Stare Czarnowo</strong>. After booking we send precise directions.",
      local_cta: "Ask about directions",
      reviews_cta_btn: "Match the service to your skin",
      review1_tag: "After sugar bikini",
      review2_tag: "Spray tan before wedding",
      review3_tag: "Sensitive skin — legs & underarms",
      faq_cta_btn: "I have a question — WhatsApp",
      cta_band_final_h: "Book a visit",
      cta_band_final_lead: "Want to choose a service or ask about a slot?",
      cta_band_final_p: "Send a short message — we’ll answer clearly and help plan your visit.",
      cta_band_final_btn: "Book via WhatsApp",
      float_dock_wa: "Book a visit — WhatsApp",
      contact_ig_link: "Instagram",
    };

    en.hero_kicker = "Beauty studio · Szczecin-Zdroje";
    en.hero_title = "Sugar paste & spray tan<br />in an intimate beauty studio";
    en.hero_lead =
      "Smooth skin, a natural glow and zero pressure — thoughtful comfort in our Zdroje studio.";
    en.hero_cta_wa = "Book via WhatsApp";
    en.about_title = "SłodkoTu — studio in Zdroje";
    en.about_p1_html =
      'At <span class="brand-mark"><span class="brand-mark__slodko">Słodko</span><span class="brand-mark__tu">Tu</span></span> we focus on two things: <strong>sugar hair removal</strong> and <strong>spray tan</strong>. Cleanliness, discretion and a pace that suits you — without a “factory” rush.';
    en.review1_quote =
      "“Quiet, clean, no rush. Finally hair removal where I don’t tense up.”";
    en.review1_meta = "Kasia · <span>Szczecin-Zdroje</span>";
    en.review2_quote =
      "“The colour looked natural in my wedding photos — exactly what I asked for.”";
    en.review2_meta = "Marta · <span>Szczecin</span>";
    en.review3_quote =
      "“With my skin this is finally a method without irritation. I keep coming back.”";
    en.review3_meta = "Ania · <span>Gryfino</span>";
    en.faq_q1 = "Does sugar hair removal hurt?";
    en.faq_a1 =
      "It can feel like a quick tug — many people find it lighter than wax. We match the pace to you.";
    en.faq_q2 = "Is sugar paste good for sensitive skin?";
    en.faq_a2 =
      "Yes — the paste works mainly on the hair, not as aggressively on live skin as wax, so there’s often less irritation. Bikini and underarms are routine for us.";
    en.faq_q3 = "How should I prepare for sugar hair removal?";
    en.faq_a3 =
      "Clean skin, no heavy oils; hair about 0.5 cm; gentle exfoliation the day before if you can.";
    en.faq_q4 = "How long does a spray tan last?";
    en.faq_a4 =
      "Usually around 5–10 days of nice glow, depending on aftercare. We share tips so it fades evenly.";
    en.faq_q5 = "How should I prepare for spray tanning?";
    en.faq_a5 =
      "Exfoliate the day before; on the day, clean skin with no scented products on the area; loose, darker clothes after the visit.";
    en.faq_q6 = "How do I book?";
    en.faq_a6 =
      "WhatsApp or phone — we confirm the time and send directions to Zdroje if needed.";
    en.contact_line1_html =
      '<span class="contact-aside__ic" aria-hidden="true">◎</span> Studio in Zdroje — Szczecin, West Pomerania';
    en.contact_line_ig_html =
      '<span class="contact-aside__ic" aria-hidden="true">@</span> <a href="https://instagram.com/" rel="noopener noreferrer">Instagram</a>';
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
      'Applies to beauty services at <span class="brand-mark"><span class="brand-mark__slodko">Słodko</span><span class="brand-mark__tu">Tu</span></span>. Effective <time datetime="2026-05-09">9 May 2026</time>.';
    en.cennik_subtitle =
      "A calm overview of our most booked visits — no endless tables. Full pricing and the final amount are agreed individually when you message or call.";
    en.cennik_sugar_h2 = "Sugar paste hair removal";
    en.cennik_sugar_p1 =
      "Warm sugar-and-lemon paste — gentler than wax, often kinder to sensitive skin and bikini areas. Expect smooth skin for weeks and calmer regrowth with regular appointments.";
    en.price_sugar_basic_label = "Most chosen areas";
    en.price_sugar_basic_hint = "Sample brackets — exact quote after we plan zones together";
    en.price_sugar_pack_label = "Most chosen packages";
    en.price_sugar_pack_hint = "One visit, several areas — unhurried pace";
    en.price_row_underarms = "Underarms";
    en.price_row_legs = "Lower legs / thighs";
    en.price_row_bikini_cl = "Classic bikini";
    en.price_row_bikini_deep = "Deep bikini";
    en.price_row_legs_full = "Full legs";
    en.price_row_combo1 = "Legs + classic bikini";
    en.price_row_combo2 = "Legs + deep bikini";
    en.price_row_pack_neck_down = "“Neck down” package";
    en.price_amt_pachy = "from 50 PLN";
    en.price_amt_lydki = "from 90 PLN";
    en.price_amt_bikini_cl = "from 100 PLN";
    en.price_amt_bikini_deep = "from 140 PLN";
    en.price_amt_legs_full = "from 150 PLN";
    en.price_amt_combo1 = "from 220 PLN";
    en.price_amt_combo2 = "from 270 PLN";
    en.cennik_tan_h2 = "Spray tanning";
    en.cennik_tan_p1 =
      "DHA spray tan without UV, with a natural glow. We match the tone to your skin — popular before weddings, shoots or holidays. Short aftercare tips are given at your visit.";
    en.price_tan_overview_label = "Popular applications";
    en.price_tan_overview_hint = "Indicative — full scope agreed when you book";
    en.price_row_torso = "Torso + arms";
    en.price_row_body_no_face = "Full body (no face)";
    en.price_row_body_face = "Full body + face";
    en.price_amt_tan_torso = "from 110 PLN";
    en.price_amt_tan_body = "from 170 PLN";
    en.price_amt_tan_full = "from 210 PLN";
    en.cennik_note_html =
      'The amounts above are indicative. <strong>Full pricing and the right package for you</strong> are agreed individually when you get in touch — message on WhatsApp or call and we’ll prepare a preliminary quote after a short chat.';
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
      aria_wa_primary: "Termin buchen — WhatsApp",
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
      wa_booking_short: "Guten Tag — erste Nachricht.",
      wa_skin: "Guten Tag — ich möchte Hilfe bei der Auswahl einer Behandlung für meine Haut.",
      wa_directions: "Guten Tag — ich frage nach der Anfahrt zum Studio.",
      wa_faq: "Ich habe eine Frage nach dem FAQ — Nachricht von der SłodkoTu-Website.",
      legal_privacy_h1: "Datenschutzerklärung",
      legal_cookies_h1: "Cookie-Richtlinie",
      legal_terms_h1: "Leistungsbedingungen",
      hero_aria_bg: "SłodkoTu-Atmosphäre — weiches Licht, natürliches Ambiente",
      hero_kicker: "Beauty-Studio · Stettin-Zdroje",
      hero_lead:
        "Glatte Haut, natürlicher Glow — ruhige Termine im kleinen Studio in Zdroje.",
      hero_cta_wa: "Über WhatsApp buchen",
      hero_cta_pricing: "Preise ansehen",
      hero_trust_row_aria: "Kurz & klar",
      hero_trust_1: "Stettin-Zdroje",
      hero_trust_2: "Schnelle Antworten",
      hero_trust_3: "Gut erreichbar aus Gryfino & Umgebung",
      hero_cta_ig: "Instagram",
      about_sign: "Hier sind Sie wichtig",
      trust_badges_title: "Zum Start",
      trust_badge_1: "Kleines Studio in Zdroje",
      trust_badge_2: "Empfindliche Haut — sanfte Methode",
      trust_badge_3: "Termin per WhatsApp",
      trust_badge_4: "Gut erreichbar aus Gryfino & Umgebung",
      services_title: "Haarentfernung mit Zuckerpaste & Spray-Tan — Stettin",
      services_subtitle:
        "Wählen Sie eine Behandlung, nach der Sie sich leicht, glatt und sicher fühlen.",
      service_sugar_title: "Haarentfernung mit Zuckerpaste",
      service_sugar_text:
        "Sanftere Alternative zu Wachs — ideal für Achseln, Beine und Bikini, auch bei empfindlicher Haut.",
      service_sugar_cta_html:
        'Orientierungspreise — Zuckerpaste <span class="service-card__arrow" aria-hidden="true">→</span>',
      service_tan_title: "Spray-Tan",
      service_tan_text:
        "Natürlicher Bräunungseffekt ohne UV — vor Hochzeit, Shooting, Urlaub oder einfach für einen frischen Look ohne Sonne.",
      service_tan_cta_html:
        'Spray-Tan — Preise <span class="service-card__arrow" aria-hidden="true">→</span>',
      cta_band_services_h: "Termin buchen",
      cta_band_services_p:
        "Zonen wählen oder nach freiem Termin fragen? Schreiben Sie — wir antworten kurz und konkret.",
      cta_band_services_btn: "Nach freiem Termin fragen",
      process_title: "Wie läuft der erste Besuch?",
      process_step1_title: "Sie schreiben per WhatsApp",
      process_step1_text: "Eine kurze Nachricht reicht — wir klären Zeit und Umfang.",
      process_step2_title: "Wir passen die Behandlung an Ihre Haut an",
      process_step2_text: "Bei Bedarf beraten wir zu Zonen und Vorbereitung.",
      process_step3_title: "Sie kommen zum Termin",
      process_step3_text: "Ohne unnötigen Papierkram — Fokus auf Ergebnis und Komfort.",
      process_cta_btn: "Erste Nachricht senden",
      why_title: "Warum Zuckerpaste und Spray-Tan?",
      why_sugar_h3: "Haarentfernung mit Zuckerpaste",
      why_sugar_p:
        "Die Paste arbeitet vor allem am Haar, nicht so stark an lebender Haut wie Wachs — oft weniger Reizungen, angenehm für Bikini und empfindliche Haut.",
      why_tan_h3: "Spray-Tan",
      why_tan_p:
        "DHA sorgt für einen natürlichen, gleichmäßigen Ton ohne Solarium. Wir passen den Farbton an Ihren Hauttyp an — frisch, ohne Übertreibung.",
      gallery_title: "Studio-Atmosphäre",
      gallery_subtitle: "Warmes Licht, sauberer Raum — damit Sie wirklich abschalten können.",
      gallery_note: "Leinen, Keramik, weiches Licht — eine ruhige, stimmige Bildsprache.",
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
      reviews_subtitle: "Kurze Stimmen nach dem Besuch — ohne Übertreibung.",
      review1_tag: "Nach Zuckerpaste — Bikini",
      review2_tag: "Spray-Tan vor der Hochzeit",
      review3_tag: "Empfindliche Haut — Beine & Achseln",
      reviews_cta_btn: "Behandlung an die Haut anpassen",
      local_title: "Beauty-Studio in Zdroje — Anfahrt aus Gryfino & Umgebung",
      local_p_html:
        "Wir sind in <strong>Zdroje, Stettin</strong> — gut erreichbar vom rechten Ufer, aus <strong>Gryfino, Chojna, Widuchowa, Banie und Stare Czarnowo</strong>. Nach der Buchung senden wir genaue Wegbeschreibung.",
      local_cta: "Nach Anfahrt fragen",
      faq_title: "Häufige Fragen",
      faq_cta_btn: "Ich habe eine Frage — WhatsApp",
      cta_band_final_h: "Termin buchen",
      cta_band_final_lead: "Behandlung wählen oder nach Termin fragen?",
      cta_band_final_p:
        "Schicken Sie eine kurze Nachricht — wir antworten konkret und helfen beim Planen.",
      cta_band_final_btn: "Über WhatsApp buchen",
      float_dock_wa: "Termin buchen — WhatsApp",
      contact_ig_link: "Instagram",
      contact_title: "Termin buchen",
      contact_subtitle: "WhatsApp oder Telefon — ohne lange Formulare.",
      contact_big_phone: "Telefon",
      contact_big_wa: "WhatsApp",
      contact_big_ig: "Instagram",
      contact_map_zoom: "Karte vergrößern",
      cennik_back: "← Zurück zu den Leistungen",
      cennik_h1: "Orientierungspreise",
      price_from: "ab … PLN",
      price_extra: "Aufpreis … PLN",
      price_quote_ind: "Individuelle Preisierung",
    };

    de.hero_title =
      "Haarentfernung mit Zuckerpaste & Spray-Tan<br />in einem kleinen Beauty-Studio";
    de.about_title = "SłodkoTu — Studio in Zdroje";
    de.about_p1_html =
      'Bei <span class="brand-mark"><span class="brand-mark__slodko">Słodko</span><span class="brand-mark__tu">Tu</span></span> stehen zwei Schwerpunkte im Mittelpunkt: <strong>Haarentfernung mit Zuckerpaste</strong> und <strong>Spray-Tan</strong>. Sauberkeit, Diskretion und ein Tempo, das zu Ihnen passt — ohne „Fabrik“-Druck.';
    de.review1_quote =
      "„Ruhig, sauber, ohne Hetze. Endlich Enthaarung, bei der ich mich nicht anspanne.“";
    de.review1_meta = "Kasia · <span>Stettin-Zdroje</span>";
    de.review2_quote =
      "„Der Farbton wirkte auf den Hochzeitsfotos natürlich — genau so wollte ich es.“";
    de.review2_meta = "Marta · <span>Stettin</span>";
    de.review3_quote =
      "„Bei meiner Haut endlich eine Methode ohne Reizungen. Ich komme wieder.“";
    de.review3_meta = "Ania · <span>Gryfino</span>";
    de.faq_q1 = "Tut Haarentfernung mit Zuckerpaste weh?";
    de.faq_a1 =
      "Es kann sich wie ein kurzer Ruck anfühlen — vielen erscheint es leichter als Wachs. Wir passen das Tempo an Sie an.";
    de.faq_q2 = "Ist Zuckerpaste gut für empfindliche Haut?";
    de.faq_a2 =
      "Ja — die Paste arbeitet vor allem am Haar, nicht so stark an lebender Haut wie Wachs, daher oft weniger Reizungen. Bikini und Achseln sind bei uns Routine.";
    de.faq_q3 = "Wie bereite ich mich auf Zuckerpaste vor?";
    de.faq_a3 =
      "Saubere Haut, keine schweren Öle; Haar ca. 0,5 cm; am Vortag sanftes Peeling, wenn möglich.";
    de.faq_q4 = "Wie lange hält ein Spray-Tan?";
    de.faq_a4 =
      "Meist etwa 5–10 Tage schöner Glanz, je nach Pflege. Wir geben Tipps, damit die Farbe gleichmäßig ausklingt.";
    de.faq_q5 = "Wie bereite ich mich auf Spray-Tan vor?";
    de.faq_a5 =
      "Peeling am Vortag; am Tag selbst saubere Haut ohne parfümierte Produkte auf der Zone; danach lockere, dunklere Kleidung.";
    de.faq_q6 = "Wie buche ich?";
    de.faq_a6 =
      "Per WhatsApp oder Telefon — wir bestätigen den Termin und senden bei Bedarf Wegbeschreibung nach Zdroje.";
    de.contact_line1_html =
      '<span class="contact-aside__ic" aria-hidden="true">◎</span> Studio in Zdroje — Stettin, Woiwodschaft Westpommern';
    de.contact_line_ig_html =
      '<span class="contact-aside__ic" aria-hidden="true">@</span> <a href="https://instagram.com/" rel="noopener noreferrer">Instagram</a>';
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
      'Gilt für Beauty-Leistungen im Studio <span class="brand-mark"><span class="brand-mark__slodko">Słodko</span><span class="brand-mark__tu">Tu</span></span>. Gültig ab <time datetime="2026-05-09">9. Mai 2026</time>.';
    de.cennik_subtitle =
      "Ein ruhiger Überblick über häufig gebuchte Besuche — ohne endlose Tabellen. Vollständige Preise und den Endbetrag vereinbaren wir individuell per Nachricht oder Anruf.";
    de.cennik_sugar_h2 = "Haarentfernung mit Zuckerpaste";
    de.cennik_sugar_p1 =
      "Warme Paste aus Zucker und Zitronensaft — sanfter als Wachs, oft angenehmer bei empfindlicher Haut und im Bikini-Bereich. Glatte Haut für Wochen und ruhigeres Nachwachsen bei regelmäßigen Terminen.";
    de.price_sugar_basic_label = "Beliebteste Zonen";
    de.price_sugar_basic_hint = "Beispiel-Rahmen — genauer Preis nach Zonenplanung";
    de.price_sugar_pack_label = "Beliebteste Pakete";
    de.price_sugar_pack_hint = "Ein Termin, mehrere Zonen — ohne Hetze";
    de.price_row_underarms = "Achseln";
    de.price_row_legs = "Unterschenkel / Oberschenkel";
    de.price_row_bikini_cl = "Klassischer Bikini";
    de.price_row_bikini_deep = "Tiefer Bikini";
    de.price_row_legs_full = "Beine komplett";
    de.price_row_combo1 = "Beine + klassischer Bikini";
    de.price_row_combo2 = "Beine + tiefer Bikini";
    de.price_row_pack_neck_down = "Paket „von Hals abwärts“";
    de.price_amt_pachy = "ab 70 PLN";
    de.price_amt_lydki = "ab 120 PLN";
    de.price_amt_bikini_cl = "ab 125 PLN";
    de.price_amt_bikini_deep = "ab 175 PLN";
    de.price_amt_legs_full = "ab 190 PLN";
    de.price_amt_combo1 = "ab 275 PLN";
    de.price_amt_combo2 = "ab 330 PLN";
    de.cennik_tan_h2 = "Spray-Tanning";
    de.cennik_tan_p1 =
      "DHA-Spray-Tan ohne UV, mit natürlichem Glow. Ton passen wir Ihrer Haut an — oft vor Hochzeit, Shooting oder Urlaub. Kurze Pflegehinweise erhalten Sie beim Termin.";
    de.price_tan_overview_label = "Beliebte Anwendungen";
    de.price_tan_overview_hint = "Orientierend — Umfang klären wir bei der Buchung";
    de.price_row_torso = "Torso + Arme";
    de.price_row_body_no_face = "Ganzer Körper (ohne Gesicht)";
    de.price_row_body_face = "Ganzer Körper + Gesicht";
    de.price_amt_tan_torso = "ab 130 PLN";
    de.price_amt_tan_body = "ab 200 PLN";
    de.price_amt_tan_full = "ab 250 PLN";
    de.cennik_note_html =
      'Die oben genannten Beträge sind orientierend und an typische <strong>EU-/DE-Rahmenpreise</strong> angelehnt — im Vergleich zur polnischen Basisversion der Website können sie höher ausfallen; darin ist u. a. ein Anteil für <strong>Umrechnungs- und Zahlungsfolgekosten</strong> berücksichtigt (siehe AGB). <strong>Abrechnung am Termin in PLN</strong> nach individueller Vereinbarung. <strong>Vollständiges Paket und Endbetrag</strong> klären wir im Kontakt — schreiben Sie per WhatsApp oder rufen Sie an, nach kurzer Absprache nennen wir eine Richtpreis-Einschätzung.';
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
