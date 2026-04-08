# ClawBridge Architecture

## Overview

ClawBridge has two layers:

1. **Desktop shell** — a simple Electron app for guided onboarding
2. **Core engine** — reusable TypeScript functions that check prerequisites, run install commands, and verify setup

## Data flow

UI button click -> desktop IPC -> core action -> safe shell execution -> result back to UI

## Core actions

- detect operating system
- check Node version
- check Git installation
- detect OpenClaw installation
- build recommended installer command
- run verification command
- prepare provider config template
- launch OpenClaw

## Security boundaries

For the MVP:

- no raw API keys printed to logs
- no uncontrolled shell interpolation
- no remote scripts executed without explicit visibility in UI

For production:

- keychain/credential manager support
- command allowlist
- signed builds
- hardened runtime mode
