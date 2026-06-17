package com.propai.propertyservice.model;
import lombok.*;
import org.springframework.data.annotation.*;
import org.springframework.data.mongodb.core.mapping.Document;
import java.math.BigDecimal;
import java.time.Instant;
import java.util.List;

@Data @Builder @NoArgsConstructor @AllArgsConstructor
@Document(collection = "properties")
public class Property {
    @Id private String id;
    private String title;
    private String description;
    private PropertyType type;
    private PropertyCategory category;
    private BigDecimal price;
    private String priceFrequency;
    private Address address;
    private PropertyDetails details;
    @Builder.Default private List<String> imageUrls = List.of();
    private String virtualTourUrl;
    private String floorPlanUrl;
    private String epcRating;
    private String agentId;
    private String agentName;
    private String agentPhone;
    private String agentEmail;
    @Builder.Default private PropertyStatus status = PropertyStatus.ACTIVE;
    private boolean featured;
    @Builder.Default private long viewCount = 0;
    @Builder.Default private long saveCount = 0;
    @CreatedDate private Instant createdAt;
    @LastModifiedDate private Instant updatedAt;
    private Instant listedAt;
    @Builder.Default private List<String> tags = List.of();
    private String tenure;
    private String councilTaxBand;
    private String nearestStation;
    private Double stationDistanceMiles;
    private String aiSummary;
    @Builder.Default private List<String> aiHighlights = List.of();
    private Double aiPriceScore;

    public enum PropertyType { SALE, RENT, NEW_BUILD }
    public enum PropertyCategory { HOUSE, FLAT, BUNGALOW, STUDIO, TERRACED, SEMI_DETACHED, DETACHED, COMMERCIAL, LAND }
    public enum PropertyStatus { ACTIVE, SOLD, UNDER_OFFER, LET_AGREED, WITHDRAWN }

    @Data @NoArgsConstructor @AllArgsConstructor @Builder
    public static class Address {
        private String line1, line2, city, county;
        private String postcode;
        @Builder.Default private String country = "UK";
        public String getDisplayAddress() {
            return String.format("%s, %s, %s", line1, city, postcode);
        }
    }

    @Data @NoArgsConstructor @AllArgsConstructor @Builder
    public static class PropertyDetails {
        private int bedrooms, bathrooms, receptionRooms;
        private Double squareFootage;
        private boolean garden, parking, garage, petFriendly, billsIncluded, chainFree;
        @Builder.Default private List<String> amenities = List.of();
    }
}
