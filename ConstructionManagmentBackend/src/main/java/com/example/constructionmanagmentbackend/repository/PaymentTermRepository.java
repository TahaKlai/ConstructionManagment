package com.example.constructionmanagmentbackend.repository;

import com.example.constructionmanagmentbackend.entity.PaymentTerm;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PaymentTermRepository extends JpaRepository<PaymentTerm, Long> {
    List<PaymentTerm> findByInvoiceId(Long invoiceId);
}