package com.docorbitbackend.services;

import com.docorbitbackend.models.Clinic;
import com.docorbitbackend.models.Doctor;
import com.docorbitbackend.repositories.ClinicRepository;
import com.docorbitbackend.repositories.DoctorRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class DoctorService {

    private final DoctorRepository doctorRepository;
    private final ClinicRepository clinicRepository;

    public DoctorService(DoctorRepository doctorRepository, ClinicRepository clinicRepository) {
        this.doctorRepository = doctorRepository;
        this.clinicRepository = clinicRepository;
    }

    public Doctor getDoctorById(Long id) {
        return doctorRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Doctor not found with id: " + id));
    }

    public List<Doctor> searchDoctorsBySpecialization(String specialization) {
        return doctorRepository.findBySpecializationContainingIgnoreCase(specialization);
    }

    public List<Doctor> searchDoctorsByName(String name) {
        return doctorRepository.findByNameContainingIgnoreCase(name);
    }

    public Doctor createDoctor(Doctor doctor, Integer clinicId) {
        Clinic clinic = clinicRepository.findById(clinicId)
                .orElseThrow(() -> new RuntimeException("Clinic not found with id: " + clinicId));
        doctor.setClinic(clinic);
        return doctorRepository.save(doctor);
    }

    public Doctor updateDoctor(Long id, Doctor updatedDoctor) {
        return doctorRepository.findById(id)
                .map(existing -> {
                    existing.setName(updatedDoctor.getName());
                    existing.setSpecialization(updatedDoctor.getSpecialization());
                    existing.setEmail(updatedDoctor.getEmail());
                    existing.setPhone(updatedDoctor.getPhone());
                    existing.setRating(updatedDoctor.getRating());
                    if (updatedDoctor.getClinic() != null) {
                        existing.setClinic(updatedDoctor.getClinic());
                    }
                    return doctorRepository.save(existing);
                })
                .orElseThrow(() -> new RuntimeException("Doctor not found with id: " + id));
    }

    public void deleteDoctor(Long id) {
        doctorRepository.deleteById(id);
    }

    public List<Doctor> getDoctorsByClinic(Long clinicId) {
        return doctorRepository.findByClinicId(clinicId);
    }

    public List<Doctor> getAllDoctors() {
        List<Doctor> doctors = doctorRepository.findAllDistinct();
        System.out.println("✅ Found " + doctors.size() + " unique doctors in DB");
        doctors.forEach(d -> System.out.println(" -> " + d.getName() + " (" + d.getSpecialization() + ")"));
        return doctors;
    }

}
