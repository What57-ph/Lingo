//package com.lingo.fileservice.service;
//import com.google.auth.oauth2.GoogleCredentials;
//import com.lingo.fileservice.config.GoogleCredentialsConfig;
//import org.springframework.stereotype.Component;
//
//import java.io.ByteArrayInputStream;
//import java.nio.charset.StandardCharsets;
//
//@Component
//public class GoogleService {
//
//    private final GoogleCredentials credentials;
//
//    public GoogleService(GoogleCredentialsConfig config) throws Exception {
//        String json = config.loadGoogleCredentials().toString();
//        this.credentials = GoogleCredentials.fromStream(
//                new ByteArrayInputStream(json.getBytes(StandardCharsets.UTF_8))
//        );
//    }
//}
//
