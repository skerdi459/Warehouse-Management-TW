package org.example.wtask.models.DTO;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.example.wtask.models.Enums.OrderStatus;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class OrderFilter extends CommonFilter{
    private OrderStatus orderStatus;
    private String date;
    private String user;

}
