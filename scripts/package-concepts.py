"""Package three separate offline hero concepts and a comparison index."""
from pathlib import Path
from zipfile import ZipFile, ZIP_DEFLATED
root = Path(__file__).resolve().parents[1]
html = (root / 'dist-preview/index.html').read_text()
entries = [('index.html', '/concepts'), ('A-sculpture.html', '/concept/sculpture'), ('B-decision.html', '/concept/decision'), ('C-world.html', '/concept/world')]
readme = '''REIGN — THREE HERO CONCEPTS

Extract this entire ZIP, then open index.html in a modern browser.
You can also open each concept separately:

A-sculpture.html — Original emerald ribbon sculpture. Move your pointer or select Another perspective.
B-decision.html — Pause the moment, select a path, then watch the scene respond.
C-world.html — Select one of the fictional businesses or rotate the miniature world.

The portfolio preview is below each hero. Teacher setup still works as a local prototype.
The three concepts are alternatives for review, not a final selection. No real accounts,
market data, investment lessons, answer keys, or financial outcomes are provided.

The preview is self-contained and does not download scripts, textures, or fonts.
3D requires WebGL; a static fallback appears when unavailable. Pause motion is available,
and system reduced-motion preferences are respected. Screenshots are in the screenshots folder.

Font and Three.js license notices are in licenses. All scene geometry is original.
'''
destination = root / 'previews/reign-hero-concepts.zip'
with ZipFile(destination, 'w', ZIP_DEFLATED) as archive:
    for filename, route in entries:
        bootstrap = '<script>if(!location.hash)location.hash=' + repr('#' + route) + ';</script>'
        archive.writestr(filename, html.replace('</head>', bootstrap + '</head>'))
    archive.writestr('READ-ME.txt', readme)
    for path in sorted((root / 'public/licenses').glob('*.txt')):
        archive.write(path, 'licenses/' + path.name)
    for name in ['comparison', 'sculpture-desktop', 'decision-desktop', 'world-desktop']:
        image = root / 'artifacts/concepts' / (name + '.png')
        if not image.is_file(): raise SystemExit('Run scripts/concept-check.py before packaging.')
        archive.write(image, 'screenshots/' + image.name)
with ZipFile(destination) as archive:
    assert archive.testzip() is None
print(f'Packaged {destination.relative_to(root)} ({destination.stat().st_size // 1024} KiB)')
