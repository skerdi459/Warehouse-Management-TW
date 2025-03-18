package org.example.wtask.models;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;
import org.example.wtask.models.Enums.LifeCycle;
import org.example.wtask.models.Enums.Role;

import java.util.HashSet;
import java.util.Set;

@Builder
@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "users")
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String username;
    private String password;
    private String email;

    @ElementCollection(fetch = FetchType.EAGER)
    @Enumerated(EnumType.STRING)
    private Set<Role> roles;
    @Builder.Default
    @Enumerated(EnumType.STRING)
    private LifeCycle lifeCycle = LifeCycle.READY;
    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL)
    @ToString.Exclude  // Prevent recursion in toString()
    @EqualsAndHashCode.Exclude
    @JsonIgnore // Prevents recursion when serializing User
    private Set<Order> orders = new HashSet<>();

}


