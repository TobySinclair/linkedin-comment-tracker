# LinkedIn New-in-Role Scan

Automated run. Toby is not present — execute autonomously, note anything unusual in run notes.
Do NOT post comments. Toby reviews and posts manually.

**Cadence:** daily. Moves decay fast — the value is catching someone in their first weeks.

## Objective

Find UK ICP people who have just **announced a new senior role**, and produce candidate cards with a congratulatory comment + connection note. New-in-role is a peak-receptivity buying signal: a new CHRO / Head of L&D / Head of ER wants to make their mark and is actively deciding what to rebuild. Target ~5–8 candidates per run.

## Setup

Read the shared playbook first — it holds all infra, voice, templates, slugs and routing. This job adds only the searches and the comment-shape override below.

1. Clone the repo (playbook §1).
2. Read `${WORK}/playbook.md` in full.
3. This job's page = **`new-roles.html`** (playbook §1 table). Touch only this page.
4. Read the last 14 days of `data-id` values in `new-roles.html`; skip anyone already logged.

## Search — "Starting a new position" + ICP title (past week)

**Primary phrase: `"Starting a new position"`.** LinkedIn auto-stamps this on every job-change post (the generated text reads "I'm happy to share that I'm starting a new position as <Title> at <Company>"). Pairing it with an ICP title keyword is the single most reliable way to surface real moves — far better than guessing announcement wording. Use TWO short quoted phrases per query, latest sort, past-week filter. **Do not use ampersands in the encoded query** (`L&D` breaks matching — use `"Head of Learning"` instead).

Pick 8–10 per run, rotating titles across the week:

1. `"Starting a new position" "Head of Learning"`
2. `"Starting a new position" "Head of Talent"`
3. `"Starting a new position" "Head of Employee Relations"`
4. `"Starting a new position" "Employee Relations"`
5. `"Starting a new position" "Head of Compliance"`
6. `"Starting a new position" "Director of Compliance"`
7. `"Starting a new position" "Chief People Officer"`
8. `"Starting a new position" "People Director"`
9. `"Starting a new position" "Head of People"`
10. `"Starting a new position" "Head of HR"`
11. `"Starting a new position" "Head of Leadership Development"`
12. `"Starting a new position" "Head of Customer Outcomes"`

**Fallback phrases (use only if the above run thin):** `"I'm happy to share that I'm starting"` + title, or `"thrilled to announce" "Head of People"`, or `"new role as" "Head of L&D"`.

**Geography is the main filter and the search does NOT do it for you.** Content search is geo-blind — these queries surface moves worldwide (expect Serbia, Indonesia, US, Gulf alongside UK). Read each hit and keep ONLY UK 500+ firms (regulated firm for Compliance). Discard everything else even if engagement is high.

**Seniority filter.** Keep champion-level and above: Head of X, Director of X, CPO/CHRO/People Director. Drop junior ICs (Adviser, Specialist, Officer, Assistant) — they're not buyers, even if UK and on-ICP-topic.

Route every kept hit by poster role using playbook §3 (CHRO / Compliance / Law Firm / Influencer). Most fit CHRO; route Compliance titles to Compliance, partners to Law Firm. Disqualify vendors/recruiters announcing their own moves unless genuinely ICP.

**Qualifying:** genuine personal move announcement, poster matches a champion-level-or-above ICP role at a 500+ UK firm (or a regulated firm for Compliance). Engagement threshold does NOT apply — a move qualifies at any reaction count; the signal is the move.

## Comment-shape override (REPLACES playbook §4 structure for this job)

A move post is not acknowledge→build→question. Use **congratulate → role-challenge note → soft priority question**:

1. **Congratulate, short, with first name.** "Congrats on the move, Sarah." / "Brilliant move, this." Vary it.
2. **One sentence on the real challenge of that specific role** — the thing they'll actually wrestle with in the first months. Reference their function.
3. **Soft open question on their first priority**, 5–10 words, What/How, second person. "What's top of your list?" / "How are you approaching the first 90?"

All playbook §4 hard rules still apply: no quotes, no em dashes, no RTS/Pressure Test, British voice, three sentences, no hashtags/emojis.

**Examples:**
- Congrats on the move, Sarah. The first few months in an L&D lead role are usually where you decide what gets rebuilt vs inherited. What's top of your list?
- Brilliant move, this. Stepping into a Head of ER role right as Worker Protection lands is a real moment to set the standard early. How are you approaching the first 90?
- Congrats Martin. New compliance lead is the rare window where you can actually reset what good looks like before the board fixes its expectations. What are you focusing on first?

**Connection note (override of playbook §5 opener):** congratulate variant.
- Hi Sarah, congrats on the new role. Would love to follow what you do with the manager-development side, it's a brilliant moment to rethink it.
- Hi Martin, congrats on the move into the compliance lead seat. Would love to swap notes on resetting what good looks like before year-end.

## Liker extraction

**Skip it for this job.** Reactors on a move announcement are mostly the person's network congratulating them, not topic-qualified ICP — mining them adds noise. The mover IS the lead. (This keeps the job fast.)

## Write & push

1. Build today's `<section class="day">` (playbook §7 wrapper), cards ordered CHRO → Compliance → Law Firm → Influencer, numbered 1..N.
2. Insert after `<!-- NEWEST-DAY-INSERT-BELOW -->` in `new-roles.html`. Don't touch head/style/script/toolbar.
3. Run notes: searches that yielded nothing, strongest movers, any automation issues.
4. Commit + push per playbook §2 (`git config user.name "linkedin-new-in-role"`, `git add new-roles.html`).
5. If push fails, surface stderr and STOP. No local fallback.
