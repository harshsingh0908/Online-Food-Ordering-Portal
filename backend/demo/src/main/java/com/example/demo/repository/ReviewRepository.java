package com.example.demo.repository;

import com.example.demo.model.Review;
import com.example.demo.model.MenuItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;

public interface ReviewRepository extends JpaRepository<Review, Long> {
    List<Review> findByMenuItemId(Long menuItemId);

    @Query("SELECT AVG(r.rating) FROM Review r WHERE r.menuItem.id = :menuItemId")
    Double findAverageRatingByMenuItemId(@Param("menuItemId") Long menuItemId);

    @Query("SELECT COUNT(r) FROM Review r WHERE r.menuItem.id = :menuItemId")
    Long countByMenuItemId(@Param("menuItemId") Long menuItemId);
}
