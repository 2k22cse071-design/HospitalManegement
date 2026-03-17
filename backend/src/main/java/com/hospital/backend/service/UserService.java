package com.hospital.backend.service;

import com.hospital.backend.entity.Role;
import com.hospital.backend.entity.User;
import com.hospital.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;

    public User createUser(User user) {
        if (userRepository.findByUsername(user.getUsername()).isPresent()) {
            throw new RuntimeException("Username already exists: " + user.getUsername());
        }
        if (userRepository.findByEmail(user.getEmail()).isPresent()) {
            throw new RuntimeException("Email already exists: " + user.getEmail());
        }
        return userRepository.save(user);
    }

    public List<User> getAllDoctors() {
        return userRepository.findByRole(Role.DOCTOR);
    }

    public List<User> getAllPatients() {
        return userRepository.findByRole(Role.PATIENT);
    }

    public User getUserById(Long id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found with ID: " + id));
    }

    public User login(String username, String password) {
        System.out.println("LOGIN ATTEMPT: username=" + username + " password=" + password);
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> {
                    System.out.println("LOGIN FAILED: User not found -> " + username);
                    return new RuntimeException("Invalid username or password");
                });

        if (!user.getPassword().equals(password)) {
            throw new RuntimeException("Invalid username or password");
        }
        return user;
    }
}
