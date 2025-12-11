const { sleep, scrollSmooth } = require("../utils/helpers.js");
const { SELECTORS, TIMEOUTS } = require("../config/constants.js");

class HotelDetailsPage {
  constructor(page) {
    this.page = page;
  }

  async verifyHotelPage() {
    const headerTitle = this.page.locator(SELECTORS.HOTEL_HEADER);
    if (await headerTitle.isVisible({ timeout: TIMEOUTS.SHORT })) {
      const scrollHeight = await this.page.evaluate(
        () => document.documentElement.scrollHeight
      );
      await scrollSmooth(this.page, Math.floor(scrollHeight / 2));
      return true;
    }
    return false;
  }

  async getHotelTitle() {
    const headerTitle = this.page.locator(SELECTORS.HOTEL_HEADER);
    return await headerTitle.textContent();
  }
}

module.exports = HotelDetailsPage;
