# ClawBridge Architecture Overview

## Current Architecture

```text
Frontend (React + Vite)
        ↓
Local API (Express + TypeScript)
        ↓
Machine inspection
        ↓
OpenClaw verification
        ↓
Provider orchestration
        ↓
Operational diagnostics
```

## Current Components

### Frontend
Location:
```text
apps/desktop
```

Responsibilities:
- onboarding UI
- provider setup
- verification execution
- operational diagnostics
- config generation

### Backend API
Location:
```text
packages/core
```

Responsibilities:
- system checks
- OpenClaw command execution
- provider config generation
- local file handling
- diagnostics execution

## Future Direction

ClawBridge is evolving toward:
- AI operational tooling
- provider orchestration
- agent observability
- DevOps workflows
- operational reliability tooling