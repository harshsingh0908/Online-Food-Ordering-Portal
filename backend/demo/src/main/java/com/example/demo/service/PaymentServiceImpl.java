package com.example.demo.service;

import com.example.demo.dto.PaymentDTO;
import com.example.demo.mapper.PaymentMapper;
import com.example.demo.model.Payment;
import com.example.demo.model.Order;
import com.example.demo.repository.PaymentRepository;
import com.example.demo.repository.OrderRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

@Service
public class PaymentServiceImpl implements PaymentService {
    @Autowired
    private PaymentRepository paymentRepository;
    @Autowired
    private OrderRepository orderRepository;

    @Override
    public Page<PaymentDTO> getAll(Pageable pageable) {
        return paymentRepository.findAll(pageable).map(PaymentMapper::toDTO);
    }

    @Override
    public PaymentDTO getById(Long id) {
        Payment payment = paymentRepository.findById(id).orElseThrow(() -> new RuntimeException("Payment not found"));
        return PaymentMapper.toDTO(payment);
    }

    @Override
    public PaymentDTO create(PaymentDTO dto) {
        Order order = orderRepository.findById(dto.getOrderId())
                .orElseThrow(() -> new RuntimeException("Order not found"));
        Payment payment = PaymentMapper.toEntity(dto, order);
        return PaymentMapper.toDTO(paymentRepository.save(payment));
    }

    @Override
    public PaymentDTO update(Long id, PaymentDTO dto) {
        Payment payment = paymentRepository.findById(id).orElseThrow(() -> new RuntimeException("Payment not found"));
        Order order = orderRepository.findById(dto.getOrderId())
                .orElseThrow(() -> new RuntimeException("Order not found"));
        payment.setOrder(order);
        payment.setMethod(dto.getMethod() != null ? Payment.Method.valueOf(dto.getMethod()) : null);
        payment.setAmount(dto.getAmount());
        payment.setPaidAt(dto.getPaidAt());
        return PaymentMapper.toDTO(paymentRepository.save(payment));
    }

    @Override
    public void delete(Long id) {
        paymentRepository.deleteById(id);
    }
}
