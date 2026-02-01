document.addEventListener("DOMContentLoaded", () => {
  fetchProducts();
});

const API_URL = "http://localhost:8080/api/products";
const PLACEHOLDER = "assets/placeholder.png";

function safeImg(src) {
  return src && src.length ? src : PLACEHOLDER;
}

function fetchProducts() {
  fetch(API_URL)
    .then(res => {
      if (!res.ok) throw new Error("API not reachable");
      return res.json();
    })
    .then(data => renderProducts(data))
    .catch(err => {
      console.error(err);
      document.getElementById("products").innerHTML =
        `<p style="grid-column:1/-1;text-align:center;color:#ef4444">
          Backend not reachable. Is Spring Boot running?
        </p>`;
    });
}

function renderProducts(products) {
  const container = document.getElementById("products");
  container.innerHTML = "";

  if (!products || products.length === 0) {
    container.innerHTML =
      `<p style="grid-column:1/-1;text-align:center;color:#94a3b8">
        No products found.
      </p>`;
    return;
  }

  products.forEach(p => {
    const card = document.createElement("article");
    card.className = "product-card";

    const prices = [
      { name: "Meesho", price: p.meesho_price, link: p.meesho_link },
      { name: "Myntra", price: p.myntra_price, link: p.myntra_link },
      { name: "Shopsy", price: p.shopsy_price, link: p.shopsy_link }
    ].filter(x => x.price !== null);

    const best = Math.min(...prices.map(x => x.price));

    card.innerHTML = `
      <h3 class="product-title">${p.name}</h3>
      <p class="category-badge">${p.category || "general"}</p>

      ${prices.map(x => `
        <div class="platform-row ${x.price === best ? "best" : ""}">
          <span>${x.name}</span>
          <strong>₹${x.price}</strong>
          <a href="${x.link}" target="_blank">Buy</a>
        </div>
      `).join("")}
    `;

    container.appendChild(card);
  });
}
