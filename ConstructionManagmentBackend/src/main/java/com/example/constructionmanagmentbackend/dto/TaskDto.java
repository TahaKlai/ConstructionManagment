package com.example.constructionmanagmentbackend.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.PositiveOrZero;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class TaskDto {
    private Long id;

    @NotBlank(message = "Task name is required")
    private String name;

    private String description;
    private String wbsCode;
    private LocalDateTime plannedStartDate;
    private LocalDateTime plannedEndDate;
    private LocalDateTime actualStartDate;
    private LocalDateTime actualEndDate;

    @PositiveOrZero(message = "Completion percentage must be positive or zero")
    private Double completionPercentage;

    private String status;

    private Long projectId;
    private String projectName; // For display purposes

    private Long parentId;
    private String parentName; // For display purposes

    private boolean milestone;
    private int duration;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    
    public static TaskDto fromEntity(com.example.constructionmanagmentbackend.entity.Task task) {
        if (task == null) return null;
        
        TaskDto dto = new TaskDto();
        dto.setId(task.getId());
        dto.setName(task.getName());
        dto.setDescription(task.getDescription());
        dto.setWbsCode(task.getWbsCode());
        dto.setPlannedStartDate(task.getPlannedStartDate());
        dto.setPlannedEndDate(task.getPlannedEndDate());
        dto.setActualStartDate(task.getActualStartDate());
        dto.setActualEndDate(task.getActualEndDate());
        dto.setCompletionPercentage(task.getCompletionPercentage());
        dto.setStatus(task.getStatus());
        dto.setMilestone(task.isMilestone());
        dto.setDuration(task.getDuration());
        
        // Set project info safely
        if (task.getProject() != null) {
            dto.setProjectId(task.getProject().getId());
            dto.setProjectName(task.getProject().getName());
        }
        
        // Set parent info safely
        if (task.getParent() != null) {
            dto.setParentId(task.getParent().getId());
            dto.setParentName(task.getParent().getName());
        }
        
        dto.setCreatedAt(task.getCreatedAt());
        dto.setUpdatedAt(task.getUpdatedAt());
        return dto;
    }
}