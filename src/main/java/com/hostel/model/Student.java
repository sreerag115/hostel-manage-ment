package com.hostel.model;

public class Student {
    private String studentId;
    private String name;
    private String password;
    private String department;
    private int semester;
    private String phone;
    private String roomId;

    public Student() {}

    public Student(String studentId, String name, String password, String department, int semester, String phone, String roomId) {
        this.studentId = studentId;
        this.name = name;
        this.password = password;
        this.department = department;
        this.semester = semester;
        this.phone = phone;
        this.roomId = roomId;
    }

    public String getStudentId() { return studentId; }
    public void setStudentId(String studentId) { this.studentId = studentId; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }

    public String getDepartment() { return department; }
    public void setDepartment(String department) { this.department = department; }

    public int getSemester() { return semester; }
    public void setSemester(int semester) { this.semester = semester; }

    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }

    public String getRoomId() { return roomId; }
    public void setRoomId(String roomId) { this.roomId = roomId; }
}
