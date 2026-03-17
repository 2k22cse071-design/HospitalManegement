package com.hospital.backend.controller;

import com.hospital.backend.dto.AuthResponse;
import com.hospital.backend.dto.LoginRequest;
import com.hospital.backend.entity.User;
import com.hospital.backend.service.UserService;
import io.swagger.v3.oas.annotations.security.SecurityRequirements;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/users")
@RequiredArgsConstructor
@CrossOrigin(originPatterns = {"https://hospital-management-*.vercel.app", "http://localhost:3000"})
public class UserController {

    private final UserService userService;

    @PostMapping
    @SecurityRequirements(value = {}) // Removes lock icon in Swagger
    public ResponseEntity<User> createUser(@RequestBody User user) {
        return ResponseEntity.ok(userService.createUser(user));
    }

    @PostMapping("/login")
    @SecurityRequirements(value = {}) // Removes lock icon in Swagger
    public ResponseEntity<AuthResponse> login(@RequestBody LoginRequest request) {
        return ResponseEntity.ok(userService.login(request.getUsername(), request.getPassword()));
    }

    @GetMapping("/{id}")
    public ResponseEntity<User> getUserById(@PathVariable Long id) {
        return ResponseEntity.ok(userService.getUserById(id));
    }

    @GetMapping("/doctors")
    public ResponseEntity<List<User>> getAllDoctors() {
        return ResponseEntity.ok(userService.getAllDoctors());
    }

    @GetMapping("/patients")
    public ResponseEntity<List<User>> getAllPatients() {
        return ResponseEntity.ok(userService.getAllPatients());
    }
}
