const description = document.querySelector("#description");
const htmlInput = document.querySelector("#htmlInput");
const markdownOutput = document.querySelector("#markdownOutput");
const plainTextOutput = document.querySelector("#plainTextOutput");
const renderedPreview = document.querySelector("#renderedPreview");
const statusLine = document.querySelector("#status");

async function loadDraft() {
  const { pendingBugReport } = await chrome.storage.session.get("pendingBugReport");
  if (!pendingBugReport) {
    statusLine.textContent = "There is no bug report draft to load.";
    return;
  }

  htmlInput.value = pendingBugReport.inputHtml || "";
  markdownOutput.value = pendingBugReport.actualMarkdown || "";
  plainTextOutput.value = pendingBugReport.actualPlainText || "";
  updateRenderedPreview();
}

function currentPayload() {
  return {
    description: description.value,
    inputHtml: htmlInput.value,
    actualMarkdown: markdownOutput.value,
    actualPlainText: plainTextOutput.value
  };
}

function downloadDebugCase() {
  const blob = new Blob([`${JSON.stringify(currentPayload(), null, 2)}\n`], {
    type: "application/json;charset=utf-8"
  });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "debug-case.json";
  link.click();
  URL.revokeObjectURL(url);
  statusLine.textContent = "Saved debug-case.json.";
}

function openGitHubIssue() {
  const body = [
    "## What happened?",
    description.value || "_Please describe the issue._",
    "",
    "## Debug case",
    "Attach the downloaded `debug-case.json` file to this issue after reviewing it for sensitive information."
  ].join("\n");

  const params = new URLSearchParams({
    title: "[bug] Markdown conversion issue",
    body
  });
  window.open(`https://github.com/miniminjae92/f12-copy-elements-to-md/issues/new?${params}`, "_blank", "noopener");
}

function updateRenderedPreview() {
  renderedPreview.innerHTML = htmlInput.value;
}

document.querySelector("#downloadButton").addEventListener("click", downloadDebugCase);
document.querySelector("#githubButton").addEventListener("click", openGitHubIssue);
htmlInput.addEventListener("input", updateRenderedPreview);
loadDraft();
