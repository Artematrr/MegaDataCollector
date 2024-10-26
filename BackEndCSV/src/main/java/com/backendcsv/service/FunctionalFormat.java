package com.backendcsv.service;

import com.opencsv.exceptions.CsvValidationException;
import org.springframework.http.ResponseEntity;

import java.io.IOException;
import java.util.List;
import java.util.Map;

public interface FunctionalFormat {


    void processFile(String fileName) throws IOException, CsvValidationException;
    List<Map<String, String>> readCsv(String fileName) throws IOException, CsvValidationException;
    String detectDelimiter(String fileName) throws IOException;
    void writeJsonFile(String fileName, List<?> records) throws IOException;
    String getFileExtension(String fileName);
    List<Map<String, Object>> readJson(String fileName) throws IOException;

}
