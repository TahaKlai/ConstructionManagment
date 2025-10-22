package com.example.constructionmanagmentbackend.controller;

import com.example.constructionmanagmentbackend.dto.AmendmentDto;
import com.example.constructionmanagmentbackend.service.AmendmentService;
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
@RequestMapping("/api/amendments")
@Tag(name = "Amendment", description = "Amendment management APIs")
public class AmendmentController {

    @Autowired
    private AmendmentService amendmentService;

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'USER')")
    @Operation(summary = "Get all amendments", description = "Retrieves a list of all amendments")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Successfully retrieved amendments"),
            @ApiResponse(responseCode = "403", description = "Access forbidden")
    })
    public ResponseEntity<List<AmendmentDto>> getAllAmendments() {
        return ResponseEntity.ok(amendmentService.getAllAmendments());
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'USER')")
    @Operation(summary = "Get amendment by ID", description = "Retrieves a specific amendment by its ID")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Successfully retrieved the amendment"),
            @ApiResponse(responseCode = "404", description = "Amendment not found"),
            @ApiResponse(responseCode = "403", description = "Access forbidden")
    })
    public ResponseEntity<AmendmentDto> getAmendmentById(@PathVariable Long id) {
        return ResponseEntity.ok(amendmentService.getAmendmentById(id));
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Create amendment", description = "Creates a new amendment")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "201", description = "Amendment created successfully"),
            @ApiResponse(responseCode = "400", description = "Invalid input"),
            @ApiResponse(responseCode = "403", description = "Access forbidden")
    })
    public ResponseEntity<AmendmentDto> createAmendment(@Valid @RequestBody AmendmentDto amendmentDto) {
        return new ResponseEntity<>(amendmentService.createAmendment(amendmentDto), HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Update amendment", description = "Updates an existing amendment")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Amendment updated successfully"),
            @ApiResponse(responseCode = "404", description = "Amendment not found"),
            @ApiResponse(responseCode = "400", description = "Invalid input"),
            @ApiResponse(responseCode = "403", description = "Access forbidden")
    })
    public ResponseEntity<AmendmentDto> updateAmendment(
            @PathVariable Long id,
            @Valid @RequestBody AmendmentDto amendmentDto) {
        return ResponseEntity.ok(amendmentService.updateAmendment(id, amendmentDto));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Delete amendment", description = "Deletes an amendment by ID")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "204", description = "Amendment deleted successfully"),
            @ApiResponse(responseCode = "404", description = "Amendment not found"),
            @ApiResponse(responseCode = "403", description = "Access forbidden")
    })
    public ResponseEntity<Void> deleteAmendment(@PathVariable Long id) {
        amendmentService.deleteAmendment(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/project/{projectId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'USER')")
    @Operation(summary = "Get amendments by project ID", description = "Retrieves all amendments for a specific project")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Successfully retrieved amendments"),
            @ApiResponse(responseCode = "403", description = "Access forbidden")
    })
    public ResponseEntity<List<AmendmentDto>> getAmendmentsByProjectId(@PathVariable Long projectId) {
        return ResponseEntity.ok(amendmentService.getAmendmentsByProjectId(projectId));
    }
}