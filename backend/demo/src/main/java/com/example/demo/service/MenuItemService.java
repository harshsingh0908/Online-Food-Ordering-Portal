package com.example.demo.service;

import com.example.demo.model.MenuItem;
import com.example.demo.dto.MenuItemDTO;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.Optional;

public interface MenuItemService {
    Page<MenuItem> getAllMenuItems(Pageable pageable);

    Optional<MenuItem> getMenuItemById(Long id);

    Optional<MenuItem> getMenuItemBySlug(String slug);

    MenuItem createMenuItem(MenuItemDTO dto);

    MenuItem updateMenuItem(Long id, MenuItemDTO dto);

    void deleteMenuItem(Long id);
}
