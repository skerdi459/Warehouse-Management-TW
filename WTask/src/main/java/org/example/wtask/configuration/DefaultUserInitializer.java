package org.example.wtask.configuration;

import org.example.wtask.models.Enums.LifeCycle;
import org.example.wtask.models.Enums.Role;
import org.example.wtask.models.User;
import org.example.wtask.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.Set;
@Component
public class DefaultUserInitializer {


private final UserRepository userRepository;

    private final PasswordEncoder encoder;

    public DefaultUserInitializer(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.encoder = passwordEncoder;
    }

    @Bean
CommandLineRunner createDefaultUser() {
    return args -> {
        if (userRepository.count() == 0) {
            User defaultUser = User.builder()
                    .username("skerdi")
                    .password(encoder.encode("1"))
                    .email("admin@example.com")
                    .roles(Set.of(Role.SYSTEM_ADMIN))
                    .lifeCycle(LifeCycle.READY)
                    .build();

            userRepository.save(defaultUser);
        }
    };
}
}