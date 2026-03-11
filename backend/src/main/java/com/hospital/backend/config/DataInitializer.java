package com.hospital.backend.config;

import com.hospital.backend.entity.Role;
import com.hospital.backend.entity.User;
import com.hospital.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Configuration;

@Configuration
@RequiredArgsConstructor
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;

    @Override
    public void run(String... args) throws Exception {
        System.out.println(">>> DataInitializer: Updating database with doctor credentials...");

        // Ensure Admin exists
        if (userRepository.findByUsername("admin").isEmpty()) {
            userRepository.save(User.builder()
                    .name("System Admin")
                    .username("admin")
                    .password("admin123")
                    .role(Role.ADMIN)
                    .build());
            System.out.println(">>> Bootstrap: Admin created");
        }

        // Ensure at least 5 doctors exist in DB
        addDoctorIfNotExists("smith", "Dr. Smith", "smith123", "Cardiologist");
        addDoctorIfNotExists("jane", "Dr. Jane", "jane123", "Dermatologist");
        addDoctorIfNotExists("roberts", "Dr. Roberts", "roberts123", "Neurologist");
        addDoctorIfNotExists("evans", "Dr. Evans", "evans123", "Pediatrician");
        addDoctorIfNotExists("lee", "Dr. Lee", "lee123", "Orthopedics");
    }

    private void addDoctorIfNotExists(String username, String name, String password, String specialization) {
        if (userRepository.findByUsername(username).isEmpty()) {
            userRepository.save(User.builder()
                    .name(name)
                    .username(username)
                    .password(password)
                    .role(Role.DOCTOR)
                    .specialization(specialization)
                    .build());
            System.out.println(">>> Bootstrap: Created Doctor: " + name + " (" + username + ")");
        } else {
            System.out.println(">>> Bootstrap: Doctor " + username + " already exists in DB.");
        }
    }
}
