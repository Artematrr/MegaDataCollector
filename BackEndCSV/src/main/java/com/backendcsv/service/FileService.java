package com.backendcsv.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.opencsv.CSVParserBuilder;
import com.opencsv.CSVReader;
import com.opencsv.CSVReaderBuilder;
import com.opencsv.exceptions.CsvValidationException;
import org.springframework.stereotype.Service;

import java.io.*;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class FileService implements FunctionalFormat{

    public static String myFileFromUpload;
    private final ObjectMapper objectMapper = new ObjectMapper();

    @Override
    public void processFile(String fileName) throws IOException, CsvValidationException {

        String extension = getFileExtension(fileName);
        String uniqueOutputFileName = generateUniqueFileName();

        if ("csv".equalsIgnoreCase(extension)) {
            List<Map<String, String>> records = readCsv(fileName);
            writeJsonFile(uniqueOutputFileName, records);
        } else if ("json".equalsIgnoreCase(extension)) {
            List<Map<String, Object>> records = readJson(fileName);
            writeJsonFile(uniqueOutputFileName, records);
        } else {
            throw new IllegalArgumentException("Неподдерживаемый формат файла: " + extension);
        }
    }

    private String generateUniqueFileName() {
        String fileNameWithoutExtension;
        int dotIndex = myFileFromUpload.lastIndexOf('.');
        if (dotIndex > 0) {
            fileNameWithoutExtension = myFileFromUpload.substring(0, dotIndex);
        } else {
            fileNameWithoutExtension = myFileFromUpload;
        }

        String directoryPath = "outputJson/";
        String fileName = directoryPath + fileNameWithoutExtension + ".json";

        return fileName;
    }


    @Override
    public List<Map<String, String>> readCsv(String fileName) throws IOException {
        List<Map<String, String>> records = new ArrayList<>();
        String delimiter = detectDelimiter(fileName);

        File file = new File(fileName);
        try (Reader reader = new FileReader(file);
             CSVReader csvReader = new CSVReaderBuilder(reader)
                     .withCSVParser(new CSVParserBuilder().withSeparator(delimiter.charAt(0)).build())
                     .build()) {

            String[] headers = csvReader.readNext();

            if (headers == null || headers.length == 0) {
                throw new IllegalArgumentException("Файл не содержит заголовков: " + fileName);
            }

            String[] values;
            while ((values = csvReader.readNext()) != null) {
                Map<String, String> record = new HashMap<>();
                for (int i = 0; i < headers.length; i++) {
                    record.put(headers[i], i < values.length ? values[i] : null);
                }
                records.add(record);
            }
        } catch (IOException | CsvValidationException e) {
            throw new IllegalArgumentException("Ошибка при чтении CSV: " + e.getMessage(), e);
        }

        return records;
    }

    @Override
    public List<Map<String, Object>> readJson(String fileName) throws IOException {

        File file = new File(fileName);
        return objectMapper.readValue(file, List.class);
    }

    @Override
    public String detectDelimiter(String fileName) throws IOException {
        String[] delimiters = {",", ";", "\t", "|"};
        File file = new File(fileName);

        StringBuilder debugOutput = new StringBuilder();
        try (BufferedReader reader = new BufferedReader(new FileReader(file))) {
            String line;
            for (int i = 0; i < 5; i++) {
                line = reader.readLine();
                if (line != null) {
                    debugOutput.append("Строка ").append(i + 1).append(": ").append(line).append("\n");
                } else {
                    break;
                }
            }
        }

        try (BufferedReader reader = new BufferedReader(new FileReader(file))) {
            String line = reader.readLine();
            if (line != null) {
                for (String delimiter : delimiters) {
                    if (line.contains(delimiter)) {
                        return delimiter;
                    }
                }
                throw new IllegalArgumentException("Не удалось определить разделитель для файла: " + fileName);
            } else {
                throw new IllegalArgumentException("Файл пуст: " + fileName);
            }
        }
    }


    @Override
    public void writeJsonFile(String fileName, List<?> records) throws IOException {
        try (FileWriter fileWriter = new FileWriter(fileName)) {
            objectMapper.writerWithDefaultPrettyPrinter().writeValue(fileWriter, records);
        }
    }

    @Override
    public String getFileExtension(String fileName) {
        int lastIndex = fileName.lastIndexOf('.');
        if (lastIndex > 0 && lastIndex < fileName.length() - 1) {
            return fileName.substring(lastIndex + 1);
        }
        return "";
    }
}
