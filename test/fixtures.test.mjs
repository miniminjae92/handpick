import { test } from "node:test";
import assert from "node:assert/strict";
import { readdirSync, readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { JSDOM } from "jsdom";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

function read(relativePath) {
  return readFileSync(path.join(root, relativePath), "utf8");
}

// The converter ships as browser IIFEs that attach to window, so evaluate them
// inside a jsdom window instead of importing them as modules.
function createConverterWindow() {
  const { window } = new JSDOM("<!doctype html><html><body></body></html>", {
    runScripts: "outside-only"
  });
  window.eval(read("shared/turndown.js"));
  window.eval(read("shared/converter-core.js"));
  assert.ok(window.TurndownService, "shared/turndown.js must define TurndownService");
  assert.ok(window.Handpick, "shared/converter-core.js must define Handpick");
  return window;
}

const window = createConverterWindow();
const fixtures = JSON.parse(read("fixtures/index.json"));

test("every fixture directory is registered in fixtures/index.json", () => {
  const registered = new Set(fixtures.map((fixture) => fixture.name));
  const onDisk = readdirSync(path.join(root, "fixtures"), { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name);
  const unregistered = onDisk.filter((name) => !registered.has(name));
  assert.deepEqual(unregistered, [], `Unregistered fixture directories: ${unregistered.join(", ")}`);
});

// Mirrors fixtures.html: extractContent + convertToMarkdown, compared
// against expected.md trimmed.
for (const fixture of fixtures) {
  test(`fixture: ${fixture.name}`, () => {
    const input = read(path.join("fixtures", fixture.input));
    const expected = read(path.join("fixtures", fixture.expected)).trim();
    const doc = new window.DOMParser().parseFromString(input, "text/html");
    const content = window.Handpick.extractContent(doc);
    const actual = window.Handpick.convertToMarkdown(content, {
      outputFormat: fixture.outputFormat || "standard"
    });
    assert.equal(actual, expected);
  });
}
