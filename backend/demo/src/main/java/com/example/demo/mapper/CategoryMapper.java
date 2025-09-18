package com.example.demo.mapper;

import com.example.demo.dto.CategoryDTO;
import com.example.demo.model.Category;

public class CategoryMapper {
    public static CategoryDTO toDTO(Category entity) {
        if (entity == null)
            return null;
        CategoryDTO dto = new CategoryDTO();
        dto.setId(entity.getId());
        dto.setName(entity.getName());
        dto.setDescription(entity.getDescription());
        return dto;
    }

    public static Category toEntity(CategoryDTO dto) {
        if (dto == null)
            return null;
        Category entity = new Category();
        entity.setId(dto.getId());
        entity.setName(dto.getName());
        entity.setDescription(dto.getDescription());
        return entity;
    }
}
