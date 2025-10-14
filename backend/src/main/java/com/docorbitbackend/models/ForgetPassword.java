// src/main/java/com/bookmyshow/Models/ForgetPassword.java
package com.docorbitbackend.models;

import com.fasterxml.jackson.annotation.JsonIgnore;
// Tells Jackson (the JSON serializer Spring uses) to skip this field when converting to JSON (useful to prevent recursion loops or hide sensitive data).

import jakarta.persistence.*;
// JPA annotations (@Entity, @Id, @Column, etc.) used to map this class to a database table.

import lombok.*;
// Lombok annotations to auto-generate boilerplate like getters, setters, constructors, etc

import java.time.LocalDateTime;

@Entity // Marks this class as a JPA entity → it will correspond to a database table
//These are Lombok annotations:
@Getter // auto-generate getter and setter methods for all fields.
@Setter
@Builder // lets you use the builder pattern to create objects
@NoArgsConstructor // generates a no-argument constructor (needed by JPA).
@AllArgsConstructor // generates a constructor with all fields as parameters.
public class ForgetPassword {
    @Id // Primary key column in the database.
    @GeneratedValue(strategy = GenerationType.IDENTITY) // Auto-increments this ID using the database’s identity column (like MySQL’s AUTO_INCREMENT).
    private Long fpid;

    @Column(nullable = false) // Database column otp. Cannot be NULL. Every record must have an OTP.
    private Integer otp;

    @Column(nullable = false)
    private LocalDateTime expirationTime;

    // Defines a One-to-One relationship with the User entity.
    // fetch = FetchType.LAZY: The User object will be loaded only when explicitly accessed.
    // @JoinColumn: Specifies the foreign key column in the 'forget_password' table linking it to the user table’s primary key.
    //   - name = "user_id": Sets the column name to 'user_id'.
    //   - unique = true: Ensures that only one ForgetPassword entry can exist per user_id.
    //                    This is crucial for preventing "Duplicate entry" errors.
    //   - nullable = false: Ensures that every ForgetPassword entry must be linked to a User.
    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", unique = true, nullable = false)
    @JsonIgnore // When you return ForgetPassword as a JSON API response, the User field will be hidden. This prevents infinite loops (since User → ForgetPassword → User …) and keeps responses lightweight.
    private User user;


    /*
    So how it all works together:
        -- When a user clicks “Forget Password,” a row is created in the forget_password table with:
            - fpid (auto-generated ID)
            - otp (random number)
            - expirationTime (e.g., 1 min from now)
            - user_id (linked to that user)
        -- If the user requests OTP again → the same row is updated (since user_id must be unique).
        -- When validating OTP → system checks:
            - Does an entry exist for this user?
            - Does the otp match?
            - Is expirationTime still in the future?
     */
}
