package com.shopmania.config;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.shopmania.entity.ProductEntity;
import com.shopmania.repository.ProductRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Component;

import java.io.InputStream;
import java.util.List;
import java.util.Map;

@Component
public class DataLoader implements CommandLineRunner {

    private final ProductRepository repo;

    public DataLoader(ProductRepository repo) {
        this.repo = repo;
    }

    @Override
    public void run(String... args) throws Exception {

        // Prevent duplicate inserts on restart
        if (repo.count() > 0) {
            System.out.println("✅ Products already loaded. Skipping import.");
            return;
        }

        ObjectMapper mapper = new ObjectMapper();
        ClassPathResource resource = new ClassPathResource("products.json");

        try (InputStream is = resource.getInputStream()) {

            List<Map<String, Object>> products = mapper.readValue(is, new TypeReference<List<Map<String, Object>>>() {
            });

            for (Map<String, Object> p : products) {

                ProductEntity pe = new ProductEntity();
                pe.setName((String) p.get("name"));
                pe.setCategory((String) p.get("category"));

                // Meesho
                Map<String, Object> meesho = (Map<String, Object>) p.get("meesho");
                if (meesho != null) {
                    Number price = (Number) meesho.get("price");
                    pe.setMeesho_price(price == null ? null : price.doubleValue());
                    pe.setMeesho_link((String) meesho.get("link"));
                    pe.setMeesho_image((String) meesho.get("image"));
                }

                // Myntra
                Map<String, Object> myntra = (Map<String, Object>) p.get("myntra");
                if (myntra != null) {
                    Number price = (Number) myntra.get("price");
                    pe.setMyntra_price(price == null ? null : price.doubleValue());
                    pe.setMyntra_link((String) myntra.get("link"));
                    pe.setMyntra_image((String) myntra.get("image"));
                }

                // Shopsy
                Map<String, Object> shopsy = (Map<String, Object>) p.get("shopsy");
                if (shopsy != null) {
                    Number price = (Number) shopsy.get("price");
                    pe.setShopsy_price(price == null ? null : price.doubleValue());
                    pe.setShopsy_link((String) shopsy.get("link"));
                    pe.setShopsy_image((String) shopsy.get("image"));
                }

                repo.save(pe);
            }

            System.out.println("✅ DataLoader: products.json loaded into database. Total: " + products.size());

        } catch (Exception e) {
            System.err.println("❌ DataLoader failed: " + e.getMessage());
            throw e;
        }
    }
}
