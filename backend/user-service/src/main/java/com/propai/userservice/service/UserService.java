package com.propai.userservice.service;
import com.propai.userservice.model.User;
import com.propai.userservice.repository.UserRepository;
import com.propai.userservice.security.JwtService;
import lombok.*;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import java.time.Instant;
import java.util.Map;
import java.util.Optional;

@Service @RequiredArgsConstructor @Slf4j
public class UserService {
    private final UserRepository repo;
    private final JwtService jwt;
    private final KafkaTemplate<String, Object> kafka;
    private final BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();

    public Map<String, Object> register(String firstName, String lastName, String email, String password, User.UserRole role) {
        if (repo.existsByEmail(email)) throw new RuntimeException("Email already registered");
        User u = User.builder().firstName(firstName).lastName(lastName)
            .email(email).passwordHash(encoder.encode(password)).role(role).build();
        User saved = repo.save(u);
        kafka.send("notification.send", saved.getId(), Map.of("type","USER_REGISTERED","userId",saved.getId(),"email",email));
        String token = jwt.generateToken(saved.getId(), email);
        return Map.of("token", token, "user", saved);
    }

    public Map<String, Object> login(String email, String password) {
        User u = repo.findByEmail(email).orElseThrow(() -> new RuntimeException("Invalid credentials"));
        if (!encoder.matches(password, u.getPasswordHash())) throw new RuntimeException("Invalid credentials");
        u.setLastLoginAt(Instant.now());
        repo.save(u);
        return Map.of("token", jwt.generateToken(u.getId(), email), "user", u);
    }

    public Optional<User> findById(String id) { return repo.findById(id); }

    public User update(String id, User upd) {
        User ex = repo.findById(id).orElseThrow(() -> new RuntimeException("Not found"));
        upd.setId(id); upd.setPasswordHash(ex.getPasswordHash()); upd.setCreatedAt(ex.getCreatedAt());
        return repo.save(upd);
    }
}
