#!/usr/bin/env bash
# Fails when the extension copies have drifted from the shared source of truth.
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

status=0

compare() {
  local src="$1" dst="$2"
  if [[ ! -f "$ROOT_DIR/$dst" ]]; then
    echo "Missing extension copy: $dst" >&2
    status=1
  elif ! cmp -s "$ROOT_DIR/$src" "$ROOT_DIR/$dst"; then
    echo "Drift detected: $src and $dst differ." >&2
    status=1
  fi
}

compare shared/converter-core.js extension/converter-core.js
compare shared/turndown.js extension/vendor/turndown.js

if [[ "$status" -ne 0 ]]; then
  echo "Run ./scripts/sync-extension-assets.sh and commit the result." >&2
else
  echo "Shared converter assets are in sync."
fi

exit "$status"
