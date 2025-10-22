package com.example.constructionmanagmentbackend.controller;

import com.example.constructionmanagmentbackend.dto.WorkedHourDto;
import com.example.constructionmanagmentbackend.service.WorkedHourService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/worked-hours")
@Tag(name = "Worked Hours", description = "Worked hours management APIs")
public class WorkedHourController {

    @Autowired
    private WorkedHourService workedHourService;

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'USER')")
    @Operation(summary = "Get all worked hours", description = "Retrieves a list of all worked hours")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Successfully retrieved worked hours"),
            @ApiResponse(responseCode = "403", description = "Access forbidden")
    })
    public ResponseEntity<List<WorkedHourDto>> getAllWorkedHours() {
        return ResponseEntity.ok(workedHourService.getAllWorkedHours());
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'USER')")
    @Operation(summary = "Get worked hour by ID", description = "Retrieves a specific worked hour by its ID")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Successfully retrieved the worked hour"),
            @ApiResponse(responseCode = "404", description = "Worked hour not found"),
            @ApiResponse(responseCode = "403", description = "Access forbidden")
    })
    public ResponseEntity<WorkedHourDto> getWorkedHourById(@PathVariable Long id) {
        return ResponseEntity.ok(workedHourService.getWorkedHourById(id));
    }

    @GetMapping("/task/{taskId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'USER')")
    @Operation(summary = "Get worked hours by task ID", description = "Retrieves all worked hours for a specific task")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Successfully retrieved worked hours"),
            @ApiResponse(responseCode = "403", description = "Access forbidden")
    })
    public ResponseEntity<List<WorkedHourDto>> getWorkedHoursByTaskId(@PathVariable Long taskId) {
        return ResponseEntity.ok(workedHourService.getWorkedHoursByTaskId(taskId));
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Create worked hour", description = "Creates a new worked hour entry")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "201", description = "Worked hour created successfully"),
            @ApiResponse(responseCode = "400", description = "Invalid input"),
            @ApiResponse(responseCode = "403", description = "Access forbidden")
    })
    public ResponseEntity<WorkedHourDto> createWorkedHour(@Valid @RequestBody WorkedHourDto workedHourDto) {
        return new ResponseEntity<>(workedHourService.createWorkedHour(workedHourDto), HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Update worked hour", description = "Updates an existing worked hour entry")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Worked hour updated successfully"),
            @ApiResponse(responseCode = "404", description = "Worked hour not found"),
            @ApiResponse(responseCode = "400", description = "Invalid input"),
            @ApiResponse(responseCode = "403", description = "Access forbidden")
    })
    public ResponseEntity<WorkedHourDto> updateWorkedHour(
            @PathVariable Long id,
            @Valid @RequestBody WorkedHourDto workedHourDto) {
        return ResponseEntity.ok(workedHourService.updateWorkedHour(id, workedHourDto));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Delete worked hour", description = "Deletes a worked hour entry by ID")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "204", description = "Worked hour deleted successfully"),
            @ApiResponse(responseCode = "404", description = "Worked hour not found"),
            @ApiResponse(responseCode = "403", description = "Access forbidden")
    })
    public ResponseEntity<Void> deleteWorkedHour(@PathVariable Long id) {
        workedHourService.deleteWorkedHour(id);
        return ResponseEntity.noContent().build();
    }
}