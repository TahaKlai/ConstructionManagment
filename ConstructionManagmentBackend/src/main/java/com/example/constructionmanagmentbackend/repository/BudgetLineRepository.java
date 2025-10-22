package com.example.constructionmanagmentbackend.repository;

import com.example.constructionmanagmentbackend.entity.BudgetLine;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BudgetLineRepository extends JpaRepository<BudgetLine, Long> {
    List<BudgetLine> findByProjectId(Long projectId);
}