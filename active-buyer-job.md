# LinkedIn Active-Buyer Scan (Path 5)

Automated run. Toby is not present — execute autonomously, note anything unusual in the run notes.
Do NOT post comments on LinkedIn; Toby reviews and posts manually.

**Cadence:** daily / fast. Buyer-intent posts are rare and decay fast — catching them within a day or two is the whole point.

## Objective

Find people **publicly raising their hand to spend money** on L&D / compliance / manager-training tooling, and produce candidate cards. This is the highest-conversion signal there is: rare relative to thought-leadership content, but conversion-per-comment is roughly an order of magnitude higher. One strong active-buyer candidate beats several thought-leadership candidates. Target ~3–6 candidates per run; a thin day is fine.

## Setup

Read the shared playbook first — it holds all infra, voice, templates, slugs and audience routing. This job adds only the searches, the routing overrides, and the consultative comment shape below.

1. Clone the repo (playbook §1; the calling bootstrap supplies `$PAT` and `$WORK`).
2. Read `${WORK}/playbook.md` in full.
3. This job's page = **`active-buyer.html`** (playbook §1 table). Touch only this page.
4. Read the last 14 days of `data-id` values in `active-buyer.html`; skip anything already logged.

## Routing overrides (these REPLACE the normal rules)

1. **Route by poster role.** A Head of L&D / Compliance / HR who posts a buyer question IS the lead → card them as CHRO or Compliance (or Law Firm for a partner). The poster is the buyer, regardless of company type or engagement count.
2. **Skip vendor research posts.** When a vendor / consultant posts "what's the best…?" as content marketing, it is NOT a buyer — skip it (it would be an Influencer stage on the engagement job, not a lead here). This job is buyers only.
3. **Engagement threshold = 1+ reaction.** The 30+ Influencer and 25+ Law Firm floors do NOT apply. A buyer post with two reactions still qualifies.
4. **Post-age tolerance = up to 14 days.** Flag the age in the run notes if older than a few days.
5. **No comment-mining, no liker extraction.** Comment sections on these posts are vendor-heavy by design and likers are vendors pitching. Skip both — the poster is the only lead worth taking.

## Search — buyer-intent (sample 6–8 per run, weighted to L&D / e-learning + manager-dev)

LinkedIn content search is loose; pair an intent phrase with a category term. Keep to short quoted phrases and avoid long boolean chains where you can (see syntax note at the end).

**Buyer-intent + L&D / e-learning / course creation:**
1. `"best platform" e-learning OR "online learning" OR training`
2. `"best tool" training OR onboarding OR "manager training" OR L&D`
3. `"any recommendations" e-learning OR LMS OR "course creation"`
4. `"what would you recommend" training OR e-learning OR onboarding`
5. `"looking for" platform e-learning OR LMS OR "course creation"`
6. `"easily create" e-learning OR training OR courses`
7. `"create engaging e-learning" OR "build engaging training"`
8. `"voice-over" avatar training OR e-learning`
9. `"AI avatar" training OR onboarding OR e-learning`
10. `"author" e-learning OR training "any tips" OR recommendation`

**Buyer-intent + Compliance / NFM / regulated training** (runs dry most weeks — sample once a week):
11. `"mandatory training" platform OR tool recommendation`
12. `"compliance training" "any recommendations" OR "best" OR "looking for"`
13. `"non-financial misconduct" training tool OR platform OR vendor`
14. `"Consumer Duty" training tool OR vendor OR platform`
15. `"Worker Protection Act" training tool OR documentation OR platform`
16. `"all reasonable steps" evidence OR documentation tool OR platform`

**Buyer-intent + Manager development / Conversation practice:**
17. `"best" "manager training" OR "leadership training" platform`
18. `"any recommendations" "manager training" OR "leadership programme"`
19. `"AI roleplay" OR "conversation simulation" recommendation OR "best"`
20. `"practice platform" recommendation OR best`
21. `"difficult conversations" training tool OR platform recommendation`

**Direct competitor mentions** (sample weekly):
22. `Synthesia OR Heygen OR Elai alternative OR vs OR comparison`
23. `Articulate OR Rise OR Storyline alternative OR vs`
24. `Bodyswaps OR Attensi OR Mursion alternative OR vs`
25. `Vyond OR Powtoon alternative OR vs`

**Question-format heuristics** (only when the practitioner clusters have been thin two runs running):
26. `"What is the best" L&D OR HR OR compliance OR training`
27. `"Which platform" training OR e-learning OR L&D`
28. `"Anyone using" Articulate OR Synthesia OR Vyond OR roleplay OR e-learning`
29. `"Has anyone tried" e-learning OR training OR roleplay OR LMS`

## Comment shape (REPLACES playbook §4 — this is the consultative shape, not acknowledge→build→question)

Skip the validation opener. Reframe their problem in their own language, give one specific angle on what to look for in the category (NOT a product pitch), and end with a consultative open question that surfaces context Toby would need (sector, course topic, manager population, learner volume). All playbook §4 hard rules still apply: no quotes, no em dashes, no RTS / Pressure Test, British voice, simple words, no hashtags / emojis.

**Example (L&D buyer-intent post):**
> What kind of mandatory courses are you having to build? Voice-over and avatar handles the explainer bit fine, where most of these tools fall down is when the course needs the learner to actually practise the behaviour the policy covers, not just watch someone narrate it. What topics are you covering?

**Connection note** — standard playbook §5 structure (Hi <First>, reference the post, soft invitation) but consultative:
> Hi Wouter, saw your question on the best platform for mandatory e-learning. Would love to swap notes on what's worked when the course needs the learner to actually practise the behaviour, not just watch the avatar.

## Write & push

1. Build today's `<section class="day">` (playbook §7 wrapper), candidate cards numbered 1..N, each tagged `data-audience` by poster role (chro / compliance / law-firm).
2. Insert after `<!-- NEWEST-DAY-INSERT-BELOW -->` in `active-buyer.html`. Don't touch head/style/script/toolbar or any other page.
3. Run notes: searches that yielded nothing, the strongest buyer post (flag prominently — these are the highest-value finds), any post older than a few days with its age.
4. Commit + push per playbook §2 (`git config user.name "linkedin-active-buyer"`, `git add active-buyer.html`).
5. If push fails, surface stderr and STOP. No local fallback.

## Search syntax note

Per the new-in-role learning: LinkedIn content search handles long boolean `OR` chains poorly and ampersands (`L&D`) break matching. Where a search underperforms, try splitting it into two short quoted-phrase queries (an intent phrase + one category term) rather than one long boolean. Flag any cluster that consistently returns junk in the run notes so the corpus can be tuned.
