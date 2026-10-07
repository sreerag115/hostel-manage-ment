package com.hostel.model;

import java.sql.Date;

public class Complaint {
    private String complaintId;
    private String studentId; // null when anonymous
    private String category;
    private String complaint;
    private Date date;
    private String status;

    public Complaint() {}

    public Complaint(String complaintId, String studentId, String category, String complaint, Date date, String status) {
        this.complaintId = complaintId;
        this.studentId = studentId;
        this.category = category;
        this.complaint = complaint;
        this.date = date;
        this.status = status;
    }

    public String getComplaintId() { return complaintId; }
    public void setComplaintId(String complaintId) { this.complaintId = complaintId; }

    public String getStudentId() { return studentId; }
    public void setStudentId(String studentId) { this.studentId = studentId; }

    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }

    public String getComplaint() { return complaint; }
    public void setComplaint(String complaint) { this.complaint = complaint; }

    public Date getDate() { return date; }
    public void setDate(Date date) { this.date = date; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public boolean isAnonymous() {
        return studentId == null || studentId.trim().isEmpty();
    }
}
