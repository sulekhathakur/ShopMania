package com.shopmania.controller;

import com.shopmania.entity.ProductEntity;
import com.shopmania.service.ProductService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*")
public class ProductController {

    private final ProductService service;

    public ProductController(ProductService service) {
        this.service = service;
    }

    // Frontend uses this
    @GetMapping("/products")
    public List<ProductEntity> getAllProducts() {
        return service.getAll();
    }

    // Optional: search endpoint (if you want backend search)
    @GetMapping("/products/search")
    public List<ProductEntity> search(@RequestParam("q") String q) {
        return service.search(q);
    }

    // Optional: category endpoint
    @GetMapping("/products/category/{category}")
    public List<ProductEntity> byCategory(@PathVariable String category) {
        return service.byCategory(category);
    }
}
