package com.datastory.ai.service;

import com.datastory.ai.dto.FileUploadResponse;
import com.datastory.ai.dto.UploadedFileResponse;
import com.datastory.ai.entity.AppUser;
import com.datastory.ai.entity.UploadedFile;
import com.datastory.ai.entity.UploadedFileType;
import com.datastory.ai.exception.InvalidFileException;
import com.datastory.ai.repository.AppUserRepository;
import com.datastory.ai.repository.UploadedFileRepository;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.StandardCopyOption;
import java.util.Arrays;
import java.util.List;
import java.util.UUID;
import org.springframework.beans.factory.annotation.Value;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

@Service
@RequiredArgsConstructor
public class FileStorageService {

    private static final List<String> ALLOWED_CONTENT_TYPES = List.of(
            "text/csv",
            "application/pdf",
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );

    private final UploadedFileRepository uploadedFileRepository;
    private final AppUserRepository appUserRepository;

    @Value("${app.storage.upload-dir}")
    private String uploadDir;

    public FileUploadResponse uploadFiles(MultipartFile[] files) {
        if (files == null || files.length == 0) {
            throw new InvalidFileException("At least one file is required.");
        }

        List<UploadedFileResponse> uploadedFiles = Arrays.stream(files)
                .map(this::validateAndSaveMetadata)
                .map(this::toResponse)
                .toList();

        return new FileUploadResponse("Files uploaded successfully.", uploadedFiles);
    }

    private UploadedFile validateAndSaveMetadata(MultipartFile file) {
        if (file.isEmpty()) {
            throw new InvalidFileException("Empty files are not allowed.");
        }

        if (!ALLOWED_CONTENT_TYPES.contains(file.getContentType())) {
            throw new InvalidFileException("Unsupported file type: " + file.getOriginalFilename());
        }

        UploadedFileType fileType = resolveFileType(file.getContentType());
        String originalFileName = sanitizeFileName(file.getOriginalFilename());
        String storedFileName = UUID.randomUUID() + "-" + originalFileName;
        Path uploadPath = Path.of(uploadDir).toAbsolutePath().normalize();
        Path targetPath = uploadPath.resolve(storedFileName).normalize();

        if (!targetPath.startsWith(uploadPath)) {
            throw new InvalidFileException("Invalid file path.");
        }

        try {
            Files.createDirectories(uploadPath);
            Files.copy(file.getInputStream(), targetPath, StandardCopyOption.REPLACE_EXISTING);

            UploadedFile uploadedFile = UploadedFile.builder()
                    .originalFileName(originalFileName)
                    .storedFileName(storedFileName)
                    .storagePath(targetPath.toString())
                    .contentType(file.getContentType())
                    .sizeInBytes(file.getSize())
                    .fileType(fileType)
                    .uploadedBy(getCurrentUser())
                    .build();

            return uploadedFileRepository.save(uploadedFile);
        } catch (IOException exception) {
            throw new InvalidFileException("Could not store file: " + originalFileName);
        }
    }

    private UploadedFileType resolveFileType(String contentType) {
        return switch (contentType) {
            case "text/csv" -> UploadedFileType.CSV;
            case "application/pdf" -> UploadedFileType.PDF;
            case "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" -> UploadedFileType.EXCEL;
            default -> throw new InvalidFileException("Unsupported file type.");
        };
    }

    private UploadedFileResponse toResponse(UploadedFile uploadedFile) {
        return new UploadedFileResponse(
                uploadedFile.getId(),
                uploadedFile.getOriginalFileName(),
                uploadedFile.getStoredFileName(),
                uploadedFile.getContentType(),
                uploadedFile.getSizeInBytes(),
                uploadedFile.getFileType(),
                uploadedFile.getUploadedAt(),
                uploadedFile.getUploadedBy() != null ? uploadedFile.getUploadedBy().getEmail() : null
        );
    }

    private AppUser getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        if (authentication == null || authentication.getName() == null) {
            throw new InvalidFileException("You must be logged in to upload files.");
        }

        return appUserRepository.findByEmail(authentication.getName())
                .orElseThrow(() -> new InvalidFileException("Authenticated user was not found."));
    }

    private String sanitizeFileName(String fileName) {
        if (fileName == null || fileName.isBlank()) {
            throw new InvalidFileException("File name is required.");
        }

        return Path.of(fileName).getFileName().toString();
    }
}
