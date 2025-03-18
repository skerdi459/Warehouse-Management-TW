package org.example.wtask.jobs.jobService;

import org.example.wtask.models.Enums.DeliveryStatus;
import org.example.wtask.models.Enums.OrderStatus;
import org.example.wtask.models.Order;
import org.example.wtask.models.Schedule;
import org.example.wtask.repository.OrderRepository;
import org.example.wtask.repository.ScheduleRepository;
import org.springframework.stereotype.Service;

import java.util.Calendar;
import java.util.Date;
import java.util.List;

@Service
public class ScheduleServiceJob {

    private final ScheduleRepository scheduleRepository;
    private final OrderRepository orderRepository;

    public ScheduleServiceJob(ScheduleRepository scheduleRepository, OrderRepository orderRepository) {
        this.scheduleRepository = scheduleRepository;
        this.orderRepository = orderRepository;
    }

    public void executeJob(){
        Calendar calendar = Calendar.getInstance();
        calendar.add(Calendar.DATE, -1);
        Date yesterday = calendar.getTime();

//        List<Schedule> schedules = scheduleRepository.findByDeliveryDateAndStatus(yesterday, DeliveryStatus.SCHEDULED);
                List<Schedule> schedules = scheduleRepository.findAll();

        for (Schedule schedule : schedules) {
            schedule.setStatus(DeliveryStatus.DELIVERED);

            List<Order> orders = orderRepository.findByScheduleId(schedule.getId());
            for (Order order : orders) {
                order.setStatus(OrderStatus.FULFILLED);
                orderRepository.save(order);
            }
            scheduleRepository.save(schedule);
        }
    }

}
