package com.example.constructionmanagmentbackend.service;

import com.example.constructionmanagmentbackend.config.HuggingFaceConfig;
import com.example.constructionmanagmentbackend.entity.RiskAssessment;
import com.example.constructionmanagmentbackend.entity.RiskFactor;
import com.example.constructionmanagmentbackend.repository.RiskAssessmentRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.time.LocalDateTime;
import java.util.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@Service
public class RiskAssessmentService {

    private static final Logger logger = LoggerFactory.getLogger(RiskAssessmentService.class);
    
    @Autowired
    private RiskAssessmentRepository riskAssessmentRepository;
    
    @Autowired
    private HuggingFaceConfig huggingFaceConfig;
    
    @Autowired
    private RestTemplate huggingFaceRestTemplate;

    private final ObjectMapper objectMapper = new ObjectMapper();

    public RiskAssessment assessProjectRisk(Long projectId, String projectDescription) {
        try {
            // Prepare the input for the model
            Map<String, String> requestBody = new HashMap<>();
            requestBody.put("inputs", prepareModelInput(projectDescription));

            // Make API call to HuggingFace
            HttpEntity<Map<String, String>> request = new HttpEntity<>(requestBody, huggingFaceConfig.huggingFaceHeaders());
            ResponseEntity<List> response = huggingFaceRestTemplate.exchange(
                huggingFaceConfig.getApiUrl(),
                HttpMethod.POST,
                request,
                List.class
            );

            // Process the response
            List<Map<String, Object>> predictions = response.getBody();
            return createRiskAssessment(projectId, predictions);

        } catch (Exception e) {
            logger.error("Error while assessing project risk: ", e);
            throw new RuntimeException("Failed to assess project risk", e);
        }
    }

    private String prepareModelInput(String projectDescription) {
        return String.format(
            "Analyze the following construction project for potential risks: %s\n" +
            "Consider factors like: timeline, resources, weather, supply chain, and safety.",
            projectDescription
        );
    }

    private RiskAssessment createRiskAssessment(Long projectId, List<Map<String, Object>> predictions) {
        RiskAssessment assessment = new RiskAssessment();
        assessment.setProjectId(projectId);
        assessment.setAssessmentDate(LocalDateTime.now());

        // Process model predictions
        Map<String, Double> riskScores = calculateRiskScores(predictions);
        
        // Set risk level
        assessment.setRiskLevel(determineRiskLevel(riskScores));
        
        // Calculate delay probability
        assessment.setDelayProbability(calculateDelayProbability(riskScores));
        
        // Create risk factors
        assessment.setRiskFactors(createRiskFactors(riskScores));
        
        // Save assessment
        return riskAssessmentRepository.save(assessment);
    }

    private Map<String, Double> calculateRiskScores(List<Map<String, Object>> predictions) {
        Map<String, Double> riskScores = new HashMap<>();
        // Process model predictions to calculate risk scores
        // This is a simplified example - adjust based on your model's output
        if (predictions != null && !predictions.isEmpty()) {
            Map<String, Object> prediction = predictions.get(0);
            prediction.forEach((label, score) -> {
                if (score instanceof Double) {
                    riskScores.put(label, (Double) score);
                }
            });
        }
        return riskScores;
    }

    private String determineRiskLevel(Map<String, Double> riskScores) {
        double averageRisk = riskScores.values().stream()
                .mapToDouble(Double::doubleValue)
                .average()
                .orElse(0.0);

        if (averageRisk >= 0.7) return "high";
        if (averageRisk >= 0.4) return "medium";
        return "low";
    }

    private double calculateDelayProbability(Map<String, Double> riskScores) {
        // Simplified delay probability calculation
        return riskScores.values().stream()
                .mapToDouble(Double::doubleValue)
                .average()
                .orElse(0.0) * 100;
    }

    private List<RiskFactor> createRiskFactors(Map<String, Double> riskScores) {
        List<RiskFactor> factors = new ArrayList<>();
        riskScores.forEach((factor, score) -> {
            String severity = score >= 0.7 ? "high" : score >= 0.4 ? "medium" : "low";
            factors.add(new RiskFactor(
                factor,
                severity,
                generateDescription(factor, score)
            ));
        });
        return factors;
    }

    private String generateDescription(String factor, double score) {
        // Generate appropriate description based on the factor and its score
        return String.format("Risk factor '%s' identified with confidence score of %.2f", 
            factor, score);
    }

    public List<RiskAssessment> getProjectRiskHistory(Long projectId) {
        return riskAssessmentRepository.findByProjectIdOrderByAssessmentDateDesc(projectId);
    }

    public RiskAssessment getLatestRiskAssessment(Long projectId) {
        return riskAssessmentRepository.findFirstByProjectIdOrderByAssessmentDateDesc(projectId)
            .orElseThrow(() -> new RuntimeException("No risk assessment found for project " + projectId));
    }
}