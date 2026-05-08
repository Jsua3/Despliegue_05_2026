package com.parcial.template.dto;

import com.parcial.template.entity.Role;

public record UserResponse(
        Long id,
        String nombre,
        String email,
        Role role
) {
}
