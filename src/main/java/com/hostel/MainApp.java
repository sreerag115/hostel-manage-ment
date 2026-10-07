package com.hostel;

import com.hostel.dao.*;
import com.hostel.model.*;

import java.sql.Date;
import java.time.LocalDate;
import java.util.List;
import java.util.Scanner;

public class MainApp {

    private static final Scanner scanner = new Scanner(System.in);
    private static final RoomDAO roomDAO = new RoomDAO();
    private static final StudentDAO studentDAO = new StudentDAO();
    private static final FeeDAO feeDAO = new FeeDAO();
    private static final ComplaintDAO complaintDAO = new ComplaintDAO();
    private static final AdminDAO adminDAO = new AdminDAO();
    private static final AttendanceDAO attendanceDAO = new AttendanceDAO();
    private static final FoodMenuDAO foodMenuDAO = new FoodMenuDAO();

    public static void main(String[] args) {
        System.out.println("==================================================");
        System.out.println("   HOSTEL MANAGEMENT SYSTEM (Java + MySQL)");
        System.out.println("==================================================");

        while (true) {
            System.out.println("\nSelect Role to Continue:");
            System.out.println("1. Admin / Warden Login");
            System.out.println("2. Student Login");
            System.out.println("3. View Room Availability (Public / Guest)");
            System.out.println("4. View Hostel Food Mess Menu");
            System.out.println("5. Anonymous Complaint Box");
            System.out.println("6. Exit");
            System.out.print("Enter choice (1-6): ");

            String choice = scanner.nextLine().trim();
            switch (choice) {
                case "1": adminLogin(); break;
                case "2": studentLogin(); break;
                case "3": viewRooms(); break;
                case "4": viewFoodMenu(); break;
                case "5": submitAnonymousComplaint(); break;
                case "6":
                    System.out.println("Exiting system. Goodbye!");
                    System.exit(0);
                    break;
                default:
                    System.out.println("Invalid selection. Please choose 1-6.");
            }
        }
    }

    // ==============================================================
    // ADMIN FLOW
    // ==============================================================
    private static void adminLogin() {
        System.out.print("\nEnter Admin Username (demo: admin): ");
        String u = scanner.nextLine().trim();
        System.out.print("Enter Admin Password (demo: admin123): ");
        String p = scanner.nextLine().trim();

        try {
            if (adminDAO.login(u, p)) {
                System.out.println("\nLogin successful! Welcome, Warden / Administrator.");
                adminMenu();
            } else {
                System.out.println("Invalid credentials.");
            }
        } catch (Exception e) {
            System.err.println("Database error during login: " + e.getMessage());
            System.out.println("Hint: Make sure MySQL is running and database/schema.sql is imported.");
        }
    }

    private static void adminMenu() {
        while (true) {
            System.out.println("\n---------------- ADMIN MENU ----------------");
            System.out.println("1.  Room Management (Capacity, Occupancy & Vacancy)");
            System.out.println("2.  Add New Room");
            System.out.println("3.  View All Students");
            System.out.println("4.  Add Student");
            System.out.println("5.  Allocate Room to Student (Stored in DB)");
            System.out.println("6.  Vacate Student from Room");
            System.out.println("7.  Mark Daily Student Attendance (Present/Absent)");
            System.out.println("8.  View Attendance by Date");
            System.out.println("9.  View & Update Food Mess Menu");
            System.out.println("10. View & Manage Complaints");
            System.out.println("11. View & Add Fee Records");
            System.out.println("12. Logout to Main Menu");
            System.out.print("Enter option (1-12): ");

            String opt = scanner.nextLine().trim();
            try {
                switch (opt) {
                    case "1": viewRooms(); break;
                    case "2": addRoom(); break;
                    case "3": viewStudents(); break;
                    case "4": addStudent(); break;
                    case "5": allocateRoom(); break;
                    case "6": vacateStudent(); break;
                    case "7": markAttendanceMenu(); break;
                    case "8": viewAttendanceMenu(); break;
                    case "9": manageFoodMenu(); break;
                    case "10": manageComplaints(); break;
                    case "11": viewFees(); break;
                    case "12": return;
                    default: System.out.println("Invalid option.");
                }
            } catch (Exception e) {
                System.err.println("Operation failed: " + e.getMessage());
            }
        }
    }

    // ==============================================================
    // ATTENDANCE MANAGEMENT
    // ==============================================================
    private static void markAttendanceMenu() throws Exception {
        List<Student> students = studentDAO.getAllStudents();
        Date today = Date.valueOf(LocalDate.now());
        System.out.println("\n--- Marking Attendance for Today (" + today + ") ---");
        for (Student s : students) {
            System.out.print("Student " + s.getStudentId() + " - " + s.getName() + " [P]resent / [A]bsent / [L]eave (Default P): ");
            String input = scanner.nextLine().trim().toUpperCase();
            String status = "Present";
            if ("A".equals(input)) status = "Absent";
            else if ("L".equals(input)) status = "On Leave";

            System.out.print("Remarks (or press Enter to skip): ");
            String remarks = scanner.nextLine().trim();

            attendanceDAO.markAttendance(s.getStudentId(), today, status, remarks.isEmpty() ? null : remarks);
        }
        System.out.println("Attendance marked successfully in database!");
    }

    private static void viewAttendanceMenu() throws Exception {
        System.out.print("Enter Date (YYYY-MM-DD) or press Enter for today: ");
        String dStr = scanner.nextLine().trim();
        Date date = dStr.isEmpty() ? Date.valueOf(LocalDate.now()) : Date.valueOf(dStr);

        List<Attendance> list = attendanceDAO.getAttendanceByDate(date);
        System.out.println("\n================ ATTENDANCE REPORT: " + date + " ================");
        System.out.printf("%-12s %-12s %-20s%n", "Student ID", "Status", "Remarks");
        System.out.println("-----------------------------------------------------------------");
        if (list.isEmpty()) {
            System.out.println("No attendance recorded for this date.");
        } else {
            for (Attendance a : list) {
                System.out.printf("%-12s %-12s %-20s%n", a.getStudentId(), a.getStatus(), a.getRemarks() == null ? "-" : a.getRemarks());
            }
        }
    }

    // ==============================================================
    // FOOD MESS MENU
    // ==============================================================
    private static void viewFoodMenu() {
        try {
            List<FoodMenu> menu = foodMenuDAO.getWeeklyMenu();
            System.out.println("\n======================= WEEKLY MESS FOOD MENU =======================");
            for (FoodMenu fm : menu) {
                System.out.println("\n[" + fm.getDayOfWeek().toUpperCase() + "]");
                System.out.println("  • Breakfast : " + fm.getBreakfast());
                System.out.println("  • Lunch     : " + fm.getLunch());
                System.out.println("  • Snacks    : " + fm.getSnacks());
                System.out.println("  • Dinner    : " + fm.getDinner());
            }
        } catch (Exception e) {
            System.err.println("Could not load food menu: " + e.getMessage());
        }
    }

    private static void manageFoodMenu() throws Exception {
        viewFoodMenu();
        System.out.print("\nDo you want to edit a day's menu? (y/n): ");
        if ("y".equalsIgnoreCase(scanner.nextLine().trim())) {
            System.out.print("Enter Day of Week (e.g. Monday): ");
            String day = scanner.nextLine().trim();
            System.out.print("New Breakfast: ");
            String bf = scanner.nextLine().trim();
            System.out.print("New Lunch: ");
            String lu = scanner.nextLine().trim();
            System.out.print("New Snacks: ");
            String sn = scanner.nextLine().trim();
            System.out.print("New Dinner: ");
            String dn = scanner.nextLine().trim();

            if (foodMenuDAO.updateMenu(day, bf, lu, sn, dn)) {
                System.out.println("Food menu updated successfully in MySQL!");
            } else {
                System.out.println("Update failed. Make sure the day name is correct.");
            }
        }
    }

    // ==============================================================
    // ROOM OPERATIONS
    // ==============================================================
    private static void viewRooms() {
        try {
            List<Room> rooms = roomDAO.getAllRooms();
            System.out.println("\n================= ROOM STATUS & VACANCY =================");
            System.out.printf("%-10s %-10s %-10s %-10s %-10s %-12s%n",
                    "Room ID", "Type", "Capacity", "Occupied", "Vacancy", "Status");
            System.out.println("---------------------------------------------------------");
            int totalVac = 0;
            for (Room r : rooms) {
                System.out.printf("%-10s %-10s %-10d %-10d %-10d %-12s%n",
                        r.getRoomId(), r.getRoomType(), r.getCapacity(),
                        r.getOccupied(), r.getVacancy(), r.getStatus());
                totalVac += r.getVacancy();
            }
            System.out.println("---------------------------------------------------------");
            System.out.println("Total Rooms: " + rooms.size() + " | Total Available Vacancy Slots: " + totalVac);
        } catch (Exception e) {
            System.err.println("Could not fetch rooms: " + e.getMessage());
        }
    }

    private static void addRoom() throws Exception {
        System.out.print("Enter Room ID / Number (e.g., 305): ");
        String id = scanner.nextLine().trim();
        System.out.print("Enter Room Type (Single/Double/Triple): ");
        String type = scanner.nextLine().trim();
        System.out.print("Enter Capacity (e.g., 2): ");
        int cap = Integer.parseInt(scanner.nextLine().trim());
        System.out.print("Enter Floor (1st/2nd/3rd): ");
        String floor = scanner.nextLine().trim();

        Room r = new Room(id, type, cap, 0, floor, "available");
        if (roomDAO.addRoom(r)) {
            System.out.println("Room " + id + " added successfully!");
        } else {
            System.out.println("Failed to add room.");
        }
    }

    // ==============================================================
    // STUDENT & ALLOCATION OPERATIONS
    // ==============================================================
    private static void viewStudents() throws Exception {
        List<Student> students = studentDAO.getAllStudents();
        System.out.println("\n====================== STUDENTS LIST ======================");
        System.out.printf("%-10s %-20s %-18s %-5s %-12s %-10s%n",
                "ID", "Name", "Department", "Sem", "Phone", "Room");
        System.out.println("-----------------------------------------------------------");
        for (Student s : students) {
            System.out.printf("%-10s %-20s %-18s %-5d %-12s %-10s%n",
                    s.getStudentId(), s.getName(), s.getDepartment(),
                    s.getSemester(), s.getPhone(),
                    s.getRoomId() == null ? "None" : s.getRoomId());
        }
    }

    private static void addStudent() throws Exception {
        System.out.print("Enter Student ID (e.g. S008): ");
        String id = scanner.nextLine().trim();
        System.out.print("Enter Full Name: ");
        String name = scanner.nextLine().trim();
        System.out.print("Enter Department: ");
        String dept = scanner.nextLine().trim();
        System.out.print("Enter Semester (number): ");
        int sem = Integer.parseInt(scanner.nextLine().trim());
        System.out.print("Enter Phone Number: ");
        String phone = scanner.nextLine().trim();
        System.out.print("Assign Room ID (leave blank if unassigned): ");
        String room = scanner.nextLine().trim();
        if (room.isEmpty()) room = null;

        Student s = new Student(id, name, "student123", dept, sem, phone, room);
        if (studentDAO.addStudent(s)) {
            System.out.println("Student added successfully!");
        } else {
            System.out.println("Failed to add student.");
        }
    }

    private static void allocateRoom() throws Exception {
        System.out.print("Enter Student ID to allocate: ");
        String sid = scanner.nextLine().trim();
        System.out.print("Enter target Room ID (with vacancy): ");
        String rid = scanner.nextLine().trim();

        Room r = roomDAO.getRoomById(rid);
        if (r == null) {
            System.out.println("Room does not exist.");
            return;
        }
        if (r.getVacancy() <= 0) {
            System.out.println("Cannot allocate: Room " + rid + " is already FULL!");
            return;
        }

        if (studentDAO.allocateRoom(sid, rid)) {
            System.out.println("Room " + rid + " successfully allocated to Student " + sid + "!");
        } else {
            System.out.println("Allocation failed.");
        }
    }

    private static void vacateStudent() throws Exception {
        System.out.print("Enter Student ID to vacate: ");
        String sid = scanner.nextLine().trim();
        if (studentDAO.vacateStudent(sid)) {
            System.out.println("Student " + sid + " vacated. Room vacancy incremented!");
        } else {
            System.out.println("Failed to vacate student.");
        }
    }

    // ==============================================================
    // COMPLAINT OPERATIONS
    // ==============================================================
    private static void manageComplaints() throws Exception {
        List<Complaint> list = complaintDAO.getAllComplaints();
        System.out.println("\n===================== COMPLAINTS BOARD =====================");
        System.out.printf("%-8s %-12s %-15s %-12s %-12s %-30s%n",
                "ID", "Sender", "Category", "Date", "Status", "Complaint");
        System.out.println("------------------------------------------------------------");
        for (Complaint c : list) {
            String sender = c.isAnonymous() ? "[Anonymous]" : c.getStudentId();
            System.out.printf("%-8s %-12s %-15s %-12s %-12s %-30s%n",
                    c.getComplaintId(), sender, c.getCategory(),
                    c.getDate(), c.getStatus(),
                    c.getComplaint().length() > 28 ? c.getComplaint().substring(0, 25) + "..." : c.getComplaint());
        }

        System.out.println("\nOptions: 1. Update Complaint Status | 2. Back");
        System.out.print("Choice: ");
        String ch = scanner.nextLine().trim();
        if ("1".equals(ch)) {
            System.out.print("Enter Complaint ID: ");
            String cid = scanner.nextLine().trim();
            System.out.print("Enter New Status (in-progress/resolved): ");
            String st = scanner.nextLine().trim();
            if (complaintDAO.updateStatus(cid, st)) {
                System.out.println("Complaint status updated in database!");
            } else {
                System.out.println("Update failed.");
            }
        }
    }

    private static void submitAnonymousComplaint() {
        System.out.println("\n============ ANONYMOUS COMPLAINT BOX ============");
        System.out.println("Your identity is 100% confidential. No Student ID is required.");
        System.out.print("Enter Category (Maintenance/Food/Electricity/Security/Other): ");
        String cat = scanner.nextLine().trim();
        System.out.print("Enter Complaint Description: ");
        String txt = scanner.nextLine().trim();

        if (txt.trim().isEmpty()) {
            System.out.println("Complaint description cannot be empty.");
            return;
        }

        String cid = "C" + System.currentTimeMillis() % 10000;
        Complaint c = new Complaint(cid, null, cat, txt, new Date(System.currentTimeMillis()), "pending");
        try {
            if (complaintDAO.addComplaint(c)) {
                System.out.println("\nSUCCESS: Anonymous complaint registered under ID: " + cid);
                System.out.println("Stored securely in MySQL database.");
            } else {
                System.out.println("Failed to submit complaint.");
            }
        } catch (Exception e) {
            System.err.println("Error saving complaint: " + e.getMessage());
        }
    }

    // ==============================================================
    // FEE OPERATIONS
    // ==============================================================
    private static void viewFees() throws Exception {
        List<Fee> fees = feeDAO.getAllFees();
        System.out.println("\n======================== FEE RECORDS ========================");
        System.out.printf("%-10s %-12s %-16s %-10s %-12s %-10s%n",
                "Fee ID", "Student ID", "Month", "Amount", "Date", "Status");
        System.out.println("-------------------------------------------------------------");
        for (Fee f : fees) {
            System.out.printf("%-10s %-12s %-16s ₹%-9.2f %-12s %-10s%n",
                    f.getFeeId(), f.getStudentId(), f.getMonth(),
                    f.getAmount(), f.getDate(), f.getStatus());
        }
    }

    // ==============================================================
    // STUDENT FLOW
    // ==============================================================
    private static void studentLogin() {
        System.out.print("\nEnter Student ID (demo: S001): ");
        String sid = scanner.nextLine().trim();
        System.out.print("Enter Password (demo: student123): ");
        String pass = scanner.nextLine().trim();

        try {
            Student s = studentDAO.login(sid, pass);
            if (s != null) {
                System.out.println("\nWelcome, " + s.getName() + " (" + s.getDepartment() + ")");
                studentMenu(s);
            } else {
                System.out.println("Invalid Student ID or password.");
            }
        } catch (Exception e) {
            System.err.println("Login error: " + e.getMessage());
        }
    }

    private static void studentMenu(Student s) {
        while (true) {
            System.out.println("\n---------------- STUDENT DASHBOARD ----------------");
            System.out.println("1. View My Room Details & Roommates");
            System.out.println("2. View My Attendance Record");
            System.out.println("3. View Today's & Weekly Mess Food Menu");
            System.out.println("4. Submit Anonymous Complaint");
            System.out.println("5. View Public Complaints Board");
            System.out.println("6. View My Fee Status");
            System.out.println("7. Logout");
            System.out.print("Choice: ");

            String ch = scanner.nextLine().trim();
            try {
                switch (ch) {
                    case "1":
                        if (s.getRoomId() == null) {
                            System.out.println("You are not currently allocated to any room.");
                        } else {
                            Room r = roomDAO.getRoomById(s.getRoomId());
                            System.out.println("\n--- My Room Details ---");
                            System.out.println("Room: " + r.getRoomId() + " (" + r.getRoomType() + ", Floor: " + r.getFloor() + ")");
                            System.out.println("Capacity: " + r.getCapacity() + " | Vacancy: " + r.getVacancy());
                            System.out.println("Roommates:");
                            List<Student> mates = studentDAO.getStudentsByRoom(s.getRoomId());
                            for (Student m : mates) {
                                System.out.println("- " + m.getName() + " (" + m.getDepartment() + ")" + (m.getStudentId().equals(s.getStudentId()) ? " [You]" : ""));
                            }
                        }
                        break;
                    case "2":
                        List<Attendance> myAtt = attendanceDAO.getAttendanceByStudent(s.getStudentId());
                        System.out.println("\n--- My Attendance Records ---");
                        for (Attendance a : myAtt) {
                            System.out.printf("Date: %-12s Status: %-12s Remarks: %s%n",
                                    a.getDate(), a.getStatus(), a.getRemarks() == null ? "-" : a.getRemarks());
                        }
                        break;
                    case "3":
                        viewFoodMenu();
                        break;
                    case "4":
                        submitAnonymousComplaint();
                        break;
                    case "5":
                        List<Complaint> allC = complaintDAO.getAllComplaints();
                        System.out.println("\n--- Public Complaints Board ---");
                        for (Complaint c : allC) {
                            System.out.printf("[%s] %-12s: %s (Status: %s)%n",
                                    c.getComplaintId(), c.getCategory(), c.getComplaint(), c.getStatus());
                        }
                        break;
                    case "6":
                        List<Fee> fees = feeDAO.getFeesByStudent(s.getStudentId());
                        System.out.println("\n--- My Fee Records ---");
                        for (Fee f : fees) {
                            System.out.printf("Month: %-15s Amount: ₹%-8.2f Status: %-10s%n",
                                    f.getMonth(), f.getAmount(), f.getStatus());
                        }
                        break;
                    case "7":
                        return;
                    default:
                        System.out.println("Invalid option.");
                }
            } catch (Exception e) {
                System.err.println("Error: " + e.getMessage());
            }
        }
    }
}
