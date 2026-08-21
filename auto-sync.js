const { exec } = require("child_process");
const fs = require("fs");
const path = require("path");

let debounceTimer = null;
let isSyncing = false;

function syncToGitHub() {
  if (isSyncing) return;
  isSyncing = true;

  console.log(`\n[${new Date().toLocaleTimeString()}] 🔄 Code change detected! Auto-pushing to GitHub...`);

  exec('git add . && git commit -m "Auto-sync update" && git push origin main', (error, stdout, stderr) => {
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
console.log("📁 Watching your project for edits...");
console.log("✨ Whenever you save any file, it will automatically");
console.log("   push to GitHub and update your live Vercel website!");
console.log("=================================================\n");

const watchDir = path.resolve(__dirname);

try {
  fs.watch(watchDir, { recursive: true }, (eventType, filename) => {
    if (!filename) return;
    
    // Ignore internal folders/files
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
    debounceTimer = setTimeout(syncToGitHub, 4000); // 4-second delay after you finish saving
  });
} catch (err) {
  console.error("Watcher error:", err.message);
}
