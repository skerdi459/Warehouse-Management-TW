package org.example.wtask.models.DTO;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.example.wtask.models.Enums.LifeCycle;
import org.example.wtask.models.Schedule;

import java.util.HashSet;
import java.util.Set;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class TruckDTO {

    private Long id;
    private String chassisNumber;
    private String plate;
    private String driverName;
    private boolean available = true;

    @Builder.Default
    private LifeCycle lifeCycle = LifeCycle.READY;

    private Set<Schedule> schedules = new HashSet<>();
}
