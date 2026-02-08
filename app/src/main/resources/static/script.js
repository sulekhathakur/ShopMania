document.addEventListener("DOMContentLoaded", () => {
  fetchProducts();

  document.getElementById("heroSearchBar").addEventListener("input", applyFilters);
  document.getElementById("sortDropdown").addEventListener("change", applyFilters);
  document.getElementById("categoryDropdown").addEventListener("change", applyFilters);
  document.getElementById("platformDropdown").addEventListener("change", applyFilters);
});

const API_URL = "http://localhost:8080/api/products";
const FALLBACK_IMG = "assets/placeholder.png";
let ALL_PRODUCTS = [];

function fetchProducts() {
  fetch(API_URL)
    .then(res => res.json())
    .then(data => {
      ALL_PRODUCTS = data;
      applyFilters();
    })
    .catch(() => {
      document.getElementById("products").innerHTML =
        `<p style="grid-column:1/-1;text-align:center;color:red">
          Backend not running
        </p>`;
    });
}

function applyFilters() {
  const search = document.getElementById("heroSearchBar").value.toLowerCase();
  const category = document.getElementById("categoryDropdown").value;
  const platform = document.getElementById("platformDropdown").value;
  const sort = document.getElementById("sortDropdown").value;

  let filtered = [...ALL_PRODUCTS];

  if (search) {
    filtered = filtered.filter(p =>
      p.name.toLowerCase().includes(search)
    );
  }

  if (category !== "all") {
    filtered = filtered.filter(p => p.category === category);
  }

  if (platform !== "all") {
    filtered = filtered.filter(p => p[`${platform}_price`] !== null);
  }

  if (sort === "name") {
    filtered.sort((a, b) => a.name.localeCompare(b.name));
  }

  if (sort === "price-low" || sort === "price-high") {
    filtered.sort((a, b) => {
      const minA = Math.min(a.meesho_price ?? Infinity, a.myntra_price ?? Infinity, a.shopsy_price ?? Infinity);
      const minB = Math.min(b.meesho_price ?? Infinity, b.myntra_price ?? Infinity, b.shopsy_price ?? Infinity);
      return sort === "price-low" ? minA - minB : minB - minA;
    });
  }

  renderProducts(filtered);
}

function renderProducts(products) {
  const container = document.getElementById("products");
  container.innerHTML = "";

  if (!products.length) {
    container.innerHTML =
      `<p style="grid-column:1/-1;text-align:center;color:#94a3b8">
        No products found.
      </p>`;
    return;
  }

  products.forEach(p => {
    const platforms = [
      {
        name: "Meesho",
        price: p.meesho_price,
        link: p.meesho_link,
        img: p.meesho_image
      },
      {
        name: "Myntra",
        price: p.myntra_price,
        link: p.myntra_link,
        img: p.myntra_image
      },
      {
        name: "Shopsy",
        price: p.shopsy_price,
        link: p.shopsy_link,
        img: p.shopsy_image
      }
    ].filter(x => x.price !== null);

    const best = Math.min(...platforms.map(x => x.price));

    const card = document.createElement("article");
    card.className = "product-card";

    card.innerHTML = `
      <div class="product-header">
        <h3 class="product-title">${p.name}</h3>
        <span class="category-badge">${p.category}</span>
      </div>

      ${platforms.map(x => `
        <div class="platform-row ${x.name.toLowerCase()}-row ${x.price === best ? "best" : ""}">
          <div class="platform-info">
            <img 
              src="${x.img || FALLBACK_IMG}" 
              class="platform-logo"
              onerror="this.src='${FALLBACK_IMG}'"
            />
            <span class="platform-name">${x.name}</span>
          </div>

          <div class="platform-price">₹${x.price}</div>

          <a class="buy-btn" href="${x.link}" target="_blank">Buy</a>

          ${x.price === best ? `<span class="best-badge">BEST</span>` : ""}
        </div>
      `).join("")}
    `;

    container.appendChild(card);
  });
}
