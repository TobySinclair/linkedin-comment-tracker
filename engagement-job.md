# LinkedIn Engagement Scan (keyword + comment-mining + likers)

Automated run. Toby is not present — execute autonomously, make reasonable choices, note anything unusual in the run notes.
Do NOT post comments on LinkedIn; Toby reviews and posts manually.

**Cadence:** a few times a week. This is the heavy scan (~50–75 min). Buyer-intent (Path 5) and new-in-role moves are now separate faster jobs — this job is the topic-engagement signal only.

## Objective

Scan LinkedIn and produce ~8–12 candidates across **four audiences**, written to `index.html`:

- **CHRO / HR buyer** (highest priority) — champions beneath the CHRO. Path 1 (Compliance / Risk): Head of Employee Relations, HR Policy & Compliance, People Risk. Path 2 (Leadership & Manager Dev): Head of L&D, Leadership Development, Manager Development, Talent, OD. Plus CHRO / CPO / HR Director sign-off level. 500+ UK. Tier-1: FS, Social Housing, Healthcare, Contact Centres / BPO.
- **Compliance** — Head of Compliance, CCO, Director of Compliance, Head of Risk & Compliance, + Customer Outcomes, General Counsel, Internal Audit, NED with risk oversight. UK-regulated, FCA primary.
- **Law Firm** — UK employment-law partners, senior associates, PSLs, knowledge counsel. Stages for comments AND the richest Track-2 comment-mining ground. **25+ reactions.**
- **Influencer** — vendors, consultants, recruiters, Big 4, publications, non-lawyer thought leaders. Stages, not leads. **30+ reactions.**

Roughly 3 per audience. Quality over quantity. Full audience definitions, thresholds and routing live in **playbook §3** — read it; don't re-derive them here.

All shared mechanics (infra/clone/push, voice for comments + connection notes + liker DMs, HTML card templates, slug formats, link format) live in the **playbook**. This spec carries only what's specific to the engagement scan: the search corpus, the sampling rules, the Law Firm / Influencer routing, Track-2 comment-mining, and the Step 2.5 liker extraction.

## Setup

1. Clone the repo (playbook §1; bootstrap supplies `$PAT` and `$WORK`).
2. Read `${WORK}/playbook.md` in full.
3. This job's page = **`index.html`**. Touch only this page. (The Watchlist job owns `watchlist.html`; the new-in-role and active-buyer jobs own their own pages — never touch those.)
4. Read the last 7 days of `data-id` values in `index.html`; do not duplicate posters or posts. Note the tone of any draft comments Toby edited in place and match it.
5. Navigate to https://www.linkedin.com/feed/ to confirm login. Login wall → stop and surface a clear error.

## Run budget

- **~45 keyword searches** — ~30 across Audience A (CHRO), ~12 across Audience B Track 1 (Compliance), 4–6 Influencer modifiers. (Law Firm needs no own searches — it inherits.)
- **Named-account watchlists** — quick scroll of last 48h posts across the Audience C and Audience D seed accounts at the start, before keyword discovery.
- **Comment-mining (Track 2)** — on any post clearing 50+ reactions, scan comments for ICP practitioners (3–8 posts per run).
- **Output** — 8–12 candidates, ~3 per audience.
- Time split: ~40% Audience A · ~30% Audience B · ~15% Law Firm · ~15% Influencer. Move on fast from dry searches.

## Search syntax note (from the new-in-role learning)

LinkedIn content search handles long boolean `OR` chains poorly and ampersands (`L&D`) break matching. Many searches below use `OR` — where one consistently returns junk, split it into two short quoted-phrase queries instead, and flag the weak cluster in the run notes so the corpus can be tuned over time. Use the past-week filter, latest sort.

## Audience A — CHRO / HR buyer

Target the champions directly (they post far more than the CHRO). Buying triggers (2026): Worker Protection Act (Oct), FCA NFM rules (Sept), whistleblowing extension (Apr), EHRC enforcement, Employment Rights Act 2025, new CHRO / new leadership programme.

**Sampling: pick TWO searches from each lettered cluster per run. Paths 3 and 4 are single clusters — pick 4–6 from each. ~30 searches total. Path priority when quality is equal: Path 3/4 (intent) before Path 1/2.**

### Path 1 — HR Compliance & Risk

*Regulation & enforcement (vendor/law-firm-heavy — use sparingly for direct leads, great for Track-2 mining):*
1. `"Worker Protection Act" "all reasonable steps"`
2. `"non-financial misconduct" OR "NFM" OR "COCON"`
3. `"Employment Rights Act" employer OR HR`
4. `"EHRC" enforcement OR agreement OR uplift employer`
5. `"tribunal" harassment OR bullying OR discrimination 2026`

*Investigation & casework (practitioner-language, high yield):*
6. `"grievance investigation" OR "harassment investigation"`
7. `"workplace investigation" lessons OR interview OR handled`
8. `"disciplinary" hearing OR investigation HR`
9. `"employee relations" casework OR "lessons learned" OR "we learned"`
10. `"Acas" OR "ACAS" harassment OR grievance OR "early conciliation"`
11. `"dignity at work" policy OR breach OR culture`
12. `"HR casework" OR "ER casework"`

*Disclosure, whistleblowing, bystander:*
13. `"whistleblowing" disclosure response OR handling OR retaliation`
14. `"speak up" findings OR barrier OR "speak-up culture"`
15. `"bystander" intervention OR "stood by" workplace`
16. `"protected disclosure" handling OR response`

*Dissatisfaction / intent signals (rich buying moment):*
17. `"incidents" "despite training" OR "still happening"`
18. `"policy" "on paper" OR "vs practice" OR "in practice"`
19. `"reasonable steps" evidence OR prove OR documented OR beyond`
20. `"preventive duty" employer OR "reasonable steps"`

*Cross-sector (Social Housing, Healthcare, Contact Centres):*
21. `"psychosocial" risk workplace OR "ISO 45003" OR HSE`
22. `"third-party harassment" OR "third party harassment" customer OR client`
23. `"safeguarding" disclosure manager OR training`
24. `"vulnerable tenant" OR "vulnerable customer" manager OR handling`

### Path 2 — Leadership & Manager Development

*Knowing-doing & readiness:*
25. `"knowing-doing gap" OR "knowing doing gap"`
26. `"freeze" manager OR leader conversation OR moment`
27. `"first time" manager OR "thrown in" OR "no rehearsal"`
28. `"accidental manager" OR "reluctant manager"`
29. `"new manager" readiness OR onboarding OR "first 90 days"`

*Manager scenarios:*
30. `"difficult conversations" manager OR leader`
31. `"crucial conversations" manager OR leader`
32. `"tough feedback" OR "hard feedback" manager`
33. `"performance conversation" OR "performance review" manager`
34. `"underperformance" manager OR handling OR conversation`
35. `"performance improvement plan" OR "PIP" manager OR HR`
36. `"return to work" conversation manager OR absence OR "long-term sickness"`
37. `"stay interview" OR "retention conversation" manager`

*L&D jargon (highest practitioner density):*
38. `"learning transfer" OR "training transfer" workplace OR job`
39. `"behaviour change" leader OR manager OR L&D`
40. `"leader as coach" OR "manager as coach"`
41. `"70 20 10" OR "70-20-10" learning OR application`
42. `"capability framework" OR "competency framework" manager OR leader`
43. `"Kirkpatrick" "level 3" OR "level 4" OR behaviour`
44. `"learning in the flow of work"`
45. `"CIPD" research OR report OR conference`
46. `"Learning Technologies" OR "LPI" OR "World of Learning"`

*Programme & workshop frustration:*
47. `"leadership programme" impact OR "didn't stick" OR transfer`
48. `"workshop" "didn't transfer" OR "back to old habits" OR fatigue`
49. `"peer role play" OR "peer roleplay" realistic OR limitations OR awkward`
50. `"management training" "doesn't work" OR "falls short" OR rethink`

*Frontline & manager-population:*
51. `"line manager" capability OR development OR readiness OR gap`
52. `"frontline manager" OR "frontline leader" development OR capability`
53. `"people manager" training OR capability OR development`
54. `"manager effectiveness" data OR evidence OR measure`

### Path 3 — Solution-aware (pick 4–6)

Route by poster role: HR/L&D → CHRO; Compliance → Compliance; partners → Law Firm; vendors → Influencer.
55. `"AI roleplay" OR "AI role-play" OR "AI role play"`
56. `"roleplay" OR "role-play" L&D OR learning OR leadership`
57. `"conversation simulation" OR "conversational simulation"`
58. `"learning simulation" OR "behavioural simulation" OR "behavioral simulation"`
59. `"scenario simulation" OR "scenario-based" learning OR training`
60. `"AI coach" OR "AI coaching"`
61. `"AI tutor" OR "AI mentor"`
62. `"generative AI" L&D OR learning OR training`
63. `"immersive learning" OR "immersive simulation"`
64. `"deliberate practice" manager OR leader OR conversation`
65. `"rehearsal" "difficult conversation" OR "tough conversation"`
66. `"practice platform" manager OR training OR leadership`
67. `"safe to practise" OR "safe to practice" OR "safe space to practice"`
68. `"digital coaching" OR "coaching at scale"`

### Path 4 — Status-quo challenge (pick 4–6)

Same routing by poster role.
69. `"tick box" OR "tickbox" OR "tick-box" training`
70. `"mandatory training" "doesn't work" OR ineffective OR broken OR pointless`
71. `"compliance training" broken OR failing OR rethinking OR "not enough"`
72. `"e-learning" "doesn't work" OR ineffective OR limitations OR alternative`
73. `"sheep dip" OR "sheepdip" training`
74. `"one and done" OR "one-and-done" training`
75. `"training fatigue"`
76. `"completion rates" meaningless OR enough OR "beyond completion"`
77. `"certificate" "doesn't prove" OR "isn't evidence" OR competence`
78. `"rethinking" compliance OR L&D OR "learning and development"`
79. `"future of" compliance OR L&D OR "learning and development"`
80. `"is training enough" OR "is e-learning enough"`

**(Path 5 active-buyer searches have moved to the separate active-buyer job.)**

## Audience B — Compliance (Track 1 keyword + Track 2 mining)

Time inside B: ~40% Track 1, ~60% Track 2. **Track 1 sampling: TWO from each of the six clusters = 12 searches. Prioritise Dissatisfaction and Evidence/Assurance clusters.**

*Regulatory vocabulary:*
81. `"three lines of defence" OR "three lines of defense" compliance OR risk`
82. `"second line" assurance OR effectiveness OR testing OR challenge`
83. `"SMCR" OR "Senior Managers Certification Regime" OR "SMF"`
84. `"fit and proper" OR "F&P" assessment OR certification`
85. `"SYSC" OR "senior management arrangements"`
86. `"regulatory change" horizon OR scan OR monitoring`
87. `"control testing" OR "controls effectiveness"`
88. `"risk appetite" conduct OR culture OR statement`

*FCA enforcement & thematic (buying triggers):*
89. `"FCA fine" OR "FCA enforcement" 2026`
90. `"Dear CEO" letter FCA`
91. `"thematic review" FCA OR findings OR lessons`
92. `"section 166" OR "s166" OR "skilled person"`
93. `"enforcement notice" OR "warning notice" FCA`
94. `"final notice" FCA OR PRA`
95. `"regulatory breach" disclosure OR reportable OR lessons`

*Conduct, culture & people-risk:*
96. `"conduct risk" culture "financial services"`
97. `"compliance culture" OR "culture of compliance"`
98. `"people risk" OR "behavioural risk" compliance`
99. `"non-financial misconduct" OR "NFM" OR "COCON" OR "PS25/23"`
100. `"bullying" OR "harassment" SMCR OR COCON OR regulated`
101. `"conduct rules" breach OR training OR certification`

*Evidence, assurance & monitoring (direct pitch territory — prioritise):*
102. `"evidence" "competence" compliance OR regulatory`
103. `"compliance monitoring" OR "monitoring plan" effective OR meaningful`
104. `"compliance testing" OR "assurance testing"`
105. `"audit readiness" OR "FCA visit" OR "regulatory visit"`
106. `"board reporting" compliance OR conduct OR culture`
107. `"management information" OR "compliance MI" meaningful OR beyond`
108. `"assurance mapping" OR "assurance framework"`

*Specific risk areas (deadline-driven):*
109. `"Consumer Duty" vulnerable customers OR outcomes OR "fair value"`
110. `"Consumer Duty" "year 2" OR "year 3" OR review OR lessons`
111. `"Worker Protection Act" compliance OR risk OR regulated`
112. `"financial promotions" OR "FinProm" compliance`
113. `"conflicts of interest" disclosure OR training OR handling`
114. `"market abuse" OR "MAR" training OR prevention`
115. `"operational resilience" testing OR scenario`

*Dissatisfaction / intent signals (prioritise):*
116. `"tick box" compliance OR "compliance theatre"`
117. `"paper compliance" OR "on paper" compliance`
118. `"compliance fatigue" OR "compliance burden"`
119. `"beyond training" compliance OR regulatory`
120. `"compliance training" "not enough" OR "doesn't work"`
121. `"completion rate" compliance OR "93%" OR "100%" compliance`

**Track 2 — Engagement mining:** find high-engagement (20+ reactions) vendor/law-firm posts on these topics, open them, scan comments for ICP practitioners. Record the COMMENTER as the lead; their comment → Post topic; the draft reply references their comment (playbook §4 Track-2 shape). Note "Found via comment on [firm]'s post."

## Audience D — Law Firm (inherits searches + named watchlist + Track-2)

**No own searches** — every Path 1–4 and Track-1 search throws off law-firm content. Anything authored by a Partner / Senior Associate / Knowledge Counsel / PSL / Employment Lawyer / Barrister at a recognisable firm routes here. **25+ reactions.** Skip ads, firm-promo, boilerplate legal updates.

**Named-account watchlist (scan last 48h at run start):** Top tier — Lewis Silkin, Pinsent Masons, Eversheds Sutherland, Hogan Lovells, DLA Piper UK, Clyde & Co, Bates Wells, Mishcon de Reya, Fox Williams, Dentons UK. Second tier — Linklaters, Slaughter and May, A&O Shearman, Freshfields, Norton Rose Fulbright, CMS UK, Travers Smith, Macfarlanes, Withers, Stevens & Bolton. Append named individual lawyers as they surface (25+ reactions on ICP posts).

**Track 2 on Law Firm — the single highest-yield move the scan can make.** For ANY law-firm post with 50+ reactions, scan comments for CHRO-side / Compliance-side practitioners and route them to CHRO or Compliance. One strong Lewis Silkin / Pinsent Masons Worker-Protection post can surface 5+ qualified Heads of ER or Compliance in one pass — better than any keyword search.

Comment tailoring: legal precision. Reference the specific case / regulator phrase / tribunal finding the lawyer used; ask a question that probes the practical employer-side implication, not the legal mechanic.

## Audience C — Influencer (inherits searches + modifiers + named watchlist + Track-2)

Vendors / consultants / Big 4 / publications / non-lawyer thought leaders, **30+ reactions** (50+ gold, 100+ great). Stages, not leads. Skip anything 25–29 (floor moved). Inherited A+B vendor results auto-route here if they clear 30+.

**Influencer modifiers (pick 4–6):**
122. `"research" OR "report" OR "whitepaper" compliance OR L&D OR HR 2026`
123. `"survey" OR "poll" findings compliance OR HR OR manager`
124. `"trends" OR "outlook" OR "predictions" compliance OR HR 2026`
125. `"benchmark" compliance OR HR OR L&D report`
126. `"data shows" OR "our research" compliance OR HR OR manager`
127. `"five things" OR "three things" OR "what every" CHRO OR compliance OR HR`
128. `"client work" OR "what we're seeing" compliance OR HR OR manager`
129. `"case study" harassment OR compliance OR manager training`

**Named-account watchlist (scan last 48h at run start):** Big 4 — Deloitte People Advisory, PwC People & Organisation, KPMG People, EY People, Mercer UK, Korn Ferry, BearingPoint. Compliance/publications — UK Finance, Compliance Week, Thomson Reuters Regulatory Intelligence, City A.M. regulation, Financial News. HR/L&D bodies — CIPD, People Management, Personnel Today, HR Grapevine, HR Magazine, Training Journal, LPI, Learning Technologies. Named thought leaders — Sarah Jackman, Jo Morgan, Sue Saunders, Jessie Jones (append new 30+ faces).

**Track 2 on Influencer — do aggressively.** For ANY Influencer post with 50+ reactions, scan comments for CHRO / Compliance / Law Firm practitioners and route them. One strong Big 4 post can surface 5+ qualified practitioners.

## Step 2.5 — Liker extraction (MANDATORY, ICP-only)

This is the single most commonly forgotten step and the most efficient lead source — likers have pre-qualified themselves by reacting to an ICP post. **Run it on every candidate post with 10+ reactions.** Legitimate skips: post has <10 reactions, post unreachable, or every reactor is non-ICP — each must be noted in run notes. Any other skip is a failure.

After the day's candidates are locked but BEFORE writing HTML:

1. **Navigate to each candidate post.** Preferred: `https://www.linkedin.com/in/<real-slug>/recent-activity/all/` if a real slug was confirmed. Fallback: re-run the keyword search that surfaced it. If neither works, skip that one and note "liker extraction skipped — post not directly reachable."
2. **Open the reactions modal by clicking the reaction COUNT number, never the Like button** (the Like button registers Toby as a reactor). If the modal won't open, try the three-dots overflow; do NOT click Like. If an accidental Like registers, capture the other reactors anyway and flag prominently: "needs manual unlike before public comment."
3. **Capture each reactor:** name, full headline, degree, company. Scroll within the modal until no new entries load.
4. **Exclude:** Toby himself; company pages (logo + "X followers", no person); obviously off-ICP roles; **Influencer-tier reactors** (vendors, consultants, recruiters, Big 4, journalists, generic thought leaders) — they are stages, not leads. Keep law-firm partners (Audience D).
5. **Route kept reactors to one of three audiences only — CHRO / Compliance / Law Firm** (see playbook §3). Gold-standard examples: Verdun Moar (Speak Up Lead, Lloyds) and Kate Hinchy (Head of Audit — Conduct & Regulatory Compliance, Santander) → Compliance. Drop everything else. If every reactor is non-ICP, note "Liker extraction on [Poster]'s post: 0 ICP reactors out of N."
6. **Draft one DM-style message per kept reactor** (playbook §6 liker-DM shape) and render a liker card (playbook §7 liker template). Insert liker cards after the candidate cards, numbered continuously.

## Audience tailoring (Step 3)

- **CHRO:** lead with business / people / regulatory-risk consequence; patterns across HR leaders.
- **Compliance:** evidence / stress-test / activity-vs-outcomes; the most credible voice.
- **Law Firm:** legal precision; reference the case / regulator frame; push the employer-side question.
- **Influencer:** practitioner angle that complements, not competes with, the poster's point.

Prioritise posts where Toby has a genuine perspective to add.

## Write & push

1. Build today's `<section class="day" data-date="YYYY-MM-DD">` (playbook §7 wrapper). Candidate cards ordered **CHRO → Compliance → Law Firm → Influencer**, then **liker cards (CHRO / Compliance / Law Firm only)**. Number 1..N across the whole day; first liker is N+1.
2. Insert after `<!-- NEWEST-DAY-INSERT-BELOW -->` in `index.html`. Don't modify prior days, the head/style/script/toolbar, or any other page. If the toolbar lacks a Law Firm chip, still emit `data-audience="law-firm"` cards (they show under All) and flag in run notes.
3. End with `<div class="run-notes">`: dry searches, automation issues, strongest picks, near-threshold flags, AND the mandatory liker-pass addendum (candidates ≥10 reactions vs skipped, modals opened, liker cards created vs reactors skipped and why — including Influencer-tier filtered out — any accidental-Like incidents).
4. Commit + push per playbook §2 (`git config user.name "linkedin-engagement"`, `git add index.html`).
5. If push fails, surface stderr and STOP. No local fallback. If the run yields little, still write a short day section and push so the run is logged.
