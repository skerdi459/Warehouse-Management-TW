package org.example.wtask.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.example.wtask.bindings.OrderSpecifications;
import org.example.wtask.models.DTO.OrderDTO;
import org.example.wtask.models.DTO.OrderFilter;
import org.example.wtask.models.DTO.OrderItemDTO;
import org.example.wtask.models.Enums.OrderStatus;
import org.example.wtask.models.Item;
import org.example.wtask.models.Order;
import org.example.wtask.models.OrderItem;
import org.example.wtask.models.User;
import org.example.wtask.repository.OrderRepository;
import org.example.wtask.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.*;

@Service
public class OrderService {

    private static final Logger logger = LoggerFactory.getLogger(OrderService.class);

    private final OrderRepository orderRepository;
    private final ObjectMapper objectMapper;
    private final UserRepository userRepository;

    public OrderService(OrderRepository orderRepository, ObjectMapper objectMapper, UserRepository userRepository) {
        this.orderRepository = orderRepository;
        this.objectMapper = objectMapper;
        this.userRepository = userRepository;
    }

    public OrderDTO createOrder(OrderDTO orderDTO) {
        Order order = new Order();
        order.setSubmittedDate(new Date());
        order.setOrderNumber(UUID.randomUUID().toString());
        order.setStatus(OrderStatus.CREATED);
        order.setOrderQuantity(0);

        if (orderDTO.getDeadlineDate() != null) {
            order.setDeadlineDate(orderDTO.getDeadlineDate());
        }

        Optional<User> userOptional = userRepository.findById(orderDTO.getUser().getId());
        if (userOptional.isPresent()) {
            order.setUser(userOptional.get());
        } else {
            throw new IllegalArgumentException("User not found with ID: " + orderDTO.getUser().getId());
        }

        Set<OrderItem> orderItems = new HashSet<>();
        for (OrderItemDTO itemDTO : orderDTO.getOrderItems()) {
            OrderItem item = new OrderItem();
            item.setQuantity(itemDTO.getQuantity());
            if(itemDTO.getItem().getQuantity() < itemDTO.getQuantity() ){
                throw new IllegalArgumentException("Quantity cannot exceed"+itemDTO.getItem().getQuantity());
            }
            Item itemEntity = objectMapper.convertValue(itemDTO.getItem(), Item.class);

            item.setItem(itemEntity);
            item.setOrder(order);
            orderItems.add(item);

            order.setOrderQuantity(order.getOrderQuantity() + item.getQuantity());
        }

        order.setOrderItems(orderItems);

        Order savedOrder = orderRepository.save(order);
        logger.info("Order created with ID: {}", savedOrder.getId());

       return objectMapper.convertValue(savedOrder ,OrderDTO.class);
    }


    public OrderDTO updateOrder(OrderDTO updatedOrderDTO) {
        Order existingOrder = getOrderById(updatedOrderDTO.getId());

        if (updatedOrderDTO.getDeadlineDate() != null) {
            existingOrder.setDeadlineDate(updatedOrderDTO.getDeadlineDate());
        }

        existingOrder.setOrderQuantity(0);

        Set<OrderItem> updatedOrderItems = new HashSet<>();
        for (OrderItemDTO updatedItemDTO : updatedOrderDTO.getOrderItems()) {
            OrderItem updatedItem = new OrderItem();
            updatedItem.setQuantity(updatedItemDTO.getQuantity());
            if(updatedItemDTO.getItem().getQuantity() < updatedItemDTO.getQuantity() ){
                throw new IllegalArgumentException("Quantity cannot exceed"+updatedItemDTO.getItem().getQuantity());
            }
            Item updatedItemEntity = objectMapper.convertValue(updatedItemDTO.getItem(), Item.class);
            updatedItem.setItem(updatedItemEntity);
            updatedItem.setOrder(existingOrder);

            updatedOrderItems.add(updatedItem);

            existingOrder.setOrderQuantity(existingOrder.getOrderQuantity() + updatedItem.getQuantity());
        }

        existingOrder.getOrderItems().clear();
        existingOrder.getOrderItems().addAll(updatedOrderItems);
        existingOrder.setStatus(OrderStatus.CREATED);
        Order savedOrder = orderRepository.save(existingOrder);
        logger.info("Order updated successfully with ID: {}", savedOrder.getId());

        return objectMapper.convertValue(savedOrder, OrderDTO.class);
    }

    private Order getOrderById(Long orderNumber) {
        return orderRepository.findById(orderNumber)
                .orElseThrow(() -> {
                    logger.error("Order with number {} not found", orderNumber);
                    return new IllegalArgumentException("Order with number " + orderNumber + " not found.");
                });
    }

    public OrderDTO submitOrder(Long orderNumber) {
        Order order = getOrderById(orderNumber);

        if (order.getStatus() != OrderStatus.CREATED && order.getStatus() != OrderStatus.DECLINED) {
            logger.error("Order cannot be submitted, invalid status: {}", order.getStatus());  // Log status error
            throw new IllegalArgumentException("Order can only be submitted if it is in CREATED or DECLINED state.");
        }
        order.setStatus(OrderStatus.AWAITING_APPROVAL);
        orderRepository.save(order);
        logger.info("Order submitted successfully: {}", order.getId());
        return objectMapper.convertValue(order, OrderDTO.class);
    }

    public OrderDTO approvedOrder(Long orderNumber) {
        Order order = getOrderById(orderNumber);

        if (order.getStatus() != OrderStatus.AWAITING_APPROVAL) {
            logger.error("Order cannot be approved, invalid status: {}", order.getStatus());
            throw new IllegalArgumentException("Order can only be Approved if it is in AWAITING APPROVAL state.");
        }
        order.setStatus(OrderStatus.APPROVED);
        logger.info("Order approved successfully: {}", order.getId());
        return objectMapper.convertValue(orderRepository.save(order), OrderDTO.class);
    }

    public OrderDTO declinedOrder(Long orderNumber, String declineReason) {
        Order order = getOrderById(orderNumber);

        if (order.getStatus() != OrderStatus.AWAITING_APPROVAL) {
            logger.error("Order cannot be declined, invalid status: {}", order.getStatus());
            throw new IllegalArgumentException("Order can only be Declined if it is in AWAITING APPROVAL state.");
        }
        order.setStatus(OrderStatus.DECLINED);
        order.setDeclineReason(declineReason);
        logger.info("Order declined successfully: {} with reason: {}", order.getId(), declineReason);
        return objectMapper.convertValue(orderRepository.save(order), OrderDTO.class);
    }

    public OrderDTO cancelOrder(Long orderNumber) {
        Order order = getOrderById(orderNumber);

        if (order.getStatus() == OrderStatus.FULFILLED
                || order.getStatus() == OrderStatus.UNDER_DELIVERY
                || order.getStatus() == OrderStatus.CANCELED) {
            logger.error("Order cannot be canceled, invalid status: {}", order.getStatus());
            throw new IllegalArgumentException("Order cannot be canceled if it is FULFILLED, UNDER_DELIVERY, or already CANCELED.");
        }

        order.setStatus(OrderStatus.CANCELED);
        logger.info("Order canceled successfully: {}", order.getId());
        return objectMapper.convertValue(orderRepository.save(order), OrderDTO.class);
    }

    public Page<OrderDTO> searchOrders(OrderFilter orderFilter) {
        Specification<Order> spec = Specification.where(null);

        if (orderFilter.getOrderStatus() != null) {
            spec = spec.and(OrderSpecifications.hasStatus(orderFilter.getOrderStatus()));
        }

        if (orderFilter.getUser() != null) {
            spec = spec.and(OrderSpecifications.isUser(orderFilter.getUser()));
        }

        if (orderFilter.getDate() != null) {
            Date d1 = convertStringToDate(orderFilter.getDate());
            spec = spec.and(OrderSpecifications.deadlineBefore(d1));
        }

        spec=spec.and(OrderSpecifications.sortBy("submittedDate", false));

        Pageable pageable = PageRequest.of(orderFilter.getPage(), orderFilter.getSize());
        logger.debug("Executing search with pageable: {}", pageable);
        return orderRepository.findAll(spec, pageable).map(order -> objectMapper.convertValue(order, OrderDTO.class));
    }

    public static Date convertStringToDate(String dateStr) {
        SimpleDateFormat formatter = new SimpleDateFormat("yyyy-MM-dd");
        try {
            return formatter.parse(dateStr);
        } catch (ParseException e) {
            logger.error("Failed to parse date: {}", dateStr, e);
            return null;
        }
    }
}
