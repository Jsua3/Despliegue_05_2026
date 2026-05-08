package com.parcial.template.dto;

import java.time.LocalDateTime;

public record AuditEventResponse(
        Long id,
        String evento,
        String entidad,
        Long entidadId,
        String actorEmail,
        String detalle,
        LocalDateTime createdAt
) {
}
