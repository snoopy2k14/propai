package com.propai.propertyservice.dto;
import com.propai.propertyservice.model.Property;
import lombok.*;
import java.math.BigDecimal;

@Data @Builder @NoArgsConstructor @AllArgsConstructor
public class PropertySearchRequest {
    private String city, postcode, query;
    private Property.PropertyType type;
    private Property.PropertyCategory category;
    private BigDecimal minPrice, maxPrice;
    private Integer minBedrooms;
    @Builder.Default private int page = 0;
    @Builder.Default private int size = 20;
}
