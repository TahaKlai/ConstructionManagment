package com.example.constructionmanagmentbackend.controller;

import com.example.constructionmanagmentbackend.dto.AuthResponseDto;
import com.example.constructionmanagmentbackend.dto.LoginRequestDto;
import com.example.constructionmanagmentbackend.dto.RegisterRequestDto;
import com.example.constructionmanagmentbackend.dto.RegisterResponseDto;
import com.example.constructionmanagmentbackend.entity.Role;
import com.example.constructionmanagmentbackend.entity.User;
import com.example.constructionmanagmentbackend.repository.RoleRepository;
import com.example.constructionmanagmentbackend.repository.UserRepository;
import com.example.constructionmanagmentbackend.security.JwtTokenProvider;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.Collections;

@RestController
@RequestMapping("/api/auth")
@Tag(name = "Authentication", description = "Authentication APIs")
public class AuthController {

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private RoleRepository roleRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtTokenProvider tokenProvider;

    @PostMapping("/login")
    @Operation(summary = "User login", description = "Authenticates a user and returns a JWT token")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Successfully authenticated"),
            @ApiResponse(responseCode = "401", description = "Authentication failed")
    })
    public ResponseEntity<AuthResponseDto> login(@RequestBody LoginRequestDto loginRequest) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        loginRequest.getUsername(),
                        loginRequest.getPassword()
                )
        );

        SecurityContextHolder.getContext().setAuthentication(authentication);
        String jwt = tokenProvider.generateToken(authentication);

        return ResponseEntity.ok(new AuthResponseDto(jwt));
    }

    @PostMapping("/register")
    @Operation(summary = "User registration", description = "Registers a new user account")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "201", description = "User registered successfully"),
            @ApiResponse(responseCode = "400", description = "Username or email already in use")
    })
    public ResponseEntity<?> register(@RequestBody RegisterRequestDto registerRequest) {
        // Check if username exists
        if (userRepository.existsByUsername(registerRequest.getUsername())) {
            return new ResponseEntity<>("Username already taken!", HttpStatus.BAD_REQUEST);
        }

        // Check if email exists
        if (userRepository.existsByEmail(registerRequest.getEmail())) {
            return new ResponseEntity<>("Email already in use!", HttpStatus.BAD_REQUEST);
        }

        // Create new user
        User user = new User();
        user.setUsername(registerRequest.getUsername());
        user.setEmail(registerRequest.getEmail());
        user.setPassword(passwordEncoder.encode(registerRequest.getPassword()));
        user.setFullName(registerRequest.getFullName());

        // Assign role based on request (default to USER if not specified or invalid)
        Role.ERole roleEnum = Role.ERole.ROLE_USER; // Default value
        if (registerRequest.getRole() != null) {
            try {
                roleEnum = Role.ERole.valueOf(registerRequest.getRole());
            } catch (Exception e) {
                // Keep default ROLE_USER if invalid
            }
        }
        
        final Role.ERole finalRoleEnum = roleEnum; // Make final copy for lambda
        Role userRole = roleRepository.findByName(finalRoleEnum)
                .orElseThrow(() -> new RuntimeException("Role not found: " + finalRoleEnum));
        user.setRoles(Collections.singleton(userRole));

        User savedUser = userRepository.save(user);

        RegisterResponseDto response = new RegisterResponseDto(
            "User registered successfully",
            savedUser.getUsername(),
            savedUser.getEmail(),
            finalRoleEnum.name()
        );

        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @GetMapping("/validate")
    @Operation(summary = "Validate token", description = "Validates the current user's JWT token")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Token is valid"),
            @ApiResponse(responseCode = "401", description = "Token is invalid or expired")
    })
    public ResponseEntity<?> validateToken() {
        // This endpoint simply returns OK if the token is valid
        // The authentication is handled by the security filter chain
        return ResponseEntity.ok().build();
    }
}