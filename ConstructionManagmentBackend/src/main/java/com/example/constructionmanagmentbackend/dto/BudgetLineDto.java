package com.example.constructionmanagmentbackend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PositiveOrZero;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class BudgetLineDto {
    private Long id;

    @NotBlank(message = "Description is required")
    private String description;

    @NotBlank(message = "Category is required")
    private String category;

    @NotNull(message = "Estimated amount is required")
    @PositiveOrZero(message = "Estimated amount must be positive or zero")
    private Double estimatedAmount;

    @PositiveOrZero(message = "Spent amount must be positive or zero")
    private Double spentAmount = 0.0;

    private String status = "PLANNED"; // Default status

    @NotNull(message = "Project ID is required")
    private Long projectId;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}