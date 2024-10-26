package com.backendcsv.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.io.File;

@RestController
@RequestMapping("/MyFiles")
public class DeleteFileController {

    private final String uploadDir = "uploads/";

    @DeleteMapping("/{fileName}")
    public ResponseEntity<String> deleteFile(@PathVariable String fileName) {
        File file = new File(uploadDir + fileName);

        if (file.exists() && file.delete()) {
            return ResponseEntity.ok("Файл успешно удален: " + fileName);
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Файл не найден: " + fileName);
        }
    }
}
