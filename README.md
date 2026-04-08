# ClawBridge

ClawBridge is a **GitHub-hosted AI wrapper for OpenClaw** that simplifies installation, verification, provider setup, and first-run onboarding for beginners and non-coders.

It wraps the official OpenClaw installation flow with a **guided local UI + API verification experience**.

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
- React + Vite frontend UI
- local Express backend API
- machine system checks
- Node.js version detection
- Git version detection
- OpenClaw installation detection
- recommended install command generation
- OS / architecture / shell detection
- guided next steps for installation

### 🔄 In progress
- provider setup wizard
- doctor command preview
- install button
- OpenClaw status checks
- better error diagnostics

### 🛣️ Planned
- full Electron desktop packaging
- secure secrets storage
- update and uninstall flow
- provider testing
- debug bundle export
- AI-assisted setup prompts

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

ClawBridge reduces this friction and makes OpenClaw easier to adopt for **developers, DevOps engineers, and non-coders**.

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

Prerequisites
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

4. generate install command
5. guide user with next steps

## 💡 Example output
- OS: darwin
- Architecture: arm64
- Shell: /bin/zsh
- Node.js: Installed (v24.1.0)
- Git: Installed (git version 2.53.0)
- OpenClaw: Missing

## Recommended command:
- curl -fsSL https://openclaw.ai/install.sh | bash

## 📸 Screenshots


Recommended screenshots:

* homepage before system check

![Homepage](<Screenshot 2026-04-08 at 12.50.56 PM.png>)

* machine summary after check

![System Check](<Screenshot 2026-04-08 at 12.51.17 PM.png>)

* OpenClaw missing state

![OpenClaw State](<Screenshot 2026-04-08 at 1.53.50 PM.png>)


---


## 🛠️ Roadmap

Phase 1 — MVP
 - frontend scaffold
 - backend local API
 - system checks
 - Node/Git/OpenClaw detection
 - install command recommendation

Phase 2 — Guided onboarding
- provider setup wizard
- install button
- doctor command preview
- richer diagnostics
- improved troubleshooting UX

Phase 3 — Desktop wrapper
- Electron packaging
- secrets storage
- update flow
- uninstall flow
- first-run AI setup assistant

---

## 🔐 Security notes
- never commit .env
- never log raw API keys
- prefer OS-native secret stores
- review shell execution carefully
- avoid blind auto-run flows until hardened mode is added

## 🧩 Troubleshooting
* -> pnpm: command not found

# Run:

* nvm use 24
* npm install -g pnpm

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