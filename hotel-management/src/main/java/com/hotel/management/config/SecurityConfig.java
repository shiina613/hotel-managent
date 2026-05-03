package com.hotel.management.config;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.io.IOException;
import java.util.Arrays;

/**
 * Spring Security 6 configuration using lambda DSL (no deprecated .and()).
 *
 * <p>Authorization rules:
 * <ul>
 *   <li>Public: /api/v1/auth/**, /swagger-ui/**, /swagger-ui.html, /v3/api-docs/**</li>
 *   <li>ADMIN only: /api/v1/dashboard/**, all CRUD on /api/v1/users/**</li>
 *   <li>ADMIN + RECEPTIONIST: POST/PUT/DELETE /api/v1/rooms/**, PUT /api/v1/bookings/**</li>
 *   <li>Authenticated (any role): everything else</li>
 * </ul>
 */
@Configuration
@EnableWebSecurity
@Slf4j
public class SecurityConfig {

    private final JwtAuthFilter jwtAuthFilter;

    public SecurityConfig(JwtAuthFilter jwtAuthFilter) {
        this.jwtAuthFilter = jwtAuthFilter;
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            // 5.2 Disable CSRF — stateless JWT, no session cookies
            .csrf(AbstractHttpConfigurer::disable)

            // 5.3 CORS — must be configured here so Security filter honours it before controllers
            .cors(cors -> cors.configurationSource(corsConfigurationSource()))

            // 5.4 Stateless session — no HttpSession created or used
            .sessionManagement(session ->
                session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))

            // Authorization rules
            .authorizeHttpRequests(auth -> auth

                // 5.5 Public endpoints — no authentication required
                .requestMatchers(
                    "/api/v1/auth/**",
                    "/uploads/**",
                    "/swagger-ui/**",
                    "/swagger-ui.html",
                    "/v3/api-docs/**"
                ).permitAll()

                // 5.6 ADMIN only — dashboard and full user management
                .requestMatchers("/api/v1/dashboard/**").hasRole("ADMIN")

                // User profile endpoints — accessible to all authenticated users (any role)
                .requestMatchers(HttpMethod.GET,  "/api/v1/users/me").authenticated()
                .requestMatchers(HttpMethod.PUT,  "/api/v1/users/me").authenticated()
                .requestMatchers(HttpMethod.GET,  "/api/v1/users/me/bookings").authenticated()
                .requestMatchers(HttpMethod.GET,  "/api/v1/users/me/invoices").authenticated()

                // ADMIN only — full user management (must come after /me rules)
                .requestMatchers(HttpMethod.GET,    "/api/v1/users/**").hasRole("ADMIN")
                .requestMatchers(HttpMethod.POST,   "/api/v1/users/**").hasRole("ADMIN")
                .requestMatchers(HttpMethod.PUT,    "/api/v1/users/**").hasRole("ADMIN")
                .requestMatchers(HttpMethod.DELETE, "/api/v1/users/**").hasRole("ADMIN")

                // 5.7 ADMIN + RECEPTIONIST — room mutations and booking updates
                .requestMatchers(HttpMethod.POST,   "/api/v1/rooms/**").hasAnyRole("ADMIN", "RECEPTIONIST")
                .requestMatchers(HttpMethod.PUT,    "/api/v1/rooms/**").hasAnyRole("ADMIN", "RECEPTIONIST")
                .requestMatchers(HttpMethod.DELETE, "/api/v1/rooms/**").hasAnyRole("ADMIN", "RECEPTIONIST")
                .requestMatchers(HttpMethod.PUT,    "/api/v1/bookings/**").hasAnyRole("ADMIN", "RECEPTIONIST")

                // 5.8 Everything else requires authentication (any role)
                .anyRequest().authenticated()
            )

            // 5.9 Custom 401 — return JSON instead of redirecting to /login
            .exceptionHandling(ex -> ex
                .authenticationEntryPoint(this::handleUnauthorized)
                // 5.10 Custom 403 — return JSON instead of default error page
                .accessDeniedHandler(this::handleAccessDenied)
            )

            // 5.11 Add JWT filter before the username/password filter
            .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    /**
     * CORS configuration source — mirrors CorsConfig.java settings so that
     * Spring Security's CORS filter (which runs before controllers) uses the
     * same allowed origins, methods, and headers.
     *
     * <p>Origins: http://localhost:3000 (React CRA) and http://localhost:5173 (Vite)
     */
    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration config = new CorsConfiguration();

        config.setAllowCredentials(true);
        config.setAllowedOrigins(Arrays.asList(
            "http://localhost:3000",
            "http://localhost:5173"
        ));
        config.addAllowedHeader("*");
        config.setAllowedMethods(Arrays.asList(
            "GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"
        ));
        config.setExposedHeaders(Arrays.asList(
            "Authorization",
            "Content-Type",
            "X-Requested-With",
            "Accept",
            "Origin",
            "Access-Control-Request-Method",
            "Access-Control-Request-Headers"
        ));
        config.setMaxAge(3600L);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);
        return source;
    }

    /**
     * 5.9 — Return a JSON 401 response instead of redirecting to /login.
     */
    private void handleUnauthorized(HttpServletRequest request,
                                    HttpServletResponse response,
                                    org.springframework.security.core.AuthenticationException ex)
            throws IOException {
        response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");
        response.getWriter().write(
            "{\"success\":false,\"message\":\"Yêu cầu xác thực\"}"
        );
    }

    /**
     * 5.10 — Return a JSON 403 response instead of the default error page.
     */
    private void handleAccessDenied(HttpServletRequest request,
                                    HttpServletResponse response,
                                    org.springframework.security.access.AccessDeniedException ex)
            throws IOException {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = authentication != null ? authentication.getName() : "anonymous";
        log.warn("Access denied - URI: {}, User: {}, IP: {}",
                request.getRequestURI(), username, request.getRemoteAddr());
        response.setStatus(HttpServletResponse.SC_FORBIDDEN);
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");
        response.getWriter().write(
            "{\"success\":false,\"message\":\"Bạn không có quyền truy cập tài nguyên này\"}"
        );
    }
}
