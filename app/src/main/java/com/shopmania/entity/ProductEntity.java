package com.shopmania.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;

@Entity
public class ProductEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    private String name;
    private String category;

    // Combined product-level price if needed
    private double price;

    private String source;

    // Meesho fields
    private Double meesho_price;
    private String meesho_link;
    private String meesho_image;

    // Myntra fields
    private Double myntra_price;
    private String myntra_link;
    private String myntra_image;

    // Shopsy fields
    private Double shopsy_price;
    private String shopsy_link;
    private String shopsy_image;

    public ProductEntity() {
    }

    public ProductEntity(Integer id, String name, String category, double price, String source) {
        this.id = id;
        this.name = name;
        this.category = category;
        this.price = price;
        this.source = source;
    }

    // ------------ Getters & Setters ---------------

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public double getPrice() {
        return price;
    }

    public void setPrice(double price) {
        this.price = price;
    }

    public String getSource() {
        return source;
    }

    public void setSource(String source) {
        this.source = source;
    }

    // Meesho
    public Double getMeesho_price() {
        return meesho_price;
    }

    public void setMeesho_price(Double meesho_price) {
        this.meesho_price = meesho_price;
    }

    public String getMeesho_link() {
        return meesho_link;
    }

    public void setMeesho_link(String meesho_link) {
        this.meesho_link = meesho_link;
    }

    public String getMeesho_image() {
        return meesho_image;
    }

    public void setMeesho_image(String meesho_image) {
        this.meesho_image = meesho_image;
    }

    // Myntra
    public Double getMyntra_price() {
        return myntra_price;
    }

    public void setMyntra_price(Double myntra_price) {
        this.myntra_price = myntra_price;
    }

    public String getMyntra_link() {
        return myntra_link;
    }

    public void setMyntra_link(String myntra_link) {
        this.myntra_link = myntra_link;
    }

    public String getMyntra_image() {
        return myntra_image;
    }

    public void setMyntra_image(String myntra_image) {
        this.myntra_image = myntra_image;
    }

    // Shopsy
    public Double getShopsy_price() {
        return shopsy_price;
    }

    public void setShopsy_price(Double shopsy_price) {
        this.shopsy_price = shopsy_price;
    }

    public String getShopsy_link() {
        return shopsy_link;
    }

    public void setShopsy_link(String shopsy_link) {
        this.shopsy_link = shopsy_link;
    }

    public String getShopsy_image() {
        return shopsy_image;
    }

    public void setShopsy_image(String shopsy_image) {
        this.shopsy_image = shopsy_image;
    }
}
