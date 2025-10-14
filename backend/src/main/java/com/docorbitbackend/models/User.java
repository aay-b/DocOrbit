package com.docorbitbackend.models;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.docorbitbackend.enums.Gender;
import com.docorbitbackend.enums.Role;
import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;
import java.time.Period;
import java.util.Set;

@Getter
@Setter
@Entity
@Table(name = "users")

public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY) // JPA: uses DB identity column (auto-increment) for ID generation
    private Long id;

    @NotBlank // Validation: username must not be null or empty
    @Size(min = 3, max = 30)
    @Column(nullable = false, unique = true)
    private String username;

    @NotBlank
    @Size(min = 8)
    @JsonIgnore //Jackson: exclude password from JSON serialization for security
    @Column(nullable = false)
    private String password;

    @NotBlank
    @Size(max = 100)
    @Column(nullable = false)
    private String name;

    @NotNull
    @Enumerated(EnumType.STRING) // JPA: store enum as its name (e.g., "MALE") rather than ordinal value
    @Column(nullable = false)
    private Gender gender;

    @NotNull
    @Column(nullable = false)
    private LocalDate dob;

    @NotBlank
    @Size(max = 15)
    @Column(nullable = false)
    private String phoneNumber;

    @NotBlank
    @Email // Validation: ensures value is a valid email format
    @Column(nullable = false, unique = true)
    private String email;

    @NotBlank
    @Size(max = 200)
    @Column(nullable = false)
    private String address;

    @NotBlank
    @Column(nullable = false)
    private String city;

    @NotBlank
    @Column(nullable = false)
    private String state;

    @NotBlank
    @Column(nullable = false)
    private String zip;

    @NotBlank
    @Column(nullable = false)
    private String country;

    @Column(nullable = false)
    private Boolean enabled = true;

    @ElementCollection(targetClass = Role.class, fetch = FetchType.EAGER) // means this field is not a separate entity like Movie or Ticket. Instead, it’s a collection of simple values (here, Enums).
    // fetch = FetchType.EAGER → whenever you load a User from DB, Hibernate will immediately fetch roles too (not lazy).

    @Enumerated(EnumType.STRING)

    @CollectionTable(name = "user_roles", joinColumns = @JoinColumn(name = "user_id")) // Creates a separate table named user_roles to store roles.
    // Each row links back to the users table with a foreign key (user_id).


    @Column(name = "role") // column in user_roles table where the actual role string is stored.
    private Set<Role> roles;

    @JsonIgnore
    @OneToOne(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
    // Declares a one-to-one relationship between User and ForgetPassword
    // Cascade tells JPA: “when I perform an action on the parent (User), apply the same action to the child (ForgetPassword).”
    // With orphanRemoval = true, JPA will delete the ForgetPassword row if it is dereferenced from User.
    private ForgetPassword forgetPassword;

    public int getAge() {
        return Period.between(this.dob, LocalDate.now()).getYears(); // calculates the difference in years between dob and today
    }

    public User(){}

    public User(String username, String password, String name, Gender gender, LocalDate dob, String phoneNumber, String email, String address, String city, String state, String zip, String country, Set<Role> roles) {
        this.username = username;
        this.password = password;
        this.name = name;
        this.gender = gender;
        this.dob = dob;
        this.phoneNumber = phoneNumber;
        this.email = email;
        this.address = address;
        this.city = city;
        this.state = state;
        this.zip = zip;
        this.country = country;
        this.roles = roles;
    }




}