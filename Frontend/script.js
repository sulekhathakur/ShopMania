document.addEventListener("DOMContentLoaded", () => {
    fetchProducts();
});

function fetchProducts() {
    fetch("http://localhost:8080/api/products")
        .then(response => {
            if (!response.ok) {
                throw new Error("Failed to fetch products");
            }
            return response.json();
        })
        .then(products => {
            displayProducts(products);
        })
        .catch(error => {
            console.error("Error:", error);
        });
}

function displayProducts(products) {
    const container = document.getElementById("product-list");

    container.innerHTML = "";

    products.forEach(product => {
        const card = document.createElement("div");
        card.className = "product-card";

        card.innerHTML = `
            <h3>${product.name}</h3>
            <p><strong>Price:</strong> ₹${product.price}</p>
            <p><strong>Platform:</strong> ${product.platform}</p>
        `;

        container.appendChild(card);
    });
}
