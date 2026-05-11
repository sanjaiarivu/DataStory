package com.datastory.ai.dto;

import com.datastory.ai.entity.UploadedFileType;
import java.time.LocalDateTime;

public record UploadedFileResponse(
        Long id,
        String originalFileName,
        String storedFileName,
        String contentType,
        Long sizeInBytes,
        UploadedFileType fileType,
        LocalDateTime uploadedAt,
        String uploadedByEmail
) {
}
