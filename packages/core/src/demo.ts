import {
  checkGitInstalled,
  checkNodeVersion,
  detectOpenClaw,
  detectPlatform,
  launchDryRun,
  recommendedInstallCommand,
  validateProviderConfig,
} from "./index.js";

async function main() {
  const steps = [
    detectPlatform(),
    checkNodeVersion(),
    await checkGitInstalled(),
    await detectOpenClaw(),
    recommendedInstallCommand(),
    validateProviderConfig({
      provider: "openai",
      model: "gpt-4.1",
      apiKeyPresent: false,
    }),
    await launchDryRun(),
  ];

  for (const step of steps) {
    console.log(`\n[${step.status.toUpperCase()}] ${step.name}`);
    console.log(`- ${step.summary}`);
    if (step.details) console.log(`- details: ${step.details}`);
    if (step.fix) console.log(`- fix: ${step.fix}`);
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
