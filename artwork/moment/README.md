# MOMENT mural sources

`observatory.png` is the selected painting. `hillside.png` and
`crystal-cavern.png` are matching painted continuations. The source paintings
are 941 pixels wide. `scripts/build-moment-mural.py` blends them into one scene,
uses the included FSRCNN x4 model to reconstruct a 3840-pixel-wide version,
preserves source edges with a light detail blend, and cuts four tiles per source
painting. The twelve tiles in `public/` are the website assets.

Install `Pillow`, `numpy`, and `opencv-contrib-python-headless` to rebuild the
tiles. The FSRCNN model comes from Saafke's FSRCNN_Tensorflow project and is
distributed under the included Apache 2.0 license (`FSRCNN-LICENSE.txt`).

The reconstruction helps at large display sizes, but it does not turn the
original paintings into natively authored 4K artwork.
