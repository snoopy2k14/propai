package com.propai.aichatservice.model;
import lombok.*;
import org.springframework.data.annotation.*;
import org.springframework.data.mongodb.core.mapping.Document;
import java.time.Instant;
import java.util.*;

@Data @Builder @NoArgsConstructor @AllArgsConstructor
@Document(collection = "chat_sessions")
public class ChatSession {
    @Id private String id;
    private String userId;
    @Builder.Default private List<ChatMessage> messages = new ArrayList<>();
    @Builder.Default private String status = "ACTIVE";
    @CreatedDate private Instant createdAt;
    @LastModifiedDate private Instant updatedAt;

    public void addMessage(String role, String content) {
        messages.add(new ChatMessage(role, content, Instant.now()));
    }

    @Data @AllArgsConstructor @NoArgsConstructor
    public static class ChatMessage {
        private String role, content;
        private Instant timestamp;
    }
}
