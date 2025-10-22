package com.example.constructionmanagmentbackend.service;

import com.example.constructionmanagmentbackend.dto.ProjectDto;
import com.example.constructionmanagmentbackend.entity.Project;
import com.example.constructionmanagmentbackend.exception.ResourceNotFoundException;
import com.example.constructionmanagmentbackend.repository.ProjectRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class ProjectService {

    @Autowired
    private ProjectRepository projectRepository;

    public List<ProjectDto> getAllProjects() {
        return projectRepository.findAll().stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    public ProjectDto getProjectById(Long id) {
        Project project = projectRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Project", "id", id));
        return convertToDto(project);
    }

    @Transactional
    public ProjectDto createProject(ProjectDto projectDto) {
        Project project = convertToEntity(projectDto);
        project = projectRepository.save(project);
        return convertToDto(project);
    }

    @Transactional
    public ProjectDto updateProject(Long id, ProjectDto projectDto) {
        Project existingProject = projectRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Project", "id", id));

        // Update fields
        existingProject.setName(projectDto.getName());
        existingProject.setDescription(projectDto.getDescription());
        existingProject.setLocation(projectDto.getLocation());
        existingProject.setClientName(projectDto.getClientName());
        existingProject.setClientContact(projectDto.getClientContact());
        existingProject.setStartDate(projectDto.getStartDate());
        existingProject.setEndDate(projectDto.getEndDate());
        existingProject.setStatus(projectDto.getStatus());
        existingProject.setTotalBudget(projectDto.getTotalBudget());

        existingProject = projectRepository.save(existingProject);
        return convertToDto(existingProject);
    }

    @Transactional
    public void deleteProject(Long id) {
        if (!projectRepository.existsById(id)) {
            throw new ResourceNotFoundException("Project", "id", id);
        }
        projectRepository.deleteById(id);
    }

    private ProjectDto convertToDto(Project project) {
        ProjectDto dto = new ProjectDto();
        dto.setId(project.getId());
        dto.setName(project.getName());
        dto.setDescription(project.getDescription());
        dto.setLocation(project.getLocation());
        dto.setClientName(project.getClientName());
        dto.setClientContact(project.getClientContact());
        dto.setStartDate(project.getStartDate());
        dto.setEndDate(project.getEndDate());
        dto.setStatus(project.getStatus());
        dto.setTotalBudget(project.getTotalBudget());

        // Get IDs of related entities
        if (project.getBudgetLines() != null) {
            dto.setBudgetLineIds(project.getBudgetLines().stream()
                    .map(budgetLine -> budgetLine.getId())
                    .collect(Collectors.toList()));
        }

        if (project.getTasks() != null) {
            dto.setTaskIds(project.getTasks().stream()
                    .map(task -> task.getId())
                    .collect(Collectors.toList()));
        }

        if (project.getAmendments() != null) {
            dto.setAmendmentIds(project.getAmendments().stream()
                    .map(amendment -> amendment.getId())
                    .collect(Collectors.toList()));
        }

        dto.setCreatedAt(project.getCreatedAt());
        dto.setUpdatedAt(project.getUpdatedAt());
        return dto;
    }

    private Project convertToEntity(ProjectDto dto) {
        Project project = new Project();

        if (dto.getId() != null) {
            project.setId(dto.getId());
        }

        project.setName(dto.getName());
        project.setDescription(dto.getDescription());
        project.setLocation(dto.getLocation());
        project.setClientName(dto.getClientName());
        project.setClientContact(dto.getClientContact());
        project.setStartDate(dto.getStartDate());
        project.setEndDate(dto.getEndDate());
        project.setStatus(dto.getStatus());
        project.setTotalBudget(dto.getTotalBudget());

        return project;
    }
}