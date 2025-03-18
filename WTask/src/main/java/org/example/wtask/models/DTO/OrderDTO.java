package org.example.wtask.models.DTO;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.*;
import org.example.wtask.models.Enums.OrderStatus;
import org.example.wtask.models.Schedule;
import org.example.wtask.models.User;

import java.util.*;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class OrderDTO {

    private Long id;
    private Integer orderQuantity;
    private String declineReason;
    private String orderNumber;
    private Date submittedDate;
    private OrderStatus status;
    private Date deadlineDate;
    private User user;


    private List<OrderItemDTO> orderItems = new ArrayList<>();

    @JsonIgnore
    private Schedule schedule;

}
