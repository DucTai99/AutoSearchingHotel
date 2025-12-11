const { execSync } = require("child_process");
const fs = require("fs");
const path = require("path");
const os = require("os");

function getChromiumPath() {
  const playwrightCacheDir =
    process.env.PLAYWRIGHT_BROWSERS_PATH ||
    path.join(os.homedir(), "AppData", "Local", "ms-playwright");

  // Check for chromium in various versions
  const possiblePaths = [
    path.join(
      playwrightCacheDir,
      "chromium-1200",
      "chrome-win64",
      "chrome.exe"
    ),
    path.join(
      playwrightCacheDir,
      "chromium-1140",
      "chrome-win64",
      "chrome.exe"
    ),
    path.join(
      playwrightCacheDir,
      "chromium-1120",
      "chrome-win64",
      "chrome.exe"
    ),
  ];

  for (const chromePath of possiblePaths) {
    if (fs.existsSync(chromePath)) {
      return chromePath;
    }
  }

  return null;
}

function installPlaywrightBrowsers() {
  console.log("\n========================================");
  console.log("Playwright browsers not found.");
  console.log("Installing Chromium browser...");
  console.log("This is a one-time setup and may take a few minutes.");
  console.log("========================================\n");

  try {
    execSync("npx playwright install chromium", {
      stdio: "inherit",
      timeout: 300000, // 5 minutes timeout
    });
    console.log("\n✓ Chromium browser installed successfully!\n");
    return true;
  } catch (error) {
    console.error("\n✗ Failed to install Chromium browser:", error.message);
    console.error("\nPlease run manually: npx playwright install chromium\n");
    return false;
  }
}

function ensurePlaywrightBrowsers() {
  const chromiumPath = getChromiumPath();

  if (!chromiumPath) {
    console.log("Checking Playwright browsers...");
    const installed = installPlaywrightBrowsers();
    if (!installed) {
      console.error("Cannot start server without Playwright browsers.");
      console.error(
        "Please install them manually and restart the application."
      );
      process.exit(1);
    }
  } else {
    console.log("✓ Playwright browsers found");
  }
}

module.exports = { ensurePlaywrightBrowsers, getChromiumPath };
