package com.example.constructionmanagmentbackend.controller;

import com.example.constructionmanagmentbackend.dto.SupplierDto;
import com.example.constructionmanagmentbackend.entity.Supplier;
import com.example.constructionmanagmentbackend.repository.SupplierRepository;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/suppliers")
@Tag(name = "Supplier", description = "Supplier management APIs")
public class SupplierController {

    @Autowired
    private SupplierRepository supplierRepository;

    @GetMapping
    @Operation(summary = "Get all suppliers", description = "Retrieves a list of all suppliers")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Successfully retrieved suppliers"),
            @ApiResponse(responseCode = "403", description = "Access forbidden")
    })
    public ResponseEntity<List<SupplierDto>> getAllSuppliers() {
        try {
            List<Supplier> suppliers = supplierRepository.findAll();
            List<SupplierDto> supplierDtos = suppliers.stream()
                .map(supplier -> {
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
                })
                .collect(Collectors.toList());
            return ResponseEntity.ok(supplierDtos);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping("/test")
    public ResponseEntity<String> testEndpoint() {
        return ResponseEntity.ok("{\"message\":\"Suppliers endpoint is working\",\"count\":" + supplierRepository.count() + "}");
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get supplier by ID", description = "Retrieves a specific supplier by its ID")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Successfully retrieved the supplier"),
            @ApiResponse(responseCode = "404", description = "Supplier not found"),
            @ApiResponse(responseCode = "403", description = "Access forbidden")
    })
    public ResponseEntity<Supplier> getSupplierById(@PathVariable Long id) {
        Optional<Supplier> supplier = supplierRepository.findById(id);
        return supplier.map(value -> new ResponseEntity<>(value, HttpStatus.OK))
                .orElseGet(() -> new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    @PostMapping
    @Operation(summary = "Create supplier", description = "Creates a new supplier")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "201", description = "Supplier created successfully"),
            @ApiResponse(responseCode = "400", description = "Invalid input"),
            @ApiResponse(responseCode = "403", description = "Access forbidden")
    })
    public ResponseEntity<Supplier> createSupplier(@RequestBody Supplier supplier) {
        Supplier savedSupplier = supplierRepository.save(supplier);
        return new ResponseEntity<>(savedSupplier, HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update supplier", description = "Updates an existing supplier")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Supplier updated successfully"),
            @ApiResponse(responseCode = "404", description = "Supplier not found"),
            @ApiResponse(responseCode = "400", description = "Invalid input"),
            @ApiResponse(responseCode = "403", description = "Access forbidden")
    })
    public ResponseEntity<Supplier> updateSupplier(@PathVariable Long id, @RequestBody Supplier supplierDetails) {
        Optional<Supplier> supplierData = supplierRepository.findById(id);

        if (supplierData.isPresent()) {
            Supplier existingSupplier = supplierData.get();
            existingSupplier.setName(supplierDetails.getName());
            existingSupplier.setContactPerson(supplierDetails.getContactPerson());
            existingSupplier.setEmail(supplierDetails.getEmail());
            existingSupplier.setPhone(supplierDetails.getPhone());
            existingSupplier.setAddress(supplierDetails.getAddress());
            existingSupplier.setTaxId(supplierDetails.getTaxId());
            existingSupplier.setCategory(supplierDetails.getCategory());

            return new ResponseEntity<>(supplierRepository.save(existingSupplier), HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete supplier", description = "Deletes a supplier by ID")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "204", description = "Supplier deleted successfully"),
            @ApiResponse(responseCode = "404", description = "Supplier not found"),
            @ApiResponse(responseCode = "403", description = "Access forbidden")
    })
    public ResponseEntity<HttpStatus> deleteSupplier(@PathVariable Long id) {
        try {
            Optional<Supplier> supplier = supplierRepository.findById(id);
            if (supplier.isPresent()) {
                supplierRepository.deleteById(id);
                return new ResponseEntity<>(HttpStatus.NO_CONTENT);
            } else {
                return new ResponseEntity<>(HttpStatus.NOT_FOUND);
            }
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}