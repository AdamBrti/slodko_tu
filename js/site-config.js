/**
 * Jedno miejsce na dane kontaktowe i lokalizację (zgodne z pinezką Google Business).
 * publicSiteUrl: kanoniczny adres strony (zgodny z linkiem canonical w index.html i wpisami w sitemap.xml).
 * instagramUrl / facebookUrl / booksyUrl: pełny URL lub null — wtedy dany link (i powiązany wiersz / przycisk w kontakcie) jest ukryty.
 * googleMapsOpenUrl: profil miejsca SłodkoTu w Google Maps (pinezka właścicielki).
 * googleMapsEmbedUrl: osadzenie mapy z widoczną nazwą miejsca (po zgodzie w banerze cookies).
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
    addressStreet: "ul. Jerzego Andrzejewskiego 29",
    addressPostalCode: "70-786",
    addressLocality: "Szczecin",
    addressNeighborhood: "Prawobrzeże",
    addressRegion: "woj. zachodniopomorskie",
    geoLat: 53.3814319,
    geoLng: 14.6637454,
    googleMapsPlaceFeatureId: "0x4700a74aa80400e9:0x4309af3d3ed2a351",
    googleMapsOpenUrl: "https://maps.app.goo.gl/TydezwR44vfidsL5A",
  };

  var fid = window.SLODKOTU_SITE.googleMapsPlaceFeatureId;
  var fidPb = fid.replace(":", "%3A");
  var lat = window.SLODKOTU_SITE.geoLat;
  var lng = window.SLODKOTU_SITE.geoLng;
  window.SLODKOTU_SITE.googleMapsEmbedUrl =
    "https://maps.google.com/maps?q=" +
    encodeURIComponent("SłodkoTu, " + window.SLODKOTU_SITE.addressStreet + ", " + window.SLODKOTU_SITE.addressPostalCode + " " + window.SLODKOTU_SITE.addressLocality) +
    "&ll=" +
    lat +
    "%2C" +
    lng +
    "&z=17&hl=pl&output=embed";
  window.SLODKOTU_SITE.googleMapsReviewsUrl =
    "https://www.google.com/maps/place/S%C5%82odkoTu/@" +
    lat +
    "," +
    lng +
    ",17z/data=!4m8!3m7!1s" +
    fidPb +
    "!8m2!3d" +
    lat +
    "!4d" +
    lng +
    "!9m1!1b1";
})();
