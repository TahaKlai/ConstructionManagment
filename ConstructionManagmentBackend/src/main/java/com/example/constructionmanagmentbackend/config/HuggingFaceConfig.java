package com.example.constructionmanagmentbackend.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.client.RestTemplate;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.beans.factory.annotation.Value;

@Configuration
public class HuggingFaceConfig {

    @Value("${huggingface.api.key}")
    private String apiKey;

    @Value("${huggingface.api.url}")
    private String apiUrl;

    @Bean
    public RestTemplate huggingFaceRestTemplate() {
        return new RestTemplate();
    }

    @Bean
    public HttpHeaders huggingFaceHeaders() {
        HttpHeaders headers = new HttpHeaders();
        headers.setBearerAuth(apiKey);
        headers.setContentType(MediaType.APPLICATION_JSON);
        return headers;
    }

    public String getApiUrl() {
        return apiUrl;
    }
}