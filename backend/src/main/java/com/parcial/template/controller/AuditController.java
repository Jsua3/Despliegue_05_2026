package com.parcial.template.controller;

import com.parcial.template.dto.AuditEventResponse;
import com.parcial.template.dto.DatabaseHealthResponse;
import com.parcial.template.service.AuditService;
import com.parcial.template.service.DatabaseHealthService;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class AuditController {

    private final AuditService auditService;
    private final DatabaseHealthService databaseHealthService;

    @GetMapping("/db/health")
    public DatabaseHealthResponse health() {
        return databaseHealthService.health();
    }

    @GetMapping("/auditoria")
    @PreAuthorize("hasAnyRole('STAFF','ADMIN')")
    public List<AuditEventResponse> latest() {
        return auditService.latest();
    }
}
