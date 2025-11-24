package com.shopmania;

public class Product {
    private String name;
    private double price;
    private String platform;

    // Needed by Gson
    public Product() {
    }

    public Product(String name, double price, String platform) {
        this.name = name;
        this.price = price;
        this.platform = platform;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public double getPrice() {
        return price;
    }

    public void setPrice(double price) {
        this.price = price;
    }

    public String getPlatform() {
        return platform;
    }

    public void setPlatform(String platform) {
        this.platform = platform;
    }

    @Override
    public String toString() {
        return "Product{name='" + name + "', price=" + price + ", platform='" + platform + "'}";
    }
}

// package com.shopmania;

// public class Product {
// private String name;

// // Needed by Gson
// public Product() {
// }

// public Product(String name) {
// this.name = name;
// }

// public String getName() {
// return name;
// }

// public void setName(String name) {
// this.name = name;
// }
// }
