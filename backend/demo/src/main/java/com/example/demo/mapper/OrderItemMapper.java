package com.example.demo.mapper;

import com.example.demo.dto.OrderItemDTO;
import com.example.demo.model.OrderItem;
import com.example.demo.model.Order;
import com.example.demo.model.MenuItem;

public class OrderItemMapper {
    public static OrderItemDTO toDTO(OrderItem entity) {
        if (entity == null)
            return null;
        OrderItemDTO dto = new OrderItemDTO();
        dto.setId(entity.getId());
        dto.setOrderId(entity.getOrder() != null ? entity.getOrder().getId() : null);
        dto.setMenuItemId(entity.getMenuItem() != null ? entity.getMenuItem().getId() : null);
        dto.setQuantity(entity.getQuantity());
        dto.setPrice(entity.getPrice());
        return dto;
    }

    public static OrderItem toEntity(OrderItemDTO dto, Order order, MenuItem menuItem) {
        if (dto == null)
            return null;
        OrderItem entity = new OrderItem();
        entity.setId(dto.getId());
        entity.setOrder(order);
        entity.setMenuItem(menuItem);
        entity.setQuantity(dto.getQuantity());
        entity.setPrice(dto.getPrice());
        return entity;
    }
}
