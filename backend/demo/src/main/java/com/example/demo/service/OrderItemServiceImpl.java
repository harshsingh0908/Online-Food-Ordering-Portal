package com.example.demo.service;

import com.example.demo.dto.OrderItemDTO;
import com.example.demo.mapper.OrderItemMapper;
import com.example.demo.model.OrderItem;
import com.example.demo.model.Order;
import com.example.demo.model.MenuItem;
import com.example.demo.repository.OrderItemRepository;
import com.example.demo.repository.OrderRepository;
import com.example.demo.repository.MenuItemRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

@Service
public class OrderItemServiceImpl implements OrderItemService {
    @Autowired
    private OrderItemRepository orderItemRepository;
    @Autowired
    private OrderRepository orderRepository;
    @Autowired
    private MenuItemRepository menuItemRepository;

    @Override
    public Page<OrderItemDTO> getAll(Pageable pageable) {
        return orderItemRepository.findAll(pageable).map(OrderItemMapper::toDTO);
    }

    @Override
    public OrderItemDTO getById(Long id) {
        OrderItem orderItem = orderItemRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("OrderItem not found"));
        return OrderItemMapper.toDTO(orderItem);
    }

    @Override
    public OrderItemDTO create(OrderItemDTO dto) {
        Order order = orderRepository.findById(dto.getOrderId())
                .orElseThrow(() -> new RuntimeException("Order not found"));
        MenuItem menuItem = menuItemRepository.findById(dto.getMenuItemId())
                .orElseThrow(() -> new RuntimeException("MenuItem not found"));
        OrderItem orderItem = OrderItemMapper.toEntity(dto, order, menuItem);
        return OrderItemMapper.toDTO(orderItemRepository.save(orderItem));
    }

    @Override
    public OrderItemDTO update(Long id, OrderItemDTO dto) {
        OrderItem orderItem = orderItemRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("OrderItem not found"));
        Order order = orderRepository.findById(dto.getOrderId())
                .orElseThrow(() -> new RuntimeException("Order not found"));
        MenuItem menuItem = menuItemRepository.findById(dto.getMenuItemId())
                .orElseThrow(() -> new RuntimeException("MenuItem not found"));
        orderItem.setOrder(order);
        orderItem.setMenuItem(menuItem);
        orderItem.setQuantity(dto.getQuantity());
        orderItem.setPrice(dto.getPrice());
        return OrderItemMapper.toDTO(orderItemRepository.save(orderItem));
    }

    @Override
    public void delete(Long id) {
        orderItemRepository.deleteById(id);
    }
}
