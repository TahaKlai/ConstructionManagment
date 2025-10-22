package com.example.constructionmanagmentbackend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PaymentTermDto {
    private Long id;

    @NotNull(message = "Amount is required")
    @Positive(message = "Amount must be positive")
    private Double amount;

    @NotNull(message = "Due date is required")
    private LocalDateTime dueDate;

    private String status = "PENDING"; // Default status
    private LocalDateTime paidDate;
    private String description;

    @NotNull(message = "Invoice ID is required")
    private Long invoiceId;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}