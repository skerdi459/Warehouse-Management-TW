package org.example.wtask.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.example.wtask.models.DTO.ItemDTO;
import org.example.wtask.models.Enums.LifeCycle;
import org.example.wtask.models.Item;
import org.example.wtask.repository.ItemRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.dao.DuplicateKeyException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class ItemService {
    private final static Logger logger = LoggerFactory.getLogger(ItemService.class);
    private final ItemRepository itemRepository;
    private final ObjectMapper objectMapper;

    public ItemService(ItemRepository itemRepository, ObjectMapper objectMapper) {
        this.itemRepository = itemRepository;
        this.objectMapper = objectMapper;
    }

    public ItemDTO createItem(ItemDTO item) {
        Item itemCnv = objectMapper.convertValue(item, Item.class);
        Item createdItem = itemRepository.save(itemCnv);

        logger.info("Item created successfully with id: {}", createdItem.getId());
        return objectMapper.convertValue(createdItem, ItemDTO.class);
    }

    public ItemDTO updateItem(Long id, ItemDTO updatedItem) {
        return itemRepository.findById(id).map(item -> {
            item.setItemName(updatedItem.getItemName());
            item.setQuantity(updatedItem.getQuantity());
            item.setUnitPrice(updatedItem.getUnitPrice());
            Item savedItem = itemRepository.save(item);
            logger.info("Item with id: {} updated successfully", id);
            return objectMapper.convertValue(savedItem, ItemDTO.class);
        }).orElseThrow(() -> {
            logger.error("Item not found with id: {}", id);
            return new RuntimeException("Item not found with id " + id);
        });
    }

    public List<ItemDTO> getAllItems() {
        List<ItemDTO> items = itemRepository.findAll().stream()
                .map(items1 -> objectMapper.convertValue(items1, ItemDTO.class)).collect(Collectors.toList());;
        logger.info("Total items found: {}", items.size());
        return items;
    }

    public Page<ItemDTO> searchItems(Pageable pageable) {
        Page<ItemDTO> items = itemRepository.findAllByLifeCycle(pageable, LifeCycle.READY)
                .map(item ->objectMapper.convertValue(item,ItemDTO.class) );
        logger.info("Items found: {}", items.getTotalElements());
        return items;
    }

    public ItemDTO softDeleteItem(Long id) {
        return itemRepository.findById(id).map(item -> {
            if(item.getOrderItems().size() > 0){
               throw new IllegalArgumentException("Item is Related with order");
            }
            item.setLifeCycle(LifeCycle.DELETED);
            Item deletedItem = itemRepository.save(item);
            return objectMapper.convertValue(deletedItem, ItemDTO.class);
        }).orElseThrow(() -> {
            logger.error("Item not found with id: {}", id);
            return new IllegalArgumentException("Item not found with id " + id);
        });
    }
}
