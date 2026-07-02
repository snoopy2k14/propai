package com.propai.aichatservice;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.security.autoconfigure.UserDetailsServiceAutoConfiguration;
import org.springframework.kafka.annotation.EnableKafka;
import org.springframework.scheduling.annotation.EnableAsync;

@SpringBootApplication(exclude = { UserDetailsServiceAutoConfiguration.class })
@EnableKafka
@EnableAsync
public class AiChatServiceApplication {
    public static void main(String[] args) { SpringApplication.run(AiChatServiceApplication.class, args); }
}
