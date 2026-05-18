# SłodkoTu (salon_kosmetyczny) — notes for AI coding agents

## What this is

- **Static multi-page site** for a beauty salon (PL + **i18n**): editorial light aesthetic, **Cloudflare Pages** workflow under `.github/workflows/`.
- **No bundler:** HTML + `css/styles.css` + ES modules / IIFE scripts in `js/`.

## File map

| Area | Path |
|------|------|
| Pages | `index.html`, `cennik.html`, `przygotowanie-do-wizyty.html`, legal pages, `404.html` |
| Global CSS | `css/styles.css` (`:root` tokens, Cormorant Garamond + Manrope) |
| Main behaviour | `js/main.js` |
| Site config (phones, social) | `js/site-config.js` — consumed by `main.js` (`window.SLODKOTU_SITE`) |
| i18n | `js/i18n.js`, `js/legal-i18n.js` |
| Cookies | `js/cookie-consent.js` |
| SEO | `sitemap.xml`, `robots.txt`, `_headers` |

## Conventions

- **Brand tokens:** `--ivory`, `--champagne`, `--gold`, `--brand-pink*`, `--chocolate*` in `:root`; **one radius** `--radius: 5px` (editorial sharp).
- **Typography:** display **Cormorant Garamond**; body **Manrope**; class `.script` = same serif italic (no separate handwriting font).
- **Motion:** `prefers-reduced-motion` reduces smooth scroll on `html` — extend the same pattern for new animations.
- **Contact:** WhatsApp / `tel:` / visible phone driven from **`site-config.js`** — keep `data-phone-display` and `wa.me` patterns when editing HTML.

## UI / UX detail

See **`docs/UI_UX.md`** (includes **Hero landing** + **Sekcje pod hero**).

## Polish context (business + scope)

See **`docs/KONTEKST_AI.md`**.

## Out of scope unless asked

- Replacing `site-config.js` with env secrets in CI without updating `main.js` expectations.
