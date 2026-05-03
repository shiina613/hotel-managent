package com.hotel.management.config;

import com.hotel.management.security.JwtService;
import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.JwtException;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.List;

/**
 * JWT authentication filter that validates Bearer tokens on every request.
 *
 * <p>Behavior:
 * <ul>
 *   <li>No Authorization header → call chain.doFilter() (let SecurityConfig handle it)</li>
 *   <li>Valid token → set UsernamePasswordAuthenticationToken into SecurityContext</li>
 *   <li>Invalid/expired token → write 401 JSON response directly (no exception thrown)</li>
 * </ul>
 */
@Component
@Slf4j
public class JwtAuthFilter extends OncePerRequestFilter {

    private final JwtService jwtService;

    public JwtAuthFilter(JwtService jwtService) {
        this.jwtService = jwtService;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain chain)
            throws ServletException, IOException {

        String authHeader = request.getHeader("Authorization");

        // 1. No Authorization header or doesn't start with "Bearer " → pass through
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            chain.doFilter(request, response);
            return;
        }

        // 2. Extract the token
        String token = authHeader.substring(7);

        // 3. Validate the token — distinguish expired from invalid
        try {
            if (!jwtService.isTokenValid(token)) {
                // isTokenValid() returns false for expired tokens too; check specifically
                if (jwtService.isTokenExpired(token)) {
                    log.warn("JWT expired - URI: {}", request.getRequestURI());
                } else {
                    log.warn("JWT validation failed - invalid token: {}", request.getRequestURI());
                }
                writeUnauthorizedResponse(response);
                return;
            }
        } catch (ExpiredJwtException e) {
            log.warn("JWT expired - URI: {}", request.getRequestURI());
            writeUnauthorizedResponse(response);
            return;
        } catch (JwtException e) {
            log.warn("JWT invalid - URI: {}, error: {}", request.getRequestURI(), e.getMessage());
            writeUnauthorizedResponse(response);
            return;
        }

        // 4. Token is valid — extract claims and set SecurityContext
        try {
            String username = jwtService.extractUsername(token);
            String role = jwtService.extractRole(token);

            // Only set authentication if not already set in context
            if (username != null && SecurityContextHolder.getContext().getAuthentication() == null) {
                List<SimpleGrantedAuthority> authorities = List.of(new SimpleGrantedAuthority("ROLE_" + role));

                UsernamePasswordAuthenticationToken authToken =
                        new UsernamePasswordAuthenticationToken(username, null, authorities);

                authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));

                SecurityContextHolder.getContext().setAuthentication(authToken);
                log.debug("Authenticated user '{}' with role '{}' for request: {} {}",
                        username, role, request.getMethod(), request.getRequestURI());
            }

            chain.doFilter(request, response);

        } catch (ExpiredJwtException e) {
            log.warn("JWT expired - URI: {}", request.getRequestURI());
            writeUnauthorizedResponse(response);
        } catch (JwtException e) {
            log.warn("JWT invalid - URI: {}, error: {}", request.getRequestURI(), e.getMessage());
            writeUnauthorizedResponse(response);
        } catch (Exception e) {
            // Any unexpected error during claim extraction → treat as invalid token
            log.warn("JWT validation failed - unexpected error: {}, URI: {}",
                    e.getMessage(), request.getRequestURI());
            writeUnauthorizedResponse(response);
        }
    }

    /**
     * Write a 401 JSON response directly without throwing an exception.
     * This prevents Spring Security from redirecting to /login.
     */
    private void writeUnauthorizedResponse(HttpServletResponse response) throws IOException {
        response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");
        response.getWriter().write("{\"success\":false,\"message\":\"Token không hợp lệ hoặc đã hết hạn\"}");
    }
}
