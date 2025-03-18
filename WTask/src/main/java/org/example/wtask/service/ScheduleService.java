package org.example.wtask.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.example.wtask.models.DTO.CommonFilter;
import org.example.wtask.models.DTO.ScheduleDTO;
import org.example.wtask.models.DTO.ScheduleRequest;
import org.example.wtask.models.DTO.TruckDTO;
import org.example.wtask.models.Enums.DeliveryStatus;
import org.example.wtask.models.Enums.OrderStatus;
import org.example.wtask.models.Item;
import org.example.wtask.models.Order;
import org.example.wtask.models.Schedule;
import org.example.wtask.models.Truck;
import org.example.wtask.repository.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
public class ScheduleService {
    private static final Logger logger = LoggerFactory.getLogger(ScheduleService.class);

    private final ScheduleRepository scheduleRepository;
    private final OrderRepository orderRepository;
    private  final TruckRepository truckRepository;
    private  final ObjectMapper objectMapper;

    public ScheduleService(ScheduleRepository scheduleRepository, OrderRepository orderRepository, TruckRepository truckRepository, ObjectMapper objectMapper) {
        this.scheduleRepository = scheduleRepository;
        this.orderRepository = orderRepository;
        this.truckRepository = truckRepository;
        this.objectMapper = objectMapper;
    }


    public Schedule createScheduleWithDeliveryOrder(ScheduleRequest request) {
        validateDeliveryDate(request.getDeliveryDate());

        List<Order> existingOrders = orderRepository.findAllById(request.getOrderIds());

        updateAndValidateOrder(existingOrders,request.getDeliveryDate());

        Set<Truck> truckOrders =  reserveTruck(request.getTrucks());

        validateTrucksAvailability(truckOrders,existingOrders);

        Schedule schedule = new Schedule();
        schedule.setDeliveryDate(request.getDeliveryDate());
        schedule.setStatus(DeliveryStatus.SCHEDULED);
        schedule.setTrucks(truckOrders);
        schedule.setOrders(new HashSet<>(existingOrders));
        schedule.setItemCount(request.getItemCount());

        for (Order order : existingOrders) {
            order.setSchedule(schedule);
        }
        return scheduleRepository.save(schedule);
    }

    public Page<ScheduleDTO> getAllSchedules(CommonFilter commonFilter) {
        Pageable pageable = PageRequest.of(commonFilter.getPage(), commonFilter.getSize());
        logger.info("Fetching all schedules with pagination: page {}, size {}", commonFilter.getPage(), commonFilter.getSize());
        return scheduleRepository.findAll(pageable).map(schedule -> objectMapper.convertValue(schedule,ScheduleDTO.class));
    }

    private Set<Truck> reserveTruck(Set<TruckDTO> trucks){
        Set<Truck> truckOrders =  new HashSet<>();

        for (TruckDTO truckDTO : trucks) {
            Truck truck = truckRepository.findById(truckDTO.getId()).orElseThrow();
            truck.setAvailable(false);
            truckOrders.add(truck);
        }
        return truckOrders;
    }
    private void updateAndValidateOrder(List<Order> existingOrders, Date deliveryDate){
        for (Order order : existingOrders) {
            if (order.getDeadlineDate().before(deliveryDate)) {
                throw new IllegalArgumentException("Order with ID " + order.getId() + " has expired. Cannot schedule a delivery.");
            }

            if (order.getOrderItems().isEmpty()) {
                throw new IllegalArgumentException("Order has 0 elements to deliver.");
            }

            order.getOrderItems().forEach(orderItem -> {
                Item item = orderItem.getItem();
                item.setQuantity(item.getQuantity() - orderItem.getQuantity());
            });

            order.setStatus(OrderStatus.UNDER_DELIVERY);
        }
    }

    private void validateDeliveryDate(Date deliveryDate) {
        Calendar calendar = Calendar.getInstance();
        calendar.setTime(deliveryDate);
        int dayOfWeek = calendar.get(Calendar.DAY_OF_WEEK);

        if (dayOfWeek == Calendar.SUNDAY) {
            throw new IllegalArgumentException("Cannot create schedule: Trucks are off on Sundays.");
        }
    }


    private void validateTrucksAvailability(Set<Truck> trucks, List<Order> orders) {
        int totalItems = orders.stream().mapToInt(order -> order.getOrderItems().size()).sum();

        if (totalItems > trucks.size() * 10) {
            throw new IllegalArgumentException("Not enough trucks. You need more truck(s) to schedule deliveries.");
        }
    }


}
