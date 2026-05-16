package com.datastory.ai.controller;

import com.datastory.ai.dto.FileDeleteResponse;
import com.datastory.ai.dto.FileUploadResponse;
import com.datastory.ai.dto.UploadedFileResponse;
import com.datastory.ai.service.FileStorageService;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/files")
public class FileController {

    private final FileStorageService fileStorageService;

    public FileController(FileStorageService fileStorageService) {
        this.fileStorageService = fileStorageService;
    }

    @PostMapping(value = "/upload", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<FileUploadResponse> uploadFiles(@RequestPart("files") MultipartFile[] files) {
        return ResponseEntity.ok(fileStorageService.uploadFiles(files));
    }

    @GetMapping
    public ResponseEntity<List<UploadedFileResponse>> getCurrentUserFiles() {
        return ResponseEntity.ok(fileStorageService.getCurrentUserFiles());
    }

    @GetMapping("/{fileId}")
    public ResponseEntity<UploadedFileResponse> getCurrentUserFile(@PathVariable Long fileId) {
        return ResponseEntity.ok(fileStorageService.getCurrentUserFile(fileId));
    }

    @DeleteMapping("/{fileId}")
    public ResponseEntity<FileDeleteResponse> deleteCurrentUserFile(@PathVariable Long fileId) {
        return ResponseEntity.status(HttpStatus.OK).body(fileStorageService.deleteCurrentUserFile(fileId));
    }
}
