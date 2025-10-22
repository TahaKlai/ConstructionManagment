package com.example.constructionmanagmentbackend.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "risk_assessments")
public class RiskAssessment {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "project_id")
    private Long projectId;

    @Column(name = "risk_level")
    private String riskLevel;

    @Column(name = "delay_probability")
    private Double delayProbability;

    @Column(name = "assessment_date")
    private LocalDateTime assessmentDate;

    @ElementCollection
    @CollectionTable(
        name = "risk_factors",
        joinColumns = @JoinColumn(name = "risk_assessment_id")
    )
    private List<RiskFactor> riskFactors;

    @Column(name = "confidence_score")
    private Double confidenceScore;

    // Constructors
    public RiskAssessment() {}

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getProjectId() {
        return projectId;
    }

    public void setProjectId(Long projectId) {
        this.projectId = projectId;
    }

    public String getRiskLevel() {
        return riskLevel;
    }

    public void setRiskLevel(String riskLevel) {
        this.riskLevel = riskLevel;
    }

    public Double getDelayProbability() {
        return delayProbability;
    }

    public void setDelayProbability(Double delayProbability) {
        this.delayProbability = delayProbability;
    }

    public LocalDateTime getAssessmentDate() {
        return assessmentDate;
    }

    public void setAssessmentDate(LocalDateTime assessmentDate) {
        this.assessmentDate = assessmentDate;
    }

    public List<RiskFactor> getRiskFactors() {
        return riskFactors;
    }

    public void setRiskFactors(List<RiskFactor> riskFactors) {
        this.riskFactors = riskFactors;
    }

    public Double getConfidenceScore() {
        return confidenceScore;
    }

    public void setConfidenceScore(Double confidenceScore) {
        this.confidenceScore = confidenceScore;
    }
}