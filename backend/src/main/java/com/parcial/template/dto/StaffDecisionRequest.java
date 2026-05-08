package com.parcial.template.dto;

import jakarta.validation.constraints.Size;

public record StaffDecisionRequest(
        @Size(max = 900) String observaciones
) {
}
