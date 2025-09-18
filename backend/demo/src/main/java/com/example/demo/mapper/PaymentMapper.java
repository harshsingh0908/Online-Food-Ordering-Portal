package com.example.demo.mapper;

import com.example.demo.dto.PaymentDTO;
import com.example.demo.model.Payment;
import com.example.demo.model.Order;

public class PaymentMapper {
    public static PaymentDTO toDTO(Payment entity) {
        if (entity == null)
            return null;
        PaymentDTO dto = new PaymentDTO();
        dto.setId(entity.getId());
        dto.setOrderId(entity.getOrder() != null ? entity.getOrder().getId() : null);
        dto.setMethod(entity.getMethod() != null ? entity.getMethod().name() : null);
        dto.setAmount(entity.getAmount());
        dto.setPaidAt(entity.getPaidAt());
        return dto;
    }

    public static Payment toEntity(PaymentDTO dto, Order order) {
        if (dto == null)
            return null;
        Payment entity = new Payment();
        entity.setId(dto.getId());
        entity.setOrder(order);
        entity.setMethod(dto.getMethod() != null ? Payment.Method.valueOf(dto.getMethod()) : null);
        entity.setAmount(dto.getAmount());
        entity.setPaidAt(dto.getPaidAt());
        return entity;
    }
}
