package com.example.demo.controller;

import com.example.demo.model.MenuItem;
import com.example.demo.dto.MenuItemDTO;
import com.example.demo.service.MenuItemService;
import com.example.demo.model.Category;
import org.springframework.data.domain.PageImpl;
import java.util.stream.Collectors;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

// REST controller for MenuItem entity
@RestController
@RequestMapping("/api/menu-items")
@CrossOrigin(origins = "http://localhost:4200") // Allow Angular frontend
public class MenuItemController {
    @Autowired
    private MenuItemService menuItemService;

    // GET /api/menu-items?page=0&size=10&sort=name,asc
    @GetMapping
    public ResponseEntity<Page<MenuItemDTO>> getAllMenuItems(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "id,asc") String[] sort) {
        Sort.Direction direction = sort[1].equalsIgnoreCase("desc") ? Sort.Direction.DESC : Sort.Direction.ASC;
        Pageable pageable = PageRequest.of(page, size, Sort.by(direction, sort[0]));
        Page<MenuItem> items = menuItemService.getAllMenuItems(pageable);
        // Map MenuItem to MenuItemDTO and set cat (category name)
        var dtoList = items.getContent().stream().map(item -> {
            MenuItemDTO dto = new MenuItemDTO();
            dto.setId(item.getId());
            dto.setName(item.getName());
            dto.setDescription(item.getDescription());
            dto.setPrice(item.getPrice());
            dto.setMrp(item.getMrp());
            dto.setImg(item.getImg());
            dto.setVeg(item.getVeg());
            dto.setCustomizable(item.getCustomizable());
            dto.setRating(item.getRating());
            dto.setPopularity(item.getPopularity());
            dto.setCategoryId(item.getCategory() != null ? item.getCategory().getId() : null);
            dto.setSlug(item.getSlug());
            // Set cat to category name for frontend
            dto.setCat(item.getCategory() != null ? item.getCategory().getName() : null);
            return dto;
        }).collect(Collectors.toList());
        Page<MenuItemDTO> dtoPage = new PageImpl<>(dtoList, pageable, items.getTotalElements());
        return ResponseEntity.ok(dtoPage);
    }

    // GET /api/menu-items/slug/{slug}
    @GetMapping("/slug/{slug}")
    public ResponseEntity<MenuItem> getMenuItemBySlug(@PathVariable String slug) {
        if (slug == null || slug.trim().isEmpty()) {
            return ResponseEntity.badRequest().build();
        }
        Optional<MenuItem> item = menuItemService.getMenuItemBySlug(slug.trim());
        return item.map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    // GET /api/menu-items/{id}
    @GetMapping("/{id}")
    public ResponseEntity<MenuItem> getMenuItemById(@PathVariable Long id) {
        Optional<MenuItem> item = menuItemService.getMenuItemById(id);
        return item.map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    // POST /api/menu-items
    @PostMapping
    public ResponseEntity<MenuItem> createMenuItem(@Validated @RequestBody MenuItemDTO dto) {
        MenuItem created = menuItemService.createMenuItem(dto);
        return new ResponseEntity<>(created, HttpStatus.CREATED);
    }

    // PUT /api/menu-items/{id}
    @PutMapping("/{id}")
    public ResponseEntity<MenuItem> updateMenuItem(@PathVariable Long id, @Validated @RequestBody MenuItemDTO dto) {
        MenuItem updated = menuItemService.updateMenuItem(id, dto);
        return ResponseEntity.ok(updated);
    }

    // DELETE /api/menu-items/{id}
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteMenuItem(@PathVariable Long id) {
        menuItemService.deleteMenuItem(id);
        return ResponseEntity.noContent().build();
    }
}
