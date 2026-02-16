(() => {
  const API = "/api/admin/products";
  const KEY_STORAGE = "SHOPMANIA_ADMIN_KEY";

  const el = (id) => document.getElementById(id);

  const keyBox = el("keyBox");
  const adminKeyInput = el("adminKeyInput");
  const loginBtn = el("loginBtn");
  const keyError = el("keyError");

  const panel = el("panel");
  const refreshBtn = el("refreshBtn");
  const addBtn = el("addBtn");
  const productsGrid = el("productsGrid");
  const status = el("status");
  const logoutBtn = el("logoutBtn");

  const getKey = () =>
    sessionStorage.getItem(KEY_STORAGE) ||
    localStorage.getItem(KEY_STORAGE) ||
    "";

  const setKey = (k) => {
    sessionStorage.setItem(KEY_STORAGE, k);
    localStorage.setItem(KEY_STORAGE, k);
  };

  const clearKey = () => {
    sessionStorage.removeItem(KEY_STORAGE);
    localStorage.removeItem(KEY_STORAGE);
  };

  const headers = () => ({
    "Content-Type": "application/json",
    "X-ADMIN-KEY": getKey()
  });

  const showPanel = () => {
    keyBox.style.display = "none";
    panel.style.display = "block";
  };

  const showKeyBox = () => {
    panel.style.display = "none";
    keyBox.style.display = "block";
  };

  const renderTable = (products) => {
    productsGrid.innerHTML = `
      <table class="admin-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Category</th>
            <th>Meesho</th>
            <th>Myntra</th>
            <th>Shopsy</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          ${products.map(rowHTML).join("")}
        </tbody>
      </table>
    `;
  };

  const rowHTML = (p) => `
    <tr data-id="${p.id}">
      <td>${p.id}</td>

      <td>
        <input data-k="name" value="${p.name ?? ""}" />
      </td>

      <td>
        <input data-k="category" value="${p.category ?? ""}" />
      </td>

      ${platformCell("meesho", p)}
      ${platformCell("myntra", p)}
      ${platformCell("shopsy", p)}

      <td class="actions">
        <button class="btn save" data-act="save">Save</button>
        <button class="btn delete" data-act="del">Delete</button>
      </td>
    </tr>
  `;

  const platformCell = (platform, p) => `
    <td>
      <div class="price">₹${p[platform + "_price"] ?? "-"}</div>

      <input data-k="${platform}_price" value="${p[platform + "_price"] ?? ""}" placeholder="Price" />
      <input data-k="${platform}_link" value="${p[platform + "_link"] ?? ""}" placeholder="Product link" />
      <input data-k="${platform}_image" value="${p[platform + "_image"] ?? ""}" placeholder="Image path" />

      <div class="preview">
        <img src="${p[platform + "_image"] || "assets/placeholder.png"}"
             onerror="this.src='assets/placeholder.png'" />
        ${
          p[platform + "_link"]
            ? `<a href="${p[platform + "_link"]}" target="_blank">Preview ↗</a>`
            : ""
        }
      </div>
    </td>
  `;

  const fetchProducts = async () => {
    status.textContent = "Loading...";
    const res = await fetch(API, { headers: headers() });

    if (!res.ok) {
      keyError.textContent = "Invalid admin key.";
      clearKey();
      showKeyBox();
      return;
    }

    const data = await res.json();
    renderTable(data);
    status.textContent = `Loaded ${data.length} products ✅`;
  };

  loginBtn.addEventListener("click", async () => {
    const key = adminKeyInput.value.trim();
    if (!key) return;

    setKey(key);
    await fetchProducts();
    showPanel();
  });

  refreshBtn.addEventListener("click", fetchProducts);

  logoutBtn.addEventListener("click", () => {
    clearKey();
    productsGrid.innerHTML = "";
    showKeyBox();
  });

  productsGrid.addEventListener("click", async (e) => {
    const btn = e.target.closest("button[data-act]");
    if (!btn) return;

    const row = btn.closest("tr");
    const id = row.getAttribute("data-id");

    if (btn.dataset.act === "save") {
      const inputs = row.querySelectorAll("input");
      const payload = { id };

      inputs.forEach((input) => {
        payload[input.dataset.k] =
          input.value === "" ? null : input.value;
      });

      await fetch(API + "/" + id, {
        method: "PUT",
        headers: headers(),
        body: JSON.stringify(payload)
      });

      fetchProducts();
    }

    if (btn.dataset.act === "del") {
      await fetch(API + "/" + id, {
        method: "DELETE",
        headers: headers()
      });

      fetchProducts();
    }
  });

  const existingKey = getKey();
  if (existingKey) {
    showPanel();
    fetchProducts();
  }
})();
