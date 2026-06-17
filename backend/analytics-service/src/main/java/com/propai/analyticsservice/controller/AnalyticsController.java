package com.propai.analyticsservice.controller;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.*;

@RestController @RequestMapping("/api/v1/analytics")
@RequiredArgsConstructor @CrossOrigin(origins = "*")
public class AnalyticsController {

    @GetMapping("/market")
    public ResponseEntity<Map<String, Object>> market(
            @RequestParam(defaultValue = "London") String area,
            @RequestParam(defaultValue = "12m") String period) {
        return ResponseEntity.ok(Map.of("area", area, "period", period,
            "avgSalePrice", 485000, "avgRentPcm", 2100,
            "priceChange", "+2.8%", "demandIndex", 87, "daysOnMarket", 28));
    }

    @GetMapping("/price-index/{postcode}")
    public ResponseEntity<Map<String, Object>> priceIndex(@PathVariable String postcode) {
        return ResponseEntity.ok(Map.of("postcode", postcode,
            "currentIndex", 285.4, "change1y", "+3.0%", "change5y", "+35.8%"));
    }

    @GetMapping("/rental-yield")
    public ResponseEntity<Map<String, Object>> rentalYield(
            @RequestParam String postcode, @RequestParam(defaultValue = "300000") double price) {
        double rent = price * 0.005;
        return ResponseEntity.ok(Map.of("postcode", postcode, "purchasePrice", price,
            "estimatedMonthlyRent", rent, "grossYield", String.format("%.2f%%", (rent * 12 / price) * 100)));
    }
}
