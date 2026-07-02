package com.propai.propertyservice.security;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.lang.NonNull;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.Collections;

/**
 * Reads the Authorization: Bearer <token> header on every request, validates
 * it via JwtService, and -- if valid -- populates Spring Security's
 * SecurityContext with an authenticated principal (the user's id).
 * <p>
 * Mirrors user-service's JwtAuthenticationFilter exactly. This was the
 * missing piece causing /api/v1/chat/message to 302-redirect to a
 * session-based login page instead of returning JSON: ai-chat-service had
 * no SecurityConfig at all, so Spring Security's default form-login
 * behavior was active and unmodified.
 */
@Component
@RequiredArgsConstructor
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtService jwtService;

    @Override
    protected void doFilterInternal(
            @NonNull HttpServletRequest request,
            @NonNull HttpServletResponse response,
            @NonNull FilterChain filterChain
    ) throws ServletException, IOException {

        String authHeader = request.getHeader("Authorization");

        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            filterChain.doFilter(request, response);
            return;
        }

        String token = authHeader.substring(7);

        if (jwtService.isValid(token)) {
            String userId = jwtService.extractUserId(token);

            var authentication = new UsernamePasswordAuthenticationToken(
                    userId, null, Collections.emptyList());

            SecurityContextHolder.getContext().setAuthentication(authentication);
        }

        filterChain.doFilter(request, response);
    }
}
