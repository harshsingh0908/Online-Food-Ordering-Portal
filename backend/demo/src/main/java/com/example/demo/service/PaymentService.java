package com.example.demo.service;

import com.example.demo.dto.PaymentDTO;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface PaymentService {
    Page<PaymentDTO> getAll(Pageable pageable);

    PaymentDTO getById(Long id);

    PaymentDTO create(PaymentDTO dto);

    PaymentDTO update(Long id, PaymentDTO dto);

    void delete(Long id);
}
