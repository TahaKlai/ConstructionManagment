package com.example.constructionmanagmentbackend.controller;

import com.example.constructionmanagmentbackend.entity.RiskAssessment;
import com.example.constructionmanagmentbackend.service.RiskAssessmentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/risk-assessment")
@CrossOrigin(origins = "http://localhost:4200", allowCredentials = "true")
public class RiskAssessmentController {

    @Autowired
    private RiskAssessmentService riskAssessmentService;

    @PostMapping("/assess/{projectId}")
    public ResponseEntity<RiskAssessment> assessProjectRisk(
            @PathVariable Long projectId,
            @RequestBody Map<String, String> request) {
        
        RiskAssessment assessment = riskAssessmentService.assessProjectRisk(
            projectId,
            request.get("projectDescription")
        );
        return ResponseEntity.ok(assessment);
    }

    @GetMapping("/history/{projectId}")
    public ResponseEntity<List<RiskAssessment>> getProjectRiskHistory(@PathVariable Long projectId) {
        List<RiskAssessment> history = riskAssessmentService.getProjectRiskHistory(projectId);
        return ResponseEntity.ok(history);
    }

    @GetMapping("/latest/{projectId}")
    public ResponseEntity<RiskAssessment> getLatestRiskAssessment(@PathVariable Long projectId) {
        RiskAssessment assessment = riskAssessmentService.getLatestRiskAssessment(projectId);
        return ResponseEntity.ok(assessment);
    }
}