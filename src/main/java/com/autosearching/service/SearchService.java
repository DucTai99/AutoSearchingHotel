package com.autosearching.service;

import org.openqa.selenium.WebDriver;

public interface SearchService {

    boolean executeAutomationSearching(String hotelName, String region, int numberPageWillFind) throws InterruptedException;
}
