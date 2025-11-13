//package com.lingo.fileservice.config;
//
//import com.fasterxml.jackson.databind.JsonNode;
//import com.fasterxml.jackson.databind.ObjectMapper;
//import io.github.cdimascio.dotenv.Dotenv;
//import org.springframework.core.io.ClassPathResource;
//import org.springframework.stereotype.Component;
//import java.io.File;
//import java.nio.file.Files;
//
//@Component
//public class GoogleCredentialsConfig {
//
//    public JsonNode loadGoogleCredentials() throws Exception {
//        Dotenv dotenv = Dotenv.load();
//        File jsonFile = new ClassPathResource("keys/lingo-472101-15e886f10d3f.json").getFile();
//
//        // Read JSON as string
//        String jsonString = Files.readString(jsonFile.toPath());
//
//        // Replace placeholders with .env values
//        for (var entry : dotenv.entries()) {
//            String key = entry.getKey();
//            String value = entry.getValue().replace("\\n", "\n"); // for multiline keys
//            jsonString = jsonString.replace("${" + key + "}", value);
//        }
//
//        // Parse final JSON into JsonNode
//        ObjectMapper mapper = new ObjectMapper();
//        return mapper.readTree(jsonString);
//    }
//}
//
