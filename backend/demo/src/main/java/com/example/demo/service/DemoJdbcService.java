package com.example.demo.service;

import com.example.demo.util.JdbcConnectionUtil;
import org.springframework.stereotype.Service;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.logging.Logger;

@Service
public class DemoJdbcService {
    private static final Logger logger = Logger.getLogger(DemoJdbcService.class.getName());

    public void logAllMenuItems() {
        String sql = "SELECT id, name, price FROM menu_items";
        try (Connection conn = JdbcConnectionUtil.getConnection();
                PreparedStatement ps = conn.prepareStatement(sql);
                ResultSet rs = ps.executeQuery()) {
            while (rs.next()) {
                logger.info("MenuItem: id=" + rs.getLong("id") + ", name=" + rs.getString("name") + ", price="
                        + rs.getBigDecimal("price"));
            }
        } catch (SQLException e) {
            logger.severe("JDBC error: " + e.getMessage());
        }
    }
}
