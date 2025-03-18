package org.example.wtask.models.DTO;

import com.fasterxml.jackson.annotation.JsonBackReference;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.example.wtask.models.Enums.DeliveryStatus;

import java.util.Date;
import java.util.HashSet;
import java.util.Set;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ScheduleDTO {

    private Long id;
    private Date deliveryDate;
    private DeliveryStatus status;


    private Set<OrderDTO> orders = new HashSet<>();
    private Set<TruckDTO> trucks = new HashSet<>();

}
