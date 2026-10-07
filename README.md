# HostelHub - Hostel Management System

A complete **Hostel Management System** featuring a **Java + MySQL** backend and a **Web UI frontend**, developed in accordance with requirements for room allocation, vacancy tracking, daily attendance, food mess menu, fee records, and an anonymous complaint box.

---

## 🌟 Key Features

1. **Room & Vacancy Management**:
   - Room capacity and real-time occupancy tracking.
   - Bed-by-bed allocation view.
   - Automated status updates (`available`, `partial`, `full`).
   - Dynamic vacancy calculation (`capacity - occupied`).

2. **Room Allocation & History**:
   - Assign students to vacant rooms.
   - Vacate students with automatic recalculation of room vacancies.
   - Track allocation and vacation timestamps in the database.

3. **Daily Attendance Marking**:
   - Mark students as `Present`, `Absent`, or `On Leave`.
   - Date-wise attendance reports and individual attendance history.

4. **Weekly Food Mess Menu**:
   - 7-day schedule covering Breakfast, Lunch, Evening Snacks, and Dinner.
   - Warden/Admin editing capability.

5. **Anonymous Complaint Box**:
   - Students can file complaints anonymously without revealing their ID.
   - Status tracking (`pending`, `in-progress`, `resolved`).
   - Public status board for transparency.

6. **Fee Management**:
   - Fee records with monthly amounts, due dates, and payment status (`paid` / `pending`).
   - Mark payments as paid.

---

## 📁 Repository Structure

```
hostel-manage-ment/
├── database/
│   └── schema.sql                 # Complete MySQL schema & initial seed data
├── frontend/
│   ├── index.html                 # Web dashboard & login portal
│   ├── style.css                  # Responsive styles & dashboard theme
│   └── app.js                     # Client-side logic & interaction
├── src/main/java/com/hostel/
│   ├── MainApp.java               # Interactive console application
│   ├── dao/
│   │   ├── AdminDAO.java
│   │   ├── AttendanceDAO.java
│   │   ├── ComplaintDAO.java
│   │   ├── FeeDAO.java
│   │   ├── FoodMenuDAO.java
│   │   ├── RoomDAO.java
│   │   └── StudentDAO.java
│   ├── model/
│   │   ├── Attendance.java
│   │   ├── Complaint.java
│   │   ├── Fee.java
│   │   ├── FoodMenu.java
│   │   ├── Room.java
│   │   └── Student.java
│   └── util/
│       └── DBConnection.java      # JDBC MySQL connection helper
├── pom.xml                        # Maven configuration & MySQL connector
├── .gitignore
└── README.md
```

---

## 🗄️ Database Schema (`hostel_db`)

The database contains the following tables:
- **`room`**: Room ID, Room Type, Capacity, Occupied count, Floor, Facilities, Status.
- **`student`**: Student ID, Name, Department, Semester, Phone, Room ID.
- **`admin_user`**: Warden login credentials.
- **`room_allocation`**: Allocation history, allocation date, vacated date, and status.
- **`attendance`**: Daily records with Student ID, Date, Status (`Present`, `Absent`, `On Leave`), and Remarks.
- **`food_menu`**: Mess schedule for all 7 days (Breakfast, Lunch, Snacks, Dinner).
- **`complaint`**: Complaint ID, Student ID (Nullable for **Anonymous** complaints), Category, Text, Date, Status.
- **`fee`**: Fee ID, Student ID, Amount, Month, Date, Status (`paid`, `pending`).

### Importing the Schema:
In MySQL (Workbench, phpMyAdmin, or terminal):
```sql
SOURCE database/schema.sql;
```

---

## ☕ How to Run the Java Application

1. Open this folder in an IDE (IntelliJ IDEA, Eclipse, VS Code, or NetBeans) as a **Maven project**.
2. Ensure MySQL server is running on `localhost:3306` with the `hostel_db` database imported.
3. Configure your database credentials if different from default in:
   `src/main/java/com/hostel/util/DBConnection.java`
4. Run:
   ```bash
   mvn compile exec:java -Dexec.mainClass="com.hostel.MainApp"
   ```
   Or run `MainApp.java` directly from your IDE.

---

## 🌐 How to Run the Web Frontend

Simply open `frontend/index.html` in any web browser, or serve it using any local web server:
```bash
python -m http.server 8000 --directory frontend
```
Then visit: `http://localhost:8000`

### Demo Credentials:
- **Admin**: `admin` / `admin123`
- **Student**: `S001` / `student123`
- **Guest**: Click **"View Rooms"** (No login required)
