package com.example.constructionmanagmentbackend.dto;

import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class AuthResponseDto {
    private String token;
    private String tokenType = "Bearer";
    private String username;
    private java.util.List<String> roles;

    public AuthResponseDto(String token) {
        this.token = token;
    }

    public AuthResponseDto(String token, String username, java.util.List<String> roles) {
        this.token = token;
        this.username = username;
        this.roles = roles;
    }

    public AuthResponseDto(String token, String tokenType, String username, java.util.List<String> roles) {
        this.token = token;
        this.tokenType = tokenType;
        this.username = username;
        this.roles = roles;
    }
}