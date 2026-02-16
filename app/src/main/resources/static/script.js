// ==============================
// Carousel functionality (AUTO + BUTTONS) - FIXED
// ==============================
document.addEventListener("DOMContentLoaded", () => {
  const track = document.getElementById("carouselTrack");
  const prevBtn = document.getElementById("prevBtn");
  const nextBtn = document.getElementById("nextBtn");
  const wrapper = document.querySelector(".carousel-wrapper");

  if (!track || !prevBtn || !nextBtn || !wrapper) return;

  let index = 0;
  let autoTimer = null;

  const cards = () => Array.from(track.querySelectorAll(".category-card"));

  const goTo = (i) => {
    const c = cards();
    if (!c.length) return;

    index = Math.max(0, Math.min(i, c.length - 1));
    const targetLeft = c[index].offsetLeft;
    const maxTranslate = Math.max(0, track.scrollWidth - wrapper.clientWidth);
    const translateX = Math.min(targetLeft, maxTranslate);

    track.style.transform = `translate3d(${-translateX}px, 0, 0)`;
  };

  const next = () => {
    const c = cards();
    if (!c.length) return;

    if (index >= c.length - 1) goTo(0);
    else goTo(index + 1);
  };

  const prev = () => {
    const c = cards();
    if (!c.length) return;

    if (index <= 0) goTo(c.length - 1);
    else goTo(index - 1);
  };

  const startAuto = () => {
    stopAuto();
    autoTimer = setInterval(next, 2500);
  };

  const stopAuto = () => {
    if (autoTimer) clearInterval(autoTimer);
    autoTimer = null;
  };

  prevBtn.addEventListener("click", () => {
    stopAuto();
    prev();
    startAuto();
  });

  nextBtn.addEventListener("click", () => {
    stopAuto();
    next();
    startAuto();
  });

  const container = document.querySelector(".carousel-container");
  if (container) {
    container.addEventListener("mouseenter", stopAuto);
    container.addEventListener("mouseleave", startAuto);
  }

  window.addEventListener("resize", () => goTo(index));

  goTo(0);
  startAuto();
});


// ==============================
// Products + Filters + Cart Drawer (UNCHANGED)
// ==============================
document.addEventListener("DOMContentLoaded", () => {
  fetchProducts();

  document.getElementById("heroSearchBar").addEventListener("input", applyFilters);
  document.getElementById("sortDropdown").addEventListener("change", applyFilters);
  document.getElementById("categoryDropdown").addEventListener("change", applyFilters);
  document.getElementById("platformDropdown").addEventListener("change", applyFilters);

  // Cart UI
  document.getElementById("cartBtn").addEventListener("click", openCart);
  document.getElementById("cartCloseBtn").addEventListener("click", closeCart);
  document.getElementById("cartBackdrop").addEventListener("click", closeCart);
  document.getElementById("cartClearBtn").addEventListener("click", clearCart);
  document.getElementById("cartCheckoutBtn").addEventListener("click", () => {
    alert("Checkout is demo-only. Add payment gateway later if needed.");
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeCart();
  });

  updateCartBadge();
});

const API_URL = "http://localhost:8080/api/products";
const FALLBACK_IMG = "assets/placeholder.png";
let ALL_PRODUCTS = [];

/* =========================
   PRODUCTS + FILTERS
   ========================= */
function fetchProducts() {
  fetch(API_URL)
    .then(res => res.json())
    .then(data => {
      ALL_PRODUCTS = data || [];
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
    filtered = filtered.filter(p => (p.name || "").toLowerCase().includes(search));
  }

  if (category !== "all") {
    filtered = filtered.filter(p => (p.category || "").toLowerCase() === category.toLowerCase());
  }

  if (platform !== "all") {
    filtered = filtered.filter(p => p[`${platform}_price`] !== null && p[`${platform}_price`] !== undefined);
  }

  if (sort === "name") {
    filtered.sort((a, b) => (a.name || "").localeCompare(b.name || ""));
  }

  if (sort === "price-low" || sort === "price-high") {
    filtered.sort((a, b) => {
      const minA = minPrice(a);
      const minB = minPrice(b);
      return sort === "price-low" ? minA - minB : minB - minA;
    });
  }

  renderProducts(filtered);
}

function minPrice(p) {
  return Math.min(
    p.meesho_price ?? Infinity,
    p.myntra_price ?? Infinity,
    p.shopsy_price ?? Infinity
  );
}

function safeImg(src) {
  if (!src) return FALLBACK_IMG;
  return src.startsWith("/") ? src.slice(1) : src;
}

function formatLastUpdated(lastUpdated) {
  if (!lastUpdated) return null;
  try {
    const d = new Date(lastUpdated);
    if (Number.isNaN(d.getTime())) return null;
    return d.toLocaleString();
  } catch {
    return null;
  }
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
      { key: "meesho", name: "Meesho", price: p.meesho_price, link: p.meesho_link, img: p.meesho_image },
      { key: "myntra", name: "Myntra", price: p.myntra_price, link: p.myntra_link, img: p.myntra_image },
      { key: "shopsy", name: "Shopsy", price: p.shopsy_price, link: p.shopsy_link, img: p.shopsy_image }
    ].filter(x => x.price !== null && x.price !== undefined);

    const best = Math.min(...platforms.map(x => x.price));
    const bestPlatform = platforms.find(x => x.price === best) || platforms[0];
    const last = formatLastUpdated(p.lastUpdated);

    const card = document.createElement("article");
    card.className = "product-card";

    card.innerHTML = `
      <div class="product-header">
        <div>
          <h3 class="product-title">${escapeHtml(p.name)}</h3>
          ${last ? `<div class="updated-date">Last updated: ${escapeHtml(last)}</div>` : ``}
        </div>
        <span class="category-badge">${escapeHtml(p.category || "general")}</span>
      </div>

      ${platforms.map(x => `
        <div class="platform-row ${x.key}-row ${x.price === best ? "best" : ""}">
          <div class="platform-info">
            <img 
              src="${safeImg(x.img)}" 
              class="platform-logo"
              onerror="this.src='${FALLBACK_IMG}'"
              alt="${escapeHtml(x.name)}"
            />
            <span class="platform-name">${escapeHtml(x.name)}</span>
          </div>

          <div class="platform-price">₹${x.price}</div>
          <a class="buy-btn" href="${x.link || "#"}" target="_blank" rel="noreferrer">Buy</a>

          ${x.price === best ? `<span class="best-badge">BEST</span>` : ""}
        </div>
      `).join("")}

      <div class="card-actions">
        <button class="add-cart-btn" type="button">Add to Cart</button>
      </div>
    `;

    card.querySelector(".add-cart-btn").addEventListener("click", () => {
      addToCart({
        id: p.id,
        name: p.name,
        category: p.category,
        platform: bestPlatform?.name || "Best",
        platformKey: bestPlatform?.key || "best",
        price: bestPlatform?.price ?? minPrice(p),
        link: bestPlatform?.link || "",
        image: bestPlatform?.img || ""
      });
      openCart();
    });

    container.appendChild(card);
  });
}

/* =========================
   CART (localStorage)
   ========================= */
const CART_KEY = "SHOPMANIA_CART_V1";

function getCart() {
  try {
    return JSON.parse(localStorage.getItem(CART_KEY)) || [];
  } catch {
    return [];
  }
}

function setCart(cart) {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
}

function addToCart(item) {
  const cart = getCart();
  const key = `${item.id}_${item.platformKey}`;
  const existing = cart.find(x => x.key === key);

  if (existing) existing.qty += 1;
  else {
    cart.push({
      key,
      id: item.id,
      name: item.name,
      category: item.category,
      platform: item.platform,
      platformKey: item.platformKey,
      price: Number(item.price) || 0,
      link: item.link,
      image: item.image,
      qty: 1
    });
  }

  setCart(cart);
  updateCartBadge();
  renderCart();
}

function updateCartBadge() {
  const cart = getCart();
  const count = cart.reduce((sum, x) => sum + (x.qty || 0), 0);
  document.getElementById("cartCount").textContent = String(count);
}

function renderCart() {
  const cart = getCart();
  const wrap = document.getElementById("cartItems");
  const totalEl = document.getElementById("cartTotal");

  if (!cart.length) {
    wrap.innerHTML = `<p style="color:rgba(255,255,255,.75);font-weight:700">Cart is empty. Add something 😄</p>`;
    totalEl.textContent = "₹0";
    return;
  }

  wrap.innerHTML = cart.map(item => `
    <div class="cart-item" data-key="${escapeHtml(item.key)}">
      <img src="${safeImg(item.image)}" onerror="this.src='${FALLBACK_IMG}'" alt="item"/>
      <div style="flex:1">
        <h4>${escapeHtml(item.name)}</h4>
        <div class="cart-meta">${escapeHtml(item.platform)} • ₹${item.price}</div>

        <div class="cart-row">
          <div class="qty">
            <button type="button" data-act="dec">−</button>
            <strong style="color:#fff">${item.qty}</strong>
            <button type="button" data-act="inc">+</button>
          </div>

          <button class="remove" type="button" data-act="remove">Remove</button>
        </div>

        ${item.link ? `<a href="${item.link}" target="_blank" rel="noreferrer" style="display:inline-block;margin-top:8px;color:#c9b6ff;font-weight:800;text-decoration:none">Open product →</a>` : ""}
      </div>
    </div>
  `).join("");

  wrap.querySelectorAll(".cart-item").forEach(el => {
    const key = el.getAttribute("data-key");
    el.querySelectorAll("button[data-act]").forEach(btn => {
      btn.addEventListener("click", () => cartAction(key, btn.getAttribute("data-act")));
    });
  });

  const total = cart.reduce((sum, x) => sum + (x.price * x.qty), 0);
  totalEl.textContent = `₹${total}`;
}

function cartAction(key, act) {
  const cart = getCart();
  const idx = cart.findIndex(x => x.key === key);
  if (idx === -1) return;

  if (act === "inc") cart[idx].qty += 1;
  if (act === "dec") cart[idx].qty = Math.max(1, cart[idx].qty - 1);
  if (act === "remove") cart.splice(idx, 1);

  setCart(cart);
  updateCartBadge();
  renderCart();
}

function clearCart() {
  if (!confirm("Clear the cart?")) return;
  setCart([]);
  updateCartBadge();
  renderCart();
}

function openCart() {
  const drawer = document.getElementById("cartDrawer");
  const backdrop = document.getElementById("cartBackdrop");

  drawer.classList.add("open");
  backdrop.classList.add("open");
  drawer.setAttribute("aria-hidden", "false");
  renderCart();
}

function closeCart() {
  const drawer = document.getElementById("cartDrawer");
  const backdrop = document.getElementById("cartBackdrop");

  drawer.classList.remove("open");
  backdrop.classList.remove("open");
  drawer.setAttribute("aria-hidden", "true");
}

function escapeHtml(s) {
  return String(s || "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}
