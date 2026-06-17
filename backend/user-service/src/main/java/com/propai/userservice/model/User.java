package com.propai.userservice.model;
import lombok.*;
import org.springframework.data.annotation.*;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;
import java.time.Instant;
import java.util.List;

@Data @Builder @NoArgsConstructor @AllArgsConstructor
@Document(collection = "users")
public class User {
    @Id private String id;
    private String firstName, lastName;
    @Indexed(unique = true) private String email;
    private String passwordHash;
    @Builder.Default private UserRole role = UserRole.BUYER;
    @Builder.Default private boolean active = true;
    private String phone;
    private String avatarUrl;
    @Builder.Default private List<String> savedPropertyIds = List.of();
    @Builder.Default private List<String> savedSearchIds = List.of();
    @CreatedDate private Instant createdAt;
    @LastModifiedDate private Instant updatedAt;
    private Instant lastLoginAt;
    public enum UserRole { BUYER, RENTER, INVESTOR, AGENT, LANDLORD, ADMIN }
    public String getFullName() { return firstName + " " + lastName; }
}
