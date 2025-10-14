package com.docorbitbackend.repositories;

import com.docorbitbackend.models.Doctor;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface DoctorRepository extends JpaRepository<Doctor, Long> {
    List<Doctor> findBySpecializationContainingIgnoreCase(String specialization);
    List<Doctor> findByNameContainingIgnoreCase(String name);
    List<Doctor> findByClinicId(Long clinicId);
    @Query("SELECT DISTINCT d FROM Doctor d")
    List<Doctor> findAllDistinct();
}
