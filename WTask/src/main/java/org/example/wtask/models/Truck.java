package org.example.wtask.models;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import com.querydsl.core.annotations.QueryEntity;
import jakarta.persistence.*;
import lombok.*;
import org.example.wtask.models.Enums.LifeCycle;

import java.util.HashSet;
import java.util.Set;


@Entity
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Data
public class Truck {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    private String chassisNumber;

    @Column(unique = true, nullable = false)
    private String plate;

    private String driverName;
    @Builder.Default
    private boolean available=true;
    @Builder.Default
    @Enumerated(EnumType.STRING)
    private LifeCycle lifeCycle = LifeCycle.READY;

    @ManyToMany(mappedBy = "trucks", fetch = FetchType.LAZY)
    @EqualsAndHashCode.Exclude
    @JsonIgnore
    private Set<Schedule> schedules = new HashSet<>();
}