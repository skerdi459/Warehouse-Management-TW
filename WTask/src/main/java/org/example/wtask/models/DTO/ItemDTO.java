    package org.example.wtask.models.DTO;

    import com.fasterxml.jackson.annotation.JsonIgnore;
    import com.fasterxml.jackson.annotation.JsonManagedReference;
    import jakarta.persistence.*;
    import lombok.AllArgsConstructor;
    import lombok.Builder;
    import lombok.Data;
    import lombok.NoArgsConstructor;
    import org.example.wtask.models.Enums.LifeCycle;
    import org.example.wtask.models.OrderItem;

    import java.util.HashSet;
    import java.util.Set;

    @Data
    @Builder
    @AllArgsConstructor
    @NoArgsConstructor
    public class ItemDTO {
        private Long id;

        private String itemName;
        private int quantity;
        private double unitPrice;
        @Builder.Default
        private LifeCycle lifeCycle = LifeCycle.READY;
//        private Set<OrderItemDTO> orderItems = new HashSet<>();
    }
