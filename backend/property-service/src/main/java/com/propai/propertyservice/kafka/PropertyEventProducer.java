package com.propai.propertyservice.kafka;
import com.propai.propertyservice.model.Property;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Component;
import java.time.Instant;
import java.util.Map;

@Component @RequiredArgsConstructor @Slf4j
public class PropertyEventProducer {
    private final KafkaTemplate<String, Object> kafkaTemplate;

    public void sendPropertyCreatedEvent(Property p) {
        kafkaTemplate.send("property.events", p.getId(), Map.of(
            "eventType", "PROPERTY_CREATED", "propertyId", p.getId(),
            "type", p.getType().name(), "timestamp", Instant.now().toString()));
        kafkaTemplate.send("notification.send", p.getId(), Map.of(
            "type", "PROPERTY_LISTED", "propertyId", p.getId()));
        log.info("Property created event: {}", p.getId());
    }

    public void sendPropertyViewedEvent(String id) {
        kafkaTemplate.send("analytics.events", id, Map.of(
            "eventType", "PROPERTY_VIEWED", "propertyId", id,
            "timestamp", Instant.now().toString()));
    }

    public void sendPropertySavedEvent(String propertyId, String userId) {
        kafkaTemplate.send("analytics.events", propertyId, Map.of(
            "eventType", "PROPERTY_SAVED", "propertyId", propertyId,
            "userId", userId, "timestamp", Instant.now().toString()));
    }
}
