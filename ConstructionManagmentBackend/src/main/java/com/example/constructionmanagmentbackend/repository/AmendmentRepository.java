package com.example.constructionmanagmentbackend.repository;

import com.example.constructionmanagmentbackend.entity.Amendment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AmendmentRepository extends JpaRepository<Amendment, Long> {
    List<Amendment> findByProjectId(Long projectId);
}