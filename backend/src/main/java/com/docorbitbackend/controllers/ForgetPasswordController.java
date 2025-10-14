package com.docorbitbackend.controllers;

import com.docorbitbackend.config.PasswordConfig;
import com.docorbitbackend.dtos.requestdtos.ChangePassword;
import com.docorbitbackend.dtos.responsedtos.MailBody;
import com.docorbitbackend.models.ForgetPassword;
import com.docorbitbackend.models.User;
import com.docorbitbackend.repositories.ForgetPasswordRepository;
import com.docorbitbackend.repositories.UserRepository;
import com.docorbitbackend.services.EmailService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.Objects;
import java.util.Random;

@RestController
@RequestMapping("/api/auth/forgetpassword")
public class ForgetPasswordController {

    private final UserRepository userRepository;
    private final EmailService emailService;
    private final ForgetPasswordRepository forgetPasswordRepository;
    private final PasswordConfig passwordConfig;

    public ForgetPasswordController(UserRepository userRepository,
                                    EmailService emailService,
                                    ForgetPasswordRepository forgetPasswordRepository,
                                    PasswordConfig passwordConfig) {
        this.userRepository = userRepository;
        this.emailService = emailService;
        this.forgetPasswordRepository = forgetPasswordRepository;
        this.passwordConfig = passwordConfig;
    }

    @PostMapping("/verifyemail/{email}")
    public ResponseEntity<String> verifyEmail(@PathVariable String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("❌ No account found with this email."));

        int otp = otpGenerator();
        LocalDateTime expirationTime = LocalDateTime.now().plusMinutes(5);

        ForgetPassword fp = forgetPasswordRepository.findByUser(user)
                .map(existing -> {
                    existing.setOtp(otp);
                    existing.setExpirationTime(expirationTime);
                    return existing;
                })
                .orElse(ForgetPassword.builder()
                        .otp(otp)
                        .expirationTime(expirationTime)
                        .user(user)
                        .build());

        MailBody mailBody = MailBody.builder()
                .to(email)
                .subject("OTP for Password Reset (DocOrbit)")
                .text("Here is your OTP: " + otp + ". It is valid for 5 minutes.")
                .build();

        emailService.sendSimpleMessage(mailBody);
        forgetPasswordRepository.save(fp);

        return ResponseEntity.ok("✅ OTP sent to your email for password reset.");
    }

    @PostMapping("/verifyOTP/{otp}/{email}")
    public ResponseEntity<String> verifyOTP(@PathVariable Integer otp, @PathVariable String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found with email: " + email));

        ForgetPassword fp = forgetPasswordRepository.findOTPAndUser(otp, user)
                .orElseThrow(() -> new RuntimeException("❌ Invalid OTP for email: " + email));

        // Check expiration
        if (fp.getExpirationTime().isBefore(LocalDateTime.now())) {
            forgetPasswordRepository.delete(fp);
            return new ResponseEntity<>("⚠️ OTP has expired. Please request a new one.", HttpStatus.EXPECTATION_FAILED);
        }

        // Delete OTP after successful verification to prevent reuse
        forgetPasswordRepository.delete(fp);
        return ResponseEntity.ok("✅ OTP verified successfully.");
    }


    @PostMapping("/changePassword/{email}")
    public ResponseEntity<String> changePasswordHandler(@RequestBody ChangePassword changePassword, @PathVariable String email) {
        if (!Objects.equals(changePassword.password(), changePassword.repeatpassword())) {
            return new ResponseEntity<>("⚠️ Passwords do not match.", HttpStatus.BAD_REQUEST);
        }

        String encodedPassword = passwordConfig.passwordEncoder().encode(changePassword.password());
        forgetPasswordRepository.updatePassword(email, encodedPassword);

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found during password change cleanup."));

        forgetPasswordRepository.deleteByUserId(user.getId());

        return ResponseEntity.ok("✅ Password has been changed successfully!");
    }

    private int otpGenerator() {
        return new Random().nextInt(900_000) + 100_000; // Always 6 digits
    }
}
