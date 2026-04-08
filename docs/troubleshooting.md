# Troubleshooting

## Node version issue

Symptoms:
- `node: command not found`
- version below supported range

Fix:
- install Node 24
- reopen terminal
- rerun doctor

## PATH issue

Symptoms:
- installer succeeds but `openclaw --version` fails

Fix:
- check npm global bin path
- restart terminal
- confirm shell profile was updated

## Git missing

Symptoms:
- installer fails during dependency or source operations

Fix:
- install Git
- rerun doctor

## Provider not configured

Symptoms:
- OpenClaw launches but model calls fail

Fix:
- add provider API key
- verify endpoint and model name
- test with a lightweight sample prompt

## Permission problem

Symptoms:
- cannot write into target directory

Fix:
- switch to local user install
- avoid system-wide directories unless needed
