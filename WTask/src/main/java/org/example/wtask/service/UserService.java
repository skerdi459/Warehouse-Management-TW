package org.example.wtask.service;

import org.example.wtask.models.DTO.JwtResponse;
import org.example.wtask.models.DTO.LoginRequest;
import org.example.wtask.models.DTO.RegisterRequest;
import org.example.wtask.models.Enums.LifeCycle;
import org.example.wtask.models.Enums.Role;
import org.example.wtask.models.User;
import org.example.wtask.repository.UserRepository;
import org.example.wtask.security.JWT.JwtUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.security.core.GrantedAuthority;

import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class UserService {

    private static final Logger logger = LoggerFactory.getLogger(UserService.class);  // Initialize logger

    private final UserRepository userRepository;
    private final PasswordEncoder encoder;
    private final AuthenticationManager authenticationManager;
    private final JwtUtils jwtUtils;

    public UserService(UserRepository userRepository, PasswordEncoder encoder, AuthenticationManager authenticationManager, JwtUtils jwtUtils) {
        this.userRepository = userRepository;
        this.encoder = encoder;
        this.authenticationManager = authenticationManager;
        this.jwtUtils = jwtUtils;
    }

    public User registerUser(RegisterRequest registerRequest) {
        if (userRepository.existsByUsernameAndLifeCycle(registerRequest.getUsername(), LifeCycle.READY)) {
            logger.error("Username {} is already taken!", registerRequest.getUsername());
            throw new RuntimeException("Error: Username is already taken!");
        }

        User user = new User();
        user.setEmail(registerRequest.getEmail());
        user.setUsername(registerRequest.getUsername());
        user.setPassword(encoder.encode(registerRequest.getPassword()));

        Set<Role> roles = registerRequest.getRoles().stream()
                .map(roleName -> Role.valueOf(roleName.name()))
                .collect(Collectors.toSet());
        user.setRoles(roles);

        userRepository.save(user);
        logger.info("User {} registered successfully", registerRequest.getUsername());

        return user;
    }

    public JwtResponse authenticateUser(LoginRequest loginRequest) {
        logger.info("Authenticating user with username: {}", loginRequest.getUsername());

        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(loginRequest.getUsername(), loginRequest.getPassword()));

        SecurityContextHolder.getContext().setAuthentication(authentication);
        String jwt = jwtUtils.generateJwtToken(authentication);

        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        List<String> roles = userDetails.getAuthorities().stream()
                .map(GrantedAuthority::getAuthority)
                .collect(Collectors.toList());

        logger.info("User {} authenticated successfully", loginRequest.getUsername());
        return new JwtResponse(jwt, userDetails.getId(), userDetails.getUsername(), userDetails.getEmail(), roles);
    }

    public boolean softDeleteUser(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Error: User not found!"));
        user.setLifeCycle(LifeCycle.DELETED);
        userRepository.save(user);

        logger.info("User with ID {} soft deleted successfully", userId);
        return true;
    }

    public User editUser(Long userId, RegisterRequest updatedRequest) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Error: User not found!"));

        if (updatedRequest.getUsername() != null && !updatedRequest.getUsername().isEmpty()) {
            user.setUsername(updatedRequest.getUsername());
        }

        if (updatedRequest.getEmail() != null && !updatedRequest.getEmail().isEmpty()) {
            user.setEmail(updatedRequest.getEmail());
        }

        if (updatedRequest.getPassword() != null && !updatedRequest.getPassword().isEmpty()) {
            user.setPassword(encoder.encode(updatedRequest.getPassword()));
        }

        if (updatedRequest.getRoles() != null && !updatedRequest.getRoles().isEmpty()) {
            Set<Role> roles = updatedRequest.getRoles().stream()
                    .map(roleName -> Role.valueOf(roleName.name()))
                    .collect(Collectors.toSet());
            user.setRoles(roles);
        }

        userRepository.save(user);
        logger.info("User with ID {} updated successfully", userId);

        return user;
    }

    public Page<User> searchUsers(Pageable pageable) {
        Page<User> users = userRepository.findAllByLifeCycle(pageable, LifeCycle.READY);
        return users;
    }
}
