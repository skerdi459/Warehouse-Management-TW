package org.example.wtask.models.DTO;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.example.wtask.models.Enums.LifeCycle;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class TruckFilter extends CommonFilter{
    private boolean freeSpace;
    private LifeCycle lifeCycle;
}
