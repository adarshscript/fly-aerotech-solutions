#!/usr/bin/env node
import { spawn, execFileSync } from "node:child_process";
import net from "node:net";
import path from "node:path";
import fs from "node:fs";
import process from "node:process";

const cwd = process.cwd();
const DEFAULT_PORT = 3000;
const LOCK_FILE = path.join(cwd, ".next", "dev", "lock");
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

function log(message) {
  process.stdout.write(`[dev-server] ${message}\n`);
}

function execCapture(cmd, args) {
  try {
    return execFileSync(cmd, args, {
      encoding: "utf8",
      windowsHide: true,
      timeout: 15000,
      stdio: ["ignore", "pipe", "ignore"],
    }).trim();
  } catch {
    return "";
  }
}

function isPortInUse(port) {
  return new Promise((resolve) => {
    const tester = net.createServer();
    tester.once("error", () => resolve(true));
    tester.once("listening", () => tester.close(() => resolve(false)));
    tester.listen(port, "0.0.0.0");
  });
}

function getOwningPids(port) {
  if (process.platform === "win32") {
    const out = execCapture("powershell", [
      "-NoProfile",
      "-Command",
      `(Get-NetTCPConnection -LocalPort ${port} -State Listen -ErrorAction SilentlyContinue).OwningProcess`,
    ]);
    return out
      .split(/\r?\n/)
      .map((line) => Number(line.trim()))
      .filter((n) => Number.isFinite(n) && n > 0);
  }
  const out = execCapture("lsof", ["-ti", `:${port}`]);
  return out
    .split(/\r?\n/)
    .map((line) => Number(line.trim()))
    .filter((n) => Number.isFinite(n) && n > 0);
}

function getProcessInfo(pid) {
  if (process.platform === "win32") {
    const out = execCapture("powershell", [
      "-NoProfile",
      "-Command",
      `$p = Get-CimInstance Win32_Process -Filter 'ProcessId=${pid}'; if ($p) { "$($p.ParentProcessId)|$($p.CommandLine)" }`,
    ]);
    if (!out) return null;
    const sep = out.indexOf("|");
    if (sep === -1) return null;
    return { pid, ppid: Number(out.slice(0, sep)) || 0, cmdline: out.slice(sep + 1) };
  }
  const ppid = execCapture("ps", ["-o", "ppid=", "-p", String(pid)]).trim();
  return { pid, ppid: Number(ppid) || 0, cmdline: getUnixCmdline(pid) };
}

function getUnixCmdline(pid) {
  try {
    return fs.readFileSync(`/proc/${pid}/cmdline`, "utf8").split("\0").join(" ");
  } catch {
    return execCapture("ps", ["-o", "command=", "-p", String(pid)]);
  }
}

function isProjectRelated(cmdline) {
  if (!cmdline) return false;
  const norm = cmdline.toLowerCase();
  const projectPath = cwd.toLowerCase();
  if (!norm.includes(projectPath)) return false;
  return /next|npm|npx|node|cmd\.exe|\bcmd\b/.test(norm);
}

function findDevRoot(pid) {
  let current = pid;
  let info = getProcessInfo(current);
  let top = info;
  while (info) {
    top = info;
    if (!info.ppid || info.ppid === info.pid) break;
    const parent = getProcessInfo(info.ppid);
    if (!parent || !isProjectRelated(parent.cmdline)) break;
    current = info.ppid;
    info = parent;
  }
  return top;
}

function killProcess(pid) {
  try {
    if (process.platform === "win32") {
      execCapture("taskkill", ["/PID", String(pid), "/T", "/F"]);
    } else {
      process.kill(pid, "SIGTERM");
    }
    return true;
  } catch {
    return false;
  }
}

async function stopNextDevServerOn(port) {
  const pids = getOwningPids(port);
  for (const pid of pids) {
    const root = findDevRoot(pid);
    if (root && isProjectRelated(root.cmdline)) {
      log(`Stopping existing Next.js dev server (PID ${root.pid}, listener ${pid})...`);
      killProcess(root.pid);
    } else {
      log(`Port ${port} is held by an unrelated process (PID ${pid}) - leaving it untouched.`);
    }
  }
  if (pids.length > 0) {
    for (let i = 0; i < 20; i += 1) {
      if (!(await isPortInUse(port))) break;
      await sleep(250);
    }
  }
}

function cleanupStaleLock() {
  if (!fs.existsSync(LOCK_FILE)) return;
  try {
    fs.rmSync(LOCK_FILE, { force: true });
    log("Removed stale lock file (.next/dev/lock).");
  } catch (err) {
    log(`Could not remove stale lock: ${err.message}`);
  }
}

async function main() {
  const args = process.argv.slice(2);
  const portFlagIndex = args.findIndex((a) => a === "--port" || a === "-p");
  let requestedPort = DEFAULT_PORT;
  if (portFlagIndex !== -1 && args[portFlagIndex + 1]) {
    requestedPort = Number(args[portFlagIndex + 1]);
    if (Number.isFinite(requestedPort)) args.splice(portFlagIndex, 2);
    else requestedPort = DEFAULT_PORT;
  }

  let port = requestedPort;

  await stopNextDevServerOn(port);
  cleanupStaleLock();

  if (await isPortInUse(port)) {
    log(`Port ${port} is still in use by another application.`);
    while (await isPortInUse(port)) port += 1;
    log(`Starting on next available port: ${port}`);
  }

  const nextBin = path.join(cwd, "node_modules", "next", "dist", "bin", "next");
  const child = spawn(
    process.execPath,
    [nextBin, "dev", "--port", String(port), ...args],
    { stdio: "inherit", cwd, windowsHide: true }
  );
  child.on("exit", (code) => process.exit(code ?? 0));
}

main().catch((err) => {
  console.error("[dev-server] Failed to start:", err);
  process.exit(1);
});
