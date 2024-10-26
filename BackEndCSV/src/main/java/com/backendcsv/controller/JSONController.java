package com.backendcsv.controller;

import com.fasterxml.jackson.databind.ObjectMapper;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.io.File;
import java.io.IOException;
import java.util.List;
import java.util.Map;

@RestController
public class JSONController {

    private final ObjectMapper objectMapper = new ObjectMapper();

    @GetMapping("/getFile")
    public List<Map<String, Object>> getFile() {
        try {
            File jsonFile = new File("output.json");
            return objectMapper.readValue(jsonFile, List.class); // Предполагается, что это массив объектов
        } catch (IOException e) {
            e.printStackTrace();
            return List.of(Map.of("error", "Не удалось прочитать файл: " + e.getMessage()));
        }
    }
}
