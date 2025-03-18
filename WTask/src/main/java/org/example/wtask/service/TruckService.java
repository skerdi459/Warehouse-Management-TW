package org.example.wtask.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.example.wtask.bindings.OrderSpecifications;
import org.example.wtask.bindings.TruckSpecifications;
import org.example.wtask.models.DTO.OrderDTO;
import org.example.wtask.models.DTO.OrderFilter;
import org.example.wtask.models.DTO.TruckDTO;
import org.example.wtask.models.DTO.TruckFilter;
import org.example.wtask.models.Enums.LifeCycle;
import org.example.wtask.models.Order;
import org.example.wtask.models.Truck;
import org.example.wtask.repository.TruckRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.dao.DuplicateKeyException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import java.util.Date;

@Service
public class TruckService {
    private final static Logger logger = LoggerFactory.getLogger(TruckService.class);
    private final TruckRepository truckRepository;
    private final ObjectMapper objectMapper;

    public TruckService(TruckRepository truckRepository, ObjectMapper objectMapper) {
        this.truckRepository = truckRepository;
        this.objectMapper = objectMapper;
    }

    public TruckDTO createTruck(TruckDTO truck) {
            Truck savedTruck = objectMapper.convertValue(truck, Truck.class);
            TruckDTO savedTruckDTO = objectMapper.convertValue(truckRepository.save(savedTruck), TruckDTO.class);
            logger.info("Truck created successfully with id: {}", savedTruckDTO.getId());
            return savedTruckDTO;
    }


    public void deleteTruck(Long id) {
        truckRepository.findById(id).map(truck -> {
            truck.setLifeCycle(LifeCycle.DELETED);
            truckRepository.save(truck);
            logger.info("Truck with id: {} soft deleted successfully", id);
            return truck;
        }).orElseThrow(() -> {
            logger.error("Truck not found with id: {}", id);
            throw new RuntimeException("Truck not found with id " + id);
        });
    }

    public Page<TruckDTO> searchTrucks(TruckFilter truckFilter) {
        Specification<Truck> spec = Specification.where(null);

        if (truckFilter.isFreeSpace()) {
            spec = spec.and(TruckSpecifications.hasFreeSpace(true));
        }
        spec = spec.and(TruckSpecifications.lifeCycle(truckFilter.getLifeCycle(),false));

        Pageable pageable = PageRequest.of(truckFilter.getPage(), truckFilter.getSize());
        logger.debug("Executing search with filters: {}", spec);
        return truckRepository.findAll(spec, pageable).map(truck -> objectMapper.convertValue(truck, TruckDTO.class));
    }

    public TruckDTO updateTruck(Long id, TruckDTO updatedTruck) {
        return truckRepository.findById(id).map(truck -> {
            truck.setChassisNumber(updatedTruck.getChassisNumber());
            truck.setPlate(updatedTruck.getPlate());
            truck.setDriverName(updatedTruck.getDriverName());
            truck.setLifeCycle(LifeCycle.READY); // Ensure it's not deleted
            TruckDTO savedTruckDTO = objectMapper.convertValue(truckRepository.save(truck), TruckDTO.class);
            logger.info("Truck with id: {} updated successfully", id);
            return savedTruckDTO;
        }).orElseThrow(() -> {
            logger.error("Truck not found with id: {}", id);
            throw new RuntimeException("Truck not found with id " + id);
        });
    }
}
