# Element to Markdown

Select content from supported webpages and copy or save it as clean Markdown.

Element to Markdown is built for saving AI answers and useful web content into personal notes while preserving common structures such as headings, lists, tables, code blocks, checklists, and supported callouts.

## Demo

### Save AI answers as Markdown

<video src="https://github.com/user-attachments/assets/44630d9d-ac3e-4e6b-b1b1-058e1a8d0335" controls></video>

<details>
<summary>More demos</summary>

### Capture useful web content as Markdown

<video src="https://github.com/user-attachments/assets/c581f208-78ff-4931-994f-8a883363ef45" controls></video>

### Copy selected content as plain text

<video src="https://github.com/user-attachments/assets/40ba7c02-7f36-4336-a0b0-c38cd83cc744" controls></video>

### Select only the exact element you want

<video src="https://github.com/user-attachments/assets/7449c351-b971-464c-a9cc-d04745eef2c4" controls></video>

### Report a conversion issue

<video src="https://github.com/user-attachments/assets/43a8b267-50b3-4ae1-bcea-f50e91af8a14" controls></video>

</details>

## Features

- Select the exact element you want with your mouse, then widen or narrow it with `↑` / `↓`.
- Copy selected content as Markdown.
- Save selected content directly as a `.md` file.
- Save selected content straight into an Obsidian vault (`obsidian://`).
- Add source frontmatter (title, source URL, capture time) to saved notes.
- Copy plain text or HTML from the same selection.
- Choose between `Standard Markdown` and `Obsidian` output.
- Create a reviewable bug report draft when conversion fails.

## How to use

1. Open any webpage.
2. Start a capture in either of these ways:
   - click the toolbar icon and pick an action,
   - press a shortcut: `Option + Shift + C` (copy) or `Option + Shift + S` (save).
3. Click the element you want to capture. Use `↑` / `↓` to adjust the selection scope and `Esc` to cancel.
4. Use the toast actions if you also want plain text, HTML, or a bug report draft.

To save directly into Obsidian, set your vault name (and optional folder) in the extension options first.

## Keyboard shortcuts

Default shortcuts on macOS:

- `Option + Shift + C` — Copy Markdown
- `Option + Shift + S` — Save Markdown

On Windows/Linux, Chrome may display `Option` as `Alt`.

You can change shortcuts or assign one for `Copy plain text` in:

```text
chrome://extensions/shortcuts
```

You can also open the same shortcut settings from the extension options page.

## Output formats

- `Standard Markdown` — optimized for broad Markdown compatibility
- `Obsidian` — adapts supported structures for better use in Obsidian, including supported callouts

## Privacy

Element to Markdown only processes the element you explicitly select.

- Selected HTML is not uploaded automatically.
- Browsing history is not collected.
- Bug reports are only shared when you review and submit them yourself.

See [`docs/privacy.md`](docs/privacy.md) for details.

## Install

Chrome Web Store link coming soon.

## Reporting issues

If a conversion looks wrong:

1. Choose `Report issue` from the toast.
2. Review the captured HTML and conversion output.
3. Remove anything sensitive if needed.
4. Download `debug-case.json`.
5. Open a GitHub issue and attach the file.

See [`CONTRIBUTING.md`](CONTRIBUTING.md) for more details.

## Support 💚

If **Element to Markdown** saves you time, your support helps keep it maintained and improved.

[💚 Become a sponsor](https://github.com/sponsors/miniminjae92)
