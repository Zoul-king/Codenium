import { rmSync } from "node:fs";
import path from "node:path";

const buildDir = path.join(process.cwd(), ".next-build");

try {
  rmSync(buildDir, { recursive: true, force: true });
  console.log(`Cleared build cache at ${buildDir}.`);
} catch {
  console.log(`Could not clear build cache at ${buildDir}.`);
}
