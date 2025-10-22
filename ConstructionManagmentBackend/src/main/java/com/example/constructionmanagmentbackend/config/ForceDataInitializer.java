package com.example.constructionmanagmentbackend.config;

import com.example.constructionmanagmentbackend.entity.*;
import com.example.constructionmanagmentbackend.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;

@Component
@RequiredArgsConstructor
@Order(4) // Run after all other initializers
public class ForceDataInitializer implements CommandLineRunner {

    private final ProjectRepository projectRepository;
    private final SupplierRepository supplierRepository;
    private final BudgetLineRepository budgetLineRepository;
    private final TaskRepository taskRepository;
    private final InvoiceRepository invoiceRepository;
    private final PaymentTermRepository paymentTermRepository;
    private final AmendmentRepository amendmentRepository;
    private final WorkedHourRepository workedHourRepository;
    private final UserRepository userRepository;
    private final RoleRepository roleRepository;

    @Override
    public void run(String... args) throws Exception {
        System.out.println("==========================================");
        System.out.println("FORCE DATA INITIALIZER - CHECKING DATABASE");
        System.out.println("==========================================");
        
        try {
            // Print current counts
            System.out.println("Current Database Counts:");
            System.out.println("- Roles: " + roleRepository.count());
            System.out.println("- Users: " + userRepository.count());
            System.out.println("- Projects: " + projectRepository.count());
            System.out.println("- Suppliers: " + supplierRepository.count());
            System.out.println("- Budget Lines: " + budgetLineRepository.count());
            System.out.println("- Tasks: " + taskRepository.count());
            System.out.println("- Invoices: " + invoiceRepository.count());
            System.out.println("- Payment Terms: " + paymentTermRepository.count());
            System.out.println("- Amendments: " + amendmentRepository.count());
            System.out.println("- Worked Hours: " + workedHourRepository.count());

            // Force create at least one project if none exist
            if (projectRepository.count() == 0) {
                System.out.println("\n>>> FORCE CREATING TEST PROJECT <<<");
                Project testProject = new Project();
                testProject.setName("Test Project");
                testProject.setDescription("Test project for debugging");
                testProject.setLocation("Test Location");
                testProject.setClientName("Test Client");
                testProject.setClientContact("Test Contact");
                testProject.setStartDate(LocalDateTime.now());
                testProject.setEndDate(LocalDateTime.now().plusDays(30));
                testProject.setStatus("Active");
                testProject.setTotalBudget(100000.00);
                
                Project saved = projectRepository.save(testProject);
                System.out.println(">>> Test project saved with ID: " + saved.getId());
            }

            // Force create at least one supplier if none exist
            if (supplierRepository.count() == 0) {
                System.out.println("\n>>> FORCE CREATING TEST SUPPLIER <<<");
                Supplier testSupplier = new Supplier();
                testSupplier.setName("Test Supplier");
                testSupplier.setContactPerson("Test Person");
                testSupplier.setEmail("test@test.com");
                testSupplier.setPhone("123-456-7890");
                testSupplier.setAddress("Test Address");
                testSupplier.setTaxId("TEST123");
                testSupplier.setCategory("Test Category");
                
                Supplier saved = supplierRepository.save(testSupplier);
                System.out.println(">>> Test supplier saved with ID: " + saved.getId());
            }

            System.out.println("\nFinal Database Counts:");
            System.out.println("- Projects: " + projectRepository.count());
            System.out.println("- Suppliers: " + supplierRepository.count());
            System.out.println("- Budget Lines: " + budgetLineRepository.count());
            System.out.println("- Tasks: " + taskRepository.count());
            System.out.println("- Invoices: " + invoiceRepository.count());
            System.out.println("- Payment Terms: " + paymentTermRepository.count());
            System.out.println("- Amendments: " + amendmentRepository.count());
            System.out.println("- Worked Hours: " + workedHourRepository.count());

        } catch (Exception e) {
            System.err.println("ERROR IN FORCE DATA INITIALIZER:");
            e.printStackTrace();
        }
        
        System.out.println("==========================================");
        System.out.println("FORCE DATA INITIALIZER - COMPLETED");
        System.out.println("==========================================");
    }
}