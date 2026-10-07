package com.hostel.model;

import java.sql.Date;

public class Fee {
    private String feeId;
    private String studentId;
    private double amount;
    private String month;
    private Date date;
    private String status;

    public Fee() {}

    public Fee(String feeId, String studentId, double amount, String month, Date date, String status) {
        this.feeId = feeId;
        this.studentId = studentId;
        this.amount = amount;
        this.month = month;
        this.date = date;
        this.status = status;
    }

    public String getFeeId() { return feeId; }
    public void setFeeId(String feeId) { this.feeId = feeId; }

    public String getStudentId() { return studentId; }
    public void setStudentId(String studentId) { this.studentId = studentId; }

    public double getAmount() { return amount; }
    public void setAmount(double amount) { this.amount = amount; }

    public String getMonth() { return month; }
    public void setMonth(String month) { this.month = month; }

    public Date getDate() { return date; }
    public void setDate(Date date) { this.date = date; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
}
