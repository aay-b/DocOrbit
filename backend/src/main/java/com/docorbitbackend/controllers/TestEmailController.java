package com.docorbitbackend.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class TestEmailController {

    @Autowired
    private JavaMailSender mailSender;

    @GetMapping("/test-email")
    public String sendTestEmail() {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom("aayushbhlerao@gmail.com"); // must match spring.mail.username
            message.setTo("yogeshjbhalerao@gmail.com"); // send it to yourself or another test email
            message.setSubject("✅ Test Email from DocOrbit");
            message.setText("Hello brudda, this is a test email sent via Spring Boot & Gmail SMTP!");

            mailSender.send(message);
            return "✅ Email sent successfully!";
        } catch (Exception e) {
            e.printStackTrace();
            return "❌ Failed to send email: " + e.getMessage();
        }
    }
}
