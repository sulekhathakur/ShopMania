package com.shopmania;

import org.springframework.stereotype.Service;
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
}
