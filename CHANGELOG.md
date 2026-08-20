# Changelog

## 0.3.0

- Renamed the extension to **Handpick**. The Web Store item ID is unchanged, so existing installs update in place.
- Moved the name, summary, and shortcut labels into `_locales` (`en`, `ko`) with `default_locale: "en"`, so the store listing is localized.
- Replaced the icon with a new mark: a selection frame with a cursor pointing inside it. Each PNG is rasterized at its own size instead of downscaling one image.
- Rebuilt both Web Store promo tiles around the new mark, and renamed `marky-promotion.png` to `marquee-promotion.png`.
- Renamed the shared converter API to match the product: `window.Handpick`, `convertToMarkdown`, `convertToPlainText`. Internal message types are now `handpick:*` and injected DOM ids are `handpick-*`.
- Rewrote the store listing around what separates this from other clippers: it does not guess where the article is.
- Documented the Windows/Linux shortcut defaults instead of only noting that Chrome shows `Option` as `Alt`.
- Pointed the landing page's Web Store links at the ID-only URL so they survive the store name change.
- Polished the landing page: Korean line breaking, a Pretendard web font that actually loads, mobile header fixes, and readable ghost-button borders.

## 0.2.0

- Added a toolbar popup entry point.
- Added onboarding page on first install.
- Added selection scope adjustment (`↑` / `↓`), an on-screen hint, and highlight tracking while scrolling.
- Added Save to Obsidian via `obsidian://new` with configurable vault and folder.
- Added optional source frontmatter (title, source URL, capture time) with a `frontmatterMode` setting.
- Added visible error feedback: action badge on restricted pages, error toasts for clipboard and conversion failures.
- Rewrote options page guidance for first-time users and redesigned the in-page selection hint.
- Preserved KaTeX/MathJax math as `$…$` / `$$…$$` instead of destroying it, including math inside table cells.
- Resolved relative link/image URLs against the page (keeping in-page `#anchor` links) and recovered lazy-loaded images (`data-src`, `srcset`, `picture`).
- Mapped GitHub alerts and Docusaurus/Sphinx admonitions to Obsidian callouts, including nested callouts.
- Kept hard line breaks, switched horizontal rules to `---`, tightened list markers to `- `, and stopped swallowing blank lines before non-list blocks. Code fences now pass through byte-exact.
- Removed unnecessary `web_accessible_resources` exposure of extension pages.
- Added a Node fixture runner, sync drift check, and GitHub Actions CI.
- Stopped treating code spans and prose dollars (`Costs $5 | was $10`) in table cells as math, so their pipes escape as `\|` instead of becoming `\vert`.
- Protected code fences quoted inside blockquotes/callouts from blank-line normalization.
- Kept custom admonition titles as `> [!type] Title` in Obsidian output instead of dropping them.

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
