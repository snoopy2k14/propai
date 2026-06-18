package com.propai.aichatservice.config;

import com.mongodb.ConnectionString;
import com.mongodb.MongoClientSettings;
import com.mongodb.reactivestreams.client.MongoClient;
import com.mongodb.reactivestreams.client.MongoClients;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.mongodb.core.ReactiveMongoTemplate;

@Configuration
public class MongoConfig {

    @Value("${MONGODB_URI:mongodb://propai:propai_secret@localhost:27017/propai_ai_chat_service?authSource=admin}")
    private String mongoUri;

    @Bean
    public MongoClient reactiveMongoClient() {
        return MongoClients.create(
                MongoClientSettings.builder()
                        .applyConnectionString(new ConnectionString(mongoUri))
                        .build()
        );
    }

    @Bean
    public ReactiveMongoTemplate reactiveMongoTemplate(MongoClient reactiveMongoClient) {
        String db = new ConnectionString(mongoUri).getDatabase();
        return new ReactiveMongoTemplate(reactiveMongoClient,
                db != null ? db : "propai_ai_chat_service");
    }
}