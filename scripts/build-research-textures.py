"""Produce legible illustrative page textures for the MOMENT research folio."""

from pathlib import Path

from PIL import Image, ImageDraw, ImageFont, ImageOps


ROOT = Path(__file__).resolve().parents[1]
ART = ROOT / "artwork" / "research-folio"
OUT = ART / "textures"
OUT.mkdir(parents=True, exist_ok=True)
W, H = 1600, 1900
INK = "#142b4c"
BLUE = "#245a99"
MUTED = "#667c99"
LINE = "#d4dfeb"
PAPER = "#f6f8fb"
FONT_DIR = Path("/usr/share/fonts/opentype/urw-base35")
REG = FONT_DIR / "NimbusSans-Regular.otf"
BOLD = FONT_DIR / "NimbusSans-Bold.otf"


def font(size: int, bold: bool = False) -> ImageFont.FreeTypeFont:
    return ImageFont.truetype(str(BOLD if bold else REG), size)


def base(title: str, subtitle: str) -> tuple[Image.Image, ImageDraw.ImageDraw]:
    im = Image.new("RGB", (W, H), PAPER)
    d = ImageDraw.Draw(im)
    d.ellipse((96, 96, 175, 175), fill=INK)
    d.ellipse((124, 82, 181, 157), fill=PAPER)
    d.text((203, 91), "MOMENT", font=font(58, True), fill=INK)
    d.text((100, 220), "COMPANY RESEARCH  /  ILLUSTRATIVE", font=font(32, True), fill=MUTED)
    d.line((100, 285, 1500, 285), fill=LINE, width=3)
    d.text((100, 342), title, font=font(112, True), fill=INK)
    d.text((105, 488), subtitle, font=font(42), fill=MUTED)
    d.line((100, 1770, 1500, 1770), fill=LINE, width=3)
    d.text((100, 1810), "A wider view before a virtual decision.", font=font(31), fill=MUTED)
    return im, d


def overview() -> None:
    im, d = base("Company overview", "Look beyond a price alone.")
    source = Image.open(ART / "building-illustration.png").convert("RGB")
    photo = ImageOps.fit(source, (1400, 820), method=Image.Resampling.LANCZOS)
    mask = Image.new("L", photo.size, 0)
    ImageDraw.Draw(mask).rounded_rectangle((0, 0, 1399, 819), radius=38, fill=255)
    im.paste(photo, (100, 625), mask)
    d.rounded_rectangle((100, 1500, 1500, 1685), radius=30, fill="#e9eff7")
    d.text((150, 1543), "Earnings", font=font(42, True), fill=INK)
    d.text((608, 1543), "Products", font=font(42, True), fill=INK)
    d.text((1082, 1543), "Industry", font=font(42, True), fill=INK)
    im.save(OUT / "overview.png", optimize=True)


def earnings() -> None:
    im, d = base("Earnings", "Explore the financial context.")
    d.rounded_rectangle((95, 650, 1505, 1330), radius=42, fill="#ebf1f9")
    for y in (810, 970, 1130):
        d.line((185, y, 1415, y), fill="#cfdaea", width=3)
    heights = (205, 270, 245, 345, 310, 425, 500)
    for i, height in enumerate(heights):
        x = 230 + i * 165
        d.rounded_rectangle((x, 1230 - height, x + 72, 1230), radius=16, fill="#9ebce1" if i < 5 else BLUE)
    d.text((150, 1390), "Illustrative view  •  No live market data", font=font(31), fill=MUTED)
    for i, label in enumerate(("Revenue", "Margins", "Cash flow")):
        y = 1490 + i * 80
        d.text((110, y), label, font=font(38, True), fill=INK)
        d.rounded_rectangle((590, y + 14, 1420, y + 42), radius=14, fill="#d8e3f0")
        d.rounded_rectangle((590, y + 14, 930 + i * 155, y + 42), radius=14, fill="#6c99c9")
    im.save(OUT / "earnings.png", optimize=True)


def products() -> None:
    im, d = base("Products", "Explore what the company makes.")
    for x, y, title in ((100, 650, "Product view"), (830, 650, "People and use")):
        d.rounded_rectangle((x, y, x + 670, y + 750), radius=42, fill="#e9eff7")
        d.text((x + 52, y + 55), title, font=font(45, True), fill=INK)
        d.rounded_rectangle((x + 95, y + 190, x + 575, y + 500), radius=24, fill="#c5d5e7")
        d.rounded_rectangle((x + 125, y + 220, x + 545, y + 455), radius=18, fill="#466c9b")
        d.rounded_rectangle((x + 160, y + 250, x + 510, y + 422), radius=12, fill="#9fbad8")
        d.line((x + 95, y + 535, x + 575, y + 535), fill="#bfccda", width=12)
        d.line((x + 95, y + 590, x + 480, y + 590), fill="#d0dce9", width=12)
    d.text((110, 1510), "Products are one part of the company story.", font=font(42), fill=MUTED)
    im.save(OUT / "products.png", optimize=True)


def industry() -> None:
    im, d = base("Industry", "See the wider setting.")
    d.rounded_rectangle((100, 650, 1500, 1450), radius=42, fill="#e9eff7")
    d.ellipse((280, 760, 900, 1380), fill="#c7d9ee")
    d.arc((280, 760, 900, 1380), 225, 345, fill=BLUE, width=105)
    d.arc((280, 760, 900, 1380), 5, 120, fill="#7da9d5", width=105)
    d.ellipse((445, 925, 735, 1215), fill="#e9eff7")
    for i, label in enumerate(("Category", "Competition", "Change")):
        y = 840 + 175 * i
        d.ellipse((1015, y + 10, 1050, y + 45), fill=(BLUE, "#7da9d5", "#b5cbe3")[i])
        d.text((1085, y), label, font=font(41, True), fill=INK)
    d.text((110, 1520), "Illustrative diagram  •  No market ranking", font=font(35), fill=MUTED)
    im.save(OUT / "industry.png", optimize=True)


def cover() -> None:
    im = Image.new("RGB", (W, H), "#101f37")
    d = ImageDraw.Draw(im)
    d.rounded_rectangle((110, 110, 1490, 1790), radius=38, outline="#a6afbd", width=5)
    d.ellipse((680, 620, 920, 860), fill="#c4cbd0")
    d.ellipse((770, 575, 955, 805), fill="#101f37")
    d.text((535, 980), "MOMENT", font=font(118, True), fill="#d5d9da")
    d.text((555, 1120), "COMPANY RESEARCH", font=font(39, True), fill="#8898ab")
    im.save(OUT / "cover.png", optimize=True)


if __name__ == "__main__":
    cover()
    overview()
    earnings()
    products()
    industry()
    print("Research folio textures written to", OUT)
