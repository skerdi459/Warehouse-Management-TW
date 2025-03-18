package org.example.wtask.repository;

import org.example.wtask.models.Enums.DeliveryStatus;
import org.example.wtask.models.Schedule;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Date;
import java.util.List;

public interface ScheduleRepository extends JpaRepository<Schedule ,Long> {
    List<Schedule> findByDeliveryDateAndStatus(Date deliveryDate, DeliveryStatus status);

}
