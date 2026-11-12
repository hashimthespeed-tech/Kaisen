# MOMENT landing direction

MOMENT is the provisional name for the classroom investing experience. The landing page starts with the owner's selected night observatory illustration. Two matching painted continuations take the view down the path, across a cutaway rock face, and into a restrained crystal cavern. `scripts/build-moment-mural.py` blends the source paintings from `artwork/moment/`, reconstructs the mural with an FSRCNN 4× model, and cuts four pieces from each painting: twelve adjacent 3840px-wide WebP tiles. They must render as one continuous vertical mural, with no background switch, independent motion, or visible seam. The original 941px paintings remain the source; the 4K tiles are learned upscales, not newly painted 4K originals.

The hero and small interactive product preview stay at the top. The first feature demonstration now follows: an animated 3D research folio. The clouds painted into the chosen image stay fixed in that composition. The separate cloud cutout had a visible rectangular edge and has been removed. The earlier telescope and three-card sequence are rejected and are absent from this review.

Use midnight navy, moonlight white, and restrained warm amber for the landing presentation. Keep headline copy short, consistently aligned, and in title case; keep the product preview readable and the background visible around both. On mobile, crop the same mural toward the moon, observatory, and crystal detail. Product values and decisions are illustrative and virtual.

On entry, the night scene clears from a brief dark veil while the headline resolves into focus and the preview settles in. The mural and its painted clouds never move. Reduce Motion removes the entrance choreography.

3D feature demonstrations belong in a separate visual space from the mural. They must show actual MOMENT product experiences, such as researching a company, making a virtual situation decision, or reviewing a portfolio. The Research folio is a textured GLB with a keyframed hinge and an editorial studio stage; a rendered still supports loading, reduced motion, and failed WebGL. The mural continues uninterrupted behind the stage. Do not invent lessons, market facts, or scenario outcomes for these assets.

The feature storyboards and playback approach are in `docs/moment-feature-sequences.md`.
