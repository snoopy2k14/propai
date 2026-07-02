package com.propai.propertyservice.config;

import com.propai.propertyservice.security.JwtAuthenticationFilter;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;

/**
 * NEW FILE -- property-service had spring-boot-starter-security on its
 * classpath but no SecurityConfig at all, meaning Spring Security's default
 * form-login/session behavior was silently active. Any request here would
 * have hit the same 302-to-login / 403 pattern found in ai-chat-service and
 * user-service tonight, just not yet noticed because nothing had explicitly
 * tested an authenticated property-service endpoint.
 * <p>
 * IMPORTANT: per the api-gateway's public-paths config (propai.security.public-paths
 * in docker-compose.yml), /api/v1/properties/search and
 * /api/v1/properties/featured are meant to be publicly browsable without
 * login (confirmed by tonight's Network tab showing these called even
 * while logged out). Those two paths are explicitly permitAll() here too --
 * the gateway's public-paths list only controls whether the GATEWAY itself
 * requires a token before forwarding the request; it does NOT make the
 * downstream service skip its own auth check. Both layers need to agree.
 * <p>
 * REVIEW BEFORE DEPLOYING: confirm PropertyController doesn't have other
 * public routes beyond these two -- I have not seen its full route list.
 */
@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtAuthenticationFilter;

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http.csrf(c -> c.disable())
                .sessionManagement(s -> s.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .authorizeHttpRequests(a -> a
                        .requestMatchers(
                                "/api/v1/properties/search",
                                "/api/v1/properties/featured",
                                "/api/v1/properties/stats",
                                "/actuator/**"
                        ).permitAll()
                        .anyRequest().authenticated())
                .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }
}
