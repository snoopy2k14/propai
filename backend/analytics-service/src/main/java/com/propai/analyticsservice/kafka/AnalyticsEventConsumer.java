package com.propai.analyticsservice.kafka;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Component;
import java.util.Map;

@Component @Slf4j
public class AnalyticsEventConsumer {
    @KafkaListener(topics = "analytics.events", groupId = "analytics-service-group")
    public void consume(Map<String, Object> event) {
        log.info("Analytics event: type={}", event.get("eventType"));
    }
}
