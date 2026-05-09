# -*- coding: utf-8 -*-
"""
Wczytuje kafelki grid-6x4, usuwa biale ramki, dzieli kompozyty, zapisuje
do assets/moodboard/zweryfikowane/ z nazwami plikow (ASCII, czytelne).
Uruchom: python scripts/process_moodboard_named.py
"""
from __future__ import annotations

import re
from pathlib import Path

import numpy as np
from PIL import Image

SRC_DIR = Path(__file__).resolve().parent.parent / "assets" / "moodboard" / "grid-6x4"
OUT_DIR = Path(__file__).resolve().parent.parent / "assets" / "moodboard" / "zweryfikowane"


def lum(g: np.ndarray) -> np.ndarray:
    return (0.299 * g[..., 0] + 0.587 * g[..., 1] + 0.114 * g[..., 2]).astype(np.float32)


def trim_outer(rgb: np.ndarray) -> np.ndarray:
    if rgb.size == 0:
        return rgb
    g = lum(rgb)

    def row_gutter(i: int) -> bool:
        r = g[i, :]
        return float(np.mean(r >= 249)) > 0.93 and float(np.std(r)) < 14.0

    def col_gutter(j: int) -> bool:
        c = g[:, j]
        return float(np.mean(c >= 249)) > 0.93 and float(np.std(c)) < 14.0

    h, w = g.shape
    top, bottom, left, right = 0, h - 1, 0, w - 1
    while top < h and row_gutter(top):
        top += 1
    while bottom > top and row_gutter(bottom):
        bottom -= 1
    while left < w and col_gutter(left):
        left += 1
    while right > left and col_gutter(right):
        right -= 1
    return rgb[top : bottom + 1, left : right + 1]


def find_vertical_seam_band(g: np.ndarray, x0: float, x1: float, min_score: float = 0.62) -> int | None:
    """Szuk pionowego jasnego szwu miedzy x0*w a x1*w (ulamek szerokosci)."""
    h, w = g.shape
    lo, hi = max(2, int(w * x0)), min(w - 3, int(w * x1))
    if hi <= lo:
        return None
    best_x, best_s = None, 0.0
    for x in range(lo, hi):
        s = float(np.mean(g[:, x] >= 249))
        if s > best_s:
            best_s, best_x = s, x
    if best_x is None or best_s < min_score:
        return None
    x0s = best_x
    while x0s > 0 and float(np.mean(g[:, x0s - 1] >= 244)) > 0.5:
        x0s -= 1
    x1s = best_x
    while x1s < w - 1 and float(np.mean(g[:, x1s + 1] >= 244)) > 0.5:
        x1s += 1
    return (x0s + x1s) // 2


def find_vertical_seam(g: np.ndarray) -> int | None:
    h, w = g.shape
    if w < 48:
        return None
    lo, hi = int(w * 0.18), int(w * 0.82)
    best_x, best_s = None, 0.0
    for x in range(lo, hi):
        s = float(np.mean(g[:, x] >= 250))
        if s > best_s:
            best_s, best_x = s, x
    if best_x is None or best_s < 0.72:
        return None
    x0 = best_x
    while x0 > 0 and float(np.mean(g[:, x0 - 1] >= 246)) > 0.55:
        x0 -= 1
    x1 = best_x
    while x1 < w - 1 and float(np.mean(g[:, x1 + 1] >= 246)) > 0.55:
        x1 += 1
    return (x0 + x1) // 2


def find_horizontal_seam(g: np.ndarray) -> int | None:
    h, w = g.shape
    if h < 48:
        return None
    lo, hi = int(h * 0.18), int(h * 0.82)
    best_y, best_s = None, 0.0
    for y in range(lo, hi):
        s = float(np.mean(g[y, :] >= 250))
        if s > best_s:
            best_s, best_y = s, y
    if best_y is None or best_s < 0.72:
        return None
    y0 = best_y
    while y0 > 0 and float(np.mean(g[y0 - 1, :] >= 246)) > 0.55:
        y0 -= 1
    y1 = best_y
    while y1 < h - 1 and float(np.mean(g[y1 + 1, :] >= 246)) > 0.55:
        y1 += 1
    return (y0 + y1) // 2


def should_discard(rgb: np.ndarray) -> bool:
    if rgb.size == 0 or rgb.shape[0] < 16 or rgb.shape[1] < 16:
        return True
    g = lum(rgb)
    m, s = float(np.mean(g)), float(np.std(g))
    # prawie jednolite biale pole (pusty kwadrant)
    if s < 2.2 and m > 251:
        return True
    if s < 3.5 and m > 253.2:
        return True
    return False


def split_vertical(rgb: np.ndarray, cx: int, gutter: int = 4) -> tuple[np.ndarray, np.ndarray]:
    h, w = rgb.shape[:2]
    cx = max(gutter, min(w - gutter, cx))
    left = rgb[:, : max(1, cx - gutter)]
    right = rgb[:, min(w - 1, cx + gutter) :]
    return trim_outer(left), trim_outer(right)


def split_horizontal(rgb: np.ndarray, cy: int, gutter: int = 4) -> tuple[np.ndarray, np.ndarray]:
    h, w = rgb.shape[:2]
    cy = max(gutter, min(h - gutter, cy))
    top = rgb[: max(1, cy - gutter), :]
    bottom = rgb[min(h - 1, cy + gutter) :, :]
    return trim_outer(top), trim_outer(bottom)


def split_quad(rgb: np.ndarray, cx: int, cy: int, gutter: int = 5) -> list[np.ndarray]:
    h, w = rgb.shape[:2]
    cx = max(gutter, min(w - gutter, cx))
    cy = max(gutter, min(h - gutter, cy))
    tl = rgb[: cy - gutter, : cx - gutter]
    tr = rgb[: cy - gutter, cx + gutter :]
    bl = rgb[cy + gutter :, : cx - gutter]
    br = rgb[cy + gutter :, cx + gutter :]
    return [trim_outer(tl), trim_outer(tr), trim_outer(bl), trim_outer(br)]


def save_png(arr: np.ndarray, path: Path) -> None:
    Image.fromarray(arr).save(path, optimize=True)


# numer_kafelka -> pojedyncza nazwa LUB lista nazw dla czesci [0,1] lub [0,1,2,3] quad (TL,TR,BL,BR)
NAMES: dict[int, str | list[str]] = {
    1: "depilacja-cukrowa-pasta-lopatka-noga",
    2: ["depilacja-cukrowa-reka-na-nodze", "opalenizna-plecy-swiatlo-cienie"],
    3: "plecy-kobiece-spaghetti-swiatlo-naturalne",
    4: "opalanie-natryskowe-pistolet-mgielka",
    5: ["opalanie-natryskowe-pistolet-reka", "spa-szczotki-drewniane-reczniki-kwiaty"],
    6: "wellness-recznik-bawelna-detale",
    7: "still-life-wazon-swieca-cienie-listi",
    8: [
        "kompozyt-gora-lewy",
        "kompozyt-gora-prawy",
        "studio-lustro-zlote-stojace",
        "nogi-opalenizna-biala-posciel",
    ],
    9: "opalenizna-nogi-szata-biala-posciel",
    10: "glow-twarz-szyja-dekolt-swiatlo",
    11: ["opalenizna-ramie-szyja-glow", "stopa-gladka-biala-tkanina"],
    12: "nogi-skrzyzowane-opalenizna-len",
    13: "gabinet-zabiegowy-lozko-lustro-led",
    14: ["wnetrze-studio-lustro-kwiaty", "depilacja-cukrowa-lopatki-drewniane-sloik"],
    15: ["atmosfera-produkty-polka-bokeh", "recepcja-studio-lada-ryflowana"],
    16: ["recepcja-slodkotu-logo-sciana-lampy", "kosmetyki-slodkotu-butelki-taca"],
    17: [
        "kompozyt-gora-lewy",
        "kompozyt-gora-prawy",
        "produkty-slodkotu-swieca",
        "poczekalnia-fotel-rattan-zaslony",
    ],
    18: "poczekalnia-stolik-zloty-kwiaty-suszone",
    19: "lokalizacja-panorama-miasto-rzeka-most",
    20: ["fragment-nabrzeze-pionowy", "szczecin-nabrzeze-lodki-odra"],
    21: [
        "fragment-miasto-gora-lewy",
        "fragment-miasto-gora-prawy",
        "miasto-kosciol-czerwone-dachy-rzeka",
        "rzeka-las-spokoj-natura",
    ],
    22: [
        "zachod-slonca-rzeka-odbicie",
        "mapa-styl-minimal-rzeka-ulice",
    ],  # po lewej rzeka, po prawej mapa (split pionowy)
    23: "mapa-lokalizacja-slodkotu-pin",
    24: "makieta-ui-kontakt-przyciski",
}


def process_tile(path: Path) -> None:
    m = re.search(r"tile-(\d+)\.png$", path.name, re.I)
    if not m:
        return
    n = int(m.group(1))
    im = Image.open(path).convert("RGB")
    rgb = trim_outer(np.array(im))
    if rgb.size == 0:
        print("skip empty", path.name)
        return
    g = lum(rgb)
    h, w = g.shape
    cx_auto = find_vertical_seam(g)
    cy_auto = find_horizontal_seam(g)

    parts: list[np.ndarray] = []
    # Kafelki z wyraźnym krzyżem 2x2 — geometria na srodku (autodetekcja bywa zawodna)
    numeric_quad = n in (8, 17, 21) and w >= 80 and h >= 80
    if numeric_quad:
        parts = split_quad(rgb, w // 2, h // 2, gutter=6)
    else:
        quad = (
            cx_auto is not None
            and cy_auto is not None
            and 0.22 * h < cy_auto < 0.78 * h
            and 0.22 * w < cx_auto < 0.78 * w
        )
        if quad:
            parts = split_quad(rgb, cx_auto, cy_auto)
        elif cx_auto is not None:
            parts = list(split_vertical(rgb, cx_auto))
        elif cy_auto is not None:
            parts = list(split_horizontal(rgb, cy_auto))
        else:
            parts = [rgb]

        if quad and sum(1 for p in parts[:2] if not should_discard(p)) == 0 and cx_auto is not None:
            parts = list(split_vertical(rgb, cx_auto))

    # Kafel 20: panorama + waski pasek — szew blisko lewej krawedzi
    if n == 20 and len(parts) == 1:
        cx20 = find_vertical_seam_band(g, 0.06, 0.44, 0.52)
        if cx20 is not None:
            parts = list(split_vertical(rgb, cx20))
    # Kafel 22: rzeka + mapa — szew pionowy w srodku (jasna linia bywa slabo wykrywana)
    if n == 22 and len(parts) == 1 and w >= 120:
        parts = list(split_vertical(rgb, w // 2, gutter=5))

    names_spec = NAMES.get(n, f"tile-{n:02d}-nienazwany")

    for i, p in enumerate(parts):
        if should_discard(p):
            print(f"  pomijam tile-{n:02d} czesc-{i} (pusta/jasna {p.shape[1]}x{p.shape[0]})")
            continue
        if p.shape[0] < 56 or p.shape[1] < 56:
            print(f"  pomijam tile-{n:02d} czesc-{i} (za waski {p.shape[1]}x{p.shape[0]})")
            continue
        if isinstance(names_spec, str):
            base = names_spec if len(parts) == 1 else f"{names_spec}-czesc{i}"
        else:
            base = names_spec[i] if i < len(names_spec) else f"tile-{n:02d}-extra-{i}"
        if base.startswith("kompozyt-gora") and n in (8, 17):
            base = f"{base}-kafel-{n}"
        out_path = OUT_DIR / f"{base}.png"
        if out_path.exists():
            base = f"{base}-v2"
            out_path = OUT_DIR / f"{base}.png"
        save_png(p, out_path)
        print(f"  OK {out_path.name}  ({p.shape[1]}x{p.shape[0]})")


def main() -> None:
    OUT_DIR.mkdir(parents=True, exist_ok=True)
    for old in OUT_DIR.glob("*.png"):
        old.unlink()

    files = sorted(SRC_DIR.glob("tile-*.png"), key=lambda p: int(re.search(r"(\d+)", p.stem).group(1)))
    if not files:
        raise SystemExit(f"Brak PNG w {SRC_DIR}")

    for p in files:
        print(">>>", p.name)
        process_tile(p)

    print("\nGotowe:", OUT_DIR)


if __name__ == "__main__":
    main()
