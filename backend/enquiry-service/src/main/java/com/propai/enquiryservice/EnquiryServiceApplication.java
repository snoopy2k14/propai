package com.propai.enquiryservice;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.mongodb.config.EnableMongoAuditing;
import org.springframework.kafka.annotation.EnableKafka;

@SpringBootApplication @EnableMongoAuditing @EnableKafka
public class EnquiryServiceApplication {
    public static void main(String[] args) { SpringApplication.run(EnquiryServiceApplication.class, args); }
}
