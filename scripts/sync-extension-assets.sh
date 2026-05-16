#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

mkdir -p "$ROOT_DIR/extension/vendor"
cp "$ROOT_DIR/shared/converter-core.js" "$ROOT_DIR/extension/converter-core.js"
cp "$ROOT_DIR/shared/turndown.js" "$ROOT_DIR/extension/vendor/turndown.js"

echo "Synced shared converter assets into extension/."
