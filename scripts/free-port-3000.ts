import { execSync } from "node:child_process";
import { rmSync } from "node:fs";
import path from "node:path";

const port = 3000;
const devDistDirs = [path.join(process.cwd(), ".next"), path.join(process.cwd(), ".next-dev")];

function run(command: string) {
  return execSync(command, {
    encoding: "utf8",
    stdio: ["ignore", "pipe", "ignore"]
  });
}

function getListeningPids(targetPort: number): string[] {
  try {
    if (process.platform === "win32") {
      const output = run(`netstat -ano -p tcp | findstr LISTENING | findstr :${targetPort}`);

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
    }

    const output = run(`lsof -ti tcp:${targetPort}`);

    return [...new Set(output.split(/\r?\n/).map((line) => line.trim()).filter(Boolean))];
  } catch {
    return [];
  }
}

function killPid(pid: string) {
  try {
    const command = process.platform === "win32" ? `taskkill /PID ${pid} /F` : `kill -9 ${pid}`;
    execSync(command, { stdio: ["ignore", "ignore", "ignore"] });
    console.log(`Freed port ${port} by stopping PID ${pid}.`);
  } catch {
    console.log(`Port ${port} was occupied by PID ${pid}, but it could not be stopped automatically.`);
  }
}

function clearDir(dir: string) {
  try {
    rmSync(dir, { recursive: true, force: true });
    console.log(`Cleared dev cache at ${dir}.`);
  } catch {
    console.log(`Could not clear dev cache at ${dir}.`);
  }
}

const pids = getListeningPids(port);

if (pids.length === 0) {
  console.log(`Port ${port} is already free.`);
} else {
  pids.forEach(killPid);
}

devDistDirs.forEach(clearDir);
