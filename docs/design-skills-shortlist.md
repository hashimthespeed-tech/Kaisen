# Design skills selected for Reign

Reviewed November 1, 2026. Task: find the best-fitting skills for the landing/signup redesign, keeping Forest & Mint and the existing class-creation behavior.

## Discovery method and limits

Applied the installed `find-skills` instructions. Tried the skills.sh leaderboard first; this environment returned a proxy 403. Ran the official Skills CLI, version 1.7.4, for `ui ux design`, `frontend-design`, and `accessibility`. All returned “No skills found,” including a skill we already know exists. These results do not establish that the catalog has no matching skills.

Continued with direct official/maintainer repositories. Read candidate instructions and relevant playbooks, checked licenses, and tested a local search engine. Current installation counts and GitHub star counts were not verified; no popularity ranking is claimed. “Best” here means strongest fit among the reviewed candidates, not an exhaustive ranking of the ecosystem.

## Recommended combination

| Skill | Decision | Specific role |
| --- | --- | --- |
| Anthropic `frontend-design` | Keep; already installed | Plan and implement the visual composition, typography, hierarchy, and product-specific content. The owner's approved theme takes priority over generic warnings about common styles. |
| Vercel `web-design-guidelines` | Keep; already installed | Review the implementation for usable controls, accessible forms, focus, responsive behavior, and motion. |
| Paul Bakaus's `impeccable` | Strongest new addition to consider | Improve an existing design through targeted `shape`, `distill`, `layout`, `adapt`, `onboard`, and `polish` playbooks. Its separation of marketing surfaces from task-focused app screens directly addresses Reign's current problem. |
| Next Level Builder `ui-ux-pro-max` | Optional reference | Searchable local guidance on forms, charts, responsive UI, and stack-specific details. Use targeted queries; do not regenerate Reign's approved palette or typography. |
| Anthropic `webapp-testing` | No additional installation needed now | Its Python Playwright workflow largely duplicates our existing browser checks and screenshot capability. It is useful testing guidance, but not a replacement for design critique. |

## Why Impeccable is the strongest new fit

Reviewed the Codex SKILL.md, README, license, and relevant portions of the critique, distill, onboard, and adapt playbooks at commit `e89e3ada3e875a89ac2c5d33d11e65ebef6fe285`.

- **Separate each screen's purpose.** It distinguishes a landing page that helps someone decide from an application screen where someone needs to complete a task. Our signup currently gives a marketing panel too much priority.
- **Remove obstacles without deleting useful behavior.** `distill` addresses duplicate actions, excessive decoration, inconsistent spacing, and too many visible choices. This fits the owner's complaints about complexity.
- **Make the first useful action clear.** `onboard` emphasizes optional guidance, real actions, and introducing features when needed. It aligns with the owner's skippable first-investment flow; it does not authorize inventing educational content.
- **Finish across devices.** `adapt`, `layout`, and `polish` provide focused passes rather than asking one generic instruction to fix everything.

Important scope: this is a larger package than a single markdown prompt. The current skill uses a launcher/engine and optional hooks; its full critique workflow can involve independent agents and additional setup. Its instructions document a fallback when the launcher cannot run. I reviewed it, but did not install its runtime, enable hooks, invoke its critique workflow, or verify its engine in this environment. The current task is discovery, not permission for those unrelated setup changes.

License: Apache-2.0. No software subscription is required; existing model, hosting, or optional image-generation costs are separate.

Sources:

- [Repository and installation](https://github.com/pbakaus/impeccable)
- [Reviewed Codex skill](https://github.com/pbakaus/impeccable/blob/e89e3ada3e875a89ac2c5d33d11e65ebef6fe285/.agents/skills/impeccable/SKILL.md)
- [Simplification playbook](https://github.com/pbakaus/impeccable/blob/e89e3ada3e875a89ac2c5d33d11e65ebef6fe285/.agents/skills/impeccable/reference/distill.md)
- [Onboarding playbook](https://github.com/pbakaus/impeccable/blob/e89e3ada3e875a89ac2c5d33d11e65ebef6fe285/.agents/skills/impeccable/reference/onboard.md)

## UI/UX Pro Max: useful, with measured limits

Reviewed SKILL.md, the search implementation, the beginning and targeted sections of its core engine, quick-reference material, README, and MIT license. Checked out its skill into a temporary research directory at commit `3a13158ff1f32156cbe144108de48eda2ecaed9a`. Called the reviewed local Python search function with public, generic queries; no project code was uploaded and no design-system files were generated.

Observed results:

- `error summary validation` in the UX domain returned focusable error summaries, announced errors, and field-associated inline error guidance. Relevant to signup.
- `time series` in the chart domain returned line-chart/trend guidance and accessibility alternatives. Relevant to the future portfolio graph. Its exact colors and numeric thresholds are suggestions, not authoritative requirements for Reign.
- `progressive disclosure` returned a heading-wrapping result based on a shared word. That result is not relevant to the requested interaction. This demonstrates why every returned recommendation needs a relevance check rather than automatic adoption.

The package offers many style and palette presets, but Reign already has a chosen identity. Its best use here is answering a specific question, not selecting a new visual theme.

Sources:

- [Repository](https://github.com/nextlevelbuilder/ui-ux-pro-max-skill)
- [Reviewed skill](https://github.com/nextlevelbuilder/ui-ux-pro-max-skill/blob/3a13158ff1f32156cbe144108de48eda2ecaed9a/.claude/skills/ui-ux-pro-max/SKILL.md)
- [Reviewed local search core](https://github.com/nextlevelbuilder/ui-ux-pro-max-skill/blob/3a13158ff1f32156cbe144108de48eda2ecaed9a/.claude/skills/ui-ux-pro-max/scripts/core.py)

## Installation references, not executed

These commands are provided for a later installation task. Keep installation project-scoped and review what each installer changes.

```sh
# Impeccable's documented installer supports Codex and project scope.
npx impeccable install --providers=codex --scope=project

# Skills CLI command for the separately reviewed local-reference package.
npx skills add nextlevelbuilder/ui-ux-pro-max-skill --skill ui-ux-pro-max -a codex
```

The CLI command above follows the documented Skills CLI syntax; this exact UI/UX Pro Max installation was not tested. Skills directory entries, whose live contents and counts could not be verified here:

- https://skills.sh/pbakaus/impeccable/impeccable
- https://skills.sh/nextlevelbuilder/ui-ux-pro-max-skill/ui-ux-pro-max
- https://skills.sh/anthropics/skills/frontend-design
- https://skills.sh/vercel-labs/agent-skills/web-design-guidelines

## Practical recommendation

Use frontend-design to make the composition, Impeccable's targeted refinement workflow to challenge it, Vercel's guidelines to audit the implementation, and the existing Playwright setup to verify the rendered result. Keep UI/UX Pro Max available as an optional reference when forms or charts raise a specific question. Avoid loading several competing design generators for every small edit.

This research adds no new application behavior or installed skills. All work remains on the existing unapproved feature branch; main is unchanged.
