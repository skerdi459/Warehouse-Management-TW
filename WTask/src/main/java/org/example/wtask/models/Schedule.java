package org.example.wtask.models;

import jakarta.persistence.*;
import lombok.*;
import org.example.wtask.models.Enums.DeliveryStatus;

import java.util.Date;
import java.util.HashSet;
import java.util.Set;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "schedules")
public class Schedule {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Temporal(TemporalType.DATE)
    private Date deliveryDate;

    @Enumerated(EnumType.STRING)
    private DeliveryStatus status;

    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(
            name = "schedule_trucks",
            joinColumns = @JoinColumn(name = "schedule_id"),
            inverseJoinColumns = @JoinColumn(name = "truck_id")
    )
    @EqualsAndHashCode.Exclude
    private Set<Truck> trucks = new HashSet<>();

    @OneToMany(mappedBy = "schedule", cascade = CascadeType.ALL)
    @ToString.Exclude
    @EqualsAndHashCode.Exclude
    private Set<Order> orders = new HashSet<>();

    private int itemCount;

}
