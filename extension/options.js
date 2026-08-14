const fields = {
  outputFormat: document.querySelector("#outputFormat"),
  frontmatterMode: document.querySelector("#frontmatterMode"),
  obsidianVault: document.querySelector("#obsidianVault"),
  obsidianFolder: document.querySelector("#obsidianFolder")
};
const statusLine = document.querySelector("#status");

const DEFAULTS = {
  outputFormat: "standard",
  frontmatterMode: "save",
  obsidianVault: "",
  obsidianFolder: "Clippings"
};

async function loadOptions() {
  const saved = await chrome.storage.sync.get(DEFAULTS);
  for (const [key, field] of Object.entries(fields)) {
    field.value = saved[key];
  }
}

async function saveOptions() {
  await chrome.storage.sync.set({
    outputFormat: fields.outputFormat.value,
    frontmatterMode: fields.frontmatterMode.value,
    obsidianVault: fields.obsidianVault.value.trim(),
    obsidianFolder: fields.obsidianFolder.value.trim().replace(/^\/+|\/+$/g, "")
  });
  statusLine.textContent = "Saved.";
}

for (const field of Object.values(fields)) {
  field.addEventListener("change", saveOptions);
}

document.querySelector("#shortcutsButton").addEventListener("click", () => {
  chrome.tabs.create({
    url: "chrome://extensions/shortcuts"
  });
});
loadOptions();
