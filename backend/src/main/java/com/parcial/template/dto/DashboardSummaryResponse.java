package com.parcial.template.dto;

import com.parcial.template.entity.ItemStatus;
import java.util.Map;

public record DashboardSummaryResponse(
        long totalItems,
        long catalogosActivos,
        Map<ItemStatus, Long> itemsPorEstado
) {
}
