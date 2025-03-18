package org.example.wtask.controller;

import org.example.wtask.models.DTO.CommonFilter;
import org.example.wtask.models.DTO.ScheduleDTO;
import org.example.wtask.models.DTO.ScheduleRequest;
import org.example.wtask.models.Schedule;
import org.example.wtask.service.ScheduleService;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/task/schedule")
public class ScheduleController {

    private final ScheduleService scheduleService;


    public ScheduleController(ScheduleService scheduleService) {
        this.scheduleService = scheduleService;
    }


    @PostMapping("/create-schedule")
    public ResponseEntity<?> createSchedule(@RequestBody ScheduleRequest schedule) {
        try {
            Schedule createdSchedule = scheduleService.createScheduleWithDeliveryOrder(schedule);
            return new ResponseEntity<>(createdSchedule, HttpStatus.CREATED);
        } catch (IllegalArgumentException ex) {
            return new ResponseEntity<>(ex.getMessage(), HttpStatus.BAD_REQUEST);
        } catch (Exception ex) {
            return new ResponseEntity<>("An error occurred while creating the schedule: " + ex.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/search")
    public Page<ScheduleDTO> searchDelivery(CommonFilter filter) {
        return scheduleService.getAllSchedules(filter);
    }

}
