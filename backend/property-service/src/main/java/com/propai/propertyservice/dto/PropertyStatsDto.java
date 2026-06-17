package com.propai.propertyservice.dto;
import lombok.*;

@Data @Builder @NoArgsConstructor @AllArgsConstructor
public class PropertyStatsDto {
    private long totalForSale;
    private long totalToRent;
    private long totalNewBuilds;
}
