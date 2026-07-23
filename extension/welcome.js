document.querySelector("#shortcutsButton").addEventListener("click", () => {
  chrome.tabs.create({ url: "chrome://extensions/shortcuts" });
});

document.querySelector("#optionsButton").addEventListener("click", () => {
  chrome.runtime.openOptionsPage();
});
