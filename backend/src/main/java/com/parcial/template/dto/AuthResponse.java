package com.parcial.template.dto;

public record AuthResponse(
        String token,
        UserResponse user
) {
}
