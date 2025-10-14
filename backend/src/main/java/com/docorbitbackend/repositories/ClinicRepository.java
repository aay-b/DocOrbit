package com.docorbitbackend.repositories;

import com.docorbitbackend.models.Clinic;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ClinicRepository extends JpaRepository<Clinic, Integer> {
    // You can add custom finders later if needed, e.g.:
    Clinic findByName(String name);
}
