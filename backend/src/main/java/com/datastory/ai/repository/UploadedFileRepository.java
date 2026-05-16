package com.datastory.ai.repository;

import com.datastory.ai.entity.UploadedFile;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UploadedFileRepository extends JpaRepository<UploadedFile, Long> {

    List<UploadedFile> findByUploadedByEmailOrderByUploadedAtDesc(String email);

    Optional<UploadedFile> findByIdAndUploadedByEmail(Long id, String email);
}
