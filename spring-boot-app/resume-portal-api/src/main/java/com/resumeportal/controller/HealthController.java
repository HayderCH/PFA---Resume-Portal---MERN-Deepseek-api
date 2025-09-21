package com.resumeportal.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*")
public class HealthController {
    
    @GetMapping("/health")
    public ResponseEntity<Map<String, String>> health() {
        Map<String, String> response = new HashMap<>();
        response.put("status", "UP");
        response.put("service", "Resume Portal Spring Boot API");
        response.put("message", "API is working");
        return ResponseEntity.ok(response);
    }
    
    @GetMapping("/")
    public ResponseEntity<Map<String, String>> root() {
        Map<String, String> response = new HashMap<>();
        response.put("message", "Resume Portal Spring Boot API");
        response.put("version", "1.0.0");
        return ResponseEntity.ok(response);
    }
}