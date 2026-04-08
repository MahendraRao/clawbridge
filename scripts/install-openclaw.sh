#!/usr/bin/env bash
set -euo pipefail

echo "[ClawBridge] This wrapper prints the official OpenClaw install command."
echo "Review it before running in a production-grade build."
echo

echo "macOS / Linux / WSL:"
echo "curl -fsSL https://openclaw.ai/install.sh | bash"
echo

echo "Windows PowerShell:"
echo "iwr -useb https://openclaw.ai/install.ps1 | iex"
