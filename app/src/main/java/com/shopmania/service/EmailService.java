package com.shopmania.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    @Autowired
    private JavaMailSender mailSender;

    public void sendWelcomeEmail(String toEmail, String username) {

        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(toEmail);
        message.setSubject("Welcome to ShopMania 🎉");

        message.setText(
                "Hi " + username + ",\n\n" +
                "Welcome to ShopMania!\n\n" +
                "We're excited to help you compare prices and save money across platforms.\n\n" +
                "Happy Shopping 🛍️\n\n" +
                "— Team ShopMania"
        );

        mailSender.send(message);
    }
}
