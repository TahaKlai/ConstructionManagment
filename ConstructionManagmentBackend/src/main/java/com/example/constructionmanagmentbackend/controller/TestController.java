package com.example.constructionmanagmentbackend.controller;

import com.example.constructionmanagmentbackend.repository.ProjectRepository;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.env.Environment;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/test")
@Tag(name = "Test API", description = "Endpoints for testing and monitoring the application")
public class TestController {

    @Autowired
    private Environment environment;

    @Autowired
    private ProjectRepository projectRepository;

    @PostMapping("/login")
    @Operation(summary = "Test login endpoint")
    public ResponseEntity<String> testLogin(@RequestBody String loginRequest) {
        // Return a mock JWT token for testing
        String mockToken = "eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1c2VyIiwiaWF0IjoxNzI3NzMwMzU5LCJleHAiOjE3Mjc4MTY3NTl9.test";
        return ResponseEntity.ok("{\"token\":\"" + mockToken + "\"}");
    }

    @GetMapping("/suppliers")
    @Operation(summary = "Test suppliers endpoint")
    public ResponseEntity<String> getTestSuppliers() {
        String json = "[" +
            "{\"id\":1,\"name\":\"Dutch Building Supplies\",\"contactPerson\":\"Jan de Vries\",\"email\":\"info@dbsupplies.nl\",\"phone\":\"+31 20 123 4567\",\"address\":\"Amsterdam\"}," +
            "{\"id\":2,\"name\":\"Rotterdam Steel Works\",\"contactPerson\":\"Pieter Bakker\",\"email\":\"sales@rsteel.nl\",\"phone\":\"+31 10 987 6543\",\"address\":\"Rotterdam\"}" +
            "]";
        return ResponseEntity.ok()
                .header("Content-Type", "application/json")
                .body(json);
    }

    @GetMapping("/tasks")
    @Operation(summary = "Test tasks endpoint")
    public ResponseEntity<String> getTestTasks() {
        String json = "[" +
            "{\"id\":1,\"name\":\"Site Preparation\",\"description\":\"Clear site and prepare foundation\",\"status\":\"Completed\",\"completionPercentage\":100,\"projectId\":1,\"milestone\":false,\"duration\":14}," +
            "{\"id\":2,\"name\":\"Foundation Installation\",\"description\":\"Install foundation structure\",\"status\":\"In Progress\",\"completionPercentage\":65,\"projectId\":1,\"milestone\":false,\"duration\":30}" +
            "]";
        return ResponseEntity.ok()
                .header("Content-Type", "application/json")
                .body(json);
    }

    @GetMapping("/health")
    @Operation(summary = "Health check endpoint", description = "Returns detailed health information about the service")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Service is running properly"),
            @ApiResponse(responseCode = "500", description = "Service has issues")
    })
    public ResponseEntity<Map<String, Object>> healthCheck() {
        Map<String, Object> response = new HashMap<>();
        response.put("status", "UP");
        response.put("timestamp", LocalDateTime.now());
        response.put("service", "Construction Management API");
        response.put("port", environment.getProperty("server.port"));

        return ResponseEntity.ok(response);
    }

    @GetMapping("/database")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Database check", description = "Performs an actual verification of database connectivity")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Database connection is working"),
            @ApiResponse(responseCode = "500", description = "Database connection failed"),
            @ApiResponse(responseCode = "403", description = "Access forbidden")
    })
    public ResponseEntity<Map<String, Object>> databaseCheck() {
        Map<String, Object> response = new HashMap<>();

        try {
            // Actually check database by executing a simple query
            Long projectCount = projectRepository.count();

            response.put("status", "UP");
            response.put("timestamp", LocalDateTime.now());
            response.put("message", "Database connection is working");
            response.put("projectCount", projectCount);

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            response.put("status", "DOWN");
            response.put("timestamp", LocalDateTime.now());
            response.put("error", e.getMessage());

            return ResponseEntity.status(500).body(response);
        }
    }

    @GetMapping("/info")
    @Operation(summary = "Application info", description = "Returns information about the running application")
    public ResponseEntity<Map<String, Object>> applicationInfo() {
        Map<String, Object> info = new HashMap<>();
        info.put("name", environment.getProperty("spring.application.name"));
        info.put("profile", environment.getActiveProfiles());
        info.put("time", LocalDateTime.now());

        return ResponseEntity.ok(info);
    }

    @GetMapping("/verify-password")
    @Operation(summary = "Password verification test", description = "Tests if the stored password hash matches the expected password")
    public ResponseEntity<Map<String, Object>> verifyPassword() {
        Map<String, Object> result = new HashMap<>();
        
        org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder encoder = 
            new org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder();
        
        String plainPassword = "user123";
        String hashedFromDB = "$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iKWTn.qHvjvKNAhhZGVjv1bo.fcS";
        
        boolean matches = encoder.matches(plainPassword, hashedFromDB);
        
        result.put("plainPassword", plainPassword);
        result.put("hashMatches", matches);
        result.put("hashPrefix", hashedFromDB.substring(0, 20) + "...");
        result.put("timestamp", LocalDateTime.now());
        
        return ResponseEntity.ok(result);
    }

    @GetMapping("/generate-password")
    @Operation(summary = "Generate new password hash", description = "Generates a fresh BCrypt hash for user123")
    public ResponseEntity<Map<String, Object>> generatePassword() {
        Map<String, Object> result = new HashMap<>();
        
        org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder encoder = 
            new org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder();
        
        String plainPassword = "user123";
        String newHash = encoder.encode(plainPassword);
        
        result.put("plainPassword", plainPassword);
        result.put("newHash", newHash);
        result.put("sqlUpdate", "UPDATE users SET password = '" + newHash + "' WHERE username = 'user';");
        result.put("timestamp", LocalDateTime.now());
        
        return ResponseEntity.ok(result);
    }
}