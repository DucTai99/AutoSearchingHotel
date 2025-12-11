import { useState } from "react";
import "./App.css";

function App() {
  const [formData, setFormData] = useState({
    hotelName: "",
    region: "",
    numberPageWillFind: "1",
  });
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);

    try {
      const response = await fetch("http://localhost:3001/api/search", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      setResult(data);
    } catch (error) {
      setResult({
        success: false,
        message: "Failed to connect to server",
        error: error.message,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="App">
      <div className="container">
        <h1>Hotel Search Automation</h1>
        <p className="subtitle">Automated hotel search using Playwright</p>

        <form onSubmit={handleSubmit} className="search-form">
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
              disabled={loading}
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
              placeholder="Enter region (e.g., London, Paris)"
              required
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="numberPageWillFind">
              Number of Pages to Search
            </label>
            <input
              type="number"
              id="numberPageWillFind"
              name="numberPageWillFind"
              value={formData.numberPageWillFind}
              onChange={handleInputChange}
              min="1"
              max="10"
              required
              disabled={loading}
            />
          </div>

          <button type="submit" className="submit-btn" disabled={loading}>
            {loading ? (
              <>
                <span className="spinner"></span>
                Searching...
              </>
            ) : (
              "Start Search"
            )}
          </button>
        </form>

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
