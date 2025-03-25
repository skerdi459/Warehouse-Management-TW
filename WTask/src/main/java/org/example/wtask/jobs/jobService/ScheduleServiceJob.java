package org.example.wtask.jobs.jobService;

import org.example.wtask.models.Enums.DeliveryStatus;
import org.example.wtask.models.Enums.OrderStatus;
import org.example.wtask.models.Order;
import org.example.wtask.models.Schedule;
import org.example.wtask.models.Truck;
import org.example.wtask.repository.OrderRepository;
import org.example.wtask.repository.ScheduleRepository;
import org.example.wtask.repository.TruckRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.Date;
import java.util.List;

@Service
public class ScheduleServiceJob {

    private static final Logger logger = LoggerFactory.getLogger(ScheduleServiceJob.class);

    private final ScheduleRepository scheduleRepository;
    private final OrderRepository orderRepository;
    private final TruckRepository truckRepository;

    public ScheduleServiceJob(ScheduleRepository scheduleRepository, OrderRepository orderRepository, TruckRepository truckRepository) {
        this.scheduleRepository = scheduleRepository;
        this.orderRepository = orderRepository;
        this.truckRepository = truckRepository;
    }

    public void executeJob() throws ParseException {
        // Hardcoded test date
        String testDateStr = "2025-03-22";
        SimpleDateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd");
        Date dateP = dateFormat.parse(testDateStr);
        Date yesterday = truncateToDateOnly(dateP);

//        Calendar calendar = Calendar.getInstance();
//        calendar.add(Calendar.DATE, -1);
//        Date yesterday = calendar.getTime();

        logger.info("Executing schedule job for delivery date: {}", yesterday);

        List<Schedule> schedules = scheduleRepository.findByDeliveryDateAndStatus(yesterday, DeliveryStatus.SCHEDULED);
//         List<Schedule> schedules= scheduleRepository.findAll();
        for (Schedule schedule : schedules) {
            logger.info("Processing schedule with ID: {} and status: {}", schedule.getId(), schedule.getStatus());

            schedule.setStatus(DeliveryStatus.DELIVERED);
            List<Order> orders = orderRepository.findByScheduleId(schedule.getId());

            for (Order order : orders) {
                logger.info("Updating order with ID: {} to status: {}", order.getId(), OrderStatus.FULFILLED);
                order.setStatus(OrderStatus.FULFILLED);
                orderRepository.save(order);
            }

            List<Truck> trucks = truckRepository.findAllByScheduleId(schedule.getId());

            for (Truck truck : trucks) {
                logger.info("Setting truck with ID: {} to available", truck.getId());
                truck.setAvailable(true);
                truckRepository.save(truck);
            }

            scheduleRepository.save(schedule);
            logger.info("Schedule with ID: {} updated to status: {}", schedule.getId(), schedule.getStatus());
        }

        logger.info("Schedule job completed for date: {}", yesterday);
    }


    private static Date truncateToDateOnly(Date date) {
        Calendar cal = Calendar.getInstance();
        cal.setTime(date);
        cal.set(Calendar.HOUR_OF_DAY, 0);
        cal.set(Calendar.MINUTE, 0);
        cal.set(Calendar.SECOND, 0);
        cal.set(Calendar.MILLISECOND, 0);
        return cal.getTime();
    }
}
