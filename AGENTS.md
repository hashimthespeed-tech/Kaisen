# Working on Reign

## Git workflow required by the owner

- Start each new feature on its own `feat/...` branch from the latest approved `main`. Continue iterating on that feature's existing branch until review is complete.
- Never commit feature work directly to `main`.
- Test and make the feature reviewable, commit it, and push the feature branch when existing GitHub access permits.
- Ask the owner for explicit confirmation after each feature. Do not merge into or push `main` before that confirmation. Approval of one feature does not approve another.
- This repository began empty. The first feature branch is `feat/teacher-signup-class-creation`; creating `main` from it also requires the owner's confirmation.
- Use the existing checkout. Cloud tasks are already isolated; do not create a worktree unless asked.
- Use existing Git authentication. Never request tokens in chat; any missing credentials belong in secure environment settings.

## Product and design

- When the owner asks to discover a skill or a task would benefit from a capability we do not have, read `.agents/skills/find-skills/SKILL.md`. Check candidate skills against the actual task and their contents; popularity alone is not a quality guarantee. Prefer project-local installation and preserve the feature-branch workflow.
- For new UI or meaningful visual redesigns, read and apply `.agents/skills/frontend-design/SKILL.md`. Before presenting UI work, use `.agents/skills/web-design-guidelines/SKILL.md` to review the affected files. These are project-local skills; read the files directly if the client does not discover them automatically.
- For targeted layout, simplification, onboarding, or responsive refinement, use `.agents/skills/impeccable/SKILL.md` and the relevant playbook. In this cloud workspace, set `IMPECCABLE_HOME=/workspace/.cache/impeccable` when running its launcher so the engine cache is writable. Manual installation does not enable automatic hooks.
- The owner requires an Impeccable `polish` pass at the end of each UI feature, after the layout and behavior are settled. Read its polish playbook and inspect the rendered result. Then verify the polished changes before presenting the feature for approval; do not treat polish as a substitute for functional or accessibility checks.
- Use `.agents/skills/ui-ux-pro-max/SKILL.md` as a targeted reference for forms, charts, and interaction questions. Resolve its scripts relative to that skill's actual directory (the upstream examples use a Claude-specific path). Check search-result relevance and preserve the existing Forest & Mint design system.
- These skills support the owner's chosen direction. They do not authorize changing Forest & Mint, inventing educational content, requiring a paid service, or merging without confirmation. Review layout and mobile task order as well as visual polish; see `docs/landing-signup-design-review.md`.

- Preserve the selected Forest & Mint design: dark green gradients, mint actions, serif headings, readable light workspaces, and simple navigation. See `docs/product-direction.md` and `docs/design-system.md`.
- The owner supplies educational sources and teaching topics. Do not invent curriculum, lesson explanations, scenario answer keys, market facts, or research rankings.
- Required written student explanations are rejected. Situation decisions and bounded quantities are the assessment interaction.
- Every student must belong to a teacher-created class. Never treat a browser-local prototype profile as a real authenticated account.
- Make prototype limitations visible. Do not collect or persist passwords in prototype flows. No real account, invitation, payout, or trade exists until its backend is implemented and validated.

## Checks

- `npm ci`
- `npm run check`
- `npm test`
- `npm run build`
- `npm run build:preview` creates a portable, single-file review prototype in `dist-preview/`.
- Run a representative browser walkthrough when changing interactive flows; verify errors, successful completion, persistence, and narrow-screen behavior.
