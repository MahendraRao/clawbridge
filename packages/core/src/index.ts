import cors from "cors";
import express from "express";
import os from "node:os";
import fs from "node:fs/promises";
import path from "node:path";
import { execFile } from "node:child_process";
import { promisify } from "node:util";

const execFileAsync = promisify(execFile);
const app = express();
const PORT = 8787;

app.use(cors());
app.use(express.json());

const MODEL_CATALOG = {
  openai: {
    label: "OpenAI",
    models: ["gpt-5.5", "gpt-5.4", "gpt-5.4-mini", "gpt-5.4-nano", "custom"]
  },
  anthropic: {
    label: "Anthropic",
    models: ["claude-opus-4.7", "claude-opus-4.6", "claude-sonnet-4.6", "claude-haiku-4.5" ,"custom"]
  },
  ollama: {
    label: "Ollama",
    models: ["qwen3.5", "llama3.3", "custom"]
  },
  local: {
    label: "Local",
    models: ["custom"]
  }
};

async function runCommand(command: string, args: string[]) {
  try {
    const { stdout, stderr } = await execFileAsync(command, args);
    return {
      ok: true,
      output: (stdout || stderr || "").trim()
    };
  } catch (error) {
    return {
      ok: false,
      output: error instanceof Error ? error.message : "Unknown command error"
    };
  }
}

async function checkCommand(name: string, command: string, args: string[]) {
  const result = await runCommand(command, args);

  return {
    name,
    ok: result.ok,
    version: result.ok ? result.output.split("\n")[0] : undefined,
    details: result.ok ? undefined : result.output
  };
}

function buildProviderEnv({
  provider,
  apiKey,
  model,
  customModel,
  ollamaHost
}: {
  provider: string;
  apiKey?: string;
  model: string;
  customModel?: string;
  ollamaHost?: string;
}) {
  const finalModel = model === "custom" ? customModel?.trim() : model;

  if (!finalModel) {
    return {
      ok: false,
      message: "Custom model name is required.",
      config: ""
    };
  }

  if (
    (provider === "openai" || provider === "anthropic") &&
    !apiKey?.trim()
  ) {
    return {
      ok: false,
      message: "API key is required for hosted providers.",
      config: ""
    };
  }

  const configMap: Record<string, string> = {
    openai: `PROVIDER=openai
OPENAI_API_KEY=${apiKey}
OPENAI_MODEL=${finalModel}`,
    anthropic: `PROVIDER=anthropic
ANTHROPIC_API_KEY=${apiKey}
ANTHROPIC_MODEL=${finalModel}`,
    ollama: `PROVIDER=ollama
OLLAMA_HOST=${ollamaHost || "http://localhost:11434"}
OLLAMA_MODEL=${finalModel}`,
    local: `PROVIDER=local
LOCAL_MODEL=${finalModel}`
  };

  return {
    ok: true,
    message: `${provider} config generated.`,
    config: configMap[provider]
  };
}

app.get("/api/model-catalog", (_req, res) => {
  res.json(MODEL_CATALOG);
});

app.get("/api/system-check", async (_req, res) => {
  const [node, git, openclaw] = await Promise.all([
    checkCommand("Node.js", "node", ["-v"]),
    checkCommand("Git", "git", ["--version"]),
    checkCommand("OpenClaw", "openclaw", ["--version"])
  ]);

  res.json({
    ok: true,
    os: os.platform(),
    arch: os.arch(),
    shell: process.env.SHELL || "unknown",
    node,
    git,
    openclaw,
    recommendedInstallCommand:
      "curl -fsSL https://openclaw.ai/install.sh | bash",
    recommendedNextSteps: openclaw.ok
  ? [
      "OpenClaw is installed.",
      "Generate provider config.",
      "Run gateway/channels verification.",
      "Run doctor."
    ]
  : [
      "Run installer.",
      "Refresh verification.",
      "Generate provider config.",
      "Run doctor after installation."
    ]
  });
});

app.post("/api/provider-config", async (req, res) => {
  const output = buildProviderEnv(req.body);
  res.json(output);
});

app.post("/api/save-config", async (req, res) => {
  try {
    const { config } = req.body;

  const generatedDir = path.join(process.cwd(), "..", "..", "generated");
  await fs.mkdir(generatedDir, { recursive: true });

  const outputPath = path.join(generatedDir, ".env.clawbridge");
  await fs.writeFile(outputPath, config, "utf8");

    res.json({
      ok: true,
      message: `Saved config to ${outputPath}`
    });
  } catch (error) {
    res.json({
      ok: false,
      message:
        error instanceof Error ? error.message : "Failed to save config"
    });
  }
});

app.get("/api/doctor-preview", (_req, res) => {
  res.json({
    commands: [
      "openclaw --version",
      "openclaw status",
      "openclaw doctor"
    ]
  });
});
async function checkGeneratedConfig() {
  const configPath = path.join(process.cwd(), "..", "..", "generated", ".env.clawbridge");

  try {
    const config = await fs.readFile(configPath, "utf8");
    const providerMatch = config.match(/^PROVIDER=(.+)$/m);

    return {
      ok: true,
      path: configPath,
      provider: providerMatch?.[1]?.trim() || "unknown"
    };
  } catch (error) {
    return {
      ok: false,
      path: configPath,
      provider: "unknown",
      error: error instanceof Error ? error.message : "Unable to read generated config"
    };
  }
}

app.post("/api/launch-test-agent", async (_req, res) => {
  const version = await runCommand("openclaw", ["--version"]);
  const gateway = await runCommand("openclaw", ["gateway", "status"]);
  const config = await checkGeneratedConfig();
  const status = await runCommand("openclaw", ["status"]);

  const checks = [
    {
      name: "OpenClaw installed",
      ok: version.ok,
      detail: version.output
    },
    {
      name: "Gateway reachable",
      ok: gateway.ok,
      detail: gateway.output
    },
    {
      name: "Provider config found",
      ok: config.ok,
      detail: config.ok
        ? `Found ${config.path}`
        : `Missing config at ${config.path}`
    },
    {
      name: "Provider detected",
      ok: config.ok && config.provider !== "unknown",
      detail: config.provider
    },
    {
      name: "OpenClaw status command",
      ok: status.ok,
      detail: status.output
    }
  ];

  res.json({
    ok: checks.every((check) => check.ok),
    provider: config.provider,
    checks
  });
});

app.post("/api/run-command", async (req, res) => {
  const { command } = req.body;

  const allowed: Record<string, string[]> = {
    version: ["openclaw", "--version"],
    status: ["openclaw", "status"],
    doctor: ["openclaw", "doctor"],
    gateway: ["openclaw", "gateway", "status"],
    channels: ["openclaw", "channels", "status", "--probe"],
    "deep-status": ["openclaw", "status", "--deep"]
  };

  const cmd = allowed[command];

  if (!cmd) {
    return res.status(400).json({
      ok: false,
      output: "Command not allowed"
    });
  }

  const result = await runCommand(cmd[0], cmd.slice(1));
  res.json(result);
});

app.listen(PORT, () => {
  console.log(`ClawBridge core API listening on http://localhost:${PORT}`);
});


