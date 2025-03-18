package org.example.wtask.controller;

import org.example.wtask.models.DTO.JwtResponse;
import org.example.wtask.models.DTO.LoginRequest;
import org.example.wtask.service.UserService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/task/auth")
public class UserAuthController {

    private static final Logger logger = LoggerFactory.getLogger(UserAuthController.class);

    private final UserService userService;

    public UserAuthController(UserService userService) {
        this.userService = userService;
    }

    @PostMapping("/signIn")
    public ResponseEntity<?> authenticateUser(@RequestBody LoginRequest loginRequest) {
        logger.info("Sign-in request received for username: {}", loginRequest.getUsername());

        try {
            JwtResponse jwtResponse = userService.authenticateUser(loginRequest);
            logger.info("Authentication successful for username: {}", loginRequest.getUsername());
            return ResponseEntity.ok(jwtResponse);
        } catch (Exception e) {
            logger.error("Authentication failed for username: {}", loginRequest.getUsername(), e);
            return ResponseEntity.badRequest().body("Error: Authentication failed.");
        }
    }
}
