package com.shopmania;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ProductRepository extends JpaRepository<ProductEntity, Integer> {
    List<ProductEntity> findByNameContainingIgnoreCase(String q);
    List<ProductEntity> findByCategory(String category);
}
