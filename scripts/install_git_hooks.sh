#!/usr/bin/env bash
set -euo pipefail

root="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

cd "$root"

git config core.hooksPath .githooks

echo "Git hooks path set to .githooks"
