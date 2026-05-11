package com.datastory.ai.dto;

import com.datastory.ai.entity.UserRole;

public record UserResponse(
        Long id,
        String fullName,
        String email,
        UserRole role
) {
}
