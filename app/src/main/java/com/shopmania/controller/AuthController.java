package com.shopmania.controller;

import com.shopmania.entity.User;
import com.shopmania.repository.UserRepository;
import com.shopmania.service.EmailService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
public class AuthController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private EmailService emailService;

    // ----------------------------
    // DTOs (request/response)
    // ----------------------------
    public static class SignupRequest {
        public String name;
        public String email;
        public String password;
    }

    public static class LoginRequest {
        public String email;
        public String password;
    }

    public static class ApiResponse {
        public String message;
        public Object data;

        public ApiResponse(String message) {
            this.message = message;
        }

        public ApiResponse(String message, Object data) {
            this.message = message;
            this.data = data;
        }
    }

    public static class UserView {
        public Long id;
        public String name;
        public String email;

        public UserView(Long id, String name, String email) {
            this.id = id;
            this.name = name;
            this.email = email;
        }
    }

    // ----------------------------
    // SIGNUP (USER)
    // ----------------------------
    @PostMapping("/signup")
    public ResponseEntity<ApiResponse> signup(@RequestBody SignupRequest req) {

        if (req == null || req.name == null || req.email == null || req.password == null) {
            return ResponseEntity.badRequest().body(new ApiResponse("Please provide name, email and password."));
        }

        String name = req.name.trim();
        String email = req.email.trim().toLowerCase();
        String password = req.password;

        if (name.isEmpty() || email.isEmpty() || password.isEmpty()) {
            return ResponseEntity.badRequest().body(new ApiResponse("Please fill all fields."));
        }

        if (userRepository.existsByEmailIgnoreCase(email)) {
            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body(new ApiResponse("Email already exists! Please login."));
        }

        User user = new User(name, email, password);
        userRepository.save(user);

        // Welcome email (don’t fail signup if email fails)
        try {
            emailService.sendWelcomeEmail(email, name);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.CREATED)
                    .body(new ApiResponse("User registered successfully (email sending failed).",
                            new UserView(user.getId(), user.getName(), user.getEmail())));
        }

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(new ApiResponse("User registered successfully! Welcome email sent ✅",
                        new UserView(user.getId(), user.getName(), user.getEmail())));
    }

    // ----------------------------
    // LOGIN (USER)
    // ----------------------------
    @PostMapping("/login")
    public ResponseEntity<ApiResponse> login(@RequestBody LoginRequest req) {

        if (req == null || req.email == null || req.password == null) {
            return ResponseEntity.badRequest().body(new ApiResponse("Please provide email and password."));
        }

        String email = req.email.trim().toLowerCase();
        String password = req.password;

        return userRepository.findByEmailIgnoreCase(email)
                .map(user -> {
                    if (user.getPassword() != null && user.getPassword().equals(password)) {
                        return ResponseEntity.ok(
                                new ApiResponse("Login successful ✅",
                                        new UserView(user.getId(), user.getName(), user.getEmail()))
                        );
                    }
                    return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                            .body(new ApiResponse("Invalid credentials."));
                })
                .orElse(ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(new ApiResponse("Invalid credentials.")));
    }
}
