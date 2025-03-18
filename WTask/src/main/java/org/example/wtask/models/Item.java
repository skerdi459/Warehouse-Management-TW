package org.example.wtask.models;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonManagedReference;
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
public class Item {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(unique = true)
    private String itemName;
    private int quantity;
    private double unitPrice;
    @Builder.Default
    @Enumerated(EnumType.STRING)
    private LifeCycle lifeCycle = LifeCycle.READY;
    @OneToMany(mappedBy = "item", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonManagedReference
    @JsonIgnore
    private Set<OrderItem> orderItems = new HashSet<>();
}

