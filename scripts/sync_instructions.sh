#!/usr/bin/env bash
set -euo pipefail

root="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
canonical="$root/prompts/vibe-coding-instructions.md"

if [[ ! -f "$canonical" ]]; then
  echo "Canonical instructions not found: $canonical" >&2
  exit 1
fi

cp "$canonical" "$root/copilot-instructions.md"
cp "$canonical" "$root/claude-instructions.md"
cp "$canonical" "$root/cursor-rules.md"
cp "$canonical" "$root/.github/copilot-instructions.md"

echo "Synced canonical instructions to:"
printf " - %s\n" "$root/copilot-instructions.md" "$root/claude-instructions.md" "$root/cursor-rules.md" "$root/.github/copilot-instructions.md"
