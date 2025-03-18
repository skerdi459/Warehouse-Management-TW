package org.example.wtask.controller;

import org.example.wtask.models.DTO.ItemDTO;
import org.example.wtask.service.ItemService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
@RestController
@RequestMapping("/task/items")
public class ItemController {

    private final static Logger logger = LoggerFactory.getLogger(ItemController.class);
    private final ItemService itemService;

    public ItemController(ItemService itemService) {
        this.itemService = itemService;
    }

    @GetMapping("/search")
    public Page<ItemDTO> searchItems(Pageable pageable) {
        logger.info("Request received to search items with pageable: {}", pageable);
        Page<ItemDTO> result = itemService.searchItems(pageable);
        return result;
    }

    @PostMapping("/create-item")
    public ResponseEntity<?> createItem(@RequestBody ItemDTO item) {
        try {
            ItemDTO createdItem = itemService.createItem(item);
            return ResponseEntity.ok(createdItem);
        } catch (DataIntegrityViolationException e) {
            logger.error("Failed to create item. Duplicate key detected: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body("Duplicate key error: An item with the same identifier already exists.");
        } catch (Exception e) {
            logger.error("Error occurred while creating the item: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error occurred while creating the item.");
        }
    }


    @PutMapping("/{id}/edit")
    public ItemDTO updateItem(@PathVariable Long id, @RequestBody ItemDTO updatedItem) {
        ItemDTO updated = itemService.updateItem(id, updatedItem);
        logger.info("Item with id: {} updated successfully", id);
        return updated;
    }

    @GetMapping("/findAll")
    public List<ItemDTO> findAllItems() {
        List<ItemDTO> items = itemService.getAllItems();
        logger.info("Total items found: {}", items.size());
        return items;
    }

    @PutMapping("/{id}/soft-delete")
    public ResponseEntity<?> softDeleteItem(@PathVariable Long id) {
        try {
            ItemDTO deletedItem = itemService.softDeleteItem(id);
            return ResponseEntity.ok(deletedItem);
        }
        catch (IllegalArgumentException e){
            logger.info("Item with id: {} is related with order", id);

            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Item is related with orders");
        }

    }
}
