package com.example.demo.repository;

import com.example.demo.model.MenuItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

// Repository for MenuItem entity
@Repository
public interface MenuItemRepository extends JpaRepository<MenuItem, Long> {
    java.util.Optional<MenuItem> findBySlug(String slug);
}
