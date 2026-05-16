(() => {
  if (window.ElementToMarkdownPicker) return;

  const HIGHLIGHT_ID = "element-to-markdown-highlight";
  const TOAST_ID = "element-to-markdown-toast";

  let mode = null;
  let highlightedElement = null;
  let lastResult = null;
  let toastTimer = null;

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

  function updateHighlight(element) {
    highlightedElement = element;
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
    highlightedElement = null;
  }

  function isExtensionUi(target) {
    return target instanceof Element && Boolean(target.closest(`#${HIGHLIGHT_ID}, #${TOAST_ID}`));
  }

  async function copyText(text) {
    await navigator.clipboard.writeText(text);
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

  function decorateToast(toast) {
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
      scheduleToastRemoval(toast, 3200);
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

  function showToast(kind) {
    removeToast();
    const toast = document.createElement("div");
    toast.id = TOAST_ID;
    decorateToast(toast);

    const message = document.createElement("strong");
    message.textContent = kind === "save" ? "Saved as .md" : "Markdown copied";
    toast.append(message);

    const divider = document.createElement("div");
    Object.assign(divider.style, {
      height: "1px",
      background: "rgba(15, 23, 42, 0.08)"
    });
    toast.append(divider);

    const actions = kind === "save"
      ? [
        ["Copy Markdown", async () => {
          await copyText(lastResult.markdown);
          showToast("copy");
        }],
        ["Copy plain text", async () => {
          await copyText(lastResult.plainText);
          showPlainTextToast();
        }],
        ["Copy HTML", async () => {
          await copyText(lastResult.html);
          showHtmlToast();
        }],
        ["Report issue", () => {
          openReportIssue();
        }]
      ]
      : [
        ["Save .md", () => {
          saveMarkdown(lastResult.markdown, lastResult.filename);
          showToast("save");
        }],
        ["Copy plain text", async () => {
          await copyText(lastResult.plainText);
          showPlainTextToast();
        }],
        ["Copy HTML", async () => {
          await copyText(lastResult.html);
          showHtmlToast();
        }],
        ["Report issue", () => {
          openReportIssue();
        }]
      ];

    actions.forEach(([label, onClick]) => {
      toast.append(createToastButton(label, onClick));
    });

    document.documentElement.append(toast);
    scheduleToastRemoval(toast, 4500);
  }

  function showPlainTextToast() {
    removeToast();
    const toast = document.createElement("div");
    toast.id = TOAST_ID;
    toast.textContent = "Plain text copied";
    decorateToast(toast);
    document.documentElement.append(toast);
    scheduleToastRemoval(toast, 2800);
  }

  function showHtmlToast() {
    removeToast();
    const toast = document.createElement("div");
    toast.id = TOAST_ID;
    toast.textContent = "HTML copied";
    decorateToast(toast);
    document.documentElement.append(toast);
    scheduleToastRemoval(toast, 2800);
  }

  function openReportIssue() {
    chrome.runtime.sendMessage({
      type: "element-to-markdown:open-report",
      payload: {
        inputHtml: lastResult.html,
        actualMarkdown: lastResult.markdown,
        actualPlainText: lastResult.plainText
      }
    });
  }

  function stopSelectionMode() {
    mode = null;
    hideHighlight();
    document.removeEventListener("mousemove", onMouseMove, true);
    document.removeEventListener("click", onClick, true);
    document.removeEventListener("keydown", onKeyDown, true);
  }

  function onMouseMove(event) {
    if (isExtensionUi(event.target)) return;
    updateHighlight(event.target);
  }

  async function onClick(event) {
    if (!mode || isExtensionUi(event.target)) return;
    event.preventDefault();
    event.stopPropagation();

    const element = highlightedElement || event.target;
    const { outputFormat = "standard" } = await chrome.storage.sync.get("outputFormat");
    const { convertElementToMarkdown, convertElementToPlainText, fileNameFromMarkdown } = window.ElementToMarkdown;
    const options = { outputFormat };
    const markdown = convertElementToMarkdown(element, options);
    const plainText = convertElementToPlainText(element, options);
    lastResult = {
      markdown,
      plainText,
      html: element.outerHTML,
      filename: fileNameFromMarkdown(markdown)
    };

    const currentMode = mode;
    stopSelectionMode();

    if (currentMode === "save") {
      saveMarkdown(markdown, lastResult.filename);
      showToast("save");
      return;
    }

    if (currentMode === "plain") {
      await copyText(plainText);
      showPlainTextToast();
      return;
    }

    await copyText(markdown);
    showToast("copy");
  }

  function onKeyDown(event) {
    if (event.key === "Escape") {
      event.preventDefault();
      stopSelectionMode();
    }
  }

  function activate(nextMode) {
    stopSelectionMode();
    mode = nextMode;
    document.addEventListener("mousemove", onMouseMove, true);
    document.addEventListener("click", onClick, true);
    document.addEventListener("keydown", onKeyDown, true);
  }

  chrome.runtime.onMessage.addListener((message) => {
    if (message?.type === "element-to-markdown:activate") {
      activate(message.mode);
    }
  });

  window.ElementToMarkdownPicker = { activate };
})();
