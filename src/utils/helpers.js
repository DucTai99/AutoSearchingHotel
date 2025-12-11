async function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function scrollSmooth(page, scrollView) {
  const steps = Math.floor(scrollView / 2);
  for (let i = 0; i < steps; i++) {
    await sleep(1);
    await page.evaluate(() => window.scrollBy(0, 2));
  }
}

async function isElementVisible(page, selector, timeout = 2000) {
  try {
    await page.locator(selector).waitFor({ state: "visible", timeout });
    return true;
  } catch (e) {
    return false;
  }
}

module.exports = { sleep, scrollSmooth, isElementVisible };
