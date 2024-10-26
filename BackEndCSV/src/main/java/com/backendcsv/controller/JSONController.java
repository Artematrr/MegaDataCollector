package com.backendcsv.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.web.bind.annotation.*;

import java.io.File;
import java.io.IOException;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/getFile")

public class JSONController {

    private final ObjectMapper objectMapper = new ObjectMapper();
    private final String directoryPath = "outputJson/";

    @GetMapping("/{fileName}")
    public List<Map<String, Object>> getFile(@PathVariable String fileName) {
        try {
            File jsonFile = new File(directoryPath + fileName);
            if (!jsonFile.exists() || !jsonFile.canRead()) {
                return List.of(Map.of("error", "Файл не найден или недоступен для чтения"));
            }

            return objectMapper.readValue(jsonFile, List.class);
        } catch (IOException e) {
            e.printStackTrace();
            return List.of(Map.of("error", "Не удалось прочитать файл: " + e.getMessage()));
        }
    }
}
