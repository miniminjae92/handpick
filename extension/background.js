async function activateSelectionMode(mode) {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  if (!tab?.id) return;

  await chrome.scripting.executeScript({
    target: { tabId: tab.id },
    files: ["vendor/turndown.js", "converter-core.js", "content-script.js"]
  });

  await chrome.tabs.sendMessage(tab.id, {
    type: "element-to-markdown:activate",
    mode
  });
}

chrome.commands.onCommand.addListener((command) => {
  if (command === "copy-as-markdown") {
    activateSelectionMode("copy");
  }

  if (command === "save-as-markdown") {
    activateSelectionMode("save");
  }
});
