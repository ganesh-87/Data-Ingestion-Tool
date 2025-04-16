package com.ganesh.demo.service;


import com.ganesh.demo.dto.ClickHouseConnectionDTO;
import com.opencsv.CSVReader;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.BufferedReader;
import java.io.FileWriter;
import java.io.InputStreamReader;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.sql.*;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Properties;

@Service
public class ClickHouseService {

    public Connection connectToClickHouse(ClickHouseConnectionDTO dto) throws SQLException {
        String url = String.format("jdbc:clickhouse://%s:%d/%s?compress=0", dto.getHost(), dto.getPort(), dto.getDatabase());

        Properties props = new Properties();
        props.setProperty("user", dto.getUsername());
        
        return DriverManager.getConnection(url, props);
    }

    public List<String> getTables(ClickHouseConnectionDTO dto) throws SQLException {
        List<String> tables = new ArrayList<>();
        try (Connection conn = connectToClickHouse(dto);
             PreparedStatement stmt = conn.prepareStatement("SHOW TABLES");
             ResultSet rs = stmt.executeQuery()) {

            while (rs.next()) {
                tables.add(rs.getString(1));
            }
        }
        return tables;
    }

    public List<String> getColumns(ClickHouseConnectionDTO dto, String tableName) throws SQLException {
        List<String> columns = new ArrayList<>();
        String query = "DESCRIBE TABLE " + tableName;
        try (Connection conn = connectToClickHouse(dto);
             PreparedStatement stmt = conn.prepareStatement(query);
             ResultSet rs = stmt.executeQuery()) {

            while (rs.next()) {
                columns.add(rs.getString("name"));
            }
        }
        return columns;
    }
    
    public String exportTableToCSV(ClickHouseConnectionDTO dto, String tableName, List<String> columns) throws Exception {
        
    	String validationQuery = "SELECT count(*) FROM jwtAuth WHERE jwt_token = ? AND table_name = ?";

        try (Connection conn = connectToClickHouse(dto);
             PreparedStatement stmt = conn.prepareStatement(validationQuery)) {
            
            stmt.setString(1, dto.getJwtToken()); // Validate JWT token
            stmt.setString(2, tableName); // Validate table name

            ResultSet rs = stmt.executeQuery();
            
            if (rs.next() && rs.getInt(1) == 0) {
                throw new RuntimeException("Invalid JWT token for the specified table.");
            }
        }
    	
    	String query = "SELECT " + (columns == null || columns.isEmpty() ? "*" : String.join(",", columns)) + " FROM " + tableName;

        // Get the user's Downloads folder path
        String userHome = System.getProperty("user.home");
        Path downloadsPath = Paths.get(userHome, "Downloads", "export_" + tableName + ".csv");
        String filePath = downloadsPath.toString();
        int cntrecords=0;
        try (Connection conn = connectToClickHouse(dto);
             Statement stmt = conn.createStatement();
             ResultSet rs = stmt.executeQuery(query);
             FileWriter csvWriter = new FileWriter(filePath)) {

            ResultSetMetaData meta = rs.getMetaData();
            int colCount = meta.getColumnCount();

            // Write header
            for (int i = 1; i <= colCount; i++) {
                csvWriter.append(meta.getColumnName(i));
                if (i < colCount) csvWriter.append(",");
            }
            csvWriter.append("\n");

            // Write rows
            while (rs.next()) {
                for (int i = 1; i <= colCount; i++) {
                    csvWriter.append(rs.getString(i));
                    if (i < colCount) csvWriter.append(",");
                }
                csvWriter.append("\n");
                cntrecords++;
            }
        }

        return downloadsPath.toAbsolutePath().toString()+" with "+cntrecords+" Processed Records"; // Return full path for frontend download link if needed
    }
    
    public String ingestCSVToClickHouse(ClickHouseConnectionDTO dto, MultipartFile file, String tableName) throws Exception {
        List<String[]> rows = new ArrayList<>();
        List<String> headers;

        try (BufferedReader reader = new BufferedReader(new InputStreamReader(file.getInputStream()))) {
            CSVReader csvReader = new CSVReader(reader);
            headers = Arrays.asList(csvReader.readNext()); // First row = headers

            String[] line;
            while ((line = csvReader.readNext()) != null) {
                rows.add(line);
            }
        }

        try (Connection conn = connectToClickHouse(dto);
             Statement stmt = conn.createStatement()) {

            // 1. Create table if not exists
            StringBuilder createSQL = new StringBuilder("CREATE TABLE IF NOT EXISTS " + tableName + " (");
            for (int i = 0; i < headers.size(); i++) {
                createSQL.append(headers.get(i)).append(" String");
                if (i < headers.size() - 1) createSQL.append(", ");
            }
            createSQL.append(") ENGINE = MergeTree() ORDER BY tuple();");
            stmt.execute(createSQL.toString());

            // 2. Insert rows
            String insertSQL = "INSERT INTO " + tableName + " (" + String.join(",", headers) + ") VALUES ";
            StringBuilder values = new StringBuilder();

            for (int i = 0; i < rows.size(); i++) {
                values.append("(");
                for (int j = 0; j < headers.size(); j++) {
                    values.append("'").append(rows.get(i)[j].replace("'", "''")).append("'");
                    if (j < headers.size() - 1) values.append(",");
                }
                values.append(")");
                if (i < rows.size() - 1) values.append(",");
            }

            stmt.execute(insertSQL + values);
            
            String jwtInsertSQL = "INSERT INTO jwtAuth (jwt_token, table_name) VALUES (?, ?)";
            try (PreparedStatement jwtStmt = conn.prepareStatement(jwtInsertSQL)) {
                jwtStmt.setString(1, dto.getJwtToken());
                jwtStmt.setString(2, tableName);
                jwtStmt.executeUpdate();
            }
        }

        return "CSV file ingested successfully into table: " + tableName;
    }

}
