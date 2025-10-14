package com.docorbitbackend.controllers;

import com.docorbitbackend.models.Clinic;
import com.docorbitbackend.repositories.ClinicRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/clinics")
public class ClinicController {

    private final ClinicRepository clinicRepository;

    public ClinicController(ClinicRepository clinicRepository) {
        this.clinicRepository = clinicRepository;
    }

    // Create a new clinic
    @PostMapping
    public ResponseEntity<Clinic> createClinic(@RequestBody Clinic clinic) {
        return ResponseEntity.ok(clinicRepository.save(clinic));
    }

    // Get all clinics
    @GetMapping
    public ResponseEntity<List<Clinic>> getAllClinics() {
        return ResponseEntity.ok(clinicRepository.findAll());
    }

    // Get clinic by ID
    @GetMapping("/{id}")
    public ResponseEntity<Clinic> getClinicById(@PathVariable Integer id) {
        return clinicRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // Update clinic by ID
    @PutMapping("/{id}")
    public ResponseEntity<Clinic> updateClinic(@PathVariable Integer id, @RequestBody Clinic updatedClinic) {
        return clinicRepository.findById(id)
                .map(clinic -> {
                    clinic.setName(updatedClinic.getName());
                    clinic.setAddress(updatedClinic.getAddress());
                    clinic.setCity(updatedClinic.getCity());
                    clinic.setState(updatedClinic.getState());
                    clinic.setCountry(updatedClinic.getCountry());
                    clinic.setPhone(updatedClinic.getPhone());
                    return ResponseEntity.ok(clinicRepository.save(clinic));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    // Delete clinic by ID
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteClinic(@PathVariable Integer id) {
        return clinicRepository.findById(id)
                .map(clinic -> {
                    clinicRepository.delete(clinic);
                    return ResponseEntity.noContent().<Void>build();
                })
                .orElse(ResponseEntity.notFound().build());
    }
}
