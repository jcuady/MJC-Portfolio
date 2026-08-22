"""Cut brand logos + hero portrait for the bento card.

Logos: flood-fill near-black to alpha (keeps forest-green ink).
Portrait: rembg subject cutout so the mint / dark card shows through.
"""
from collections import deque
from pathlib import Path

from PIL import Image
from rembg import remove

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "public" / "brand"
OUT.mkdir(parents=True, exist_ok=True)
SRC = Path(r"c:\Users\jcuad\OneDrive\Documents\Resume")


def is_black(r, g, b, max_ch=22, green_slack=10):
    if max(r, g, b) > max_ch:
        return False
    # Keep forest-green letter/shirt pixels (g ahead of r/b).
    if g - r >= green_slack and g - b >= 4:
        return False
    return True


def flood_alpha(im, max_ch=22):
    im = im.convert("RGBA")
    px = im.load()
    w, h = im.size
    seen = bytearray(w * h)
    q = deque()

    def idx(x, y):
        return y * w + x

    def push(x, y):
        if x < 0 or y < 0 or x >= w or y >= h:
            return
        i = idx(x, y)
        if seen[i]:
            return
        r, g, b, a = px[x, y]
        if a == 0 or not is_black(r, g, b, max_ch=max_ch):
            return
        seen[i] = 1
        q.append((x, y))

    for x, y in ((0, 0), (w - 1, 0), (0, h - 1), (w - 1, h - 1)):
        push(x, y)
    for x in range(0, w, max(1, w // 24)):
        push(x, 0)
        push(x, h - 1)
    for y in range(0, h, max(1, h // 24)):
        push(0, y)
        push(w - 1, y)

    while q:
        x, y = q.popleft()
        r, g, b, _ = px[x, y]
        px[x, y] = (r, g, b, 0)
        push(x + 1, y)
        push(x - 1, y)
        push(x, y + 1)
        push(x, y - 1)
    return im


logo_jobs = [
    (SRC / "logolight.png", OUT / "logo-light.png", 20),
    (SRC / "logodark.png", OUT / "logo-dark.png", 18),
]

for src, dest, thresh in logo_jobs:
    if not src.exists():
        raise SystemExit(f"missing {src}")
    out = flood_alpha(Image.open(src), max_ch=thresh)
    # ~3x CSS display (160x53) — sharp on retina, not multi-MB
    target_w = 480
    ratio = target_w / out.size[0]
    out = out.resize(
        (target_w, max(1, round(out.size[1] * ratio))),
        Image.Resampling.LANCZOS,
    )
    out.save(dest, "PNG", optimize=True)
    print(f"{dest.name} {out.size} mode={out.mode} {dest.stat().st_size}B")

portrait_src = SRC / "MJC.png"
if not portrait_src.exists():
    raise SystemExit(f"missing {portrait_src}")

cut = remove(Image.open(portrait_src).convert("RGBA"))
cut = cut.resize((900, 1125), Image.Resampling.LANCZOS)
png_path = OUT / "portrait.png"
webp_path = OUT / "portrait.webp"
cut.save(png_path, "PNG", optimize=True)
cut.save(webp_path, "WEBP", quality=85, method=6)
print(f"portrait.png {cut.size} {png_path.stat().st_size}B")
print(f"portrait.webp {webp_path.stat().st_size}B")
