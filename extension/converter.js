(() => {
  if (window.ElementToMarkdownConverter) return;

  const blockTags = new Set([
    "ADDRESS", "ARTICLE", "ASIDE", "BLOCKQUOTE", "DIV", "DL", "FIELDSET",
    "FIGCAPTION", "FIGURE", "FOOTER", "FORM", "H1", "H2", "H3", "H4", "H5",
    "H6", "HEADER", "HR", "LI", "MAIN", "NAV", "OL", "P", "PRE", "SECTION",
    "TABLE", "UL"
  ]);

  function collapseWhitespace(text) {
    return text.replace(/\s+/g, " ");
  }

  function escapeMarkdown(text) {
    return text
      .replace(/\\/g, "\\\\")
      .replace(/\*/g, "\\*")
      .replace(/_/g, "\\_")
      .replace(/\[/g, "\\[")
      .replace(/\]/g, "\\]");
  }

  function normalizeBlankLines(markdown) {
    return markdown
      .replace(/\n[ \t]*\n[ \t]*([*-]\s)/g, "\n$1")
      .replace(/[ \t]+\n/g, "\n")
      .replace(/\n{3,}/g, "\n\n")
      .replace(/^\s+|\s+$/g, "");
  }

  function textWithCodeLineBreaks(node) {
    let text = "";

    for (const child of node.childNodes) {
      if (child.nodeType === Node.TEXT_NODE) {
        text += child.textContent;
        continue;
      }

      if (child.nodeType !== Node.ELEMENT_NODE) continue;

      if (child.tagName === "BR") {
        text += "\n";
        continue;
      }

      text += textWithCodeLineBreaks(child);
    }

    return text;
  }

  function codeTextFromNode(node) {
    const nestedCode = node.querySelector("pre code");
    const directCode = Array.from(node.children).find((child) => child.tagName === "CODE");
    const source = nestedCode || directCode || (node.matches("code") ? node : node.querySelector("code")) || node;
    const text = textWithCodeLineBreaks(source);
    return text || source.textContent || "";
  }

  function normalizeLanguageLabel(text) {
    const label = normalizeBlankLines(text).toLowerCase();
    if (!label) return "";
    if (label === "json") return "json";
    if (label === "http" || label === "https") return "http";
    if (/^[a-z][a-z0-9_+-]*$/.test(label)) return label;
    return "";
  }

  function languageFromCodeBlockChrome(node) {
    const wrapper = node.closest("[class*='border-token-border-light']") || node.parentElement;
    if (!wrapper) return "";
    const label = wrapper.querySelector("[class*='text-token-text-primary']");
    return label ? normalizeLanguageLabel(label.textContent) : "";
  }

  function languageFromGeminiCodeBlock(node) {
    const label = node.querySelector(".code-block-decoration span");
    return label ? normalizeLanguageLabel(label.textContent) : "";
  }

  function normalizeCodeBlockText(text, language = "") {
    const code = text.replace(/\u00a0/g, " ").replace(/\n+$/g, "");
    const trimmed = code.trim();
    const looksJson = language === "json" || /^[{\[][\s\S]*[}\]]$/.test(trimmed);

    if (looksJson) {
      try {
        return JSON.stringify(JSON.parse(trimmed), null, 2);
      } catch {
        return code;
      }
    }

    return code;
  }

  function replaceWithSimpleCodeBlock(node, codeSource, language = "") {
    const code = normalizeCodeBlockText(codeTextFromNode(codeSource), language);
    const replacementPre = document.createElement("pre");
    const replacementCode = document.createElement("code");
    if (language) replacementCode.className = `language-${language}`;
    replacementCode.textContent = code;
    replacementPre.append(replacementCode);
    node.replaceWith(replacementPre);
  }

  function chatGptCodeBlockWrapper(viewer, root) {
    let candidate = null;

    for (let node = viewer; node && node !== root; node = node.parentElement) {
      if (node.tagName === "PRE") return node;
      if (
        node.querySelectorAll
        && node.querySelectorAll(".cm-editor, #code-block-viewer").length === 1
        && node.querySelector("pre code")
      ) {
        candidate = node;
      }
    }

    return candidate || viewer;
  }

  function normalizeRichCodeBlocks(root) {
    root.querySelectorAll("code-block").forEach((codeBlock) => {
      const codePre = codeBlock.querySelector("pre");
      if (!codePre) return;
      replaceWithSimpleCodeBlock(codeBlock, codePre, languageFromGeminiCodeBlock(codeBlock));
    });

    root.querySelectorAll(".cm-editor, #code-block-viewer").forEach((viewer) => {
      const codePre = viewer.querySelector("pre");
      if (!codePre) return;
      replaceWithSimpleCodeBlock(chatGptCodeBlockWrapper(viewer, root), codePre, languageFromCodeBlockChrome(viewer));
    });
  }

  function codeLanguageFromNode(node) {
    const dataLanguage = node.getAttribute("data-code-language")
      || node.querySelector("[data-code-language]")?.getAttribute("data-code-language");
    if (dataLanguage) return dataLanguage;

    const code = node.matches("code") ? node : node.querySelector("code");
    const candidates = [node, code].filter(Boolean);

    for (const candidate of candidates) {
      const className = candidate.getAttribute("class") || "";
      const match = className.match(/(?:^|\s)(?:language|lang)-([a-z0-9_-]+)/i);
      if (match) return match[1].toLowerCase();
    }

    return "";
  }

  function fencedCodeBlock(code, language = "") {
    const longestFence = Math.max(2, ...Array.from(code.matchAll(/`+/g), (match) => match[0].length));
    const fence = "`".repeat(Math.max(3, longestFence + 1));
    const info = language ? language.replace(/[` \t\r\n]/g, "") : "";
    return `${fence}${info}\n${code}\n${fence}`;
  }

  function inlineChildren(node) {
    return Array.from(node.childNodes).map((child) => toMarkdown(child, { inline: true })).join("");
  }

  function blockChildren(node, context = {}) {
    return Array.from(node.childNodes)
      .map((child) => toMarkdown(child, context))
      .filter(Boolean)
      .join("\n\n");
  }

  function indentLines(text, prefix) {
    return text
      .split("\n")
      .map((line) => line ? `${prefix}${line}` : prefix.trimEnd())
      .join("\n");
  }

  function listItems(node, ordered) {
    let index = Number(node.getAttribute("start") || "1");
    return Array.from(node.children)
      .filter((child) => child.tagName === "LI")
      .map((li) => {
        const marker = ordered ? `${index++}. ` : "- ";
        const converted = liToMarkdown(li);
        const lines = converted.split("\n");
        const first = `${marker}${lines.shift() || ""}`;
        const pad = " ".repeat(marker.length);
        return [first, ...lines.map((line) => line ? `${pad}${line}` : "")].join("\n");
      })
      .join("\n");
  }

  function liToMarkdown(li) {
    const parts = [];
    for (const child of li.childNodes) {
      if (child.nodeType === Node.ELEMENT_NODE && ["UL", "OL"].includes(child.tagName)) {
        const nested = toMarkdown(child);
        if (nested) parts.push(`\n${indentLines(nested, "  ")}`);
        continue;
      }
      const converted = toMarkdown(child, { inline: true });
      if (converted) parts.push(converted);
    }
    const text = parts.join("").replace(/\n{3,}/g, "\n\n").trim();
    if (li.classList.contains("task-list-item") || li.hasAttribute("data-te-task")) {
      return `[ ] ${text}`;
    }
    return text;
  }

  function tableToMarkdown(table) {
    const rows = Array.from(table.querySelectorAll("tr")).map((row) =>
      Array.from(row.children).map((cell) => normalizeBlankLines(inlineChildren(cell)).replace(/\|/g, "\\|"))
    );

    if (!rows.length) return "";
    const header = rows[0];
    const separator = header.map(() => "---");
    return [header, separator, ...rows.slice(1)]
      .map((row) => `| ${row.join(" | ")} |`)
      .join("\n");
  }

  function toMarkdown(node, context = {}) {
    if (node.nodeType === Node.TEXT_NODE) {
      const text = context.preserveWhitespace ? node.textContent : collapseWhitespace(node.textContent);
      return escapeMarkdown(text);
    }
    if (node.nodeType !== Node.ELEMENT_NODE) return "";

    const tag = node.tagName;
    const inline = context.inline;

    if (tag === "SCRIPT" || tag === "STYLE" || tag === "NOSCRIPT") return "";
    if (tag === "BR") return inline ? "  \n" : "\n";
    if (tag === "HR") return "---";
    if (tag === "STRONG" || tag === "B") return `**${inlineChildren(node).trim()}**`;
    if (tag === "EM" || tag === "I") return `*${inlineChildren(node).trim()}*`;
    if (tag === "S" || tag === "DEL") return `~~${inlineChildren(node).trim()}~~`;
    if (tag === "CODE") {
      const text = node.textContent.replace(/`/g, "\\`");
      return context.inPre ? text : `\`${text}\``;
    }
    if (tag === "PRE") {
      const language = codeLanguageFromNode(node);
      const code = normalizeCodeBlockText(codeTextFromNode(node), language);
      return fencedCodeBlock(code, language);
    }
    if (tag === "A") {
      const label = inlineChildren(node).trim() || node.href;
      const href = node.getAttribute("href") || "";
      return href ? `[${label}](${href})` : label;
    }
    if (tag === "IMG") {
      const alt = node.getAttribute("alt") || "";
      const src = node.getAttribute("src") || "";
      return src ? `![${escapeMarkdown(alt)}](${src})` : "";
    }
    if (/^H[1-6]$/.test(tag)) {
      return `${"#".repeat(Number(tag.slice(1)))} ${inlineChildren(node).trim()}`;
    }
    if (tag === "P") return inlineChildren(node).trim();
    if (tag === "BLOCKQUOTE") {
      const content = blockChildren(node);
      return content.split("\n").map((line) => line ? `> ${line}` : ">").join("\n");
    }
    if (tag === "UL" || tag === "OL") return listItems(node, tag === "OL");
    if (tag === "TABLE") return tableToMarkdown(node);

    const content = blockChildren(node);
    if (inline || !blockTags.has(tag)) return inlineChildren(node);
    return content;
  }

  function removeInvisibleAndEmptyNoise(root) {
    root.querySelectorAll("[style]").forEach((node) => {
      const style = node.getAttribute("style") || "";
      if (
        /display\s*:\s*none/i.test(style)
        || /visibility\s*:\s*hidden/i.test(style)
        || /opacity\s*:\s*0(?:[;)]|$)/i.test(style)
      ) {
        node.remove();
      }
    });

    root.querySelectorAll("div, span").forEach((node) => {
      const hasMeaningfulMedia = node.querySelector("img[src]:not([src^='data:image/gif']), video, iframe");
      if (!hasMeaningfulMedia && !normalizeBlankLines(node.textContent || "")) node.remove();
    });
  }

  function cleanupNotionBlocks(root) {
    root.querySelectorAll(".notion-text-block").forEach((block) => {
      const source = block.querySelector("[data-root='true']") || block;
      if (!normalizeBlankLines(source.textContent || "") && !source.querySelector("img[src]:not([src^='data:image/gif'])")) {
        block.remove();
        return;
      }
      const paragraph = document.createElement("p");
      paragraph.innerHTML = source.innerHTML;
      block.replaceWith(paragraph);
    });

    root.querySelectorAll(".notion-header-block h1, .notion-header-block h2, .notion-header-block h3, .notion-sub_header-block h1, .notion-sub_header-block h2, .notion-sub_header-block h3").forEach((heading) => {
      const block = heading.closest(".notion-header-block, .notion-sub_header-block");
      if (block) block.replaceWith(heading.cloneNode(true));
    });
  }

  function emojiFromCodepointSlug(value) {
    if (!value) return "";
    const slug = decodeURIComponent(value)
      .split(/[/?#]/)
      .pop()
      .replace(/\.(?:svg|png|webp|gif)$/i, "")
      .replace(/^emoji[_-]u?/i, "");
    const codepoints = slug.split(/[-_]/)
      .filter((part) => /^[0-9a-f]{4,6}$/i.test(part))
      .map((part) => Number.parseInt(part, 16));
    if (!codepoints.length || codepoints.some((codepoint) => !Number.isFinite(codepoint))) return "";
    try {
      return String.fromCodePoint(...codepoints);
    } catch {
      return "";
    }
  }

  function emojiFromUrlLikeValue(value) {
    if (!value) return "";
    const urlMatch = value.match(/url\((['"]?)(.*?)\1\)/i);
    const source = urlMatch ? urlMatch[2] : value;
    const pathParts = source.split(/[/?#]/).filter(Boolean);
    for (let index = pathParts.length - 1; index >= 0; index--) {
      const emoji = emojiFromCodepointSlug(pathParts[index]);
      if (emoji) return emoji;
    }
    return "";
  }

  function textFallbackFromAttributes(node) {
    for (const attribute of ["alt", "aria-label", "title", "data-emoji", "data-icon"]) {
      const value = normalizeBlankLines(node.getAttribute(attribute) || "");
      if (value) return value;
    }
    return "";
  }

  function emojiFallbackFromNode(node) {
    const text = normalizeBlankLines(node.textContent || "");
    if (text) return text;
    const directFallback = textFallbackFromAttributes(node)
      || emojiFromUrlLikeValue(node.getAttribute("src") || "")
      || emojiFromUrlLikeValue(node.getAttribute("data-src") || "")
      || emojiFromUrlLikeValue(node.getAttribute("style") || "");
    if (directFallback) return directFallback;
    const media = node.querySelector("img, span, div");
    if (!media) return "";
    return textFallbackFromAttributes(media)
      || emojiFromUrlLikeValue(media.getAttribute("src") || "")
      || emojiFromUrlLikeValue(media.getAttribute("data-src") || "")
      || emojiFromUrlLikeValue(media.getAttribute("style") || "");
  }

  function preserveTextualMediaFallbacks(root) {
    root.querySelectorAll([
      ".notion-emoji",
      "[class*='notion-emoji']",
      "[class*='notion-page-icon']",
      "img[src*='/emoji/']",
      "img[src*='twemoji']",
      "[role='img'][aria-label]"
    ].join(",")).forEach((node) => {
      const emoji = emojiFallbackFromNode(node);
      node.replaceWith(document.createTextNode(emoji || ""));
    });

    root.querySelectorAll("img[src^='data:image/gif']").forEach((img) => {
      img.replaceWith(document.createTextNode(img.getAttribute("alt") || ""));
    });
  }

  function cleanupContent(content) {
    const root = content.cloneNode(true);
    preserveTextualMediaFallbacks(root);
    normalizeRichCodeBlocks(root);
    root.querySelectorAll([
      "script",
      "style",
      "noscript",
      "svg",
      "canvas",
      "nav",
      "form",
      "button",
      "[role='navigation']",
      "[aria-hidden='true']",
      ".oopy-footer",
      ".apply_button",
      ".css-ujcdi3",
      "[class*='footer']",
      "[class*='Footer']",
      "[class*='advert']",
      "[class*='share']"
    ].join(",")).forEach((node) => node.remove());
    cleanupNotionBlocks(root);
    removeInvisibleAndEmptyNoise(root);
    root.querySelectorAll("[contenteditable], [spellcheck], [placeholder], [style], [class]").forEach((node) => {
      node.removeAttribute("contenteditable");
      node.removeAttribute("spellcheck");
      node.removeAttribute("placeholder");
      node.removeAttribute("style");
      if (node.tagName !== "PRE" && node.tagName !== "CODE") node.removeAttribute("class");
    });
    return root;
  }

  function plainInlineChildren(node) {
    return Array.from(node.childNodes).map((child) => toPlainText(child, { inline: true })).join("");
  }

  function plainBlockChildren(node) {
    return Array.from(node.childNodes).map((child) => toPlainText(child)).filter(Boolean).join("\n\n");
  }

  function plainListItems(node, ordered) {
    let index = Number(node.getAttribute("start") || "1");
    return Array.from(node.children)
      .filter((child) => child.tagName === "LI")
      .map((li) => `${ordered ? `${index++}. ` : "- "}${plainInlineChildren(li).trim()}`)
      .join("\n");
  }

  function plainTable(table) {
    return Array.from(table.querySelectorAll("tr"))
      .map((row) => Array.from(row.children).map((cell) => normalizeBlankLines(plainInlineChildren(cell))).join("\t"))
      .join("\n");
  }

  function toPlainText(node, context = {}) {
    if (node.nodeType === Node.TEXT_NODE) {
      return context.preserveWhitespace ? node.textContent : collapseWhitespace(node.textContent);
    }
    if (node.nodeType !== Node.ELEMENT_NODE) return "";
    const tag = node.tagName;
    if (["SCRIPT", "STYLE", "NOSCRIPT"].includes(tag)) return "";
    if (tag === "BR") return "\n";
    if (tag === "HR") return "—";
    if (tag === "PRE" || tag === "CODE") return codeTextFromNode(node);
    if (tag === "A") return plainInlineChildren(node).trim() || node.getAttribute("href") || "";
    if (tag === "IMG") return node.getAttribute("alt") || "";
    if (/^H[1-6]$/.test(tag) || tag === "P") return plainInlineChildren(node).trim();
    if (tag === "BLOCKQUOTE") return plainBlockChildren(node);
    if (tag === "UL" || tag === "OL") return plainListItems(node, tag === "OL");
    if (tag === "TABLE") return plainTable(node);
    const content = plainBlockChildren(node);
    if (context.inline || !blockTags.has(tag)) return plainInlineChildren(node);
    return content;
  }

  function convertElement(element) {
    const cleaned = cleanupContent(element);
    return normalizeBlankLines(toMarkdown(cleaned));
  }

  function convertElementToPlainText(element) {
    const cleaned = cleanupContent(element);
    return normalizeBlankLines(toPlainText(cleaned));
  }

  function fileNameFromMarkdown(markdown) {
    const firstHeading = markdown.match(/^#\s+(.+)$/m);
    const baseName = firstHeading ? firstHeading[1] : "converted";
    const safeName = baseName.replace(/[\\/:*?"<>|]/g, "").replace(/\s+/g, "-").slice(0, 80) || "converted";
    return `${safeName}.md`;
  }

  window.ElementToMarkdownConverter = {
    convertElement,
    convertElementToPlainText,
    fileNameFromMarkdown
  };
})();
