package com.example.constructionmanagmentbackend.config;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.SerializationFeature;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;
import org.springframework.http.converter.json.Jackson2ObjectMapperBuilder;

@Configuration
public class JacksonConfig {

    @Bean
    @Primary
    public ObjectMapper objectMapper() {
        ObjectMapper mapper = Jackson2ObjectMapperBuilder.json()
                .simpleDateFormat("yyyy-MM-dd'T'HH:mm:ss")
                .serializers(new com.fasterxml.jackson.datatype.jsr310.ser.LocalDateTimeSerializer(
                    java.time.format.DateTimeFormatter.ISO_LOCAL_DATE_TIME))
                .build();
        
        // Configure to handle circular references
        mapper.configure(SerializationFeature.FAIL_ON_EMPTY_BEANS, false);
        mapper.configure(SerializationFeature.WRITE_DATES_AS_TIMESTAMPS, false);
        mapper.setSerializationInclusion(JsonInclude.Include.NON_NULL);
        
        // Register JavaTimeModule for LocalDateTime support
        mapper.registerModule(new JavaTimeModule());
        
        return mapper;
    }
}