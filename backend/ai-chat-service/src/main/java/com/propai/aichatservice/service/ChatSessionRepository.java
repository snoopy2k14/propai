package com.propai.aichatservice.service;
import com.propai.aichatservice.model.ChatSession;
import org.springframework.data.mongodb.repository.ReactiveMongoRepository;
public interface ChatSessionRepository extends ReactiveMongoRepository<ChatSession, String> {}
