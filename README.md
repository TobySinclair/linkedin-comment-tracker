# LinkedIn candidate tracker (Cloudflare Pages + D1)

Static `index.html` card feed with a small same-origin API under `/api/statuses` so action status syncs across devices. Auth is a shared secret sent as `X-Tracker-Key` (set in Pages as `TRACKER_KEY` and pasted into the script in `index.html`).

**Schema note:** The original brief used `done` / `skip` / `todo`. The live page uses **Comment only**, **Comment + connect**, and **Skip**, which map to `comment-only`, `comment-and-connect`, and `skip` in the database and API. The API also accepts `done` (stored as `comment-and-connect`) and `todo` (removes the row) for compatibility with scripts or old clients.

## Deploy steps

1. `npm create cloudflare@latest linkedin-tracker` → “Pages” → “static site” → “no framework” (or clone this folder into a new repo and skip the scaffold).
2. Push to a private GitHub repository.
3. Cloudflare dashboard → **Workers & Pages** → **Create** → **Pages** → connect the repo, production branch `main`, auto-deploy on push.
4. Build settings: **Build command** empty, **Build output directory** `/` (root of the repo where `index.html` lives). Do **not** set the build command to `wrangler deploy`—that is for Workers only and will fail on a Pages static site. Pages already picks up the `functions/` directory as [Pages Functions](https://developers.cloudflare.com/pages/functions/) on deploy.
5. Create the D1 database: `npx wrangler d1 create linkedin-tracker` and copy the `database_id` into `wrangler.toml` under `[[d1_databases]]` (optional for local `wrangler pages dev` / CI; the dashboard binding is what production uses if you do not use wrangler to deploy).
6. Apply the schema:  
   `npx wrangler d1 execute linkedin-tracker --remote --file=schema.sql`
7. In the **Pages** project: **Settings** → **Functions** → **D1 database bindings** → add binding name **`DB`**, select the `linkedin-tracker` database. Do this for **Production** and **Preview** if you use preview deployments.
8. **Settings** → **Environment variables** (Production + Preview): set **`TRACKER_KEY`** to a long random string.
9. After deploy, smoke test:  
   `curl -H "X-Tracker-Key: <your key>" "https://<project>.pages.dev/api/statuses"`  
   should return `{}` (or a JSON object of id → status after you use the UI).
10. In `index.html`, set the `TRACKER_KEY` variable in the `<script>` to the same value, commit, and push. Redeploy (or let auto-deploy run).

**Local preview:** from this directory, you can use `npx wrangler pages dev .` with a `.dev.vars` file:

```
TRACKER_KEY=local-dev-key
```

and a local D1 (see [D1 local development](https://developers.cloudflare.com/d1/best-practices/local-development/)) after binding `DB` in `wrangler.toml` with a real or placeholder `database_id` and `wrangler d1 execute linkedin-tracker --local --file=schema.sql`.

## Scheduled HTML updates (separate from this repo’s code)

A daily job can write new day sections to `index.html` and push to `main` so Pages redeploys. The automation needs a **fine-grained GitHub PAT** with `contents: write` on this repository only. Store the PAT in a file **this repository does not track**:

- **Path (local, optional):** `linkedin-tracker/.config.json` in your clone, listed in `.gitignore`, e.g. `{ "github_pat": "ghp_...." }` for your scheduler to read. Adjust structure to what your job expects.

## API

- `GET /api/statuses` — JSON map of `data_id` → `status` (only cards with a stored status; `todo` is implicit when absent). Header: `X-Tracker-Key`.
- `PUT /api/statuses/<id>` — body `{"status":"comment-only|comment-and-connect|skip|done|todo","audience":null}` — `audience` optional: `chro`, `icp`, `influencer`. `todo` removes the row.
- `DELETE /api/statuses/<id>` — remove row (reset to TODO in the UI).

All mutating methods require `X-Tracker-Key` or they return 401.

## Future (not implemented)

- Optional `notes` and `created_at` columns on `card_status` for per-card notes and time-to-action metrics.
- Cloudflare Access in front of the site for real SSO; keep `TRACKER_KEY` as an additional layer for the API or replace with session-based checks later.
