package com.propai.apigateway.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.reactive.CorsConfigurationSource;
import org.springframework.web.cors.reactive.UrlBasedCorsConfigurationSource;
import org.springframework.web.cors.reactive.CorsWebFilter;

import java.util.Arrays;
import java.util.List;

/**
 * Explicit CORS configuration for the gateway.
 * <p>
 * This replaces the previous YAML-based spring.cloud.gateway.server.webflux.globalcors
 * config, which relied on Spring's relaxed binding to split a comma-separated
 * env var into a List<String> inside a nested corsConfigurations map — that
 * did not reliably split as expected, resulting in the whole comma-separated
 * string being treated as a single literal origin (which then never matched
 * any real browser Origin header, silently dropping all CORS headers).
 * <p>
 * Splitting the env var explicitly in Java here is unambiguous and testable.
 */
@Configuration
public class CorsConfig {

    @Value("${propai.cors.allowed-origins}")
    private String allowedOriginsRaw;

    @Bean
    public CorsWebFilter corsWebFilter() {
        List<String> origins = Arrays.stream(allowedOriginsRaw.split(","))
                .map(String::trim)
                .filter(s -> !s.isBlank())
                .toList();

        CorsConfiguration config = new CorsConfiguration();
        config.setAllowedOrigins(origins);
        config.setAllowedMethods(List.of("GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"));
        config.setAllowedHeaders(List.of("*"));
        config.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);

        return new CorsWebFilter(source);
    }
}
