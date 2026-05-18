# SłodkoTu (salon_kosmetyczny) — specyfikacja UI / UX

Źródło: **`css/styles.css`** — `:root` + komponenty.

## 1. Charakter

- **Jasny editorial beauty:** tło **`--ivory`** / **`--cream`**, tekst **`--chocolate`**.
- **Marka:** róż **`--brand-pink*`** (nagłówek w wersji ciemniejszej `--brand-pink-header` dla kontrastu), złoto **`--gold`** / gradient **`--brand-tu-shine`** na słowo „Tu”.
- **Typografia:** **Cormorant Garamond** nagłówki; **Manrope** treść i UI.
- **„Script” bez osobnego fontu:** klasa **`.script`** = ten sam serif + **italic**.

## 2. Tokeny (skrót)

| Token | Rola |
|--------|------|
| `--ivory`, `--champagne`, `--cream`, `--cream-dark` | Tła i pasy |
| `--card` | Karty (#fffcfa) |
| `--blush`, `--blush-soft`, `--rose` | Akcenty ciepłe |
| `--gold`, `--gold-soft` | Linki domyślne, CTA, obramowania akcentów |
| `--chocolate`, `--chocolate-muted`, `--chocolate-deep` | Tekst i ciemne bloki |
| `--strip-h` | Delikatny poziomy gradient „pas” |
| `--radius` | **5px** — konsekwentnie ostre / premium |
| `--shadow-soft`, `--shadow-card` | Cienie kart |
| `--ease`, `--ease-out` | Cubic bez „twardego” snapu |
| `--focus-ring` | `color-mix` złota i czekolady — obramowanie `:focus-visible` |
| `--section-y` | `clamp(4.25rem, 8vw, 6.5rem)` — rytm sekcji |
| `--header-h` | 4.25rem — wysokość paska |
| `--dock-gap` | `max(0.75rem, env(safe-area-inset-bottom))` — dock na iOS |

## 3. Layout ciała

- **`body`:** `padding-bottom` duży na mobile (miejsce na **dock** CTA / nawigację), zmniejszony od **`min-width: 1024px`**.
- **Linki:** kolor `--gold`, hover `--chocolate`; `text-underline-offset: 0.2em`.

## 4. Motion

- **`prefers-reduced-motion`:** wyłącza `scroll-behavior: smooth` na `html` — nowe animacje dodawaj z tym samym media query.

## 5. Logo jako tło tymczasowe

- **`--logo-mark`** — `url("../Logo Słodko Tu.jpg")` — używane tam, gdzie nie ma jeszcze docelowych zdjęć; przy wymianie pliku zachowaj ścieżkę lub zaktualizuj CSS.

## 6. Konfiguracja treści kontaktowych

- Numery / WhatsApp / Instagram przez **`js/site-config.js`** + atrybuty w HTML (`data-phone-display`, klasy `.js-instagram-link`) — **nie** duplikuj numeru w 10 miejscach.

---

## 7. Hero landing (pierwszy ekran) — jak ma wyglądać i działać

**Cel:** od razu: **co to za miejsce** (beauty studio, lokalizacja), **główna usługa** w H1 (depilacja + spray tan), **lead** budujący spokój, **dwa CTA** (WhatsApp + cennik), **lista zaufania** (4 krótkie punkty), oraz **boczny rail** kontaktu (WA / tel / IG) bez zasłaniania treści.

**Struktura (`index.html`):**

- **`section.hero.hero--straddle`** z `aria-labelledby="hero-heading"`.
- **`.hero__media` → `.hero__visual`** — tło sekcji (rola `img` / `aria-label` z i18n); bez chaotycznego stocku; miękkie światło, spójne z marką „kameralnie”.
- **`.hero__bridge` → `.hero__bridge-inner` → `.hero__copy-col` → `.hero__editorial`:**
  - **`.hero__kicker`** — np. „Beauty studio · …” (i18n).
  - **`h1#hero-heading.hero__title`** — główna obietnica (może `<br>` dla łamania typografii); **jeden H1**.
  - **`.hero__lead`** — 2 zdania max, ton „bez presji”.
  - **`.hero__ctas`** — **`.btn.btn--solid`** (WhatsApp) + **`.btn.btn--outline`** (cennik); pierwszy = domyślna konwersja.
  - **`.hero__trust`** — `h2.visually-hidden` + **`ul.hero__trust-list`** z 4 `<li>` (konkret: studio, skóra, rezerwacja, dojazd).
- **`aside.contact-rail`** — ikony WA / tel / IG (IG sterowane z `site-config.js`).

**i18n:** wszystkie widoczne stringi hero przez **`data-i18n`** / `data-i18n-html` — nie wklejaj stałego PL w jednej wersji językowej bez kluczy.

**Czego unikać:** drugi H1; zbyt długi akapit w hero; brak CTA „Umów” w pierwszym ekranie na mobile (rail jest uzupełnieniem, nie zastępstwem).

---

## 8. Sekcje pod hero — spójność kolejnych bloków

- **Sekcje:** `section.section` + modyfikator (`section--about`, `section--credibility`, …) + **`section__inner`** tam gdzie jest we wzorcu — **nie mieszaj** `section__inner` z layoutem, który go nie przewiduje.
- **Nagłówki:** **`h2.section__title`** lub odpowiednik w komponencie; jeden główny H2 na sekcję; akapity z **`about__text`**, **`cred__lead`** itd. — ten sam rytm marginesów co w istniejących blokach.
- **Brand w tekście:** używaj **`.brand-mark`** / **`.script`** tam, gdzie już tak jest (np. podpis „Tu jesteś ważna”) — nie dodawaj nowego fontu skryptowego.
- **Komponenty złożone:** lightbox (`cred-lightbox`), FAQ, usługi — kopiuj **istniejący** wzorzec HTML + klasy z sąsiedniej sekcji zamiast nowych nazw.
- **Dock / safe area:** nowe fixed elementy na dole muszą uwzględniać **`env(safe-area-inset-bottom)`** jak w tokenach `--dock-gap`.

---

*Kontrast WCAG:** komentarz w CSS przy `--brand-pink-header` — przy zmianie kolorów marki sprawdź nagłówki na jasnym tle.*
