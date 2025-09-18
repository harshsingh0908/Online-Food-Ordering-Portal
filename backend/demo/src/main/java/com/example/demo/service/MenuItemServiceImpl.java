package com.example.demo.service;

import com.example.demo.model.MenuItem;
import com.example.demo.dto.MenuItemDTO;
import com.example.demo.repository.MenuItemRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import com.example.demo.model.Category;
import com.example.demo.repository.CategoryRepository;
import java.util.Optional;

// Service implementation for MenuItem
@Service
public class MenuItemServiceImpl implements MenuItemService {

    @Autowired
    private MenuItemRepository menuItemRepository;

    @Autowired
    private CategoryRepository categoryRepository;

    @Override
    public Page<MenuItem> getAllMenuItems(Pageable pageable) {
        return menuItemRepository.findAll(pageable);
    }

    @Override
    public Optional<MenuItem> getMenuItemById(Long id) {
        return menuItemRepository.findById(id);
    }

    @Override
    public Optional<MenuItem> getMenuItemBySlug(String slug) {
        return menuItemRepository.findBySlug(slug);
    }

    @Override
    public MenuItem createMenuItem(MenuItemDTO dto) {
        MenuItem menuItem = new MenuItem();
        menuItem.setName(dto.getName());
        menuItem.setDescription(dto.getDescription());
        menuItem.setPrice(dto.getPrice());
        menuItem.setMrp(dto.getMrp());
        menuItem.setImg(dto.getImg());
        menuItem.setVeg(dto.getVeg());
        menuItem.setCustomizable(dto.getCustomizable());
        menuItem.setRating(dto.getRating());
        menuItem.setPopularity(dto.getPopularity());
        if (dto.getCategoryId() != null) {
            Category category = categoryRepository.findById(dto.getCategoryId())
                    .orElseThrow(() -> new RuntimeException("Category not found"));
            menuItem.setCategory(category);
        }
        // Set slug, auto-generate if missing
        String slug = dto.getSlug();
        if (slug == null || slug.trim().isEmpty()) {
            slug = generateSlugFromName(dto.getName());
        }
        menuItem.setSlug(slug);
        return menuItemRepository.save(menuItem);
    }

    @Override
    public MenuItem updateMenuItem(Long id, MenuItemDTO dto) {
        MenuItem menuItem = menuItemRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("MenuItem not found"));
        menuItem.setName(dto.getName());
        menuItem.setDescription(dto.getDescription());
        menuItem.setPrice(dto.getPrice());
        menuItem.setMrp(dto.getMrp());
        menuItem.setImg(dto.getImg());
        menuItem.setVeg(dto.getVeg());
        menuItem.setCustomizable(dto.getCustomizable());
        menuItem.setRating(dto.getRating());
        menuItem.setPopularity(dto.getPopularity());
        if (dto.getCategoryId() != null) {
            Category category = categoryRepository.findById(dto.getCategoryId())
                    .orElseThrow(() -> new RuntimeException("Category not found"));
            menuItem.setCategory(category);
        }
        // Set slug, auto-generate if missing
        String slug = dto.getSlug();
        if (slug == null || slug.trim().isEmpty()) {
            slug = generateSlugFromName(dto.getName());
        }
        menuItem.setSlug(slug);
        return menuItemRepository.save(menuItem);
    }

    // Utility method to generate slug from name
    private String generateSlugFromName(String name) {
        if (name == null)
            return null;
        return name.trim().toLowerCase().replaceAll("[^a-z0-9]+", "-").replaceAll("^-|-$", "");
    }

    @Override
    public void deleteMenuItem(Long id) {
        menuItemRepository.deleteById(id);
    }
}
