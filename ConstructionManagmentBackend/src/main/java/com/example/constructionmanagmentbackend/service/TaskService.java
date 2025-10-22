package com.example.constructionmanagmentbackend.service;

import com.example.constructionmanagmentbackend.dto.TaskDto;
import com.example.constructionmanagmentbackend.entity.Project;
import com.example.constructionmanagmentbackend.entity.Task;
import com.example.constructionmanagmentbackend.exception.ResourceNotFoundException;
import com.example.constructionmanagmentbackend.repository.ProjectRepository;
import com.example.constructionmanagmentbackend.repository.TaskRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class TaskService {

    @Autowired
    private TaskRepository taskRepository;

    @Autowired
    private ProjectRepository projectRepository;

    public List<TaskDto> getAllTasks() {
        return taskRepository.findAll().stream()
                .map(TaskDto::fromEntity)
                .collect(Collectors.toList());
    }

    public List<TaskDto> getAllTasksSimple() {
        return taskRepository.findAll().stream()
                .map(task -> {
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
                    dto.setCreatedAt(task.getCreatedAt());
                    dto.setUpdatedAt(task.getUpdatedAt());
                    
                    // Safely set project ID and name without loading full entity
                    try {
                        if (task.getProject() != null) {
                            dto.setProjectId(task.getProject().getId());
                            dto.setProjectName(task.getProject().getName());
                        }
                    } catch (Exception e) {
                        // If there's any issue with lazy loading, just skip
                        System.out.println("Warning: Could not load project for task " + task.getId());
                    }
                    
                    return dto;
                })
                .collect(Collectors.toList());
    }

    public long getTaskCount() {
        return taskRepository.count();
    }

    public TaskDto getTaskById(Long id) {
        Task task = taskRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Task", "id", id));
        return convertToDto(task);
    }

    public List<TaskDto> getTasksByProjectId(Long projectId) {
        return taskRepository.findByProjectId(projectId).stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    public List<TaskDto> getSubtasksByParentId(Long parentId) {
        return taskRepository.findByParentId(parentId).stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    @Transactional
    public TaskDto createTask(TaskDto taskDto) {
        Task task = convertToEntity(taskDto);
        task = taskRepository.save(task);
        return convertToDto(task);
    }

    @Transactional
    public TaskDto updateTask(Long id, TaskDto taskDto) {
        Task existingTask = taskRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Task", "id", id));

        // Update fields
        existingTask.setName(taskDto.getName());
        existingTask.setDescription(taskDto.getDescription());
        existingTask.setWbsCode(taskDto.getWbsCode());
        existingTask.setPlannedStartDate(taskDto.getPlannedStartDate());
        existingTask.setPlannedEndDate(taskDto.getPlannedEndDate());
        existingTask.setActualStartDate(taskDto.getActualStartDate());
        existingTask.setActualEndDate(taskDto.getActualEndDate());
        existingTask.setCompletionPercentage(taskDto.getCompletionPercentage());
        existingTask.setStatus(taskDto.getStatus());

        // Update project if needed
        if (taskDto.getProjectId() != null) {
            Project project = projectRepository.findById(taskDto.getProjectId())
                    .orElseThrow(() -> new ResourceNotFoundException("Project", "id", taskDto.getProjectId()));
            existingTask.setProject(project);
        }

        // Update parent task if needed
        if (taskDto.getParentId() != null) {
            Task parent = taskRepository.findById(taskDto.getParentId())
                    .orElseThrow(() -> new ResourceNotFoundException("Task", "id", taskDto.getParentId()));
            existingTask.setParent(parent);
        } else {
            existingTask.setParent(null);
        }

        existingTask = taskRepository.save(existingTask);
        return convertToDto(existingTask);
    }

    @Transactional
    public void deleteTask(Long id) {
        if (!taskRepository.existsById(id)) {
            throw new ResourceNotFoundException("Task", "id", id);
        }
        taskRepository.deleteById(id);
    }

    private TaskDto convertToDto(Task task) {
        return TaskDto.fromEntity(task);
    }

    private Task convertToEntity(TaskDto dto) {
        Task task = new Task();

        if (dto.getId() != null) {
            task.setId(dto.getId());
        }

        task.setName(dto.getName());
        task.setDescription(dto.getDescription());
        task.setWbsCode(dto.getWbsCode());
        task.setPlannedStartDate(dto.getPlannedStartDate());
        task.setPlannedEndDate(dto.getPlannedEndDate());
        task.setActualStartDate(dto.getActualStartDate());
        task.setActualEndDate(dto.getActualEndDate());
        task.setCompletionPercentage(dto.getCompletionPercentage());
        task.setStatus(dto.getStatus());

        // Set project if provided
        if (dto.getProjectId() != null) {
            Project project = projectRepository.findById(dto.getProjectId())
                    .orElseThrow(() -> new ResourceNotFoundException("Project", "id", dto.getProjectId()));
            task.setProject(project);
        }

        // Set parent task if provided
        if (dto.getParentId() != null) {
            Task parent = taskRepository.findById(dto.getParentId())
                    .orElseThrow(() -> new ResourceNotFoundException("Task", "id", dto.getParentId()));
            task.setParent(parent);
        }

        return task;
    }
}