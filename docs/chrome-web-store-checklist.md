# Chrome Web Store checklist

## Account

- [ ] Chrome Web Store developer account registered
- [ ] Developer profile completed
- [ ] Contact email verified

## Product assets

- [ ] Extension icon prepared
- [ ] 30-second demo video prepared
- [ ] Store screenshots prepared
  - [ ] selection flow
  - [ ] Markdown result
  - [ ] save as `.md`
  - [ ] toast actions
  - [ ] bug report flow
- [ ] Store short description finalized
- [ ] Store detailed description finalized
- [ ] Privacy policy URL ready

## Extension package

- [ ] `extension/manifest.json` version bumped
- [ ] Shared assets synced
- [ ] All extension files present
- [ ] ZIP created from the contents of `extension/`
- [ ] No private notes or local-only files included

## Manual QA

- [ ] `Option + Shift + C`
- [ ] `Option + Shift + S`
- [ ] `Copy Markdown`
- [ ] `Copy plain text`
- [ ] `Copy HTML`
- [ ] `Report issue`
- [ ] `.md` filename behavior
- [ ] Web fallback still works
- [ ] `dev.html` still saves `debug-case.json`

## Listing and compliance

- [ ] Description matches actual behavior
- [ ] Permissions justified
- [ ] Privacy disclosures match `docs/privacy.md`
- [ ] Screenshots and video match the current UI
- [ ] Support / issue URL available

## After submission

- [ ] Review status checked
- [ ] Published version installed from Web Store and smoke-tested
- [ ] README updated with Web Store install link
- [ ] Release notes moved from `Unreleased` to the published version
