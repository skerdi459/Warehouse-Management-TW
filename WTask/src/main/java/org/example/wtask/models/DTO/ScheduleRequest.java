package org.example.wtask.models.DTO;

import lombok.Data;
import org.example.wtask.models.Enums.DeliveryStatus;
import org.example.wtask.models.Truck;

import java.util.Date;
import java.util.Set;

@Data
public class ScheduleRequest {
    private Date deliveryDate;
    private DeliveryStatus status;
    private Integer itemCount;
    private Set<TruckDTO> trucks;
    private Set<Long> orderIds;
}