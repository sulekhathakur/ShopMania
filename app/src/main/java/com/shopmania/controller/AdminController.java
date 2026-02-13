package com.shopmania.controller;

import com.shopmania.entity.ProductEntity;
import com.shopmania.repository.ProductRepository;
import com.shopmania.service.ProductService;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/admin")
@CrossOrigin(origins = "*")
public class AdminController {

    private final ProductRepository repo;
    private final ProductService service;

    @Value("${shopmania.admin.key}")
    private String adminKey;

    public AdminController(ProductRepository repo, ProductService service) {
        this.repo = repo;
        this.service = service;
    }

    private void checkKey(String key) {
        if (key == null || !key.equals(adminKey)) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid admin key");
        }
    }

    @GetMapping("/products")
    public List<ProductEntity> adminGetAll(@RequestHeader(value = "X-ADMIN-KEY", required = false) String key) {
        checkKey(key);
        return repo.findAll();
    }

    @PostMapping("/products")
    public ProductEntity addProduct(
            @RequestHeader(value = "X-ADMIN-KEY", required = false) String key,
            @RequestBody ProductEntity p
    ) {
        checkKey(key);
        p.setLastUpdated(LocalDateTime.now());
        return repo.save(p);
    }

    @PutMapping("/products/{id}")
    public ProductEntity updateProduct(
            @RequestHeader(value = "X-ADMIN-KEY", required = false) String key,
            @PathVariable Long id,
            @RequestBody ProductEntity updated
    ) {
        checkKey(key);
        return service.updateProduct(id, updated);
    }

    @DeleteMapping("/products/{id}")
    public void deleteProduct(
            @RequestHeader(value = "X-ADMIN-KEY", required = false) String key,
            @PathVariable Long id
    ) {
        checkKey(key);
        repo.deleteById(id);
    }
}
