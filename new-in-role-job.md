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

## Search — announcement language + ICP titles (past week, UK)

Pick 8–10 of these per run, rotating so all get hit across the week. Latest sort, past-week filter.

1. `"delighted to join" "Head of L&D" OR "Head of Learning"`
2. `"excited to share" OR "excited to announce" "Head of Employee Relations"`
3. `"thrilled to" "Chief People Officer" OR "CHRO" OR "People Director"`
4. `"starting a new" "Head of Compliance" OR "Director of Compliance"`
5. `"joined" "as Head of" L&D OR HR OR compliance OR "Employee Relations"`
6. `"new role" "Head of Manager Development" OR "Head of Talent"`
7. `"my first 90 days" new role HR OR L&D OR compliance`
8. `"promoted to" "Head of" HR OR L&D OR compliance`
9. `"delighted to have joined" OR "pleased to share" CHRO OR "People Director" OR "Head of OD"`
10. `"excited to be joining" "Head of Risk & Compliance" OR CCO OR "Head of Customer Outcomes"`
11. `"new chapter" "Head of Leadership Development" OR "Head of Organisational Development"`
12. `"taking on" "Head of People Risk" OR "Head of HR Policy"`

Route every hit by poster role using playbook §3 (CHRO / Compliance / Law Firm / Influencer). Most fit CHRO; route Compliance titles to Compliance, partners to Law Firm. Disqualify vendors/recruiters announcing their own moves unless genuinely ICP.

**Qualifying:** the post is a genuine personal move announcement, poster matches an ICP role at a 500+ UK firm (or a regulated firm for Compliance). Engagement threshold does NOT apply — a move announcement qualifies at any reaction count; the signal is the move, not the audience.

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
