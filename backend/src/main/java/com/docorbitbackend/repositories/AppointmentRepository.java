package com.docorbitbackend.repositories;

import com.docorbitbackend.models.Appointment;
import com.docorbitbackend.models.Doctor;
import com.docorbitbackend.models.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AppointmentRepository extends JpaRepository<Appointment, Long> {
    List<Appointment> findByPatient(User patient);
    List<Appointment> findByDoctor(Doctor doctor);
}
