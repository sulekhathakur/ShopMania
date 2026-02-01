package com.shopmania.repository;

import com.shopmania.entity.ProductEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProductRepository extends JpaRepository<ProductEntity, Long> {

    List<ProductEntity> findByNameContainingIgnoreCase(String name);

    List<ProductEntity> findByCategory(String category);
}
