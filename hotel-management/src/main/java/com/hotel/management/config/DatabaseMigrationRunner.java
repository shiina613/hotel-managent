package com.hotel.management.config;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
@Slf4j
public class DatabaseMigrationRunner implements CommandLineRunner {

    private final JdbcTemplate jdbcTemplate;

    @Override
    public void run(String... args) {
        try {
            // Step 1: convert old role values before altering enum
            jdbcTemplate.execute("UPDATE users SET role = 'RECEPTIONIST' WHERE role IN ('STAFF', 'MANAGER')");

            // Step 2: alter enum to new values (idempotent - safe to run multiple times)
            jdbcTemplate.execute(
                "ALTER TABLE users MODIFY COLUMN role ENUM('ADMIN','RECEPTIONIST','CUSTOMER') NOT NULL"
            );

            // Step 3: migrate services.unit from enum to varchar
            jdbcTemplate.execute(
                "ALTER TABLE services MODIFY COLUMN unit VARCHAR(50) NOT NULL"
            );

            log.info("Database migration completed successfully");
        } catch (Exception e) {
            // Log but don't fail startup - may already be migrated
            log.warn("Database migration skipped or already applied: {}", e.getMessage());
        }
    }
}
