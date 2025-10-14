package com.docorbitbackend.models;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "doctors")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Doctor {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private String specialization;
    private String email;
    private String phone;

    @Column
    private Double rating;

    @ManyToOne(fetch = FetchType.LAZY) // ✅ Avoid duplicate join loading
    @JoinColumn(name = "clinic_id", nullable = false)
    private Clinic clinic;
}
