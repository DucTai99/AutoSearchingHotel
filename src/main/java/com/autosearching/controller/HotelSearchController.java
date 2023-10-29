package com.autosearching.controller;

import com.autosearching.service.SearchService;
import org.sikuli.script.FindFailed;
import org.sikuli.script.Pattern;
import org.sikuli.script.Screen;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class HotelSearchController {

    @Autowired
    SearchService searchService;

    private static boolean terminateProgram = false;

    @GetMapping(value = "/run-program", produces = MediaType.ALL_VALUE)
    public ResponseEntity<?> executeAutoSearching(@RequestParam String hotelName, @RequestParam String region, @RequestParam int numberPage) {
        System.setProperty("java.awt.headless", "false");
        System.setProperty("webdriver.chrome.driver", "C:\\AutoSearchingHotel\\chromedriver\\chromedriver.exe");

        Screen screen = new Screen();
        Pattern patternHMA = new Pattern("C:\\AutoSearchingHotel\\images\\hma_logo.png");
        Pattern patternChangeIP = new Pattern("C:\\AutoSearchingHotel\\images\\change_ip.png");
        Pattern patternMinimizeIcon = new Pattern("C:\\AutoSearchingHotel\\images\\minimize_icon.png");

        int count = 0;
        int actualFind = 0;
        terminateProgram = false;

        while (!terminateProgram) {
            try {
                Thread.sleep(2000);
                screen.click(patternHMA);
                Thread.sleep(3000);
                screen.click(patternChangeIP);
                Thread.sleep(7000);
                screen.click(patternMinimizeIcon);
                Thread.sleep(7000);

                if (searchService.executeAutomationSearching(hotelName, region, numberPage)) {
                    actualFind++;
                }
                count++;
            } catch (FindFailed e) {
                ResponseEntity.badRequest().body(e);
                terminateProgram = true;
            } catch (InterruptedException e) {
                ResponseEntity.badRequest().body(e);
                terminateProgram = true;
            }
        }
        return ResponseEntity.ok("Tổng số lần chạy là " + count + " lần!\nTổng số lần tự động tìm kiếm khách sạn thành công là " + actualFind + " lần!");
    }

    @GetMapping(value = "/terminate-program")
    public void terminateSearchProgram() {
        terminateProgram = true;
    }
}
