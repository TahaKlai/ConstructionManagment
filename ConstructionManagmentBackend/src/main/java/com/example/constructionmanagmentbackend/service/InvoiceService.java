package com.example.constructionmanagmentbackend.service;

import com.example.constructionmanagmentbackend.dto.InvoiceDto;
import com.example.constructionmanagmentbackend.entity.BudgetLine;
import com.example.constructionmanagmentbackend.entity.Invoice;
import com.example.constructionmanagmentbackend.entity.Supplier;
import com.example.constructionmanagmentbackend.exception.ResourceNotFoundException;
import com.example.constructionmanagmentbackend.repository.BudgetLineRepository;
import com.example.constructionmanagmentbackend.repository.InvoiceRepository;
import com.example.constructionmanagmentbackend.repository.SupplierRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class InvoiceService {

    @Autowired
    private InvoiceRepository invoiceRepository;

    @Autowired
    private BudgetLineRepository budgetLineRepository;

    @Autowired
    private SupplierRepository supplierRepository;

    public List<InvoiceDto> getAllInvoices() {
        return invoiceRepository.findAll().stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    public InvoiceDto getInvoiceById(Long id) {
        Invoice invoice = invoiceRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Invoice", "id", id));
        return convertToDto(invoice);
    }

    public List<InvoiceDto> getInvoicesByBudgetLineId(Long budgetLineId) {
        return invoiceRepository.findByBudgetLineId(budgetLineId).stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    public List<InvoiceDto> getInvoicesBySupplierId(Long supplierId) {
        return invoiceRepository.findBySupplierId(supplierId).stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    @Transactional
    public InvoiceDto createInvoice(InvoiceDto invoiceDto) {
        Invoice invoice = convertToEntity(invoiceDto);

        // Update the budget line spent amount when invoice is created
        BudgetLine budgetLine = invoice.getBudgetLine();
        budgetLine.setSpentAmount(budgetLine.getSpentAmount() + invoice.getAmount());

        // Update budget line status if necessary
        updateBudgetLineStatus(budgetLine);

        // Save the invoice
        invoice = invoiceRepository.save(invoice);

        return convertToDto(invoice);
    }

    @Transactional
    public InvoiceDto updateInvoice(Long id, InvoiceDto invoiceDto) {
        Invoice existingInvoice = invoiceRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Invoice", "id", id));

        // Store the old amount for budget line adjustment
        Double oldAmount = existingInvoice.getAmount();

        // Update invoice fields
        existingInvoice.setInvoiceNumber(invoiceDto.getInvoiceNumber());
        existingInvoice.setInvoiceDate(invoiceDto.getInvoiceDate());
        existingInvoice.setAmount(invoiceDto.getAmount());
        existingInvoice.setDescription(invoiceDto.getDescription());
        existingInvoice.setStatus(invoiceDto.getStatus());
        existingInvoice.setDueDate(invoiceDto.getDueDate());

        // Set paid date if status is changed to PAID
        if ("PAID".equals(invoiceDto.getStatus()) && existingInvoice.getPaidDate() == null) {
            existingInvoice.setPaidDate(LocalDateTime.now());
        } else if (!"PAID".equals(invoiceDto.getStatus())) {
            existingInvoice.setPaidDate(null);
        }

        // Update supplier and budget line if needed
        if (!existingInvoice.getSupplier().getId().equals(invoiceDto.getSupplierId())) {
            Supplier supplier = supplierRepository.findById(invoiceDto.getSupplierId())
                    .orElseThrow(() -> new ResourceNotFoundException("Supplier", "id", invoiceDto.getSupplierId()));
            existingInvoice.setSupplier(supplier);
        }

        BudgetLine budgetLine;
        if (!existingInvoice.getBudgetLine().getId().equals(invoiceDto.getBudgetLineId())) {
            // Adjustment for old budget line
            BudgetLine oldBudgetLine = existingInvoice.getBudgetLine();
            oldBudgetLine.setSpentAmount(oldBudgetLine.getSpentAmount() - oldAmount);
            updateBudgetLineStatus(oldBudgetLine);

            // Set new budget line
            budgetLine = budgetLineRepository.findById(invoiceDto.getBudgetLineId())
                    .orElseThrow(() -> new ResourceNotFoundException("BudgetLine", "id", invoiceDto.getBudgetLineId()));
            existingInvoice.setBudgetLine(budgetLine);
        } else {
            budgetLine = existingInvoice.getBudgetLine();
            // Adjust budget line spent amount
            budgetLine.setSpentAmount(budgetLine.getSpentAmount() - oldAmount + invoiceDto.getAmount());
        }

        // Update budget line status
        updateBudgetLineStatus(budgetLine);

        // Save the updated invoice
        existingInvoice = invoiceRepository.save(existingInvoice);
        return convertToDto(existingInvoice);
    }

    @Transactional
    public void deleteInvoice(Long id) {
        Invoice invoice = invoiceRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Invoice", "id", id));

        // Adjust budget line spent amount
        BudgetLine budgetLine = invoice.getBudgetLine();
        budgetLine.setSpentAmount(budgetLine.getSpentAmount() - invoice.getAmount());
        updateBudgetLineStatus(budgetLine);

        invoiceRepository.deleteById(id);
    }

    // Helper method to update budget line status based on spent amount
    private void updateBudgetLineStatus(BudgetLine budgetLine) {
        if (budgetLine.getSpentAmount() >= budgetLine.getEstimatedAmount()) {
            budgetLine.setStatus("EXCEEDED");
        } else if (budgetLine.getSpentAmount() > 0) {
            budgetLine.setStatus("IN_PROGRESS");
        } else {
            budgetLine.setStatus("PLANNED");
        }
        budgetLineRepository.save(budgetLine);
    }

    private InvoiceDto convertToDto(Invoice invoice) {
        InvoiceDto dto = new InvoiceDto();
        dto.setId(invoice.getId());
        dto.setInvoiceNumber(invoice.getInvoiceNumber());
        dto.setInvoiceDate(invoice.getInvoiceDate());
        dto.setAmount(invoice.getAmount());
        dto.setDescription(invoice.getDescription());
        dto.setStatus(invoice.getStatus());
        dto.setDueDate(invoice.getDueDate());
        dto.setPaidDate(invoice.getPaidDate());
        dto.setSupplierId(invoice.getSupplier().getId());
        dto.setBudgetLineId(invoice.getBudgetLine().getId());
        dto.setCreatedAt(invoice.getCreatedAt());
        dto.setUpdatedAt(invoice.getUpdatedAt());
        return dto;
    }

    private Invoice convertToEntity(InvoiceDto dto) {
        Invoice invoice = new Invoice();

        if (dto.getId() != null) {
            invoice.setId(dto.getId());
        }

        invoice.setInvoiceNumber(dto.getInvoiceNumber());
        invoice.setInvoiceDate(dto.getInvoiceDate());
        invoice.setAmount(dto.getAmount());
        invoice.setDescription(dto.getDescription());
        invoice.setStatus(dto.getStatus());
        invoice.setDueDate(dto.getDueDate());

        // Set paid date only if status is PAID
        if ("PAID".equals(dto.getStatus())) {
            invoice.setPaidDate(dto.getPaidDate() != null ? dto.getPaidDate() : LocalDateTime.now());
        }

        // Set supplier
        Supplier supplier = supplierRepository.findById(dto.getSupplierId())
                .orElseThrow(() -> new ResourceNotFoundException("Supplier", "id", dto.getSupplierId()));
        invoice.setSupplier(supplier);

        // Set budget line
        BudgetLine budgetLine = budgetLineRepository.findById(dto.getBudgetLineId())
                .orElseThrow(() -> new ResourceNotFoundException("BudgetLine", "id", dto.getBudgetLineId()));
        invoice.setBudgetLine(budgetLine);

        return invoice;
    }
}