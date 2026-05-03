package com.hotel.management.config;

import io.swagger.v3.oas.models.Components;
import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.security.SecurityRequirement;
import io.swagger.v3.oas.models.security.SecurityScheme;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

/**
 * SpringDoc OpenAPI 3 configuration.
 *
 * <p>Exposes Swagger UI at /swagger-ui.html and API docs at /v3/api-docs.
 * Adds a Bearer JWT security scheme so developers can authenticate directly
 * from the Swagger UI using the "Authorize" button.
 */
@Configuration
public class OpenApiConfig {

    private static final String BEARER_AUTH = "Bearer Auth";

    @Bean
    public OpenAPI openAPI() {
        return new OpenAPI()
                .info(new Info()
                        .title("Hotel Management API")
                        .version("1.0.0")
                        .description("REST API cho hệ thống quản lý khách sạn. " +
                                "Sử dụng nút **Authorize** để nhập JWT token và test các endpoint cần xác thực.")
                        .contact(new Contact()
                                .name("Hotel Management Team")))
                // Áp dụng Bearer Auth cho toàn bộ API
                .addSecurityItem(new SecurityRequirement().addList(BEARER_AUTH))
                .components(new Components()
                        .addSecuritySchemes(BEARER_AUTH, new SecurityScheme()
                                .name(BEARER_AUTH)
                                .type(SecurityScheme.Type.HTTP)
                                .scheme("bearer")
                                .bearerFormat("JWT")
                                .description("Nhập JWT token nhận được từ /api/v1/auth/login. " +
                                        "Ví dụ: eyJhbGciOiJIUzI1NiJ9...")));
    }
}
