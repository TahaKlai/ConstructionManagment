package com.example.constructionmanagmentbackend.entity;

import jakarta.persistence.Embeddable;

@Embeddable
public class RiskFactor {
    private String name;
    private String severity;
    private String description;

    public RiskFactor() {}

    public RiskFactor(String name, String severity, String description) {
        this.name = name;
        this.severity = severity;
        this.description = description;
    }

    // Getters and Setters
    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getSeverity() {
        return severity;
    }

    public void setSeverity(String severity) {
        this.severity = severity;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }
}