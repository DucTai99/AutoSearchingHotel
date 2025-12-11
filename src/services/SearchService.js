const { chromium } = require("playwright");
const BookingHomePage = require("../pages/BookingHomePage.js");
const HotelDetailsPage = require("../pages/HotelDetailsPage.js");
const { URLS, TIMEOUTS } = require("../config/constants.js");
const { getChromiumPath } = require("../utils/browserSetup.js");

class SearchService {
  async executeAutomationSearching(hotelName, region) {
    let result = false;

    // Optional: Use specific chromium path if available
    const chromiumPath = getChromiumPath();
    if (chromiumPath) {
      console.log(`Using Playwright Chromium at: ${chromiumPath}`);
    }

    const browser = await chromium.launch({
      headless: false,
      args: ["--start-maximized"],
    });
    const context = await browser.newContext({
      viewport: null,
    });
    const page = await context.newPage();

    try {
      await page.goto(URLS.BASE_URL, { waitUntil: "domcontentloaded" });
      await page.waitForTimeout(TIMEOUTS.MEDIUM);

      const homePage = new BookingHomePage(page);

      // Close popup
      await homePage.closePopupIfPresent();
      await page.waitForTimeout(TIMEOUTS.MEDIUM);

      // Select region
      const regionFound = await homePage.selectRegion(region);
      if (!regionFound) {
        await browser.close();
        return false;
      }

      // Configure dates
      await homePage.configureDates();

      // Wait for navigation to search results page
      await page.waitForLoadState("domcontentloaded");
      await page.waitForTimeout(TIMEOUTS.MEDIUM);

      // Search for hotel
      const hotelFound = await homePage.searchForHotel(hotelName);

      if (hotelFound) {
        // Handle new tab/window
        const pages = context.pages();
        // Wait for navigation to search results page
        await page.waitForLoadState("domcontentloaded");
        await page.waitForTimeout(TIMEOUTS.MEDIUM);

        if (pages.length === 2) {
          await pages[1].waitForTimeout(TIMEOUTS.SHORT);
          await pages[0].close();

          const hotelDetailsPage = new HotelDetailsPage(pages[1]);
          result = await hotelDetailsPage.verifyHotelPage();
        }
      }
    } catch (error) {
      console.error("Error during automation:", error);

      // Provide helpful error message if browser not found
      if (error.message && error.message.includes("Executable doesn't exist")) {
        console.error("\n========================================");
        console.error("Chromium browser not found!");
        console.error("Please run: npx playwright install chromium");
        console.error("Or restart the application to auto-install.");
        console.error("========================================\n");
      }

      throw error;
    } finally {
      await browser.close();
    }

    return result;
  }
}

module.exports = SearchService;
