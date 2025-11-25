package com.shopmania;

import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/products")
public class ProductController {

    private final ProductService service;

    public ProductController(ProductService service) {
        this.service = service;
    }

    @GetMapping
    public List<ProductEntity> all(
            @RequestParam(required = false) String q,
            @RequestParam(required = false) String category) {

        if (q != null && !q.isEmpty()) return service.search(q);
        if (category != null && !category.isEmpty()) return service.byCategory(category);

        return service.getAll();
    }
}
