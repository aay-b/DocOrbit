package com.docorbitbackend.services;

import com.docorbitbackend.dtos.responsedtos.AppointmentResponseDto;
import com.docorbitbackend.models.Appointment;
import com.docorbitbackend.models.Clinic;
import com.docorbitbackend.models.Doctor;
import com.docorbitbackend.models.User;
import com.docorbitbackend.repositories.AppointmentRepository;
import com.docorbitbackend.repositories.DoctorRepository;
import com.docorbitbackend.repositories.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.stream.Collectors;


import java.time.LocalDate;
import java.time.LocalTime;

@Service
@RequiredArgsConstructor
public class AppointmentService {

    private final AppointmentRepository appointmentRepository;
    private final DoctorRepository doctorRepository;
    private final UserRepository userRepository;
    private final EmailService emailService;

    private AppointmentResponseDto toDto(Appointment a) {
        return AppointmentResponseDto.builder()
                .id(a.getId())
                .appointmentDate(a.getAppointmentDate())
                .appointmentTime(a.getAppointmentTime())
                .doctorName(a.getDoctor().getName())
                .specialization(a.getDoctor().getSpecialization())
                .clinicName(a.getClinic().getName())
                .clinicAddress(a.getClinic().getAddress())
                .clinicCity(a.getClinic().getCity())
                .patientName(a.getPatient().getName())
                .status(a.getStatus())
                .build();
    }


    public AppointmentResponseDto bookAppointment(Long doctorId, Long patientId,
                                                  LocalDate date, LocalTime time) {

        Doctor doctor = doctorRepository.findById(doctorId)
                .orElseThrow(() -> new RuntimeException("Doctor not found"));
        User patient = userRepository.findById(patientId)
                .orElseThrow(() -> new RuntimeException("Patient not found"));

        Clinic clinic = doctor.getClinic();
        if (clinic == null) {
            throw new RuntimeException("Doctor is not linked to any clinic!");
        }

        Appointment appointment = new Appointment();
        appointment.setDoctor(doctor);
        appointment.setPatient(patient);
        appointment.setClinic(clinic);
        appointment.setAppointmentDate(date);
        appointment.setAppointmentTime(time);
        appointment.setStatus("PENDING");

        Appointment saved = appointmentRepository.save(appointment);


        AppointmentResponseDto response = AppointmentResponseDto.builder()
                .id(saved.getId())
                .appointmentDate(saved.getAppointmentDate())
                .appointmentTime(saved.getAppointmentTime())
                .doctorName(doctor.getName())
                .specialization(doctor.getSpecialization())
                .clinicName(clinic.getName())
                .clinicAddress(clinic.getAddress())
                .clinicCity(clinic.getCity())
                .patientName(patient.getName())
                .status(saved.getStatus())
                .build();

        System.out.println("✅ Appointment booked successfully! Sending emails...");

        // ✉️ Send patient confirmation email
        emailService.sendAppointmentConfirmationEmail(
                patient.getEmail(),
                patient.getName(),
                response
        );

        // ✉️ Send doctor notification email
        emailService.sendDoctorNotificationEmail(
                doctor.getEmail(),
                doctor.getName(),
                patient.getName(),
                response
        );

        System.out.println("📨 Emails sent to both doctor and patient.");

        return response;

    }

    public List<AppointmentResponseDto> getAppointmentsForUser(User patient) {
        List<Appointment> appointments = appointmentRepository.findByPatient(patient);

        return appointments.stream().map(appt -> AppointmentResponseDto.builder()
                .id(appt.getId())
                .appointmentDate(appt.getAppointmentDate())
                .appointmentTime(appt.getAppointmentTime())
                .doctorName(appt.getDoctor().getName())
                .specialization(appt.getDoctor().getSpecialization())
                .clinicName(appt.getClinic().getName())
                .clinicAddress(appt.getClinic().getAddress())
                .clinicCity(appt.getClinic().getCity())
                .patientName(patient.getName())
                .status(appt.getStatus())
                .build()
        ).collect(Collectors.toList());
    }

    public AppointmentResponseDto cancelAppointment(Long appointmentId, String email) {
        User patient = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found: " + email));

        Appointment appt = appointmentRepository.findById(appointmentId)
                .orElseThrow(() -> new RuntimeException("Appointment not found"));

        // ✅ Only patient can cancel
        if (!appt.getPatient().getId().equals(patient.getId())) {
            throw new RuntimeException("You cannot cancel this appointment");
        }

        // ✅ Update status and persist
        appt.setStatus("CANCELLED");
        Appointment saved = appointmentRepository.save(appt); // <--- crucial line

        // ✅ Convert to DTO
        AppointmentResponseDto dto = AppointmentResponseDto.builder()
                .id(saved.getId())
                .appointmentDate(saved.getAppointmentDate())
                .appointmentTime(saved.getAppointmentTime())
                .doctorName(saved.getDoctor().getName())
                .specialization(saved.getDoctor().getSpecialization())
                .clinicName(saved.getClinic().getName())
                .clinicAddress(saved.getClinic().getAddress())
                .clinicCity(saved.getClinic().getCity())
                .patientName(saved.getPatient().getName())
                .status(saved.getStatus())
                .build();

        // ✅ Send emails
        emailService.sendAppointmentCancellationEmail(
                patient.getEmail(),
                patient.getName(),
                dto
        );
        emailService.sendDoctorCancellationEmail(
                saved.getDoctor().getEmail(),
                saved.getDoctor().getName(),
                patient.getName(),
                dto
        );

        System.out.println("✅ Appointment " + appointmentId + " cancelled and saved.");

        return dto;
    }

}
