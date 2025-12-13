import { useState, useEffect } from "react";
import "./App.css";

function App() {
  const [activeTab, setActiveTab] = useState("form");
  const [formData, setFormData] = useState({
    hotelName: "",
    region: "",
    buttonX: "",
    buttonY: "",
  });
  const [isRunning, setIsRunning] = useState(false);
  const [stats, setStats] = useState({
    total: 0,
    success: 0,
    failed: 0,
  });
  const [result, setResult] = useState(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  // Load default values from server on mount
  useEffect(() => {
    const loadDefaults = async () => {
      try {
        const response = await fetch("http://localhost:3001/api/config");
        const data = await response.json();
        setFormData((prev) => ({
          ...prev,
          hotelName: data.hotelName,
          region: data.region,
          buttonX: data.buttonX || "",
          buttonY: data.buttonY || "",
        }));
      } catch (error) {
        console.error("Failed to load default config:", error);
      }
    };
    loadDefaults();
  }, []);

  // Track mouse position
  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.screenX, y: e.screenY });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  // Handle Ctrl+Click for position capture
  useEffect(() => {
    const handleClick = (e) => {
      if (e.ctrlKey && activeTab === "capture" && !isRunning) {
        handleCapturePosition();
      }
    };
    window.addEventListener("click", handleClick);
    return () => window.removeEventListener("click", handleClick);
  }, [activeTab, mousePosition, isRunning]);

  // Poll for stats when search is running
  useEffect(() => {
    if (!isRunning) return;

    const interval = setInterval(async () => {
      try {
        const response = await fetch("http://localhost:3001/api/search/stats");
        const data = await response.json();
        setStats(data.stats);
        setIsRunning(data.isRunning);
      } catch (error) {
        console.error("Failed to fetch stats:", error);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [isRunning]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleStart = async (e) => {
    e.preventDefault();
    setResult(null);

    try {
      const response = await fetch("http://localhost:3001/api/search/start", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      if (data.success) {
        setIsRunning(true);
        setStats(data.stats);
        setResult({
          success: true,
          message: "Repeat search started successfully",
        });
      } else {
        setResult(data);
      }
    } catch (error) {
      setResult({
        success: false,
        message: "Failed to connect to server",
        error: error.message,
      });
    }
  };

  const handleStop = async () => {
    try {
      const response = await fetch("http://localhost:3001/api/search/stop", {
        method: "POST",
      });

      const data = await response.json();
      setResult({
        success: data.success,
        message: data.message,
      });
    } catch (error) {
      setResult({
        success: false,
        message: "Failed to stop search",
        error: error.message,
      });
    }
  };

  const handleCapturePosition = () => {
    setFormData((prev) => ({
      ...prev,
      buttonX: mousePosition.x.toString(),
      buttonY: mousePosition.y.toString(),
    }));
    setResult({
      success: true,
      message: `Position captured: X=${mousePosition.x}, Y=${mousePosition.y}`,
    });
  };

  return (
    <div className="App">
      <div className="container">
        <h1>Hotel Search Automation</h1>

        <div className="tabs">
          <button
            className={`tab ${activeTab === "form" ? "active" : ""}`}
            onClick={() => setActiveTab("form")}
          >
            Configuration
          </button>
          <button
            className={`tab ${activeTab === "capture" ? "active" : ""}`}
            onClick={() => setActiveTab("capture")}
          >
            Capture Button
          </button>
          <button
            className={`tab ${activeTab === "stats" ? "active" : ""}`}
            onClick={() => setActiveTab("stats")}
          >
            Statistics
          </button>
        </div>

        {activeTab === "form" && (
          <form onSubmit={handleStart} className="search-form">
            <div className="form-group">
              <label htmlFor="hotelName">Hotel Name</label>
              <input
                type="text"
                id="hotelName"
                name="hotelName"
                value={formData.hotelName}
                onChange={handleInputChange}
                placeholder="Enter hotel name"
                required
                disabled={isRunning}
              />
            </div>

            <div className="form-group">
              <label htmlFor="region">Region</label>
              <input
                type="text"
                id="region"
                name="region"
                value={formData.region}
                onChange={handleInputChange}
                placeholder="Enter region (e.g., Đà Lạt, Huế)"
                required
                disabled={isRunning}
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="buttonX">Button X Position</label>
                <input
                  type="number"
                  id="buttonX"
                  name="buttonX"
                  value={formData.buttonX}
                  onChange={handleInputChange}
                  placeholder="X coordinate"
                  required
                  disabled={isRunning}
                />
              </div>

              <div className="form-group">
                <label htmlFor="buttonY">Button Y Position</label>
                <input
                  type="number"
                  id="buttonY"
                  name="buttonY"
                  value={formData.buttonY}
                  onChange={handleInputChange}
                  placeholder="Y coordinate"
                  required
                  disabled={isRunning}
                />
              </div>
            </div>

            <div className="button-group">
              <button type="submit" className="submit-btn" disabled={isRunning}>
                {isRunning ? (
                  <>
                    <span className="spinner"></span>
                    Running...
                  </>
                ) : (
                  "Start Search"
                )}
              </button>

              {isRunning && (
                <button type="button" className="stop-btn" onClick={handleStop}>
                  Stop After Current
                </button>
              )}
            </div>
            {result && (
              <div className={`result ${result.success ? "success" : "error"}`}>
                <h3>{result.success ? "✓ Success" : "✗ Failed"}</h3>
                <p>{result.message}</p>
                {result.error && <p className="error-detail">{result.error}</p>}
              </div>
            )}
          </form>
        )}

        {activeTab === "capture" && (
          <div className="capture-view">
            <h3>Capture Button Position</h3>
            <p className="capture-instructions">
              Move your mouse over the button in your desktop application that
              you want to click. The coordinates will update in real-time below.
            </p>

            <div className="position-capture">
              <div className="mouse-position-large">
                <div className="coordinate">
                  <span className="coordinate-label">X:</span>
                  <span className="coordinate-value">{mousePosition.x}</span>
                </div>
                <div className="coordinate">
                  <span className="coordinate-label">Y:</span>
                  <span className="coordinate-value">{mousePosition.y}</span>
                </div>
              </div>

              <div className="capture-hint">
                <span className="hint-icon">⌨️</span>
                <p>
                  <strong>Ctrl + Click</strong> anywhere to capture current
                  position
                </p>
              </div>

              {formData.buttonX && formData.buttonY && (
                <div className="captured-position">
                  <p>✓ Captured Position:</p>
                  <p>
                    <strong>
                      X = {formData.buttonX}, Y = {formData.buttonY}
                    </strong>
                  </p>
                  <p className="hint">
                    Remember to save these values to your .env file
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === "stats" && (
          <div className="stats-view">
            {stats.total > 0 || isRunning ? (
              <div className="stats-container">
                <h3>Statistics</h3>
                <div className="stats-grid">
                  <div className="stat-item">
                    <span className="stat-label">Total Runs:</span>
                    <span className="stat-value">{stats.total}</span>
                  </div>
                  <div className="stat-item success">
                    <span className="stat-label">Success:</span>
                    <span className="stat-value">{stats.success}</span>
                  </div>
                  <div className="stat-item failed">
                    <span className="stat-label">Failed:</span>
                    <span className="stat-value">{stats.failed}</span>
                  </div>
                </div>
                {isRunning && (
                  <div className="status-indicator">
                    <span className="pulse"></span>
                    <span>Search is running...</span>
                  </div>
                )}
              </div>
            ) : (
              <div className="no-stats">
                <p>No statistics available. Start a search to see results.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
