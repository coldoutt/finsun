# Repository Guidelines

## Project Structure

This repository is a static finance dashboard.

- `index.html` defines the application shell.
- `styles.css` contains visual and responsive styling.
- `app.js` contains state, rendering, events, Supabase Auth, and Supabase data
  persistence.
- `supabase-schema.sql` documents the Supabase tables, triggers, and RLS
  policies.
- `metrics.json` contains public CBR rates and inflation data.
- `server/scripts/static-server.js` serves local static files only.
- `server/scripts/update-static-metrics.js` updates public CBR metrics.

Do not add personal financial seed data, user emails, passwords, session
tokens, or local account databases to the repository.

## Commands

- `npm run web:start` starts the static site at `http://localhost:5500`.
- `npm run metrics:update` refreshes `metrics.json`.
- There is no build step.

## Git Synchronization

The scheduled GitHub workflow updates `metrics.json` on `main` every morning.
It can advance `origin/main` independently of local development.

For every user-requested push:

1. Commit the verified local changes.
2. Run `git fetch origin`.
3. Run `git rebase origin/main`.
4. If the rebase changed application files, repeat the relevant verification.
5. Run `git push origin main`.

If a push is rejected because the remote advanced, repeat fetch and rebase;
do not create a merge commit and never force-push `main`.

## Data Persistence

Production persistence must remain browser -> Supabase:

- Supabase Auth stores accounts and password hashes.
- `public.profiles` stores profile names.
- `public.finance_states` stores assets, history, and budgets.
- RLS must restrict every row to its matching `auth.uid()`.

Do not introduce file-based, GitHub API, or browser financial persistence.
Supabase may persist its access and refresh tokens in browser storage; never
store passwords there.

## Coding Style

- Use plain JavaScript, HTML, and CSS.
- Use 2-space indentation.
- Use double quotes in JavaScript.
- Prefer `const` and `let`.
- Use camelCase JavaScript names and kebab-case CSS classes.
- Keep application behavior in `app.js`.

## Verification

For frontend changes:

1. Run `node --check app.js`.
2. Open the local static site.
3. Confirm unauthenticated state is empty.
4. Confirm authenticated data loads and saves through Supabase.
5. Check the browser console for errors.

Never expose a Supabase secret or service-role key. The publishable key in the
browser is expected and must be protected by RLS.
