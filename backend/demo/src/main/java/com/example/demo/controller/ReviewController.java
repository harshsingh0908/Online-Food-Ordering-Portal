package com.example.demo.controller;

import com.example.demo.model.MenuItem;
import com.example.demo.model.Review;
import com.example.demo.model.User;
import com.example.demo.repository.MenuItemRepository;
import com.example.demo.repository.ReviewRepository;
import com.example.demo.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/reviews")
public class ReviewController {
    @Autowired
    private ReviewRepository reviewRepository;
    @Autowired
    private MenuItemRepository menuItemRepository;
    @Autowired
    private UserRepository userRepository;

    @GetMapping("/menu-item/{menuItemId}")
    public List<Review> getReviewsByMenuItem(@PathVariable Long menuItemId) {
        return reviewRepository.findByMenuItemId(menuItemId);
    }

    @GetMapping("/menu-item/{menuItemId}/summary")
    public Map<String, Object> getReviewSummary(@PathVariable Long menuItemId) {
        Double avg = reviewRepository.findAverageRatingByMenuItemId(menuItemId);
        Long count = reviewRepository.countByMenuItemId(menuItemId);
        Map<String, Object> summary = new HashMap<>();
        summary.put("average", avg != null ? avg : 0.0);
        summary.put("count", count);
        return summary;
    }

    @PostMapping
    public ResponseEntity<?> addReview(@RequestBody Map<String, Object> payload) {
        Long menuItemId = Long.valueOf(payload.get("menuItemId").toString());
        Long userId = Long.valueOf(payload.get("userId").toString());
        int rating = Integer.parseInt(payload.get("rating").toString());
        String comment = payload.get("comment").toString();

        Optional<MenuItem> menuItemOpt = menuItemRepository.findById(menuItemId);
        Optional<User> userOpt = userRepository.findById(userId);
        if (!menuItemOpt.isPresent() || !userOpt.isPresent()) {
            return ResponseEntity.badRequest().body("Invalid menu item or user");
        }
        Review review = new Review();
        review.setMenuItem(menuItemOpt.get());
        review.setUser(userOpt.get());
        review.setRating(rating);
        review.setComment(comment);
        reviewRepository.save(review);
        return ResponseEntity.ok(review);
    }
}
