import os from "node:os";
import process from "node:process";
import { execa } from "execa";
import semver from "semver";
import type { ProviderConfig, StepResult } from "./types.js";

const MIN_NODE = "22.14.0";

export function detectPlatform(): StepResult {
  return {
    name: "platform",
    status: "pass",
    summary: `${os.platform()} ${os.arch()}`,
    details: `shell=${process.env.SHELL ?? "unknown"}`,
  };
}

export function checkNodeVersion(): StepResult {
  const version = process.versions.node;
  const ok = semver.gte(version, MIN_NODE);
  return {
    name: "node",
    status: ok ? "pass" : "fail",
    summary: `node ${version}`,
    details: `minimum supported version is ${MIN_NODE}`,
    fix: ok ? undefined : "Install Node 24 or Node 22.14+ and reopen your terminal.",
  };
}

export async function checkGitInstalled(): Promise<StepResult> {
  try {
    const { stdout } = await execa("git", ["--version"]);
    return { name: "git", status: "pass", summary: stdout };
  } catch (error) {
    return {
      name: "git",
      status: "fail",
      summary: "git not found",
      fix: "Install Git and rerun the doctor flow.",
      details: String(error),
    };
  }
}

export async function detectOpenClaw(): Promise<StepResult> {
  try {
    const { stdout } = await execa("openclaw", ["--version"]);
    return {
      name: "openclaw",
      status: "pass",
      summary: stdout.trim() || "openclaw detected",
    };
  } catch {
    return {
      name: "openclaw",
      status: "warn",
      summary: "openclaw not found in PATH",
      fix: "Run the official installer, then restart your terminal and rerun doctor.",
    };
  }
}

export function recommendedInstallCommand(): StepResult {
  const platform = os.platform();

  if (platform === "win32") {
    return {
      name: "installer",
      status: "warn",
      summary: "recommended Windows command prepared",
      details: "iwr -useb https://openclaw.ai/install.ps1 | iex",
    };
  }

  return {
    name: "installer",
    status: "warn",
    summary: "recommended macOS/Linux command prepared",
    details: "curl -fsSL https://openclaw.ai/install.sh | bash",
  };
}

export function validateProviderConfig(input: ProviderConfig): StepResult {
  const missing: string[] = [];
  if (!input.provider) missing.push("provider");
  if (!input.model) missing.push("model");
  if (!input.apiKeyPresent) missing.push("apiKey");

  if (missing.length > 0) {
    return {
      name: "provider-config",
      status: "fail",
      summary: `missing required fields: ${missing.join(", ")}`,
      fix: "Fill provider, model, and API key fields before launch.",
    };
  }

  return {
    name: "provider-config",
    status: "pass",
    summary: `${input.provider} / ${input.model}`,
    details: input.baseUrl ? `baseUrl=${input.baseUrl}` : undefined,
  };
}

export async function launchDryRun(): Promise<StepResult> {
  return {
    name: "launch-dry-run",
    status: "warn",
    summary: "Dry-run only in starter pack",
    details: "In a real build, wire this action to a reviewed OpenClaw launch command.",
  };
}
