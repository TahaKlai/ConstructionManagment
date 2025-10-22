package com.example.constructionmanagmentbackend.service;

import com.example.constructionmanagmentbackend.dto.SupplierDto;
import com.example.constructionmanagmentbackend.entity.Supplier;
import com.example.constructionmanagmentbackend.exception.ResourceNotFoundException;
import com.example.constructionmanagmentbackend.repository.SupplierRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class SupplierService {

    @Autowired
    private SupplierRepository supplierRepository;

    public List<SupplierDto> getAllSuppliers() {
        return supplierRepository.findAll().stream()
                .map(SupplierDto::fromEntity)
                .collect(Collectors.toList());
    }

    public SupplierDto getSupplierById(Long id) {
        Supplier supplier = supplierRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Supplier", "id", id));
        return convertToDto(supplier);
    }

    @Transactional
    public SupplierDto createSupplier(SupplierDto supplierDto) {
        Supplier supplier = convertToEntity(supplierDto);
        supplier = supplierRepository.save(supplier);
        return convertToDto(supplier);
    }

    @Transactional
    public SupplierDto updateSupplier(Long id, SupplierDto supplierDto) {
        Supplier existingSupplier = supplierRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Supplier", "id", id));

        // Update fields
        existingSupplier.setName(supplierDto.getName());
        existingSupplier.setContactPerson(supplierDto.getContactPerson());
        existingSupplier.setEmail(supplierDto.getEmail());
        existingSupplier.setPhone(supplierDto.getPhone());
        existingSupplier.setAddress(supplierDto.getAddress());
        existingSupplier.setTaxId(supplierDto.getTaxId());
        existingSupplier.setCategory(supplierDto.getCategory());

        existingSupplier = supplierRepository.save(existingSupplier);
        return convertToDto(existingSupplier);
    }

    @Transactional
    public void deleteSupplier(Long id) {
        if (!supplierRepository.existsById(id)) {
            throw new ResourceNotFoundException("Supplier", "id", id);
        }
        supplierRepository.deleteById(id);
    }

    private SupplierDto convertToDto(Supplier supplier) {
        return SupplierDto.fromEntity(supplier);
    }

    private Supplier convertToEntity(SupplierDto dto) {
        Supplier supplier = new Supplier();

        if (dto.getId() != null) {
            supplier.setId(dto.getId());
        }

        supplier.setName(dto.getName());
        supplier.setContactPerson(dto.getContactPerson());
        supplier.setEmail(dto.getEmail());
        supplier.setPhone(dto.getPhone());
        supplier.setAddress(dto.getAddress());
        supplier.setTaxId(dto.getTaxId());
        supplier.setCategory(dto.getCategory());

        // Initialize invoices list (will be handled by entity constructor)
        // No need to set invoices as it's @JsonIgnore

        return supplier;
    }
}