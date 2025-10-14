package com.docorbitbackend.repositories;

import com.docorbitbackend.models.ForgetPassword;
import com.docorbitbackend.models.User;
import jakarta.transaction.Transactional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;

import java.util.Optional;

public interface ForgetPasswordRepository extends JpaRepository<ForgetPassword, Integer> {

    @Query("SELECT fp FROM ForgetPassword fp WHERE fp.otp = ?1 AND fp.user = ?2")
    Optional<ForgetPassword> findOTPAndUser(Integer otp, User user);

    @Modifying
    @Transactional
    @Query("UPDATE User u SET u.password = ?2 WHERE u.email = ?1")
    void updatePassword(String email, String password);

    Optional<ForgetPassword> findByUser(User user);

    @Modifying
    @Transactional
    @Query("DELETE FROM ForgetPassword fp WHERE fp.user.id = ?1")
    void deleteByUserId(Long userId);
}
