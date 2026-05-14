# ClawBridge

ClawBridge is a **GitHub-hosted AI wrapper for OpenClaw** that simplifies installation, verification, provider setup, and first-run onboarding for beginners and non-coders.

It wraps the official OpenClaw installation flow with a **guided local UI + API verification experience**.

---

## Current implementation status

ClawBridge is currently a **web UI + local API MVP**.

Today it runs as:
- a React + Vite frontend
- a local Express + TypeScript backend

It is **not yet a packaged Electron desktop app**. Full desktop packaging is planned in a later phase.

---

## ✨ Why this exists

OpenClaw is powerful, but many users still struggle with:

- Node.js and Git prerequisites
- shell / PATH issues
- verifying whether OpenClaw is installed
- provider and API key setup
- doctor / health-check flows
- first-run troubleshooting
- terminal fear for non-coders

ClawBridge solves this by acting as a **local onboarding assistant and installation wrapper**.

---

## 🚀 What works today (Current MVP)

### ✅ Working now

#### Core platform
- React + Vite frontend UI
- local Express + TypeScript backend API
- machine system checks
- OS / architecture / shell detection
- Node.js version detection
- Git version detection
- OpenClaw installation detection
- recommended install command generation
- guided next-step onboarding

#### Provider orchestration
- OpenAI provider support
- Anthropic provider support
- Ollama provider support
- local/custom provider support
- latest recommended model selection
- custom model input support
- provider-specific env generation

#### Verification + diagnostics
- OpenClaw version verification
- OpenClaw status checks
- gateway status verification
- channels status probing
- deep status verification
- OpenClaw doctor execution

#### Secure local config handling
- local `.env.clawbridge` generation
- gitignored local secret storage
- local-only generated provider configs

---

### 🔄 In progress
- first-run launch orchestration
- launch test agent flow
- provider reachability testing
- structured activity logs
- richer diagnostics and troubleshooting UX
- componentized frontend architecture
- premium control-center UI

---

### 🛣️ Planned
- Electron desktop packaging
- provider failover and routing
- agent observability
- OpenTelemetry integration
- Docker + Kubernetes support
- secure secrets storage
- plugin architecture
- AI-assisted operational workflows

---

## 🧠 Why this is useful in the 2026 AI era

The real friction in AI tools is rarely the model.

The hardest parts are:
- local environment setup
- PATH problems
- provider confusion
- shell errors
- onboarding friction
- verification steps

ClawBridge is evolving toward an operational UX layer for AI agents — focused on onboarding, diagnostics, provider orchestration, reliability, and developer experience for modern AI systems.

---

## 🏗️ Architecture

```text
Frontend (React + Vite)
        ↓
Local API (Express + TypeScript)
        ↓
Machine inspection
        ↓
Node / Git / OpenClaw checks
        ↓
Recommended install flow
        ↓
Next-step guidance

```
---


## 📂 Project structure

clawbridge/
├── apps/
│   └── desktop/              # React + Vite frontend
├── packages/
│   └── core/                 # Local API + system checks
├── docs/                     # Architecture and troubleshooting
├── scripts/                  # Install helper scripts
├── templates/                # Provider/env templates
├── .nvmrc                    # Node 24 pin
├── package.json
└── pnpm-workspace.yaml


## ⚙️ Local development setup

### Prerequisites
- Node.js 24
- pnpm 10+
- Git
- macOS / Linux / Windows

## Clone the repo
 
- git clone https://github.com/MahendraRao/clawbridge.git
- cd clawbridge



Use the correct Node version
- nvm use

If Node 24 is not installed:

- nvm install 24
- nvm use 24

Enable Corepack
- corepack enable

Install dependencies
- pnpm install

Start the project
- pnpm dev


---

## This starts:

* frontend → http://localhost:5173

* backend API → http://localhost:8787



## 🧪 Current MVP flow

1. open ClawBridge UI
2. click Run system check
3. detect:
   - OS
   - architecture
   - shell
   - Node.js
   - Git
   - OpenClaw

4. verify OpenClaw installation state
5. generate provider-specific configuration
6. select:
   - OpenAI
   - Anthropic
   - Ollama
   - local/custom models

7. generate local `.env.clawbridge`
8. run verification commands:
   - Version
   - Status
   - Gateway
   - Channels
   - Deep Status
   - Doctor

9. guide the user toward next operational steps

## 💡 Example output

- OS: darwin
- Architecture: arm64
- Shell: /bin/zsh
- Node.js: Installed (v24.1.0)
- Git: Installed (git version 2.x)
- OpenClaw: Installed (2026.x.x)

## Verification examples
- gateway status: reachable
- channels probe: successful
- doctor: completed

## Recommended command:
- curl -fsSL https://openclaw.ai/install.sh | bash

```md
## 📸 Screenshots


Recommended screenshots:

* homepage before system check

![Homepage](<./docs/screenshots/homepage.png>)

* machine summary after check

![System Check](<./docs/screenshots/system-check.png>)

* OpenClaw missing state

![OpenClaw State](<./docs/screenshots/openclaw-state.png>)

```

---


## 🛠️ Roadmap

### Phase 1 — Install + Verify
- frontend scaffold
- backend local API
- system checks
- Node/Git/OpenClaw detection
- install command recommendation

### Phase 2 — Provider orchestration
- OpenAI support
- Anthropic support
- Ollama support
- local/custom models
- provider-specific env generation
- secure local config storage

### Phase 3 — Operational UX
- launch orchestration
- provider reachability testing
- structured logs
- activity history
- richer diagnostics
- troubleshooting workflows

### Phase 4 — Agent operations
- session visibility
- execution tracing
- provider health metrics
- token usage visibility
- agent observability

### Phase 5 — DevOps + Infrastructure
- Docker integration
- Kubernetes integration
- OpenTelemetry support
- gateway health probes
- deployment diagnostics

### Phase 6 — Platform evolution
- plugin architecture
- packaged desktop app
- SDK extraction
- AI-assisted operational workflows

---

## 🔐 Security notes
- never commit .env
- never log raw API keys
- prefer OS-native secret stores
- review shell execution carefully
- avoid blind auto-run flows until hardened mode is added

## 🔒 Local generated configs

Generated provider configs are stored locally inside:

```bash
generated/.env.clawbridge
```

These files are gitignored by default and are not committed to the repository.

Never commit real API keys or credentials.
Rotate exposed credentials immediately if accidentally shared.

## 🧩 Troubleshooting
Issue as  -> pnpm: command not found

# Run:

* nvm use 24
* npm install -g pnpm


## Adding this troubleshooting note to `README.md`

```md 
## 🧩 Environment consistency notes

This repo is pinned to:
- Node 24 via `.nvmrc`
- pnpm 10 via `packageManager`

## If commands fail after entering the project directory, run:

* nvm use
* corepack enable
* pnpm -v

Then continue with:
                    * pnpm install
                    * pnpm dev
```

## OpenClaw shows missing

* Use:

  | curl -fsSL https://openclaw.ai/install.sh | bash 

## Then rerun the system check.

# PATH issues

- Verify:

    * which openclaw
    * echo $PATH


# 🤝 Contributing

Contributions are welcome.

Good areas to contribute:

* provider integrations
* Windows support
* Electron packaging
* improved diagnostics
* secure credential storage
* UI/UX improvements