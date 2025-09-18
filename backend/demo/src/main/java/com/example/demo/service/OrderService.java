package com.example.demo.service;

import com.example.demo.dto.OrderDTO;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface OrderService {
    Page<OrderDTO> getAll(Pageable pageable);

    OrderDTO getById(Long id);

    OrderDTO create(OrderDTO dto);

    OrderDTO update(Long id, OrderDTO dto);

    void delete(Long id);

    // Returns a list of recommended MenuItems for the given customer
    java.util.List<com.example.demo.model.MenuItem> getRecommendations(Long customerId);
}
