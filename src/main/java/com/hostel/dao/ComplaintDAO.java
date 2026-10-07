package com.hostel.dao;

import com.hostel.model.Complaint;
import com.hostel.util.DBConnection;

import java.sql.*;
import java.util.ArrayList;
import java.util.List;

public class ComplaintDAO {

    public List<Complaint> getAllComplaints() throws SQLException {
        List<Complaint> list = new ArrayList<>();
        String sql = "SELECT * FROM complaint ORDER BY date DESC, complaint_id DESC";
        try (Connection con = DBConnection.getConnection();
             PreparedStatement ps = con.prepareStatement(sql);
             ResultSet rs = ps.executeQuery()) {
            while (rs.next()) {
                list.add(new Complaint(
                    rs.getString("complaint_id"),
                    rs.getString("student_id"),
                    rs.getString("category"),
                    rs.getString("complaint"),
                    rs.getDate("date"),
                    rs.getString("status")
                ));
            }
        }
        return list;
    }

    public boolean addComplaint(Complaint c) throws SQLException {
        String sql = "INSERT INTO complaint (complaint_id, student_id, category, complaint, date, status) VALUES (?, ?, ?, ?, ?, ?)";
        try (Connection con = DBConnection.getConnection();
             PreparedStatement ps = con.prepareStatement(sql)) {
            ps.setString(1, c.getComplaintId());
            ps.setString(2, c.getStudentId()); // null for anonymous
            ps.setString(3, c.getCategory());
            ps.setString(4, c.getComplaint());
            ps.setDate(5, c.getDate());
            ps.setString(6, c.getStatus() == null ? "pending" : c.getStatus());
            return ps.executeUpdate() > 0;
        }
    }

    public boolean updateStatus(String complaintId, String newStatus) throws SQLException {
        String sql = "UPDATE complaint SET status = ? WHERE complaint_id = ?";
        try (Connection con = DBConnection.getConnection();
             PreparedStatement ps = con.prepareStatement(sql)) {
            ps.setString(1, newStatus);
            ps.setString(2, complaintId);
            return ps.executeUpdate() > 0;
        }
    }
}
