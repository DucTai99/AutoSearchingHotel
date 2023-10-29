package com.autosearching.service.impl;

import com.autosearching.service.SearchService;
import org.apache.commons.lang3.StringUtils;
import org.openqa.selenium.By;
import org.openqa.selenium.JavascriptExecutor;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.chrome.ChromeDriver;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class SearchServiceImpl implements SearchService {

    @Override
    public boolean executeAutomationSearching(String hotelName, String region, int numberPageWillFind) throws InterruptedException {
        Thread.sleep(2000);
        boolean result = false;
        WebDriver driver = new ChromeDriver();
        driver.manage().window().maximize();
        driver.get("https://www.booking.com/index.vi.html");
        Thread.sleep(3000);
        // turnoff popup
        if (isElementPresent(driver, By.cssSelector("[aria-label='Bỏ qua phần đăng nhập.']"))) {
            WebElement buttonPopUp = driver.findElement(By.cssSelector("[aria-label='Bỏ qua phần đăng nhập.']"));
            Thread.sleep(2000);
            buttonPopUp.click();
        }

        if (isElementPresent(driver, By.cssSelector("[data-testid='destination-container']"))) {
            WebElement destinationContainer = driver.findElement(By.cssSelector("[data-testid='destination-container']"));
            Thread.sleep(2000);
            destinationContainer.click();
            if (isElementPresent(driver, By.cssSelector("[data-testid='destination-container']"))) {
                WebElement ulDestinationNames = driver.findElement(By.cssSelector("[data-testid='autocomplete-results-options']"));
                List<WebElement> liDestinationNames = ulDestinationNames.findElements(By.tagName("li"));
                boolean isFindRegion = false;
                for (WebElement liElement : liDestinationNames) {
                    if (StringUtils.equalsIgnoreCase(liElement.getText().split("\n")[0], region)) {
                        Thread.sleep(2000);
                        liElement.click();
                        isFindRegion = true;
                        break;
                    }
                }
                if (!isFindRegion) {
                    driver.close();
                    return false;
                }
                Thread.sleep(1000);
                scrollSmooth(driver, 250);
                if (isElementPresent(driver, By.cssSelector("[aria-controls='flexible-searchboxdatepicker']"))) {
                    WebElement datePicker = driver.findElement(By.cssSelector("[aria-controls='flexible-searchboxdatepicker']"));
                    Thread.sleep(2000);
                    datePicker.click();
                    if (isElementPresent(driver, By.cssSelector("[data-testid='flexible-dates-days']"))) {
                        WebElement dateDays = driver.findElement(By.cssSelector("[data-testid='flexible-dates-days']"));
                        List<WebElement> listDateDay = dateDays.findElements(By.cssSelector("[data-testid='flexible-dates-day']"));
                        Thread.sleep(2000);
                        listDateDay.get(1).click();
                        if (isElementPresent(driver, By.cssSelector("[role='region']"))) {
                            List<WebElement> liMonths = driver.findElement(By.cssSelector("[role='region']")).findElements(By.tagName("li"));
                            Thread.sleep(2000);
                            liMonths.get(0).click();
                            Thread.sleep(2000);
                            liMonths.get(1).click();
                        }
                        if (isElementPresent(driver, By.cssSelector("[data-testid='flexible-dates-footer']"))) {
                            WebElement dateFooter = driver.findElement(By.cssSelector("[data-testid='flexible-dates-footer']"));
                            WebElement divParentFooter = dateFooter.findElement(By.xpath("./.."));
                            WebElement selectButtonFooter = divParentFooter.findElement(By.tagName("button"));
                            Thread.sleep(2000);
                            selectButtonFooter.click();
                            if (isElementPresent(driver, By.cssSelector("[type='submit']"))) {
                                WebElement submitButton = driver.findElement(By.cssSelector("[type='submit']"));
                                Thread.sleep(2000);
                                submitButton.click();
                            }
                        }
                    }
                }
            }
        }
        boolean hasHotel = false;
        int count = 1;
        while (count <= numberPageWillFind && !hasHotel) {
            Thread.sleep(3000);
            if (isElementPresent(driver, By.cssSelector("[aria-live='assertive']"))) {
                JavascriptExecutor javascriptExecutor = (JavascriptExecutor) driver;
                long scrollHeight = (long) javascriptExecutor.executeScript("return document.documentElement.scrollHeight");
                scrollSmooth(driver, scrollHeight - 500);
                List<WebElement> listHotel = driver.findElements(By.cssSelector("[data-testid='property-card']"));
                for (WebElement hotel : listHotel) {
                    WebElement hotelLink = hotel.findElement(By.cssSelector("[data-testid='title-link']"));
                    if (StringUtils.equalsIgnoreCase(hotelLink.getText().split("\n")[0], hotelName)) {
                        hasHotel = true;
                        ((JavascriptExecutor) driver).executeScript("arguments[0].scrollIntoView(true);", hotelLink);
                        Thread.sleep(2000);
                        hotelLink.click();
                        break;
                    }
                }
                if (!hasHotel && isElementPresent(driver, By.cssSelector("[aria-label='Trang sau']"))) {
                    WebElement nextButton = driver.findElement(By.cssSelector("[aria-label='Trang sau']"));
                    Thread.sleep(1000);
                    nextButton.click();
                    count++;
                }
            }
        }
        List<String> handles = new ArrayList<>(driver.getWindowHandles());
        if (handles.size() == 2) {
            Thread.sleep(2000);
            driver.close();
            driver.switchTo().window(handles.get(1));
            if (isElementPresent(driver, By.className("pp-header__title"))) {
                result = true;
                JavascriptExecutor javascriptExecutor = (JavascriptExecutor) driver;
                long scrollHeight = (long) javascriptExecutor.executeScript("return document.documentElement.scrollHeight");
                scrollSmooth(driver, (int) scrollHeight / 2);
            }
        }
        driver.close();
        return result;
    }

    private boolean isElementPresent(WebDriver driver, By locatorKey) {
        try {
            driver.findElement(locatorKey);
            return true;
        } catch (org.openqa.selenium.NoSuchElementException e) {
            return false;
        }
    }

    private void scrollSmooth(WebDriver driver, long scrollView) throws InterruptedException {
        for (long i = 0; i < scrollView / 2; i++) {
            Thread.sleep(1);
            ((JavascriptExecutor) driver).executeScript("window.scrollBy(0,2)", "");
        }
    }
}
