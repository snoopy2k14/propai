package com.propai.propertyservice.config;
import org.apache.kafka.clients.admin.NewTopic;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.kafka.config.TopicBuilder;

@Configuration
public class KafkaConfig {
    @Bean public NewTopic propertyEvents() { return TopicBuilder.name("property.events").partitions(6).replicas(1).build(); }
    @Bean public NewTopic notifications()  { return TopicBuilder.name("notification.send").partitions(3).replicas(1).build(); }
    @Bean public NewTopic analytics()      { return TopicBuilder.name("analytics.events").partitions(6).replicas(1).build(); }
    @Bean public NewTopic chatHandover()   { return TopicBuilder.name("chat.handover").partitions(3).replicas(1).build(); }
    @Bean public NewTopic enquiryCreated() { return TopicBuilder.name("enquiry.created").partitions(3).replicas(1).build(); }
}
