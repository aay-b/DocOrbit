package com.docorbitbackend.repositories;

import com.docorbitbackend.models.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository // optional, since JpaRepository beans are auto-detected, but nice for clarity
public interface UserRepository extends JpaRepository<User, Long> {

    // Fetch user by username (returns Optional, safer than raw User)
    Optional<User> findByUsername(String username);

    // Fetch user by email
    Optional<User> findByEmail(String email);

    // Check if username already exists
    boolean existsByUsername(String username);

    // Check if email already exists
    boolean existsByEmail(String email);

    // Check if phone number already exists
    boolean existsByPhoneNumber(String phoneNumber);
}
