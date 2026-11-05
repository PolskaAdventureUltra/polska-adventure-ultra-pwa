# Generuje ikony aplikacji i ekran startowy Androida z logo (../icons/icon-512.png).
# Uruchom z katalogu native/:  python3 scripts/make-icons.py
from PIL import Image, ImageDraw
import glob

src = Image.open('../icons/icon-512.png').convert('RGBA')
res = 'android/app/src/main/res'
dens = {'mdpi': 1, 'hdpi': 1.5, 'xhdpi': 2, 'xxhdpi': 3, 'xxxhdpi': 4}

def on_white(img):
    bg = Image.new('RGBA', img.size, (255, 255, 255, 255))
    bg.alpha_composite(img)
    return bg

for d, f in dens.items():
    s = round(48 * f)
    sq = on_white(src.resize((s, s), Image.LANCZOS))
    sq.convert('RGB').save(f'{res}/mipmap-{d}/ic_launcher.png')
    mask = Image.new('L', (s, s), 0)
    ImageDraw.Draw(mask).ellipse((0, 0, s - 1, s - 1), fill=255)
    rnd = Image.new('RGBA', (s, s), (0, 0, 0, 0))
    rnd.paste(sq, (0, 0), mask)
    rnd.save(f'{res}/mipmap-{d}/ic_launcher_round.png')
    fs, ls = round(108 * f), round(70 * f)  # adaptive: logo w strefie bezpiecznej
    fg = Image.new('RGBA', (fs, fs), (0, 0, 0, 0))
    fg.alpha_composite(src.resize((ls, ls), Image.LANCZOS), ((fs - ls) // 2, (fs - ls) // 2))
    fg.save(f'{res}/mipmap-{d}/ic_launcher_foreground.png')

for p in glob.glob(f'{res}/drawable*/splash.png'):
    w, h = Image.open(p).size
    ls = int(min(w, h) * 0.45)
    sp = Image.new('RGBA', (w, h), (255, 255, 255, 255))
    sp.alpha_composite(src.resize((ls, ls), Image.LANCZOS), ((w - ls) // 2, (h - ls) // 2))
    sp.convert('RGB').save(p)
print('ikony i splash gotowe')
