package com.example.constructionmanagmentbackend.service;

import com.example.constructionmanagmentbackend.dto.AmendmentDto;
import com.example.constructionmanagmentbackend.entity.Amendment;
import com.example.constructionmanagmentbackend.entity.Project;
import com.example.constructionmanagmentbackend.exception.ResourceNotFoundException;
import com.example.constructionmanagmentbackend.repository.AmendmentRepository;
import com.example.constructionmanagmentbackend.repository.ProjectRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class AmendmentService {

    @Autowired
    private AmendmentRepository amendmentRepository;

    @Autowired
    private ProjectRepository projectRepository;

    public List<AmendmentDto> getAllAmendments() {
        return amendmentRepository.findAll().stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    public AmendmentDto getAmendmentById(Long id) {
        Amendment amendment = amendmentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Amendment", "id", id));
        return convertToDto(amendment);
    }

    public List<AmendmentDto> getAmendmentsByProjectId(Long projectId) {
        return amendmentRepository.findByProjectId(projectId).stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    @Transactional
    public AmendmentDto createAmendment(AmendmentDto amendmentDto) {
        Amendment amendment = convertToEntity(amendmentDto);
        amendment = amendmentRepository.save(amendment);
        return convertToDto(amendment);
    }

    @Transactional
    public AmendmentDto updateAmendment(Long id, AmendmentDto amendmentDto) {
        Amendment existingAmendment = amendmentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Amendment", "id", id));

        existingAmendment.setName(amendmentDto.getName());
        existingAmendment.setDescription(amendmentDto.getDescription());
        existingAmendment.setAmount(amendmentDto.getAmount());
        existingAmendment.setDate(amendmentDto.getDate());
        existingAmendment.setStatus(amendmentDto.getStatus());
        existingAmendment.setApprovedBy(amendmentDto.getApprovedBy());
        existingAmendment.setApprovalDate(amendmentDto.getApprovalDate());

        if (amendmentDto.getProjectId() != null) {
            Project project = projectRepository.findById(amendmentDto.getProjectId())
                    .orElseThrow(() -> new ResourceNotFoundException("Project", "id", amendmentDto.getProjectId()));
            existingAmendment.setProject(project);
        }

        existingAmendment = amendmentRepository.save(existingAmendment);
        return convertToDto(existingAmendment);
    }

    @Transactional
    public void deleteAmendment(Long id) {
        if (!amendmentRepository.existsById(id)) {
            throw new ResourceNotFoundException("Amendment", "id", id);
        }
        amendmentRepository.deleteById(id);
    }

    private AmendmentDto convertToDto(Amendment amendment) {
        AmendmentDto dto = new AmendmentDto();
        dto.setId(amendment.getId());
        dto.setName(amendment.getName());
        dto.setDescription(amendment.getDescription());
        dto.setAmount(amendment.getAmount());
        dto.setDate(amendment.getDate());
        dto.setStatus(amendment.getStatus());
        dto.setApprovedBy(amendment.getApprovedBy());
        dto.setApprovalDate(amendment.getApprovalDate());
        dto.setCreatedAt(amendment.getCreatedAt());
        dto.setUpdatedAt(amendment.getUpdatedAt());

        if (amendment.getProject() != null) {
            dto.setProjectId(amendment.getProject().getId());
            dto.setProjectName(amendment.getProject().getName());
        }

        return dto;
    }

    private Amendment convertToEntity(AmendmentDto dto) {
        Amendment amendment = new Amendment();

        if (dto.getId() != null) {
            amendment.setId(dto.getId());
        }

        amendment.setName(dto.getName());
        amendment.setDescription(dto.getDescription());
        amendment.setAmount(dto.getAmount());
        amendment.setDate(dto.getDate());
        amendment.setStatus(dto.getStatus());
        amendment.setApprovedBy(dto.getApprovedBy());
        amendment.setApprovalDate(dto.getApprovalDate());

        if (dto.getProjectId() != null) {
            Project project = projectRepository.findById(dto.getProjectId())
                    .orElseThrow(() -> new ResourceNotFoundException("Project", "id", dto.getProjectId()));
            amendment.setProject(project);
        }

        return amendment;
    }
}