package com.shopmania;

import com.google.gson.Gson;
import com.google.gson.reflect.TypeToken;

import java.io.FileReader;
import java.lang.reflect.Type;
import java.util.List;

public class ProductParser {
    public static List<Product> parse(String filePath) {
        try (FileReader reader = new FileReader(filePath)) {
            Gson gson = new Gson();
            Type productListType = new TypeToken<List<Product>>() {
            }.getType();
            return gson.fromJson(reader, productListType);
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }
}
