"""Quick analysis of mood board sheet for grid detection."""
from PIL import Image
import numpy as np

path = r"d:\Moej stronki\salon_kosmetyczny\ChatGPT Image May 9, 2026, 10_14_45 PM.png"
im = Image.open(path).convert("RGB")
a = np.array(im)
h, w = a.shape[:2]
col = a.mean(axis=(0, 2))
row = a.mean(axis=(1, 2))
cd = np.abs(np.diff(col))
rd = np.abs(np.diff(row))
print("size", w, h)
# find strong vertical transitions (possible gutters)
for ncols in (3, 4, 5, 6, 8):
    if w % ncols == 0:
        print("ncols", ncols, "cell_w", w // ncols)
for nrows in (3, 4, 5, 6, 8):
    if h % nrows == 0:
        print("nrows", nrows, "cell_h", h // nrows)
