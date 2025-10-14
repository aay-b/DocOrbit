package com.docorbitbackend.services;

import com.docorbitbackend.enums.Gender;
import com.docorbitbackend.enums.Role;
import com.docorbitbackend.models.Specialization;
import com.docorbitbackend.models.User;
import com.docorbitbackend.repositories.SpecializationRepository;
import com.docorbitbackend.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.http.HttpStatus;
import com.docorbitbackend.models.Doctor;
import com.docorbitbackend.models.Clinic;
import com.docorbitbackend.repositories.ClinicRepository;
import com.docorbitbackend.repositories.DoctorRepository;

import java.time.LocalDate;
import java.util.Set;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtService jwtService;

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired private DoctorRepository doctorRepository;
    @Autowired private ClinicRepository clinicRepository;
    @Autowired private SpecializationRepository specializationRepository;

    // ================== Registration ==================
    public String registerUser(
            String username,
            String password,
            String name,
            Gender gender,
            LocalDate dob,
            String phoneNumber,
            String email,
            String address,
            String city,
            String state,
            String zip,
            String country,
            Set<Role> roles
    ) {
        // ✅ Check for duplicates
        boolean usernameTaken = userRepository.existsByUsername(username);
        boolean emailTaken = userRepository.existsByEmail(email);
        boolean phoneTaken = userRepository.existsByPhoneNumber(phoneNumber);

        if (usernameTaken || emailTaken || phoneTaken) {
            StringBuilder msg = new StringBuilder("Registration failed: ");
            if (usernameTaken) msg.append("username already taken. ");
            if (emailTaken) msg.append("email already in use. ");
            if (phoneTaken) msg.append("phone number already in use. ");
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, msg.toString().trim());
        }

        // ✅ Encode password
        String encodedPassword = passwordEncoder.encode(password);

        // ✅ Create and save base User entity
        User user = new User(username, encodedPassword, name, gender, dob,
                phoneNumber, email, address, city, state, zip, country, roles);
        userRepository.save(user);

        // ✅ Handle doctor registration logic
        if (roles.contains(Role.DOCTOR)) {
            System.out.println("🩺 Creating doctor profile for: " + email);

            // --- Specialization handling ---
            // (Later this should come directly from frontend formData.specialization)
            String specializationName = "General Practitioner";
            try {
                if (address != null && !address.isBlank()) {
                    specializationName = address; // temporary fallback
                }
            } catch (Exception ignored) {}

            final String finalSpecName = specializationName; // ✅ fix for lambda scope

            // ✅ Fetch or create specialization dynamically
            Specialization specialization = specializationRepository
                    .findByNameIgnoreCase(finalSpecName)
                    .orElseGet(() -> {
                        System.out.println("✨ Adding new specialization: " + finalSpecName);
                        Specialization newSpec = new Specialization();
                        newSpec.setName(finalSpecName);
                        return specializationRepository.save(newSpec);
                    });

            // ✅ Create clinic
            Clinic clinic = new Clinic();
            clinic.setName("Clinic of " + name);
            clinic.setAddress(address);
            clinic.setCity(city);
            clinic.setState(state);
            clinic.setCountry(country);
            clinic.setPhone(phoneNumber);
            clinicRepository.save(clinic);

            // ✅ Create doctor record
            Doctor doctor = new Doctor();
            doctor.setName(name);
            doctor.setEmail(email);
            doctor.setPhone(phoneNumber);
            doctor.setSpecialization(specialization.getName());
            doctor.setClinic(clinic);
            doctorRepository.save(doctor);

            System.out.println("✅ Doctor, clinic, and specialization saved successfully for " + email);
        }

        System.out.println("✅ User registered successfully: " + username);
        return "User registered successfully!";
    }



    public String verifyUser(String usernameOrEmail, String password) {
        System.out.println("🔐 Attempting login for: " + usernameOrEmail);

        // Load the user manually so we can handle both email and username
        User user = userRepository.findByUsername(usernameOrEmail)
                .orElseGet(() -> userRepository.findByEmail(usernameOrEmail)
                        .orElseThrow(() ->
                                new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid credentials")));

        // Check password manually since we're bypassing default auth provider
        if (!passwordEncoder.matches(password, user.getPassword())) {
            System.out.println("❌ Invalid password for: " + usernameOrEmail);
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid credentials");
        }

        // ✅ Generate JWT
        String token = jwtService.generateToken(user.getUsername());
        System.out.println("✅ Login successful for user: " + user.getUsername());
        return token;
    }



    // ================== Finders ==================
    public User findUserByUsername(String username) {
        return userRepository.findByUsername(username)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND,
                        "User not found with username: " + username));
    }

    public User saveUser(User user) {
        return userRepository.save(user);
    }

    public String encodePassword(String password) {
        return passwordEncoder.encode(password);
    }



}
