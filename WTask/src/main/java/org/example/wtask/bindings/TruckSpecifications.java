package org.example.wtask.bindings;

import org.example.wtask.models.Enums.LifeCycle;
import org.example.wtask.models.Order;
import org.example.wtask.models.Truck;
import org.springframework.data.jpa.domain.Specification;

public class TruckSpecifications {
    public static Specification<Truck> hasFreeSpace(boolean isFree) {
        return (root, query, builder) -> !isFree  ? null : builder.equal(root.get("available"), true);
    }

    public static Specification<Truck> lifeCycle(LifeCycle lifeCycle,boolean flag) {
        return (root, query, builder) -> flag  ?  null : builder.equal(root.get("lifeCycle"), lifeCycle);

    }
}
