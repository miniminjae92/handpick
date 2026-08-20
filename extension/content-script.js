(() => {
  if (window.HandpickPicker) return;

  const HIGHLIGHT_ID = "handpick-highlight";
  const TOAST_ID = "handpick-toast";
  const HINT_ID = "handpick-hint";

  const SETTING_DEFAULTS = {
    outputFormat: "standard",
    frontmatterMode: "save",
    obsidianVault: "",
    obsidianFolder: "Clippings"
  };

  let mode = null;
  let baseElement = null;
  let expandDepth = 0;
  let lastResult = null;
  let toastTimer = null;

  function resolveSelectedElement(depth = expandDepth) {
    let element = baseElement;
    for (let step = 0; step < depth && element; step++) {
      const parent = element.parentElement;
      if (!parent || parent === document.documentElement) break;
      element = parent;
    }
    return element;
  }

  function ensureHighlight() {
    let highlight = document.getElementById(HIGHLIGHT_ID);
    if (!highlight) {
      highlight = document.createElement("div");
      highlight.id = HIGHLIGHT_ID;
      Object.assign(highlight.style, {
        position: "fixed",
        zIndex: "2147483646",
        pointerEvents: "none",
        border: "2px solid #0f766e",
        background: "rgba(15, 118, 110, 0.12)",
        borderRadius: "4px",
        transition: "all 60ms ease-out"
      });
      document.documentElement.append(highlight);
    }
    return highlight;
  }

  function updateHighlight() {
    const element = resolveSelectedElement();
    if (!element) return;
    const rect = element.getBoundingClientRect();
    const highlight = ensureHighlight();
    Object.assign(highlight.style, {
      display: "block",
      left: `${rect.left}px`,
      top: `${rect.top}px`,
      width: `${rect.width}px`,
      height: `${rect.height}px`
    });
  }

  function hideHighlight() {
    document.getElementById(HIGHLIGHT_ID)?.remove();
    baseElement = null;
    expandDepth = 0;
  }

  const MODE_LABELS = {
    copy: "Copy Markdown",
    save: "Save .md",
    obsidian: "Save to Obsidian",
    plain: "Copy plain text"
  };

  function createHintKey(label) {
    const key = document.createElement("span");
    key.textContent = label;
    Object.assign(key.style, {
      padding: "2px 7px",
      borderRadius: "6px",
      background: "rgba(255, 255, 255, 0.12)",
      border: "1px solid rgba(255, 255, 255, 0.22)",
      font: "11px/1.4 ui-monospace, SFMono-Regular, Menlo, Consolas, monospace",
      color: "#ffffff",
      whiteSpace: "nowrap"
    });
    return key;
  }

  function createHintItem(keyLabel, text) {
    const item = document.createElement("span");
    Object.assign(item.style, {
      display: "flex",
      alignItems: "center",
      gap: "6px"
    });
    const label = document.createElement("span");
    label.textContent = text;
    Object.assign(label.style, {
      color: "rgba(255, 255, 255, 0.8)",
      fontSize: "12px",
      whiteSpace: "nowrap"
    });
    item.append(createHintKey(keyLabel), label);
    return item;
  }

  function showHint(activeMode) {
    hideHint();
    const hint = document.createElement("div");
    hint.id = HINT_ID;
    Object.assign(hint.style, {
      position: "fixed",
      top: "16px",
      left: "50%",
      transform: "translate(-50%, -6px)",
      opacity: "0",
      transition: "opacity 160ms ease, transform 160ms ease",
      zIndex: "2147483647",
      pointerEvents: "none",
      display: "flex",
      alignItems: "center",
      gap: "12px",
      maxWidth: "calc(100vw - 32px)",
      padding: "10px 16px",
      borderRadius: "14px",
      background: "rgba(15, 23, 42, 0.92)",
      boxShadow: "0 12px 32px rgba(15, 23, 42, 0.35)",
      font: "13px/1.4 -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
      color: "#ffffff"
    });

    const dot = document.createElement("span");
    Object.assign(dot.style, {
      width: "8px",
      height: "8px",
      borderRadius: "50%",
      background: "#2dd4bf",
      flex: "none"
    });

    const modeLabel = document.createElement("strong");
    modeLabel.textContent = MODE_LABELS[activeMode] || "Capture";
    Object.assign(modeLabel.style, {
      fontWeight: "700",
      whiteSpace: "nowrap"
    });

    const divider = document.createElement("span");
    Object.assign(divider.style, {
      width: "1px",
      height: "16px",
      background: "rgba(255, 255, 255, 0.25)",
      flex: "none"
    });

    hint.append(
      dot,
      modeLabel,
      divider,
      createHintItem("Click", "capture"),
      createHintItem("↑", "wider"),
      createHintItem("↓", "narrower"),
      createHintItem("Esc", "cancel")
    );

    document.documentElement.append(hint);
    requestAnimationFrame(() => {
      Object.assign(hint.style, {
        opacity: "1",
        transform: "translate(-50%, 0)"
      });
    });
  }

  function hideHint() {
    document.getElementById(HINT_ID)?.remove();
  }

  function isExtensionUi(target) {
    return target instanceof Element
      && Boolean(target.closest(`#${HIGHLIGHT_ID}, #${TOAST_ID}, #${HINT_ID}`));
  }

  function yamlQuote(value) {
    return `"${String(value).replace(/\\/g, "\\\\").replace(/"/g, '\\"')}"`;
  }

  function buildFrontmatter(markdown) {
    const headingTitle = window.Handpick.headingTextFromMarkdown?.(markdown);
    const title = (headingTitle || document.title || "Untitled")
      .replace(/\s+/g, " ")
      .trim();
    return [
      "---",
      `title: ${yamlQuote(title)}`,
      `source: ${yamlQuote(location.href)}`,
      `created: ${new Date().toISOString()}`,
      "---",
      "",
      ""
    ].join("\n");
  }

  function withFrontmatter(markdown, purpose) {
    const frontmatterMode = lastResult?.settings?.frontmatterMode || SETTING_DEFAULTS.frontmatterMode;
    const include = frontmatterMode === "always"
      || (frontmatterMode !== "never" && purpose === "file");
    return include ? `${buildFrontmatter(markdown)}${markdown}` : markdown;
  }

  async function copyText(text) {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch {
      showErrorToast("Copy failed — click the page once, then try again.");
      return false;
    }
  }

  function saveMarkdown(markdown, filename) {
    const blob = new Blob([`${markdown}\n`], { type: "text/markdown;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    link.click();
    setTimeout(() => URL.revokeObjectURL(url), 0);
  }

  function removeToast() {
    if (toastTimer) {
      clearTimeout(toastTimer);
      toastTimer = null;
    }
    document.getElementById(TOAST_ID)?.remove();
  }

  function scheduleToastRemoval(toast, delay) {
    if (toastTimer) clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
      if (toast.isConnected) toast.remove();
      toastTimer = null;
    }, delay);
  }

  function decorateToast(toast, delay) {
    Object.assign(toast.style, {
      position: "fixed",
      right: "20px",
      bottom: "20px",
      zIndex: "2147483647",
      width: "210px",
      display: "grid",
      gap: "8px",
      padding: "12px",
      border: "1px solid rgba(15, 23, 42, 0.12)",
      borderRadius: "12px",
      background: "#ffffff",
      color: "#0f172a",
      boxShadow: "0 18px 42px rgba(15, 23, 42, 0.18)",
      font: "14px/1.3 -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
      transition: "box-shadow 120ms ease, transform 120ms ease"
    });

    toast.addEventListener("mouseenter", () => {
      if (toastTimer) {
        clearTimeout(toastTimer);
        toastTimer = null;
      }
      toast.style.boxShadow = "0 22px 48px rgba(15, 23, 42, 0.22)";
      toast.style.transform = "translateY(-1px)";
    });

    toast.addEventListener("mouseleave", () => {
      toast.style.boxShadow = "0 18px 42px rgba(15, 23, 42, 0.18)";
      toast.style.transform = "translateY(0)";
      scheduleToastRemoval(toast, delay);
    });
  }

  function createToastButton(label, onClick) {
    const button = document.createElement("button");
    button.type = "button";
    button.textContent = label;
    Object.assign(button.style, {
      width: "100%",
      border: "0",
      borderRadius: "8px",
      background: "transparent",
      color: "#0f766e",
      font: "inherit",
      fontWeight: "600",
      cursor: "pointer",
      padding: "8px 10px",
      textAlign: "left",
      transition: "background 120ms ease, color 120ms ease"
    });
    button.addEventListener("mouseenter", () => {
      button.style.background = "rgba(15, 118, 110, 0.08)";
      button.style.color = "#115e59";
    });
    button.addEventListener("mouseleave", () => {
      button.style.background = "transparent";
      button.style.color = "#0f766e";
    });
    button.addEventListener("click", onClick);
    return button;
  }

  function buildToast(message, actions, { error = false, delay = 4500 } = {}) {
    removeToast();
    const toast = document.createElement("div");
    toast.id = TOAST_ID;
    decorateToast(toast, delay);

    const heading = document.createElement("strong");
    heading.textContent = message;
    if (error) heading.style.color = "#b42318";
    toast.append(heading);

    if (actions.length) {
      const divider = document.createElement("div");
      Object.assign(divider.style, {
        height: "1px",
        background: "rgba(15, 23, 42, 0.08)"
      });
      toast.append(divider);
      actions.forEach(([label, onClick]) => {
        toast.append(createToastButton(label, onClick));
      });
    }

    document.documentElement.append(toast);
    scheduleToastRemoval(toast, delay);
  }

  function showToast(kind) {
    const message = kind === "save"
      ? "Saved as .md"
      : kind === "obsidian"
        ? "Copied — opening Obsidian…"
        : "Markdown copied";

    const saveAction = ["Save .md", () => {
      saveMarkdown(withFrontmatter(lastResult.markdown, "file"), lastResult.filename);
      showToast("save");
    }];
    const copyAction = ["Copy Markdown", async () => {
      if (await copyText(withFrontmatter(lastResult.markdown, "copy"))) showToast("copy");
    }];
    const sharedActions = [
      ["Copy plain text", async () => {
        if (await copyText(lastResult.plainText)) showPlainTextToast();
      }],
      ["Copy HTML", async () => {
        if (await copyText(lastResult.html)) showHtmlToast();
      }],
      ["Report issue", () => {
        openReportIssue();
      }]
    ];

    const actions = kind === "copy"
      ? [saveAction, ...sharedActions]
      : [copyAction, ...sharedActions];

    buildToast(message, actions);
  }

  function showPlainTextToast() {
    buildToast("Plain text copied", [], { delay: 2800 });
  }

  function showHtmlToast() {
    buildToast("HTML copied", [], { delay: 2800 });
  }

  function showErrorToast(message, actions = []) {
    buildToast(message, actions, { error: true, delay: 6000 });
  }

  function openReportIssue() {
    chrome.runtime.sendMessage({
      type: "handpick:open-report",
      payload: {
        inputHtml: lastResult.html,
        actualMarkdown: lastResult.markdown,
        actualPlainText: lastResult.plainText
      }
    });
  }

  function openOptions() {
    chrome.runtime.sendMessage({ type: "handpick:open-options" });
  }

  function sendToObsidian() {
    const { obsidianVault, obsidianFolder } = lastResult.settings;
    const name = lastResult.filename.replace(/\.md$/, "")
      .replace(/[#^[\]]/g, "")
      .replace(/-{2,}/g, "-")
      .replace(/^-+|-+$/g, "") || "converted";
    const file = obsidianFolder ? `${obsidianFolder}/${name}` : name;
    location.href = `obsidian://new?vault=${encodeURIComponent(obsidianVault)}&file=${encodeURIComponent(file)}&clipboard`;
  }

  function stopSelectionMode() {
    mode = null;
    hideHighlight();
    hideHint();
    document.removeEventListener("mousemove", onMouseMove, true);
    document.removeEventListener("click", onClick, true);
    document.removeEventListener("keydown", onKeyDown, true);
    window.removeEventListener("scroll", onViewportChange, true);
    window.removeEventListener("resize", onViewportChange);
  }

  function onMouseMove(event) {
    if (isExtensionUi(event.target)) return;
    const target = event.target === document.documentElement
      ? document.body || event.target
      : event.target;
    if (target === baseElement) return;
    if (expandDepth > 0 && resolveSelectedElement()?.contains(target)) return;
    baseElement = target;
    expandDepth = 0;
    updateHighlight();
  }

  function onViewportChange() {
    if (baseElement) updateHighlight();
  }

  async function onClick(event) {
    if (!mode || isExtensionUi(event.target)) return;
    event.preventDefault();
    event.stopPropagation();

    const element = resolveSelectedElement() || event.target;
    const currentMode = mode;
    stopSelectionMode();
    const settings = await chrome.storage.sync.get(SETTING_DEFAULTS);

    try {
      const { convertToMarkdown, convertToPlainText, fileNameFromMarkdown } = window.Handpick;
      const options = { outputFormat: settings.outputFormat };
      const markdown = convertToMarkdown(element, options);
      const plainText = convertToPlainText(element, options);
      lastResult = {
        markdown,
        plainText,
        html: element.outerHTML,
        filename: fileNameFromMarkdown(markdown),
        settings
      };
    } catch (error) {
      lastResult = {
        markdown: `CONVERSION ERROR: ${error?.message || error}`,
        plainText: "",
        html: element.outerHTML,
        filename: "converted.md",
        settings
      };
      showErrorToast("Conversion failed.", [
        ["Report issue", () => {
          openReportIssue();
        }]
      ]);
      return;
    }

    if (currentMode === "save") {
      saveMarkdown(withFrontmatter(lastResult.markdown, "file"), lastResult.filename);
      showToast("save");
      return;
    }

    if (currentMode === "plain") {
      if (await copyText(lastResult.plainText)) showPlainTextToast();
      return;
    }

    if (currentMode === "obsidian") {
      if (!settings.obsidianVault) {
        showErrorToast("Set your Obsidian vault name first.", [
          ["Open options", () => {
            openOptions();
          }]
        ]);
        return;
      }
      if (await copyText(withFrontmatter(lastResult.markdown, "file"))) {
        sendToObsidian();
        showToast("obsidian");
      }
      return;
    }

    if (await copyText(withFrontmatter(lastResult.markdown, "copy"))) showToast("copy");
  }

  function onKeyDown(event) {
    if (event.key === "Escape") {
      event.preventDefault();
      stopSelectionMode();
      return;
    }

    if (event.key === "ArrowUp" || event.key === "ArrowDown") {
      if (!baseElement) return;
      event.preventDefault();
      event.stopPropagation();
      if (event.key === "ArrowUp") {
        if (resolveSelectedElement(expandDepth + 1) !== resolveSelectedElement()) {
          expandDepth += 1;
        }
      } else if (expandDepth > 0) {
        expandDepth -= 1;
      }
      updateHighlight();
    }
  }

  function activate(nextMode) {
    stopSelectionMode();
    mode = nextMode;
    showHint(nextMode);
    document.addEventListener("mousemove", onMouseMove, true);
    document.addEventListener("click", onClick, true);
    document.addEventListener("keydown", onKeyDown, true);
    window.addEventListener("scroll", onViewportChange, { capture: true, passive: true });
    window.addEventListener("resize", onViewportChange);
  }

  chrome.runtime.onMessage.addListener((message) => {
    if (message?.type === "handpick:activate") {
      activate(message.mode);
    }
  });

  window.HandpickPicker = { activate };
})();
