package com.datastory.ai.dto;

public record AuthResponse(
        String token,
        String tokenType,
        UserResponse user
) {
}
