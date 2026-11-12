# MOMENT feature animation direction

The observatory mural is the fixed page setting. A feature animation is a
separate physical scene that demonstrates something a student or teacher
actually does in MOMENT. The first feature now uses a genuine GLB model with
keyframed motion, materials, and mapped research views. It does not borrow its
subject from the mural. A still render supports reduced motion and failed
WebGL playback.

## First sequence: Research a company

Demonstrate the move from price alone to a fuller company view, making
Earnings, Products, and Industry visible without inventing market facts. End
with a readable MOMENT research experience. No report cards fly together and
no CSS line is drawn as the feature animation. This is the first sequence to
storyboard because the existing preview already exposes those three views.

### Visual draft A: research folio

The first visual exploration is one bound research folio in a pale studio. Its
navy cover opens, a translucent page turns, and the company overview appears.
These were the **visual reference frames**, not the delivered asset. The source
UI capture is `previews/moment-research-reference.png`.

1. [Closed folio](../previews/research-storyboard/01-closed.png)
2. [Page turning](../previews/research-storyboard/02-page-turn.png)
3. [Open research view](../previews/research-storyboard/03-open.png)

The editable Blender build is `scripts/build-research-folio.py`, with page
textures built by `scripts/build-research-textures.py`. The GLB lives at
`public/moment-research-folio.glb`; `src/ResearchFolio.tsx` plays the real
hinge animation. The page visuals are illustrative, with no market claims.

## Later sequences

- **Make a practice decision:** show a situation pausing, a Buy/Hold/Sell and
  bounded-quantity choice in the product, then a neutral confirmation. The
  owner must provide any lesson or scenario content before rendering it.
- **Read a portfolio:** show a virtual purchase updating cash and holdings as
  distinct values in the portfolio interface. Do not imply a return or a
  real-money trade.

## Production and playback

Build and inspect the 3D source at the beginning, middle, and end of its
animation. Keep the feature scene and its shadows within its own visual area;
the mural and clouds remain still behind the page. A Meshy or other specialist
asset can replace the model later if an art-direction review calls for it.
