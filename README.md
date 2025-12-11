# Hotel Search Automation - Standalone Application

## Quick Start

1. **Download** the `booking-automation.exe` file
2. **Double-click** to run the application
3. The application will automatically:
   - Check for required browser
   - Install Chromium browser if needed (one-time setup, ~150MB)
   - Start the server
   - Open your default web browser with the UI

## First Time Setup

When you run the application for the first time, it will automatically download and install the Chromium browser. This is a one-time process that may take 2-5 minutes depending on your internet connection.

**What happens:**

```
Checking Playwright browsers...
Installing Chromium browser...
This is a one-time setup and may take a few minutes.
[Download progress will be shown]
✓ Chromium browser installed successfully!
Server is running on http://localhost:3001
```

## Manual Installation (If Auto-Install Fails)

If the automatic installation doesn't work, you can install the browser manually:

1. **Install Node.js** (if not already installed):

   - Download from: https://nodejs.org/
   - Choose LTS version

2. **Install Playwright Chromium**:

   - Open Command Prompt (cmd) or PowerShell
   - Run: `npx playwright install chromium`
   - Wait for download to complete

3. **Run the application** again

## Usage

1. Once the server starts, your browser will open to `http://localhost:3001`
2. Fill in the form:
   - **Hotel Name**: Name of the hotel you're searching for
   - **Region**: City or region (e.g., "London", "Paris")
   - **Number of Pages**: How many pages to search (1-10)
3. Click **"Start Search"**
4. The automation will run in a visible browser window
5. Wait for the result to appear

## Troubleshooting

### Browser Not Found Error

If you see: `Executable doesn't exist at ...`

**Solution**: Run this command in Command Prompt:

```
npx playwright install chromium
```

### Port Already in Use

If port 3001 is already in use:

- Close any other applications using that port
- Or restart your computer

### Application Won't Start

- Make sure you have internet connection (for first-time setup)
- Check Windows Firewall isn't blocking the application
- Run as Administrator if needed

## System Requirements

- **OS**: Windows 10/11 (64-bit)
- **RAM**: 4GB minimum, 8GB recommended
- **Disk Space**: ~500MB (including browser)
- **Internet**: Required for first-time setup and running searches

## Notes

- The application runs a local web server on port 3001
- The browser automation is visible (not headless) so you can see what's happening
- All searches are performed on booking.com
- Close the command window or press Ctrl+C to stop the server

## Support

If you encounter any issues:

1. Check the console/terminal window for error messages
2. Make sure you completed the first-time setup
3. Try running: `npx playwright install chromium`
4. Contact the developer with error details
