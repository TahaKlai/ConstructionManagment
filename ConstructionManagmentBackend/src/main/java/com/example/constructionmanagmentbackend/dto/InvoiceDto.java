package com.example.constructionmanagmentbackend.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PastOrPresent;
import jakarta.validation.constraints.Positive;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class InvoiceDto {
    private Long id;

    @NotBlank(message = "Invoice number is required")
    private String invoiceNumber;

    @NotNull(message = "Invoice date is required")
    @PastOrPresent(message = "Invoice date cannot be in the future")
    private LocalDateTime invoiceDate;

    @NotNull(message = "Amount is required")
    @Positive(message = "Amount must be positive")
    private Double amount;

    private String description;

    @NotBlank(message = "Status is required")
    private String status;

    private LocalDateTime dueDate;
    private LocalDateTime paidDate;

    @NotNull(message = "Supplier ID is required")
    private Long supplierId;

    @NotNull(message = "Budget line ID is required")
    private Long budgetLineId;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}