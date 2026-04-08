# ClawBridge

ClawBridge is a GitHub-hosted **AI wrapper for OpenClaw** that makes installation, provider setup, verification, and first-run onboarding easier for non-coders.

It is **not** a replacement for OpenClaw. It wraps the official install flow with a safer, more guided experience.

## Why this exists

OpenClaw is powerful, but beginners often get stuck on:

- Node and Git prerequisites
- shell and PATH issues
- provider/API key setup
- launch verification
- updates and troubleshooting

ClawBridge turns that into a guided setup wizard.

## Goals

- Make OpenClaw easier to install on macOS, Linux, and Windows
- Keep the workflow close to official OpenClaw docs
- Add a simple “doctor” mode for fast troubleshooting
- Make provider configuration clearer for beginners
- Create a project that can be shared on GitHub and LinkedIn as a strong open-source portfolio piece

## Planned product shape

### Phase 1 — MVP
- System checks
- Official installer wrapper
- API provider setup wizard
- Verification checks
- One-click launch
- Logs and error guidance

### Phase 2 — Better security and UX
- Secret storage integration
- Guided updates
- Export debug bundle
- Rollback and uninstall helpers

### Phase 3 — AI-assisted setup
- Natural language setup requests like:
  - “Install OpenClaw on my Mac with OpenAI”
  - “Use local install, no admin access”
  - “Fix my PATH issue”

## Repo structure

```text
clawbridge/
├── apps/
│   └── desktop/            # Electron UI shell
├── packages/
│   └── core/               # installer, checks, launcher logic
├── docs/                   # architecture and troubleshooting notes
├── scripts/                # wrapper shell scripts
├── templates/              # env/config templates
├── package.json
└── pnpm-workspace.yaml
```

## Quick start

### 1) Install prerequisites
- Node.js 24 recommended
- pnpm 10+
- Git

### 2) Clone the repo
```bash
git clone https://github.com/<your-username>/clawbridge.git
cd clawbridge
```

### 3) Install dependencies
```bash
pnpm install
```

### 4) Run the desktop app
```bash
pnpm dev
```

### 5) Run the demo doctor flow
```bash
pnpm doctor
```

## What this wrapper does

ClawBridge intentionally uses the **official OpenClaw install flow** where possible, then adds:

- environment checks
- command safety wrappers
- plain-English error messages
- provider configuration templates
- launch verification

## Dummy example workflow

User says:

> I am on macOS. I want OpenClaw with OpenAI, and I do not want to fight with terminal setup.

ClawBridge should:

1. detect macOS
2. verify Node and Git
3. run the official OpenClaw installer
4. verify the `openclaw` command is available
5. collect provider details
6. validate the config
7. launch OpenClaw
8. show success or actionable next steps

## Security notes

- Do not commit `.env` files
- Do not log raw API keys
- Use OS-native secrets storage in production
- Review every shell command before making it fully automated
- Consider a hardened mode later using sandboxed runtimes

## Suggested GitHub publishing steps

1. Create a new GitHub repository named `clawbridge`
2. Push this starter code
3. Add screenshots/GIFs to the README
4. Tag your first release as `v0.1.0`
5. Share a short demo video on LinkedIn

## Recommended next build steps

1. wire the Electron buttons to the core package
2. add Windows PowerShell support
3. implement secure key storage
4. add real log streaming
5. package binaries for macOS, Linux, and Windows

## License

MIT
