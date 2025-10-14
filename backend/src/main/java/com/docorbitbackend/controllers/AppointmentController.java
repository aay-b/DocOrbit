package com.docorbitbackend.controllers;

import com.docorbitbackend.dtos.responsedtos.AppointmentResponseDto;
import com.docorbitbackend.models.User;
import com.docorbitbackend.repositories.UserRepository;
import com.docorbitbackend.services.AppointmentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

@RestController
@RequestMapping("/api/appointments")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173") // ✅ Allow frontend calls
public class AppointmentController {

    private final AppointmentService appointmentService;
    private final UserRepository userRepository;

    // ✅ Book appointment
    @PostMapping("/book")
    public ResponseEntity<AppointmentResponseDto> bookAppointment(
            @RequestParam Long doctorId,
            @RequestParam String date,
            @RequestParam String time,
            Principal principal
    ) {
        String email = principal.getName();

        User patient = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found with email: " + email));

        AppointmentResponseDto response = appointmentService.bookAppointment(
                doctorId,
                patient.getId(),
                LocalDate.parse(date),
                LocalTime.parse(time)
        );

        return ResponseEntity.ok(response);
    }

    // ✅ NEW: Fetch all appointments for the logged-in user
    @GetMapping("/my")
    public ResponseEntity<List<AppointmentResponseDto>> getMyAppointments(Principal principal) {
        String email = principal.getName();

        User patient = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found with email: " + email));

        List<AppointmentResponseDto> appointments = appointmentService.getAppointmentsForUser(patient);
        return ResponseEntity.ok(appointments);
    }
    // ✅ Cancel one appointment (only the patient who booked can cancel)
    @PatchMapping("/{id}/cancel")
    public ResponseEntity<AppointmentResponseDto> cancelAppointment(
            @PathVariable Long id, Principal principal) {
        String email = principal.getName();
        return ResponseEntity.ok(appointmentService.cancelAppointment(id, email));
    }
}
