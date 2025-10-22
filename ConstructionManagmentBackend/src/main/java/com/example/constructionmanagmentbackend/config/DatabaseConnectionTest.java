package com.example.constructionmanagmentbackend.config;

import org.springframework.boot.CommandLineRunner;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;

import javax.sql.DataSource;
import java.sql.Connection;

@Component
@Order(1) // Run first
public class DatabaseConnectionTest implements CommandLineRunner {

    private final DataSource dataSource;

    public DatabaseConnectionTest(DataSource dataSource) {
        this.dataSource = dataSource;
    }

    @Override
    public void run(String... args) throws Exception {
        System.out.println("==========================================");
        System.out.println("DATABASE CONNECTION TEST");
        System.out.println("==========================================");
        
        try (Connection connection = dataSource.getConnection()) {
            System.out.println("✅ Database connection successful!");
            System.out.println("Database URL: " + connection.getMetaData().getURL());
            System.out.println("Database Product: " + connection.getMetaData().getDatabaseProductName());
            System.out.println("Database Version: " + connection.getMetaData().getDatabaseProductVersion());
            System.out.println("Username: " + connection.getMetaData().getUserName());
        } catch (Exception e) {
            System.err.println("❌ Database connection failed!");
            System.err.println("Error: " + e.getMessage());
            e.printStackTrace();
        }
        
        System.out.println("==========================================");
    }
}