package com.propai.enquiryservice.repository;
import com.propai.enquiryservice.model.Enquiry;
import org.springframework.data.domain.*;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;

public interface EnquiryRepository extends MongoRepository<Enquiry, String> {
    List<Enquiry> findByPropertyId(String propertyId);
    Page<Enquiry> findByAgentId(String agentId, Pageable p);
    List<Enquiry> findByUserId(String userId);
}
