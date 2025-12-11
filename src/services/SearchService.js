const { chromium } = require("playwright");
const BookingHomePage = require("../pages/BookingHomePage.js");
const HotelDetailsPage = require("../pages/HotelDetailsPage.js");
const { sleep } = require("../utils/helpers.js");
const { URLS, TIMEOUTS } = require("../config/constants.js");

class SearchService {
  async executeAutomationSearching(hotelName, region, numberPageWillFind) {
    await sleep(TIMEOUTS.SHORT);
    let result = false;

    const browser = await chromium.launch({ headless: false });
    const context = await browser.newContext();
    const page = await context.newPage();

    try {
      await page.setViewportSize({ width: 1920, height: 1080 });
      await page.goto(URLS.BASE_URL);
      await sleep(TIMEOUTS.MEDIUM);

      const homePage = new BookingHomePage(page);

      // Close popup
      await homePage.closePopupIfPresent();

      // Select region
      const regionFound = await homePage.selectRegion(region);
      if (!regionFound) {
        await browser.close();
        return false;
      }

      // Configure dates
      await homePage.configureDates();

      // Search for hotel
      const hotelFound = await homePage.searchForHotel(
        hotelName,
        numberPageWillFind
      );

      if (hotelFound) {
        // Handle new tab/window
        const pages = context.pages();
        if (pages.length === 2) {
          await sleep(TIMEOUTS.SHORT);
          await pages[0].close();

          const hotelDetailsPage = new HotelDetailsPage(pages[1]);
          result = await hotelDetailsPage.verifyHotelPage();
        }
      }
    } catch (error) {
      console.error("Error during automation:", error);
    } finally {
      await browser.close();
    }

    return result;
  }
}

module.exports = SearchService;
