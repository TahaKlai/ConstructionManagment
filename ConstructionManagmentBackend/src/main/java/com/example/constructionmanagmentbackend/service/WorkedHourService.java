package com.example.constructionmanagmentbackend.service;

import com.example.constructionmanagmentbackend.dto.WorkedHourDto;
import com.example.constructionmanagmentbackend.entity.Task;
import com.example.constructionmanagmentbackend.entity.WorkedHour;
import com.example.constructionmanagmentbackend.exception.ResourceNotFoundException;
import com.example.constructionmanagmentbackend.repository.TaskRepository;
import com.example.constructionmanagmentbackend.repository.WorkedHourRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class WorkedHourService {

    @Autowired
    private WorkedHourRepository workedHourRepository;

    @Autowired
    private TaskRepository taskRepository;

    public List<WorkedHourDto> getAllWorkedHours() {
        return workedHourRepository.findAll().stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    public WorkedHourDto getWorkedHourById(Long id) {
        WorkedHour workedHour = workedHourRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("WorkedHour", "id", id));
        return convertToDto(workedHour);
    }

    public List<WorkedHourDto> getWorkedHoursByTaskId(Long taskId) {
        return workedHourRepository.findByTaskId(taskId).stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    @Transactional
    public WorkedHourDto createWorkedHour(WorkedHourDto workedHourDto) {
        WorkedHour workedHour = convertToEntity(workedHourDto);
        workedHour = workedHourRepository.save(workedHour);
        return convertToDto(workedHour);
    }

    @Transactional
    public WorkedHourDto updateWorkedHour(Long id, WorkedHourDto workedHourDto) {
        WorkedHour existingWorkedHour = workedHourRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("WorkedHour", "id", id));

        existingWorkedHour.setDate(workedHourDto.getDate());
        existingWorkedHour.setHours(workedHourDto.getHours());
        existingWorkedHour.setWorkerName(workedHourDto.getWorkerName());
        existingWorkedHour.setDescription(workedHourDto.getDescription());

        if (workedHourDto.getTaskId() != null) {
            Task task = taskRepository.findById(workedHourDto.getTaskId())
                    .orElseThrow(() -> new ResourceNotFoundException("Task", "id", workedHourDto.getTaskId()));
            existingWorkedHour.setTask(task);
        }

        existingWorkedHour = workedHourRepository.save(existingWorkedHour);
        return convertToDto(existingWorkedHour);
    }

    @Transactional
    public void deleteWorkedHour(Long id) {
        if (!workedHourRepository.existsById(id)) {
            throw new ResourceNotFoundException("WorkedHour", "id", id);
        }
        workedHourRepository.deleteById(id);
    }

    private WorkedHourDto convertToDto(WorkedHour workedHour) {
        WorkedHourDto dto = new WorkedHourDto();
        dto.setId(workedHour.getId());
        dto.setDate(workedHour.getDate());
        dto.setHours(workedHour.getHours());
        dto.setWorkerName(workedHour.getWorkerName());
        dto.setDescription(workedHour.getDescription());
        dto.setCreatedAt(workedHour.getCreatedAt());
        dto.setUpdatedAt(workedHour.getUpdatedAt());

        if (workedHour.getTask() != null) {
            dto.setTaskId(workedHour.getTask().getId());
            dto.setTaskName(workedHour.getTask().getName());
        }

        return dto;
    }

    private WorkedHour convertToEntity(WorkedHourDto dto) {
        WorkedHour workedHour = new WorkedHour();

        if (dto.getId() != null) {
            workedHour.setId(dto.getId());
        }

        workedHour.setDate(dto.getDate());
        workedHour.setHours(dto.getHours());
        workedHour.setWorkerName(dto.getWorkerName());
        workedHour.setDescription(dto.getDescription());

        if (dto.getTaskId() != null) {
            Task task = taskRepository.findById(dto.getTaskId())
                    .orElseThrow(() -> new ResourceNotFoundException("Task", "id", dto.getTaskId()));
            workedHour.setTask(task);
        }

        return workedHour;
    }
}