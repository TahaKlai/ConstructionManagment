package com.example.constructionmanagmentbackend.controller;

import com.example.constructionmanagmentbackend.dto.BudgetLineDto;
import com.example.constructionmanagmentbackend.service.BudgetLineService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/budgetlines")
public class BudgetLineController {

    @Autowired
    private BudgetLineService budgetLineService;

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<BudgetLineDto>> getAllBudgetLines() {
        return ResponseEntity.ok(budgetLineService.getAllBudgetLines());
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'USER')")
    public ResponseEntity<BudgetLineDto> getBudgetLineById(@PathVariable Long id) {
        return ResponseEntity.ok(budgetLineService.getBudgetLineById(id));
    }

    @GetMapping("/project/{projectId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'USER')")
    public ResponseEntity<List<BudgetLineDto>> getBudgetLinesByProjectId(@PathVariable Long projectId) {
        return ResponseEntity.ok(budgetLineService.getBudgetLinesByProjectId(projectId));
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<BudgetLineDto> createBudgetLine(@Valid @RequestBody BudgetLineDto budgetLineDto) {
        return new ResponseEntity<>(budgetLineService.createBudgetLine(budgetLineDto), HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<BudgetLineDto> updateBudgetLine(
            @PathVariable Long id,
            @Valid @RequestBody BudgetLineDto budgetLineDto) {
        return ResponseEntity.ok(budgetLineService.updateBudgetLine(id, budgetLineDto));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteBudgetLine(@PathVariable Long id) {
        budgetLineService.deleteBudgetLine(id);
        return ResponseEntity.noContent().build();
    }
}