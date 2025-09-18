package com.example.demo.service;

import com.example.demo.dto.OrderDTO;
import com.example.demo.mapper.OrderMapper;
import com.example.demo.mapper.OrderItemMapper;
import com.example.demo.model.Order;
import com.example.demo.model.Customer;
import com.example.demo.model.OrderItem;
import com.example.demo.model.MenuItem;
import com.example.demo.repository.OrderRepository;
import com.example.demo.repository.CustomerRepository;
import com.example.demo.repository.OrderItemRepository;
import com.example.demo.repository.MenuItemRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import org.springframework.stereotype.Service;
import java.util.List;
import java.util.stream.Collectors;
import java.util.Map;
import java.util.HashMap;
import java.util.Comparator;
import java.util.LinkedHashMap;
import java.util.Optional;

@Service

public class OrderServiceImpl implements OrderService {
    @Autowired
    private OrderRepository orderRepository;
    @Autowired
    private CustomerRepository customerRepository;
    @Autowired
    private OrderItemRepository orderItemRepository;
    @Autowired
    private MenuItemRepository menuItemRepository;

    @Override
    public Page<OrderDTO> getAll(Pageable pageable) {
        return orderRepository.findAll(pageable).map(OrderMapper::toDTO);
    }

    @Override
    public OrderDTO getById(Long id) {
        Order order = orderRepository.findById(id).orElseThrow(() -> new RuntimeException("Order not found"));
        return OrderMapper.toDTO(order);
    }

    @Override
    public OrderDTO create(OrderDTO dto) {
        Customer customer = customerRepository.findById(dto.getCustomerId())
                .orElseThrow(() -> new RuntimeException("Customer not found"));
        Order order = OrderMapper.toEntity(dto, customer);
        Order savedOrder = orderRepository.save(order);
        if (dto.getOrderItems() != null) {
            List<OrderItem> items = dto.getOrderItems().stream().map(itemDto -> {
                MenuItem menuItem = menuItemRepository.findById(itemDto.getMenuItemId())
                        .orElseThrow(() -> new RuntimeException("MenuItem not found"));
                return OrderItemMapper.toEntity(itemDto, savedOrder, menuItem);
            }).collect(Collectors.toList());
            orderItemRepository.saveAll(items);
        }
        return OrderMapper.toDTO(savedOrder);
    }

    @Override
    public OrderDTO update(Long id, OrderDTO dto) {
        Order order = orderRepository.findById(id).orElseThrow(() -> new RuntimeException("Order not found"));
        Customer customer = customerRepository.findById(dto.getCustomerId())
                .orElseThrow(() -> new RuntimeException("Customer not found"));
        order.setOrderNumber(dto.getOrderNumber());
        order.setCustomer(customer);
        order.setTotalAmount(dto.getTotalAmount());
        order.setStatus(dto.getStatus() != null ? Order.Status.valueOf(dto.getStatus()) : null);
        order.setCreatedAt(dto.getCreatedAt());
        order.setUpdatedAt(dto.getUpdatedAt());
        return OrderMapper.toDTO(orderRepository.save(order));
    }

    @Override
    public java.util.List<MenuItem> getRecommendations(Long customerId) {
        // Get all order items for this customer
        Optional<Customer> customerOpt = customerRepository.findById(customerId);
        if (!customerOpt.isPresent()) {
            return java.util.Collections.emptyList();
        }
        Customer customer = customerOpt.get();
        // Get all orders for this customer
        List<Order> orders = orderRepository.findAll().stream()
                .filter(o -> o.getCustomer() != null && o.getCustomer().getId().equals(customerId))
                .collect(Collectors.toList());
        Map<MenuItem, Integer> itemCount = new HashMap<>();
        for (Order order : orders) {
            if (order.getOrderItems() != null) {
                for (OrderItem item : order.getOrderItems()) {
                    MenuItem menuItem = item.getMenuItem();
                    if (menuItem != null) {
                        itemCount.put(menuItem, itemCount.getOrDefault(menuItem, 0) + item.getQuantity());
                    }
                }
            }
        }
        // If user has order history, recommend most frequently ordered items
        if (!itemCount.isEmpty()) {
            return itemCount.entrySet().stream()
                    .sorted(Map.Entry.<MenuItem, Integer>comparingByValue(Comparator.reverseOrder()))
                    .limit(5)
                    .map(Map.Entry::getKey)
                    .collect(Collectors.toList());
        }
        // If no order history, recommend top 5 popular items overall
        return menuItemRepository.findAll().stream()
                .sorted(Comparator.comparing(MenuItem::getPopularity, Comparator.nullsLast(Comparator.reverseOrder())))
                .limit(5)
                .collect(Collectors.toList());
    }

    @Override
    public void delete(Long id) {
        orderRepository.deleteById(id);
    }
}
