package org.example.wtask.controller;

import org.example.wtask.models.DTO.RegisterRequest;
import org.example.wtask.models.User;
import org.example.wtask.service.UserService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/task/users")
public class UserController {

    private static final Logger logger = LoggerFactory.getLogger(UserController.class); // Initialize logger

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping("/search")
    public Page<User> searchUsers(Pageable pageable) {
        logger.info("Searching for users with pageable: {}", pageable);
        Page<User> users = userService.searchUsers(pageable);
        return users;
    }

    @PostMapping("/create-user")
    public ResponseEntity<?> registerUser(@RequestBody RegisterRequest registerRequest) {
        try {
            User user = userService.registerUser(registerRequest);
            logger.info("User registered successfully: {}", user);
            return ResponseEntity.ok(user);
        } catch (IllegalArgumentException e) {
            logger.error("Illegal argument exception during registration: {}", e.getMessage());
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (Exception e) {
            logger.error("Unexpected error during registration: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error: Something went wrong!");
        }
    }


    @DeleteMapping("/{id}/soft-delete")
    public ResponseEntity<Boolean> softDeleteUser(@PathVariable Long id) {
        boolean isDeleted = userService.softDeleteUser(id);
        return ResponseEntity.ok(isDeleted);
    }

    @PutMapping("/{id}/edit")
    public ResponseEntity<?> editUser(@PathVariable Long id, @RequestBody RegisterRequest updatedRequest) {
        User user = userService.editUser(id, updatedRequest);

        if (user != null) {
            return ResponseEntity.ok(user);
        }

        logger.error("User update failed for id: {}", id);
        return ResponseEntity.badRequest().body("Error: User update failed!");
    }
}
