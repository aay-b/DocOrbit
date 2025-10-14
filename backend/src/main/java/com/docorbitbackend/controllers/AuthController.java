package com.docorbitbackend.controllers;

import com.docorbitbackend.enums.Gender;
import com.docorbitbackend.enums.Role;
import com.docorbitbackend.models.PasswordResetToken;
import com.docorbitbackend.models.User;
import com.docorbitbackend.repositories.PasswordResetTokenRepository;
import com.docorbitbackend.repositories.UserRepository;
import com.docorbitbackend.services.EmailService;
import com.docorbitbackend.services.UserService;
import com.docorbitbackend.services.JwtService;
import jakarta.annotation.PostConstruct;
import lombok.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.*;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.HashMap;
import java.util.Map;
import java.util.Set;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private UserService userService;

    @Autowired
    private JwtService jwtService;

    @Autowired
    private PasswordResetTokenRepository tokenRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private EmailService emailService;



    @PostConstruct
    public void init() {
        System.out.println("🚀 AuthController initialized and ready to handle requests.");
    }

    // ✅ Signup endpoint
    @PostMapping("/signup")
    public ResponseEntity<String> registerUser(@RequestBody SignupRequest request) {
        try {
            String result = userService.registerUser(
                    request.getUsername(),
                    request.getPassword(),
                    request.getName(),
                    request.getGender(),
                    request.getDob(),
                    request.getPhoneNumber(),
                    request.getEmail(),
                    request.getAddress(),
                    request.getCity(),
                    request.getState(),
                    request.getZip(),
                    request.getCountry(),
                    request.getRoles()
            );
            return new ResponseEntity<>(result, HttpStatus.CREATED);
        } catch (Exception e) {
            return new ResponseEntity<>("Signup failed: " + e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request) {
        System.out.println("🚀 /api/auth/login called for: " + request.getUsername());
        try {
            String token = userService.verifyUser(request.getUsername(), request.getPassword());
            User user = userService.findUserByUsername(request.getUsername());

            Map<String, Object> response = new HashMap<>();
            response.put("message", "Login successful");
            response.put("token", token);
            response.put("username", user.getUsername());
            response.put("email", user.getEmail());
            response.put("roles", user.getRoles());
            response.put("userType", user.getRoles().iterator().next().name());
            response.put("redirectTo", user.getRoles().contains(Role.DOCTOR)
                    ? "/doctor-dashboard"
                    : "/providers");

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("error", "Login failed: " + e.getMessage()));
        }
    }




    // ✅ Profile endpoint
    @GetMapping("/profile")
    public ResponseEntity<User> getProfile() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        if (authentication == null || !authentication.isAuthenticated() || authentication.getPrincipal() instanceof String) {
            return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
        }

        UserDetails userDetails = (UserDetails) authentication.getPrincipal();
        User user = userService.findUserByUsername(userDetails.getUsername());

        if (user == null) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }

        return new ResponseEntity<>(user, HttpStatus.OK);
    }

    @PostMapping("/logout")
    public ResponseEntity<String> logout() {
        return ResponseEntity.ok("User logged out (token invalidation is client-side only)");
    }

    @PostMapping("/forgot-password")
    public ResponseEntity<?> forgotPassword(@RequestBody Map<String, String> request) {
        String email = request.get("email");
        if (email == null || email.isEmpty()) {
            return ResponseEntity.badRequest().body("Email is required");
        }

        User user = userRepository.findByEmail(email)
                .orElse(null);
        if (user == null) {
            System.out.println("⚠️ Password reset requested for non-existent email: " + email);
            return ResponseEntity.ok("If this email is registered, a reset link will be sent.");
        }

        // Remove old tokens for this user
        tokenRepository.deleteByUser(user);

        // Create new token
        String token = java.util.UUID.randomUUID().toString();
        PasswordResetToken resetToken = PasswordResetToken.builder()
                .token(token)
                .user(user)
                .expiryDate(java.time.LocalDateTime.now().plusMinutes(15))
                .build();
        tokenRepository.save(resetToken);

        // Build reset link
        String resetLink = "http://localhost:5173/reset-password?token=" + token;
        emailService.sendPasswordResetEmail(user.getEmail(), resetLink);

        return ResponseEntity.ok("Password reset link sent to email (if registered).");
    }

    @PostMapping("/reset-password")
    public ResponseEntity<?> resetPassword(@RequestBody Map<String, String> request) {
        String token = request.get("token");
        String newPassword = request.get("password");

        PasswordResetToken resetToken = tokenRepository.findByToken(token)
                .orElse(null);

        if (resetToken == null || resetToken.isExpired()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Invalid or expired token.");
        }

        User user = resetToken.getUser();
        user.setPassword(userService.encodePassword(newPassword));
        userRepository.save(user);

        // Cleanup used token
        tokenRepository.delete(resetToken);

        return ResponseEntity.ok("Password reset successfully!");
    }

    // ✅ DTOs
    @Getter @Setter @NoArgsConstructor @AllArgsConstructor
    static class SignupRequest {
        private String username;
        private String password;
        private String name;
        private Gender gender;
        private LocalDate dob;
        private String phoneNumber;
        private String email;
        private String address;
        private String city;
        private String state;
        private String zip;
        private String country;
        private Set<Role> roles;
    }

    @Getter @Setter @NoArgsConstructor @AllArgsConstructor
    static class LoginRequest {
        private String username;
        private String password;
    }

    @Getter @Setter @AllArgsConstructor @NoArgsConstructor
    static class LoginResponse {
        private String message;
        private String token;
        private String username;
        private String email;
        private String name;
        private String userType;
    }


}
