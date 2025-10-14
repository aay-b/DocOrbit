package com.docorbitbackend.controllers;

import com.docorbitbackend.models.Specialization;
import com.docorbitbackend.repositories.SpecializationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/specializations")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173")
public class SpecializationController {

    private final SpecializationRepository specializationRepository;

    @GetMapping
    public ResponseEntity<List<Specialization>> getAllSpecializations() {
        List<Specialization> list = specializationRepository.findAll();
        return ResponseEntity.ok(list);
    }
}
