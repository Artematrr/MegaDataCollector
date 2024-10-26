package com.backendcsv.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.io.File;
import java.util.ArrayList;
import java.util.List;

@RestController
public class GetFilesName {

    private final String directoryPath = "outputJson";

    @GetMapping("/MyFiles")
    public List<String> listFiles() {
        List<String> fileNames = new ArrayList<>();
        File directory = new File(directoryPath);

        if (directory.isDirectory()) {

            File[] files = directory.listFiles();
            if (files != null) {
                for (File file : files) {

                    if (file.isFile()) {
                        fileNames.add(file.getName());
                    }
                }
            }
        }

        return fileNames;
    }

}
