"""Package the built standalone preview for download from the feature branch.

Run npm run build:preview first, then python scripts/package-preview.py.
Only the standalone page and its font licenses belong in this review archive.
"""
from pathlib import Path
from zipfile import ZipFile, ZIP_DEFLATED

root = Path(__file__).resolve().parents[1]
source = root / 'dist-preview'
files = ['index.html', 'licenses/Inter.txt', 'licenses/Playfair-Display.txt']
for name in files:
    if not (source / name).is_file():
        raise SystemExit('Missing preview files. Run npm run build:preview first.')

destination = root / 'previews' / 'moment-night-observatory.zip'
destination.parent.mkdir(exist_ok=True)
with ZipFile(destination, 'w', ZIP_DEFLATED) as archive:
    for name in files:
        archive.write(source / name, name)
with ZipFile(destination) as archive:
    if archive.testzip() is not None:
        raise SystemExit('Preview archive failed its integrity check.')
print(f'Packaged {destination.relative_to(root)}')
