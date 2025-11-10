package com.lingo.chatbot.service;

import com.lingo.chatbot.model.ChatRequest;
import lombok.AccessLevel;
import lombok.experimental.FieldDefaults;
import org.springframework.ai.chat.client.ChatClient;
import org.springframework.ai.chat.client.advisor.MessageChatMemoryAdvisor;
import org.springframework.ai.chat.memory.ChatMemory;
import org.springframework.ai.chat.memory.ChatMemoryRepository;
import org.springframework.ai.chat.memory.MessageWindowChatMemory;
import org.springframework.ai.chat.memory.repository.jdbc.JdbcChatMemoryRepository;
import org.springframework.ai.chat.memory.repository.jdbc.MysqlChatMemoryRepositoryDialect;
import org.springframework.ai.chat.messages.SystemMessage;
import org.springframework.ai.chat.messages.UserMessage;
import org.springframework.ai.chat.prompt.ChatOptions;
import org.springframework.ai.chat.prompt.Prompt;
import org.springframework.ai.content.Media;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;
import org.springframework.util.MimeTypeUtils;
import org.springframework.web.multipart.MultipartFile;

import java.util.UUID;

@Service
@FieldDefaults(level= AccessLevel.PRIVATE)
public class ChatbotService {
    final ChatClient chatClient;
    final JdbcChatMemoryRepository jdbcChatMemoryRepository;
//    final JdbcTemplate jdbcTemplate;
    String systemPrompt="You are an expert TOEIC and IELTS tutor and answers for questions about english learning only.\n" +
            "         Generate authentic exam practice (all skills/parts) and provide comprehensive, score-focused feedback. \n" +
            "         Feedback must include a justified score estimate, detailed error correction, and analysis of task achievement.";
    public ChatbotService(ChatClient.Builder chatClient, JdbcChatMemoryRepository jdbcChatMemoryRepository) {
        this.jdbcChatMemoryRepository = jdbcChatMemoryRepository;
//        this.jdbcTemplate= jdbcTemplate;

//        ChatMemoryRepository chatMemoryRepository = JdbcChatMemoryRepository.builder()
//                .jdbcTemplate(jdbcTemplate)
//                .dialect(new MysqlChatMemoryRepositoryDialect())
//                .build();

        ChatMemory chatMemory= MessageWindowChatMemory.builder()
                .chatMemoryRepository(jdbcChatMemoryRepository)
                .maxMessages(36)
                .build();


        this.chatClient = chatClient
                .defaultAdvisors(MessageChatMemoryAdvisor.builder(chatMemory).build())
                .build();
    }

    public String chat(ChatRequest request){
        String conversationId = String.valueOf(request.getUserId());

        SystemMessage systemMessage= new SystemMessage(this.systemPrompt);
        UserMessage userMessage = new UserMessage(request.getMessage());
        Prompt prompt = new Prompt(systemMessage, userMessage);

        return chatClient
                .prompt(prompt)
                .advisors(advisorSpec -> advisorSpec.param(
                        ChatMemory.CONVERSATION_ID, conversationId
                ))
                .call()
                .content();
    }

    public String chatWithMedia(MultipartFile file, String message){
        Media media =  Media.builder()
                .mimeType(MimeTypeUtils.parseMimeType(file.getContentType()))
                .data(file.getResource())
                .build();
        ChatOptions chatOptions = ChatOptions.builder()
                .temperature(0D)
                .build();
        return chatClient
                .prompt()
                .system(this.systemPrompt)
                .user(promptUserSpec ->
                        promptUserSpec
                                .media(media)
                                .text(message))
                .call().content();
    }
}