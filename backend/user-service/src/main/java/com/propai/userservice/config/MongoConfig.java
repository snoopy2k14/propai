package com.propai.userservice.config;

import com.mongodb.ConnectionString;
import com.mongodb.MongoClientSettings;
import com.mongodb.client.MongoClient;
import com.mongodb.client.MongoClients;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.mongodb.core.MongoTemplate;

/**
 * Explicit MongoClient bean — works around Spring Boot 4.1.0 MongoAutoConfiguration
 * not binding spring.mongodb.uri from environment variables correctly.
 * Same pattern as KafkaProducerConfig; revisit once Boot 4 autoconfiguration stabilises.
 */
@Configuration
public class MongoConfig {

    @Value("${MONGODB_URI:mongodb://propai:propai_secret@localhost:27017/propai_user_service?authSource=admin}")
    private String mongoUri;

    @Bean
    public MongoClient mongoClient() {
        return MongoClients.create(
                MongoClientSettings.builder()
                        .applyConnectionString(new ConnectionString(mongoUri))
                        .build()
        );
    }

    @Bean
    public MongoTemplate mongoTemplate(MongoClient mongoClient) {
        // Extract database name from URI
        String database = new ConnectionString(mongoUri).getDatabase();
        if (database == null) database = "propai_user_service";
        return new MongoTemplate(mongoClient, database);
    }
}