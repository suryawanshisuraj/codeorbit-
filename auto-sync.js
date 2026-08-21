const { exec } = require("child_process");
const fs = require("fs");
const path = require("path");

function findGit() {
  // Check standard git on PATH first
  try {
    const { execSync } = require("child_process");
    execSync("git --version", { stdio: "ignore" });
    return "git";
  } catch (e) {}

  const standardPaths = [
    "C:\\Program Files\\Git\\cmd\\git.exe",
    "C:\\Program Files (x86)\\Git\\cmd\\git.exe",
    path.join(process.env.LOCALAPPDATA || "", "Programs", "Git", "cmd", "git.exe"),
  ];

  for (const p of standardPaths) {
    if (fs.existsSync(p)) return `"${p}"`;
  }

  // Check GitHub Desktop installation
  const ghDesktopBase = path.join(process.env.LOCALAPPDATA || "", "GitHubDesktop");
  if (fs.existsSync(ghDesktopBase)) {
    try {
      const entries = fs.readdirSync(ghDesktopBase);
      for (const entry of entries) {
        if (entry.startsWith("app-")) {
          const candidate = path.join(ghDesktopBase, entry, "resources", "app", "git", "cmd", "git.exe");
          if (fs.existsSync(candidate)) return `"${candidate}"`;
        }
      }
    } catch (e) {}
  }

  return "git";
}

const gitExe = findGit();
let debounceTimer = null;
let isSyncing = false;

function syncToGitHub() {
  if (isSyncing) return;
  isSyncing = true;

  console.log(`\n[${new Date().toLocaleTimeString()}] 🔄 Code change detected! Auto-pushing to GitHub...`);

  exec(`${gitExe} add . && ${gitExe} commit -m "Auto-sync update" && ${gitExe} push origin main`, (error, stdout, stderr) => {
    isSyncing = false;
    if (error) {
      if (stdout && stdout.includes("nothing to commit")) {
        console.log(`[${new Date().toLocaleTimeString()}] ℹ️ No changes to commit.`);
      } else {
        console.log(`[${new Date().toLocaleTimeString()}] ⚠️ Auto-sync notice:`, error.message.split("\n")[0]);
      }
    } else {
      console.log(`[${new Date().toLocaleTimeString()}] ✅ Successfully pushed to GitHub!`);
      console.log(`🚀 Vercel is now deploying your changes live to https://codeorbitquiz1.vercel.app/`);
    }
  });
}

console.log("=================================================");
console.log("  🚀 CodeOrbit: Real-Time Auto-Sync Watcher Active");
console.log("=================================================");
console.log(`Git executable: ${gitExe}`);
console.log("📁 Watching your project for edits...");
console.log("✨ Whenever you save any file, it will automatically");
console.log("   push to GitHub and update your live Vercel website!");
console.log("=================================================\n");

const watchDir = path.resolve(__dirname);

try {
  fs.watch(watchDir, { recursive: true }, (eventType, filename) => {
    if (!filename) return;
    
    if (
      filename.includes(".git") ||
      filename.includes("node_modules") ||
      filename.includes("dist") ||
      filename.includes(".tmp") ||
      filename.endsWith("auto-sync.js")
    ) {
      return;
    }

    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(syncToGitHub, 3000);
  });
} catch (err) {
  console.error("Watcher error:", err.message);
}
