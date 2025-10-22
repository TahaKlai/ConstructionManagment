package com.example.constructionmanagmentbackend.repository;

import com.example.constructionmanagmentbackend.entity.RiskAssessment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface RiskAssessmentRepository extends JpaRepository<RiskAssessment, Long> {
    List<RiskAssessment> findByProjectIdOrderByAssessmentDateDesc(Long projectId);
    Optional<RiskAssessment> findFirstByProjectIdOrderByAssessmentDateDesc(Long projectId);
}