# AGENTS.md

## Project

**Element to Markdown** is a browser-only tool for selecting a page element and turning it into Markdown for personal notes.

The product has two surfaces:

- Chrome extension in `extension/`
- Web fallback in `index.html`

## Product invariants

- Manual element selection is intentional; do not replace it with automatic extraction as the primary workflow.
- Primary actions:
  - `Option + Shift + C`: copy selected element as Markdown
  - `Option + Shift + S`: save selected element as Markdown
- Secondary actions live in the toast:
  - save Markdown
  - copy Markdown
  - copy plain text
  - copy HTML
  - report issue
- Do not add metadata such as source URL, page title, or timestamps to converted Markdown unless the user explicitly changes product direction.
- Keep processing local by default. Do not add automatic uploads or analytics without an explicit product/privacy decision.

## Architecture

- Shared conversion source of truth:
  - `shared/converter-core.js`
  - `shared/turndown.js`
- Extension copies:
  - `extension/converter-core.js`
  - `extension/vendor/turndown.js`
- After changing shared converter assets, run:

```bash
./scripts/sync-extension-assets.sh
```

- Extension flow:
  - `background.js` injects scripts and opens report drafts.
  - `content-script.js` handles selection UI, toast actions, copy/save/report actions.
  - `report.html` / `report.js` / `report.css` handle user-reviewed bug report drafts.

## Bug handling workflow

When a user reports a bad conversion:

1. Ask for `debug-case.json` when possible.
2. Reproduce with `dev.html`.
3. Reduce the problem into a minimal HTML case.
4. Add that minimal case under `fixtures/<case-name>/`.
5. Update `fixtures/index.json`.
6. Fix the converter.
7. Verify via `fixtures.html`.

`debug-case.json` is for real-world reproduction.  
`fixtures/` is for minimal regression coverage.

## Branching and release workflow

- `main`: published stable releases only
- `dev`: next release integration branch
- `feat/*`, `fix/*`, `docs/*`: short-lived work branches

Release flow:

1. Merge completed work into `dev`.
2. Update `CHANGELOG.md`.
3. Bump `extension/manifest.json` version.
4. Sync shared assets.
5. Run release checklist in `docs/release-checklist.md`.
6. Merge `dev` into `main`.
7. Tag release as `vX.Y.Z`.
8. Create GitHub Release.
9. Upload the extension ZIP to Chrome Web Store.

## Documentation rules

- Public repo docs should help users, contributors, reviewers, or future maintainers.
- Do not commit personal planning notes or private product brainstorming.
- Keep `README.md`, `CHANGELOG.md`, `docs/privacy.md`, and `docs/release-checklist.md` current.

## Validation

At minimum after code changes:

```bash
node --check extension/background.js
node --check extension/content-script.js
node --check extension/report.js
node --check shared/converter-core.js
./scripts/sync-extension-assets.sh
```

Use:

- `dev.html` for manual reproduction
- `fixtures.html` for saved regression cases

## Privacy constraints

- Selected page HTML can contain sensitive information.
- Keep report submission user-reviewed and user-initiated.
- If behavior changes to automatically transmit selected content, update privacy docs and reassess Chrome Web Store compliance before shipping.
