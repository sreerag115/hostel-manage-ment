package com.hostel.dao;

import com.hostel.model.Fee;
import com.hostel.util.DBConnection;

import java.sql.*;
import java.util.ArrayList;
import java.util.List;

public class FeeDAO {

    public List<Fee> getAllFees() throws SQLException {
        List<Fee> list = new ArrayList<>();
        String sql = "SELECT * FROM fee ORDER BY date DESC, fee_id DESC";
        try (Connection con = DBConnection.getConnection();
             PreparedStatement ps = con.prepareStatement(sql);
             ResultSet rs = ps.executeQuery()) {
            while (rs.next()) {
                list.add(new Fee(
                    rs.getString("fee_id"),
                    rs.getString("student_id"),
                    rs.getDouble("amount"),
                    rs.getString("month"),
                    rs.getDate("date"),
                    rs.getString("status")
                ));
            }
        }
        return list;
    }

    public List<Fee> getFeesByStudent(String studentId) throws SQLException {
        List<Fee> list = new ArrayList<>();
        String sql = "SELECT * FROM fee WHERE student_id = ? ORDER BY date DESC";
        try (Connection con = DBConnection.getConnection();
             PreparedStatement ps = con.prepareStatement(sql)) {
            ps.setString(1, studentId);
            try (ResultSet rs = ps.executeQuery()) {
                while (rs.next()) {
                    list.add(new Fee(
                        rs.getString("fee_id"),
                        rs.getString("student_id"),
                        rs.getDouble("amount"),
                        rs.getString("month"),
                        rs.getDate("date"),
                        rs.getString("status")
                    ));
                }
            }
        }
        return list;
    }

    public boolean addFee(Fee f) throws SQLException {
        String sql = "INSERT INTO fee (fee_id, student_id, amount, month, date, status) VALUES (?, ?, ?, ?, ?, ?)";
        try (Connection con = DBConnection.getConnection();
             PreparedStatement ps = con.prepareStatement(sql)) {
            ps.setString(1, f.getFeeId());
            ps.setString(2, f.getStudentId());
            ps.setDouble(3, f.getAmount());
            ps.setString(4, f.getMonth());
            ps.setDate(5, f.getDate());
            ps.setString(6, f.getStatus());
            return ps.executeUpdate() > 0;
        }
    }

    public boolean markPaid(String feeId) throws SQLException {
        String sql = "UPDATE fee SET status = 'paid' WHERE fee_id = ?";
        try (Connection con = DBConnection.getConnection();
             PreparedStatement ps = con.prepareStatement(sql)) {
            ps.setString(1, feeId);
            return ps.executeUpdate() > 0;
        }
    }
}
