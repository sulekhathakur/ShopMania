package com.shopmania;

import static spark.Spark.*;

import java.nio.file.Files;
import java.nio.file.Paths;

public class Main {
    public static void main(String[] args) {
        port(4567);

        // ✅ Serve static files from Frontend folder
        externalStaticFileLocation("E:/Java Projects/ShopMania/Frontend");

        // ✅ Default route -> open index.html
        get("/", (req, res) -> {
            res.redirect("/index.html");
            return null;
        });

        // ✅ Serve products.json API
        get("/products", (req, res) -> {
            res.type("application/json");
            return new String(Files.readAllBytes(
                    Paths.get("E:/Java Projects/ShopMania/Frontend/products.json")));
        });
    }
}



// package com.shopmania;

// import static spark.Spark.*;

// import java.nio.file.Files;
// import java.nio.file.Paths;

// public class Main {
//     public static void main(String[] args) {
//         port(4567);

//         // ✅ Serve static files from Frontend (which is outside Backend)
//         externalStaticFileLocation("E:/Java Projects/ShopMania/Frontend");

//         // ✅ Serve index.html by default when accessing "/"
//         get("/", (req, res) -> {
//             res.redirect("/index.html");
//             return null;
//         });

//         // ✅ API endpoint to serve products.json
//         get("/products", (req, res) -> {
//             res.type("application/json");
//             try {
//                 return new String(Files.readAllBytes(Paths.get("E:/Java Projects/ShopMania/Frontend/products.json")));
//             } catch (Exception e) {
//                 res.status(500);
//                 return "{\"error\":\"Could not read products.json\"}";
//             }
//         });
//     }
// }