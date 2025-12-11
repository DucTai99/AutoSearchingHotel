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

app.post("/api/search", async (req, res) => {
  try {
    const { hotelName, region } = req.body;

    if (!hotelName || !region) {
      return res.status(400).json({
        success: false,
        message: "Missing required parameters: hotelName, region",
      });
    }

    console.log("Starting automation search with:", {
      hotelName,
      region,
    });

    const result = await searchService.executeAutomationSearching(
      hotelName,
      region
    );

    res.json({
      success: result,
      message: result ? "Hotel found successfully" : "Hotel not found",
    });
  } catch (error) {
    console.error("Error in search endpoint:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
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
