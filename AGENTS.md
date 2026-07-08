# Repository Guidelines

## Project Structure & Module Organization

This repository is a small local finance dashboard served by a Node.js HTTP server.

- `index.html` defines the application shell and UI markup.
- `styles.css` contains all visual styling and responsive layout rules.
- `app.js` contains client-side state, rendering, event handling, and API calls.
- `server.js` serves static files and exposes `/api/data` for reading and saving data.
- `finance-data.json` is persisted user data; avoid overwriting it during experiments.
- `start.bat` starts the app on Windows using the bundled Codex Node runtime when available.

There is no separate `src/`, `tests/`, or assets directory; keep new files at the root only when they fit this layout.

## Build, Test, and Development Commands

- `start.bat`: starts the local server at `http://127.0.0.1:8780/`.
- `node server.js`: starts the same server directly if Node.js is on `PATH`.

There is no package manager setup, build step, or install command. Do not add external dependencies unless the feature clearly requires them.

## Coding Style & Naming Conventions

Use plain JavaScript, HTML, and CSS. Match the existing style:

- 2-space indentation in HTML, CSS, and JavaScript.
- Double quotes in JavaScript strings.
- `const` and `let` over `var`.
- Descriptive camelCase names for JavaScript, such as `saveData` or `currentRows`.
- Kebab-case CSS class names, such as `primary-button` or `table-wrap`.

Keep server logic in `server.js` and browser logic in `app.js`. Avoid mixing persistence code into the client.

## Testing Guidelines

No automated tests are currently configured. For changes, perform manual verification:

1. Run `start.bat` or `node server.js`.
2. Open `http://127.0.0.1:8780/`.
3. Confirm the dashboard loads, data is read from `finance-data.json`, and saving updates the file through `/api/data`.

If tests are added later, place them in a `tests/` directory and document the run command here.

## Commit & Pull Request Guidelines

Git history is not available in this checkout, so no existing convention can be confirmed. Use concise, imperative commit messages, for example `Add monthly summary validation`.

Pull requests should include:

- A short description of the user-visible change.
- Manual test steps and results.
- Screenshots for UI changes.
- Notes about any changes to `finance-data.json` or data format.

## Security & Configuration Tips

Use port `8780` for normal local work. The app is designed for `127.0.0.1`; do not expose it on a public network without adding authentication and stronger input validation.
