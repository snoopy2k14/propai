package com.propai.userservice.security;

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
 * This is the piece that was missing: SecurityConfig's
 * .anyRequest().authenticated() had nothing wiring an incoming JWT into an
 * authenticated principal, so every protected request fell through to
 * Spring Security's default session/cookie-based behavior and was rejected
 * (403, or a 302-to-login on services with form-login still enabled).
 * <p>
 * Registered in SecurityConfig before UsernamePasswordAuthenticationFilter.
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
        // If invalid, we deliberately do NOT throw here -- we let the request
        // continue unauthenticated, and SecurityConfig's .anyRequest().authenticated()
        // is what actually rejects it (403) for protected paths. This keeps
        // permitAll() paths (e.g. /api/v1/auth/**) working even if a stale or
        // garbage Authorization header happens to be present.

        filterChain.doFilter(request, response);
    }
}
