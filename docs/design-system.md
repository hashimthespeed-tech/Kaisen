# Accrete identity — working implementation

The owner selected Accrete, the tagline “See past the price,” and Variation 1 of the vertical seed logo. The mark is symmetrical with two deep-green halves, a narrow white opening, and a mint core. Implement it as SVG so its geometry remains crisp at small sizes. The supplied brand boards are visual references; the current SVG is the first implementation and should be reviewed against them.

Palette: deep pine `#073B2E`, emerald `#08C98A`, bright mint `#72F0C5`, black `#080B0A`, bright red `#FF304F`, white `#FFFFFF`. Inter is the working modern sans for both brand and interface. Red is reserved for meaningful market losses and alerts, not decoration.

The landing page uses a layered composition across the scroll: original deep-green mineral artwork behind a calm headline, one integrated product preview below, and an original, transparent volumetric glass form that travels through the hero and around the product preview. The product preview lets visitors inspect earnings, products, and industry, then practice a buy, hold, or sell decision. It is illustrative, not a lesson, market claim, or trading recommendation. Keep the teacher setup marked as a browser-local prototype until real accounts exist.

Motion follows the scroll through eased, visibly different travel in the background, product, and foreground planes. The glass moves more slowly than the page and grows subtly, staying visible while visitors pass it. The heading and product stay above the artwork, with spacing that keeps the heading clear. Headline lines, section text, and product content enter in reading order as they become visible; the illustrative chart draws when its evidence changes. There are no continuously looping decorative objects. Reduced-motion preference removes these effects. Preserve keyboard focus, touch targets, readable contrast, and mobile composition. The landing hero is dark; reading and operating surfaces are light.

Earlier Reign Forest & Mint and Hyper mockups are superseded by this direction. The product brief and approved functional behavior still apply.

## Design research and revision

The owner found the earlier hero crowded and its floating seed animation cheap. Research on [Cora](https://cora.computer/) showed a centered, spacious opening, one continuous illustrated background, a product preview introduced lower on the page, and separate foreground art overlapping that preview. Its published page code also shows that the major scroll moment is a pinned section: foreground and background sequences of 38 images advance together as scroll progresses. Its hero and background move only modestly. This explains why Accrete's first parallax-only revision did not recreate the intended depth.

[Refero's fintech collection](https://styles.refero.design/design-styles/fintech-websites) favors clear hierarchy and restrained color around financial information. [Awwwards' MindMarket entry](https://www.awwwards.com/sites/mindmarket) highlights a path that develops on scroll and cards that stack. Accrete combines those ideas in one original pinned chapter: earnings, products, and industry move together into a practice scenario while the page stays in place. It uses DOM layers instead of copied Cora frames or assets, and the evidence remains legible in the interactive preview above.

The top transition uses one detailed glass cutout across the hero and showcase, with a soft exit into the next section. The earlier repeated glass strip at the bottom was removed. The downloaded single-file preview embeds the Accrete image layers so it works without a server. The hosted private preview uses the same assets as separate files.
