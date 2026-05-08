package com.parcial.template.dto;

public record CatalogoResponse(
        Long id,
        String codigo,
        String nombre,
        String descripcion
) {
}
