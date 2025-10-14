package com.docorbitbackend.repositories;

import com.docorbitbackend.models.Patient;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface PatientRepository extends JpaRepository<Patient, Integer> {
    List<Patient> findByNameContainingIgnoreCase(String name);
    List<Patient> findByEmail(String email);
}
