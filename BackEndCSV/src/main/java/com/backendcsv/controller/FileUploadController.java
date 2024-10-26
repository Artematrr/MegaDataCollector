package com.backendcsv.controller;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;

@Controller
@RequestMapping("/file")
public class FileUploadController {

    @Value("${upload.dir}")
    private String uploadDir;

    @RequestMapping("/upload")
    public String showUploadForm() {
        return "uploadForm";
    }

    @PostMapping("/uploadFile")
    public String uploadFile(@RequestParam("file") MultipartFile file, Model model) {

        if (file.isEmpty()) {
            model.addAttribute("message", "Please select a file to upload");
            return "uploadForm";
        }

        try {
            Path uploadPath = Paths.get(uploadDir);
            if (!Files.exists(uploadPath)) {
                Files.createDirectories(uploadPath);
            }

            String originalFileName = file.getOriginalFilename();
            String fileName = originalFileName;
            Path filePath = uploadPath.resolve(fileName);

            int counter = 1;
            while (Files.exists(filePath)) {
                String fileNameWithoutExtension = originalFileName.substring(0, originalFileName.lastIndexOf('.'));
                String extension = originalFileName.substring(originalFileName.lastIndexOf('.'));
                fileName = fileNameWithoutExtension + counter + extension;
                filePath = uploadPath.resolve(fileName);
                counter++;
            }

            Files.copy(file.getInputStream(), filePath);
            model.addAttribute("message", "File uploaded successfully: " + fileName);
        } catch (IOException e) {
            model.addAttribute("message", "File upload failed: " + e.getMessage());
        }

        return "uploadForm";
    }

}
