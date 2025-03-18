package org.example.wtask.controller;

import org.example.wtask.models.DTO.TruckDTO;
import org.example.wtask.models.DTO.TruckFilter;
import org.example.wtask.service.TruckService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
@RestController
@RequestMapping("/task/trucks")
public class TruckController {

    private final static Logger logger = LoggerFactory.getLogger(TruckController.class);
    private final TruckService truckService;

    public TruckController(TruckService truckService) {
        this.truckService = truckService;
    }

    @PostMapping("/search")
    public Page<TruckDTO> searchTrucks(@RequestBody TruckFilter truckFilter) {
        logger.info("Searching trucks with filters: {}", truckFilter);
        return truckService.searchTrucks(truckFilter);
    }

    @PostMapping("/create-truck")
    public ResponseEntity<?> createTruck(@RequestBody TruckDTO truck) {
        try {
            TruckDTO createdTruck = truckService.createTruck(truck);
            return new ResponseEntity<>(createdTruck, HttpStatus.CREATED);
        } catch (DataIntegrityViolationException e) {
            logger.error("Duplicate truck entry: {}", truck);
            return new ResponseEntity<>("Truck with the given details already exists.", HttpStatus.BAD_REQUEST);
        } catch (Exception e) {
            logger.error("Error creating truck: {}", e.getMessage());
            return new ResponseEntity<>(e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }


    @PutMapping("/{id}/edit")
    public TruckDTO updateTruck(@PathVariable Long id, @RequestBody TruckDTO truck) {
        logger.info("Updating truck with id: {}", id);
        return truckService.updateTruck(id, truck);
    }

    @DeleteMapping("/{id}/soft-delete")
    public void deleteTruck(@PathVariable Long id) {
        logger.info("Soft deleting truck with id: {}", id);
        truckService.deleteTruck(id);
    }
}