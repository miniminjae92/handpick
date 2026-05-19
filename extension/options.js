const outputFormat = document.querySelector("#outputFormat");
const statusLine = document.querySelector("#status");
const shortcutList = document.querySelector("#shortcutList");

const commandLabels = new Map([
  ["copy-as-markdown", "Copy Markdown"],
  ["save-as-markdown", "Save Markdown"],
  ["copy-as-plain-text", "Copy plain text"]
]);

async function loadOptions() {
  const saved = await chrome.storage.sync.get("outputFormat");
  outputFormat.value = saved.outputFormat || "standard";
}

async function saveOptions() {
  await chrome.storage.sync.set({
    outputFormat: outputFormat.value
  });
  statusLine.textContent = "Saved.";
}

async function loadShortcuts() {
  const commands = await chrome.commands.getAll();
  shortcutList.replaceChildren(
    ...commands
      .filter((command) => commandLabels.has(command.name))
      .map((command) => {
        const item = document.createElement("li");
        const label = document.createElement("span");
        const shortcut = document.createElement("code");

        label.textContent = commandLabels.get(command.name);
        shortcut.textContent = command.shortcut || "Not assigned";
        item.append(label, shortcut);
        return item;
      })
  );
}

outputFormat.addEventListener("change", saveOptions);
document.querySelector("#shortcutsButton").addEventListener("click", () => {
  chrome.tabs.create({
    url: "chrome://extensions/shortcuts"
  });
});

loadOptions();
loadShortcuts();
