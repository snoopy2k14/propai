package com.propai.aichatservice.security;

import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.Date;

@Service
public class JwtService {
    @Value("${propai.security.jwt.secret:propai_secret_change_me}")
    private String secret;

    private SecretKey key() {
        return Keys.hmacShaKeyFor(secret.getBytes(StandardCharsets.UTF_8));
    }

    public String generateToken(String userId, String email) {
        return Jwts.builder()
                .subject(userId)
                .claim("email", email)
                .issuedAt(new Date())
                .expiration(new Date(System.currentTimeMillis() + 86400000))
                .signWith(key())
                .compact();
    }

    public String extractUserId(String token) {
        return Jwts.parser().verifyWith(key()).build()
                .parseSignedClaims(token).getPayload().getSubject();
    }

    public boolean isValid(String token) {
        try { Jwts.parser().verifyWith(key()).build().parseSignedClaims(token); return true; }
        catch (Exception e) { return false; }
    }
}
