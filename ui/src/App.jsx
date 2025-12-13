import { useState, useEffect } from "react";
import "./App.css";

function App() {
  const [formData, setFormData] = useState({
    hotelName: "",
    region: "",
  });
  const [isRunning, setIsRunning] = useState(false);
  const [stats, setStats] = useState({
    total: 0,
    success: 0,
    failed: 0,
  });
  const [result, setResult] = useState(null);

  // Load default values from server on mount
  useEffect(() => {
    const loadDefaults = async () => {
      try {
        const response = await fetch("http://localhost:3001/api/config");
        const data = await response.json();
        setFormData({
          hotelName: data.hotelName,
          region: data.region,
        });
      } catch (error) {
        console.error("Failed to load default config:", error);
      }
    };
    loadDefaults();
  }, []);

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

  return (
    <div className="App">
      <div className="container">
        <h1>Hotel Search Automation</h1>
        <p className="subtitle"></p>

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
        </form>

        {(stats.total > 0 || isRunning) && (
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
        )}

        {result && (
          <div className={`result ${result.success ? "success" : "error"}`}>
            <h3>{result.success ? "✓ Success" : "✗ Failed"}</h3>
            <p>{result.message}</p>
            {result.error && <p className="error-detail">{result.error}</p>}
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
