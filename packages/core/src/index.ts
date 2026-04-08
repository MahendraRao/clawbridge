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
    models: ["gpt-5.4", "gpt-5.4-mini", "gpt-5.4-nano", "custom"]
  },
  anthropic: {
    label: "Anthropic",
    models: ["claude-opus-4-6", "claude-sonnet-4-6", "custom"]
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
    recommendedNextSteps: [
      "Run installer",
      "Refresh verification",
      "Generate provider config",
      "Run doctor"
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

    const outputPath = path.join(process.cwd(), ".env.clawbridge");
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

app.post("/api/run-command", async (req, res) => {
  const { command } = req.body;

  const allowed: Record<string, string[]> = {
    version: ["openclaw", "--version"],
    status: ["openclaw", "status"],
    doctor: ["openclaw", "doctor"]
  };

  const cmd = allowed[command];

  if (!cmd) {
    return res.json({
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

