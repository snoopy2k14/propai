package com.propai.propertyservice.repository;
import com.propai.propertyservice.model.Property;
import org.springframework.data.domain.*;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;
import java.math.BigDecimal;
import java.util.List;

@Repository
public interface PropertyRepository extends MongoRepository<Property, String> {
    Page<Property> findByTypeAndStatus(Property.PropertyType type, Property.PropertyStatus status, Pageable p);

    @Query("{ 'address.city': { $regex: ?0, $options: 'i' }, 'status': 'ACTIVE' }")
    Page<Property> findByCityIgnoreCase(String city, Pageable p);

    @Query("{ 'price': { $gte: ?0, $lte: ?1 }, 'details.bedrooms': { $gte: ?2 }, 'type': ?3, 'status': 'ACTIVE' }")
    Page<Property> findByPriceRangeAndBedrooms(BigDecimal min, BigDecimal max, int beds, Property.PropertyType type, Pageable p);

    @Query("{ 'featured': true, 'status': 'ACTIVE' }")
    List<Property> findFeaturedProperties(Pageable p);

    @Query("{ 'agentId': ?0 }")
    Page<Property> findByAgentId(String agentId, Pageable p);

    long countByTypeAndStatus(Property.PropertyType type, Property.PropertyStatus status);
}
