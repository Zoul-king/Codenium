import { spawnSync } from "node:child_process";

const result = spawnSync("npx", ["next", "start"], {
  stdio: "inherit",
  shell: true,
  env: {
    ...process.env,
    NEXT_DIST_DIR: ".next-build"
  }
});

process.exit(result.status ?? 1);
