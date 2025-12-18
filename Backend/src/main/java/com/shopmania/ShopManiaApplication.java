package com.shopmania;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication(scanBasePackages = "com.shopmania")
public class ShopManiaApplication {
    public static void main(String[] args) {
        SpringApplication.run(ShopManiaApplication.class, args);
    }
}
