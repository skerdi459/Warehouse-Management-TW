package org.example.wtask.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.example.wtask.models.DTO.ItemDTO;
import org.example.wtask.models.Enums.LifeCycle;
import org.example.wtask.models.Item;
import org.example.wtask.repository.ItemRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

class ItemServiceTest {

    @Mock
    private ItemRepository itemRepository;

    @Mock
    private ObjectMapper objectMapper;

    @InjectMocks
    private ItemService itemService;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void createItem_ShouldCreateNewItem() {
        ItemDTO itemDTO = new ItemDTO();
        itemDTO.setItemName("Test Item");

        Item item = new Item();
        item.setId(1L);
        item.setItemName("Test Item");

        when(objectMapper.convertValue(itemDTO, Item.class)).thenReturn(item);
        when(itemRepository.save(any(Item.class))).thenReturn(item);
        when(objectMapper.convertValue(item, ItemDTO.class)).thenReturn(itemDTO);

        ItemDTO createdItem = itemService.createItem(itemDTO);

        assertNotNull(createdItem);
        assertEquals("Test Item", createdItem.getItemName());
        verify(itemRepository, times(1)).save(any(Item.class));
    }

    @Test
    void updateItem_ShouldUpdateExistingItem() {
        Long itemId = 1L;
        ItemDTO updatedItemDTO = new ItemDTO();
        updatedItemDTO.setItemName("Updated Item");
        updatedItemDTO.setQuantity(5);
        updatedItemDTO.setUnitPrice(100.0);

        Item item = new Item();
        item.setId(itemId);
        item.setItemName("Old Item");

        when(itemRepository.findById(itemId)).thenReturn(Optional.of(item));
        when(itemRepository.save(any(Item.class))).thenReturn(item);
        when(objectMapper.convertValue(item, ItemDTO.class)).thenReturn(updatedItemDTO);

        ItemDTO updatedItem = itemService.updateItem(itemId, updatedItemDTO);

        assertNotNull(updatedItem);
        assertEquals("Updated Item", updatedItem.getItemName());
        verify(itemRepository, times(1)).findById(itemId);
        verify(itemRepository, times(1)).save(any(Item.class));
    }

    @Test
    void getAllItems_ShouldReturnListOfItems() {
        Item item1 = new Item();
        item1.setItemName("Item 1");

        Item item2 = new Item();
        item2.setItemName("Item 2");

        List<Item> itemList = Arrays.asList(item1, item2);
        ItemDTO itemDTO1 = new ItemDTO();
        itemDTO1.setItemName("Item 1");

        ItemDTO itemDTO2 = new ItemDTO();
        itemDTO2.setItemName("Item 2");

        when(itemRepository.findAll()).thenReturn(itemList);
        when(objectMapper.convertValue(item1, ItemDTO.class)).thenReturn(itemDTO1);
        when(objectMapper.convertValue(item2, ItemDTO.class)).thenReturn(itemDTO2);

        List<ItemDTO> items = itemService.getAllItems();

        assertEquals(2, items.size());
        verify(itemRepository, times(1)).findAll();
    }

    @Test
    void searchItems_ShouldReturnPageOfItems() {
        Pageable pageable = PageRequest.of(0, 10);
        Item item = new Item();
        item.setItemName("Item 1");

        Page<Item> itemPage = new PageImpl<>(Arrays.asList(item));
        ItemDTO itemDTO = new ItemDTO();
        itemDTO.setItemName("Item 1");

        when(itemRepository.findAllByLifeCycle(pageable, LifeCycle.READY)).thenReturn(itemPage);
        when(objectMapper.convertValue(item, ItemDTO.class)).thenReturn(itemDTO);

        Page<ItemDTO> result = itemService.searchItems(pageable);

        assertEquals(1, result.getTotalElements());
        verify(itemRepository, times(1)).findAllByLifeCycle(pageable, LifeCycle.READY);
    }

}