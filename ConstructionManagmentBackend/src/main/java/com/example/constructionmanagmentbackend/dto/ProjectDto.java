package com.example.constructionmanagmentbackend.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ProjectDto {
    private Long id;

    @NotBlank(message = "Project name is required")
    private String name;

    private String description;
    private String location;

    @NotBlank(message = "Client name is required")
    private String clientName;

    private String clientContact;

    @NotNull(message = "Start date is required")
    private LocalDateTime startDate;

    private LocalDateTime endDate;

    @NotBlank(message = "Status is required")
    private String status;

    @Positive(message = "Total budget must be positive")
    private Double totalBudget;

    // IDs of related entities for reference
    private List<Long> budgetLineIds;
    private List<Long> taskIds;
    private List<Long> amendmentIds;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}