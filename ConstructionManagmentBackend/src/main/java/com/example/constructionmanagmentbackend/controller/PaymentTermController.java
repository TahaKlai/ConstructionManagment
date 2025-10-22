package com.example.constructionmanagmentbackend.controller;

import com.example.constructionmanagmentbackend.dto.PaymentTermDto;
import com.example.constructionmanagmentbackend.service.PaymentTermService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/paymentterms")
public class PaymentTermController {

    @Autowired
    private PaymentTermService paymentTermService;

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<PaymentTermDto>> getAllPaymentTerms() {
        return ResponseEntity.ok(paymentTermService.getAllPaymentTerms());
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'USER')")
    public ResponseEntity<PaymentTermDto> getPaymentTermById(@PathVariable Long id) {
        return ResponseEntity.ok(paymentTermService.getPaymentTermById(id));
    }

    @GetMapping("/invoice/{invoiceId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'USER')")
    public ResponseEntity<List<PaymentTermDto>> getPaymentTermsByInvoiceId(@PathVariable Long invoiceId) {
        return ResponseEntity.ok(paymentTermService.getPaymentTermsByInvoiceId(invoiceId));
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<PaymentTermDto> createPaymentTerm(@Valid @RequestBody PaymentTermDto paymentTermDto) {
        return new ResponseEntity<>(paymentTermService.createPaymentTerm(paymentTermDto), HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<PaymentTermDto> updatePaymentTerm(
            @PathVariable Long id,
            @Valid @RequestBody PaymentTermDto paymentTermDto) {
        return ResponseEntity.ok(paymentTermService.updatePaymentTerm(id, paymentTermDto));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deletePaymentTerm(@PathVariable Long id) {
        paymentTermService.deletePaymentTerm(id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/{id}/process-payment")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<PaymentTermDto> processPayment(@PathVariable Long id) {
        return ResponseEntity.ok(paymentTermService.processPayment(id));
    }
}