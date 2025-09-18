package com.example.demo.mapper;

import com.example.demo.dto.MenuItemDTO;
import com.example.demo.model.MenuItem;
import com.example.demo.model.Category;

public class MenuItemMapper {
    public static MenuItemDTO toDTO(MenuItem entity) {
        if (entity == null)
            return null;
        MenuItemDTO dto = new MenuItemDTO();
        dto.setId(entity.getId());
        dto.setName(entity.getName());
        dto.setDescription(entity.getDescription());
        dto.setPrice(entity.getPrice());
        dto.setMrp(entity.getMrp());
        dto.setImg(entity.getImg());
        dto.setVeg(entity.getVeg());
        dto.setCustomizable(entity.getCustomizable());
        dto.setRating(entity.getRating());
        dto.setPopularity(entity.getPopularity());
        dto.setCategoryId(entity.getCategory() != null ? entity.getCategory().getId() : null);
        return dto;
    }

    public static MenuItem toEntity(MenuItemDTO dto, Category category) {
        if (dto == null)
            return null;
        MenuItem entity = new MenuItem();
        entity.setId(dto.getId());
        entity.setName(dto.getName());
        entity.setDescription(dto.getDescription());
        entity.setPrice(dto.getPrice());
        entity.setMrp(dto.getMrp());
        entity.setImg(dto.getImg());
        entity.setVeg(dto.getVeg());
        entity.setCustomizable(dto.getCustomizable());
        entity.setRating(dto.getRating());
        entity.setPopularity(dto.getPopularity());
        entity.setCategory(category);
        return entity;
    }
}
