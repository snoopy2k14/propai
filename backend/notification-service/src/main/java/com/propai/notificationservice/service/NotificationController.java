package com.propai.notificationservice.service;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.Map;

@RestController @RequestMapping("/api/v1/notifications") @CrossOrigin(origins = "*")
public class NotificationController {
    @GetMapping("/health")
    public ResponseEntity<Map<String,String>> health() {
        return ResponseEntity.ok(Map.of("status","UP","service","notification-service"));
    }
}
