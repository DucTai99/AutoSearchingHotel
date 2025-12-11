const URLS = {
  BASE_URL: "https://www.booking.com/index.vi.html",
};

const TIMEOUTS = {
  SHORT: 2000,
  MEDIUM: 3000,
  LONG: 5000,
};

const SELECTORS = {
  CLOSE_POPUP: '[aria-label="Bỏ qua phần đăng nhập."]',
  DESTINATION_CONTAINER: '[data-testid="destination-container"]',
  AUTOCOMPLETE_RESULTS: '[data-testid="autocomplete-results-options"]',
  DATE_PICKER: '[aria-controls="flexible-searchboxdatepicker"]',
  FLEXIBLE_DATES_DAYS: '[data-testid="flexible-dates-days"]',
  FLEXIBLE_DATES_DAY: '[data-testid="flexible-dates-day"]',
  FLEXIBLE_DATES_FOOTER: '[data-testid="flexible-dates-footer"]',
  SUBMIT_BUTTON: '[type="submit"]',
  PROPERTY_CARD: '[data-testid="property-card"]',
  TITLE_LINK: '[data-testid="title-link"]',
  NEXT_PAGE: '[aria-label="Trang sau"]',
  ASSERTIVE_LIVE: '[aria-live="assertive"]',
  HOTEL_HEADER: ".pp-header__title",
};

module.exports = { URLS, TIMEOUTS, SELECTORS };
