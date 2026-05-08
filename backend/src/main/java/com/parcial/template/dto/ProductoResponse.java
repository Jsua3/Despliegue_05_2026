package com.parcial.template.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public record ProductoResponse(
        Long id,
        String nombre,
        String categoria,
        BigDecimal precioKg,
        BigDecimal stockKg,
        String descripcion,
        Boolean activo,
        LocalDateTime createdAt,
        LocalDateTime updatedAt
) {
}
