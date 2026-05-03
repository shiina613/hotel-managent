package com.hotel.management.config;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.core.Ordered;
import org.springframework.core.annotation.Order;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

/**
 * Logs every HTTP request with method, URI, client IP, authenticated user, duration, and status.
 *
 * <p>Skips logging for: /swagger-ui, /v3/api-docs, /favicon.ico
 *
 * <p>Runs early in the filter chain (HIGHEST_PRECEDENCE + 10) but after security filters
 * so the SecurityContext is already populated when we extract the username.
 */
@Component
@Slf4j
@Order(Ordered.HIGHEST_PRECEDENCE + 10)
public class RequestLoggingFilter extends OncePerRequestFilter {

    private static final String[] SKIP_PATHS = {
        "/swagger-ui",
        "/v3/api-docs",
        "/favicon.ico"
    };

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain chain)
            throws ServletException, IOException {

        String uri = request.getRequestURI();

        // Skip logging for documentation and static resource paths
        if (shouldSkip(uri)) {
            chain.doFilter(request, response);
            return;
        }

        long startTime = System.currentTimeMillis();
        String method = request.getMethod();
        String clientIp = extractClientIp(request);

        try {
            chain.doFilter(request, response);
        } finally {
            long duration = System.currentTimeMillis() - startTime;
            String username = extractUsername();
            int status = response.getStatus();

            log.info("[{}] {} - IP: {} - User: {} - {}ms - Status: {}",
                    method, uri, clientIp, username, duration, status);
        }
    }

    /**
     * Extract the client IP address, checking X-Forwarded-For first (for reverse proxies),
     * then falling back to the direct remote address.
     */
    private String extractClientIp(HttpServletRequest request) {
        String forwarded = request.getHeader("X-Forwarded-For");
        if (forwarded != null && !forwarded.isBlank()) {
            // X-Forwarded-For may contain a comma-separated list; the first entry is the client IP
            return forwarded.split(",")[0].trim();
        }
        return request.getRemoteAddr();
    }

    /**
     * Extract the authenticated username from the SecurityContext.
     * Returns "anonymous" if the user is not authenticated or the context is empty.
     */
    private String extractUsername() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || !auth.isAuthenticated() || "anonymousUser".equals(auth.getPrincipal())) {
            return "anonymous";
        }
        return auth.getName();
    }

    /**
     * Returns true if the request URI matches any of the paths that should be skipped.
     */
    private boolean shouldSkip(String uri) {
        for (String skipPath : SKIP_PATHS) {
            if (uri.startsWith(skipPath)) {
                return true;
            }
        }
        return false;
    }
}
