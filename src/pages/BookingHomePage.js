const { scrollSmooth } = require("../utils/helpers.js");
const { SELECTORS, TIMEOUTS } = require("../config/constants.js");

class BookingHomePage {
  constructor(page) {
    this.page = page;
  }

  async closePopupIfPresent() {
    try {
      await this.page.waitForTimeout(TIMEOUTS.SHORT);
      const closeButton = this.page.getByLabel("Bỏ qua phần đăng nhập");
      await closeButton.waitFor({ state: "visible", timeout: 5000 });
      await closeButton.click();
    } catch (error) {
      console.log("Popup not found or already closed, continuing...");
    }
  }

  async selectRegion(region) {
    try {
      const destination = await this.page.getByLabel("Bạn muốn đến đâu?");
      await destination.click();
      await this.page.waitForTimeout(TIMEOUTS.SHORT);
      await destination.pressSequentially(region, { delay: 1000 });
      await this.page.waitForTimeout(TIMEOUTS.SHORT);

      // Wait for autocomplete results and click the first option
      const firstOption = this.page
        .locator('[data-testid="autocomplete-results-options"] li')
        .first();
      await firstOption.waitFor({ state: "visible", timeout: 5000 });
      await firstOption.click();

      await this.page.waitForTimeout(TIMEOUTS.SHORT);
      return true;
    } catch (error) {
      return false;
    }
  }

  async configureDates() {
    // Random number of days: 2, 3, or 7
    const daysOptions = [2, 3, 7];
    const randomDays =
      daysOptions[Math.floor(Math.random() * daysOptions.length)];
    const checkInDate = this.getRandomDateInRange();
    const checkOutDate = new Date(checkInDate);
    checkOutDate.setDate(checkInDate.getDate() + randomDays);

    console.log(`Check-in: ${this.formatVietnameseDate(checkInDate)}`);
    console.log(
      `Check-out: ${this.formatVietnameseDate(
        checkOutDate
      )} (${randomDays} days)`
    );

    await this.page
      .getByRole("button", { name: this.formatVietnameseDate(checkInDate) })
      .click();
    await this.page.waitForTimeout(TIMEOUTS.SHORT);
    await this.page
      .getByRole("button", { name: this.formatVietnameseDate(checkOutDate) })
      .click();
    await this.page.waitForTimeout(TIMEOUTS.SHORT);
    await this.page.getByTestId("occupancy-config").click();
    await this.page.waitForTimeout(TIMEOUTS.SHORT);
    await this.page.getByRole("button", { name: "Xong" }).click();
    await this.page.waitForTimeout(TIMEOUTS.SHORT);
    await this.page.getByRole("button", { name: "Tìm" }).click();
  }

  async searchForHotel(hotelName) {
    let hasHotel = false;
    let scrollAttempts = 0;
    let loadMoreClicks = 0;
    const maxScrollAttempts = 100; // Maximum scroll attempts for infinity scroll
    const maxLoadMoreClicks = 5; // Maximum times to click "Load more" button

    while (scrollAttempts < maxScrollAttempts && !hasHotel) {
      // Check if hotel exists in current view
      const hotelTitle = this.page.locator(
        `[data-testid="title"]:has-text("${hotelName}")`
      );

      if (await hotelTitle.isVisible({ timeout: 1000 }).catch(() => false)) {
        hasHotel = true;
        await hotelTitle.scrollIntoViewIfNeeded();
        await this.page.waitForTimeout(TIMEOUTS.SHORT);

        // Find and click the parent hotel card link
        const hotelCard = hotelTitle.locator(
          'xpath=ancestor::div[@data-testid="property-card"]'
        );
        const hotelLink = hotelCard.locator(SELECTORS.TITLE_LINK);
        await hotelLink.click();
        return true;
      }

      // Check for "Load more results" button
      const loadMoreButton = this.page.getByRole("button", {
        name: "Tải thêm kết quả",
      });
      if (
        await loadMoreButton.isVisible({ timeout: 1000 }).catch(() => false)
      ) {
        if (loadMoreClicks < maxLoadMoreClicks) {
          console.log(
            `Clicking 'Load more results' button (${
              loadMoreClicks + 1
            }/${maxLoadMoreClicks})`
          );
          await loadMoreButton.click();
          loadMoreClicks++;
          await this.page.waitForTimeout(TIMEOUTS.LONG); // Wait for new content to load
          continue; // Skip scrolling and check for hotel again
        } else {
          console.log("Reached maximum load more clicks, hotel not found");
          break;
        }
      }

      // Scroll down smoothly to load more hotels (infinity scroll)
      await scrollSmooth(this.page, 800);
      await this.page.waitForTimeout(1500); // Wait for new content to load

      scrollAttempts++;

      // Check if we've reached the bottom
      const isAtBottom = await this.page.evaluate(() => {
        return (
          window.innerHeight + window.scrollY >=
          document.documentElement.scrollHeight - 100
        );
      });

      if (isAtBottom) {
        console.log("Reached bottom of page, hotel not found");
        break;
      }
    }

    return hasHotel;
  }

  getRandomDateInRange() {
    const today = new Date();
    const endOfNextMonth = new Date(
      today.getFullYear(),
      today.getMonth() + 2,
      0
    );
    endOfNextMonth.setDate(endOfNextMonth.getDate() - 23);

    // Random date between today and end of next month (minus 23 days)
    const randomTime =
      today.getTime() +
      Math.random() * (endOfNextMonth.getTime() - today.getTime());
    const randomDate = new Date(randomTime);

    return randomDate;
  }

  formatVietnameseDate(date) {
    const daysOfWeek = ["CN", "T2", "T3", "T4", "T5", "T6", "T7"];
    const dayOfWeek = daysOfWeek[date.getDay()];
    const day = date.getDate();
    const month = date.getMonth() + 1;

    return `${dayOfWeek} ${day} tháng ${month}`;
  }
}

module.exports = BookingHomePage;
