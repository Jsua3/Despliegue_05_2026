package com.parcial.template.controller;

import com.parcial.template.dto.DashboardSummaryResponse;
import com.parcial.template.entity.AppUser;
import com.parcial.template.service.DashboardService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/dashboard")
@RequiredArgsConstructor
public class DashboardController {

    private final DashboardService dashboardService;

    @GetMapping("/resumen")
    public DashboardSummaryResponse resumen(@AuthenticationPrincipal AppUser user) {
        return dashboardService.resumen(user);
    }
}
