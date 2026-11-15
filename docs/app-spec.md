# MOMENT application specification — decision inventory

This document records **application behavior and content**, not visual design. MOMENT is the current **provisional** name for the rebuild previously called Reign. It is a decision inventory for review, not a claim that the unbuilt pages already work or that unresolved rules have been chosen.

## Evidence and status

This inventory uses the [earlier shared conversation](https://chatgpt.com/s/cx_6aefbdf089a481918f23f9e1b7fb67be), especially its product discussion in turns 2–38 and the implementation order in turn 43; the later MOMENT conversation; [product-direction.md](product-direction.md); and the current prototype in `src/App.tsx`, `src/model.ts`, and `src/storage.ts`. The shared conversation was retrieved in full for this review. Old Reign, Sift, and Accrete visual proposals are historical; they do not define the app's current name or interface.

- **Decided:** The owner said this directly or clearly accepted it in the conversation.
- **Working direction:** An assistant proposal was saved as a starting structure, but the owner did not lock every detail.
- **Prototype only:** Behavior currently implemented for review. It must not be mistaken for the production rule.
- **Open:** No decision was found. The spec leaves it blank rather than choosing one.

The original Reign summary described students explaining trades in writing. The owner subsequently rejected required typed explanations. **No student must write an explanation to make a decision.** A quick selected reason was proposed, but its use and frequency remain open.

## 1. Product and audience

**Decided**

- The product is a classroom stock-market learning experience for students, with teachers creating the classes. The owner is part of the high-school target audience.
- Students use **virtual money** to make decisions about real stocks and follow real market information. No real money is invested or traded.
- The core educational value is understanding a decision, the evidence available at the time, and what happened afterward. A high balance or lucky outcome alone is not proof of understanding.
- The experience should be comprehensible quickly and avoid the old app's excessive pages, controls, and game-like complexity.
- Every student belongs to a teacher-created class; there is no full student account without a class.
- The owner will provide teaching topics, learning sources, and curriculum. Do not create factual lessons, historical answer keys, or market claims without those inputs.
- The app should still provide useful basic feedback when AI is unavailable. The original brief allows AI to help turn trading history into plain-language feedback later; AI is not a prerequisite for the core experience.

**Working direction**

- The everyday student navigation has four main areas: **Portfolio, Learn, Market, Research**. A lightweight **Join/Class game** entry and an account menu serve the remaining flows. This was accepted as the starting screen map, not as final navigation design.
- The original brief also values classmates comparing decisions, rivalries, and short challenges. Exact social and ranking mechanics have not been decided.

## 2. End-to-end journeys

### Teacher's first visit

Public landing → teacher signup/login → create a class → choose a starting virtual balance and class investing rules → review → receive a class code or invitation → teacher workspace → students join. Class creation belongs in teacher signup, rather than being an unrelated optional setup.

Only the **browser-local teacher details, class setup, review, and workspace preview** exist today. Real signup, invitations, and student joining do not.

### Student's first visit

Join a teacher-created class by code or invitation → create/access the student account → optional short, scrollable introduction to investing and the app → choose from **3–5 starter companies** → guided first virtual purchase → **Learn**. The entire introduction and guided-purchase sequence can be skipped. NVIDIA and Google/Alphabet were examples of recognizable starter companies, **not** approved final choices or a claim that those stocks are stable or safe.

A short interactive walkthrough with text pointers that let the student try controls was also requested. It should be skippable and replayable from Help. Whether that walkthrough is combined with the scrollable introduction or appears separately is open.

**Working direction:** Portfolio was proposed as the normal home for a returning student. The first guided purchase explicitly ends in Learn; the exact default route on later visits is still to be confirmed.

### Ongoing student loop

Follow the live portfolio and its graph → inspect a company or market event → research supporting information → make a virtual buy, sell, or hold decision where allowed → see the effect on cash and holdings → return for changes and outcomes. Learn adds sourced concepts and situations to this loop. Class games let classmates act on shared situations.

## 3. Page and flow inventory

These are product areas and supporting screens, **not final URL or component boundaries**. Some details may be an overlay or step within a page.

### 3.1 Public landing page

**Decided:** Quickly explain the classroom investing experience, show a truthful product preview, and give teachers a clear **Create a class** path. The student **Join a class** path and returning-user **Log in** path are part of the intended product. A learning-preview video should autoplay on the landing page once the inside of the app is built; its final footage and script are not defined.

**Prototype only:** The current landing has an illustrative, interactive Earnings/Products/Industry preview with a virtual Buy/Hold/Sell choice, concept visuals, a reserved film area, and teacher-setup links. It is not a connected research, trading, or learning flow. The student join and real login paths are absent.

**Open:** Final landing copy, the video content, the exact product flow shown in the video, and when working Join/Login actions can be exposed.

### 3.2 Teacher signup and login

**Decided:** Teacher accounts need signup and login, and the first class is created as part of the signup journey. Returning teachers must be able to access their workspace. Password/account recovery is a supporting flow.

**Prototype only:** The first step collects a name and email for local review. It creates no account, sends no email, collects no password, and has no authentication or password recovery.

**Open:** Authentication method, identity verification, school or teacher verification, account recovery method, and whether a teacher may belong to multiple schools or organizations.

### 3.3 Create and edit a class

**Decided:** A teacher sets starting virtual cash, chooses all supported companies or a teacher-approved company list, may set a maximum single-company share of a portfolio, may pause/resume trading, and may set class start/end dates. Settings should be editable later. Teachers also need individual-student exceptions and virtual-cash adjustments in a later feature. A class-wide weekly virtual allowance is optional; the teacher chooses an amount and day, can pause/change it, and deposits happen even when students are offline.

Changing a rule must **not silently liquidate** existing holdings. Teacher-added money and scheduled deposits must be accounted for separately from investment return. Students should be able to see applicable restrictions and understand why an action was blocked. Teacher changes and adjustments need a history.

The teacher's idea of limiting students to “well-reputed, long-term” stocks became a **defined approved-company list**. No reputation or safety preset has been approved.

**Prototype only:** Three steps exist: teacher details → class settings → review. Basic class fields are name, starting virtual cash, and investment access. An optional disclosure contains trading enabled/paused, single-stock percentage limit, weekly virtual amount and day, and optional class dates. The review shows the values before saving; a teacher can edit afterward. These values are stored in this browser only. Trading limits, scheduled deposits, and start/end enforcement do **not** operate yet.

**Open:** Exact launch defaults, supported security universe, what a changed approved list does to existing holdings, precedence of individual overrides, how teachers reverse an adjustment, class date behavior, and whether more than one teacher manages a class. Scheduled deposits also need a timezone, idempotent accounting, and an audit history before activation.

### 3.4 Teacher workspace and class detail

**Decided/working direction:** Teachers need a place to see and manage their classes and students, edit class rules, add virtual money to individuals, see participation and learning progress, and host class games. Individual overrides and change history belong here or in a linked student detail flow.

**Prototype only:** The workspace lists locally saved classes. A class detail view displays saved settings, an eight-character **preview** code, a copy action, and a zero-students state. The code cannot admit students. No student activity, progress, game hosting, adjustments, or actual rule enforcement exists.

**Open:** Teacher dashboard metrics, student-detail contents, progress/reporting model, exports, invitation management, co-teachers, permissions, and class archival/deletion rules.

### 3.5 Student join, signup, login, and recovery

**Decided:** Students join a teacher-created class with an invitation or class code and then access the student experience. A classless full account is excluded. Login and recovery are required supporting flows.

**Open:** Student identity and authentication, age/privacy requirements, whether one student may join several classes, code expiry/revocation, name changes, leaving/transferring a class, invalid/expired-code recovery, and what students can see before joining. None of this is implemented.

### 3.6 Optional first-time introduction and guided purchase

**Decided:** The introduction is short and scrollable, covering investing and what the app does using owner-provided teaching sources. The student chooses one of 3–5 starter companies, is guided through a first virtual purchase, and then enters Learn. They can skip the entire sequence. The walkthrough should guide real clicks rather than merely describe controls.

**Open:** Final starter companies and why they qualify, available search during the choice, exact text and teaching sources, how much of the starting cash the student can use, whether skipping lands in Learn or Portfolio, and how the guide is replayed or resumed.

### 3.7 Portfolio

**Decided:** The portfolio follows real market prices over time and includes a prominent value graph. Keep available cash and invested holdings separate. Show the effects of decisions, not just a final balance. Teacher cash additions and weekly deposits must not count as investment gain.

**Working direction:** A main view shows total portfolio value, period change, available cash, holdings, and recent activity. A chart can provide Today/Week/Month/All ranges and point inspection; these exact controls were proposed, not expressly locked. Individual holdings can lead to company information and selling. Returning students may land here, subject to confirmation.

**Open:** Quote refresh cadence/provider, market-close and delayed-price behavior, valuation at historical dates, return calculation, dividends/splits, unavailable quotes, cash-flow-adjusted performance, and whether class comparison appears here. No live portfolio exists in the prototype.

### 3.8 Company detail, buy/sell, and confirmation

**Decided/working direction:** Students need a company view and a clear virtual purchase/sale review. Teachers' approved lists and position limits must be respected once active. Buying and selling belong to the investing flow, **not as prompts in Research's trending cards**. A blocked action should name the relevant class rule.

**Open:** Where company detail is entered from each tab, order type, share versus dollar/percentage entry, fractional shares, commissions/fees, quote-lock or execution timing, market-closed orders, cancellation, and how to handle a data outage. The landing preview's Buy/Hold/Sell buttons are illustrative only.

### 3.9 Learn: lesson entry and progression

**Decided:** Learn opens **directly into the next lesson**, not a large level-selection screen. Show a small level/progress indicator in Learn and the student's level in profile/settings. No full-screen level map. Introduce one sourced concept, then use an applied situation as the test. Required written answers are excluded.

**Working direction:** Progress reflects demonstrated understanding or skill rather than portfolio profit. Later situations can be harder than early ones. Exact level names, unlock rules, and scoring are unapproved examples until the owner supplies curriculum.

**Open:** First topic and source set, lesson format and length, progress units, retries, prerequisite rules, accessibility alternatives for timed material, and whether progress is class-assigned or self-paced. No real lesson exists yet.

### 3.10 Situation decision experience

**Decided:** A historical or clearly simulated market situation unfolds visually. An event slows or pauses market time; the student has limited decision time and can inspect the information available at that point. They decide **buy, sell, or hold** and choose a bounded quantity rather than merely guessing among three fixed answers or entering unlimited free text. The market then resumes and the consequences are shown. Early situations should be simpler; some later situations may advance months or years.

Feedback should identify specific evidence available at the pause, what the student did, and what happened. It should explain incorrect or weak reasoning without pretending an outcome was guaranteed. A sensible decision can lose money and a risky decision can win; profit and understanding must be evaluated separately.

**Working direction:** A percentage control for available cash or a holding was proposed. A visible event/date counter, pausing or replaying a long-term reveal, and a timed indicator were proposed but have no exact rules.

**Decided concept for a later situation:** A challenge may ask which stocks a student would choose if they could not buy more, aiming for the largest portfolio after a stated number of years. The event pauses for investigation and allocation, then time accelerates and the portfolio graph shows the path, including losses and recoveries. This is one scenario idea, not the only scenario or an approved first lesson.

**Open:** First scenario source and content, historical versus simulated labeling, available evidence, time limit and timeout behavior, quantity bounds, assessment rubric, acceptable alternative decisions, attempts/replay, and how scenario money relates to the ongoing class portfolio. No scenario engine is built.

### 3.11 Situation results and feedback

**Decided:** Show the decision, resulting path, and evidence that mattered. Distinguish decision quality from outcome luck. The original brief calls for plain-language feedback on the student's actions and history, with a useful non-AI version.

**Open:** When results become visible, whether classmates' choices are shown, the exact explanation format, comparison/counterfactual rules, AI involvement and review, and what counts toward level progress.

### 3.12 Market and market-story detail

**Decided:** Market is a clearer, organized, simplified financial-news page. It prioritizes **today**, then the recent **week/month**, with lookup for a past date. Stories need sources. Students should understand what happened and which companies or industries were affected. Separate confirmed events from possible interpretations of a price move.

**Working direction:** A lead story, grouped secondary headlines, short summaries, and a fuller linked story view were accepted as the starting page structure.

**Open:** News/source providers and licensing, geographic/exchange coverage, update cadence, editorial selection, archive depth, attribution format, corrections, and what to show when no reliable explanation exists. Market-to-Research navigation was proposed; its exact behavior is not locked.

### 3.13 Research and company deep dive

**Decided:** Research teaches students how to investigate companies and follow relationships beyond a stock price, including products, suppliers, materials, and other businesses. Its main page highlights **most researched** and **most purchased** companies, particularly less familiar ones, with short **sourced** factors explaining attention. Selecting a company opens a deeper informational view and its connections. These placements are for knowledge, **not direct buy prompts**.

**Working direction:** Company search and tools to inspect trends, revenue/product context, and supporting sources were proposed. Short guidance can explain how to read evidence within the tool.

**Open:** Whether rankings use MOMENT student activity, the overall market, or another population; time windows; minimum sample sizes; manipulation/privacy safeguards; how “less familiar” is defined; research data providers; relationship evidence standard; saved research; and the exact structure of the deep dive. No ranking, source feed, or company database exists yet.

### 3.14 Class/Join entry, class games, and team play

**Decided:** The student-facing Class area is lightweight: join or enter teacher-hosted activities, without a large game hub. Situations can be personal or class-hosted. Every game mode should support teams. A teacher chooses individual or team play and can assign teams manually or randomly.

For team play, one **randomly selected leader per team** remains leader for that whole game; a new leader may be picked for another game. Every teammate sees the same information/question and discusses it. Only the leader submits the team's answer/action. Non-leaders share one teammate role for now. A role reveal should tell each student what they can do.

**Original product goal:** Classmates may compare choices and outcomes, with friendly rivalry and results. The exact scoreboard and comparison rules are not decided.

**Open:** The actual list and count of class game modes. A Kahoot/STAX-like idea was floated, but no detailed mode was approved. Also open: team size, formation constraints, leader reassignment when disconnected, late joiners, teacher launch/pause/reveal controls, discussion tools, timers, ties, score and ranking rules, game persistence, and lobby/results screens. None is implemented.

### 3.15 Profile/settings, Help, privacy, and recovery

**Decided:** Account settings, Help, and privacy information are needed. The student's level appears in profile/settings. The first-time walkthrough should be replayable from Help. Error/recovery paths are needed for forgotten access, invalid class codes, unavailable data, and interrupted games.

**Open:** Profile fields, account deletion/export, support channel, student-data policy, teacher/student permissions, legal/privacy text, and recovery behavior. These pages do not exist today.

## 4. Cross-cutting rules

- **Virtual versus real:** All balances, deposits, orders, and outcomes inside MOMENT are virtual. Market prices/news may describe real companies and events when properly sourced. The product must never imply a real-money trade.
- **Accuracy and uncertainty:** News, company relationships, research reasons, historical scenarios, and educational claims need suitable sources. Do not label a company “safe” because it is large or familiar. Do not treat a correct market prediction as the sole learning outcome.
- **Money accounting:** Keep cash, market value, teacher adjustments, weekly deposits, and investment return distinguishable. Added virtual money does not improve performance by itself.
- **Teacher rules:** Class defaults must be visible to students and editable by teachers. Individual exceptions and an audit trail are intended later. No settings change silently sells holdings.
- **Content ownership:** The owner supplies topics and educational sources. Example copy, mock data, concept art, and landing previews are not approved lessons or market claims.
- **AI:** Optional support for explanations is a future possibility; the educational path must work without it.
- **Simplicity:** Avoid bringing back the old app's many competing pages, large game hub, or full-screen level map.

## 5. Current build versus planned product

The code currently implements **a landing presentation and a single-browser teacher setup prototype**. Its hash routes are `/`, `/teacher/setup`, `/teacher`, `/teacher/class/:id`, and `/teacher/class/:id/edit`, plus recovery states. Saved teacher and class data live only in browser `localStorage` under `reign.teacher-prototype.v1`. Clearing site data removes it. There is no server synchronization, account authorization, student enrollment, live feed, order execution, working deposits, lessons, situations, rankings, or games. The class code is a preview code. The landing research and decision interactions are illustrations.

The prototype currently uses a $10,000 starting-cash default, all supported stocks, trading enabled, no concentration limit, weekly deposits off, and no class dates. It allows a class name and teacher name of 2–80 characters, virtual amounts from $0.01 to $1,000,000, a 1–100% position limit, and 1–100 approved ticker symbols. **These are current implementation choices, not separately approved production defaults or limits.**

The recorded working implementation order was: (1) teacher setup/class creation prototype; (2) student joining/onboarding; (3) first guided virtual purchase into Learn using owner-provided content; (4) real accounts/shared class storage and then live market/trading infrastructure. This is a planning sequence, not a committed release date or permission to treat previews as production.

## 6. Open decisions and questions

The following gaps should be resolved before implementing the affected feature. They are intentionally unanswered here.

### Scope and navigation

1. What is the first complete student test or release slice: teacher signup → student joins → guided purchase → Learn, or a smaller subset? Which of the four student areas must be real at that point?
2. After onboarding, where does a returning student land? Does Skip go to the same place? Is the interactive walkthrough part of onboarding or a separate first-use guide?
3. Which class games beyond situations actually belong in the first version? The conversation did **not** settle a count of three modes.

### Learning and games

4. What first topics, source documents, and historical/simulated situations will the owner provide? What is the first situation's learning objective and acceptable reasoning?
5. What are the exact situation timer, quantity bounds, timeout behavior, retries, scoring/progression rules, and class reveal rules?
6. What is the relationship between situation money and a student's ongoing portfolio? If they are separate, what results carry back into the class experience?
7. What team size, late-join behavior, and disconnected-leader rule should class games use? What can the teacher pause, change, or reveal during a game?

### Market, trading, and research data

8. Which real-market data and news providers, markets, quote-delay level, and history rights can MOMENT use? What happens when markets are closed or data is stale?
9. How do virtual orders execute: shares or dollars, fractional shares, execution time/price, fees, dividends/splits, rejected orders, and market-closed requests?
10. Whose activity defines “most researched” and “most purchased,” over what period, and how is a short “why” statement verified without inventing a causal claim?
11. What are the final starter companies and supported/teacher-approved company universe? No “safe” or “stable” company label has been justified.

### Teacher and account rules

12. What are the production class defaults, how do individual overrides work, and what happens to existing positions when a company becomes disallowed or trading is paused?
13. How are virtual cash adjustments and weekly deposits recorded, reversed, scheduled across timezones, and separated from investment performance? What does a student see?
14. What are the teacher/student authentication and privacy requirements, including multi-class membership, co-teachers, class-code lifecycle, and account recovery?
15. What exactly must the teacher workspace report about participation, decisions, progress, and class-game results?

### Feedback, media, and operations

16. Which feedback is deterministic, and what may AI draft? Who checks factual accuracy, and what happens when AI or source data is unavailable?
17. What should the landing learning video actually demonstrate after the inner app is built? The autoplay placement is decided; its content is not.
18. What help, privacy, data-retention, deletion, export, and support policies should the production app provide?

The most immediate blockers for the next **student** implementation are the first release slice, first owner-provided learning source/topic, market/order rules for the guided virtual purchase, and the class-join/account model.
