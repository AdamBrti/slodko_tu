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
  /** HTML pages that share ?lang= in internal links (see patchInternalLinks). */
  var INTERNAL_HTML_NAMES =
    /^(index\.html|cennik\.html|przygotowanie-do-wizyty\.html|polityka-prywatnosci\.html|polityka-cookies\.html|regulamin\.html)$/i;

  var PAGE_META = {
    index: {
      en: {
        title: "Sugar hair removal Szczecin | SłodkoTu — sugar paste, spray tan right bank",
        description:
          "Sugar paste hair removal in Szczecin (Prawobrzeże, Andrzejewskiego 29c). 7+ years of experience, sensitive skin welcome — from PLN 49. Book via WhatsApp or Booksy.",
      },
      de: {
        title: "Haarentfernung mit Zucker Stettin | SłodkoTu — Zuckerpaste, Spray-Tan",
        description:
          "Zuckerpaste und Spray-Tan in Stettin (Prawobrzeże, Andrzejewskiego 29c). Über 7 Jahre Erfahrung — ab 49 PLN. Termin per WhatsApp oder Booksy.",
      },
    },
    cennik: {
      en: {
        title: "Sugar hair removal prices Szczecin | SłodkoTu — underarms, legs, bikini",
        description:
          "Price list for sugar paste hair removal at SłodkoTu on Szczecin right bank: underarms from PLN 49, full legs from PLN 139. Book via WhatsApp or Booksy.",
      },
      de: {
        title: "Preise Zuckerpaste Stettin | SłodkoTu — Achseln, Beine, Bikini",
        description:
          "Preisliste für Zuckerpaste bei SłodkoTu am rechten Ufer: Achseln ab 49 PLN, ganze Beine ab 139 PLN. Termin per WhatsApp oder Booksy.",
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
    prepGuide: {
      en: {
        title: "Preparing for sugar hair removal | SłodkoTu Szczecin right bank",
        description:
          "How to prepare for sugar paste hair removal at SłodkoTu: hair length, peeling, aftercare. Spray tan TanExpert tips — studio in Szczecin Prawobrzeże.",
      },
      de: {
        title: "Vorbereitung Haarentfernung mit Zucker | SłodkoTu Stettin",
        description:
          "Vorbereitung auf Zuckerpaste bei SłodkoTu: Haarlänge, Peeling, Pflege. Spray-Tan TanExpert — Studio am rechten Ufer in Stettin.",
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
      if (!INTERNAL_HTML_NAMES.test(path)) return;
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
      hero_aria_bg: "SłodkoTu sugar hair removal studio Szczecin right bank — intimate treatment room",
      hero_kicker: "Beauty studio · Szczecin right bank",
      hero_lead: "Sugar paste and spray tan — calm visits, with real care for your skin.",
      hero_cta_wa: "Book via WhatsApp",
      hero_cta_ig: "Instagram",
      about_sign: "You matter here",
      trust_title: "How people find us",
      trust_strip:
        "Most clients come from word of mouth or after a first hair removal elsewhere did not work out.",
      services_title: "Sugar hair removal & spray tan — Szczecin right bank",
      services_subtitle: "Sugar hair removal and spray tan in one intimate spot on the right bank — guide prices and quick booking.",
      service_sugar_title: "Sugar hair removal (sugar paste)",
      service_sugar_text: "Sugaring in Szczecin — gentler than wax, works on shorter hair. Underarms, legs and bikini (including deep), sensitive skin welcome.",
      service_sugar_cta_html:
        'Sugar hair removal prices Szczecin <span class="service-card__arrow" aria-hidden="true">→</span>',
      service_tan_title: "Spray tanning",
      service_tan_text: "A natural sun-kissed look without UV — weddings, shoots, holidays or an everyday fresh glow.",
      service_tan_cta_html:
        'Spray tan — guide prices <span class="service-card__arrow" aria-hidden="true">→</span>',
      gallery_title: "Studio atmosphere",
      gallery_subtitle: "Warm light and a clean space — so you can really switch off.",
      gallery_note: "Linen, ceramics and soft light — one calm visual story.",
      prep_title: "Preparing for your visit",
      prep_lead:
        "Before sugar hair removal at SłodkoTu: hair about 0.5 cm, clean skin and a gentle peel the day before — quick notes on sugar paste and spray tan.",
      prep_sugar_h3: "Sugar hair removal",
      prep_tan_h3: "Spray tanning",
      prep_sugar_li1: "Best when hair is about 0.5 cm long.",
      prep_sugar_li2: "The day before, a gentle peel helps.",
      prep_sugar_li3: "On the day of your visit, skip heavy oils and body lotions.",
      prep_tan_short_li1: "The day before, do a gentle peel.",
      prep_tan_short_li2: "Come without body lotion and perfume.",
      prep_tan_short_li3: "Bring loose, darker clothing.",
      prep_cta_full: "See full visit preparation →",
      prep_guide_back: "← Back to the short summary on the home page",
      prep_guide_intro_html:
        'Full before-and-after tips for sugar paste and spray tan at SłodkoTu on the right bank (TanExpert, MineTan). Short summary on the <a href="index.html#przygotowanie">home page</a>.',
      prep_tan_intro:
        "Well-prepped skin means a more even tan. Below are our TanExpert-friendly tips so self-tan care at home stays safe and predictable.",
      prep_tan_before_h: "Before the treatment",
      prep_tan_after_h: "After the treatment",
      prep_tan_b1:
        "Exfoliate 24 hours before (e.g. in the bath), paying extra attention to elbows, knees, ankles and dry patches — the TanExpert Exclusive Line Magic Eraser mitt works great.",
      prep_tan_b2:
        "Do any hair removal at least 48 hours earlier so pores can close — otherwise dark dots in pores are more likely.",
      prep_tan_b3:
        "24 hours before, avoid high-pH soaps and shower products, oil-based formulas and heavy moisturisers — they can block the tanning actives.",
      prep_tan_b4:
        "Right before application skin should be clean and dry. Do not moisturise the whole body — only a thin layer on knees and elbows so they don’t over-absorb bronzer.",
      prep_tan_b5:
        "On the day of the visit, do not use moisturiser, perfume, deodorant or makeup on the spray area.",
      prep_tan_b6: "Bring loose, dark clothing to the appointment.",
      prep_tan_a1:
        "The longer the product stays on before the first rinse, the deeper the tan — we’ll agree timing during your visit.",
      prep_tan_a2:
        "Within 1–3 hours, take a short (~45 s), lukewarm shower — hot water slows colour development. The cosmetic bronzer rinses off while the tanning ingredients keep working.",
      prep_tan_a3:
        "For the first wash use water only — no shower gels, scrubs or shampoo. The final shade keeps developing for up to 24 hours.",
      prep_tan_a4: "Pat skin dry with a towel — don’t rub hard.",
      prep_tan_a5:
        "After that first rinse you can wear favourite clothes — no staining worries on clothes or bedding if you follow the plan.",
      prep_tan_a6: "For the first 24 hours, skip gym and swimming.",
      prep_tan_a7: "Try not to touch skin before the product is rinsed off.",
      prep_tan_a8:
        "Moisturise — e.g. TanExpert Desert Rose to extend the tan; wash your hands after applying cream.",
      prep_tan_a9:
        "Very long baths and heavy sweating soften the tan — keep that in mind for the first days.",
      review_stars_aria: "Rating: 5 out of 5 stars",
      reviews_title: "Client reviews",
      reviews_subtitle: "Short voices after visits — no hype.",
      faq_title: "Frequently asked questions",
      contact_title: "Book a visit",
      contact_subtitle:
        "Book sugar hair removal in Szczecin: WhatsApp, phone or Booksy — 29c Jerzego Andrzejewskiego St, right bank.",
      contact_big_phone: "Phone",
      contact_big_wa: "WhatsApp",
      contact_big_ig: "Instagram",
      contact_map_zoom: "Open in Google Maps",
      cennik_back: "← Back to services",
      cennik_h1: "Sugar hair removal prices — Szczecin",
      cennik_lead_html:
        'Full sugar paste price list at our intimate studio on the right bank. More about <a href="index.html">sugar hair removal at SłodkoTu</a> on the home page.',
      price_from: "from … PLN",
      price_extra: "add-on … PLN",
      price_quote_ind: "Individual pricing",
      wa_booking_short: "Hello — this is my first message.",
      wa_skin: "Hello — I’d like help choosing a treatment for my skin.",
      wa_directions: "Hello — asking for directions to the studio.",
      wa_faq: "I have a question after reading the FAQ — writing from the SłodkoTu website.",
      hero_cta_pricing: "See pricing",
      hero_trust_row_aria: "At a glance",
      hero_trust_1: "Szczecin · right bank",
      hero_trust_2: "Quick replies",
      hero_trust_3: "Easy from Gryfino & nearby",
      trust_badges_title: "First things first",
      trust_badge_1: "Intimate studio on the right bank",
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
      why_title: "Why sugar hair removal instead of wax?",
      why_sugar_h3: "Sugar paste — sugaring",
      why_sugar_p:
        "Paste removes hair with the bulb and doesn’t stick to skin like wax — less irritation and ingrowth. Great for underarms, legs and bikini at our right-bank studio.",
      why_tan_h3: "Spray tanning",
      why_tan_p:
        "DHA gives an even, natural tone without sunbeds. We adjust the shade to your complexion — fresh-looking skin without excess.",
      local_title: "Sugar hair removal Szczecin — right bank, easy from Gryfino & nearby",
      local_p_html:
        "<strong>Sugar hair removal Szczecin right bank:</strong> studio at <strong>29c Jerzego Andrzejewskiego St</strong> (70-779). Easy from <strong>Gryfino, Police, Chojna, Widuchowa, Banie and Stare Czarnowo</strong>. We’ll clarify entry after you book.",
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
      contact_booksy_link: "Calendar & booking — Booksy",
      contact_booksy_big: "Booksy — pick a time slot",
      contact_facebook_link: "Facebook — Słodko Tu",
    };

    en.hero_kicker = "Sugar hair removal · Szczecin right bank";
    en.trust_badge_1 = "Sugar hair removal Szczecin — right bank";
    en.trust_badge_2 = "7+ years — sugar paste every day";
    en.trust_badge_3 = "From PLN 49 · WhatsApp & Booksy";
    en.trust_badge_4 = "Easy from Gryfino, Police & nearby";
    en.seo_h2 = "Sugar paste hair removal in Szczecin — who is SłodkoTu for?";
    en.seo_p1 =
      "Looking for sugar hair removal on the right bank without crowds or rush? We offer sugaring — natural sugar and lemon paste — on underarms, legs, arms and bikini (classic, extended and deep).";
    en.seo_p2 =
      "Many people search “sugar hair removal Szczecin” or “sugar paste Prawobrzeże” — it’s the same gentle method we’ve used for years. Studio at 29c Jerzego Andrzejewskiego St; book via WhatsApp, phone or Booksy.";
    en.hero_title = "Sugar hair removal Szczecin<br />sugar paste & spray tan — intimate studio";
    en.hero_lead =
      "Sugar paste hair removal on Szczecin right bank — smooth skin, natural glow and zero pressure. 7+ years of practice, including sensitive skin and bikini.";
    en.hero_cta_wa = "Book via WhatsApp";
    en.about_title = "Sugar hair removal Szczecin — intimate SłodkoTu studio";
    en.about_p1_html =
      'At <span class="brand-mark"><span class="brand-mark__slodko">Słodko</span><span class="brand-mark__tu">Tu</span></span> on the right bank we offer <strong>sugar hair removal</strong> (sugar paste) and <strong>spray tan</strong>. One client at a time, a clean room and your pace — no “factory” rush.';
    en.about_p2_html =
      "I’ve been doing <strong>sugar paste in Szczecin for over 7 years</strong> — daily practice at the studio: underarms, legs, bikini, including <strong>sensitive skin</strong>.";
    en.about_p3_html =
      'Looking for sugar hair removal on the right bank or travel from Gryfino, Police or nearby? Message us — we’ll match zones and timing. <a href="cennik.html">Price list</a> is online too.';
    en.review1_quote =
      "“Quiet, clean, no rush. Finally hair removal where I don’t tense up.”";
    en.review1_meta = "Kasia · <span>Szczecin</span>";
    en.review2_quote =
      "“The colour looked natural in my wedding photos — exactly what I asked for.”";
    en.review2_meta = "Marta · <span>Szczecin</span>";
    en.review3_quote =
      "“With my skin this is finally a method without irritation. I keep coming back.”";
    en.review3_meta = "Ania · <span>Gryfino</span>";
    en.faq_title = "FAQ — sugar hair removal & sugar paste Szczecin";
    en.faq_q1 = "Does sugar / sugar-paste hair removal hurt?";
    en.faq_a1 =
      "It can feel like a quick tug — many find sugar paste lighter than wax. We match the pace to you at our right-bank studio.";
    en.faq_q2 = "Is sugar paste good for sensitive skin?";
    en.faq_a2 =
      "Yes — the paste works mainly on the hair, not as aggressively on live skin as wax, so there’s often less irritation. Bikini and underarms are routine for us.";
    en.faq_q7 = "How much does sugar hair removal cost in Szczecin?";
    en.faq_a7_html =
      'At SłodkoTu on the right bank: underarms from PLN 49, full legs from PLN 139, deep bikini from PLN 129. See the full <a href="cennik.html">price list</a> — we’ll match the zones to you when you book.';
    en.faq_q8 = "How long does sugar hair removal last?";
    en.faq_a8 =
      "Usually around 3–4 weeks of smooth skin — it depends on the area, hair cycle and how often you visit. With regular sugar paste sessions hair often grows back finer and with less ingrowth.";
    en.faq_q3 = "How should I prepare for sugar hair removal?";
    en.faq_a3_html =
      'Clean skin, no heavy oils; hair about 0.5 cm (shorter than for wax); gentle peel the day before if you can. Full list: <a href="przygotowanie-do-wizyty.html">preparing for sugar hair removal</a>.';
    en.faq_q9 = "Is sugar paste hair removal effective?";
    en.faq_a9 =
      "Yes — the paste removes hair with the bulb; with regular visits regrowth is often finer and less ingrown. Works from about 0.5 cm, so you don’t wait as long as before waxing.";
    en.faq_q4 = "How long does a spray tan last?";
    en.faq_a4 =
      "Usually around 5–10 days of nice glow, depending on aftercare. We share tips so it fades evenly.";
    en.faq_q5 = "How should I prepare for spray tanning?";
    en.faq_a5_html =
      '<p>On the home page you’ll find a short summary in <a href="#przygotowanie">“Preparing for your visit”</a>. The full before-and-after checklist (TanExpert, including Magic Eraser and Desert Rose) is on <a href="przygotowanie-do-wizyty.html">the visit preparation page</a>.</p>';
    en.faq_q6 = "How do I book?";
    en.faq_a6 =
      "We reply fastest on WhatsApp and phone — we confirm your slot and can send directions to our right-bank Szczecin studio. Prefer to choose a free time yourself? Use the Booksy calendar (link in Contact). You can also message us on Facebook when that link is active.";
    en.contact_line1_html =
      '<span class="contact-aside__ic" aria-hidden="true">◎</span> <a href="https://www.google.com/maps/search/?api=1&amp;query=53.38108%2C14.66285" target="_blank" rel="noopener noreferrer">29c Jerzego Andrzejewskiego St, 70-779 Szczecin (right bank / Prawobrzeże), West Pomerania, Poland</a>';
    en.contact_hours_html =
      '<span class="contact-aside__ic" aria-hidden="true">⏰</span> <strong>Opening hours:</strong> Mon–Fri 10:00–21:00 · weekends (Sat–Sun) 10:00–16:00';
    en.contact_line_ig_html =
      '<span class="contact-aside__ic" aria-hidden="true">@</span> <a href="https://instagram.com/" rel="noopener noreferrer">Instagram</a>';
    en.contact_hint =
      "Tell us where you’re coming from and we’ll fine-tune door-to-door directions when you book.";
    en.contact_trust =
      "A short first message is enough. We reply on WhatsApp and phone; you can also grab a slot on Booksy — no long forms on this site.";
    en.contact_map_ph_html =
      'The map (Google Maps) loads here after you choose <strong>I accept</strong> in the cookie notice — your browser then connects to Google’s servers (like opening Google Maps). <a href="https://www.google.com/maps/search/?api=1&amp;query=53.38108%2C14.66285" target="_blank" rel="noopener noreferrer">Open location in Google Maps</a>.';
    en.footer_index_html =
      '<strong class="brand-mark"><span class="brand-mark__slodko">Słodko</span><span class="brand-mark__tu">Tu</span></strong> — sugar hair removal Szczecin right bank · <a href="cennik.html">Price list</a> · spray tan';
    en.footer_cennik_html =
      '<strong class="brand-mark"><span class="brand-mark__slodko">Słodko</span><span class="brand-mark__tu">Tu</span></strong> — beauty studio Szczecin right bank · <a href="cennik.html">Pricing</a>';
    en.footer_sub_html =
      '<strong class="brand-mark"><span class="brand-mark__slodko">Słodko</span><span class="brand-mark__tu">Tu</span></strong> — beauty studio Szczecin right bank · <a href="index.html">Home</a> · <a href="cennik.html">Pricing</a>';
    en.footer_legal_short_html =
      '<strong class="brand-mark"><span class="brand-mark__slodko">Słodko</span><span class="brand-mark__tu">Tu</span></strong> · <a href="index.html">Home</a>';
    en.footer_prep_html =
      '<strong class="brand-mark"><span class="brand-mark__slodko">Słodko</span><span class="brand-mark__tu">Tu</span></strong> · beauty studio Szczecin right bank · <a href="index.html">Home</a> · <a href="cennik.html">Pricing</a>';
    en.cookie_banner_html_index =
      'Google Fonts and the embedded Google Maps frame load only after you choose <strong>I accept</strong>. <strong>Essential only</strong> keeps the page without those extras (you can still open the studio location in Google Maps from Contact without accepting the embed). <a href="polityka-cookies.html">Cookie policy</a> · <a href="polityka-prywatnosci.html">Privacy</a>.';
    en.cookie_banner_html_cennik =
      'Google Fonts load after you choose <strong>I accept</strong>. <strong>Essential only</strong> uses system fonts. <a href="polityka-cookies.html">Cookies</a> · <a href="polityka-prywatnosci.html">Privacy</a>.';
    en.cookie_banner_html_short =
      'Google Fonts and Google Maps embed load after <strong>I accept</strong>. Details: <a href="polityka-cookies.html">cookie policy</a> and <a href="polityka-prywatnosci.html">privacy</a>.';
    en.cookie_banner_html_min =
      'Google Fonts and Google Maps embed after <strong>I accept</strong>. <a href="polityka-cookies.html">Cookies</a> · <a href="polityka-prywatnosci.html">Privacy</a>';
    en.legal_privacy_meta_html =
      'Effective from <time datetime="2026-05-11">11 May 2026</time>. We keep it short and clear — if anything is unclear, write or call and we’ll explain.';
    en.legal_cookies_meta_html =
      'Short information for the <span class="brand-mark"><span class="brand-mark__slodko">Słodko</span><span class="brand-mark__tu">Tu</span></span> website. From <time datetime="2026-05-11">11 May 2026</time>.';
    en.legal_terms_meta_html =
      'Applies to beauty services at <span class="brand-mark"><span class="brand-mark__slodko">Słodko</span><span class="brand-mark__tu">Tu</span></span>. Effective <time datetime="2026-05-11">11 May 2026</time>.';
    en.cennik_sugar_h2 = "Sugar hair removal — sugar paste prices";
    en.cennik_sugar_p1 =
      "Price list for sugar hair removal in Szczecin (right bank, SłodkoTu): sugar and lemon paste — gentler than wax, including sensitive skin and bikini. Popular zones below; full range in the expandable list.";
    en.cennik_full_h2 = "Full sugar hair removal price list Szczecin";
    en.cennik_full_p =
      "Sugar paste — women and men, face and body, bikini + legs packages. Expand a category to see all zones and prices.";
    en.prep_guide_h1 = "Preparing for sugar hair removal — Szczecin";
    en.prep_guide_intro_html =
      'Full before-and-after tips for sugar paste and spray tan at SłodkoTu on the right bank (TanExpert, MineTan). Short summary on the <a href="index.html#przygotowanie">home page</a>.';
    en.price_sugar_basic_label = "Most chosen areas";
    en.price_sugar_basic_hint = "Sample prices for selected treatments.";
    en.price_sugar_pack_label = "Most chosen packages";
    en.price_sugar_pack_hint = "Several zones in one calm visit.";
    en.price_row_underarms = "Underarms";
    en.price_row_legs = "Lower legs / thighs";
    en.price_row_legs_full_short = "Full legs";
    en.price_row_bikini_cl = "Classic bikini";
    en.price_row_bikini_deep = "Deep bikini";
    en.price_row_legs_full = "Full legs";
    en.price_row_combo1 = "Legs + classic bikini";
    en.price_row_combo_ext = "Legs + extended bikini";
    en.price_row_combo2 = "Legs + deep bikini";
    en.price_row_pack_neck_down = "“Neck down” package";
    en.price_amt_pachy = "from 49 PLN";
    en.price_amt_lydki = "from 90 PLN";
    en.price_amt_bikini_cl = "from 99 PLN";
    en.price_amt_bikini_deep = "from 129 PLN";
    en.price_amt_legs_full = "from 139 PLN";
    en.price_amt_combo1 = "from 199 PLN";
    en.price_amt_combo_ext = "from 209 PLN";
    en.price_amt_combo2 = "from 229 PLN";
    en.cennik_tan_h2 = "Spray tanning";
    en.cennik_tan_p1 =
      "A natural-looking tan without UV and without orange tones. We tailor the shade to your skin and the look you want, from a subtle glow to a deeper tan.";
    en.cennik_tan_p2 =
      "After your visit you receive short aftercare tips that help the result last as long as possible.";
    en.cennik_tan_h3 = "Certified training and premium products";
    en.cennik_tan_p3 =
      "We work with TanExpert and MineTan cosmetics and equipment, following completed professional spray tanning training.";
    en.price_tan_overview_label = "Popular applications";
    en.price_tan_overview_hint = "Most often chosen spray tanning options.";
    en.price_row_tan_half = "Half body";
    en.price_row_tan_whole = "Full body";
    en.price_amt_tan_half = "from 40 PLN";
    en.price_amt_tan_whole = "from 80 PLN";
    en.cennik_acc_women_sum = "Price list: women";
    en.cennik_acc_men_sum = "Price list: men";
    en.cennik_acc_bikini_sum = "Bikini types";
    en.cennik_acc_w_face = "Face";
    en.cennik_acc_w_body = "Body";
    en.cennik_acc_m_face = "Face";
    en.cennik_acc_m_body = "Body";
    en.cennik_acc_w_face_html =
      '<ul class="price-card__rows"><li><span class="price-card__name">Eyebrows</span> <span class="price-card__amount">39 PLN · 10 min</span></li><li><span class="price-card__name">Upper lip</span> <span class="price-card__amount">39 PLN · 10 min</span></li><li><span class="price-card__name">Chin</span> <span class="price-card__amount">39 PLN · 10 min</span></li><li><span class="price-card__name">Brow arches</span> <span class="price-card__amount">39 PLN · 10 min</span></li><li><span class="price-card__name">Tip of nose</span> <span class="price-card__amount">39 PLN · 10 min</span></li><li><span class="price-card__name">Neck</span> <span class="price-card__amount">39 PLN · 10 min</span></li><li><span class="price-card__name">Cheeks</span> <span class="price-card__amount">39 PLN · 10 min</span></li><li><span class="price-card__name">Ears</span> <span class="price-card__amount">39 PLN · 10 min</span></li><li><span class="price-card__name">Full face &amp; décolleté</span> <span class="price-card__amount">199 PLN</span></li></ul>';
    en.cennik_acc_w_body_html =
      '<ul class="price-card__rows"><li><span class="price-card__name">Underarms</span> <span class="price-card__amount">49 PLN · 10 min</span></li><li><span class="price-card__name">Full legs</span> <span class="price-card__amount">139 PLN · 45 min</span></li><li><span class="price-card__name">Arms + underarms + hands + fingers</span> <span class="price-card__amount">149 PLN</span></li><li><span class="price-card__name">Full legs + feet + toes</span> <span class="price-card__amount">179 PLN</span></li><li><span class="price-card__name">Buttocks</span> <span class="price-card__amount">69 PLN</span></li><li><span class="price-card__name">Stomach</span> <span class="price-card__amount">49 PLN</span></li><li><span class="price-card__name">Back</span> <span class="price-card__amount">69 PLN</span></li></ul>';
    en.cennik_acc_m_face_html =
      '<ul class="price-card__rows"><li><span class="price-card__name">Eyebrows</span> <span class="price-card__amount">39 PLN</span></li><li><span class="price-card__name">Upper lip</span> <span class="price-card__amount">39 PLN</span></li><li><span class="price-card__name">Chin</span> <span class="price-card__amount">39 PLN</span></li><li><span class="price-card__name">Brow arches</span> <span class="price-card__amount">39 PLN</span></li><li><span class="price-card__name">Tip of nose</span> <span class="price-card__amount">39 PLN</span></li><li><span class="price-card__name">Neck</span> <span class="price-card__amount">39 PLN</span></li><li><span class="price-card__name">Cheeks</span> <span class="price-card__amount">39 PLN</span></li><li><span class="price-card__name">Ears</span> <span class="price-card__amount">49 PLN</span></li><li><span class="price-card__name">Full face &amp; décolleté</span> <span class="price-card__amount">199 PLN</span></li></ul>';
    en.cennik_acc_m_body_html =
      '<ul class="price-card__rows"><li><span class="price-card__name">Underarms</span> <span class="price-card__amount">69 PLN · 10 min</span></li><li><span class="price-card__name">Full legs</span> <span class="price-card__amount">219 PLN · 60 min</span></li><li><span class="price-card__name">Arms + underarms + hands + fingers</span> <span class="price-card__amount">219 PLN</span></li><li><span class="price-card__name">Full legs + feet + toes</span> <span class="price-card__amount">239 PLN</span></li><li><span class="price-card__name">Full back</span> <span class="price-card__amount">199 PLN · 60 min</span></li><li><span class="price-card__name">Torso</span> <span class="price-card__amount">149 PLN · 30 min</span></li><li><span class="price-card__name">Back + shoulders</span> <span class="price-card__amount">249 PLN</span></li><li><span class="price-card__name">Back + shoulders + torso</span> <span class="price-card__amount">359 PLN</span></li></ul>';
    en.cennik_acc_bikini_html =
      '<ul class="price-card__rows"><li><span class="price-card__name">Classic bikini · 30 min</span> <span class="price-card__amount">99 PLN / with legs 199 PLN</span></li><li><span class="price-card__name">Extended bikini · 30 min</span> <span class="price-card__amount">109 PLN / with legs 209 PLN</span></li><li><span class="price-card__name">Partial + strip · 30 min</span> <span class="price-card__amount">109 PLN / with legs 209 PLN</span></li><li><span class="price-card__name">Deep bikini · 40 min</span> <span class="price-card__amount">129 PLN / with legs 229 PLN</span></li><li><span class="price-card__name">Hollywood bikini · 45 min</span> <span class="price-card__amount">139 PLN / with legs 239 PLN</span></li><li><span class="price-card__name">Hollywood + pattern · 45 min</span> <span class="price-card__amount">149 PLN / with legs 249 PLN</span></li></ul>';
    en.cennik_acc_pack_sum = "Packages, one visit";
    en.cennik_acc_pack_lead =
      "Several zones in one go, the same bundles as on our flyer. Visit length is agreed when you book.";
    en.cennik_acc_pack_w = "Packages: women";
    en.cennik_acc_pack_m = "Packages: men";
    en.cennik_acc_pack_bikini = "Bikini + full legs";
    en.cennik_acc_pack_w_html =
      '<ul class="price-card__rows"><li><span class="price-card__name">Arms + underarms + hands + fingers</span> <span class="price-card__amount">149 PLN</span></li><li><span class="price-card__name">Full legs + feet + toes</span> <span class="price-card__amount">179 PLN</span></li><li><span class="price-card__name">“Neck down” package</span> <span class="price-card__amount">individual quote</span></li></ul>';
    en.cennik_acc_pack_m_html =
      '<ul class="price-card__rows"><li><span class="price-card__name">Arms + underarms + hands + fingers</span> <span class="price-card__amount">219 PLN</span></li><li><span class="price-card__name">Full legs + feet + toes</span> <span class="price-card__amount">239 PLN</span></li><li><span class="price-card__name">Back + shoulders</span> <span class="price-card__amount">249 PLN</span></li><li><span class="price-card__name">Back + shoulders + torso</span> <span class="price-card__amount">359 PLN</span></li></ul>';
    en.cennik_acc_pack_bikini_html =
      '<ul class="price-card__rows"><li><span class="price-card__name">Legs + classic bikini</span> <span class="price-card__amount">199 PLN</span></li><li><span class="price-card__name">Legs + extended bikini</span> <span class="price-card__amount">209 PLN</span></li><li><span class="price-card__name">Legs + partial bikini + strip</span> <span class="price-card__amount">209 PLN</span></li><li><span class="price-card__name">Legs + deep bikini</span> <span class="price-card__amount">229 PLN</span></li><li><span class="price-card__name">Legs + Hollywood bikini</span> <span class="price-card__amount">239 PLN</span></li><li><span class="price-card__name">Legs + Hollywood + pattern</span> <span class="price-card__amount">249 PLN</span></li></ul>';
    en.cennik_note_html =
      "<p>Prices are indicative and may vary depending on the scope of the treatment.</p><p>If you are not sure which option is best, message us on WhatsApp or call and we will help you choose.</p>";
    en.img_gallery_1 = "Studio interior — linen and soft light";
    en.img_gallery_2 = "Sugar paste and ceramics in the treatment room";
    en.img_gallery_3 = "Skin detail in natural light";
    en.img_gallery_4 = "Intimate studio — a calm moment before the treatment";
    en.img_gallery_6 = "Even, natural tan matched to your skin";
    en.img_prep_left = "Sugar paste and hair removal accessories at SłodkoTu";
    en.img_prep_right = "Professional spray tanning equipment in the studio";
    en.img_about_cert =
      "Certificate of professional spray tanning training — TanExpert and MineTan cosmetics and equipment";
    en.cred_eyebrow = "Trust";
    en.cred_h2 = "Why clients trust us";
    en.cred_lead =
      "We work with professional products we stand behind, and keep training up to date — so you feel calm and confident from your very first visit.";
    en.cred_badge = "Certified TanExpert & MineTan training";
    en.cred_zoom_hint = "View larger";
    en.cred_thumb_aria = "Open a larger view of the training certificate";
    en.cred_lightbox_title = "Certificate preview";
    en.cred_lightbox_cap =
      "Spray tanning training — TanExpert and MineTan cosmetics and equipment.";
    en.cred_close_aria = "Close";

    var de = {
      skip_to_content: "Zum Inhalt springen",
      nav_aria: "Hauptnavigation",
      nav_about: "Über uns",
      nav_services: "Leistungen",
      nav_pricing: "Preise",
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
      hero_aria_bg: "SłodkoTu Studio Haarentfernung mit Zucker Stettin — kameraler Behandlungsraum",
      hero_kicker: "Beauty-Studio · Stettin rechtes Ufer",
      hero_lead:
        "Glatte Haut, natürlicher Glow — ruhige Termine im kleinen Studio am rechten Ufer.",
      hero_cta_wa: "Über WhatsApp buchen",
      hero_cta_pricing: "Preise ansehen",
      hero_trust_row_aria: "Kurz & klar",
      hero_trust_1: "Stettin · rechtes Ufer",
      hero_trust_2: "Schnelle Antworten",
      hero_trust_3: "Gut erreichbar aus Gryfino & Umgebung",
      hero_cta_ig: "Instagram",
      about_sign: "Hier sind Sie wichtig",
      trust_badges_title: "Zum Start",
      trust_badge_1: "Kleines Studio am rechten Ufer",
      trust_badge_2: "Empfindliche Haut — sanfte Methode",
      trust_badge_3: "Termin per WhatsApp",
      trust_badge_4: "Gut erreichbar aus Gryfino & Umgebung",
      services_title: "Haarentfernung mit Zucker & Spray-Tan — Stettin rechtes Ufer",
      services_subtitle:
        "Haarentfernung mit Zucker und Spray-Tan an einem Ort am rechten Ufer — Orientierungspreise und schnelle Buchung.",
      service_sugar_title: "Haarentfernung mit Zucker (Zuckerpaste)",
      service_sugar_text:
        "Sugaring in Stettin — sanfter als Wachs, auch kürzere Haare. Achseln, Beine, Bikini (auch tief), empfindliche Haut willkommen.",
      service_sugar_cta_html:
        'Preise Haarentfernung mit Zucker Stettin <span class="service-card__arrow" aria-hidden="true">→</span>',
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
      why_title: "Warum Haarentfernung mit Zucker statt Wachs?",
      why_sugar_h3: "Zuckerpaste — Sugaring",
      why_sugar_p:
        "Die Paste entfernt Haar mit Wurzel und klebt weniger an der Haut als Wachs — weniger Reizungen und Eingewachsene. Achseln, Beine, Bikini in unserem Studio am rechten Ufer.",
      why_tan_h3: "Spray-Tan",
      why_tan_p:
        "DHA sorgt für einen natürlichen, gleichmäßigen Ton ohne Solarium. Wir passen den Farbton an Ihren Hauttyp an — frisch, ohne Übertreibung.",
      gallery_title: "Studio-Atmosphäre",
      gallery_subtitle: "Warmes Licht, sauberer Raum — damit Sie wirklich abschalten können.",
      gallery_note: "Leinen, Keramik, weiches Licht — eine ruhige, stimmige Bildsprache.",
      prep_title: "Vorbereitung auf den Besuch",
      prep_lead:
        "Vor Haarentfernung mit Zucker bei SłodkoTu: Haar ca. 0,5 cm, saubere Haut, sanftes Peeling am Vortag — kurz zu Zuckerpaste und Spray-Tan.",
      prep_sugar_h3: "Zuckerpaste",
      prep_tan_h3: "Spray-Tan",
      prep_sugar_li1: "Am besten bei einer Haarlänge von ca. 0,5 cm.",
      prep_sugar_li2: "Am Tag davor lohnt sich ein sanftes Peeling.",
      prep_sugar_li3: "Am Behandlungstag keine schweren Öle und Bodylotions.",
      prep_tan_short_li1: "Am Tag davor sanftes Peeling.",
      prep_tan_short_li2: "Ohne Bodylotion und Parfüm zum Termin kommen.",
      prep_tan_short_li3: "Lockere, dunklere Kleidung mitbringen.",
      prep_cta_full: "Vollständige Vorbereitung ansehen →",
      prep_guide_back: "← Zur Kurzfassung auf der Startseite",
      prep_guide_intro_html:
        'Ausführliche Tipps vor und nach Zuckerpaste und Spray-Tan bei SłodkoTu am rechten Ufer (TanExpert, MineTan). Kurzfassung auf der <a href="index.html#przygotowanie">Startseite</a>.',
      prep_tan_intro:
        "Gut vorbereitete Haut bräunt gleichmäßiger. Unten unsere Tipps rund um TanExpert — damit Pflege und Bräunung zu Hause sicher und planbar bleiben.",
      prep_tan_before_h: "Vor der Behandlung",
      prep_tan_after_h: "Nach der Behandlung",
      prep_tan_b1:
        "Peeling 24 Stunden vorher (z. B. beim Baden), besonders Ellbogen, Knie, Knöchel und trockene Stellen — der Handschuh TanExpert Exclusive Line Magic Eraser eignet sich dafür.",
      prep_tan_b2:
        "Haarentfernung mindestens 48 Stunden zuvor, damit sich die Poren schließen — sonst eher dunkle Pünktchen.",
      prep_tan_b3:
        "24 Stunden vorher keine hochalkalische Seife oder Duschprodukte, keine öligen oder sehr reichen Cremes — sie können die Bräunungswirkstoffe blockieren.",
      prep_tan_b4:
        "Vor dem Auftrag Haut sauber und trocken. Keine Bodylotion flächig — nur dünn auf Knie und Ellbogen, damit kein Überfärben entsteht.",
      prep_tan_b5:
        "Am Behandlungstag keine feuchtigkeitsspendende Creme, Parfüm, Deo oder Make-up auf der Sprühzone.",
      prep_tan_b6: "Lockere, dunkle Kleidung zum Termin mitbringen.",
      prep_tan_a1:
        "Je länger das Produkt vor der ersten Dusche einwirken kann, desto kräftiger der Ton — Zeitfenster besprechen wir bei Ihnen.",
      prep_tan_a2:
        "Innerhalb von 1–3 Stunden kurze (~45 s), lauwarme Dusche — heißes Wasser bremst die Entwicklung. Kosmetischer Bronzer läuft ab, die Bräunungsstoffe arbeiten weiter.",
      prep_tan_a3:
        "Beim ersten Waschen nur Wasser — keine Duschgele, Peelings oder Shampoo. Der Endton entwickelt sich bis zu ca. 24 Stunden.",
      prep_tan_a4: "Mit dem Handtuch tupfen, nicht stark reiben.",
      prep_tan_a5:
        "Danach normale Kleidung — ohne Fleckenängste auf Textilien und Bettwäsche bei Einhaltung der Tipps.",
      prep_tan_a6: "Die ersten 24 Stunden kein Sport und kein Schwimmen.",
      prep_tan_a7: "Haut möglichst nicht anfassen, bevor das Produkt abgespült ist.",
      prep_tan_a8:
        "Eincremen, z. B. mit TanExpert Desert Rose für längere Haltbarkeit; danach Hände waschen.",
      prep_tan_a9:
        "Lange Bäder und starkes Schwitzen schwächen die Bräune — in den ersten Tagen beachten.",
      review_stars_aria: "Bewertung: 5 von 5 Sternen",
      reviews_title: "Stimmen von Kundinnen",
      reviews_subtitle: "Kurze Stimmen nach dem Besuch — ohne Übertreibung.",
      review1_tag: "Nach Zuckerpaste — Bikini",
      review2_tag: "Spray-Tan vor der Hochzeit",
      review3_tag: "Empfindliche Haut — Beine & Achseln",
      reviews_cta_btn: "Behandlung an die Haut anpassen",
      local_title: "Haarentfernung mit Zucker Stettin — rechtes Ufer, Anfahrt aus Gryfino & Umgebung",
      local_p_html:
        "<strong>Haarentfernung mit Zucker Stettin rechtes Ufer:</strong> Studio in der <strong>Jerzego Andrzejewskiego 29c</strong> (70-779). Anfahrt u. a. aus <strong>Gryfino, Police, Chojna, Widuchowa, Banie und Stare Czarnowo</strong>. Eingang klären wir nach der Buchung.",
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
      contact_booksy_link: "Kalender & Buchung — Booksy",
      contact_booksy_big: "Booksy — Termin wählen",
      contact_facebook_link: "Facebook — Słodko Tu",
      contact_title: "Termin buchen",
      contact_subtitle:
        "Haarentfernung mit Zucker in Stettin buchen: WhatsApp, Telefon oder Booksy — ul. Jerzego Andrzejewskiego 29c, rechtes Ufer.",
      contact_big_phone: "Telefon",
      contact_big_wa: "WhatsApp",
      contact_big_ig: "Instagram",
      contact_map_zoom: "In Google Maps öffnen",
      cennik_back: "← Zurück zu den Leistungen",
      cennik_h1: "Preise Zuckerpaste — Stettin",
      cennik_lead_html:
        'Vollständige Preisliste für Zuckerpaste im kleinen Studio am rechten Ufer. Mehr zur <a href="index.html">Haarentfernung mit Zucker bei SłodkoTu</a> auf der Startseite.',
      price_from: "ab … PLN",
      price_extra: "Aufpreis … PLN",
      price_quote_ind: "Individuelle Preisierung",
    };

    de.hero_kicker = "Haarentfernung mit Zucker · Stettin rechtes Ufer";
    de.trust_badge_1 = "Haarentfernung mit Zucker Stettin — rechtes Ufer";
    de.trust_badge_2 = "Über 7 Jahre — Zuckerpaste täglich";
    de.trust_badge_3 = "Ab 49 PLN · WhatsApp & Booksy";
    de.trust_badge_4 = "Gut erreichbar aus Gryfino, Police & Umgebung";
    de.seo_h2 = "Haarentfernung mit Zuckerpaste in Stettin — für wen ist SłodkoTu?";
    de.seo_p1 =
      "Sie suchen Haarentfernung mit Zucker am rechten Ufer ohne Hetze? Wir bieten Sugaring — natürliche Paste aus Zucker und Zitrone — an Achseln, Beinen, Armen und im Bikini (klassisch, erweitert, tief).";
    de.seo_p2 =
      "Viele suchen „Haarentfernung Zuckerpaste Stettin“ oder „Prawobrzeże“ — dieselbe sanfte Methode seit Jahren. Studio: ul. Jerzego Andrzejewskiego 29c; Termin per WhatsApp, Telefon oder Booksy.";
    de.hero_title =
      "Haarentfernung mit Zucker Stettin<br />Zuckerpaste & Spray-Tan — kleines Studio";
    de.hero_lead =
      "Zuckerpaste am rechten Ufer — glatte Haut, natürlicher Glow ohne Druck. Über 7 Jahre Erfahrung, auch empfindliche Haut und Bikini.";
    de.about_title = "Haarentfernung mit Zucker Stettin — Studio SłodkoTu";
    de.about_p1_html =
      'Bei <span class="brand-mark"><span class="brand-mark__slodko">Słodko</span><span class="brand-mark__tu">Tu</span></span> am rechten Ufer: <strong>Haarentfernung mit Zucker</strong> (Zuckerpaste) und <strong>Spray-Tan</strong>. Eine Person pro Termin, sauberer Raum, Ihr Tempo — ohne „Fabrik“-Druck.';
    de.about_p2_html =
      "Zuckerpaste in Stettin seit <strong>über 7 Jahren</strong> — tägliche Praxis: Achseln, Beine, Bikini, auch <strong>empfindliche Haut</strong>.";
    de.about_p3_html =
      'Zuckerpaste am rechten Ufer oder Anfahrt aus Gryfino, Police & Umgebung? Schreiben Sie — wir passen Zonen und Termin an. <a href="cennik.html">Preisliste</a> online.';
    de.review1_quote =
      "„Ruhig, sauber, ohne Hetze. Endlich Enthaarung, bei der ich mich nicht anspanne.“";
    de.review1_meta = "Kasia · <span>Stettin</span>";
    de.review2_quote =
      "„Der Farbton wirkte auf den Hochzeitsfotos natürlich — genau so wollte ich es.“";
    de.review2_meta = "Marta · <span>Stettin</span>";
    de.review3_quote =
      "„Bei meiner Haut endlich eine Methode ohne Reizungen. Ich komme wieder.“";
    de.review3_meta = "Ania · <span>Gryfino</span>";
    de.faq_title = "FAQ — Haarentfernung mit Zucker & Zuckerpaste Stettin";
    de.faq_q1 = "Tut Haarentfernung mit Zucker / Zuckerpaste weh?";
    de.faq_a1 =
      "Es kann sich wie ein kurzer Ruck anfühlen — vielen erscheint Zuckerpaste leichter als Wachs. Wir passen das Tempo im Studio am rechten Ufer an.";
    de.faq_q2 = "Ist Zuckerpaste gut für empfindliche Haut?";
    de.faq_a2 =
      "Ja — die Paste arbeitet vor allem am Haar, nicht so stark an lebender Haut wie Wachs, daher oft weniger Reizungen. Bikini und Achseln sind bei uns Routine.";
    de.faq_q7 = "Was kostet Haarentfernung mit Zuckerpaste in Stettin?";
    de.faq_a7_html =
      'Bei SłodkoTu am rechten Ufer u. a. Achseln ab 49 PLN, ganze Beine ab 139 PLN, tiefes Bikini ab 129 PLN. Die vollständige <a href="cennik.html">Preisliste</a> finden Sie auf einer eigenen Seite — beim Buchen passen wir die Zonen an.';
    de.faq_q8 = "Wie lange hält die Haarentfernung mit Zucker?";
    de.faq_a8 =
      "Meist etwa 3–4 Wochen glatte Haut — je nach Zone, Haarzyklus und Regelmäßigkeit. Bei regelmäßigen Terminen wachsen die Haare oft feiner nach und es gibt weniger Eingewachsene.";
    de.faq_q3 = "Wie bereite ich mich auf Zuckerpaste vor?";
    de.faq_a3_html =
      'Saubere Haut, keine schweren Öle; Haar ca. 0,5 cm (kürzer als bei Wachs); am Vortag sanftes Peeling. Vollständige Liste: <a href="przygotowanie-do-wizyty.html">Vorbereitung Haarentfernung mit Zucker</a>.';
    de.faq_q9 = "Ist Haarentfernung mit Zuckerpaste wirksam?";
    de.faq_a9 =
      "Ja — die Paste entfernt das Haar mit der Wurzel; bei regelmäßigen Terminen wächst es oft feiner nach, weniger Eingewachsene. Ab ca. 0,5 cm Haarlänge — kürzer als bei Wachs.";
    de.faq_q4 = "Wie lange hält ein Spray-Tan?";
    de.faq_a4 =
      "Meist etwa 5–10 Tage schöner Glanz, je nach Pflege. Wir geben Tipps, damit die Farbe gleichmäßig ausklingt.";
    de.faq_q5 = "Wie bereite ich mich auf Spray-Tan vor?";
    de.faq_a5_html =
      '<p>Auf der Startseite finden Sie eine Kurzfassung unter <a href="#przygotowanie">„Vorbereitung auf den Besuch“</a>. Die vollständige Liste der Schritte vor und nach der Behandlung (TanExpert, u. a. Magic Eraser und Desert Rose) steht auf der Seite <a href="przygotowanie-do-wizyty.html">Vorbereitung auf den Besuch</a>.</p>';
    de.faq_q6 = "Wie buche ich?";
    de.faq_a6 =
      "Am schnellsten antworten wir per WhatsApp und Telefon — wir bestätigen den Termin und senden bei Bedarf Wegbeschreibung zum Studio am rechten Ufer. Wenn Sie selbst einen freien Slot wählen möchten: Booksy-Kalender (Link im Kontaktbereich). Auf Facebook können Sie schreiben, wenn der Link aktiv ist.";
    de.contact_line1_html =
      '<span class="contact-aside__ic" aria-hidden="true">◎</span> <a href="https://www.google.com/maps/search/?api=1&amp;query=53.38108%2C14.66285" target="_blank" rel="noopener noreferrer">ul. Jerzego Andrzejewskiego 29c, 70-779 Stettin (Prawobrzeże), Woiwodschaft Westpommern, Polen</a>';
    de.contact_hours_html =
      '<span class="contact-aside__ic" aria-hidden="true">⏰</span> <strong>Öffnungszeiten:</strong> Mo–Fr 10:00–21:00 · Wochenende (Sa–So) 10:00–16:00';
    de.contact_line_ig_html =
      '<span class="contact-aside__ic" aria-hidden="true">@</span> <a href="https://instagram.com/" rel="noopener noreferrer">Instagram</a>';
    de.contact_hint =
      "Schreiben Sie uns kurz, woher Sie kommen — dann konkretisieren wir die Anfahrt bis vor die Tür.";
    de.contact_trust =
      "Eine kurze erste Nachricht reicht. Wir antworten per WhatsApp und Telefon; Termine sind auch über Booksy möglich — ohne langes Formular auf dieser Seite.";
    de.contact_map_ph_html =
      'Die Karte (Google Maps) lädt hier nach <strong>Akzeptieren</strong> im Cookie-Hinweis — dann verbindet sich der Browser mit Google (wie beim Öffnen von Google Maps). <a href="https://www.google.com/maps/search/?api=1&amp;query=53.38108%2C14.66285" target="_blank" rel="noopener noreferrer">Standort in Google Maps öffnen</a>.';
    de.footer_index_html =
      '<strong class="brand-mark"><span class="brand-mark__slodko">Słodko</span><span class="brand-mark__tu">Tu</span></strong> — Haarentfernung mit Zucker Stettin · <a href="cennik.html">Preisliste</a> · Spray-Tan';
    de.footer_cennik_html =
      '<strong class="brand-mark"><span class="brand-mark__slodko">Słodko</span><span class="brand-mark__tu">Tu</span></strong> — Beauty-Studio Stettin rechtes Ufer · <a href="cennik.html">Preise</a>';
    de.footer_sub_html =
      '<strong class="brand-mark"><span class="brand-mark__slodko">Słodko</span><span class="brand-mark__tu">Tu</span></strong> — Beauty-Studio Stettin rechtes Ufer · <a href="index.html">Startseite</a> · <a href="cennik.html">Preise</a>';
    de.footer_legal_short_html =
      '<strong class="brand-mark"><span class="brand-mark__slodko">Słodko</span><span class="brand-mark__tu">Tu</span></strong> · <a href="index.html">Startseite</a>';
    de.footer_prep_html =
      '<strong class="brand-mark"><span class="brand-mark__slodko">Słodko</span><span class="brand-mark__tu">Tu</span></strong> · Beauty-Studio Stettin rechtes Ufer · <a href="index.html">Startseite</a> · <a href="cennik.html">Preise</a>';
    de.cookie_banner_html_index =
      'Google Fonts und die eingebettete Google-Maps-Karte laden erst nach <strong>Akzeptieren</strong>. <strong>Nur notwendige</strong> lässt die Seite ohne diese Elemente (den Standort können Sie im Kontakt trotzdem in Google Maps öffnen, ohne die Einbettung). <a href="polityka-cookies.html">Cookie-Richtlinie</a> · <a href="polityka-prywatnosci.html">Datenschutz</a>.';
    de.cookie_banner_html_cennik =
      'Google Fonts laden nach <strong>Akzeptieren</strong>. <strong>Nur notwendige</strong> nutzt Systemschriften. <a href="polityka-cookies.html">Cookies</a> · <a href="polityka-prywatnosci.html">Datenschutz</a>.';
    de.cookie_banner_html_short =
      'Google Fonts und Google-Maps-Einbettung nach <strong>Akzeptieren</strong>. Details: <a href="polityka-cookies.html">Cookie-Richtlinie</a> und <a href="polityka-prywatnosci.html">Datenschutz</a>.';
    de.cookie_banner_html_min =
      'Google Fonts und Google-Maps-Einbettung nach <strong>Akzeptieren</strong>. <a href="polityka-cookies.html">Cookies</a> · <a href="polityka-prywatnosci.html">Datenschutz</a>';
    de.legal_privacy_meta_html =
      'Gültig ab <time datetime="2026-05-11">11. Mai 2026</time>. Kurz und verständlich — bei Fragen schreiben oder anrufen, wir erklären es gern.';
    de.legal_cookies_meta_html =
      'Kurzbeschreibung für die Website <span class="brand-mark"><span class="brand-mark__slodko">Słodko</span><span class="brand-mark__tu">Tu</span></span>. Ab <time datetime="2026-05-11">11. Mai 2026</time>.';
    de.legal_terms_meta_html =
      'Gilt für Beauty-Leistungen im Studio <span class="brand-mark"><span class="brand-mark__slodko">Słodko</span><span class="brand-mark__tu">Tu</span></span>. Gültig ab <time datetime="2026-05-11">11. Mai 2026</time>.';
    de.cennik_sugar_h2 = "Haarentfernung mit Zucker — Preise Zuckerpaste";
    de.cennik_sugar_p1 =
      "Preisliste Zuckerpaste in Stettin (rechtes Ufer, SłodkoTu): sanfter als Wachs, auch empfindliche Haut und Bikini. Beliebte Zonen unten; voller Umfang in der ausklappbaren Liste.";
    de.cennik_full_h2 = "Vollständige Preisliste Haarentfernung Zuckerpaste Stettin";
    de.cennik_full_p =
      "Zuckerpaste — Frauen und Männer, Gesicht und Körper, Pakete Bikini + Beine. Kategorie aufklappen für alle Zonen und Preise.";
    de.prep_guide_h1 = "Vorbereitung Haarentfernung mit Zucker — Stettin";
    de.prep_guide_intro_html =
      'Ausführliche Tipps vor und nach Zuckerpaste und Spray-Tan bei SłodkoTu am rechten Ufer (TanExpert, MineTan). Kurzfassung auf der <a href="index.html#przygotowanie">Startseite</a>.';
    de.price_sugar_basic_label = "Beliebteste Zonen";
    de.price_sugar_basic_hint = "Beispielpreise ausgewählter Behandlungen.";
    de.price_sugar_pack_label = "Beliebteste Pakete";
    de.price_sugar_pack_hint = "Mehrere Zonen in einem ruhigen Termin.";
    de.price_row_underarms = "Achseln";
    de.price_row_legs = "Unterschenkel / Oberschenkel";
    de.price_row_legs_full_short = "Beine komplett";
    de.price_row_bikini_cl = "Klassischer Bikini";
    de.price_row_bikini_deep = "Tiefer Bikini";
    de.price_row_legs_full = "Beine komplett";
    de.price_row_combo1 = "Beine + klassischer Bikini";
    de.price_row_combo_ext = "Beine + erweiterter Bikini";
    de.price_row_combo2 = "Beine + tiefer Bikini";
    de.price_row_pack_neck_down = "Paket „von Hals abwärts“";
    de.price_amt_pachy = "ab 49 PLN";
    de.price_amt_lydki = "ab 120 PLN";
    de.price_amt_bikini_cl = "ab 99 PLN";
    de.price_amt_bikini_deep = "ab 129 PLN";
    de.price_amt_legs_full = "ab 139 PLN";
    de.price_amt_combo1 = "ab 199 PLN";
    de.price_amt_combo_ext = "ab 209 PLN";
    de.price_amt_combo2 = "ab 229 PLN";
    de.cennik_tan_h2 = "Spray-Tanning";
    de.cennik_tan_p1 =
      "Natürlicher Bräunungseffekt ohne UV und ohne Orangetöne. Den Farbton passen wir individuell an Haut und Wunschbild an, von dezentem Glow bis zu kräftigerer Bräune.";
    de.cennik_tan_p2 =
      "Nach der Behandlung erhalten Sie kurze Pflegehinweise, die helfen, das Ergebnis möglichst lange zu halten.";
    de.cennik_tan_h3 = "Zertifizierte Schulung und Premium-Produkte";
    de.cennik_tan_p3 =
      "Wir arbeiten mit Kosmetik und Geräten der Marken TanExpert und MineTan, entsprechend abgeschlossener Schulung im professionellen Spray-Tanning.";
    de.price_tan_overview_label = "Beliebte Anwendungen";
    de.price_tan_overview_hint = "Die häufigsten Varianten des Spray-Tannings.";
    de.price_row_tan_half = "Halbkörper";
    de.price_row_tan_whole = "Ganzer Körper";
    de.price_amt_tan_half = "ab 40 PLN";
    de.price_amt_tan_whole = "ab 80 PLN";
    de.cennik_acc_women_sum = "Preisliste: Frauen";
    de.cennik_acc_men_sum = "Preisliste: Männer";
    de.cennik_acc_bikini_sum = "Bikini-Varianten";
    de.cennik_acc_w_face = "Gesicht";
    de.cennik_acc_w_body = "Körper";
    de.cennik_acc_m_face = "Gesicht";
    de.cennik_acc_m_body = "Körper";
    de.cennik_acc_w_face_html =
      '<ul class="price-card__rows"><li><span class="price-card__name">Augenbrauen</span> <span class="price-card__amount">39 PLN · 10 Min.</span></li><li><span class="price-card__name">Oberlippe</span> <span class="price-card__amount">39 PLN · 10 Min.</span></li><li><span class="price-card__name">Kinn</span> <span class="price-card__amount">39 PLN · 10 Min.</span></li><li><span class="price-card__name">Brauenbögen</span> <span class="price-card__amount">39 PLN · 10 Min.</span></li><li><span class="price-card__name">Nasenspitze</span> <span class="price-card__amount">39 PLN · 10 Min.</span></li><li><span class="price-card__name">Hals</span> <span class="price-card__amount">39 PLN · 10 Min.</span></li><li><span class="price-card__name">Wangen</span> <span class="price-card__amount">39 PLN · 10 Min.</span></li><li><span class="price-card__name">Ohren</span> <span class="price-card__amount">39 PLN · 10 Min.</span></li><li><span class="price-card__name">Gesicht komplett mit Dekolleté</span> <span class="price-card__amount">199 PLN</span></li></ul>';
    de.cennik_acc_w_body_html =
      '<ul class="price-card__rows"><li><span class="price-card__name">Achseln</span> <span class="price-card__amount">49 PLN · 10 Min.</span></li><li><span class="price-card__name">Beine komplett</span> <span class="price-card__amount">139 PLN · 45 Min.</span></li><li><span class="price-card__name">Arme + Achseln + Hände + Finger</span> <span class="price-card__amount">149 PLN</span></li><li><span class="price-card__name">Beine komplett + Füße + Zehen</span> <span class="price-card__amount">179 PLN</span></li><li><span class="price-card__name">Gesäß</span> <span class="price-card__amount">69 PLN</span></li><li><span class="price-card__name">Bauch</span> <span class="price-card__amount">49 PLN</span></li><li><span class="price-card__name">Rücken</span> <span class="price-card__amount">69 PLN</span></li></ul>';
    de.cennik_acc_m_face_html =
      '<ul class="price-card__rows"><li><span class="price-card__name">Augenbrauen</span> <span class="price-card__amount">39 PLN</span></li><li><span class="price-card__name">Oberlippe</span> <span class="price-card__amount">39 PLN</span></li><li><span class="price-card__name">Kinn</span> <span class="price-card__amount">39 PLN</span></li><li><span class="price-card__name">Brauenbögen</span> <span class="price-card__amount">39 PLN</span></li><li><span class="price-card__name">Nasenspitze</span> <span class="price-card__amount">39 PLN</span></li><li><span class="price-card__name">Hals</span> <span class="price-card__amount">39 PLN</span></li><li><span class="price-card__name">Wangen</span> <span class="price-card__amount">39 PLN</span></li><li><span class="price-card__name">Ohren</span> <span class="price-card__amount">49 PLN</span></li><li><span class="price-card__name">Gesicht komplett mit Dekolleté</span> <span class="price-card__amount">199 PLN</span></li></ul>';
    de.cennik_acc_m_body_html =
      '<ul class="price-card__rows"><li><span class="price-card__name">Achseln</span> <span class="price-card__amount">69 PLN · 10 Min.</span></li><li><span class="price-card__name">Beine komplett</span> <span class="price-card__amount">219 PLN · 60 Min.</span></li><li><span class="price-card__name">Arme + Achseln + Hände + Finger</span> <span class="price-card__amount">219 PLN</span></li><li><span class="price-card__name">Beine komplett + Füße + Zehen</span> <span class="price-card__amount">239 PLN</span></li><li><span class="price-card__name">Rücken komplett</span> <span class="price-card__amount">199 PLN · 60 Min.</span></li><li><span class="price-card__name">Torso</span> <span class="price-card__amount">149 PLN · 30 Min.</span></li><li><span class="price-card__name">Rücken + Schultern</span> <span class="price-card__amount">249 PLN</span></li><li><span class="price-card__name">Rücken + Schultern + Torso</span> <span class="price-card__amount">359 PLN</span></li></ul>';
    de.cennik_acc_bikini_html =
      '<ul class="price-card__rows"><li><span class="price-card__name">Klassischer Bikini · 30 Min.</span> <span class="price-card__amount">99 PLN / mit Beinen 199 PLN</span></li><li><span class="price-card__name">Erweiterter Bikini · 30 Min.</span> <span class="price-card__amount">109 PLN / mit Beinen 209 PLN</span></li><li><span class="price-card__name">Teilweise + Streifen · 30 Min.</span> <span class="price-card__amount">109 PLN / mit Beinen 209 PLN</span></li><li><span class="price-card__name">Tiefer Bikini · 40 Min.</span> <span class="price-card__amount">129 PLN / mit Beinen 229 PLN</span></li><li><span class="price-card__name">Hollywood-Bikini · 45 Min.</span> <span class="price-card__amount">139 PLN / mit Beinen 239 PLN</span></li><li><span class="price-card__name">Hollywood + Muster · 45 Min.</span> <span class="price-card__amount">149 PLN / mit Beinen 249 PLN</span></li></ul>';
    de.cennik_acc_pack_sum = "Pakete, ein Termin";
    de.cennik_acc_pack_lead =
      "Mehrere Zonen in einem Gang, dieselben Pakete wie auf dem Flyer. Die Dauer klären wir bei der Buchung.";
    de.cennik_acc_pack_w = "Pakete: Frauen";
    de.cennik_acc_pack_m = "Pakete: Männer";
    de.cennik_acc_pack_bikini = "Bikini + Beine komplett";
    de.cennik_acc_pack_w_html =
      '<ul class="price-card__rows"><li><span class="price-card__name">Arme + Achseln + Hände + Finger</span> <span class="price-card__amount">149 PLN</span></li><li><span class="price-card__name">Beine komplett + Füße + Zehen</span> <span class="price-card__amount">179 PLN</span></li><li><span class="price-card__name">Paket „von Hals abwärts“</span> <span class="price-card__amount">individuelles Angebot</span></li></ul>';
    de.cennik_acc_pack_m_html =
      '<ul class="price-card__rows"><li><span class="price-card__name">Arme + Achseln + Hände + Finger</span> <span class="price-card__amount">219 PLN</span></li><li><span class="price-card__name">Beine komplett + Füße + Zehen</span> <span class="price-card__amount">239 PLN</span></li><li><span class="price-card__name">Rücken + Schultern</span> <span class="price-card__amount">249 PLN</span></li><li><span class="price-card__name">Rücken + Schultern + Torso</span> <span class="price-card__amount">359 PLN</span></li></ul>';
    de.cennik_acc_pack_bikini_html =
      '<ul class="price-card__rows"><li><span class="price-card__name">Beine + klassischer Bikini</span> <span class="price-card__amount">199 PLN</span></li><li><span class="price-card__name">Beine + erweiterter Bikini</span> <span class="price-card__amount">209 PLN</span></li><li><span class="price-card__name">Beine + Teil-Bikini + Streifen</span> <span class="price-card__amount">209 PLN</span></li><li><span class="price-card__name">Beine + tiefer Bikini</span> <span class="price-card__amount">229 PLN</span></li><li><span class="price-card__name">Beine + Hollywood-Bikini</span> <span class="price-card__amount">239 PLN</span></li><li><span class="price-card__name">Beine + Hollywood + Muster</span> <span class="price-card__amount">249 PLN</span></li></ul>';
    de.cennik_note_html =
      "<p>Die genannten Preise sind orientierend und können je nach Umfang der Behandlung variieren.</p><p>Wenn Sie unsicher sind, welche Variante passt, schreiben Sie uns per WhatsApp oder rufen Sie an, wir helfen bei der Auswahl.</p>";
    de.img_gallery_1 = "Studio-Innenraum — Leinen und weiches Licht";
    de.img_gallery_2 = "Zuckerpaste und Keramik im Behandlungsraum";
    de.img_gallery_3 = "Hautdetail im natürlichen Licht";
    de.img_gallery_4 = "Kleines Studio — ruhiger Moment vor der Behandlung";
    de.img_gallery_6 = "Gleichmäßiger, natürlicher Ton passend zur Haut";
    de.img_prep_left = "Zuckerpaste und Zubehör zur Haarentfernung bei SłodkoTu";
    de.img_prep_right = "Professionelle Spray-Tan-Ausstattung im Studio";
    de.img_about_cert =
      "Zertifikat für professionelles Spray-Tanning — Kosmetik und Geräte von TanExpert und MineTan";
    de.cred_eyebrow = "Vertrauen";
    de.cred_h2 = "Warum Kundinnen uns vertrauen";
    de.cred_lead =
      "Wir arbeiten mit professionellen, geprüften Produkten und bilden uns regelmäßig weiter — damit Sie von der ersten Behandlung an ruhig und sicher sind.";
    de.cred_badge = "Zertifizierte Schulung TanExpert & MineTan";
    de.cred_zoom_hint = "Größer ansehen";
    de.cred_thumb_aria = "Größere Ansicht des Schulungszertifikats öffnen";
    de.cred_lightbox_title = "Zertifikat — Vorschau";
    de.cred_lightbox_cap =
      "Schulung im Spray-Tanning — Kosmetik und Geräte von TanExpert und MineTan.";
    de.cred_close_aria = "Schließen";

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
