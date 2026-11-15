# Accrete application specification — decision inventory

This document records **application behavior and content**, not visual design. Accrete is the current **temporary** name for the rebuild previously called Reign and, later, MOMENT. It is a decision inventory for review, not a claim that the unbuilt pages already work or that unresolved rules have been chosen.

## Evidence and status

This inventory uses the [earlier shared conversation](https://chatgpt.com/s/cx_6aefbdf089a481918f23f9e1b7fb67be), especially its product discussion in turns 2–38 and the implementation order in turn 43; the later MOMENT conversation; [product-direction.md](product-direction.md); and the current prototype in `src/App.tsx`, `src/model.ts`, and `src/storage.ts`. The shared conversation was retrieved in full for this review. Older Reign, Sift, and MOMENT names and visual proposals are historical; the owner has now chosen Accrete as the temporary app name. This does not select a final brand or interface.

- **Decided:** The owner said this directly or clearly accepted it in the conversation.
- **Working direction:** An assistant proposal was saved as a starting structure, but the owner did not lock every detail.
- **Prototype only:** Behavior currently implemented for review. It must not be mistaken for the production rule.
- **Open:** No decision was found. The spec leaves it blank rather than choosing one.

The original Reign summary described students explaining trades in writing. The owner subsequently rejected required typed explanations. **No student must write an explanation to make a decision.** A quick selected reason was proposed, but its use and frequency remain open.

## 1. Product and audience

**Decided**

The owner explicitly reconfirmed the core foundation in voice review: teacher-created classes, virtual money with real stock data, no real trading, no required written answers, and feedback about decision quality.

- The product is a classroom stock-market learning experience for students, with teachers creating the classes. The owner is part of the student target audience.
- The United States is the first intended country. Students are age 14 or older; no upper age limit has been selected. The current signup flow checks the age minimum by date of birth.
- Students use **virtual money** to make decisions about real stocks and follow real market information. No real money is invested or traded.
- The core educational value is understanding a decision, the evidence available at the time, and what happened afterward. A high balance or lucky outcome alone is not proof of understanding.
- The experience should be comprehensible quickly and avoid the old app's excessive pages, controls, and game-like complexity.
- Every student belongs to a teacher-created class; there is no full student account without a class.
- The owner will provide teaching topics, learning sources, and curriculum. Do not create factual lessons, historical answer keys, or market claims without those inputs.
- The app should still provide useful basic feedback when AI is unavailable. The original brief allows AI to help turn trading history into plain-language feedback later; AI is not a prerequisite for the core experience.

**Decided navigation**

- The everyday student navigation has five main areas: **Portfolio, Learn, Market, Research, Class**. Account settings are in a separate menu. The owner explicitly approved this set in voice review.

**Working direction**

- The original brief also values classmates comparing decisions, rivalries, and short challenges. Exact social and ranking mechanics have not been decided.

**Approved scope:** The owner wants one complete app, with all planned student areas and supporting flows in scope. Development may proceed in steps, but those steps are not separate product versions or releases. The details of each area remain subject to the questions below.

## 2. End-to-end journeys

### Teacher's first visit

Teacher signup/login → create a class → choose a starting virtual balance and class investing rules → review → receive a class code and invitation link → teacher workspace → students join. Class creation belongs in teacher signup, rather than being an unrelated optional setup. The public landing page is deferred and outside this app specification. The owner clarified that its existing code should remain; only the app plan excludes it for now.

Only the **browser-local teacher details, class setup, review, and workspace preview** exist today. Real signup, invitations, and student joining do not.

### Student's first visit

Join a teacher-created class by code or invitation link → create/access the student account → optional short, scrollable introduction to investing and the app → choose from **3–5 starter companies** → guided first virtual purchase → **Learn**. The entire introduction and guided-purchase sequence can be skipped. NVIDIA and Google/Alphabet were examples of recognizable starter companies, **not** approved final choices or a claim that those stocks are stable or safe.

A short interactive walkthrough with text pointers that let the student try controls was also requested. It should be skippable and replayable from Help. Whether that walkthrough is combined with the scrollable introduction or appears separately is open.

**Decided:** Portfolio is the normal home for a returning student. The first guided purchase explicitly ends in Learn. The destination after skipping onboarding is still open.

### Ongoing student loop

Follow the live portfolio and its graph → inspect a company or market event → research supporting information → make a virtual buy, sell, or hold decision where allowed → see the effect on cash and holdings → return for changes and outcomes. Learn adds sourced concepts and situations to this loop. Class games let classmates act on shared situations.

## 3. Page and flow inventory

These are product areas and supporting screens, **not final URL or component boundaries**. Some details may be an overlay or step within a page.

### 3.1 Teacher signup and login

**Decided:** Teacher accounts need signup and login, and the first class is created as part of the signup journey. One teacher account may create and manage multiple classes; each class has one managing teacher, with no co-teachers. Returning teachers must be able to access their workspace. Teachers and students can use Continue with Google or email and password. Forgotten passwords for email-and-password accounts are reset through an email link. Teacher signup is open.

**Prototype only:** The first step collects a name and email for local review. It creates no account, sends no email, collects no password, and has no authentication or password recovery.

**Open:** Minimum teacher age and account recovery for Google-only accounts.

### 3.2 Create and edit a class

**Decided:** A teacher sets starting virtual cash, chooses either all supported stocks or a teacher-approved stock list during class creation, may set a maximum single-company share of a portfolio, may pause/resume trading, and may set class start/end dates. Settings should be editable later. Teachers also need individual-student exceptions and virtual-cash adjustments in the complete app. A class-wide weekly virtual allowance is optional; the teacher chooses an amount and day, can pause/change it, and deposits happen even when students are offline.

The investment universe is U.S. and international stocks only, with no cryptocurrency or non-stock products. The owner wants broad searchable stock coverage rather than a hand-picked app-wide list, subject to feasible market-data coverage. A teacher's optional approved list is a separate class control. All class cash, stock values, and portfolio totals display in U.S. dollars, including converted international holdings. Exchange/data coverage and the exchange-rate method remain open.

The starting-cash field is prefilled with **$1,000 virtual**; the teacher chooses the actual value during class creation.

Changing a rule must **not silently liquidate** existing holdings. If a teacher removes a stock from the approved list, students who already own it may sell their shares but cannot buy more under the class rule. Teacher-added money and scheduled deposits must be accounted for separately from investment return. Students should be able to see applicable restrictions and understand why an action was blocked. A trading pause does not require a separate reason message. Teacher changes and adjustments need a history.

Students may join a class before or after its start date. If a teacher sets a class start date, students may join and explore before it, but cannot trade until that date. Once the class has started, the teacher cannot change its start date but may change its end date. A teacher's trading pause blocks both buying and selling. If a teacher sets an end date, trading stops on that date. Portfolio values keep following live market prices while students have read-only access to their portfolio and results. The teacher chooses a finite period of one week to two months for how long students can view the ended class; the field is prefilled with one week. There is no keep-visible-forever option. When the viewing period expires, the class is hidden from the student but its data remains saved. The teacher may reopen it for read-only historical viewing; that view does not update. Separately, extending the end date of an ended class resumes trading, and the app must clearly state that consequence. On reopening for trading, the teacher chooses whether portfolios continue from their existing state or reset. Reset gives every student no holdings and a new cash balance chosen by the teacher. Old portfolios remain saved as historical data, and students receive both an email and an in-app notification of the reset.

The teacher's idea of limiting students to “well-reputed, long-term” stocks became a **defined approved-company list**. No reputation or safety preset has been approved.

**Prototype only:** Three steps exist: teacher details → class settings → review. Basic class fields are name, starting virtual cash, and investment access. An optional disclosure contains trading enabled/paused, single-stock percentage limit, weekly virtual amount and day, and optional class dates. The review shows the values before saving; a teacher can edit afterward. These values are stored in this browser only. Trading limits, scheduled deposits, and start/end enforcement do **not** operate yet.

**Decided individual controls:** The teacher may override allowed stocks, position limit, trading access, and weekly allowance for a single student. Students can see the overrides that apply to them. A student's individual weekly allowance replaces, rather than adds to, the class allowance.

**Open:** Initial states and valid ranges for optional settings, supported security universe, how teachers restore an individual to current class defaults, how teachers reverse an adjustment, and the precise snapshot time for historical values after read-only reopening. Scheduled deposits also need a timezone, missed-deposit/late-join behavior, idempotent accounting, and an audit history before activation.

### 3.3 Teacher workspace and class detail

**Decided/working direction:** Teachers need a place to see and manage their classes and students, edit class rules, add virtual money to individuals, see participation and learning progress, and host class games. Individual overrides and change history belong here or in a linked student detail flow.

**Prototype only:** The workspace lists locally saved classes. A class detail view displays saved settings, an eight-character **preview** code, a copy action, and a zero-students state. The code cannot admit students. No student activity, progress, game hosting, adjustments, or actual rule enforcement exists.

**Open:** Teacher dashboard metrics, student-detail contents, progress/reporting model, exports, invitation management, permissions, and class archival/deletion rules.

### 3.4 Student join, signup, login, and recovery

**Decided:** Students join a teacher-created class with either an invitation link or a typed class code and then access the student experience. Both remain valid until the teacher replaces them. One student account may belong to multiple classes, but every student account must belong to at least one teacher-created class. Each class gives that student a separate virtual cash balance, portfolio, Learn progress, and level; switching classes shows the state for the selected class. Continue with Google and email-and-password login are approved for students and teachers. Forgotten passwords for email-and-password accounts are reset by email. Signup collects a student's date of birth to check the age-14 minimum.

**Open:** Privacy requirements, name changes, leaving/transferring a class, invalid/replaced-code recovery, and what students can see before joining. None of this is implemented.

### 3.5 Optional first-time introduction and guided purchase

**Decided:** The introduction is short and scrollable, covering investing and what the app does using owner-provided teaching sources. The student chooses one of 3–5 starter companies, is guided through a first virtual purchase, and then enters Learn. They can skip the entire sequence. The walkthrough should guide real clicks rather than merely describe controls.

**Open:** Final starter companies and why they qualify, available search during the choice, exact text and teaching sources, how much of the starting cash the student can use, whether skipping lands in Learn or Portfolio, and how the guide is replayed or resumed.

### 3.6 Portfolio

**Decided:** The portfolio follows real market prices over time and includes a prominent value graph. Keep available cash and invested holdings separate. Show the effects of decisions, not just a final balance. Teacher cash additions and weekly deposits must not count as investment gain.

**Working direction:** A main view shows total portfolio value, period change, available cash, holdings, and recent activity. A chart can provide Today/Week/Month/All ranges and point inspection; these exact controls were proposed, not expressly locked. Individual holdings can lead to company information and selling. Portfolio is the approved returning-student home.

**Open:** Quote refresh cadence/provider, market-close and delayed-price behavior, valuation at historical dates, return calculation, dividends/splits, unavailable quotes, cash-flow-adjusted performance, and whether class comparison appears here. No live portfolio exists in the prototype.

### 3.7 Company detail, buy/sell, and confirmation

**Decided/working direction:** Students need a company view and a clear virtual purchase/sale review. Teachers' approved lists and position limits must be respected once active. Buying and selling belong to the investing flow, **not as prompts in Research's trending cards**. A blocked action should name the relevant class rule.

**Open:** Where company detail is entered from each tab, order type, share versus dollar/percentage entry, fractional shares, commissions/fees, quote-lock or execution timing, market-closed orders, cancellation, and how to handle a data outage.

### 3.8 Learn: lesson entry and progression

**Decided:** Learn opens **directly into the next lesson**, not a large level-selection screen. Show a small level/progress indicator in Learn and the student's level in profile/settings. No full-screen level map. Introduce one sourced concept, then use an applied situation as the test. Required written answers are excluded.

**Working direction:** Progress reflects demonstrated understanding or skill rather than portfolio profit. Later situations can be harder than early ones. Exact level names, unlock rules, and scoring are unapproved examples until the owner supplies curriculum.

**Open:** First topic and source set, lesson format and length, progress units, retries, prerequisite rules, accessibility alternatives for timed material, and whether progress is class-assigned or self-paced. No real lesson exists yet.

### 3.9 Situation decision experience

**Decided:** A historical or clearly simulated market situation unfolds visually. An event slows or pauses market time; the student has limited decision time and can inspect the information available at that point. They decide **buy, sell, or hold** and choose a bounded quantity rather than merely guessing among three fixed answers or entering unlimited free text. The market then resumes and the consequences are shown. Early situations should be simpler; some later situations may advance months or years.

Feedback should identify specific evidence available at the pause, what the student did, and what happened. It should explain incorrect or weak reasoning without pretending an outcome was guaranteed. A sensible decision can lose money and a risky decision can win; profit and understanding must be evaluated separately.

**Working direction:** A percentage control for available cash or a holding was proposed. A visible event/date counter, pausing or replaying a long-term reveal, and a timed indicator were proposed but have no exact rules.

**Decided concept for a later situation:** A challenge may ask which stocks a student would choose if they could not buy more, aiming for the largest portfolio after a stated number of years. The event pauses for investigation and allocation, then time accelerates and the portfolio graph shows the path, including losses and recoveries. This is one scenario idea, not the only scenario or an approved first lesson.

**Open:** First scenario source and content, historical versus simulated labeling, available evidence, time limit and timeout behavior, quantity bounds, assessment rubric, acceptable alternative decisions, attempts/replay, and how scenario money relates to the ongoing class portfolio. No scenario engine is built.

### 3.10 Situation results and feedback

**Decided:** Show the decision, resulting path, and evidence that mattered. Distinguish decision quality from outcome luck. The original brief calls for plain-language feedback on the student's actions and history, with a useful non-AI version.

**Open:** When results become visible, whether classmates' choices are shown, the exact explanation format, comparison/counterfactual rules, AI involvement and review, and what counts toward level progress.

### 3.11 Market and market-story detail

**Decided:** Market is a clearer, organized, simplified financial-news page. It prioritizes **today**, then the recent **week/month**, with lookup for a past date. Stories need sources. Students should understand what happened and which companies or industries were affected. Separate confirmed events from possible interpretations of a price move.

**Decided structure:** A lead story, grouped secondary headlines, short summaries, and a fuller linked story view were accepted in the earlier conversation immediately after the proposed structure was described.

**Open:** News/source providers and licensing, geographic/exchange coverage, update cadence, editorial selection, archive depth, attribution format, corrections, and what to show when no reliable explanation exists. Market-to-Research navigation was proposed; its exact behavior is not locked.

### 3.12 Research and company deep dive

**Decided:** Research teaches students how to investigate companies and follow relationships beyond a stock price, including products, suppliers, materials, and other businesses. Its main page highlights **most researched** and **most purchased** companies, particularly less familiar ones, with short **sourced** factors explaining attention. Selecting a company opens a deeper informational view and its connections. These placements are for knowledge, **not direct buy prompts**.

**Working direction:** Company search and tools to inspect trends, revenue/product context, and supporting sources were proposed. Short guidance can explain how to read evidence within the tool.

**Open:** Whether rankings use Accrete student activity, the overall market, or another population; time windows; minimum sample sizes; manipulation/privacy safeguards; how “less familiar” is defined; research data providers; relationship evidence standard; saved research; and the exact structure of the deep dive. No ranking, source feed, or company database exists yet.

### 3.13 Class/Join entry, class games, and team play

**Decided:** The student-facing Class area is lightweight: join or enter teacher-hosted activities, without a large game hub. Situations can be personal or class-hosted. Every game mode should support teams. A teacher chooses individual or team play and can assign teams manually or randomly.

For team play, one **randomly selected leader per team** remains leader for that whole game; a new leader may be picked for another game. Every teammate sees the same information/question and discusses it. Only the leader submits the team's answer/action. Non-leaders share one teammate role for now. A role reveal should tell each student what they can do.

**Original product goal:** Classmates may compare choices and outcomes, with friendly rivalry and results. The exact scoreboard and comparison rules are not decided.

**Open:** The actual list and count of class game modes. A Kahoot/STAX-like idea was floated, but no detailed mode was approved. Also open: team size, formation constraints, leader reassignment when disconnected, late joiners, teacher launch/pause/reveal controls, discussion tools, timers, ties, score and ranking rules, game persistence, and lobby/results screens. None is implemented.

### 3.14 Profile/settings, Help, privacy, and recovery

**Decided:** Account settings, Help, and privacy information are needed. The student's level appears in profile/settings. The first-time walkthrough should be replayable from Help. Error/recovery paths are needed for forgotten access, invalid class codes, unavailable data, and interrupted games.

**Open:** Profile fields, account deletion/export, support channel, student-data policy, teacher/student permissions, legal/privacy text, and recovery behavior. These pages do not exist today.

## 4. Cross-cutting rules

- **Virtual versus real:** All balances, deposits, orders, and outcomes inside Accrete are virtual. Market prices/news may describe real companies and events when properly sourced. The product must never imply a real-money trade.
- **Accuracy and uncertainty:** News, company relationships, research reasons, historical scenarios, and educational claims need suitable sources. Do not label a company “safe” because it is large or familiar. Do not treat a correct market prediction as the sole learning outcome.
- **Money accounting:** Keep cash, market value, teacher adjustments, weekly deposits, and investment return distinguishable. Added virtual money does not improve performance by itself.
- **Teacher rules:** Class defaults must be visible to students and editable by teachers. Individual exceptions and an audit trail are intended later. No settings change silently sells holdings.
- **Content ownership:** The owner supplies topics and educational sources. Example copy and mock data are not approved lessons or market claims.
- **AI:** Optional support for explanations is a future possibility; the educational path must work without it.
- **Simplicity:** Avoid bringing back the old app's many competing pages, large game hub, or full-screen level map.

## 5. Current build versus planned product

The code currently implements **a deferred landing presentation and a single-browser teacher setup prototype**. Its hash routes are `/`, `/teacher/setup`, `/teacher`, `/teacher/class/:id`, and `/teacher/class/:id/edit`, plus recovery states. Saved teacher and class data live only in browser `localStorage` under `reign.teacher-prototype.v1`. Clearing site data removes it. There is no server synchronization, account authorization, student enrollment, live feed, order execution, working deposits, lessons, situations, rankings, or games. The class code is a preview code. The landing page is outside the active app scope.

The prototype currently uses a $10,000 starting-cash default, all supported stocks, trading enabled, no concentration limit, weekly deposits off, and no class dates. It allows a class name and teacher name of 2–80 characters, virtual amounts from $0.01 to $1,000,000, a 1–100% position limit, and 1–100 approved ticker symbols. **These are current implementation choices, not production rules; the owner has now approved a $1,000 starting-cash prefill for the real class setup.**

The recorded working implementation order was: (1) teacher setup/class creation prototype; (2) student joining/onboarding; (3) first guided virtual purchase into Learn using owner-provided content; (4) real accounts/shared class storage and then live market/trading infrastructure. This is only a development sequence. The owner has since clarified that the product target is one complete app, not multiple reduced releases.

## 6. Remaining unanswered decisions

This list was rechecked against all 125 turns of the earlier shared chat, including the surrounding teacher-control discussion (turns 29–36), the later conversation, and the owner's voice answers. It excludes questions that the owner already answered. A proposed detail is not treated as approved merely because it appeared in an assistant response.

### Accounts and class membership

1. May a student leave or transfer a class, and what happens to that class's portfolio and Learn progress afterward? What can a student see before joining a class, and how are invalid or replaced invitations handled?
2. Which profile fields may students and teachers change? What is the minimum age for a teacher account? How do Google-only users recover access?

### Teacher controls and money rules

3. For international stocks, which exchanges and market-data coverage are feasible, and how are exchange rates sourced and timestamped? Cash, stock values, and portfolio totals are already approved as U.S.-dollar displays. Crypto and non-stock products are excluded; teacher-approved class lists remain available.
4. What are the initial states and valid ranges for optional class settings? After a class starts, its start date is fixed but its end date may change. After it ends, the teacher chooses a one-week to two-month viewing period (one week prefilled) while values keep updating. The teacher may reopen a static historical view or extend the class to resume trading; the app explains the latter. The historical snapshot point remains open.
5. If a teacher removes a stock from the approved list, existing holders may sell but cannot buy more under the class rule; no shares are sold automatically. Can an individual override permit further buying? A trading pause blocks both buying and selling.
6. The teacher may override allowed stocks, position limit, trading access, and weekly allowance for one student; those changes are visible to that student. The individual allowance replaces the class amount. How does returning to the current class default work?
7. Which timezone controls the weekly deposit day? How are missed, changed, backdated, or reversed deposits handled? May a teacher remove virtual cash, and what history or notice must the student see?
8. Which teacher views and reports are required for student participation, decisions, progress, trading, and games? Are class archives, exports, and deletion required?

### First use, portfolio, and trading

9. Is the interactive walkthrough combined with the short scrollable introduction or separate? Where does Skip lead, and how is an interrupted guide resumed? Replay from Help is already in the plan.
10. Which 3–5 companies are the final starter choices? Can a student search beyond them during onboarding, and how much virtual cash may the guided first purchase use? NVIDIA and Google were examples, not approved final choices or promises of safety.
11. Which chart ranges and point details should Portfolio support? Should classmates' comparisons appear there? The portfolio graph and separate cash/holdings are already approved.
12. Which markets, quote/news providers, history rights, data delay, and refresh rate are acceptable? How should closed markets, stale quotes, and missing data appear?
13. Should virtual orders be entered as shares, dollars, percentages, or a combination? Are fractional shares allowed? When and at what price do orders execute, including outside market hours? How are rejected or interrupted orders handled?
14. Should fees, dividends, splits, or other corporate actions affect the simulation? Which return calculation and chart treatment keep teacher cash additions and weekly deposits separate from investment gains?

### Learn, situations, and feedback

15. What are the first owner-provided learning topic, sources, and situation? What is the learning objective and evidence that students may use at the decision pause?
16. Are lessons self-paced or teacher-assigned? What are their length, prerequisite, retry, level, and scoring rules? Progress must reflect learning rather than profit alone.
17. Does a situation use the student's class portfolio or a separate scenario balance? If separate, which results affect class progress or standings?
18. What are the decision timer, quantity bounds, timeout behavior, and pause/replay controls for situations? Buy/sell/hold and a bounded amount are already decided.
19. Is a quick selected reason used at some decisions? When do students see the outcome, classmates' choices, and feedback? Which parts may AI draft, and who checks accuracy? Basic feedback must work without AI.

### Market, Research, games, and operations

20. Which news sources, markets, archive depth, update schedule, and editorial checks support Market? The organized lead-story, grouped-headline, today/week/month, and date-lookup structure was already accepted.
21. Whose activity defines Research's “most researched” and “most purchased” rankings, over what period? How is a short explanation of interest sourced without claiming an unproven cause?
22. What exact information and tools belong in a company deep dive: search, financial context, product/supplier relationships, saved evidence, or others? A deeper informational view without buy prompts is already decided.
23. Which class game modes exist besides solo/class-hosted situations? The earlier idea of roughly three modes was not a settled count.
24. What are team size, late-join rules, disconnected-leader replacement, teammate discussion tools, teacher launch/pause/reveal controls, scoring, ties, and comparison rules? Team selection, random leader, stable leader for a game, shared teammate role, and leader-only submission are already decided.
25. What are the production help/support, student privacy, data-retention, deletion, export, accessibility, mobile, and connection-loss requirements?

The teacher's choice between **all supported companies** and **an approved list** is settled. The remaining question about an already-owned company concerns behavior **after the teacher changes that list**, which the earlier conversation did not specify.
