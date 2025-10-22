package com.example.constructionmanagmentbackend.config;

import com.example.constructionmanagmentbackend.entity.*;
import com.example.constructionmanagmentbackend.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;

@Component
@RequiredArgsConstructor
@Order(3) // Run after UserInitializer
public class DataInitializer implements CommandLineRunner {

    private final ProjectRepository projectRepository;
    private final SupplierRepository supplierRepository;
    private final BudgetLineRepository budgetLineRepository;
    private final TaskRepository taskRepository;
    private final InvoiceRepository invoiceRepository;
    private final PaymentTermRepository paymentTermRepository;
    private final AmendmentRepository amendmentRepository;
    private final WorkedHourRepository workedHourRepository;
    private final UserRepository userRepository;

    @Override
    public void run(String... args) throws Exception {
        try {
            System.out.println("========================================");
            System.out.println("CHECKING DATABASE STATE...");
            System.out.println("Current project count: " + projectRepository.count());
            System.out.println("Current user count: " + userRepository.count());
            System.out.println("========================================");
            
            if (projectRepository.count() == 0) {
                System.out.println("========================================");
                System.out.println("INITIALIZING SAMPLE DATA...");
                System.out.println("========================================");

            // Create Projects
            List<Project> projects = createProjects();
            
            // Create Suppliers
            List<Supplier> suppliers = createSuppliers();
            
            // Create Budget Lines for projects
            createBudgetLines(projects);
            
            // Create Tasks for projects
            createTasks(projects);
            
            // Create Invoices
            createInvoices(suppliers);
            
            // Create Payment Terms
            createPaymentTerms(projects);
            
            // Create Amendments
            createAmendments(projects);
            
            // Create Worked Hours
            createWorkedHours();

            System.out.println("========================================");
            System.out.println("SAMPLE DATA INITIALIZATION COMPLETE!");
            System.out.println("Created:");
            System.out.println("- " + projectRepository.count() + " Projects");
            System.out.println("- " + supplierRepository.count() + " Suppliers");
            System.out.println("- " + budgetLineRepository.count() + " Budget Lines");
            System.out.println("- " + taskRepository.count() + " Tasks");
            System.out.println("- " + invoiceRepository.count() + " Invoices");
            System.out.println("- " + paymentTermRepository.count() + " Payment Terms");
            System.out.println("- " + amendmentRepository.count() + " Amendments");
            System.out.println("- " + workedHourRepository.count() + " Worked Hour Records");
            System.out.println("========================================");
            } else {
                System.out.println("========================================");
                System.out.println("DATA ALREADY EXISTS - SKIPPING INITIALIZATION");
                System.out.println("========================================");
            }
        } catch (Exception e) {
            System.err.println("========================================");
            System.err.println("ERROR DURING DATA INITIALIZATION:");
            e.printStackTrace();
            System.err.println("========================================");
        }
    }

    private List<Project> createProjects() {
        Project project1 = new Project();
        project1.setName("Office Building Renovation");
        project1.setDescription("Complete renovation of a 6-story office building including structural upgrades and modern amenities");
        project1.setLocation("Amsterdam, Netherlands");
        project1.setClientName("ABC Corporation");
        project1.setClientContact("+31 20 555 7890");
        project1.setStartDate(LocalDateTime.of(2023, 6, 10, 9, 0));
        project1.setEndDate(LocalDateTime.of(2024, 11, 30, 17, 0));
        project1.setStatus("Active");
        project1.setTotalBudget(850000.00);

        Project project2 = new Project();
        project2.setName("Commercial Complex Development");
        project2.setDescription("Development of a multi-use commercial complex with retail spaces and offices");
        project2.setLocation("Rotterdam, Netherlands");
        project2.setClientName("XYZ Enterprises");
        project2.setClientContact("+31 10 456 7890");
        project2.setStartDate(LocalDateTime.of(2023, 9, 15, 8, 0));
        project2.setEndDate(LocalDateTime.of(2025, 3, 20, 18, 0));
        project2.setStatus("Active");
        project2.setTotalBudget(1200000.00);

        Project project3 = new Project();
        project3.setName("Residential Apartments");
        project3.setDescription("Construction of a 4-building residential apartment complex with 120 units");
        project3.setLocation("Utrecht, Netherlands");
        project3.setClientName("Dutch Housing Corp");
        project3.setClientContact("+31 30 333 4455");
        project3.setStartDate(LocalDateTime.of(2023, 4, 5, 7, 30));
        project3.setEndDate(LocalDateTime.of(2024, 7, 30, 16, 0));
        project3.setStatus("On Hold");
        project3.setTotalBudget(750000.00);

        Project project4 = new Project();
        project4.setName("Industrial Warehouse");
        project4.setDescription("Construction of modern industrial warehouse with automated systems");
        project4.setLocation("Eindhoven, Netherlands");
        project4.setClientName("Logistics Pro BV");
        project4.setClientContact("+31 40 789 1234");
        project4.setStartDate(LocalDateTime.of(2024, 1, 15, 8, 0));
        project4.setEndDate(LocalDateTime.of(2024, 12, 15, 17, 0));
        project4.setStatus("Completed");
        project4.setTotalBudget(950000.00);

        return projectRepository.saveAll(Arrays.asList(project1, project2, project3, project4));
    }

    private List<Supplier> createSuppliers() {
        Supplier supplier1 = new Supplier();
        supplier1.setName("Dutch Building Supplies");
        supplier1.setContactPerson("Jan de Vries");
        supplier1.setEmail("info@dbsupplies.nl");
        supplier1.setPhone("+31 20 123 4567");
        supplier1.setAddress("Keizersgracht 123, 1015 CJ Amsterdam");
        supplier1.setTaxId("NL123456789B01");
        supplier1.setCategory("Building Materials");

        Supplier supplier2 = new Supplier();
        supplier2.setName("Rotterdam Steel Works");
        supplier2.setContactPerson("Pieter Bakker");
        supplier2.setEmail("sales@rsteel.nl");
        supplier2.setPhone("+31 10 987 6543");
        supplier2.setAddress("Maasboulevard 45, 3011 VL Rotterdam");
        supplier2.setTaxId("NL987654321B01");
        supplier2.setCategory("Steel & Metal");

        Supplier supplier3 = new Supplier();
        supplier3.setName("Dutch Electrical Systems");
        supplier3.setContactPerson("Marieke Jansen");
        supplier3.setEmail("contact@des.nl");
        supplier3.setPhone("+31 20 456 7890");
        supplier3.setAddress("Leidsestraat 88, 1017 PD Amsterdam");
        supplier3.setTaxId("NL456789123B01");
        supplier3.setCategory("Electrical");

        Supplier supplier4 = new Supplier();
        supplier4.setName("Green Energy Solutions");
        supplier4.setContactPerson("Thomas van Berg");
        supplier4.setEmail("info@greenenergy.nl");
        supplier4.setPhone("+31 30 555 9999");
        supplier4.setAddress("Energieweg 12, 3542 AD Utrecht");
        supplier4.setTaxId("NL555999888B01");
        supplier4.setCategory("Renewable Energy");

        return supplierRepository.saveAll(Arrays.asList(supplier1, supplier2, supplier3, supplier4));
    }

    private void createBudgetLines(List<Project> projects) {
        // Project 1 Budget Lines
        Project project1 = projects.get(0);
        createBudgetLine(project1, "STRUCT-001", "Structural Work", "Structure", 250000.00, 180000.00, "In Progress");
        createBudgetLine(project1, "ELEC-001", "Electrical Installation", "MEP", 150000.00, 95000.00, "In Progress");
        createBudgetLine(project1, "PLUMB-001", "Plumbing & HVAC", "MEP", 120000.00, 75000.00, "In Progress");
        createBudgetLine(project1, "FINISH-001", "Interior Finishes", "Finishes", 200000.00, 45000.00, "Pending");
        createBudgetLine(project1, "EXTERIOR-001", "Exterior Works", "Finishes", 130000.00, 20000.00, "Pending");

        // Project 2 Budget Lines
        Project project2 = projects.get(1);
        createBudgetLine(project2, "FOUND-001", "Foundation Work", "Structure", 300000.00, 275000.00, "Completed");
        createBudgetLine(project2, "FRAME-001", "Steel Frame", "Structure", 400000.00, 320000.00, "In Progress");
        createBudgetLine(project2, "MEP-001", "MEP Systems", "MEP", 250000.00, 125000.00, "In Progress");
        createBudgetLine(project2, "GLAZING-001", "Glazing & Facades", "Finishes", 200000.00, 35000.00, "Pending");

        // Project 3 Budget Lines
        Project project3 = projects.get(2);
        createBudgetLine(project3, "SITE-001", "Site Preparation", "Site Work", 80000.00, 80000.00, "Completed");
        createBudgetLine(project3, "CONCRETE-001", "Concrete Work", "Structure", 180000.00, 120000.00, "On Hold");
        createBudgetLine(project3, "MASONRY-001", "Masonry Work", "Structure", 150000.00, 85000.00, "On Hold");

        // Project 4 Budget Lines
        Project project4 = projects.get(3);
        createBudgetLine(project4, "WAREHOUSE-001", "Warehouse Structure", "Structure", 400000.00, 400000.00, "Completed");
        createBudgetLine(project4, "AUTO-001", "Automation Systems", "Technology", 300000.00, 300000.00, "Completed");
        createBudgetLine(project4, "LOADING-001", "Loading Dock Systems", "Equipment", 250000.00, 250000.00, "Completed");
    }

    private void createBudgetLine(Project project, String code, String description, String category, 
                                  Double estimatedAmount, Double spentAmount, String status) {
        BudgetLine budgetLine = new BudgetLine();
        budgetLine.setProject(project);
        budgetLine.setDescription(code + " - " + description);
        budgetLine.setCategory(category);
        budgetLine.setEstimatedAmount(estimatedAmount);
        budgetLine.setSpentAmount(spentAmount);
        budgetLine.setStatus(status);
        budgetLineRepository.save(budgetLine);
    }

    private void createTasks(List<Project> projects) {
        // Project 1 Tasks
        Project project1 = projects.get(0);
        createTask(project1, "Market Analysis", "Initial market research and feasibility study", false, 
                   LocalDateTime.of(2023, 6, 10, 9, 0), 14, 100.0, "Completed");
        createTask(project1, "Feasibility Study", "Technical and financial feasibility analysis", false,
                   LocalDateTime.of(2023, 6, 24, 9, 0), 10, 100.0, "Completed");
        createTask(project1, "Design Phase", "Architectural and structural design", true,
                   LocalDateTime.of(2023, 7, 5, 9, 0), 30, 85.0, "In Progress");
        createTask(project1, "Permit Acquisition", "Building permits and approvals", true,
                   LocalDateTime.of(2023, 8, 1, 9, 0), 21, 90.0, "In Progress");
        createTask(project1, "Structural Work", "Main structural construction phase", false,
                   LocalDateTime.of(2023, 9, 1, 9, 0), 60, 75.0, "In Progress");

        // Project 2 Tasks
        Project project2 = projects.get(1);
        createTask(project2, "Site Preparation", "Site clearing and preparation", false,
                   LocalDateTime.of(2023, 9, 15, 8, 0), 20, 100.0, "Completed");
        createTask(project2, "Foundation", "Foundation and basement construction", true,
                   LocalDateTime.of(2023, 10, 10, 8, 0), 45, 100.0, "Completed");
        createTask(project2, "Steel Frame Construction", "Main structural steel frame", false,
                   LocalDateTime.of(2023, 12, 1, 8, 0), 75, 65.0, "In Progress");
        createTask(project2, "MEP Rough-in", "Mechanical, electrical, and plumbing rough-in", false,
                   LocalDateTime.of(2024, 2, 15, 8, 0), 40, 45.0, "In Progress");

        // Project 3 Tasks
        Project project3 = projects.get(2);
        createTask(project3, "Site Survey", "Topographical and geotechnical survey", false,
                   LocalDateTime.of(2023, 4, 5, 7, 30), 10, 100.0, "Completed");
        createTask(project3, "Building A Foundation", "Foundation work for Building A", true,
                   LocalDateTime.of(2023, 4, 20, 7, 30), 25, 100.0, "Completed");
        createTask(project3, "Building A Structure", "Structural work for Building A", false,
                   LocalDateTime.of(2023, 5, 20, 7, 30), 40, 60.0, "On Hold");

        // Project 4 Tasks
        Project project4 = projects.get(3);
        createTask(project4, "Warehouse Construction", "Main warehouse structure", false,
                   LocalDateTime.of(2024, 1, 15, 8, 0), 90, 100.0, "Completed");
        createTask(project4, "Automation Installation", "Automated systems installation", true,
                   LocalDateTime.of(2024, 4, 15, 8, 0), 60, 100.0, "Completed");
        createTask(project4, "Testing & Commissioning", "System testing and commissioning", true,
                   LocalDateTime.of(2024, 7, 15, 8, 0), 30, 100.0, "Completed");
    }

    private void createTask(Project project, String name, String description, boolean milestone,
                           LocalDateTime startDate, int duration, double completionPct, String status) {
        Task task = new Task();
        task.setProject(project);
        task.setName(name);
        task.setDescription(description);
        task.setMilestone(milestone);
        task.setPlannedStartDate(startDate);
        task.setDuration(duration);
        task.setCompletionPercentage(completionPct);
        task.setStatus(status);
        taskRepository.save(task);
    }

    private void createInvoices(List<Supplier> suppliers) {
        // Get budget lines to associate with invoices
        List<BudgetLine> budgetLines = budgetLineRepository.findAll();
        
        if (!budgetLines.isEmpty()) {
            // Invoice 1
            createInvoice("INV-2024-001", LocalDateTime.of(2024, 1, 15, 10, 0), 45000.00,
                         "Structural steel delivery", "PAID", suppliers.get(1), budgetLines.get(0),
                         LocalDateTime.of(2024, 2, 15, 10, 0), LocalDateTime.of(2024, 2, 10, 14, 30));

            // Invoice 2
            createInvoice("INV-2024-002", LocalDateTime.of(2024, 2, 20, 11, 0), 32000.00,
                         "Electrical materials and components", "PAID", suppliers.get(2), budgetLines.get(1),
                         LocalDateTime.of(2024, 3, 20, 11, 0), LocalDateTime.of(2024, 3, 15, 16, 45));

            // Invoice 3
            createInvoice("INV-2024-003", LocalDateTime.of(2024, 3, 10, 9, 30), 28500.00,
                         "Concrete and cement supplies", "PENDING", suppliers.get(0), budgetLines.get(2),
                         LocalDateTime.of(2024, 4, 10, 9, 30), null);

            // Invoice 4
            createInvoice("INV-2024-004", LocalDateTime.of(2024, 3, 25, 14, 0), 15750.00,
                         "Solar panel installation equipment", "OVERDUE", suppliers.get(3), budgetLines.get(3),
                         LocalDateTime.of(2024, 4, 25, 14, 0), null);

            // Invoice 5
            createInvoice("INV-2024-005", LocalDateTime.of(2024, 4, 5, 10, 15), 67500.00,
                         "Steel frame components - Phase 2", "PAID", suppliers.get(1), budgetLines.get(4),
                         LocalDateTime.of(2024, 5, 5, 10, 15), LocalDateTime.of(2024, 5, 1, 11, 20));
        }
    }

    private void createInvoice(String invoiceNumber, LocalDateTime invoiceDate, Double amount, String description,
                              String status, Supplier supplier, BudgetLine budgetLine, LocalDateTime dueDate, LocalDateTime paidDate) {
        Invoice invoice = new Invoice();
        invoice.setInvoiceNumber(invoiceNumber);
        invoice.setInvoiceDate(invoiceDate);
        invoice.setAmount(amount);
        invoice.setDescription(description);
        invoice.setStatus(status);
        invoice.setSupplier(supplier);
        invoice.setBudgetLine(budgetLine);
        invoice.setDueDate(dueDate);
        invoice.setPaidDate(paidDate);
        invoiceRepository.save(invoice);
    }

    private void createPaymentTerms(List<Project> projects) {
        // Payment terms for Project 1
        Project project1 = projects.get(0);
        createPaymentTerm(project1, "Initial Payment - 10%", 85000.00, LocalDateTime.of(2023, 6, 15, 12, 0), "PAID");
        createPaymentTerm(project1, "Design Completion - 20%", 170000.00, LocalDateTime.of(2023, 8, 1, 12, 0), "PAID");
        createPaymentTerm(project1, "Structural 50% - 25%", 212500.00, LocalDateTime.of(2023, 11, 15, 12, 0), "PENDING");
        createPaymentTerm(project1, "Completion - 35%", 297500.00, LocalDateTime.of(2024, 10, 30, 12, 0), "PENDING");

        // Payment terms for Project 2
        Project project2 = projects.get(1);
        createPaymentTerm(project2, "Mobilization - 15%", 180000.00, LocalDateTime.of(2023, 9, 20, 12, 0), "PAID");
        createPaymentTerm(project2, "Foundation Complete - 25%", 300000.00, LocalDateTime.of(2023, 12, 15, 12, 0), "PAID");
        createPaymentTerm(project2, "Structure 50% - 30%", 360000.00, LocalDateTime.of(2024, 6, 1, 12, 0), "PENDING");
        createPaymentTerm(project2, "Final Payment - 30%", 360000.00, LocalDateTime.of(2025, 2, 15, 12, 0), "PENDING");
    }

    private void createPaymentTerm(Project project, String description, Double amount, LocalDateTime dueDate, String status) {
        PaymentTerm paymentTerm = new PaymentTerm();
        paymentTerm.setProject(project);
        paymentTerm.setDescription(description);
        paymentTerm.setAmount(amount);
        paymentTerm.setDueDate(dueDate);
        paymentTerm.setStatus(status);
        paymentTermRepository.save(paymentTerm);
    }

    private void createAmendments(List<Project> projects) {
        // Amendment for Project 1
        Project project1 = projects.get(0);
        createAmendment(project1, "Change Order #1", "Additional electrical outlets in office areas", 15000.00,
                      LocalDateTime.of(2024, 2, 1, 10, 0), "APPROVED", "John Smith", LocalDateTime.of(2024, 2, 5, 14, 30));

        // Amendment for Project 2
        Project project2 = projects.get(1);
        createAmendment(project2, "Design Modification #1", "Upgrade HVAC system to high-efficiency units", 45000.00,
                      LocalDateTime.of(2024, 1, 15, 9, 0), "APPROVED", "Sarah Johnson", LocalDateTime.of(2024, 1, 20, 16, 0));

        // Amendment for Project 3
        Project project3 = projects.get(2);
        createAmendment(project3, "Scope Addition #1", "Additional parking spaces and landscaping", 25000.00,
                      LocalDateTime.of(2023, 8, 10, 11, 0), "PENDING", null, null);
    }

    private void createAmendment(Project project, String name, String description, Double amount,
                               LocalDateTime date, String status, String approvedBy, LocalDateTime approvalDate) {
        Amendment amendment = new Amendment();
        amendment.setProject(project);
        amendment.setName(name);
        amendment.setDescription(description);
        amendment.setAmount(amount);
        amendment.setDate(date);
        amendment.setStatus(status);
        amendment.setApprovedBy(approvedBy);
        amendment.setApprovalDate(approvalDate);
        amendmentRepository.save(amendment);
    }

    private void createWorkedHours() {
        List<Task> tasks = taskRepository.findAll();
        if (!tasks.isEmpty()) {
            // Sample worked hours for various weeks
            for (int week = 1; week <= 12; week++) {
                for (int taskIndex = 0; taskIndex < Math.min(tasks.size(), 5); taskIndex++) {
                    Task task = tasks.get(taskIndex);
                    double hours = 20 + (Math.random() * 20); // 20-40 hours per week
                    createWorkedHour(task, week, 2024, hours);
                }
            }
        }
    }

    private void createWorkedHour(Task task, int weekNumber, int year, double hours) {
        WorkedHour workedHour = new WorkedHour();
        workedHour.setTask(task);
        workedHour.setWeekNumber(weekNumber);
        workedHour.setYear(year);
        workedHour.setHours(hours);
        workedHour.setWorkerName("Construction Worker " + (weekNumber % 5 + 1));
        workedHour.setDescription("Weekly hours for " + task.getName());
        workedHour.setDate(LocalDateTime.of(year, 1, 1, 8, 0).plusWeeks(weekNumber - 1));
        workedHourRepository.save(workedHour);
    }
}