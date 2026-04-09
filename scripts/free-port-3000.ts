import { execSync } from "node:child_process";
import { rmSync } from "node:fs";
import path from "node:path";

const port = 3000;
const devDistDirs = [path.join(process.cwd(), ".next"), path.join(process.cwd(), ".next-dev")];

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

function sleep(milliseconds: number): void {
  Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, milliseconds);
}

function clearDir(dir: string): void {
  for (let attempt = 1; attempt <= 3; attempt += 1) {
    try {
      rmSync(dir, { recursive: true, force: true });
      console.log(`Cleared dev cache at ${dir}.`);
      return;
    } catch {
      if (attempt < 3) {
        sleep(250);
        continue;
      }

      console.log(`Could not clear dev cache at ${dir}.`);
    }
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

for (const dir of devDistDirs) {
  clearDir(dir);
}
