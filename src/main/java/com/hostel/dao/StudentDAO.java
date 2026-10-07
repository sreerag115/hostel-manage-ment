package com.hostel.dao;

import com.hostel.model.Student;
import com.hostel.util.DBConnection;

import java.sql.*;
import java.util.ArrayList;
import java.util.List;

public class StudentDAO {

    private RoomDAO roomDAO = new RoomDAO();

    public Student login(String studentId, String password) throws SQLException {
        String sql = "SELECT * FROM student WHERE student_id = ? AND password = ?";
        try (Connection con = DBConnection.getConnection();
             PreparedStatement ps = con.prepareStatement(sql)) {
            ps.setString(1, studentId);
            ps.setString(2, password);
            try (ResultSet rs = ps.executeQuery()) {
                if (rs.next()) {
                    return extractStudent(rs);
                }
            }
        }
        return null;
    }

    public List<Student> getAllStudents() throws SQLException {
        List<Student> list = new ArrayList<>();
        String sql = "SELECT * FROM student ORDER BY student_id";
        try (Connection con = DBConnection.getConnection();
             PreparedStatement ps = con.prepareStatement(sql);
             ResultSet rs = ps.executeQuery()) {
            while (rs.next()) {
                list.add(extractStudent(rs));
            }
        }
        return list;
    }

    public List<Student> getStudentsByRoom(String roomId) throws SQLException {
        List<Student> list = new ArrayList<>();
        String sql = "SELECT * FROM student WHERE room_id = ? ORDER BY student_id";
        try (Connection con = DBConnection.getConnection();
             PreparedStatement ps = con.prepareStatement(sql)) {
            ps.setString(1, roomId);
            try (ResultSet rs = ps.executeQuery()) {
                while (rs.next()) {
                    list.add(extractStudent(rs));
                }
            }
        }
        return list;
    }

    public boolean addStudent(Student s) throws SQLException {
        String sql = "INSERT INTO student (student_id, name, password, department, semester, phone, room_id) VALUES (?, ?, ?, ?, ?, ?, ?)";
        try (Connection con = DBConnection.getConnection();
             PreparedStatement ps = con.prepareStatement(sql)) {
            ps.setString(1, s.getStudentId());
            ps.setString(2, s.getName());
            ps.setString(3, s.getPassword() == null ? "student123" : s.getPassword());
            ps.setString(4, s.getDepartment());
            ps.setInt(5, s.getSemester());
            ps.setString(6, s.getPhone());
            ps.setString(7, s.getRoomId());
            boolean ok = ps.executeUpdate() > 0;
            if (ok && s.getRoomId() != null) {
                roomDAO.recalculateOccupancy(s.getRoomId());
            }
            return ok;
        }
    }

    public boolean allocateRoom(String studentId, String newRoomId) throws SQLException {
        String oldRoom = null;
        String getOld = "SELECT room_id FROM student WHERE student_id = ?";
        try (Connection con = DBConnection.getConnection();
             PreparedStatement ps = con.prepareStatement(getOld)) {
            ps.setString(1, studentId);
            try (ResultSet rs = ps.executeQuery()) {
                if (rs.next()) oldRoom = rs.getString("room_id");
            }
        }

        String sql = "UPDATE student SET room_id = ? WHERE student_id = ?";
        try (Connection con = DBConnection.getConnection();
             PreparedStatement ps = con.prepareStatement(sql)) {
            ps.setString(1, newRoomId);
            ps.setString(2, studentId);
            boolean ok = ps.executeUpdate() > 0;
            if (ok) {
                roomDAO.recalculateOccupancy(oldRoom);
                roomDAO.recalculateOccupancy(newRoomId);
            }
            return ok;
        }
    }

    public boolean vacateStudent(String studentId) throws SQLException {
        return allocateRoom(studentId, null);
    }

    public boolean deleteStudent(String studentId) throws SQLException {
        String oldRoom = null;
        String getOld = "SELECT room_id FROM student WHERE student_id = ?";
        try (Connection con = DBConnection.getConnection();
             PreparedStatement ps = con.prepareStatement(getOld)) {
            ps.setString(1, studentId);
            try (ResultSet rs = ps.executeQuery()) {
                if (rs.next()) oldRoom = rs.getString("room_id");
            }
        }

        String sql = "DELETE FROM student WHERE student_id = ?";
        try (Connection con = DBConnection.getConnection();
             PreparedStatement ps = con.prepareStatement(sql)) {
            ps.setString(1, studentId);
            boolean ok = ps.executeUpdate() > 0;
            if (ok && oldRoom != null) {
                roomDAO.recalculateOccupancy(oldRoom);
            }
            return ok;
        }
    }

    private Student extractStudent(ResultSet rs) throws SQLException {
        return new Student(
            rs.getString("student_id"),
            rs.getString("name"),
            rs.getString("password"),
            rs.getString("department"),
            rs.getInt("semester"),
            rs.getString("phone"),
            rs.getString("room_id")
        );
    }
}
