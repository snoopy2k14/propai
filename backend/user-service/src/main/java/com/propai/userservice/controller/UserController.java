package com.propai.userservice.controller;

import com.propai.userservice.model.User;
import com.propai.userservice.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController @RequiredArgsConstructor
public class UserController {
    private final UserService svc;

    @PostMapping("/api/v1/auth/register")
    public ResponseEntity<Map<String,Object>> register(@RequestBody Map<String,String> req) {
        return ResponseEntity.status(HttpStatus.CREATED).body(svc.register(
            req.get("firstName"), req.get("lastName"), req.get("email"), req.get("password"),
            User.UserRole.valueOf(req.getOrDefault("role","BUYER"))));
    }

    @PostMapping("/api/v1/auth/login")
    public ResponseEntity<Map<String,Object>> login(@RequestBody Map<String,String> req) {
        return ResponseEntity.ok(svc.login(req.get("email"), req.get("password")));
    }

    @GetMapping("/api/v1/users/{id}")
    public ResponseEntity<User> get(@PathVariable String id) {
        return svc.findById(id).map(ResponseEntity::ok).orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/api/v1/users/{id}")
    public ResponseEntity<User> update(@PathVariable String id, @RequestBody User u) {
        return ResponseEntity.ok(svc.update(id, u));
    }
}
