import { rmSync } from "node:fs";
import path from "node:path";

const buildDirs = [path.join(process.cwd(), ".next"), path.join(process.cwd(), ".next-build")];

for (const buildDir of buildDirs) {
  try {
    rmSync(buildDir, { recursive: true, force: true });
    console.log(`Cleared build cache at ${buildDir}.`);
  } catch {
    console.log(`Could not clear build cache at ${buildDir}.`);
  }
}
