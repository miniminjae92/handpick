const notice = document.querySelector("#notice");

function showNotice(message) {
  notice.textContent = message;
  notice.hidden = false;
}

async function loadShortcutHints() {
  const commands = await chrome.commands.getAll();
  document.querySelectorAll("kbd[data-command]").forEach((hint) => {
    const command = commands.find((candidate) => candidate.name === hint.dataset.command);
    hint.textContent = command?.shortcut || "No shortcut";
  });
}

async function loadObsidianHint() {
  const { obsidianVault = "" } = await chrome.storage.sync.get("obsidianVault");
  document.querySelector("#obsidianHint").textContent = obsidianVault
    ? obsidianVault
    : "Set vault in options";
}

async function activate(mode) {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  const response = await chrome.runtime.sendMessage({
    type: "element-to-markdown:activate-from-popup",
    mode,
    tab
  });
  if (response?.ok) {
    window.close();
  } else {
    showNotice("This page can't be captured. Browser pages, the Chrome Web Store, and some PDFs are restricted.");
  }
}

document.querySelectorAll("#actions button").forEach((button) => {
  button.addEventListener("click", () => activate(button.dataset.mode));
});

document.querySelector("#optionsLink").addEventListener("click", () => {
  chrome.runtime.openOptionsPage();
});

document.querySelector("#shortcutsLink").addEventListener("click", () => {
  chrome.tabs.create({ url: "chrome://extensions/shortcuts" });
});

loadShortcutHints();
loadObsidianHint();
