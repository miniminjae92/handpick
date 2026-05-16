const outputFormat = document.querySelector("#outputFormat");
const statusLine = document.querySelector("#status");

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

outputFormat.addEventListener("change", saveOptions);
document.querySelector("#shortcutsButton").addEventListener("click", () => {
  chrome.tabs.create({
    url: "chrome://extensions/shortcuts"
  });
});
loadOptions();
