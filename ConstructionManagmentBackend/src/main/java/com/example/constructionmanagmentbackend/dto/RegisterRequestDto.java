package com.example.constructionmanagmentbackend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class RegisterRequestDto {
    private String username;
    private String email;
    private String password;
    private String fullName;
    private String role; // ROLE_ADMIN or ROLE_USER
}