const description = document.querySelector("#description");
const htmlInput = document.querySelector("#htmlInput");
const markdownOutput = document.querySelector("#markdownOutput");
const plainTextOutput = document.querySelector("#plainTextOutput");
const statusLine = document.querySelector("#status");

async function loadDraft() {
  const { pendingBugReport } = await chrome.storage.session.get("pendingBugReport");
  if (!pendingBugReport) {
    statusLine.textContent = "불러올 리포트 초안이 없습니다.";
    return;
  }

  htmlInput.value = pendingBugReport.inputHtml || "";
  markdownOutput.value = pendingBugReport.actualMarkdown || "";
  plainTextOutput.value = pendingBugReport.actualPlainText || "";
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
  statusLine.textContent = "debug-case.json 파일로 저장했습니다.";
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

document.querySelector("#downloadButton").addEventListener("click", downloadDebugCase);
document.querySelector("#githubButton").addEventListener("click", openGitHubIssue);
loadDraft();
