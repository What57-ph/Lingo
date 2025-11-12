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
import org.springframework.ai.chat.messages.Message;
import org.springframework.ai.chat.messages.SystemMessage;
import org.springframework.ai.chat.messages.UserMessage;
import org.springframework.ai.chat.prompt.ChatOptions;
import org.springframework.ai.chat.prompt.Prompt;
import org.springframework.ai.content.Media;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;
import org.springframework.util.MimeTypeUtils;
import org.springframework.web.multipart.MultipartFile;
import java.util.List;
import java.util.UUID;

@Service
@FieldDefaults(level= AccessLevel.PRIVATE)
public class ChatbotService {
    final ChatClient chatClient;
    final JdbcChatMemoryRepository jdbcChatMemoryRepository;
    final ChatMemory chatMemory;
//    final JdbcTemplate jdbcTemplate;
String systemPrompt = """
You are an expert but friendly TOEIC and IELTS tutor chatbot. 
Your goal is to help users improve their English skills through natural conversation. 
Respond clearly and conversationally — short paragraphs, direct answers, and friendly tone. 
Only answer questions related to English learning or exam preparation. 
If users request practice, create authentic TOEIC/IELTS-style exercises for any skill or part. 
When giving feedback, always include:
1. Estimated score or band (with reason),
2. Corrected version of the user's sentence or answer,
3. Brief explanation of mistakes,
4. Practical improvement tips.
Keep your responses formatted neatly for a chat interface.
""";


    public ChatbotService(ChatClient.Builder chatClient, JdbcChatMemoryRepository jdbcChatMemoryRepository, ChatMemory chatMemoryInit) {
        this.chatMemory=chatMemoryInit;
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
        String conversationId = request.getUserId();

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

    public String chatWithMedia(MultipartFile file, String message, String userId){
        Media media =  Media.builder()
                .mimeType(MimeTypeUtils.parseMimeType(file.getContentType()))
                .data(file.getResource())
                .build();
        ChatOptions chatOptions = ChatOptions.builder()
                .temperature(0D)
                .build();
        return chatClient
                .prompt()
                .advisors(advisorSpec -> advisorSpec.param(
                        ChatMemory.CONVERSATION_ID, String.valueOf(userId)
                        )
                )
                .system(this.systemPrompt)
                .user(promptUserSpec ->
                        promptUserSpec
                                .media(media)
                                .text(message))
                .call().content();
    }

    public List<Message> getConversationMessage(String conversationsId){
        return chatMemory.get(conversationsId);
    }
}