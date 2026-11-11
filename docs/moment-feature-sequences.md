# MOMENT feature animation direction

The observatory mural is the page setting. A feature animation is a separate,
pre-rendered sequence that demonstrates something a student or teacher actually
does in MOMENT. Its rendered scene may use liquid-glass surfaces, physical depth,
lighting, and camera motion, but it must not borrow its subject from the mural.
CSS only handles page entrance and playback placement. The feature's 3D look and
motion live in the rendered frames.

## First sequence: Research a company

Start on a price-only view of one illustrative company in a single MOMENT
research screen. The camera moves close; the same screen gains depth as the
Earnings, Products, and Industry views become available. It ends on the full
company view, with the product interface readable. No report cards fly together
and no CSS line is drawn as the feature animation. This is the first sequence
to storyboard because the existing preview already exposes those three views.

## Later sequences

- **Make a practice decision:** show a situation pausing, a Buy/Hold/Sell and
  bounded-quantity choice in the product, then a neutral confirmation. The
  owner must provide any lesson or scenario content before rendering it.
- **Read a portfolio:** show a virtual purchase updating cash and holdings as
  distinct values in the portfolio interface. Do not imply a return or a
  real-money trade.

## Production and playback

Approve a small set of style-consistent keyframes before producing in-between
frames. Render a high-resolution master sequence, then encode the frames for
web playback so the visitor sees continuous motion without downloading dozens
of separate large image requests. Start when the sequence enters view, pause
when it leaves, and show a still frame for reduced motion or failed playback.
Keep the feature scene and its shadows within its own visual area; the mural
and clouds remain still behind the page.
