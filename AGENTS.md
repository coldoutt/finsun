# Repository Guidelines

## Project Structure & Module Organization

This repository is a static finance dashboard.

- `index.html` defines the application shell and UI markup.
- `styles.css` contains all visual styling and responsive layout rules.
- `app.js` contains client-side state, rendering, event handling, and GitHub REST API persistence.
- `finance.json` is persisted user data; avoid overwriting it during experiments.

Saving must remain browser -> GitHub REST API -> `finance.json`. Do not introduce another persistence path unless explicitly requested.

There is no separate `src/`, `tests/`, or assets directory; keep new files at the root only when they fit this layout.

## Build, Test, and Development Commands

There is no package manager setup, build step, install command, or start script.

Open `index.html` directly in a browser, or use the published static site. Saving requires a user-provided GitHub fine-grained token with `Contents: Read and write` permission for `coldoutt/finance`.

## Coding Style & Naming Conventions

Use plain JavaScript, HTML, and CSS. Match the existing style:

- 2-space indentation in HTML, CSS, and JavaScript.
- Double quotes in JavaScript strings.
- `const` and `let` over `var`.
- Descriptive camelCase names for JavaScript, such as `saveData` or `currentRows`.
- Kebab-case CSS class names, such as `primary-button` or `table-wrap`.

Keep all app behavior in `app.js`. Do not introduce backend persistence unless explicitly requested.

## Testing Guidelines

No automated tests are currently configured. For changes, perform manual verification:

1. Open `index.html` or the published static site.
2. Confirm the dashboard loads data from `finance.json` or from GitHub REST API when a token is configured.
3. Confirm saving updates `finance.json` through GitHub REST API when a valid token is configured.

If tests are added later, place them in a `tests/` directory and document the run command here.

## Commit & Pull Request Guidelines

Use concise, imperative commit messages, for example `Refine asset chart scaling`.

Pull requests should include:

- A short description of the user-visible change.
- Manual test steps and results.
- Screenshots for UI changes.
- Notes about any changes to `finance.json` or data format.

## Security & Configuration Tips

Never commit a GitHub token. The token is entered by the user in the browser and stored only in that browser's `localStorage`.
