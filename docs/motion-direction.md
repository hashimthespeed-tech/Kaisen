# Forest & Mint motion

This feature branches from the unapproved teacher preview because main does not exist yet. Neither feature is approved for main.

The owner's request is continuous ambient movement, premium light/shade behind content, and smooth entrances across the landing and teacher setup. Keep the existing forest #072724, surface #0f3933, mint #97fcd7, paper #f5f8f7, muted #526d65; Playfair display and Inter interface type.

Focal moment: two headline lines emerge from a soft crop as emerald light travels behind them; the sample portfolio settles alongside them. Fine rising contour paths suggest the many possible trajectories of an investment, without depicting market data or predicting returns. Ambient light continues slowly after the entrance.

Continuity: a quieter version of the light travels along the edges of the setup surface. Step headings enter quickly while the fields remain available. Lower landing sections use a heading reveal and a staggered row, not a forced scrolling sequence.

Feedback: buttons get a small directional icon movement; inputs keep immediate focus feedback. A persistent pause control stops decorative motion, including offscreen or background-tab animation. Reduced-motion users get the composed static version with all content visible.

Budget: no animation dependency, WebGL, pointer loop, or per-frame React updates. At most three composited gradient layers and one SVG contour group per visible atmosphere. Only transform and opacity loop. One-time entrances finish within 800ms; step changes within 280ms. IntersectionObserver suspends offscreen scenes. No parallax or scroll interception.

## Polish and verification

The final pass kept the decorative light quieter on form and reading surfaces, made the pause control part of the mobile header so it cannot cover fields, and preserved a contrasting focus outline on its light surface. The approved layout, copy, chart data, and class storage behavior remain intact.

The animation checks confirm that a gradient actually changes transform over time, pause removes motion, resume restarts it, offscreen scenes suspend, and lower sections become visible as they enter the viewport. Reduced motion disables both the scene and chart animations and exposes the static content. The browser walkthrough also covers signup validation, class creation, failed writes, edits, reload persistence, keyboard input, and 320–1440px reflow with no page errors. TypeScript, all 9 existing tests, and production/portable builds passed.

Frontend Design and Impeccable Animate/Polish guided this pass; fresh Vercel guidelines were reviewed. The one manual design scan returned only the seven existing Inter-font warnings, retained under the owner's approved typography. No new animation library or network asset was added. The portable download includes the full motion experience. Verification used Chromium and emulated viewports; physical-device frame rates and other browser engines have not been measured.
