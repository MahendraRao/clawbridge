import os from "node:os";

console.log("ClawBridge doctor demo");
console.log("----------------------");
console.log(`OS: ${os.platform()}`);
console.log(`Arch: ${os.arch()}`);
console.log(`Shell: ${process.env.SHELL || process.env.ComSpec || "unknown"}`);
console.log("");
console.log("Next:");
console.log("1. Start the API with: pnpm dev:api");
console.log("2. Start the UI with: pnpm dev:web");
console.log("3. Or run both with: pnpm dev");