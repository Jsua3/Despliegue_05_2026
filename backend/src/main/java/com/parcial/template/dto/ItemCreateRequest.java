package com.parcial.template.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.time.LocalDate;

public record ItemCreateRequest(
        @NotNull Long catalogoId,
        @NotBlank @Size(max = 120) String titulo,
        @NotBlank @Size(max = 1200) String descripcion,
        @NotBlank @Size(max = 120) String solicitanteNombre,
        @NotBlank @Size(max = 160) String contacto,
        @Min(1) Integer cantidad,
        LocalDate fechaObjetivo
) {
}
