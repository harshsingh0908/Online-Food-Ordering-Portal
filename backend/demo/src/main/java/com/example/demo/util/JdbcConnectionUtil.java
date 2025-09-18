package com.example.demo.util;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;
import java.util.logging.Level;
import java.util.logging.Logger;

// Utility for JDBC connection to MySQL
public class JdbcConnectionUtil {
    private static final Logger logger = Logger.getLogger(JdbcConnectionUtil.class.getName());

    public static Connection getConnection() {
        String url = System.getenv().getOrDefault("DB_URL", "jdbc:mysql://localhost:3306/springapp");
        String username = System.getenv().getOrDefault("DB_USERNAME", "root");
        String password = System.getenv().getOrDefault("DB_PASSWORD", "password");
        try {
            Class.forName("com.mysql.cj.jdbc.Driver");
            return DriverManager.getConnection(url, username, password);
        } catch (ClassNotFoundException | SQLException e) {
            logger.log(Level.SEVERE, "Failed to get JDBC connection", e);
            return null;
        }
    }
}
