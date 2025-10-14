package com.docorbitbackend.models;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "patients")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Patient {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    private String name;
    private String email;
    private String phone;
    private String address;

    @Column(length = 10)
    private String gender; // or enum if you prefer

    private String dob; // store as String for now (ISO format) or LocalDate if you prefer
}
