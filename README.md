# Hotel Search Automation - Standalone Application

## Quick Start

1. **Configure** the `.env` file (see Configuration section)
2. **Double-click** `booking-automation.exe` to run the application
3. The application will automatically:
   - Check for required browser
   - Install Chromium browser if needed (one-time setup, ~150MB)
   - Start the server
   - Open your default web browser with the UI

## Configuration

Before running the application, edit the `.env` file in the same directory:

```env
# Hotel Search Defaults
HOTEL_NAME='Your Hotel Name'
REGION='Your City'

# Desktop App Integration (Optional)
APP_PATH="C:\\Path\\To\\Your\\App.exe"
BUTTON_X=100
BUTTON_Y=200
```

**Configuration Options:**

- `HOTEL_NAME`: Default hotel name to search for
- `REGION`: Default region/city
- `APP_PATH`: Full path to desktop application to open before each search (optional)
- `BUTTON_X`: X coordinate of button to click in the app (optional)
- `BUTTON_Y`: Y coordinate of button to click in the app (optional)

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

The web interface will open automatically at `http://localhost:3001` with two tabs:

### Configuration Tab

This is where you set up and start your searches:

1. **Hotel Name**: Name of the hotel to search for (defaults from `.env`)
2. **Region**: City or region where the hotel is located (defaults from `.env`)
3. **Mouse Position Tracker**:
   - Move your mouse around the screen
   - Current coordinates are displayed in real-time
   - Click **"Capture Position"** to set button coordinates
4. **Button Coordinates**:
   - `buttonX`: Horizontal position (pixels from left)
   - `buttonY`: Vertical position (pixels from top)
5. Click **"Start Search"** to begin automated repeat searches
6. Click **"Stop Search"** to gracefully stop after the current search completes

### Statistics Tab

View real-time statistics of your search runs:

- **Total Searches**: Number of search attempts completed
- **Successful**: Searches that completed successfully
- **Failed**: Searches that encountered errors

### Desktop App Automation (Optional)

If you configure `APP_PATH`, `BUTTON_X`, and `BUTTON_Y` in the `.env` file, the automation will:

1. Minimize all windows to show the desktop
2. Open the specified desktop application
3. Click at the specified coordinates (useful for activating features before search)
4. Wait for the action to complete
5. Execute the hotel search
6. Close the application
7. Repeat until stopped

**How to capture button coordinates:**

1. Run the application and open the Configuration tab
2. Hover your mouse over the button you want to click in your desktop app
3. Note the X and Y coordinates displayed
4. Click **"Capture Position"** to fill the form
5. Update these values in your `.env` file for permanent configuration

## How It Works

The automation will:

1. Open a fullscreen Chromium browser
2. Navigate to Booking.com
3. Select your specified region
4. Configure random check-in/check-out dates (within the next 2 months)
5. Search for your hotel using infinite scroll
6. Click "Load more results" buttons automatically (up to 5 times)
7. Verify the hotel details page
8. Close and repeat automatically until stopped

Each search completes in 2-5 minutes depending on the number of results.

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

### Desktop App Not Opening

If the optional desktop app integration isn't working:

- Verify `APP_PATH` in `.env` points to a valid `.exe` file
- Use double backslashes in Windows paths: `C:\\Program Files\\App\\app.exe`
- Test the path by pasting it in Windows Explorer
- Make sure the application can be launched normally

### Button Click Not Working

If the automation isn't clicking the correct location:

1. Use the mouse position tracker in the Configuration tab
2. Open your desktop app manually
3. Hover over the button you want to click
4. Note the exact X and Y coordinates
5. Click "Capture Position" to update the form
6. Save these values to your `.env` file
7. Restart the automation

## System Requirements

- **OS**: Windows 10/11 (64-bit)
- **RAM**: 4GB minimum, 8GB recommended
- **Disk Space**: ~500MB (including browser)
- **Internet**: Required for first-time setup and running searches

## Notes

- The application runs a local web server on port 3001
- The browser automation is visible (not headless) so you can see what's happening
- All searches are performed on booking.com in fullscreen mode
- Searches repeat automatically until you click "Stop Search"
- Statistics update in real-time during operation
- The automation uses infinite scroll to find hotels (up to 100 scroll attempts)
- "Load more results" buttons are clicked automatically (maximum 5 times per search)
- Random check-in dates are generated for each search (2, 3, or 7-day stays)
- Desktop app automation is optional and only runs if configured
- Close the command window or press Ctrl+C to stop the server

## Features

- ✅ **Automated Hotel Search**: Searches Booking.com automatically with infinite scroll
- ✅ **Repeat Functionality**: Runs continuously until stopped manually
- ✅ **Real-time Statistics**: Track total, successful, and failed searches
- ✅ **Desktop App Integration**: Optional automation to interact with external applications
- ✅ **Mouse Position Capture**: Visual tool to find exact button coordinates
- ✅ **Environment Configuration**: Centralized settings in `.env` file
- ✅ **Fullscreen Browser**: Maximized window for better visibility
- ✅ **Random Date Generation**: Varies check-in/check-out dates automatically
- ✅ **Smart Scrolling**: Handles "Load more" buttons and infinite scroll
- ✅ **Two-Tab Interface**: Separate Configuration and Statistics views

## Support

If you encounter any issues:

1. Check the console/terminal window for error messages
2. Make sure you completed the first-time setup
3. Verify your `.env` file is properly configured
4. Try running: `npx playwright install chromium`
5. Check the Statistics tab for error patterns
6. Contact the developer with error details
