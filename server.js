const express = require("express");
const cors = require("cors");
const path = require("path");
const SearchService = require("./src/services/SearchService.js");
const { ensurePlaywrightBrowsers } = require("./src/utils/browserSetup.js");

// Check and install Playwright browsers if needed
ensurePlaywrightBrowsers();

const app = express();
const port = 3001;

app.use(cors());
app.use(express.json());

// Serve React UI build files
app.use(express.static(path.join(__dirname, "ui", "dist")));

const searchService = new SearchService();

// Repeat search state
let repeatState = {
  isRunning: false,
  shouldStop: false,
  stats: {
    total: 0,
    success: 0,
    failed: 0,
  },
  currentConfig: null,
};

// Function to execute single search
async function executeSingleSearch(hotelName, region) {
  try {
    const result = await searchService.executeAutomationSearching(
      hotelName,
      region
    );
    return result;
  } catch (error) {
    console.error("Search error:", error);
    return false;
  }
}

// Function to run repeat search loop
async function runRepeatSearch() {
  while (repeatState.isRunning && !repeatState.shouldStop) {
    const { hotelName, region } = repeatState.currentConfig;
    repeatState.stats.total++;

    console.log(`Starting search iteration ${repeatState.stats.total}...`);
    const result = await executeSingleSearch(hotelName, region);

    if (result) {
      repeatState.stats.success++;
      console.log(`✓ Search ${repeatState.stats.total} succeeded`);
    } else {
      repeatState.stats.failed++;
      console.log(`✗ Search ${repeatState.stats.total} failed`);
    }
  }

  repeatState.isRunning = false;
  repeatState.shouldStop = false;
  console.log("Repeat search stopped");
}

app.post("/api/search/start", async (req, res) => {
  try {
    const { hotelName, region } = req.body;

    if (!hotelName || !region) {
      return res.status(400).json({
        success: false,
        message: "Missing required parameters: hotelName, region",
      });
    }

    if (repeatState.isRunning) {
      return res.status(400).json({
        success: false,
        message: "Search is already running",
      });
    }

    // Reset stats and start repeat search
    repeatState.isRunning = true;
    repeatState.shouldStop = false;
    repeatState.stats = { total: 0, success: 0, failed: 0 };
    repeatState.currentConfig = { hotelName, region };

    console.log("Starting repeat search with:", { hotelName, region });

    // Start the repeat search in background
    runRepeatSearch();

    res.json({
      success: true,
      message: "Repeat search started",
      stats: repeatState.stats,
    });
  } catch (error) {
    console.error("Error in search start endpoint:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
});

app.post("/api/search/stop", (req, res) => {
  if (!repeatState.isRunning) {
    return res.json({
      success: false,
      message: "No search is currently running",
      stats: repeatState.stats,
    });
  }

  repeatState.shouldStop = true;
  console.log("Stop signal sent, will stop after current search completes");

  res.json({
    success: true,
    message: "Stop signal sent, will complete current search",
    stats: repeatState.stats,
  });
});

app.get("/api/search/stats", (req, res) => {
  res.json({
    isRunning: repeatState.isRunning,
    stats: repeatState.stats,
    currentConfig: repeatState.currentConfig,
  });
});

app.get("/api/health", (req, res) => {
  res.json({ status: "Server is running" });
});

// Serve React UI for all non-API routes
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "ui", "dist", "index.html"));
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
  console.log(`Open http://localhost:${port} in your browser to use the UI`);

  // Auto-open browser on Windows
  if (process.platform === "win32") {
    const { exec } = require("child_process");
    exec(`start http://localhost:${port}`);
  }
});
