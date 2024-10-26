package com.backendcsv.controller;

import com.backendcsv.service.FileService;
import com.opencsv.exceptions.CsvValidationException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.io.IOException;

@RestController
public class FileController {

    @Value("${upload.dir}")
    private String uploadDir;

    @Autowired
    private FileService fileService;

    @GetMapping("/convert")
    public String processFile(@RequestParam String fileName) {
        String filePath = uploadDir + fileName; // Используйте uploadDir, чтобы получить полный путь
        try {
            fileService.processFile(filePath); // Передаем путь в FileService
            return "Файл успешно обработан и сохранён в формате JSON.";
        } catch (IOException | CsvValidationException e) {
            return "Ошибка при обработке файла: " + e.getMessage();
        }
    }


}
