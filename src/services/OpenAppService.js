const {
  keyboard,
  Key,
  mouse,
  screen,
  Button,
} = require("@nut-tree-fork/nut-js");
const { exec } = require("child_process");
const { sleep } = require("../utils/helpers.js");
const { TIMEOUTS } = require("../config/constants.js");

class OpenAppService {
  constructor() {
    // Configure nut.js settings
    screen.config.autoHighlight = false;
    screen.config.highlightDurationMs = 500;
    screen.config.highlightOpacity = 0.5;
  }

  /**
   * Open an application by its executable path or name
   * @param {string} appPath - Full path to the executable or app name
   * @param {number} waitTime - Time to wait for app to open (ms)
   */
  async openApplication(appPath, waitTime = TIMEOUTS.MEDIUM) {
    try {
      console.log(`Opening application: ${appPath}`);

      // Execute the application
      exec(`start "" "${appPath}"`);

      // Wait for application to open
      await sleep(waitTime);

      console.log("Application opened successfully");
      return true;
    } catch (error) {
      console.error("Error opening application:", error);
      return false;
    }
  }

  /**
   * Click a button by searching for text on screen
   * @param {string} buttonText - Text to search for
   * @param {number} timeout - Timeout in milliseconds
   */
  async clickButtonByText(buttonText, timeout = TIMEOUTS.LONG) {
    try {
      console.log(`Searching for button with text: ${buttonText}`);

      const startTime = Date.now();

      // Try to find and click the button
      while (Date.now() - startTime < timeout) {
        try {
          // Take a screenshot and search for text
          const textRegion = await screen.find(buttonText);

          if (textRegion) {
            console.log(
              `Found button at position: ${textRegion.left}, ${textRegion.top}`
            );

            // Move mouse to the center of the region and click
            await mouse.setPosition({
              x: textRegion.left + textRegion.width / 2,
              y: textRegion.top + textRegion.height / 2,
            });
            await mouse.click(Button.LEFT);

            console.log("Button clicked successfully");
            return true;
          }
        } catch (searchError) {
          // Button not found yet, continue searching
        }

        await sleep(TIMEOUTS.SHORT);
      }

      console.log("Button not found within timeout");
      return false;
    } catch (error) {
      console.error("Error clicking button:", error);
      return false;
    }
  }

  /**
   * Click at specific coordinates
   * @param {number} x - X coordinate
   * @param {number} y - Y coordinate
   */
  async clickAtPosition(x, y) {
    try {
      console.log(`Clicking at position: ${x}, ${y}`);
      await sleep(TIMEOUTS.SHORT);
      await mouse.setPosition({ x, y });
      await sleep(TIMEOUTS.SHORT);
      await mouse.click(Button.LEFT);

      console.log("Position clicked successfully");
      await sleep(TIMEOUTS.LONG);
      return true;
    } catch (error) {
      console.error("Error clicking position:", error);
      return false;
    }
  }

  /**
   * Type text using keyboard
   * @param {string} text - Text to type
   */
  async typeText(text) {
    try {
      console.log(`Typing text: ${text}`);

      await keyboard.type(text);

      console.log("Text typed successfully");
      return true;
    } catch (error) {
      console.error("Error typing text:", error);
      return false;
    }
  }

  /**
   * Press a specific key
   * @param {Key} key - Key to press from nut.js Key enum
   */
  async pressKey(key) {
    try {
      console.log(`Pressing key: ${key}`);

      await keyboard.pressKey(key);
      await keyboard.releaseKey(key);

      console.log("Key pressed successfully");
      return true;
    } catch (error) {
      console.error("Error pressing key:", error);
      return false;
    }
  }

  /**
   * Focus on desktop (minimize all windows)
   */
  async goToDesktop() {
    try {
      // Press Windows + D to show desktop
      await keyboard.pressKey(Key.LeftSuper);
      await keyboard.pressKey(Key.D);
      await keyboard.releaseKey(Key.D);
      await keyboard.releaseKey(Key.LeftSuper);

      await sleep(TIMEOUTS.SHORT);

      return true;
    } catch (error) {
      console.error("Error going to desktop:", error);
      return false;
    }
  }

  /**
   * Get screen size
   */
  async getScreenSize() {
    try {
      const { width } = await screen.width();
      return { width, height: await screen.height() };
    } catch (error) {
      console.error("Error getting screen size:", error);
      return null;
    }
  }

  /**
   * Close an application by its window title or process name
   * @param {string} appName - Application name or window title
   */
  async closeApplication(appName) {
    try {
      console.log(`Closing application: ${appName}`);

      // Use taskkill to close the application
      const { exec } = require("child_process");
      const processName = appName.includes(".exe") ? appName : `${appName}.exe`;

      exec(`taskkill /F /IM ${processName}`, (error, stdout) => {
        if (error) {
          console.error(`Error closing app: ${error.message}`);
          return;
        }
        console.log(`Application closed: ${stdout}`);
      });

      await sleep(TIMEOUTS.SHORT);
      return true;
    } catch (error) {
      console.error("Error closing application:", error);
      return false;
    }
  }
}

module.exports = OpenAppService;
