package com.propai.propertyservice.controller;
import com.propai.propertyservice.dto.PropertySearchRequest;
import com.propai.propertyservice.dto.PropertyStatsDto;
import com.propai.propertyservice.model.Property;
import com.propai.propertyservice.service.PropertyService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import java.util.List;
@RestController
@RequestMapping("/api/v1/properties")
@RequiredArgsConstructor
public class PropertyController {
    private final PropertyService svc;
    @GetMapping("/{id}")
    public ResponseEntity<Property> get(@PathVariable String id) {
        return svc.findById(id).map(p -> { svc.incrementView(id); return ResponseEntity.ok(p); })
            .orElse(ResponseEntity.notFound().build());
    }
    @PostMapping
    public ResponseEntity<Property> create(@Valid @RequestBody Property p) {
        return ResponseEntity.status(HttpStatus.CREATED).body(svc.create(p));
    }
    @PutMapping("/{id}")
    public ResponseEntity<Property> update(@PathVariable String id, @Valid @RequestBody Property p) {
        return ResponseEntity.ok(svc.update(id, p));
    }
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable String id) {
        svc.delete(id); return ResponseEntity.noContent().build();
    }
    @GetMapping("/search")
    public ResponseEntity<Page<Property>> search(
            @RequestParam(required=false) String city,
            @RequestParam(required=false) String postcode,
            @RequestParam(defaultValue="SALE") Property.PropertyType type,
            @RequestParam(required=false) Integer minBedrooms,
            @RequestParam(required=false) java.math.BigDecimal minPrice,
            @RequestParam(required=false) java.math.BigDecimal maxPrice,
            @RequestParam(required=false) Property.PropertyCategory category,
            @RequestParam(defaultValue="0") int page,
            @RequestParam(defaultValue="20") int size) {
        return ResponseEntity.ok(svc.search(PropertySearchRequest.builder()
            .city(city).postcode(postcode).type(type).minBedrooms(minBedrooms)
            .minPrice(minPrice).maxPrice(maxPrice).category(category).page(page).size(size).build()));
    }
    @GetMapping("/featured")
    public ResponseEntity<List<Property>> featured() { return ResponseEntity.ok(svc.getFeatured()); }

    // CHANGED: userId is now derived from the authenticated JWT principal
    // (Authentication.getName(), populated by JwtAuthenticationFilter) rather
    // than trusted from a client-supplied X-User-Id header. The previous
    // version let any authenticated caller pass an arbitrary user ID and
    // toggle saves on that user's behalf -- a real authorization gap found
    // while wiring up JWT validation tonight.
    @PostMapping("/{id}/save")
    public ResponseEntity<Void> save(@PathVariable String id, Authentication authentication) {
        String userId = authentication.getName();
        svc.toggleSave(id, userId);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/stats")
    public ResponseEntity<PropertyStatsDto> stats() { return ResponseEntity.ok(svc.getStats()); }
}
