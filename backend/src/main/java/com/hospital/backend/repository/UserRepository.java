package com.hospital.backend.repository;

import com.hospital.backend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import com.hospital.backend.entity.Role;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    List<User> findByRole(Role role);

    java.util.Optional<User> findByUsername(String username);
}
