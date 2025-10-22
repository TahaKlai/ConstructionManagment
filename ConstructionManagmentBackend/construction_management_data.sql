-- Construction Management Database - Sample Data
-- Execute these SQL statements in your MySQL database

-- First, let's insert roles
INSERT IGNORE INTO roles (id, name) VALUES 
(1, 'ROLE_ADMIN'),
(2, 'ROLE_USER');

-- Insert users (password is BCrypt encoded for 'admin123' and 'user123')
INSERT IGNORE INTO users (id, username, email, password, full_name, enabled, created_at, updated_at) VALUES 
(1, 'admin', 'admin@constructionmanagement.com', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iKWTn.qHvjvKNAhhZGVjv1bo.fcS', 'System Administrator', 1, NOW(), NOW()),
(2, 'user', 'user@constructionmanagement.com', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iKWTn.qHvjvKNAhhZGVjv1bo.fcS', 'Regular User', 1, NOW(), NOW());

-- Link users to roles
INSERT IGNORE INTO user_roles (user_id, role_id) VALUES 
(1, 1), -- admin has ROLE_ADMIN
(1, 2), -- admin has ROLE_USER
(2, 2); -- user has ROLE_USER

-- Insert projects
INSERT IGNORE INTO project (id, name, description, location, client_name, client_contact, start_date, end_date, status, total_budget, created_at, updated_at) VALUES 
(1, 'Office Building Renovation', 'Complete renovation of a 6-story office building including structural upgrades and modern amenities', 'Amsterdam, Netherlands', 'ABC Corporation', '+31 20 555 7890', '2023-06-10 09:00:00', '2024-11-30 17:00:00', 'Active', 850000.00, NOW(), NOW()),
(2, 'Commercial Complex Development', 'Development of a multi-use commercial complex with retail spaces and offices', 'Rotterdam, Netherlands', 'XYZ Enterprises', '+31 10 456 7890', '2023-09-15 08:00:00', '2025-03-20 18:00:00', 'Active', 1200000.00, NOW(), NOW()),
(3, 'Residential Apartments', 'Construction of a 4-building residential apartment complex with 120 units', 'Utrecht, Netherlands', 'Dutch Housing Corp', '+31 30 333 4455', '2023-04-05 07:30:00', '2024-07-30 16:00:00', 'On Hold', 750000.00, NOW(), NOW()),
(4, 'Industrial Warehouse', 'Construction of modern industrial warehouse with automated systems', 'Eindhoven, Netherlands', 'Logistics Pro BV', '+31 40 789 1234', '2024-01-15 08:00:00', '2024-12-15 17:00:00', 'Completed', 950000.00, NOW(), NOW());

-- Insert suppliers
INSERT IGNORE INTO supplier (id, name, contact_person, email, phone, address, tax_id, category, created_at, updated_at) VALUES 
(1, 'Dutch Building Supplies', 'Jan de Vries', 'info@dbsupplies.nl', '+31 20 123 4567', 'Keizersgracht 123, 1015 CJ Amsterdam', 'NL123456789B01', 'Building Materials', NOW(), NOW()),
(2, 'Rotterdam Steel Works', 'Pieter Bakker', 'sales@rsteel.nl', '+31 10 987 6543', 'Maasboulevard 45, 3011 VL Rotterdam', 'NL987654321B01', 'Steel & Metal', NOW(), NOW()),
(3, 'Dutch Electrical Systems', 'Marieke Jansen', 'contact@des.nl', '+31 20 456 7890', 'Leidsestraat 88, 1017 PD Amsterdam', 'NL456789123B01', 'Electrical', NOW(), NOW()),
(4, 'Green Energy Solutions', 'Thomas van Berg', 'info@greenenergy.nl', '+31 30 555 9999', 'Energieweg 12, 3542 AD Utrecht', 'NL555999888B01', 'Renewable Energy', NOW(), NOW());

-- Insert budget lines
INSERT IGNORE INTO budget_line (id, project_id, description, category, estimated_amount, spent_amount, status, created_at, updated_at) VALUES 
(1, 1, 'STRUCT-001 - Structural Work', 'Structure', 250000.00, 180000.00, 'In Progress', NOW(), NOW()),
(2, 1, 'ELEC-001 - Electrical Installation', 'MEP', 150000.00, 95000.00, 'In Progress', NOW(), NOW()),
(3, 1, 'PLUMB-001 - Plumbing & HVAC', 'MEP', 120000.00, 75000.00, 'In Progress', NOW(), NOW()),
(4, 1, 'FINISH-001 - Interior Finishes', 'Finishes', 200000.00, 45000.00, 'Pending', NOW(), NOW()),
(5, 1, 'EXTERIOR-001 - Exterior Works', 'Finishes', 130000.00, 20000.00, 'Pending', NOW(), NOW()),
(6, 2, 'FOUND-001 - Foundation Work', 'Structure', 300000.00, 275000.00, 'Completed', NOW(), NOW()),
(7, 2, 'FRAME-001 - Steel Frame', 'Structure', 400000.00, 320000.00, 'In Progress', NOW(), NOW()),
(8, 2, 'MEP-001 - MEP Systems', 'MEP', 250000.00, 125000.00, 'In Progress', NOW(), NOW()),
(9, 2, 'GLAZING-001 - Glazing & Facades', 'Finishes', 200000.00, 35000.00, 'Pending', NOW(), NOW()),
(10, 3, 'SITE-001 - Site Preparation', 'Site Work', 80000.00, 80000.00, 'Completed', NOW(), NOW()),
(11, 3, 'CONCRETE-001 - Concrete Work', 'Structure', 180000.00, 120000.00, 'On Hold', NOW(), NOW()),
(12, 3, 'MASONRY-001 - Masonry Work', 'Structure', 150000.00, 85000.00, 'On Hold', NOW(), NOW()),
(13, 4, 'WAREHOUSE-001 - Warehouse Structure', 'Structure', 400000.00, 400000.00, 'Completed', NOW(), NOW()),
(14, 4, 'AUTO-001 - Automation Systems', 'Technology', 300000.00, 300000.00, 'Completed', NOW(), NOW()),
(15, 4, 'LOADING-001 - Loading Dock Systems', 'Equipment', 250000.00, 250000.00, 'Completed', NOW(), NOW());

-- Insert tasks
INSERT IGNORE INTO task (id, project_id, name, description, milestone, planned_start_date, duration, completion_percentage, status, created_at, updated_at) VALUES 
(1, 1, 'Market Analysis', 'Initial market research and feasibility study', 0, '2023-06-10 09:00:00', 14, 100.0, 'Completed', NOW(), NOW()),
(2, 1, 'Feasibility Study', 'Technical and financial feasibility analysis', 0, '2023-06-24 09:00:00', 10, 100.0, 'Completed', NOW(), NOW()),
(3, 1, 'Design Phase', 'Architectural and structural design', 1, '2023-07-05 09:00:00', 30, 85.0, 'In Progress', NOW(), NOW()),
(4, 1, 'Permit Acquisition', 'Building permits and approvals', 1, '2023-08-01 09:00:00', 21, 90.0, 'In Progress', NOW(), NOW()),
(5, 1, 'Structural Work', 'Main structural construction phase', 0, '2023-09-01 09:00:00', 60, 75.0, 'In Progress', NOW(), NOW()),
(6, 2, 'Site Preparation', 'Site clearing and preparation', 0, '2023-09-15 08:00:00', 20, 100.0, 'Completed', NOW(), NOW()),
(7, 2, 'Foundation', 'Foundation and basement construction', 1, '2023-10-10 08:00:00', 45, 100.0, 'Completed', NOW(), NOW()),
(8, 2, 'Steel Frame Construction', 'Main structural steel frame', 0, '2023-12-01 08:00:00', 75, 65.0, 'In Progress', NOW(), NOW()),
(9, 2, 'MEP Rough-in', 'Mechanical, electrical, and plumbing rough-in', 0, '2024-02-15 08:00:00', 40, 45.0, 'In Progress', NOW(), NOW()),
(10, 3, 'Site Survey', 'Topographical and geotechnical survey', 0, '2023-04-05 07:30:00', 10, 100.0, 'Completed', NOW(), NOW()),
(11, 3, 'Building A Foundation', 'Foundation work for Building A', 1, '2023-04-20 07:30:00', 25, 100.0, 'Completed', NOW(), NOW()),
(12, 3, 'Building A Structure', 'Structural work for Building A', 0, '2023-05-20 07:30:00', 40, 60.0, 'On Hold', NOW(), NOW()),
(13, 4, 'Warehouse Construction', 'Main warehouse structure', 0, '2024-01-15 08:00:00', 90, 100.0, 'Completed', NOW(), NOW()),
(14, 4, 'Automation Installation', 'Automated systems installation', 1, '2024-04-15 08:00:00', 60, 100.0, 'Completed', NOW(), NOW()),
(15, 4, 'Testing & Commissioning', 'System testing and commissioning', 1, '2024-07-15 08:00:00', 30, 100.0, 'Completed', NOW(), NOW());

-- Insert invoices
INSERT IGNORE INTO invoice (id, invoice_number, invoice_date, amount, description, status, supplier_id, budget_line_id, due_date, paid_date, created_at, updated_at) VALUES 
(1, 'INV-2024-001', '2024-01-15 10:00:00', 45000.00, 'Structural steel delivery', 'PAID', 2, 1, '2024-02-15 10:00:00', '2024-02-10 14:30:00', NOW(), NOW()),
(2, 'INV-2024-002', '2024-02-20 11:00:00', 32000.00, 'Electrical materials and components', 'PAID', 3, 2, '2024-03-20 11:00:00', '2024-03-15 16:45:00', NOW(), NOW()),
(3, 'INV-2024-003', '2024-03-10 09:30:00', 28500.00, 'Concrete and cement supplies', 'PENDING', 1, 3, '2024-04-10 09:30:00', NULL, NOW(), NOW()),
(4, 'INV-2024-004', '2024-03-25 14:00:00', 15750.00, 'Solar panel installation equipment', 'OVERDUE', 4, 4, '2024-04-25 14:00:00', NULL, NOW(), NOW()),
(5, 'INV-2024-005', '2024-04-05 10:15:00', 67500.00, 'Steel frame components - Phase 2', 'PAID', 2, 5, '2024-05-05 10:15:00', '2024-05-01 11:20:00', NOW(), NOW());

-- Insert payment terms
INSERT IGNORE INTO payment_term (id, project_id, description, amount, due_date, status, created_at, updated_at) VALUES 
(1, 1, 'Initial Payment - 10%', 85000.00, '2023-06-15 12:00:00', 'PAID', NOW(), NOW()),
(2, 1, 'Design Completion - 20%', 170000.00, '2023-08-01 12:00:00', 'PAID', NOW(), NOW()),
(3, 1, 'Structural 50% - 25%', 212500.00, '2023-11-15 12:00:00', 'PENDING', NOW(), NOW()),
(4, 1, 'Completion - 35%', 297500.00, '2024-10-30 12:00:00', 'PENDING', NOW(), NOW()),
(5, 2, 'Mobilization - 15%', 180000.00, '2023-09-20 12:00:00', 'PAID', NOW(), NOW()),
(6, 2, 'Foundation Complete - 25%', 300000.00, '2023-12-15 12:00:00', 'PAID', NOW(), NOW()),
(7, 2, 'Structure 50% - 30%', 360000.00, '2024-06-01 12:00:00', 'PENDING', NOW(), NOW()),
(8, 2, 'Final Payment - 30%', 360000.00, '2025-02-15 12:00:00', 'PENDING', NOW(), NOW());

-- Insert amendments
INSERT IGNORE INTO amendment (id, project_id, name, description, amount, date, status, approved_by, approval_date, created_at, updated_at) VALUES 
(1, 1, 'Change Order #1', 'Additional electrical outlets in office areas', 15000.00, '2024-02-01 10:00:00', 'APPROVED', 'John Smith', '2024-02-05 14:30:00', NOW(), NOW()),
(2, 2, 'Design Modification #1', 'Upgrade HVAC system to high-efficiency units', 45000.00, '2024-01-15 09:00:00', 'APPROVED', 'Sarah Johnson', '2024-01-20 16:00:00', NOW(), NOW()),
(3, 3, 'Scope Addition #1', 'Additional parking spaces and landscaping', 25000.00, '2023-08-10 11:00:00', 'PENDING', NULL, NULL, NOW(), NOW());

-- Insert worked hours
INSERT IGNORE INTO worked_hour (id, task_id, week_number, year, hours, worker_name, description, date, created_at, updated_at) VALUES 
(1, 1, 1, 2024, 35.5, 'Construction Worker 1', 'Weekly hours for Market Analysis', '2024-01-08 08:00:00', NOW(), NOW()),
(2, 1, 2, 2024, 38.0, 'Construction Worker 2', 'Weekly hours for Market Analysis', '2024-01-15 08:00:00', NOW(), NOW()),
(3, 2, 3, 2024, 42.0, 'Construction Worker 3', 'Weekly hours for Feasibility Study', '2024-01-22 08:00:00', NOW(), NOW()),
(4, 2, 4, 2024, 36.5, 'Construction Worker 4', 'Weekly hours for Feasibility Study', '2024-01-29 08:00:00', NOW(), NOW()),
(5, 3, 5, 2024, 40.0, 'Construction Worker 5', 'Weekly hours for Design Phase', '2024-02-05 08:00:00', NOW(), NOW()),
(6, 3, 6, 2024, 37.5, 'Construction Worker 1', 'Weekly hours for Design Phase', '2024-02-12 08:00:00', NOW(), NOW()),
(7, 4, 7, 2024, 39.0, 'Construction Worker 2', 'Weekly hours for Permit Acquisition', '2024-02-19 08:00:00', NOW(), NOW()),
(8, 4, 8, 2024, 41.5, 'Construction Worker 3', 'Weekly hours for Permit Acquisition', '2024-02-26 08:00:00', NOW(), NOW()),
(9, 5, 9, 2024, 44.0, 'Construction Worker 4', 'Weekly hours for Structural Work', '2024-03-04 08:00:00', NOW(), NOW()),
(10, 5, 10, 2024, 38.5, 'Construction Worker 5', 'Weekly hours for Structural Work', '2024-03-11 08:00:00', NOW(), NOW());

-- Verify data insertion
SELECT 'Users Count:' as Info, COUNT(*) as Count FROM users
UNION ALL
SELECT 'Projects Count:', COUNT(*) FROM project
UNION ALL
SELECT 'Suppliers Count:', COUNT(*) FROM supplier
UNION ALL
SELECT 'Budget Lines Count:', COUNT(*) FROM budget_line
UNION ALL
SELECT 'Tasks Count:', COUNT(*) FROM task
UNION ALL
SELECT 'Invoices Count:', COUNT(*) FROM invoice
UNION ALL
SELECT 'Payment Terms Count:', COUNT(*) FROM payment_term
UNION ALL
SELECT 'Amendments Count:', COUNT(*) FROM amendment
UNION ALL
SELECT 'Worked Hours Count:', COUNT(*) FROM worked_hour;