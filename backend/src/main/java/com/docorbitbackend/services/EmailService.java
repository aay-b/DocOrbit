package com.docorbitbackend.services;

import com.docorbitbackend.dtos.responsedtos.AppointmentResponseDto;
import com.docorbitbackend.dtos.responsedtos.MailBody;
import jakarta.mail.internet.MimeMessage;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;

@Service
public class EmailService {

    private final JavaMailSender mailSender;

    @Value("${spring.mail.username}")
    private String senderEmail;

    public EmailService(JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }

    /* ────────────────────────────────
     * ✅ SIMPLE TEXT EMAIL (OTP, ALERTS)
     * ──────────────────────────────── */
    public void sendSimpleMessage(MailBody mailBody) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setTo(mailBody.to());
            message.setFrom(senderEmail);
            message.setSubject(mailBody.subject());
            message.setText(mailBody.text());
            mailSender.send(message);
            System.out.println("✅ Simple email sent to " + mailBody.to());
        } catch (Exception e) {
            System.err.println("❌ Failed to send simple email: " + e.getMessage());
        }
    }

    /* ────────────────────────────────
     * ✅ PATIENT CONFIRMATION EMAIL
     * ──────────────────────────────── */
    public void sendAppointmentConfirmationEmail(String patientEmail, String patientName, AppointmentResponseDto appointment) {
        if (appointment == null) return;
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");
            helper.setFrom(senderEmail);
            helper.setTo(patientEmail);
            helper.setSubject("✅ Appointment Confirmed - DocOrbit");

            String html = buildAppointmentHtmlEmailContent(appointment, patientName, false, false);
            helper.setText(html, true);

            mailSender.send(message);
            System.out.println("✅ Confirmation email sent to patient " + patientEmail);
        } catch (Exception e) {
            System.err.println("❌ Failed to send patient confirmation email: " + e.getMessage());
        }
    }

    /* ────────────────────────────────
     * ✅ DOCTOR BOOKING NOTIFICATION
     * ──────────────────────────────── */
    public void sendDoctorNotificationEmail(String doctorEmail, String doctorName, String patientName, AppointmentResponseDto appointment) {
        if (appointment == null) return;
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");
            helper.setFrom(senderEmail);
            helper.setTo(doctorEmail);
            helper.setSubject("📅 New Appointment Booked - DocOrbit");

            String html = buildAppointmentHtmlEmailContent(appointment, doctorName, true, false);
            helper.setText(html, true);

            mailSender.send(message);
            System.out.println("📩 Doctor notification sent to " + doctorEmail);
        } catch (Exception e) {
            System.err.println("❌ Failed to send doctor notification email: " + e.getMessage());
        }
    }

    /* ────────────────────────────────
     * ❌ PATIENT CANCELLATION EMAIL
     * ──────────────────────────────── */
    public void sendAppointmentCancellationEmail(String patientEmail, String patientName, AppointmentResponseDto appointment) {
        if (appointment == null) return;
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");
            helper.setFrom(senderEmail);
            helper.setTo(patientEmail);
            helper.setSubject("❌ Appointment Cancelled - DocOrbit");

            String html = buildAppointmentHtmlEmailContent(appointment, patientName, false, true);
            helper.setText(html, true);

            mailSender.send(message);
            System.out.println("✅ Cancellation email sent to patient " + patientEmail);
        } catch (Exception e) {
            System.err.println("❌ Failed to send patient cancellation email: " + e.getMessage());
        }
    }

    /* ────────────────────────────────
     * ❌ DOCTOR CANCELLATION EMAIL
     * ──────────────────────────────── */
    public void sendDoctorCancellationEmail(String doctorEmail, String doctorName, String patientName, AppointmentResponseDto appointment) {
        if (appointment == null) return;
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");
            helper.setFrom(senderEmail);
            helper.setTo(doctorEmail);
            helper.setSubject("❌ Appointment Cancelled - DocOrbit");

            String html = buildAppointmentHtmlEmailContent(appointment, doctorName, true, true);
            helper.setText(html, true);

            mailSender.send(message);
            System.out.println("✅ Cancellation email sent to doctor " + doctorEmail);
        } catch (Exception e) {
            System.err.println("❌ Failed to send doctor cancellation email: " + e.getMessage());
        }
    }

    public void sendPasswordResetEmail(String to, String resetLink) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");
            helper.setFrom(senderEmail);
            helper.setTo(to);
            helper.setSubject("🔐 Password Reset - DocOrbit");

            String html = """
        <html>
        <body style="font-family: Arial, sans-serif; background-color: #f4f6f8; padding: 40px;">
          <div style="max-width:600px;margin:0 auto;background:white;border-radius:12px;overflow:hidden;box-shadow:0 6px 18px rgba(0,0,0,0.08);">
            <div style="background:linear-gradient(135deg,#1976d2,#42a5f5);color:white;padding:24px;text-align:center;">
              <h2>Password Reset Request</h2>
            </div>
            <div style="padding:30px;text-align:center;">
              <p>Hello,</p>
              <p>We received a request to reset your password. Click below to set a new one:</p>
              <a href="%s" style="display:inline-block;margin-top:20px;background:#1976d2;color:white;padding:12px 30px;border-radius:8px;text-decoration:none;font-weight:bold;">
                Reset Password
              </a>
              <p style="margin-top:20px;color:#888;font-size:13px;">If you didn’t request this, just ignore this email.</p>
            </div>
            <div style="background:#fafafa;padding:15px;text-align:center;font-size:12px;color:#888;">
              © 2025 DocOrbit. All rights reserved.
            </div>
          </div>
        </body>
        </html>
        """.formatted(resetLink);

            helper.setText(html, true);
            mailSender.send(message);
            System.out.println("✅ Password reset email sent to " + to);
        } catch (Exception e) {
            System.err.println("❌ Failed to send password reset email: " + e.getMessage());
        }
    }


    /* ────────────────────────────────
     * 🌈 SHARED HTML TEMPLATE
     * Handles: Patient/Doctor + Confirm/Cancel
     * ──────────────────────────────── */
    private String buildAppointmentHtmlEmailContent(AppointmentResponseDto appt, String recipientName, boolean isDoctor, boolean isCancel) {
        String doctorName = appt.getDoctorName().replaceAll("(?i)^dr\\.\\s*", "");
        String specialization = appt.getSpecialization();
        String clinicName = appt.getClinicName();
        String clinicAddress = appt.getClinicAddress();
        String clinicCity = appt.getClinicCity();
        String date = appt.getAppointmentDate().toString();
        String time = appt.getAppointmentTime().toString().substring(0, 5);
        String status = appt.getStatus();

        String qrData = String.format(
                "Appointment #%d | Doctor: %s | Date: %s | Time: %s | Patient: %s",
                appt.getId(), doctorName, date, time, appt.getPatientName()
        );
        String qrCode = "https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=" +
                URLEncoder.encode(qrData, StandardCharsets.UTF_8);

        // ✉️ Dynamic tone & colors
        String colorMain = isCancel ? "#c62828" : (isDoctor ? "#43a047" : "#1976d2");
        String colorAccent = isCancel ? "#ef5350" : (isDoctor ? "#66bb6a" : "#42a5f5");

        String title = isCancel
                ? (isDoctor ? "Appointment Cancelled" : "Your Appointment Was Cancelled")
                : (isDoctor ? "New Appointment Booked" : "Appointment Confirmed");

        String greeting = "Dear " + (isDoctor ? "Dr. " + doctorName : recipientName) + ",";
        String message = isCancel
                ? (isDoctor
                ? "A patient has cancelled their appointment with you."
                : "Your appointment has been successfully cancelled.")
                : (isDoctor
                ? "A new appointment has been booked with you."
                : "Your appointment has been confirmed successfully.");

        return """
        <!DOCTYPE html>
        <html lang='en'>
        <head>
          <meta charset='UTF-8'>
          <meta name='viewport' content='width=device-width, initial-scale=1.0'>
          <style>
            body { font-family: 'Segoe UI', Arial, sans-serif; background-color: #f5f6fa; padding: 20px; color: #333; }
            .card { max-width: 620px; margin: 0 auto; background: #fff; border-radius: 14px; overflow: hidden;
                    box-shadow: 0 6px 18px rgba(0,0,0,0.08); }
            .header { background: linear-gradient(90deg, %s, %s); color: white; padding: 24px; text-align: center;
                      font-size: 26px; font-weight: 700; letter-spacing: 0.3px; }
            .content { padding: 28px; }
            .content h2 { color: %s; margin-bottom: 6px; }
            .content p { margin: 6px 0; line-height: 1.6; }
            .details { margin: 18px 0; padding: 16px; background: #fafafa; border-radius: 10px; }
            .details div { display: flex; justify-content: space-between; padding: 6px 0; border-bottom: 1px solid #eee; }
            .details div:last-child { border-bottom: none; }
            .qr { text-align: center; margin-top: 25px; }
            .qr img { width: 120px; height: 120px; }
            .status { text-align: center; font-weight: bold; color: %s; margin-top: 10px; }
            .footer { text-align: center; font-size: 12px; color: #888; padding: 20px; background: #f9f9f9; }
          </style>
        </head>
        <body>
          <div class='card'>
            <div class='header'>DocOrbit</div>
            <div class='content'>
              <h2>%s</h2>
              <p>%s</p>
              <p>%s</p>
              <div class='details'>
                <div><span><strong>Doctor:</strong></span><span>Dr. %s (%s)</span></div>
                <div><span><strong>Clinic:</strong></span><span>%s, %s</span></div>
                <div><span><strong>Date:</strong></span><span>%s</span></div>
                <div><span><strong>Time:</strong></span><span>%s</span></div>
                <div><span><strong>Status:</strong></span><span>%s</span></div>
              </div>
              <div class='qr'>
                <img src='%s' alt='QR Code'>
              </div>
            </div>
            <div class='footer'>© 2025 DocOrbit. All Rights Reserved.</div>
          </div>
        </body>
        </html>
        """.formatted(
                colorMain, colorAccent, colorMain, colorMain,
                title, greeting, message,
                doctorName, specialization,
                clinicName, clinicCity,
                date, time, status, qrCode
        );
    }
}
