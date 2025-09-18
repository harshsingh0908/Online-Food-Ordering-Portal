package com.example.demo.service;

import com.example.demo.dto.CustomerDTO;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface CustomerService {
    Page<CustomerDTO> getAll(Pageable pageable);

    CustomerDTO getById(Long id);

    CustomerDTO create(CustomerDTO dto);

    CustomerDTO update(Long id, CustomerDTO dto);

    void delete(Long id);
}
