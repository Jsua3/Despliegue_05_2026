package com.parcial.template.dto;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.math.BigDecimal;

public record ProductoRequest(
        @NotBlank @Size(max = 120) String nombre,
        @NotBlank @Size(max = 80) String categoria,
        @NotNull @DecimalMin("0.01") BigDecimal precioKg,
        @NotNull @DecimalMin("0.00") BigDecimal stockKg,
        @NotBlank @Size(max = 700) String descripcion,
        Boolean activo
) {
}
