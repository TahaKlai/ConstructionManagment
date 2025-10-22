package com.example.constructionmanagmentbackend.config;

import com.example.constructionmanagmentbackend.entity.Role;
import com.example.constructionmanagmentbackend.entity.User;
import com.example.constructionmanagmentbackend.repository.RoleRepository;
import com.example.constructionmanagmentbackend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.core.annotation.Order;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.Set;

@Component
@RequiredArgsConstructor
@Order(2) // Run after DatabaseInitializer
public class UserInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        if (userRepository.count() == 0) {
            // Create default admin user
            User adminUser = new User();
            adminUser.setUsername("admin");
            adminUser.setEmail("admin@constructionmanagement.com");
            adminUser.setPassword(passwordEncoder.encode("admin123"));
            adminUser.setFullName("System Administrator");
            adminUser.setEnabled(true);

            Role adminRole = roleRepository.findByName(Role.ERole.ROLE_ADMIN)
                    .orElseThrow(() -> new RuntimeException("ROLE_ADMIN not found"));
            Role userRole = roleRepository.findByName(Role.ERole.ROLE_USER)
                    .orElseThrow(() -> new RuntimeException("ROLE_USER not found"));

            adminUser.setRoles(Set.of(adminRole, userRole));
            userRepository.save(adminUser);

            // Create default user
            User regularUser = new User();
            regularUser.setUsername("user");
            regularUser.setEmail("user@constructionmanagement.com");
            regularUser.setPassword(passwordEncoder.encode("user123"));
            regularUser.setFullName("Regular User");
            regularUser.setEnabled(true);

            regularUser.setRoles(Set.of(userRole));
            userRepository.save(regularUser);

            System.out.println("========================================");
            System.out.println("DEFAULT USERS CREATED:");
            System.out.println("Admin User - Username: admin, Password: admin123");
            System.out.println("Regular User - Username: user, Password: user123");
            System.out.println("========================================");
        }
    }
}