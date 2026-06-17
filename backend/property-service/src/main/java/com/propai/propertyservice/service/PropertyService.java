package com.propai.propertyservice.service;
import com.propai.propertyservice.dto.*;
import com.propai.propertyservice.kafka.PropertyEventProducer;
import com.propai.propertyservice.model.Property;
import com.propai.propertyservice.repository.PropertyRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.cache.annotation.*;
import org.springframework.data.domain.*;
import org.springframework.stereotype.Service;
import java.util.*;

@Service @RequiredArgsConstructor @Slf4j
public class PropertyService {
    private final PropertyRepository repo;
    private final PropertyEventProducer events;

    @Cacheable(value = "properties", key = "#id")
    public Optional<Property> findById(String id) { return repo.findById(id); }

    public Property create(Property p) {
        p.setStatus(Property.PropertyStatus.ACTIVE);
        p.setListedAt(java.time.Instant.now());
        Property saved = repo.save(p);
        events.sendPropertyCreatedEvent(saved);
        return saved;
    }

    @CacheEvict(value = "properties", key = "#id")
    public Property update(String id, Property upd) {
        Property ex = repo.findById(id).orElseThrow(() -> new RuntimeException("Not found: " + id));
        upd.setId(id); upd.setCreatedAt(ex.getCreatedAt());
        return repo.save(upd);
    }

    @CacheEvict(value = "properties", key = "#id")
    public void delete(String id) { repo.deleteById(id); }

    public Page<Property> search(PropertySearchRequest req) {
        Pageable p = PageRequest.of(req.getPage(), req.getSize(), Sort.by(Sort.Direction.DESC, "listedAt"));
        if (req.getCity() != null && !req.getCity().isBlank())
            return repo.findByCityIgnoreCase(req.getCity(), p);
        if (req.getMinPrice() != null && req.getMaxPrice() != null)
            return repo.findByPriceRangeAndBedrooms(
                req.getMinPrice(), req.getMaxPrice(),
                req.getMinBedrooms() != null ? req.getMinBedrooms() : 0,
                req.getType() != null ? req.getType() : Property.PropertyType.SALE, p);
        return repo.findByTypeAndStatus(
            req.getType() != null ? req.getType() : Property.PropertyType.SALE,
            Property.PropertyStatus.ACTIVE, p);
    }

    @Cacheable("featured-properties")
    public List<Property> getFeatured() {
        return repo.findFeaturedProperties(PageRequest.of(0, 12));
    }

    public PropertyStatsDto getStats() {
        return PropertyStatsDto.builder()
            .totalForSale(repo.countByTypeAndStatus(Property.PropertyType.SALE, Property.PropertyStatus.ACTIVE))
            .totalToRent(repo.countByTypeAndStatus(Property.PropertyType.RENT, Property.PropertyStatus.ACTIVE))
            .totalNewBuilds(repo.countByTypeAndStatus(Property.PropertyType.NEW_BUILD, Property.PropertyStatus.ACTIVE))
            .build();
    }

    public void incrementView(String id) {
        repo.findById(id).ifPresent(p -> {
            p.setViewCount(p.getViewCount() + 1);
            repo.save(p);
            events.sendPropertyViewedEvent(id);
        });
    }

    public void toggleSave(String propertyId, String userId) {
        repo.findById(propertyId).ifPresent(p -> {
            p.setSaveCount(p.getSaveCount() + 1);
            repo.save(p);
            events.sendPropertySavedEvent(propertyId, userId);
        });
    }
}
