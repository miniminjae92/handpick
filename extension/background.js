const MODES_BY_COMMAND = {
  "copy-as-markdown": "copy",
  "save-as-markdown": "save",
  "copy-as-plain-text": "plain"
};

async function flashActivationError(tabId) {
  try {
    await chrome.action.setBadgeBackgroundColor({ tabId, color: "#b42318" });
    await chrome.action.setBadgeText({ tabId, text: "!" });
    await chrome.action.setTitle({
      tabId,
      title: "Element to Markdown can't run on this page (browser and store pages are restricted)."
    });
    setTimeout(() => {
      chrome.action.setBadgeText({ tabId, text: "" }).catch(() => {});
      chrome.action.setTitle({ tabId, title: "Element to Markdown" }).catch(() => {});
    }, 4000);
  } catch {
    // Tab may be gone; nothing else to report to.
  }
}

async function activateSelectionMode(mode, targetTab) {
  let tab = targetTab;
  if (!tab) {
    [tab] = await chrome.tabs.query({ active: true, lastFocusedWindow: true });
  }
  if (!tab?.id) return { ok: false };

  try {
    await chrome.scripting.executeScript({
      target: { tabId: tab.id },
      files: ["vendor/turndown.js", "converter-core.js", "content-script.js"]
    });
    await chrome.tabs.sendMessage(tab.id, {
      type: "element-to-markdown:activate",
      mode
    });
    return { ok: true };
  } catch {
    await flashActivationError(tab.id);
    return { ok: false };
  }
}

chrome.runtime.onInstalled.addListener((details) => {
  if (details.reason === "install") {
    chrome.tabs.create({ url: chrome.runtime.getURL("welcome.html") });
  }
});

chrome.commands.onCommand.addListener((command) => {
  const mode = MODES_BY_COMMAND[command];
  if (mode) activateSelectionMode(mode);
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message?.type === "element-to-markdown:activate-from-popup") {
    activateSelectionMode(message.mode, message.tab).then(sendResponse);
    return true;
  }

  if (message?.type === "element-to-markdown:open-options") {
    chrome.runtime.openOptionsPage();
    return;
  }

  if (message?.type === "element-to-markdown:open-report") {
    const openTab = () => chrome.tabs.create({ url: chrome.runtime.getURL("report.html") });
    const clip = (text) => (typeof text === "string" ? text.slice(0, 200000) : text);
    chrome.storage.session.set({ pendingBugReport: message.payload })
      .then(openTab)
      .catch(() => {
        // storage.session quota exceeded on huge captures — retry clipped, but
        // always open the report page.
        const payload = message.payload || {};
        chrome.storage.session.set({
          pendingBugReport: {
            inputHtml: clip(payload.inputHtml),
            actualMarkdown: clip(payload.actualMarkdown),
            actualPlainText: clip(payload.actualPlainText),
            truncated: true
          }
        }).then(openTab, openTab);
      });
  }
});
