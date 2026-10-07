package com.hostel.dao;

import com.hostel.model.Attendance;
import com.hostel.util.DBConnection;

import java.sql.*;
import java.util.ArrayList;
import java.util.List;

public class AttendanceDAO {

    public boolean markAttendance(String studentId, Date date, String status, String remarks) throws SQLException {
        String sql = "INSERT INTO attendance (student_id, date, status, remarks) VALUES (?, ?, ?, ?) " +
                     "ON DUPLICATE KEY UPDATE status = VALUES(status), remarks = VALUES(remarks)";
        try (Connection con = DBConnection.getConnection();
             PreparedStatement ps = con.prepareStatement(sql)) {
            ps.setString(1, studentId);
            ps.setDate(2, date);
            ps.setString(3, status);
            ps.setString(4, remarks);
            return ps.executeUpdate() > 0;
        }
    }

    public List<Attendance> getAttendanceByDate(Date date) throws SQLException {
        List<Attendance> list = new ArrayList<>();
        String sql = "SELECT * FROM attendance WHERE date = ? ORDER BY student_id";
        try (Connection con = DBConnection.getConnection();
             PreparedStatement ps = con.prepareStatement(sql)) {
            ps.setDate(1, date);
            try (ResultSet rs = ps.executeQuery()) {
                while (rs.next()) {
                    list.add(new Attendance(
                        rs.getInt("attendance_id"),
                        rs.getString("student_id"),
                        rs.getDate("date"),
                        rs.getString("status"),
                        rs.getString("remarks")
                    ));
                }
            }
        }
        return list;
    }

    public List<Attendance> getAttendanceByStudent(String studentId) throws SQLException {
        List<Attendance> list = new ArrayList<>();
        String sql = "SELECT * FROM attendance WHERE student_id = ? ORDER BY date DESC";
        try (Connection con = DBConnection.getConnection();
             PreparedStatement ps = con.prepareStatement(sql)) {
            ps.setString(1, studentId);
            try (ResultSet rs = ps.executeQuery()) {
                while (rs.next()) {
                    list.add(new Attendance(
                        rs.getInt("attendance_id"),
                        rs.getString("student_id"),
                        rs.getDate("date"),
                        rs.getString("status"),
                        rs.getString("remarks")
                    ));
                }
            }
        }
        return list;
    }
}
