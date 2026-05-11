/**
 * Jedno miejsce na dane kontaktowe. Podmień na produkcyjne przed publiką.
 * publicSiteUrl: kanoniczny adres strony (zgodny z linkiem canonical w index.html i wpisami w sitemap.xml).
 * instagramUrl / facebookUrl / booksyUrl: pełny URL lub null — wtedy dany link (i powiązany wiersz / przycisk w kontakcie) jest ukryty.
 * googleMapsOpenUrl / googleMapsEmbedUrl: lokalizacja studia (Prawobrzeże) — link zewnętrzny i ramka po zgodzie w banerze cookies.
 */
(function () {
  window.SLODKOTU_SITE = {
    publicSiteUrl: "https://slodkotu.pl",
    phoneWaDigits: "48796579332",
    phoneTel: "+48796579332",
    phoneDisplay: "+48 796 579 332",
    instagramUrl: null,
    facebookUrl: null,
    booksyUrl: "https://booksy.com/pl-pl/dl/show-business/345831",
    googleMapsOpenUrl:
      "https://www.google.com/maps/search/?api=1&query=53.38108%2C14.66285",
    googleMapsEmbedUrl:
      "https://maps.google.com/maps?q=53.38108%2C14.66285&z=17&hl=pl&output=embed",
  };
})();
