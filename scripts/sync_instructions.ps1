$ErrorActionPreference = "Stop"

$root = Split-Path -Parent $PSScriptRoot
$canonical = Join-Path $root "prompts\vibe-coding-instructions.md"

if (-not (Test-Path $canonical)) {
  throw "Canonical instructions not found: $canonical"
}

$targets = @(
  Join-Path $root "copilot-instructions.md",
  Join-Path $root "claude-instructions.md",
  Join-Path $root "cursor-rules.md",
  Join-Path $root ".github\copilot-instructions.md"
)

foreach ($target in $targets) {
  Copy-Item -Path $canonical -Destination $target -Force
}

Write-Host "Synced canonical instructions to:" -ForegroundColor Green
$targets | ForEach-Object { Write-Host " - $_" }
