package com.propai.enquiryservice.controller;

import com.propai.enquiryservice.model.Enquiry;
import com.propai.enquiryservice.service.EnquiryService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
@RequiredArgsConstructor
@RestController @RequestMapping("/api/v1/enquiries")
public class EnquiryController {
    private final EnquiryService svc;

    @PostMapping
    public ResponseEntity<Enquiry> create(@RequestBody Enquiry e) {
        return ResponseEntity.status(HttpStatus.CREATED).body(svc.create(e));
    }

    @GetMapping("/property/{propertyId}")
    public ResponseEntity<List<Enquiry>> byProperty(@PathVariable String propertyId) {
        return ResponseEntity.ok(svc.getByProperty(propertyId));
    }

    @GetMapping("/my")
    public ResponseEntity<List<Enquiry>> byUser(@RequestHeader("X-User-Id") String userId) {
        return ResponseEntity.ok(svc.getByUser(userId));
    }

    @PatchMapping("/{id}/read")
    public ResponseEntity<Enquiry> markRead(@PathVariable String id) {
        return ResponseEntity.ok(svc.markRead(id));
    }
}
