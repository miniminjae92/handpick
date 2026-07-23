# Changelog

## Unreleased

- Added toolbar popup and right-click context menu entry points.
- Added onboarding page on first install.
- Added selection scope adjustment (`↑` / `↓`), an on-screen hint, and highlight tracking while scrolling.
- Added Save to Obsidian via `obsidian://new` with configurable vault and folder.
- Added optional source frontmatter (title, source URL, capture time) with a `frontmatterMode` setting.
- Added visible error feedback: action badge on restricted pages, error toasts for clipboard and conversion failures.
- Removed unnecessary `web_accessible_resources` exposure of extension pages.
- Added a Node fixture runner, sync drift check, and GitHub Actions CI.

## 0.1.1

- Added user-reviewed bug report flow.
- Added vertical action toast with HTML copy support.
- Added shared converter core for the web app and Chrome extension.
- Added developer tooling for debug cases and fixtures.
- Improved report review layout and preserved semantic step headings during conversion.
- Removed the unused `downloads` permission from the extension manifest.

## 0.1.0

- Initial Chrome extension prototype.
- Added manual element selection with Markdown copy and Markdown save shortcuts.
