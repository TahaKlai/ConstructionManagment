package com.example.constructionmanagmentbackend.service;

import com.example.constructionmanagmentbackend.dto.BudgetLineDto;
import com.example.constructionmanagmentbackend.entity.BudgetLine;
import com.example.constructionmanagmentbackend.entity.Project;
import com.example.constructionmanagmentbackend.exception.ResourceNotFoundException;
import com.example.constructionmanagmentbackend.repository.BudgetLineRepository;
import com.example.constructionmanagmentbackend.repository.ProjectRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class BudgetLineService {

    @Autowired
    private BudgetLineRepository budgetLineRepository;

    @Autowired
    private ProjectRepository projectRepository;

    public List<BudgetLineDto> getAllBudgetLines() {
        return budgetLineRepository.findAll().stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    public List<BudgetLineDto> getBudgetLinesByProjectId(Long projectId) {
        return budgetLineRepository.findByProjectId(projectId).stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    public BudgetLineDto getBudgetLineById(Long id) {
        BudgetLine budgetLine = budgetLineRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("BudgetLine", "id", id));
        return convertToDto(budgetLine);
    }

    @Transactional
    public BudgetLineDto createBudgetLine(BudgetLineDto budgetLineDto) {
        BudgetLine budgetLine = convertToEntity(budgetLineDto);
        budgetLine = budgetLineRepository.save(budgetLine);
        return convertToDto(budgetLine);
    }

    @Transactional
    public BudgetLineDto updateBudgetLine(Long id, BudgetLineDto budgetLineDto) {
        BudgetLine existingBudgetLine = budgetLineRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("BudgetLine", "id", id));

        // Update fields
        existingBudgetLine.setDescription(budgetLineDto.getDescription());
        existingBudgetLine.setCategory(budgetLineDto.getCategory());
        existingBudgetLine.setEstimatedAmount(budgetLineDto.getEstimatedAmount());
        existingBudgetLine.setSpentAmount(budgetLineDto.getSpentAmount());
        existingBudgetLine.setStatus(budgetLineDto.getStatus());

        // Check if project has changed
        if (!existingBudgetLine.getProject().getId().equals(budgetLineDto.getProjectId())) {
            Project project = projectRepository.findById(budgetLineDto.getProjectId())
                    .orElseThrow(() -> new ResourceNotFoundException("Project", "id", budgetLineDto.getProjectId()));
            existingBudgetLine.setProject(project);
        }

        existingBudgetLine = budgetLineRepository.save(existingBudgetLine);
        return convertToDto(existingBudgetLine);
    }

    @Transactional
    public void deleteBudgetLine(Long id) {
        if (!budgetLineRepository.existsById(id)) {
            throw new ResourceNotFoundException("BudgetLine", "id", id);
        }
        budgetLineRepository.deleteById(id);
    }

    private BudgetLineDto convertToDto(BudgetLine budgetLine) {
        BudgetLineDto dto = new BudgetLineDto();
        dto.setId(budgetLine.getId());
        dto.setDescription(budgetLine.getDescription());
        dto.setCategory(budgetLine.getCategory());
        dto.setEstimatedAmount(budgetLine.getEstimatedAmount());
        dto.setSpentAmount(budgetLine.getSpentAmount());
        dto.setStatus(budgetLine.getStatus());
        dto.setProjectId(budgetLine.getProject().getId());
        dto.setCreatedAt(budgetLine.getCreatedAt());
        dto.setUpdatedAt(budgetLine.getUpdatedAt());
        return dto;
    }

    private BudgetLine convertToEntity(BudgetLineDto dto) {
        BudgetLine budgetLine = new BudgetLine();

        if (dto.getId() != null) {
            budgetLine.setId(dto.getId());
        }

        budgetLine.setDescription(dto.getDescription());
        budgetLine.setCategory(dto.getCategory());
        budgetLine.setEstimatedAmount(dto.getEstimatedAmount());
        budgetLine.setSpentAmount(dto.getSpentAmount() != null ? dto.getSpentAmount() : 0.0);
        budgetLine.setStatus(dto.getStatus() != null ? dto.getStatus() : "PLANNED");

        Project project = projectRepository.findById(dto.getProjectId())
                .orElseThrow(() -> new ResourceNotFoundException("Project", "id", dto.getProjectId()));
        budgetLine.setProject(project);

        return budgetLine;
    }
}