package com.hotel.management.security;

import com.hotel.management.entity.User;
import com.hotel.management.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Component
@RequiredArgsConstructor
@Slf4j
public class PasswordMigrationRunner implements ApplicationRunner {

    private final UserRepository userRepository;
    private final BCryptPasswordEncoder passwordEncoder;

    @Override
    @Transactional
    public void run(ApplicationArguments args) {
        List<User> users = userRepository.findAll();

        int count = 0;
        for (User user : users) {
            String password = user.getPassword();
            // Only migrate passwords that are NOT already BCrypt hashes
            if (password != null && !password.startsWith("$2a$")) {
                user.setPassword(passwordEncoder.encode(password));
                userRepository.save(user);
                count++;
            }
        }

        log.info("Migrated {} accounts to BCrypt", count);
    }
}
