package com.example.constructionmanagmentbackend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class RegisterResponseDto {
    private String message;
    private String username;
    private String email;
    private String role;
}