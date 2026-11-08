# Accrete identity — working implementation

The owner selected Accrete, the tagline “See past the price,” and Variation 1 of the vertical seed logo. The mark is symmetrical with two deep-green halves, a narrow white opening, and a mint core. Implement it as SVG so its geometry remains crisp at small sizes. The supplied brand boards are visual references; the current SVG is the first implementation and should be reviewed against them.

Palette: deep pine `#073B2E`, emerald `#08C98A`, bright mint `#72F0C5`, black `#080B0A`, bright red `#FF304F`, white `#FFFFFF`. Inter is the working modern sans for both brand and interface. Red is reserved for meaningful market losses and alerts, not decoration.

The landing page uses a layered composition across the scroll: original deep-green mineral artwork behind a calm headline, one integrated product preview below, and an independent transparent foreground plane that crosses the product boundary. The product preview lets visitors inspect earnings, products, and industry, then practice a buy, hold, or sell decision. It is illustrative, not a lesson, market claim, or trading recommendation. Keep the teacher setup marked as a browser-local prototype until real accounts exist.

Motion follows the scroll through small differences in the background, product, and foreground positions. Evidence changes and decision feedback animate once in response to user input. There are no continuously looping decorative objects. Reduced-motion preference removes this movement. Preserve keyboard focus, touch targets, readable contrast, and mobile composition. The landing hero is dark; reading and operating surfaces are light.

Earlier Reign Forest & Mint and Hyper mockups are superseded by this direction. The product brief and approved functional behavior still apply.

## Design research and revision

The owner found the earlier hero crowded and its floating seed animation cheap. Research on [Cora](https://cora.computer/) showed a centered, spacious opening, one continuous illustrated background, a product preview introduced lower on the page, separate foreground art overlapping that preview, and a later foreground image sequence. The [Regards Cora gallery](https://www.regards.design/i/cora) also highlights its headline, sky, product, and lower review strip. The Accrete revision follows that spatial sequence with its own mineral art and product content; it does not reuse Cora's assets.

The downloaded single-file preview embeds both original Accrete image layers so it works without a server. The hosted private preview uses the same assets as separate files.
