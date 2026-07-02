package com.propai.userservice.config;

import com.propai.userservice.security.JwtAuthenticationFilter;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtAuthenticationFilter;

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http.csrf(c -> c.disable())
                // Stateless: this is a JWT-bearer API, not a session/cookie-based
                // app. Without this, Spring Security still defaults to creating
                // a JSESSIONID-backed session (visible in tonight's curl test --
                // a Set-Cookie: JSESSIONID header was present even on a 403),
                // which is unnecessary and inconsistent with how the rest of
                // this stack authenticates.
                .sessionManagement(s -> s.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .authorizeHttpRequests(a -> a
                        .requestMatchers("/api/v1/auth/**", "/actuator/**").permitAll()
                        .anyRequest().authenticated())
                // Runs before the standard username/password filter so a valid
                // bearer token populates the SecurityContext before Spring
                // Security's default authentication mechanisms get a chance to
                // reject the request for lacking a session.
                .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }
}
