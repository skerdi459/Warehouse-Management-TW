package org.example.wtask.controller;

import org.example.wtask.models.DTO.OrderDTO;
import org.example.wtask.models.DTO.OrderFilter;
import org.example.wtask.service.OrderService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/task/orders")
public class OrderController {

    private static final Logger logger = LoggerFactory.getLogger(OrderController.class);

    private final OrderService orderService;

    public OrderController(OrderService orderService) {
        this.orderService = orderService;
    }

    @PutMapping("/edit")
    public ResponseEntity<OrderDTO> updateOrder(@RequestBody OrderDTO updatedOrder) {
        try {
            logger.info("Updating order with ID: {}", updatedOrder.getId());
            OrderDTO createdOrder = orderService.updateOrder(updatedOrder);
            return new ResponseEntity<>(createdOrder, HttpStatus.OK);
        } catch (IllegalArgumentException e) {
            logger.error("Error updating order: {}", e.getMessage());
            return new ResponseEntity<>(null, HttpStatus.BAD_REQUEST);
        }
    }

    @GetMapping("/search")
    public Page<OrderDTO> searchItems(@ModelAttribute OrderFilter pageable) {
        logger.info("Searching orders with filters: {}", pageable);
        return orderService.searchOrders(pageable);
    }

    @PostMapping("/create-order")
    public ResponseEntity<OrderDTO> createOrder(@RequestBody OrderDTO order) {
        try {
            logger.info("Creating new order for user: {}", order.getUser());
            OrderDTO createdOrder = orderService.createOrder(order);
            return new ResponseEntity<>(createdOrder, HttpStatus.OK);
        } catch (IllegalArgumentException e) {
            logger.error("Error creating order: {}", e.getMessage());
            return new ResponseEntity<>(null, HttpStatus.BAD_REQUEST);
        }
    }

    @PutMapping("/{orderNumber}/submit")
    public ResponseEntity<OrderDTO> submitOrder(@PathVariable Long orderNumber) {
        logger.info("Submitting order with ID: {}", orderNumber);
        OrderDTO order = orderService.submitOrder(orderNumber);
        return ResponseEntity.ok(order);
    }

    @PutMapping("/{orderNumber}/approve")
    public ResponseEntity<OrderDTO> approveOrder(@PathVariable Long orderNumber) {
        OrderDTO order = orderService.approvedOrder(orderNumber);
        logger.info("Order with ID: {} approved successfully", orderNumber);
        return ResponseEntity.ok(order);
    }

    @PutMapping("/{orderNumber}/decline")
    public ResponseEntity<OrderDTO> declineOrder(@PathVariable Long orderNumber, @RequestBody String message) {
        logger.info("Declining order with ID: {} with reason: {}", orderNumber, message);
        OrderDTO order = orderService.declinedOrder(orderNumber, message);
        return ResponseEntity.ok(order);
    }

    @PutMapping("/{orderNumber}/cancel")
    public ResponseEntity<OrderDTO> cancelOrder(@PathVariable Long orderNumber) {
        logger.info("Canceling order with ID: {}", orderNumber);
        OrderDTO order = orderService.cancelOrder(orderNumber);
        return ResponseEntity.ok(order);
    }
}
