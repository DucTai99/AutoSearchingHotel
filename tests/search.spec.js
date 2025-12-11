import { test, expect } from "@playwright/test";
import SearchService from "../src/services/SearchService";

test.describe("Booking.com Hotel Search", () => {
  test("should find and navigate to hotel", async () => {
    const searchService = new SearchService();

    const hotelName = "Thanh Thanh Hotel";
    const region = "Hue";
    const maxPages = 3;

    const result = await searchService.executeAutomationSearching(
      hotelName,
      region,
      maxPages
    );

    await page.pause();
  });

  test("should return false when region not found", async () => {
    const searchService = new SearchService();

    const result = await searchService.executeAutomationSearching(
      "Thanh Thanh Hotel",
      "Hue",
      1
    );

    await page.pause();
  });
});
