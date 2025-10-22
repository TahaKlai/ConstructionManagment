package com.example.constructionmanagmentbackend.repository;

import com.example.constructionmanagmentbackend.entity.Invoice;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface InvoiceRepository extends JpaRepository<Invoice, Long> {
    List<Invoice> findByBudgetLineId(Long budgetLineId);
    List<Invoice> findBySupplierId(Long supplierId);
}