package com.example.demo.mapper;

import com.example.demo.dto.OrderDTO;
import com.example.demo.model.Order;
import com.example.demo.model.Customer;
import java.util.stream.Collectors;

public class OrderMapper {
    public static OrderDTO toDTO(Order entity) {
        if (entity == null)
            return null;
        OrderDTO dto = new OrderDTO();
        dto.setId(entity.getId());
        dto.setOrderNumber(entity.getOrderNumber());
        dto.setCustomerId(entity.getCustomer() != null ? entity.getCustomer().getId() : null);
        dto.setTotalAmount(entity.getTotalAmount());
        dto.setStatus(entity.getStatus() != null ? entity.getStatus().name() : null);
        dto.setCreatedAt(entity.getCreatedAt());
        dto.setUpdatedAt(entity.getUpdatedAt());
        if (entity.getOrderItems() != null) {
            dto.setOrderItems(entity.getOrderItems().stream().map(OrderItemMapper::toDTO).collect(Collectors.toList()));
        }
        return dto;
    }

    public static Order toEntity(OrderDTO dto, Customer customer) {
        if (dto == null)
            return null;
        Order entity = new Order();
        entity.setId(dto.getId());
        entity.setOrderNumber(dto.getOrderNumber());
        entity.setCustomer(customer);
        entity.setTotalAmount(dto.getTotalAmount());
        entity.setStatus(dto.getStatus() != null ? Order.Status.valueOf(dto.getStatus()) : null);
        entity.setCreatedAt(dto.getCreatedAt());
        entity.setUpdatedAt(dto.getUpdatedAt());
        // OrderItems and Payment set elsewhere
        return entity;
    }
}
