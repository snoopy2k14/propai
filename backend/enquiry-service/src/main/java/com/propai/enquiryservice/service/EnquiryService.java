package com.propai.enquiryservice.service;
import com.propai.enquiryservice.model.Enquiry;
import com.propai.enquiryservice.repository.EnquiryRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;
import java.time.Instant;
import java.util.List;
import java.util.Map;

@Service @RequiredArgsConstructor @Slf4j
public class EnquiryService {
    private final EnquiryRepository repo;
    private final KafkaTemplate<String, Object> kafka;

    public Enquiry create(Enquiry e) {
        Enquiry saved = repo.save(e);
        kafka.send("enquiry.created", saved.getId(), Map.of(
            "eventType","ENQUIRY_CREATED","enquiryId",saved.getId(),
            "propertyId",saved.getPropertyId(),"agentId",saved.getAgentId() != null ? saved.getAgentId() : "",
            "timestamp",Instant.now().toString()));
        kafka.send("notification.send", saved.getId(), Map.of(
            "type","NEW_ENQUIRY","enquiryId",saved.getId(),
            "agentId",saved.getAgentId() != null ? saved.getAgentId() : ""));
        return saved;
    }

    public List<Enquiry> getByProperty(String propertyId) { return repo.findByPropertyId(propertyId); }
    public List<Enquiry> getByUser(String userId) { return repo.findByUserId(userId); }

    public Enquiry markRead(String id) {
        Enquiry e = repo.findById(id).orElseThrow();
        e.setStatus(Enquiry.EnquiryStatus.READ);
        return repo.save(e);
    }
}
