"""Build twelve 3840px-wide web tiles from the approved observatory mural."""

from pathlib import Path

import cv2  # Requires opencv-contrib-python-headless for dnn_superres.
import numpy as np
from PIL import Image, ImageFilter


ROOT = Path(__file__).resolve().parents[1]
SOURCE = ROOT / "artwork" / "moment"
OUTPUT = ROOT / "public"
FILES = ["observatory.png", "hillside.png", "crystal-cavern.png"]
OVERLAP = 180
TILES_PER_SCENE = 4
TARGET_WIDTH = 3840


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

    # The trained FSRCNN model reconstructs detail across the entire mural before
    # cutting it. This keeps every boundary pixel identical between neighboring tiles.
    prepared = mural.resize((TARGET_WIDTH // 4, round(height * (TARGET_WIDTH // 4) / width)), Image.Resampling.LANCZOS)
    upscaler = cv2.dnn_superres.DnnSuperResImpl_create()
    upscaler.readModel(str(SOURCE / "FSRCNN_x4.pb"))
    upscaler.setModel("fsrcnn", 4)
    upscaler_image = upscaler.upsample(cv2.cvtColor(np.asarray(prepared), cv2.COLOR_RGB2BGR))
    learned = Image.fromarray(cv2.cvtColor(upscaler_image, cv2.COLOR_BGR2RGB))
    source_detail = prepared.resize(learned.size, Image.Resampling.LANCZOS)
    source_detail = source_detail.filter(ImageFilter.UnsharpMask(radius=1.0, percent=90, threshold=2))
    mural = Image.blend(learned, source_detail, 0.6)

    # Four tiles per source painting; boundaries fall at the center of each blend.
    scene_edges = [0, scenes[0].height - OVERLAP // 2,
                   scenes[0].height + scenes[1].height - 3 * OVERLAP // 2, height]
    scene_edges = [round(edge * mural.height / height) for edge in scene_edges]
    index = 0
    for region in range(len(scenes)):
        start, end = scene_edges[region:region + 2]
        for part in range(TILES_PER_SCENE):
            tile_top = round(start + (end - start) * part / TILES_PER_SCENE)
            tile_bottom = round(start + (end - start) * (part + 1) / TILES_PER_SCENE)
            tile = mural.crop((0, tile_top, mural.width, tile_bottom))
            index += 1
            tile.save(OUTPUT / f"moment-mural-{index:02d}.webp", "WEBP", quality=95, method=6)
            print(f"moment-mural-{index:02d}.webp: {tile.width} x {tile.height}", flush=True)


if __name__ == "__main__":
    main()
