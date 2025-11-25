package com.shopmania;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
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
        if (repo.count() > 0) {
            System.out.println("✅ Products already loaded. Skipping import.");
            return;
        }

        ObjectMapper mapper = new ObjectMapper();
        ClassPathResource resource = new ClassPathResource("products.json");
        try (InputStream is = resource.getInputStream()) {
            List<Map<String, Object>> products = mapper.readValue(is, new TypeReference<List<Map<String, Object>>>() {});
            for (Map<String, Object> p : products) {
                ProductEntity pe = new ProductEntity();
                pe.setName((String) p.get("name"));
                pe.setCategory((String) p.get("category"));

                Map<String, Object> meesho = (Map<String, Object>) p.get("meesho");
                if (meesho != null) {
                    Number mp = (Number) meesho.get("price");
                    pe.setMeesho_price(mp == null ? null : mp.doubleValue());
                    pe.setMeesho_link((String) meesho.get("link"));
                    pe.setMeesho_image((String) meesho.get("image"));
                }

                Map<String, Object> myntra = (Map<String, Object>) p.get("myntra");
                if (myntra != null) {
                    Number myn = (Number) myntra.get("price");
                    pe.setMyntra_price(myn == null ? null : myn.doubleValue());
                    pe.setMyntra_link((String) myntra.get("link"));
                    pe.setMyntra_image((String) myntra.get("image"));
                }

                Map<String, Object> shopsy = (Map<String, Object>) p.get("shopsy");
                if (shopsy != null) {
                    Number sp = (Number) shopsy.get("price");
                    pe.setShopsy_price(sp == null ? null : sp.doubleValue());
                    pe.setShopsy_link((String) shopsy.get("link"));
                    pe.setShopsy_image((String) shopsy.get("image"));
                }

                repo.save(pe);
            }
            System.out.println("✅ DataLoader: products.json loaded into database. Total: " + products.size());
        } catch (Exception ex) {
            System.err.println("DataLoader: failed to load products.json - " + ex.getMessage());
            throw ex;
        }
    }
}
