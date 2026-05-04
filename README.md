# Real Talk Studio — business ops (Cloudflare Pages + D1)

Internal ops hub: LinkedIn engagement queue (`index.html`), inbox Kanban (`inbox.html`), OKRs/KPIs (`okrs.html`), with a small same-origin API under `/api/*`. Auth for APIs is a shared secret sent as `X-Tracker-Key` (set in Pages as `TRACKER_KEY` and pasted into the `<script>` in each HTML page that calls the API).

**Schema note:** The original brief used `done` / `skip` / `todo`. The live page uses **Comment only**, **Comment + connect**, and **Skip**, which map to `comment-only`, `comment-and-connect`, and `skip` in the database and API. The API also accepts `done` (stored as `comment-and-connect`) and `todo` (removes the row) for compatibility with scripts or old clients.

## Pages URL (`*.pages.dev`)

Per [Cloudflare Pages known issues ↗](https://developers.cloudflare.com/pages/platform/known-issues/), the **`*.pages.dev` hostname is fixed when the project is first created** — it does **not** change if you later rename the project in the dashboard. So **`https://realtalkstudio-business-ops.pages.dev` only exists** if you created a Pages project whose **initial** name was `realtalkstudio-business-ops`.

- **Existing project:** In the dashboard, open the project → **Domains** (or the production deployment) and use the **`https://<original-name>.pages.dev`** URL Cloudflare shows there. That URL should still work after a “rename” (the rename may only affect labels; the `pages.dev` host stays the original).
- **To use a new `*.pages.dev` name:** Create a **new** Pages project with the desired name **at creation time**, connect the same Git repo, re-add **D1** binding `DB`, copy **environment variables** (`TRACKER_KEY`, etc.), deploy, then point any **custom domain** at the new project if needed. Remove or retire the old project when finished.

`name` in `wrangler.toml` should match the **Pages project name** as shown in the Cloudflare dashboard (the identifier Wrangler uses), not necessarily the hostname you wish you had.

## Deploy steps

1. Optional scaffold: `npm create cloudflare@latest realtalkstudio-business-ops` → “Pages” → “static site” → “no framework”, or clone this repo and skip the scaffold.
2. Push to your Git host (e.g. private GitHub repository `realtalkstudio-business-ops`).
3. Cloudflare dashboard → **Workers & Pages** → **Create** → **Pages** → connect the repo, production branch `main`, auto-deploy on push. Use project name **`realtalkstudio-business-ops`** so the URL matches `wrangler.toml`.
4. Build settings: **Build command** empty, **Build output directory** `/` (root of the repo where `index.html` lives). Do **not** set the build command to `wrangler deploy`—that is for Workers only and will fail on a Pages static site. Pages already picks up the `functions/` directory as [Pages Functions](https://developers.cloudflare.com/pages/functions/) on deploy.
5. Create the D1 database (example name; yours may already exist): `npx wrangler d1 create linkedin-tracker` and copy the `database_id` into `wrangler.toml` under `[[d1_databases]]`. The **`database_id`** is what matters; `database_name` must match the D1 resource name shown in the dashboard / used in `wrangler d1 execute`.
6. Apply the schema (use your `database_name` from `wrangler.toml`):  
   `npx wrangler d1 execute linkedin-tracker --remote --file=schema.sql`
7. In the **Pages** project: **Settings** → **Functions** → **D1 database bindings** → add binding name **`DB`**, select that D1 database. Do this for **Production** and **Preview** if you use preview deployments.
8. **Settings** → **Environment variables** (Production + Preview): set **`TRACKER_KEY`** to a long random string.
9. After deploy, smoke test against your real **`https://<project>.pages.dev`** (from the dashboard):  
   `curl -H "X-Tracker-Key: <your key>" "https://<project>.pages.dev/api/statuses"`  
   should return `{}` (or a JSON object of id → status after you use the UI).
10. In each HTML file that calls the API (`index.html`, `inbox.html`, `okrs.html`), set the `TRACKER_KEY` variable in the `<script>` to the same value, commit, and push. Redeploy (or let auto-deploy run).

**Local preview:** from this directory, you can use `npx wrangler pages dev .` with a `.dev.vars` file:

```
TRACKER_KEY=local-dev-key
```

and a local D1 (see [D1 local development](https://developers.cloudflare.com/d1/best-practices/local-development/)) after binding `DB` in `wrangler.toml` with a real or placeholder `database_id` and `wrangler d1 execute linkedin-tracker --local --file=schema.sql` (replace `linkedin-tracker` if your `database_name` differs).

## Scheduled HTML updates (separate from this repo’s code)

A daily job can write new day sections to `index.html` and push to `main` so Pages redeploys. The automation needs a **fine-grained GitHub PAT** with `contents: write` on this repository only. Store the PAT in a file **this repository does not track**:

- **Path (local, optional):** `.config.json` at the repo root (or a path your job uses), listed in `.gitignore`, e.g. `{ "github_pat": "ghp_...." }` for your scheduler to read. Adjust structure to what your job expects.

## API

- `GET /api/statuses` — JSON map of `data_id` → `status` (only cards with a stored status; `todo` is implicit when absent). Header: `X-Tracker-Key`.
- `PUT /api/statuses/<id>` — body `{"status":"comment-only|comment-and-connect|skip|done|todo","audience":null}` — `audience` optional: `chro`, `icp`, `influencer`. `todo` removes the row.
- `DELETE /api/statuses/<id>` — remove row (reset to TODO in the UI).

All mutating methods require `X-Tracker-Key` or they return 401.

## Future (not implemented)

- Optional `notes` and `created_at` columns on `card_status` for per-card notes and time-to-action metrics.
- Cloudflare Access in front of the site for real SSO; keep `TRACKER_KEY` as an additional layer for the API or replace with session-based checks later.
