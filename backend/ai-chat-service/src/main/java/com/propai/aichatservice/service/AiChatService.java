package com.propai.aichatservice.service;
import com.propai.aichatservice.model.ChatSession;
import lombok.*;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;
import tools.jackson.databind.JsonNode;
import tools.jackson.databind.json.JsonMapper;

import java.time.Instant;
import java.util.*;

@Service @RequiredArgsConstructor @Slf4j
public class AiChatService {
    private final WebClient.Builder wcb;
    private final KafkaTemplate<String, Object> kafka;
    private final SimpMessagingTemplate ws;
    private final ChatSessionRepository repo;
    private final JsonMapper om;

    @Value("${propai.ai.api-key:}") private String apiKey;
    @Value("${propai.ai.model:claude-sonnet-4-6}") private String model;

    private static final String API = "https://api.anthropic.com/v1/messages";
    private static final String SYSTEM = "You are PropAI Assistant, a friendly UK property expert. Help users find properties, understand mortgages, navigate the buying/renting process, and get area guides. Use British English. If a user wants a human agent, start your response with HANDOVER_TO_AGENT.";

    public Mono<Map<String,Object>> chat(String sessionId, String message, String userId) {
        return repo.findById(sessionId)
            .defaultIfEmpty(ChatSession.builder().id(sessionId).userId(userId).build())
            .flatMap(session -> {
                session.addMessage("user", message);
                return callApi(session.getMessages()).map(reply -> processReply(session, reply, userId));
            });
    }

    private Mono<String> callApi(List<ChatSession.ChatMessage> messages) {
        if (apiKey == null || apiKey.isBlank())
            return Mono.just("PropAI Assistant ready. Configure ANTHROPIC_API_KEY in .env to enable AI.");
        List<Map<String,String>> msgs = messages.stream()
            .map(m -> Map.of("role", m.getRole(), "content", m.getContent())).toList();
        return wcb.build().post().uri(API)
            .header("x-api-key", apiKey).header("anthropic-version","2023-06-01")
            .header("Content-Type","application/json")
            .bodyValue(Map.of("model",model,"max_tokens",1024,"system",SYSTEM,"messages",msgs))
            .retrieve().bodyToMono(JsonNode.class)
            .map(r -> r.path("content").get(0).path("text").asText())
            .onErrorReturn("I am having trouble connecting. Please try again.");
    }

    private Map<String,Object> processReply(ChatSession s, String reply, String userId) {
        boolean handover = reply.startsWith("HANDOVER_TO_AGENT");
        String clean = handover ? reply.replace("HANDOVER_TO_AGENT","").trim() : reply;
        s.addMessage("assistant", clean);
        repo.save(s).subscribe();
        if (handover) {
            var ev = Map.of("eventType","CHAT_HANDOVER_REQUESTED","sessionId",s.getId(),
                "userId",userId!=null?userId:"anonymous","timestamp",Instant.now().toString());
            kafka.send("chat.handover", s.getId(), ev);
            ws.convertAndSend("/topic/agent-queue", ev);
        }
        kafka.send("analytics.events", s.getId(), Map.of("eventType","CHAT_MESSAGE",
            "sessionId",s.getId(),"handover",handover,"timestamp",Instant.now().toString()));
        return Map.of("message",clean,"sessionId",s.getId(),"handoverTriggered",handover,"timestamp",Instant.now());
    }
}
