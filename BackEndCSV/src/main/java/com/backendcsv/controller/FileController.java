package com.backendcsv.controller;

import com.backendcsv.service.FileService;
import com.opencsv.exceptions.CsvValidationException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.io.IOException;

@RestController
public class FileController {

    @Autowired
    private FileService fileService;

    @GetMapping("/process-file")
    public String processFile(@RequestParam String fileName) {
        try {
            fileService.processFile(fileName);
            return "Файл успешно обработан и сохранён в формате JSON.";
        } catch (IOException | CsvValidationException e) {
            return "Ошибка при обработке файла: " + e.getMessage();
        }
    }
}
