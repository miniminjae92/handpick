# Release checklist

## Before release

- [ ] Confirm all intended work is merged into `dev`
- [ ] Check open bug reports for release blockers
- [ ] Update `CHANGELOG.md`
- [ ] Bump `extension/manifest.json` version
- [ ] Run `./scripts/sync-extension-assets.sh`
- [ ] Verify:
  - [ ] `Option + Shift + C`
  - [ ] `Option + Shift + S`
  - [ ] `Copy plain text`
  - [ ] `Copy HTML`
  - [ ] `Report issue`
  - [ ] `dev.html`
  - [ ] `fixtures.html`
- [ ] Review `README.md`
- [ ] Review `docs/privacy.md`
- [ ] Confirm screenshots / demo video are current

## Publish

- [ ] Open a release PR from `dev` into `main`
- [ ] Review and merge the release PR
- [ ] Do not merge release work directly into `main` except for emergency recovery
- [ ] Tag `vX.Y.Z`
- [ ] Create GitHub Release
- [ ] Build extension ZIP from `extension/`
- [ ] Upload ZIP to Chrome Web Store
- [ ] Complete store listing / privacy fields if changed
- [ ] Submit for review

## After publish

- [ ] Confirm published version number
- [ ] Smoke test installed Web Store version
- [ ] Move completed notes from `Unreleased` into the released version in `CHANGELOG.md`
