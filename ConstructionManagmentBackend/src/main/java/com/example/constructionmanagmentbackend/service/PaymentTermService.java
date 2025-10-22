package com.example.constructionmanagmentbackend.service;

import com.example.constructionmanagmentbackend.dto.PaymentTermDto;
import com.example.constructionmanagmentbackend.entity.Invoice;
import com.example.constructionmanagmentbackend.entity.PaymentTerm;
import com.example.constructionmanagmentbackend.exception.ResourceNotFoundException;
import com.example.constructionmanagmentbackend.repository.InvoiceRepository;
import com.example.constructionmanagmentbackend.repository.PaymentTermRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class PaymentTermService {

    @Autowired
    private PaymentTermRepository paymentTermRepository;

    @Autowired
    private InvoiceRepository invoiceRepository;

    public List<PaymentTermDto> getAllPaymentTerms() {
        return paymentTermRepository.findAll().stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    public PaymentTermDto getPaymentTermById(Long id) {
        PaymentTerm paymentTerm = paymentTermRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("PaymentTerm", "id", id));
        return convertToDto(paymentTerm);
    }

    public List<PaymentTermDto> getPaymentTermsByInvoiceId(Long invoiceId) {
        return paymentTermRepository.findByInvoiceId(invoiceId).stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    @Transactional
    public PaymentTermDto createPaymentTerm(PaymentTermDto paymentTermDto) {
        PaymentTerm paymentTerm = convertToEntity(paymentTermDto);
        paymentTerm = paymentTermRepository.save(paymentTerm);
        return convertToDto(paymentTerm);
    }

    @Transactional
    public PaymentTermDto updatePaymentTerm(Long id, PaymentTermDto paymentTermDto) {
        PaymentTerm existingPaymentTerm = paymentTermRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("PaymentTerm", "id", id));

        existingPaymentTerm.setAmount(paymentTermDto.getAmount());
        existingPaymentTerm.setDueDate(paymentTermDto.getDueDate());
        existingPaymentTerm.setStatus(paymentTermDto.getStatus());
        existingPaymentTerm.setDescription(paymentTermDto.getDescription());

        // Set paid date if status is changed to PAID
        if ("PAID".equals(paymentTermDto.getStatus()) && existingPaymentTerm.getPaidDate() == null) {
            existingPaymentTerm.setPaidDate(LocalDateTime.now());
        } else if (!"PAID".equals(paymentTermDto.getStatus())) {
            existingPaymentTerm.setPaidDate(null);
        }

        // Update invoice if needed
        if (!existingPaymentTerm.getInvoice().getId().equals(paymentTermDto.getInvoiceId())) {
            Invoice invoice = invoiceRepository.findById(paymentTermDto.getInvoiceId())
                    .orElseThrow(() -> new ResourceNotFoundException("Invoice", "id", paymentTermDto.getInvoiceId()));
            existingPaymentTerm.setInvoice(invoice);
        }

        existingPaymentTerm = paymentTermRepository.save(existingPaymentTerm);
        updateInvoiceStatus(existingPaymentTerm.getInvoice());

        return convertToDto(existingPaymentTerm);
    }

    @Transactional
    public void deletePaymentTerm(Long id) {
        PaymentTerm paymentTerm = paymentTermRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("PaymentTerm", "id", id));

        Invoice invoice = paymentTerm.getInvoice();
        paymentTermRepository.deleteById(id);

        // Update invoice status after deletion
        updateInvoiceStatus(invoice);
    }

    @Transactional
    public PaymentTermDto processPayment(Long id) {
        PaymentTerm paymentTerm = paymentTermRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("PaymentTerm", "id", id));

        paymentTerm.setStatus("PAID");
        paymentTerm.setPaidDate(LocalDateTime.now());
        paymentTerm = paymentTermRepository.save(paymentTerm);

        // Update invoice status
        updateInvoiceStatus(paymentTerm.getInvoice());

        return convertToDto(paymentTerm);
    }

    private void updateInvoiceStatus(Invoice invoice) {
        List<PaymentTerm> paymentTerms = paymentTermRepository.findByInvoiceId(invoice.getId());

        if (paymentTerms.isEmpty()) {
            return;
        }

        boolean allPaid = paymentTerms.stream().allMatch(pt -> "PAID".equals(pt.getStatus()));

        if (allPaid) {
            invoice.setStatus("PAID");
            invoice.setPaidDate(LocalDateTime.now());
        } else {
            boolean anyPaid = paymentTerms.stream().anyMatch(pt -> "PAID".equals(pt.getStatus()));
            invoice.setStatus(anyPaid ? "PARTIALLY_PAID" : "UNPAID");
            invoice.setPaidDate(null);
        }

        invoiceRepository.save(invoice);
    }

    private PaymentTermDto convertToDto(PaymentTerm paymentTerm) {
        PaymentTermDto dto = new PaymentTermDto();
        dto.setId(paymentTerm.getId());
        dto.setAmount(paymentTerm.getAmount());
        dto.setDueDate(paymentTerm.getDueDate());
        dto.setStatus(paymentTerm.getStatus());
        dto.setPaidDate(paymentTerm.getPaidDate());
        dto.setDescription(paymentTerm.getDescription());
        dto.setInvoiceId(paymentTerm.getInvoice().getId());
        dto.setCreatedAt(paymentTerm.getCreatedAt());
        dto.setUpdatedAt(paymentTerm.getUpdatedAt());
        return dto;
    }

    private PaymentTerm convertToEntity(PaymentTermDto dto) {
        PaymentTerm paymentTerm = new PaymentTerm();

        if (dto.getId() != null) {
            paymentTerm.setId(dto.getId());
        }

        paymentTerm.setAmount(dto.getAmount());
        paymentTerm.setDueDate(dto.getDueDate());
        paymentTerm.setStatus(dto.getStatus() != null ? dto.getStatus() : "PENDING");
        paymentTerm.setPaidDate(dto.getPaidDate());
        paymentTerm.setDescription(dto.getDescription());

        Invoice invoice = invoiceRepository.findById(dto.getInvoiceId())
                .orElseThrow(() -> new ResourceNotFoundException("Invoice", "id", dto.getInvoiceId()));
        paymentTerm.setInvoice(invoice);

        return paymentTerm;
    }
}