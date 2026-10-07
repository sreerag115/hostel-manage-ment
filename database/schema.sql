-- ==============================================================
-- HOSTEL MANAGEMENT SYSTEM - COMPLETE SQL DATABASE
-- Database: hostel_db
-- Tables Included:
--   1. room (Room capacity, occupancy & vacancy)
--   2. student (Student profile & assigned room)
--   3. admin_user (Warden / Admin credentials)
--   4. room_allocation (Tracks allocations & vacates history)
--   5. attendance (Daily student attendance records: Present/Absent)
--   6. food_menu (Weekly/Daily mess menu for Breakfast, Lunch, Snacks, Dinner)
--   7. complaint (Anonymous & named complaints with status tracking)
--   8. fee (Fee payment records & pending amounts)
-- ==============================================================

CREATE DATABASE IF NOT EXISTS hostel_db;
USE hostel_db;

-- -------------------------------------------------------------
-- 1. ROOM TABLE
-- -------------------------------------------------------------
CREATE TABLE IF NOT EXISTS room (
    room_id VARCHAR(20) PRIMARY KEY,
    room_type VARCHAR(20) NOT NULL,            -- Single, Double, Triple
    capacity INT NOT NULL,                     -- Max allowed students
    occupied INT DEFAULT 0,                    -- Current students in room
    floor VARCHAR(10) DEFAULT '1st',
    facilities VARCHAR(255) DEFAULT 'Fan, Bed, Desk',
    status VARCHAR(20) DEFAULT 'available'     -- available, partial, full
);

-- -------------------------------------------------------------
-- 2. STUDENT TABLE
-- -------------------------------------------------------------
CREATE TABLE IF NOT EXISTS student (
    student_id VARCHAR(20) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    password VARCHAR(100) DEFAULT 'student123',
    department VARCHAR(100) NOT NULL,
    semester INT DEFAULT 1,
    phone VARCHAR(20),
    room_id VARCHAR(20),
    FOREIGN KEY (room_id) REFERENCES room(room_id) ON DELETE SET NULL
);

-- -------------------------------------------------------------
-- 3. ADMIN / WARDEN TABLE
-- -------------------------------------------------------------
CREATE TABLE IF NOT EXISTS admin_user (
    username VARCHAR(50) PRIMARY KEY,
    password VARCHAR(100) NOT NULL,
    name VARCHAR(100) NOT NULL,
    phone VARCHAR(20)
);

-- -------------------------------------------------------------
-- 4. ROOM ALLOCATION TABLE (History & Room Assignment)
-- -------------------------------------------------------------
CREATE TABLE IF NOT EXISTS room_allocation (
    allocation_id INT AUTO_INCREMENT PRIMARY KEY,
    student_id VARCHAR(20) NOT NULL,
    room_id VARCHAR(20) NOT NULL,
    allocated_date DATE NOT NULL,
    vacated_date DATE NULL,                     -- NULL if currently staying
    status VARCHAR(20) DEFAULT 'active',        -- active, vacated
    FOREIGN KEY (student_id) REFERENCES student(student_id) ON DELETE CASCADE,
    FOREIGN KEY (room_id) REFERENCES room(room_id) ON DELETE CASCADE
);

-- -------------------------------------------------------------
-- 5. ATTENDANCE TABLE (Daily Attendance Marking)
-- -------------------------------------------------------------
CREATE TABLE IF NOT EXISTS attendance (
    attendance_id INT AUTO_INCREMENT PRIMARY KEY,
    student_id VARCHAR(20) NOT NULL,
    date DATE NOT NULL,
    status ENUM('Present', 'Absent', 'On Leave') DEFAULT 'Present',
    remarks VARCHAR(255) DEFAULT NULL,
    marked_by VARCHAR(50) DEFAULT 'Warden',
    UNIQUE KEY uq_student_date (student_id, date), -- One entry per student per day
    FOREIGN KEY (student_id) REFERENCES student(student_id) ON DELETE CASCADE
);

-- -------------------------------------------------------------
-- 6. FOOD MENU TABLE (Mess Schedule)
-- -------------------------------------------------------------
CREATE TABLE IF NOT EXISTS food_menu (
    menu_id INT AUTO_INCREMENT PRIMARY KEY,
    day_of_week VARCHAR(15) NOT NULL,           -- Monday, Tuesday, etc.
    breakfast TEXT NOT NULL,
    lunch TEXT NOT NULL,
    snacks TEXT NOT NULL,
    dinner TEXT NOT NULL
);

-- -------------------------------------------------------------
-- 7. COMPLAINT TABLE (With Anonymous Support)
-- -------------------------------------------------------------
CREATE TABLE IF NOT EXISTS complaint (
    complaint_id VARCHAR(20) PRIMARY KEY,
    student_id VARCHAR(20) NULL,                -- NULL = 100% Anonymous!
    category VARCHAR(50) NOT NULL,              -- Maintenance, Food, Electricity, Security, Water, etc.
    complaint TEXT NOT NULL,
    date DATE NOT NULL,
    status VARCHAR(20) DEFAULT 'pending',       -- pending, in-progress, resolved
    resolution_notes TEXT NULL,
    FOREIGN KEY (student_id) REFERENCES student(student_id) ON DELETE SET NULL
);

-- -------------------------------------------------------------
-- 8. FEE TABLE
-- -------------------------------------------------------------
CREATE TABLE IF NOT EXISTS fee (
    fee_id VARCHAR(20) PRIMARY KEY,
    student_id VARCHAR(20) NOT NULL,
    amount DECIMAL(10, 2) NOT NULL,
    month VARCHAR(30) NOT NULL,
    date DATE NOT NULL,
    status VARCHAR(20) DEFAULT 'pending',       -- paid, pending
    FOREIGN KEY (student_id) REFERENCES student(student_id) ON DELETE CASCADE
);

-- ==============================================================
-- INITIAL SAMPLE DATA SEEDING
-- ==============================================================

-- Admin
INSERT IGNORE INTO admin_user (username, password, name, phone) VALUES
('admin', 'admin123', 'Chief Warden', '9876500000');

-- Rooms
INSERT IGNORE INTO room (room_id, room_type, capacity, occupied, floor, facilities, status) VALUES
('101', 'Double', 2, 2, '1st', 'AC, Attached Bath', 'full'),
('102', 'Single', 1, 1, '1st', 'Fan, Common Bath', 'full'),
('103', 'Triple', 3, 2, '1st', 'Fan, Common Bath', 'partial'),
('104', 'Double', 2, 0, '1st', 'AC, Attached Bath', 'available'),
('201', 'Single', 1, 1, '2nd', 'Fan, Common Bath', 'full'),
('202', 'Double', 2, 0, '2nd', 'AC, Attached Bath', 'available'),
('203', 'Triple', 3, 0, '2nd', 'Fan, Attached Bath', 'available'),
('204', 'Single', 1, 0, '2nd', 'AC, Attached Bath', 'available'),
('301', 'Double', 2, 0, '3rd', 'Fan, Common Bath', 'available'),
('302', 'Triple', 3, 0, '3rd', 'AC, Attached Bath', 'available');

-- Students
INSERT IGNORE INTO student (student_id, name, password, department, semester, phone, room_id) VALUES
('S001', 'Arjun Krishnan', 'student123', 'Computer Science', 4, '9876543210', '101'),
('S002', 'Priya Menon', 'student123', 'Electronics', 4, '9876500001', '101'),
('S003', 'Rahul Nair', 'student123', 'Mechanical', 6, '9876500002', '102'),
('S004', 'Anjali Das', 'student123', 'Civil', 2, '9876500003', '103'),
('S005', 'Vikram Singh', 'student123', 'Computer Science', 2, '9876500004', '103'),
('S006', 'Meera Pillai', 'student123', 'Electronics', 4, '9876500005', '201'),
('S007', 'Kiran Kumar', 'student123', 'Information Tech', 2, '9876500006', NULL);

-- Room Allocations History
INSERT IGNORE INTO room_allocation (student_id, room_id, allocated_date, status) VALUES
('S001', '101', '2026-08-01', 'active'),
('S002', '101', '2026-08-01', 'active'),
('S003', '102', '2026-08-01', 'active'),
('S004', '103', '2026-08-05', 'active'),
('S005', '103', '2026-08-05', 'active'),
('S006', '201', '2026-08-10', 'active');

-- Attendance Records (Sample for today)
INSERT IGNORE INTO attendance (student_id, date, status, remarks) VALUES
('S001', CURDATE(), 'Present', 'Checked in 9:00 PM'),
('S002', CURDATE(), 'Present', 'Checked in 9:15 PM'),
('S003', CURDATE(), 'Absent', 'Home visit with pass'),
('S004', CURDATE(), 'Present', 'Checked in 8:45 PM'),
('S005', CURDATE(), 'Present', 'Checked in 9:00 PM'),
('S006', CURDATE(), 'On Leave', 'Medical leave submitted');

-- Weekly Food Menu
INSERT INTO food_menu (day_of_week, breakfast, lunch, snacks, dinner) VALUES
('Monday', 'Idli, Sambar, Coconut Chutney, Tea/Coffee', 'Rice, Dal Fry, Mixed Veg Curry, Curd', 'Tea/Coffee, Biscuits', 'Chapati, Paneer Butter Masala, Rice, Rasam'),
('Tuesday', 'Poori, Aloo Masala, Tea/Coffee', 'Lemon Rice, Potato Roast, Curd Rice, Pickle', 'Tea/Coffee, Samosa', 'Chapati, Chicken Curry / Veg Kadai, Steamed Rice'),
('Wednesday', 'Dosa, Tomato Chutney, Sambar, Tea/Coffee', 'South Indian Meals, Sambar, Poriyal, Curd', 'Tea/Coffee, Banana Fry', 'Jeera Rice, Dal Tadka, Roti, Salad'),
('Thursday', 'Puttu with Kadala Curry, Tea/Coffee', 'Rice, Fish Curry / Soya Chunk Curry, Rasam', 'Tea/Coffee, Veg Cutlet', 'Chapati, Egg Roast / Mushroom Masala, Rice'),
('Friday', 'Upma, Coconut Chutney, Banana, Tea/Coffee', 'Veg Pulao, Raita, Boiled Egg / Paneer, Chips', 'Tea/Coffee, Onion Pakoda', 'Ghee Rice, Dal Makhani, Chicken / Paneer Tikka'),
('Saturday', 'Aloo Paratha, Curd, Pickle, Tea/Coffee', 'Variety Rice (Tomato Rice), Fryums, Curd', 'Tea/Coffee, Cake', 'Chapati, Mixed Veg Kurma, Steamed Rice'),
('Sunday', 'Appam with Veg / Egg Stew, Tea/Coffee', 'Special Chicken Biryani / Veg Biryani, Raita', 'Tea/Coffee, Biscuits', 'Light Dinner: Chapati, Dal, Rice, Buttermilk')
ON DUPLICATE KEY UPDATE day_of_week=day_of_week;

-- Complaints (Anonymous and Identified)
INSERT IGNORE INTO complaint (complaint_id, student_id, category, complaint, date, status) VALUES
('C001', NULL, 'Maintenance', 'The bathroom tap in room 101 is leaking continuously.', '2026-10-01', 'pending'),
('C002', NULL, 'Food', 'Mess dinner rice on Tuesday was undercooked.', '2026-10-03', 'resolved'),
('C003', NULL, 'Security', 'Main gate security check is lax after 10 PM.', '2026-10-05', 'in-progress'),
('C004', 'S003', 'Electricity', 'Power socket on desk 2 in room 102 is sparking.', '2026-10-06', 'pending');

-- Fees
INSERT IGNORE INTO fee (fee_id, student_id, amount, month, date, status) VALUES
('F001', 'S001', 8000.00, 'September 2026', '2026-09-01', 'paid'),
('F002', 'S002', 8000.00, 'September 2026', '2026-09-01', 'paid'),
('F003', 'S003', 5000.00, 'September 2026', '2026-09-01', 'pending'),
('F004', 'S004', 6000.00, 'September 2026', '2026-09-01', 'paid'),
('F005', 'S005', 6000.00, 'September 2026', '2026-09-05', 'pending'),
('F006', 'S006', 5000.00, 'September 2026', '2026-09-01', 'paid'),
('F007', 'S001', 8000.00, 'October 2026', '2026-10-01', 'pending');
