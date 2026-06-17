package com.propai.enquiryservice.model;
import lombok.*;
import org.springframework.data.annotation.*;
import org.springframework.data.mongodb.core.mapping.Document;
import java.time.Instant;

@Data @Builder @NoArgsConstructor @AllArgsConstructor
@Document(collection = "enquiries")
public class Enquiry {
    @Id private String id;
    private String propertyId, userId, agentId;
    private String name, email, phone;
    private String message;
    private EnquiryType type;
    @Builder.Default private EnquiryStatus status = EnquiryStatus.NEW;
    @CreatedDate private Instant createdAt;
    @LastModifiedDate private Instant updatedAt;
    private Instant respondedAt;
    public enum EnquiryType { VIEWING_REQUEST, GENERAL, OFFER, MORTGAGE_ADVICE }
    public enum EnquiryStatus { NEW, READ, RESPONDED, CLOSED }
}
