package com.shopmania.utils;

import com.google.gson.Gson;
import com.google.gson.reflect.TypeToken;
import java.io.FileReader;
import java.io.IOException;
import java.lang.reflect.Type;
import java.util.List;

import com.shopmania.Product;

public class JSONReader {

    public static List<Product> readProducts(String filePath) {
        Gson gson = new Gson();
        try (FileReader reader = new FileReader(filePath)) {
            Type productListType = new TypeToken<List<Product>>() {
            }.getType();
            return gson.fromJson(reader, productListType);
        } catch (IOException e) {
            e.printStackTrace();
            return List.of();
        }
    }
}

// package com.shopmania.utils;

// import java.io.FileReader;
// import java.io.IOException;
// import java.nio.file.Paths;
// import java.util.List;

// import com.google.gson.Gson;
// import com.google.gson.reflect.TypeToken;

// /**
// * JSONReader is responsible for reading product data
// * from the products.json file and returning it as a list of Product objects.
// */
// public class JSONReader {

// // Path to your JSON file (adjust if needed)
// private static final String JSON_FILE_PATH = Paths
// .get("E:/Java Projects/ShopMania/Frontend/products.json").toString();

// /**
// * Reads the products.json file and parses it into a list of Product objects.
// *
// * @return List of Product objects
// */
// public static List<Product> readProducts() {
// try (FileReader reader = new FileReader(JSON_FILE_PATH)) {
// Gson gson = new Gson();
// return gson.fromJson(reader, new TypeToken<List<Product>>() {
// }.getType());
// } catch (IOException e) {
// e.printStackTrace();
// return List.of(); // return empty list on failure
// }
// }
// }
