(() => {
  if (window.ElementToMarkdownPicker) return;

  const HIGHLIGHT_ID = "element-to-markdown-highlight";
  const TOAST_ID = "element-to-markdown-toast";

  let mode = null;
  let highlightedElement = null;
  let lastResult = null;

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
    document.getElementById(TOAST_ID)?.remove();
  }

  function showToast(kind) {
    removeToast();
    const toast = document.createElement("div");
    toast.id = TOAST_ID;
    Object.assign(toast.style, {
      position: "fixed",
      right: "20px",
      bottom: "20px",
      zIndex: "2147483647",
      display: "flex",
      alignItems: "center",
      gap: "10px",
      padding: "12px 14px",
      border: "1px solid rgba(15, 23, 42, 0.12)",
      borderRadius: "12px",
      background: "#ffffff",
      color: "#0f172a",
      boxShadow: "0 18px 42px rgba(15, 23, 42, 0.18)",
      font: "14px/1.3 -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif"
    });

    const message = document.createElement("strong");
    message.textContent = kind === "save" ? "Saved as .md" : "Markdown copied";
    toast.append(message);

    const actions = kind === "save"
      ? [
        ["Copy Markdown", async () => {
          await copyText(lastResult.markdown);
          showToast("copy");
        }],
        ["Copy plain text", async () => {
          await copyText(lastResult.plainText);
          showPlainTextToast();
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
        }]
      ];

    actions.forEach(([label, onClick]) => {
      const button = document.createElement("button");
      button.type = "button";
      button.textContent = label;
      Object.assign(button.style, {
        border: "0",
        background: "transparent",
        color: "#0f766e",
        font: "inherit",
        fontWeight: "600",
        cursor: "pointer",
        padding: "0"
      });
      button.addEventListener("click", onClick);
      toast.append(button);
    });

    document.documentElement.append(toast);
    setTimeout(() => toast.isConnected && toast.remove(), 4500);
  }

  function showPlainTextToast() {
    removeToast();
    const toast = document.createElement("div");
    toast.id = TOAST_ID;
    toast.textContent = "Plain text copied";
    Object.assign(toast.style, {
      position: "fixed",
      right: "20px",
      bottom: "20px",
      zIndex: "2147483647",
      padding: "12px 14px",
      border: "1px solid rgba(15, 23, 42, 0.12)",
      borderRadius: "12px",
      background: "#ffffff",
      color: "#0f172a",
      boxShadow: "0 18px 42px rgba(15, 23, 42, 0.18)",
      font: "14px/1.3 -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif"
    });
    document.documentElement.append(toast);
    setTimeout(() => toast.isConnected && toast.remove(), 2800);
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
    const { convertElement, convertElementToPlainText, fileNameFromMarkdown } = window.ElementToMarkdownConverter;
    const markdown = convertElement(element);
    const plainText = convertElementToPlainText(element);
    lastResult = {
      markdown,
      plainText,
      filename: fileNameFromMarkdown(markdown)
    };

    const currentMode = mode;
    stopSelectionMode();

    if (currentMode === "save") {
      saveMarkdown(markdown, lastResult.filename);
      showToast("save");
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
