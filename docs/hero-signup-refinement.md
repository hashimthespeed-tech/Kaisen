# Hero and teacher setup refinement

This is a layout refinement of the approved Forest & Mint identity on the existing teacher feature branch. It does not introduce authentication, student joining, live data, curriculum, or a new brand.

## Composition before implementation

Palette: forest `#072724`, deep surface `#0f3933`, mint `#97fcd7`, paper `#f5f8f7`, secondary text `#526d65`, border `#dce6e1`. Playfair Display remains the display family; Inter remains the interface family. Marketing gets expressive scale; forms get readable, compact hierarchy.

Landing primary path: understand classroom investing → inspect an explicitly illustrative portfolio → create a class. The secondary action scrolls to a product explanation instead of duplicating the primary destination. No invented logos, customer numbers, testimonials, or educational claims.

```text
Desktop landing
Reign                 How it works   Teacher preview
Investing, learned    [Student portfolio · sample data]
by doing.             [value + interactive period chart]
Classroom explanation [cash / holdings]
Create a class        [clear non-live-data caption]
See how it works
---------------------------------------------------
Portfolio            Learn              Play together
---------------------------------------------------
Teacher controls + working setup action

Teacher setup — all screen sizes
Reign                                  Back to Reign
            Details / Class / Review
            Start your teacher preview
            Name
            Email
            Concise local-preview explanation
            Back                 Continue
```

The previous concept's large promotional aside is removed from setup. Compact progress appears once. On mobile, the first field and Continue should fit in the initial 390 × 844 viewport, before opening the keyboard. Advanced class settings remain optional and scroll naturally.

The hero's memorable element is an actual interactive sample chart, not floating decoration. Its data is fictional and explicitly labeled. Period controls change the displayed sample period and chart; they do not simulate a live market or execute trades.

## Skill use

- Frontend Design: plan the hierarchy and content before code; preserve the owner-selected visual identity.
- Impeccable layout/distill: independent layout assessment plus mechanical scan of the incumbent implementation. Source scan was clear; the visual review identified mobile task order, duplicated hero actions, and competing setup headings.
- UI/UX Pro Max: targeted searches for responsive mobile layout and accessible form validation. Apply relevant results, not a generated replacement palette.
- Vercel Interface Guidelines: fresh rules and code review before delivery.
- Impeccable Polish: final pass after the structure works, followed by browser verification.

No further discovery is needed: find-skills already located the packages used in this pass.

## Final review and validation

Impeccable Polish was completed on the rendered landing, signup, class settings, review, and saved workspace. The pass unified back-arrow icons, removed a route-change color transition that briefly hid the logo, corrected light-section focus colors, improved input and switch contrast, and strengthened long-name wrapping. At 390 × 844, the first input and Continue both fit on screen without scrolling.

Fresh Vercel Web Interface Guidelines were fetched for the final source review. The source preserves semantic actions and navigation, input labels and error associations, native keyboard controls, and reduced-motion support. Review fixes are reflected in the final source:

- `src/styles.css`: control borders contrast at least 3.18:1 against their surfaces; muted text at least 5.26:1; green focus outline 3.80:1 against paper.
- `src/App.tsx`: email and ticker spellcheck disabled; consistent SVG back arrows; brand excluded from automatic translation.
- `src/Landing.tsx`: fictional chart has a description, accessible data table, keyboard-operable period buttons, and announced period changes.

Intentional exceptions: sentence case and the existing Inter/Playfair pairing preserve the approved design system. The manual Impeccable detector returned only seven repeated Inter-font warnings; these are intentional brand exceptions, not reasons to change the owner's chosen typography. The 600ms chart-stroke reveal is a small SVG animation, not a continuous animation; reduced motion disables it. Sample-chart selection and optional form disclosure remain local UI state in this prototype.

TypeScript checks, all 9 model/storage tests, the production build, and portable preview build passed. Chromium walkthrough passed creation, editing, back navigation, validation, failed saves, reload persistence, corrupt-data recovery, sample chart interaction, keyboard navigation, and reduced motion with no page errors. Responsive checks covered 320, 390, 720, 768, 1280, and 1440px; 720px checks equivalent reflow for a 1440px window at 200% zoom. These are browser-emulated sizes, not physical-device or cross-browser certification. Portable assets made no external requests.

Remaining product limits: no real signup/authentication, student joining, market feed, trading, lessons, or scheduled deposits. This feature is ready for owner review, not production launch. The richer particle/contour animation feature remains a separate later pass.
