package com.parcial.template.dto;

import com.parcial.template.entity.ItemStatus;
import java.time.LocalDate;
import java.time.LocalDateTime;

public record ItemResponse(
        Long id,
        String titulo,
        String descripcion,
        String solicitanteNombre,
        String contacto,
        Integer cantidad,
        LocalDate fechaObjetivo,
        ItemStatus status,
        String observacionesStaff,
        CatalogoResponse catalogo,
        UserResponse createdBy,
        LocalDateTime createdAt,
        LocalDateTime updatedAt,
        LocalDateTime enviadoAt,
        LocalDateTime revisadoAt
) {
}
