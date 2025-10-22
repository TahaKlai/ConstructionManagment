package com.example.constructionmanagmentbackend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AmendmentDto {
    private Long id;
    private String name;
    private String description;
    private Double amount;
    private LocalDateTime date;
    private String status;
    private String approvedBy;
    private LocalDateTime approvalDate;
    private Long projectId;
    private String projectName;  // Adding project name for display purposes
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}