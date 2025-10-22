package com.example.constructionmanagmentbackend.dto;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class WorkedHourDto {
    private Long id;

    @NotNull(message = "Date is required")
    private LocalDateTime date;

    @NotNull(message = "Hours are required")
    @Positive(message = "Hours must be positive")
    private Double hours;

    @NotNull(message = "Worker name is required")
    private String workerName;

    private String description;

    @NotNull(message = "Task ID is required")
    private Long taskId;

    private String taskName;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}