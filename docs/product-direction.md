# Reign product direction

Reign is a classroom investing game with virtual money. The owner is a high-school student and wants a simple, coherent experience that people can understand quickly. This is a rebuild, not a preservation of the old application's feature density.

## Agreed experience

- Teachers create a class at signup. Every student joins a teacher-created class. Students do not get a classless full account.
- Main areas: Portfolio, Learn, Market, Research, plus a lightweight way to join a class game. No large game hub or level-map screen.
- Optional first-time guidance: short introduction, choose from 3–5 starter companies, guided first virtual purchase, then Learn. The whole introduction can be skipped. Familiar companies must not be described as inherently stable or safe.
- Portfolio: market-following values and a graph, cash and holdings clearly separated. Deposits must not count as investment returns.
- Learn: open directly into learning. Small level/progress indicators in Learn and profile/settings. Introduce a sourced concept, then assess it through a situation: market motion pauses, students inspect information, choose buy/sell/hold and bounded quantities, then see events unfold. Some situations advance years. Judge reasoning in context rather than rewarding lucky outcomes.
- No required written explanations. The owner will supply **all teaching topics, learning sources, and curriculum**. Do not invent lessons, answer keys, or factual scenarios.
- Market: an organized, simplified CNBC-like page prioritizing today, recent week/month, and past-date lookup. Stories need sources.
- Research: informational company trends and short sourced reasons, including less familiar companies. Deeper company views, no trading prompts. Ranking population remains to be decided.

## Teacher controls

Starting funds, all supported stocks or a teacher-approved list, optional portfolio concentration limits, trading pause/resume, optional class dates, and optional weekly virtual deposits. Defaults should be editable; individual overrides and individual cash adjustments follow in later features. Changing rules must not silently liquidate existing positions. Scheduled deposits need a timezone, idempotent accounting, and audit history before activation; the current prototype only stores preferences.

## Class games

All modes should support teams. Teacher chooses solo/team and random/manual team assignment. Randomly select one leader per team for each game; that leader stays for the game. Others share the same teammate role, see the same question, and discuss. Only the leader submits. Full-screen role-color reveals can introduce roles. Team size and disconnected-leader behavior remain open.

## Supporting flows

Signup/login, teacher workspace, optional contextual first-time guidance, account settings, help, and privacy. Real authentication, student joining, backend persistence, and market-data connections are future features, not implied by this local prototype.

## Implementation order

1. Teacher setup and class creation prototype (current feature).
2. Student joining and onboarding interaction.
3. First virtual purchase → Learn transition, using owner-provided content when available.
4. Real accounts and shared class persistence, then market/trading infrastructure.

Each feature gets its own branch and owner confirmation before `main`. Scope and order can change with the owner; do not expand a small feature into the whole roadmap.
