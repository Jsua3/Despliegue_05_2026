package com.parcial.orders.dto;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.math.BigDecimal;

public record PedidoRequest(
        @NotNull Long productoId,
        @NotBlank @Size(max = 140) String productoNombre,
        @NotNull @DecimalMin("0.01") BigDecimal precioKg,
        @NotNull @DecimalMin("0.10") BigDecimal cantidadKg,
        @NotBlank @Size(max = 140) String clienteNombre,
        @NotBlank @Size(max = 240) String direccionEntrega,
        @Size(max = 700) String observaciones
) {
}
