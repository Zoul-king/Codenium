import { execSync } from "node:child_process";
import { rmSync } from "node:fs";
import path from "node:path";

const port = 3000;
const devDistDir = path.join(process.cwd(), ".next-dev");

function getListeningPids(targetPort: number): string[] {
  try {
    const output = execSync(`netstat -ano -p tcp | findstr LISTENING | findstr :${targetPort}`, {
      encoding: "utf8",
      stdio: ["ignore", "pipe", "ignore"]
    });

    return [
      ...new Set(
        output
          .split(/\r?\n/)
          .map((line) => line.trim())
          .filter(Boolean)
          .map((line) => line.split(/\s+/).at(-1))
          .filter((pid): pid is string => Boolean(pid) && pid !== "0")
      )
    ];
  } catch {
    return [];
  }
}

function killPid(pid: string): void {
  try {
    execSync(`taskkill /PID ${pid} /F`, {
      stdio: ["ignore", "ignore", "ignore"]
    });
    console.log(`Freed port ${port} by stopping PID ${pid}.`);
  } catch {
    console.log(`Port ${port} was occupied by PID ${pid}, but it could not be stopped automatically.`);
  }
}

const pids = getListeningPids(port);

if (pids.length === 0) {
  console.log(`Port ${port} is already free.`);
} else {
  for (const pid of pids) {
    killPid(pid);
  }
}

try {
  rmSync(devDistDir, { recursive: true, force: true });
  console.log(`Cleared dev cache at ${devDistDir}.`);
} catch {
  console.log(`Could not clear dev cache at ${devDistDir}.`);
}
