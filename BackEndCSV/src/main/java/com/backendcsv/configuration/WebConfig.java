package com.backendcsv.configuration;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**") // Разрешаем все маршруты
                .allowedOrigins("http://localhost:5173") // Разрешаем только ваш фронтенд
                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS") // Разрешаем методы
                .allowedHeaders("*"); // Разрешаем все заголовки
    }
}