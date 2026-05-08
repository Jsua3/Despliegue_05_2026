package com.parcial.orders.dto;

import com.parcial.orders.entity.PedidoStatus;
import java.math.BigDecimal;
import java.time.LocalDateTime;

public record PedidoResponse(
        Long id,
        Long productoId,
        String productoNombre,
        BigDecimal precioKg,
        BigDecimal cantidadKg,
        BigDecimal total,
        String clienteNombre,
        String clienteEmail,
        String direccionEntrega,
        String observaciones,
        PedidoStatus status,
        LocalDateTime createdAt,
        LocalDateTime updatedAt
) {
}
