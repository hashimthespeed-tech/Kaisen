# Reign: landing and signup design review

Research date: October 31, 2026, America/Los_Angeles.

The owner accepts that class creation works but finds the hero and signup impractical. Preserve Forest & Mint; improve the information hierarchy and journey before adding more visual effects. This review does not approve merging the current feature into main.

## Evidence and limits

I interpret “Faro Styles” as Refero Styles, the R-logo reference library in the supplied screenshots. This identification is an assumption. Its current catalog and pricing were not verified.

Live requests to Refero, Hyperliquid, Linear, Kahoot, and Figma's developer site were blocked by this environment's network policy. I did not inspect their current live layouts or complete their signup flows. Hyperliquid observations below come from the owner's screenshots and supplied design reference. Cal.com and Dub observations come from their official public source code, not screenshots of their deployed websites. GOV.UK findings come from its official design-system source. Tool availability and cost observations come from official repositories and licenses.

These references support design decisions; they do not prove that a particular layout caused a company's commercial success. No conversion-rate claims are made.

## What is wrong with our current screens

1. **The hero presents a mood before it explains the product.** “The market is real. The possibilities are yours.” could describe a brokerage. The paragraph helps, but the dominant headline and abstract contours do not show classroom investing, virtual money, or a student's action. There is no product view beside the message.
2. **Two hero actions lead to the same place.** For a first visit, “Create your class” and “Try the teacher preview” both open teacher setup. They suggest different outcomes but provide none. Keep one primary action and give a secondary action a genuinely different purpose, such as viewing a product demonstration.
3. **Signup repeats the landing page's job.** The large “Your classroom. Their first investment.” panel is another promotional hero. A visitor who already chose to start should reach the form immediately.
4. **Mobile order puts decoration before the task.** Measured in Chromium at 390 × 844: the name input starts at approximately y=630; Continue starts at y=947. A roughly 252-pixel decorative panel precedes the steps, heading, and fields. At 1440 × 900 the decorative panel is 560 × 700 pixels. These are measurements of our preview, not general usability benchmarks.
5. **The visual hierarchy overstates supporting text.** Eyebrow labels, numbered steps, introductory slogans, and reassurance compete with basic form labels. Some 10–11px helper text is too easy to overlook. Important task guidance should not be the smallest content on the screen.
6. **Signup and class setup are conceptually mixed.** The current name/email step is a local preview profile, not real authentication. A production design must distinguish creating an account, signing in, and configuring a class. It must also give students a clear join route. The current prototype should remain honestly labeled until those capabilities exist.

## Reference findings and their application

| Reference | What the evidence shows | What Reign should borrow |
| --- | --- | --- |
| Hyperliquid / Hyper Foundation, owner-supplied screenshots | Large serif display type, restrained navigation, green/mint identity, strong contrast between expressive and quiet sections. | Keep the identity and spatial restraint. Give Reign's hero concrete classroom content and a relevant product visual. Its financial-infrastructure slogans and partner strips do not belong in Reign. |
| [Cal.com signup source](https://github.com/calcom/cal.com/blob/a5ee96f77edd644439e7de8c3255ccb2eb2c5941/apps/web/modules/signup-view.tsx) | The form appears first in a single-column layout; two columns activate at the large breakpoint. Supporting content comes after the form in DOM order; some product visuals are desktop-only. Google/Microsoft options are conditional on enabled providers. Email fields are progressively revealed. | On mobile, put the task first. If a supporting panel remains on desktop, use it for a small product example, not another huge headline. Only show sign-in methods that actually work. |
| [Dub registration source](https://github.com/dubinc/dub/blob/6b463b4bdd9ed2fd9aa416f67b5b77d317b1471e/apps/web/app/app.dub.co/(auth-marketing)/register/page-client.tsx) and [email form](https://github.com/dubinc/dub/blob/6b463b4bdd9ed2fd9aa416f67b5b77d317b1471e/apps/web/ui/auth/register/signup-email.tsx) | A compact form container, direct “Create your Dub account” heading, separate login link, and a distinct verification stage. The email form reveals additional input when needed and displays pending/error states. | Use direct task titles, a compact form, an obvious returning-user route, and explicit success/error states. Reign's authentication method is still a product/implementation decision; this is not a recommendation to copy Dub's exact fields. |
| [GOV.UK: create accounts](https://design-system.service.gov.uk/patterns/create-accounts/) ([reviewed source](https://github.com/alphagov/govuk-design-system/blob/cafbeeac22fcbaadd0112d90c777322e31cd439c/src/patterns/create-accounts/index.md)) | Keep account creation solely about that task; use clear, consistent language; distinguish account creation from signing in; avoid repeated questions. | Remove competing promotional content from signup. Keep the brand, simplify the work. Reign still needs accounts and mandatory class membership in production. |
| [GOV.UK: question pages](https://design-system.service.gov.uk/patterns/question-pages/) and [check answers](https://design-system.service.gov.uk/patterns/check-answers/) | Ask only necessary questions, use clear headings, preserve answers when going back, keep hints short, and offer a review before committing. Related questions may be grouped; progress indicators need a reason. | Keep the useful class review and editable defaults. Show basic setup first and advanced rules on demand. Do not turn every field into a separate page. |
| [GOV.UK: start using a service](https://design-system.service.gov.uk/patterns/start-using-a-service/) | Explain enough to establish relevance, use an action that matches what happens, provide a secondary link when needed, and support returning users. | Make the landing page answer “What is this, who is it for, and how do I start?” before adding atmosphere. |

## Concrete redesign brief

### Landing page

Keep the forest gradient and serif headline. Replace the abstract-only hero with a composed view of the real interface: a portfolio graph and a clear student action, using labeled sample data. Show enough of the product to explain it, not a dense fake dashboard or several floating widgets.

Proposed product copy, not curriculum:

> **Learn investing by making the decisions.**
>
> A classroom stock market where students invest virtual money, follow real companies, and explore their choices together.

Target primary action: **Create a class**. Secondary action: **See how Reign works**, opening a short product demonstration. A clear **Join a class** route serves students; **Log in** serves returning users. Do not add functioning-looking links for unbuilt flows to the current prototype; either build the destination in its authorized feature or represent it explicitly as a design mockup.

Below the hero, use a short demonstration of the core experience and a concise teacher section. Omit invented testimonials, user counts, school logos, and claims of improved learning outcomes. The benefit should come from demonstrating what Reign does.

### Teacher signup

Use a compact, form-first layout. On desktop, an optional modest supporting visual can sit beside it. On mobile, remove that visual from above the form. Keep the logo, task heading, essential fields, primary action, and returning-user route together.

For the current prototype, a direct title such as **Try teacher setup** is honest. For the production flow, use **Create your teacher account** and the actual supported authentication options. Do not collect passwords or simulate working Google/Microsoft login in the local prototype.

After the account stage, enter **Create your class**. Ask for class name and starting virtual balance, then offer investment access and optional rules. Preserve the existing review and edit behavior. A teacher can revisit advanced choices later; creating a class should not require configuring every rule first.

### Visual specifications to test

- Keep approved green/mint colors and the Playfair/Inter pairing. A new skill is not a reason to discard the owner's identity.
- Use display serif primarily for marketing headings; task headings should be smaller and clear. No full-size marketing headline above a mobile form.
- Start with a roughly 400–440px desktop signup form and 16px body/input text. Use a consistent spacing scale rather than isolated large gaps.
- Keep the first field and primary action visible at the initial 390 × 844 viewport for the short signup step, before the keyboard opens. Do not force long forms to fit a screen or prevent scrolling/zooming.
- Use 44px or larger primary touch targets as a design target. Check labels, contrast, keyboard focus, 200% zoom, and errors; visual polish does not replace them.
- Rich motion belongs in the landing demonstration and meaningful state changes. Avoid looping motion beside input fields. Honor reduced-motion preferences.

## Free tools and skills worth using

“Free” below refers to the tool or instruction package, not the AI subscription, hosting, or every connected service.

| Option | Verified status | Its useful role | Recommendation |
| --- | --- | --- | --- |
| [Anthropic frontend-design skill](https://github.com/anthropics/skills/tree/main/skills/frontend-design) | Reviewed SKILL.md and its Apache-2.0 LICENSE.txt. Plain skill instructions; not a hosted design service. | Makes the agent plan typography, layout, hierarchy, content, and a specific visual direction, then critique screenshots against the brief. | Use as the visual-design process. It can be read and applied here without buying a Claude subscription or installing an MCP. Automatic discovery depends on the client's skill support. |
| [Vercel web-design-guidelines](https://github.com/vercel-labs/agent-skills/tree/main/skills/web-design-guidelines) and [rules](https://github.com/vercel-labs/web-interface-guidelines/blob/main/command.md) | Reviewed official skill/rules; repository README identifies the skill collection as MIT. | Reviews labels, input behavior, focus, navigation, motion, typography, performance, and responsive details. | Use as an audit after implementation. Its stylistic preferences are guidance, not universal rules; Reign's requirements take precedence. |
| [Microsoft Playwright MCP](https://github.com/microsoft/playwright-mcp) | Official README and Apache-2.0 license reviewed. Runs locally; Node 18+ documented. | Lets an agent operate a browser and inspect pages. Browser testing can catch practical layout/interaction problems. | Free and useful, but Python Playwright already works here. Adding MCP would change the interface, not confer design judgment or bypass network limits. The official README also suggests CLI + skills for coding agents. |
| [Figma MCP](https://github.com/figma/mcp-server-guide) | Official guide reviewed. Starter/View/Collab seats have up to six read-tool calls/month. Some write tools are exempt; write-to-canvas is currently free beta with future usage-based pricing noted. | Transfers actual design frames, variables, and components into implementation; can support a shared design file. | Optional if the owner wants a Figma workflow. Too limited to describe as an unrestricted free review loop. No paid plan is needed for the recommended initial workflow. |

A style library supplies references; a skill supplies instructions; MCP connects tools. None guarantees a professional result. The strongest improvement is making design decisions explicit, comparing the rendered result with the brief, and testing the user's actual task.

No third-party MCP was installed and no account was connected during this research. The two instruction skills were read and applied to this review, not silently installed globally. The current frontend-design skill's advice against generic styling does not override the owner's chosen forest gradients, typography, or brand.

## Review process for the next design pass

1. Draw the landing and signup layouts with real product copy and a defined primary action. Judge placement and task order before decorating them.
2. Build the two screens using shared tokens and the existing class-creation behavior. Keep this iteration on the unapproved teacher feature branch.
3. Inspect desktop and mobile screenshots. Specifically check that a first-time visitor can identify the product and that a teacher can reach the signup task without scrolling past promotional content.
4. Exercise keyboard navigation, validation, failed saves, returning-user paths when implemented, and back navigation with filled fields. Our previous functional tests passing did not establish good UX.
5. Show the owner a reliable review artifact and ask for confirmation before main. A new MCP does not solve the cloud chat's unsupported embedded visualization; preview delivery needs its own working path.

Selected implementation audit findings for the next pass:

- `src/App.tsx:242` — promotional aside precedes the signup form in mobile order.
- `src/App.tsx:303` — vague “First, a quick hello” heading obscures the specific task.
- `src/App.tsx:713` — hero lacks a product demonstration; both first-visit CTAs share a destination.
- `src/App.tsx` — unsaved setup state is lost on route departure/reload; consider a clear navigation warning or recoverable draft.
- `src/App.tsx` — set email spellcheck deliberately; keep field names/autocomplete consistent when implementing production authentication.
- `src/styles.css:118` — programmatically focused headings have their outline removed; evaluate a visible focus treatment without adding noisy pointer-click rings.

The recommended immediate investment is the two free instruction skills plus the existing browser tooling. The next output should be a better landing/signup composition, not another feature list or more animation.
