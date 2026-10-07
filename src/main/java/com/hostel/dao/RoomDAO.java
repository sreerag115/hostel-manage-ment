package com.hostel.dao;

import com.hostel.model.Room;
import com.hostel.util.DBConnection;

import java.sql.*;
import java.util.ArrayList;
import java.util.List;

public class RoomDAO {

    public List<Room> getAllRooms() throws SQLException {
        List<Room> list = new ArrayList<>();
        String sql = "SELECT * FROM room ORDER BY room_id";
        try (Connection con = DBConnection.getConnection();
             PreparedStatement ps = con.prepareStatement(sql);
             ResultSet rs = ps.executeQuery()) {
            while (rs.next()) {
                list.add(new Room(
                    rs.getString("room_id"),
                    rs.getString("room_type"),
                    rs.getInt("capacity"),
                    rs.getInt("occupied"),
                    rs.getString("floor"),
                    rs.getString("status")
                ));
            }
        }
        return list;
    }

    public Room getRoomById(String roomId) throws SQLException {
        String sql = "SELECT * FROM room WHERE room_id = ?";
        try (Connection con = DBConnection.getConnection();
             PreparedStatement ps = con.prepareStatement(sql)) {
            ps.setString(1, roomId);
            try (ResultSet rs = ps.executeQuery()) {
                if (rs.next()) {
                    return new Room(
                        rs.getString("room_id"),
                        rs.getString("room_type"),
                        rs.getInt("capacity"),
                        rs.getInt("occupied"),
                        rs.getString("floor"),
                        rs.getString("status")
                    );
                }
            }
        }
        return null;
    }

    public boolean addRoom(Room r) throws SQLException {
        String sql = "INSERT INTO room (room_id, room_type, capacity, occupied, floor, status) VALUES (?, ?, ?, ?, ?, ?)";
        try (Connection con = DBConnection.getConnection();
             PreparedStatement ps = con.prepareStatement(sql)) {
            ps.setString(1, r.getRoomId());
            ps.setString(2, r.getRoomType());
            ps.setInt(3, r.getCapacity());
            ps.setInt(4, 0);
            ps.setString(5, r.getFloor());
            ps.setString(6, "available");
            return ps.executeUpdate() > 0;
        }
    }

    public void recalculateOccupancy(String roomId) throws SQLException {
        if (roomId == null) return;
        String countSql = "SELECT COUNT(*) FROM student WHERE room_id = ?";
        String updateSql = "UPDATE room SET occupied = ?, status = ? WHERE room_id = ?";
        try (Connection con = DBConnection.getConnection()) {
            int count = 0;
            try (PreparedStatement ps = con.prepareStatement(countSql)) {
                ps.setString(1, roomId);
                try (ResultSet rs = ps.executeQuery()) {
                    if (rs.next()) count = rs.getInt(1);
                }
            }

            Room r = getRoomById(roomId);
            if (r != null) {
                String newStatus = count == 0 ? "available" : (count >= r.getCapacity() ? "full" : "partial");
                try (PreparedStatement ps = con.prepareStatement(updateSql)) {
                    ps.setInt(1, count);
                    ps.setString(2, newStatus);
                    ps.setString(3, roomId);
                    ps.executeUpdate();
                }
            }
        }
    }
}
