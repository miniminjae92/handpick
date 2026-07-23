# AGENTS.md

## Project

**Element to Markdown** is a browser-only tool for selecting a page element and turning it into Markdown for personal notes.

The product has two surfaces:

- Chrome extension in `extension/`
- Web fallback in `index.html`

## Product invariants

- Manual element selection is intentional; do not replace it with automatic extraction as the primary workflow.
- Entry points (keep all three working):
  - toolbar action popup (`popup.html`)
  - right-click context menu (`Element to Markdown` submenu)
  - keyboard shortcuts (`Option + Shift + C` copy, `Option + Shift + S` save)
- Available capture modes:
  - copy Markdown
  - save Markdown (`.md` download)
  - save to Obsidian (`obsidian://new` + clipboard; requires vault name in options)
  - copy plain text
- In selection mode, `↑` / `↓` widen or narrow the selected element and `Esc` cancels; keep the on-screen hint in sync with these keys.
- Secondary actions live in the toast:
  - save Markdown
  - copy Markdown
  - copy plain text
  - copy HTML
  - report issue
- Source frontmatter (`title`, `source`, `created`) follows the `frontmatterMode` setting: `save` (default; file/Obsidian outputs only), `always` (also Markdown copies), `never`. Plain text output never includes it.
- Activation failures must be visible: restricted pages flash a badge on the action icon and the popup explains; clipboard and conversion failures show an error toast.
- Supported output formats:
  - `standard`: default, callouts become blockquotes
  - `obsidian`: supported callouts become Obsidian callouts
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
  - `background.js` injects scripts, owns the context menu, badge error feedback, and opens report drafts and the onboarding page.
  - `content-script.js` handles selection UI (hint, scope keys), toast actions, frontmatter, copy/save/Obsidian/report actions.
  - `popup.html` / `popup.js` / `popup.css` are the toolbar entry point and show shortcut state.
  - `welcome.html` / `welcome.js` onboard new installs.
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
6. Open a release PR from `dev` into `main`.
7. Review and merge the release PR. Do not merge release work directly into `main` except for emergency recovery.
8. Tag release as `vX.Y.Z`.
9. Create GitHub Release.
10. Upload the extension ZIP to Chrome Web Store.

## Documentation rules

- Public repo docs should help users, contributors, reviewers, or future maintainers.
- Do not commit personal planning notes or private product brainstorming.
- Keep `README.md`, `CHANGELOG.md`, `docs/privacy.md`, and `docs/release-checklist.md` current.

## Validation

At minimum after code changes:

```bash
npm ci        # first time only
npm run check # syntax checks + fixture tests + sync drift check
```

`npm run check` runs:

- `check:syntax`: `node --check` on extension and shared scripts
- `test`: Node fixture runner (`test/fixtures.test.mjs`, jsdom) over `fixtures/index.json`
- `check:drift`: fails if `extension/` copies differ from `shared/` (fix with `./scripts/sync-extension-assets.sh`)

CI (`.github/workflows/ci.yml`) runs the same checks on pushes and pull requests.

Use:

- `dev.html` for manual reproduction
- `fixtures.html` for visually comparing saved regression cases

## Privacy constraints

- Selected page HTML can contain sensitive information.
- Keep report submission user-reviewed and user-initiated.
- If behavior changes to automatically transmit selected content, update privacy docs and reassess Chrome Web Store compliance before shipping.
