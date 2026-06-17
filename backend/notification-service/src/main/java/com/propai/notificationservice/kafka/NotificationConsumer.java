package com.propai.notificationservice.kafka;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Component;
import java.util.Map;

@Component @Slf4j
public class NotificationConsumer {
    @KafkaListener(topics = "notification.send", groupId = "notification-service-group")
    public void handleNotification(Map<String, Object> event) {
        log.info("Notification: type={}", event.getOrDefault("type", "UNKNOWN"));
    }

    @KafkaListener(topics = "chat.handover", groupId = "notification-service-group")
    public void handleHandover(Map<String, Object> event) {
        log.info("Agent handover: sessionId={}", event.get("sessionId"));
    }
}
