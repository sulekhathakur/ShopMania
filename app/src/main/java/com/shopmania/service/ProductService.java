package com.shopmania.service;

import com.shopmania.entity.ProductEntity;
import com.shopmania.repository.ProductRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class ProductService {

    private final ProductRepository repo;

    public ProductService(ProductRepository repo) {
        this.repo = repo;
    }

    public List<ProductEntity> getAll() {
        return repo.findAll();
    }

    public List<ProductEntity> search(String q) {
        return repo.findByNameContainingIgnoreCase(q);
    }

    public List<ProductEntity> byCategory(String category) {
        return repo.findByCategory(category);
    }

    // Admin update helper
    public ProductEntity updateProduct(Long id, ProductEntity updatedProduct) {
        ProductEntity existing = repo.findById(id)
                .orElseThrow(() -> new RuntimeException("Product not found: " + id));

        existing.setName(updatedProduct.getName());
        existing.setCategory(updatedProduct.getCategory());

        existing.setMeesho_price(updatedProduct.getMeesho_price());
        existing.setMeesho_link(updatedProduct.getMeesho_link());
        existing.setMeesho_image(updatedProduct.getMeesho_image());

        existing.setMyntra_price(updatedProduct.getMyntra_price());
        existing.setMyntra_link(updatedProduct.getMyntra_link());
        existing.setMyntra_image(updatedProduct.getMyntra_image());

        existing.setShopsy_price(updatedProduct.getShopsy_price());
        existing.setShopsy_link(updatedProduct.getShopsy_link());
        existing.setShopsy_image(updatedProduct.getShopsy_image());

        existing.setLastUpdated(LocalDateTime.now());

        return repo.save(existing);
    }
}
