package com.example.constructionmanagmentbackend.repository;

import com.example.constructionmanagmentbackend.entity.WorkedHour;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface WorkedHourRepository extends JpaRepository<WorkedHour, Long> {
    List<WorkedHour> findByTaskId(Long taskId);
}