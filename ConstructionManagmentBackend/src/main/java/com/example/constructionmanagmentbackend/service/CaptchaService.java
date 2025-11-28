package com.example.constructionmanagmentbackend.service;

import com.example.constructionmanagmentbackend.exception.BadRequestException;
import com.fasterxml.jackson.annotation.JsonAlias;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.util.StringUtils;
import org.springframework.web.client.RestTemplate;

import java.util.List;

@Service
public class CaptchaService {

    private static final Logger logger = LoggerFactory.getLogger(CaptchaService.class);
    private static final String VERIFY_URL = "https://www.google.com/recaptcha/api/siteverify";

    private final RestTemplate restTemplate;
    private final boolean captchaEnabled;
    private final String captchaSecret;

    public CaptchaService(RestTemplate restTemplate,
                          @Value("${app.captcha.enabled:true}") boolean captchaEnabled,
                          @Value("${app.captcha.secret:}") String captchaSecret) {
        this.restTemplate = restTemplate;
        this.captchaEnabled = captchaEnabled;
        this.captchaSecret = captchaSecret;
    }

    public void validateCaptcha(String captchaToken) {
        if (!captchaEnabled) {
            logger.debug("Captcha validation disabled; skipping check.");
            return;
        }

        if (!StringUtils.hasText(captchaSecret)) {
            throw new IllegalStateException("Captcha secret is not configured");
        }

        if (!StringUtils.hasText(captchaToken)) {
            throw new BadRequestException("Captcha token is missing");
        }

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);

        MultiValueMap<String, String> requestBody = new LinkedMultiValueMap<>();
        requestBody.add("secret", captchaSecret);
        requestBody.add("response", captchaToken);

        HttpEntity<MultiValueMap<String, String>> requestEntity = new HttpEntity<>(requestBody, headers);
        RecaptchaResponse response = restTemplate.postForObject(VERIFY_URL, requestEntity, RecaptchaResponse.class);

        if (response == null || !response.isSuccess()) {
            logger.warn("Captcha verification failed: {}", response != null ? response.getErrorCodes() : "no response");
            throw new BadRequestException("Captcha validation failed");
        }
    }

    @JsonIgnoreProperties(ignoreUnknown = true)
    private static class RecaptchaResponse {
        private boolean success;

        @JsonAlias("error-codes")
        private List<String> errorCodes;

        public boolean isSuccess() {
            return success;
        }

        public void setSuccess(boolean success) {
            this.success = success;
        }

        public List<String> getErrorCodes() {
            return errorCodes;
        }

        public void setErrorCodes(List<String> errorCodes) {
            this.errorCodes = errorCodes;
        }
    }
}
