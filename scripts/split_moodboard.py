"""
Wycina kafelki z arkusza mood board (ChatGPT) do osobnych plików PNG bez strat.
Uruchomienie: python scripts/split_moodboard.py
"""
from __future__ import annotations

import os
from pathlib import Path

from PIL import Image

SOURCE = Path(__file__).resolve().parent.parent / "ChatGPT Image May 9, 2026, 10_14_45 PM.png"
OUT_BASE = Path(__file__).resolve().parent.parent / "assets" / "moodboard"


def crop_grid(im: Image.Image, cols: int, rows: int, out_dir: Path, prefix: str) -> None:
    w, h = im.size
    assert w % cols == 0 and h % rows == 0, (w, h, cols, rows)
    cw, ch = w // cols, h // rows
    out_dir.mkdir(parents=True, exist_ok=True)
    n = 0
    for r in range(rows):
        for c in range(cols):
            n += 1
            left = c * cw
            upper = r * ch
            box = (left, upper, left + cw, upper + ch)
            tile = im.crop(box)
            name = f"{prefix}{n:02d}.png"
            tile.save(out_dir / name, optimize=True)
    print(f"Saved {n} files to {out_dir} ({cw}x{ch} px)")


def main() -> None:
    if not SOURCE.exists():
        raise SystemExit(f"Brak pliku: {SOURCE}")

    im = Image.open(SOURCE)
    if im.mode not in ("RGB", "RGBA"):
        im = im.convert("RGB")

    # 4×4 — większe kafelki (384×256), lepsze na sekcje / banery
    crop_grid(im, cols=4, rows=4, out_dir=OUT_BASE / "grid-4x4", prefix="img-")

    # 6×4 — kwadraty 256×256, więcej ujęć (24)
    crop_grid(im, cols=6, rows=4, out_dir=OUT_BASE / "grid-6x4", prefix="tile-")

    print("Done. Use grid-4x4 for larger crops; grid-6x4 for more tiles.")


if __name__ == "__main__":
    main()
