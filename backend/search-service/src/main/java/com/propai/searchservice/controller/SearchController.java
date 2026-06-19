package com.propai.searchservice.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController @RequestMapping("/api/v1/search")
public class SearchController {

    @GetMapping
    public ResponseEntity<Map<String, Object>> search(
            @RequestParam String q,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        return ResponseEntity.ok(Map.of("query", q, "page", page, "size", size, "results", List.of(), "total", 0));
    }

    @GetMapping("/suggest")
    public ResponseEntity<List<String>> suggest(@RequestParam String q) {
        return ResponseEntity.ok(List.of(q + " - London", q + " - Manchester", q + " - Birmingham", q + " - Leeds"));
    }

    @GetMapping("/area-insights/{area}")
    public ResponseEntity<Map<String, Object>> areaInsights(@PathVariable String area) {
        return ResponseEntity.ok(Map.of("area", area, "avgPrice", 350000, "priceChange12m", "+3.2%", "avgRentPcm", 1800));
    }
}
