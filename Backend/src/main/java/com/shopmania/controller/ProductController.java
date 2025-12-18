package com.shopmania.controller;

import com.shopmania.entity.ProductEntity;
import com.shopmania.service.ProductService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/products")
@CrossOrigin(origins = "*")
public class ProductController {

    private final ProductService service;

    public ProductController(ProductService service) {
        this.service = service;
    }

    @GetMapping
    public List<ProductEntity> getAllProducts() {
        return service.getAll();
    }

    @GetMapping("/search")
    public List<ProductEntity> search(@RequestParam String q) {
        return service.search(q);
    }

    @GetMapping("/category/{category}")
    public List<ProductEntity> byCategory(@PathVariable String category) {
        return service.byCategory(category);
    }
}
