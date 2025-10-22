package com.example.constructionmanagmentbackend.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class SupplierDto {
    private Long id;

    @NotBlank(message = "Supplier name is required")
    private String name;

    private String contactPerson;

    @Email(message = "Please provide a valid email address")
    private String email;

    private String phone;
    private String address;
    private String taxId;
    private String category;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    
    public static SupplierDto fromEntity(com.example.constructionmanagmentbackend.entity.Supplier supplier) {
        if (supplier == null) return null;
        
        SupplierDto dto = new SupplierDto();
        dto.setId(supplier.getId());
        dto.setName(supplier.getName());
        dto.setContactPerson(supplier.getContactPerson());
        dto.setEmail(supplier.getEmail());
        dto.setPhone(supplier.getPhone());
        dto.setAddress(supplier.getAddress());
        dto.setTaxId(supplier.getTaxId());
        dto.setCategory(supplier.getCategory());
        dto.setCreatedAt(supplier.getCreatedAt());
        dto.setUpdatedAt(supplier.getUpdatedAt());
        return dto;
    }
}