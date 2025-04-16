package com.ganesh.demo.controller;


import com.ganesh.demo.dto.ClickHouseConnectionDTO;
import com.ganesh.demo.service.ClickHouseService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.sql.SQLException;
import java.util.List;

@RestController
@RequestMapping("/api/clickhouse")
@CrossOrigin(origins = "*") // allow frontend access
public class ClickHouseController {

    @Autowired
    private ClickHouseService clickHouseService;

    @PostMapping("/tables")
    public List<String> getTables(@RequestBody ClickHouseConnectionDTO dto) throws SQLException {
        return clickHouseService.getTables(dto);
    }

    @PostMapping("/columns")
    public List<String> getColumns(@RequestBody ClickHouseConnectionDTO dto,
                                   @RequestParam String tableName) throws SQLException {
        return clickHouseService.getColumns(dto, tableName);
    }
    
    @PostMapping("/export")
    public ResponseEntity<String> exportToCSV(@RequestBody ClickHouseConnectionDTO dto,
                                              @RequestParam String tableName,
                                              @RequestParam(required = false) List<String> columns) {
        try {
            String filePath = clickHouseService.exportTableToCSV(dto, tableName, columns);
            return ResponseEntity.ok("Exported to: " + filePath);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body("Export failed: " + e.getMessage());
        }
    }
    
    @PostMapping(value = "/ingest", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<String> ingestCSV(
            @RequestParam("file") MultipartFile file,
            @RequestParam("tableName") String tableName,
            @RequestParam("host") String host,
            @RequestParam("port") int port,
            @RequestParam("database") String database,
            @RequestParam("username") String username,
            @RequestParam("jwtToken") String jwtToken
    ) {
        try {
            ClickHouseConnectionDTO dto = new ClickHouseConnectionDTO();
            dto.setHost(host);
            dto.setPort(port);
            dto.setDatabase(database);
            dto.setUsername(username);
            dto.setJwtToken(jwtToken);

            String message = clickHouseService.ingestCSVToClickHouse(dto, file, tableName);
            return ResponseEntity.ok(message);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body("Ingestion failed: " + e.getMessage());
        }
    }

    

}
