"""Build seven seamless web tiles from the approved observatory mural and extensions."""

from pathlib import Path

from PIL import Image, ImageFilter


ROOT = Path(__file__).resolve().parents[1]
SOURCE = ROOT / "artwork" / "moment"
OUTPUT = ROOT / "public"
FILES = ["observatory.png", "hillside.png", "crystal-cavern.png"]
OVERLAP = 180
TILES = 7


def main() -> None:
    scenes = [Image.open(SOURCE / name).convert("RGB") for name in FILES]
    width = scenes[0].width
    assert all(scene.width == width for scene in scenes)
    height = sum(scene.height for scene in scenes) - OVERLAP * (len(scenes) - 1)
    mural = Image.new("RGB", (width, height))

    top = 0
    for index, scene in enumerate(scenes):
        if index == 0:
            mural.paste(scene, (0, top))
        else:
            for row in range(OVERLAP):
                existing = mural.crop((0, top + row, width, top + row + 1))
                arriving = scene.crop((0, row, width, row + 1))
                blend = Image.blend(existing, arriving, (row + 1) / (OVERLAP + 1))
                mural.paste(blend, (0, top + row))
            mural.paste(scene.crop((0, OVERLAP, width, scene.height)), (0, top + OVERLAP))
        top += scene.height - OVERLAP

    # Scale before cutting, so neighboring edges share the exact same sampling.
    mural = mural.resize((width * 2, height * 2), Image.Resampling.LANCZOS)
    mural = mural.filter(ImageFilter.UnsharpMask(radius=1.1, percent=65, threshold=3))
    for index in range(TILES):
        start = round(mural.height * index / TILES)
        end = round(mural.height * (index + 1) / TILES)
        tile = mural.crop((0, start, mural.width, end))
        tile.save(OUTPUT / f"moment-mural-{index + 1:02d}.webp", "WEBP", quality=92, method=6)
        print(f"moment-mural-{index + 1:02d}.webp: {tile.width} x {tile.height}")


if __name__ == "__main__":
    main()
