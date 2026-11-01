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
