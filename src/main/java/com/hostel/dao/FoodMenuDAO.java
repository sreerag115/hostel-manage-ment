package com.hostel.dao;

import com.hostel.model.FoodMenu;
import com.hostel.util.DBConnection;

import java.sql.*;
import java.util.ArrayList;
import java.util.List;

public class FoodMenuDAO {

    public List<FoodMenu> getWeeklyMenu() throws SQLException {
        List<FoodMenu> list = new ArrayList<>();
        String sql = "SELECT * FROM food_menu ORDER BY menu_id";
        try (Connection con = DBConnection.getConnection();
             PreparedStatement ps = con.prepareStatement(sql);
             ResultSet rs = ps.executeQuery()) {
            while (rs.next()) {
                list.add(new FoodMenu(
                    rs.getInt("menu_id"),
                    rs.getString("day_of_week"),
                    rs.getString("breakfast"),
                    rs.getString("lunch"),
                    rs.getString("snacks"),
                    rs.getString("dinner")
                ));
            }
        }
        return list;
    }

    public FoodMenu getMenuByDay(String dayOfWeek) throws SQLException {
        String sql = "SELECT * FROM food_menu WHERE LOWER(day_of_week) = LOWER(?)";
        try (Connection con = DBConnection.getConnection();
             PreparedStatement ps = con.prepareStatement(sql)) {
            ps.setString(1, dayOfWeek);
            try (ResultSet rs = ps.executeQuery()) {
                if (rs.next()) {
                    return new FoodMenu(
                        rs.getInt("menu_id"),
                        rs.getString("day_of_week"),
                        rs.getString("breakfast"),
                        rs.getString("lunch"),
                        rs.getString("snacks"),
                        rs.getString("dinner")
                    );
                }
            }
        }
        return null;
    }

    public boolean updateMenu(String dayOfWeek, String breakfast, String lunch, String snacks, String dinner) throws SQLException {
        String sql = "UPDATE food_menu SET breakfast = ?, lunch = ?, snacks = ?, dinner = ? WHERE LOWER(day_of_week) = LOWER(?)";
        try (Connection con = DBConnection.getConnection();
             PreparedStatement ps = con.prepareStatement(sql)) {
            ps.setString(1, breakfast);
            ps.setString(2, lunch);
            ps.setString(3, snacks);
            ps.setString(4, dinner);
            ps.setString(5, dayOfWeek);
            return ps.executeUpdate() > 0;
        }
    }
}
