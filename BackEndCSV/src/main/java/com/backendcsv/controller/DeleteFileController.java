package com.backendcsv.controller;

import com.backendcsv.service.FileService;
import org.springframework.beans.factory.annotation.Autowired;
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

    @Autowired
    FileService fileService;

    private final String uploadDir = "uploads/";
    private final String outputDir = "outputJson/";

    @DeleteMapping("/{fileName}")
    public ResponseEntity<String> deleteFile(@PathVariable String fileName) {
        String extension = fileService.getFileExtension(fileName);

        File csvFile = new File(uploadDir + fileName);
        File jsonFileInOutputDir = new File(outputDir + fileName.replace(".csv", ".json"));

        if ("json".equalsIgnoreCase(extension)) {

            boolean isDeletedFromUploadDir = csvFile.exists() && csvFile.delete();
            boolean isDeletedFromOutputDir = jsonFileInOutputDir.exists() && jsonFileInOutputDir.delete();

            if (isDeletedFromUploadDir || isDeletedFromOutputDir) {
                return ResponseEntity.ok("Файл формата JSON успешно удален из доступных директорий: " + fileName);
            } else {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Файл формата JSON не найден: " + fileName);
            }

        } else if ("csv".equalsIgnoreCase(extension)) {

            boolean isDeletedCsvFile = csvFile.exists() && csvFile.delete();
            boolean isDeletedJsonCopy = jsonFileInOutputDir.exists() && jsonFileInOutputDir.delete();

            if (isDeletedCsvFile || isDeletedJsonCopy) {
                return ResponseEntity.ok("Файл формата CSV и его JSON-копия успешно удалены: " + fileName);
            } else {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Файл CSV или его JSON-копия не найдены: " + fileName);
            }
        }

        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Неподдерживаемый формат файла: " + fileName);
    }
}
