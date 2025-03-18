package org.example.wtask.repository;

import org.example.wtask.models.Enums.LifeCycle;
import org.example.wtask.models.Order;
import org.example.wtask.models.Truck;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Range;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

public interface TruckRepository extends JpaRepository<Truck, Long> , JpaSpecificationExecutor<Truck> {
    Page<Truck> findAllByLifeCycle(Pageable pageable, LifeCycle lifeCycle);

}
