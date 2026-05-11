package com.datastory.ai.dto;

import java.util.List;

public record FileUploadResponse(
        String message,
        List<UploadedFileResponse> files
) {
}
