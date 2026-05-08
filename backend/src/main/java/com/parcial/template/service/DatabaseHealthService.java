package com.parcial.template.service;

import com.parcial.template.dto.DatabaseHealthResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class DatabaseHealthService {

    private final JdbcTemplate jdbcTemplate;
    private final AuditService auditService;

    public DatabaseHealthResponse health() {
        Integer mysqlValue = jdbcTemplate.queryForObject("select 1", Integer.class);
        String mysql = mysqlValue != null && mysqlValue == 1 ? "OK" : "ERROR";
        return new DatabaseHealthResponse(mysql, auditService.health());
    }
}
