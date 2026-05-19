package com.datastory.ai;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class DataStoryAiApplication {

    public static void main(String[] args) {
        loadLocalEnvFile();
        SpringApplication.run(DataStoryAiApplication.class, args);
    }

    private static void loadLocalEnvFile() {
        Path envPath = resolveEnvPath();

        if (envPath == null) {
            return;
        }

        try {
            Files.readAllLines(envPath).stream()
                    .map(String::trim)
                    .filter(line -> !line.isBlank() && !line.startsWith("#"))
                    .forEach(DataStoryAiApplication::setSystemPropertyIfMissing);
        } catch (IOException ignored) {
            // Local .env loading is only for development convenience.
        }
    }

    private static Path resolveEnvPath() {
        Path backendEnvPath = Path.of("backend", ".env");
        Path localEnvPath = Path.of(".env");

        if (Files.exists(backendEnvPath)) {
            return backendEnvPath;
        }

        if (Files.exists(localEnvPath)) {
            return localEnvPath;
        }

        return null;
    }

    private static void setSystemPropertyIfMissing(String line) {
        int separatorIndex = line.indexOf('=');

        if (separatorIndex <= 0) {
            return;
        }

        String key = line.substring(0, separatorIndex).trim();
        String value = line.substring(separatorIndex + 1).trim();

        if (System.getenv(key) == null && System.getProperty(key) == null) {
            System.setProperty(key, value);
        }
    }
}
