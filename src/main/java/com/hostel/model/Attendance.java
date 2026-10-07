package com.hostel.model;

import java.sql.Date;

public class Attendance {
    private int attendanceId;
    private String studentId;
    private Date date;
    private String status; // Present, Absent, On Leave
    private String remarks;

    public Attendance() {}

    public Attendance(int attendanceId, String studentId, Date date, String status, String remarks) {
        this.attendanceId = attendanceId;
        this.studentId = studentId;
        this.date = date;
        this.status = status;
        this.remarks = remarks;
    }

    public int getAttendanceId() { return attendanceId; }
    public void setAttendanceId(int attendanceId) { this.attendanceId = attendanceId; }

    public String getStudentId() { return studentId; }
    public void setStudentId(String studentId) { this.studentId = studentId; }

    public Date getDate() { return date; }
    public void setDate(Date date) { this.date = date; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public String getRemarks() { return remarks; }
    public void setRemarks(String remarks) { this.remarks = remarks; }
}
