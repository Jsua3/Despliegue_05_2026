package com.parcial.template.dto;

public record DatabaseHealthResponse(
        String mysql,
        String postgresql
) {
}
