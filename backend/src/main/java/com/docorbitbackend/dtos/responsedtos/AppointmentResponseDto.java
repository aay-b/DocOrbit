package com.docorbitbackend.dtos.responsedtos;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AppointmentResponseDto {
    private Long id;
    private LocalDate appointmentDate;
    private LocalTime appointmentTime;
    private String doctorName;
    private String specialization;
    private String clinicName;
    private String clinicAddress;
    private String clinicCity;
    private String patientName;
    private String status;
}

