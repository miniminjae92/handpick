# Contributing

Thanks for helping improve Element to Markdown.

## Reporting conversion bugs

1. Reproduce the issue with the extension.
2. In the toast, choose `Report issue`.
3. Review the selected HTML for sensitive information.
4. Download `debug-case.json`.
5. Open a GitHub issue and attach the file.

## Development workflow

- `main`: stable published releases
- `dev`: next release integration branch
- feature work: `feat/*`
- bug fixes: `fix/*`
- docs work: `docs/*`

Open pull requests into `dev` unless the maintainer says otherwise.

## Converter changes

The shared converter source of truth lives in:

- `shared/converter-core.js`
- `shared/turndown.js`

After changing shared converter files, run:

```bash
./scripts/sync-extension-assets.sh
```

## Regression fixtures

When fixing a conversion bug:

1. Reduce the failing HTML to the smallest useful reproduction.
2. Add it under `fixtures/<case-name>/`.
3. Add the case to `fixtures/index.json`.
4. Verify it with `npm test` (or `npm run check` for the full suite).
5. Optionally inspect the diff visually with `fixtures.html`.

Fixtures should capture the core failure, not entire real webpages.
