package com.propai.userservice.exception;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.time.Instant;
import java.util.LinkedHashMap;
import java.util.Map;

/**
 * Catches RuntimeExceptions thrown from the service layer and maps them to
 * appropriate HTTP status codes with a clean JSON body, instead of letting
 * Spring Security's default uncaught-exception handling turn everything
 * into a 403.
 */
@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(RuntimeException.class)
    public ResponseEntity<Map<String, Object>> handleRuntimeException(RuntimeException ex) {
        String message = ex.getMessage() == null ? "" : ex.getMessage();

        HttpStatus status;
        if (message.equalsIgnoreCase("Invalid credentials")) {
            status = HttpStatus.UNAUTHORIZED;
        } else if (message.equalsIgnoreCase("Not found")) {
            status = HttpStatus.NOT_FOUND;
        } else if (message.equalsIgnoreCase("Email already registered")) {
            status = HttpStatus.CONFLICT;
        } else {
            status = HttpStatus.BAD_REQUEST;
        }

        Map<String, Object> body = new LinkedHashMap<>();
        body.put("timestamp", Instant.now().toString());
        body.put("status", status.value());
        body.put("error", status.getReasonPhrase());
        body.put("message", message);

        return ResponseEntity.status(status).body(body);
    }
}