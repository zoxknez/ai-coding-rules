$ErrorActionPreference = "Stop"

$root = Split-Path -Parent $PSScriptRoot

Push-Location $root
try {
  git config core.hooksPath .githooks
  Write-Host "Git hooks path set to .githooks" -ForegroundColor Green
} finally {
  Pop-Location
}
