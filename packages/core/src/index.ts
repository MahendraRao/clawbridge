import cors from "cors";
import express from "express";
import os from "node:os";
import { execFile } from "node:child_process";
import { promisify } from "node:util";
import type { SystemCheckResponse, ToolCheck } from "./types";

const execFileAsync = promisify(execFile);
const app = express();
const PORT = 8787;

app.use(cors());
app.use(express.json());

async function checkCommand(
  name: string,
  command: string,
  args: string[] = ["--version"]
): Promise<ToolCheck> {
  try {
    const { stdout, stderr } = await execFileAsync(command, args);
    const output = (stdout || stderr || "").trim().split("\n")[0];
    return {
      name,
      ok: true,
      version: output || "installed"
    };
  } catch (error) {
    return {
      name,
      ok: false,
      details:
        error instanceof Error ? error.message : `Unable to execute ${command}`
    };
  }
}

function getRecommendedInstallCommand(platform: NodeJS.Platform): string {
  if (platform === "win32") {
    return "iwr -useb https://openclaw.ai/install.ps1 | iex";
  }

  return "curl -fsSL https://openclaw.ai/install.sh | bash";
}

async function buildSystemCheck(): Promise<SystemCheckResponse> {
  const platform = os.platform();
  const [node, git, openclaw] = await Promise.all([
    checkCommand("Node.js", "node", ["-v"]),
    checkCommand("Git", "git", ["--version"]),
    checkCommand("OpenClaw", "openclaw", ["--version"])
  ]);

  const recommendedNextSteps: string[] = [];

  if (!node.ok) recommendedNextSteps.push("Install Node.js 24 or later.");
  if (!git.ok) recommendedNextSteps.push("Install Git.");
  if (!openclaw.ok) {
    recommendedNextSteps.push("Install OpenClaw using the recommended installer.");
  } else {
    recommendedNextSteps.push("Run: openclaw status");
    recommendedNextSteps.push("Run: openclaw gateway status");
    recommendedNextSteps.push("Run: openclaw doctor");
  }

  return {
    ok: true,
    os: platform,
    arch: os.arch(),
    shell: process.env.SHELL || process.env.ComSpec || "unknown",
    node,
    git,
    openclaw,
    recommendedInstallCommand: getRecommendedInstallCommand(platform),
    recommendedNextSteps
  };
}

app.get("/api/health", (_req, res) => {
  res.json({ ok: true, service: "clawbridge-core" });
});

app.get("/api/system-check", async (_req, res) => {
  try {
    const result = await buildSystemCheck();
    res.json(result);
  } catch (error) {
    res.status(500).json({
      ok: false,
      message:
        error instanceof Error ? error.message : "Unknown system check error"
    });
  }
});

app.listen(PORT, () => {
  console.log(`ClawBridge core API listening on http://localhost:${PORT}`);
});