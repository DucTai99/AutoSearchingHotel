const { sleep, scrollSmooth } = require("../utils/helpers.js");
const { SELECTORS, TIMEOUTS } = require("../config/constants.js");

class BookingHomePage {
  constructor(page) {
    this.page = page;
  }

  async closePopupIfPresent() {
    try {
      const closePopup = this.page.locator(SELECTORS.CLOSE_POPUP);
      if (await closePopup.isVisible({ timeout: TIMEOUTS.SHORT })) {
        await sleep(TIMEOUTS.SHORT);
        await closePopup.click();
      }
    } catch (e) {
      // Popup not present
    }
  }

  async selectRegion(region) {
    const destinationContainer = this.page.locator(
      SELECTORS.DESTINATION_CONTAINER
    );
    if (await destinationContainer.isVisible({ timeout: TIMEOUTS.SHORT })) {
      await sleep(TIMEOUTS.SHORT);
      await destinationContainer.click();

      const autocompleteResults = this.page.locator(
        SELECTORS.AUTOCOMPLETE_RESULTS
      );
      if (await autocompleteResults.isVisible({ timeout: TIMEOUTS.SHORT })) {
        const listItems = autocompleteResults.locator("li");
        const count = await listItems.count();

        for (let i = 0; i < count; i++) {
          const itemText = await listItems.nth(i).textContent();
          const firstLine = itemText.split("\n")[0];
          if (firstLine.toLowerCase() === region.toLowerCase()) {
            await sleep(TIMEOUTS.SHORT);
            await listItems.nth(i).click();
            return true;
          }
        }
      }
    }
    return false;
  }

  async configureDates() {
    await sleep(1000);
    await scrollSmooth(this.page, 250);

    const datePicker = this.page.locator(SELECTORS.DATE_PICKER);
    if (await datePicker.isVisible({ timeout: TIMEOUTS.SHORT })) {
      await sleep(TIMEOUTS.SHORT);
      await datePicker.click();

      const flexibleDatesDays = this.page.locator(
        SELECTORS.FLEXIBLE_DATES_DAYS
      );
      if (await flexibleDatesDays.isVisible({ timeout: TIMEOUTS.SHORT })) {
        const dateDayButtons = flexibleDatesDays.locator(
          SELECTORS.FLEXIBLE_DATES_DAY
        );
        await sleep(TIMEOUTS.SHORT);
        await dateDayButtons.nth(1).click();

        const regionElement = this.page.locator('[role="region"]');
        if (await regionElement.isVisible({ timeout: TIMEOUTS.SHORT })) {
          const monthItems = regionElement.locator("li");
          await sleep(TIMEOUTS.SHORT);
          await monthItems.nth(0).click();
          await sleep(TIMEOUTS.SHORT);
          await monthItems.nth(1).click();
        }

        const dateFooter = this.page.locator(SELECTORS.FLEXIBLE_DATES_FOOTER);
        if (await dateFooter.isVisible({ timeout: TIMEOUTS.SHORT })) {
          const selectButton = dateFooter.locator(".. >> button").first();
          await sleep(TIMEOUTS.SHORT);
          await selectButton.click();

          const submitButton = this.page.locator(SELECTORS.SUBMIT_BUTTON);
          if (await submitButton.isVisible({ timeout: TIMEOUTS.SHORT })) {
            await sleep(TIMEOUTS.SHORT);
            await submitButton.click();
          }
        }
      }
    }
  }

  async searchForHotel(hotelName, maxPages) {
    let hasHotel = false;
    let pageCount = 1;

    while (pageCount <= maxPages && !hasHotel) {
      await sleep(TIMEOUTS.MEDIUM);

      const assertiveElement = this.page.locator(SELECTORS.ASSERTIVE_LIVE);
      if (await assertiveElement.isVisible({ timeout: TIMEOUTS.SHORT })) {
        const scrollHeight = await this.page.evaluate(
          () => document.documentElement.scrollHeight
        );
        await scrollSmooth(this.page, scrollHeight - 500);

        const hotelCards = this.page.locator(SELECTORS.PROPERTY_CARD);
        const hotelCount = await hotelCards.count();

        for (let i = 0; i < hotelCount; i++) {
          const hotelCard = hotelCards.nth(i);
          const hotelLink = hotelCard.locator(SELECTORS.TITLE_LINK);
          const linkText = await hotelLink.textContent();
          const hotelTitle = linkText.split("\n")[0];

          if (hotelTitle.toLowerCase() === hotelName.toLowerCase()) {
            hasHotel = true;
            await hotelLink.scrollIntoViewIfNeeded();
            await sleep(TIMEOUTS.SHORT);
            await hotelLink.click();
            return true;
          }
        }

        if (!hasHotel) {
          const nextButton = this.page.locator(SELECTORS.NEXT_PAGE);
          if (await nextButton.isVisible({ timeout: 1000 })) {
            await sleep(1000);
            await nextButton.click();
            pageCount++;
          } else {
            break;
          }
        }
      }
    }

    return hasHotel;
  }
}

module.exports = BookingHomePage;
