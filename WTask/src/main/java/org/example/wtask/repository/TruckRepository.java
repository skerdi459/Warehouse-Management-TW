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
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Set;

public interface TruckRepository extends JpaRepository<Truck, Long> , JpaSpecificationExecutor<Truck> {
    @Query("SELECT t FROM Truck t JOIN t.schedules s WHERE s.id = :scheduleId")
    List<Truck> findAllByScheduleId(@Param("scheduleId") Long scheduleId);
}
