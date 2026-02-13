const ADMIN_API = "http://localhost:8080/api/admin/products";

const keyBox = document.getElementById("keyBox");
const panel = document.getElementById("panel");
const rowsWrap = document.getElementById("rows");
const statusEl = document.getElementById("status");

const loginBtn = document.getElementById("loginBtn");
const logoutBtn = document.getElementById("logoutBtn");
const refreshBtn = document.getElementById("refreshBtn");
const addBtn = document.getElementById("addBtn");
const keyErr = document.getElementById("keyError");

function setStatus(msg, type) {
  statusEl.className = "status";
  if (type === "ok") statusEl.classList.add("ok");
  if (type === "bad") statusEl.classList.add("bad");
  statusEl.textContent = msg || "";
}

function setKeyError(msg){
  keyErr.textContent = msg || "";
}

function getKey() {
  return sessionStorage.getItem("ADMIN_KEY") || "";
}
function setKey(k) {
  sessionStorage.setItem("ADMIN_KEY", k);
}
function clearKey() {
  sessionStorage.removeItem("ADMIN_KEY");
}

async function adminFetch(url, options = {}) {
  const key = getKey();
  const headers = options.headers || {};
  headers["X-ADMIN-KEY"] = key;
  if (!headers["Content-Type"]) headers["Content-Type"] = "application/json";
  return fetch(url, { ...options, headers });
}

async function validateKey() {
  // Try reading products with the key
  const res = await adminFetch(ADMIN_API, { method: "GET" });
  return res.ok;
}

async function openPanelIfValidKey() {
  setKeyError("");
  setStatus("", "");

  if (!getKey()) return;

  const ok = await validateKey();

  if (!ok) {
    // Invalid key: lock panel completely
    clearKey();
    panel.classList.add("hidden");
    keyBox.classList.remove("hidden");
    rowsWrap.innerHTML = "";
    setStatus("", "");
    setKeyError("Invalid admin key. Try again.");
    return;
  }

  // Valid key => show panel + load
  keyBox.classList.add("hidden");
  panel.classList.remove("hidden");
  await loadProducts();
}

async function loadProducts() {
  setStatus("Loading products...", "");
  rowsWrap.innerHTML = "";

  try {
    const res = await adminFetch(ADMIN_API);
    if (!res.ok) throw new Error("Unauthorized or server error");
    const data = await res.json();

    setStatus(`Loaded ${data.length} products.`, "ok");
    renderProducts(data);
  } catch (e) {
    setStatus("Failed to load. Backend running? Key correct?", "bad");
  }
}

function renderProducts(products) {
  rowsWrap.innerHTML = "";

  products.forEach(p => {
    const group = document.createElement("div");
    group.className = "group";

    // Each product becomes 3 platform rows (Meesho/Myntra/Shopsy)
    // But we keep ID/Name/Category and LastUpdated + Actions aligned with Meesho row
    // Then for Myntra/Shopsy we leave those cells blank (still aligned, no jumble).

    group.appendChild(makeRow(p, "meesho", true));
    group.appendChild(makeRow(p, "myntra", false));
    group.appendChild(makeRow(p, "shopsy", false));

    rowsWrap.appendChild(group);
  });
}

function makeRow(p, platform, showMeta) {
  const row = document.createElement("div");
  row.className = "row";

  const label = platformLabel(platform);
  const priceField = `${platform}_price`;
  const linkField  = `${platform}_link`;
  const imgField   = `${platform}_image`;

  const priceVal = p[priceField] ?? "";
  const linkVal  = p[linkField] ?? "";
  const imgVal   = p[imgField] ?? "";

  const updatedText = p.lastUpdated ? new Date(p.lastUpdated).toLocaleString() : "-";

  row.innerHTML = `
    <div>${showMeta ? p.id : ""}</div>

    <div>${showMeta ? `<input class="field" data-field="name" value="${escapeHtml(p.name || "")}" />` : ""}</div>

    <div>${showMeta ? `<input class="field" data-field="category" value="${escapeHtml(p.category || "")}" />` : ""}</div>

    <div><span class="cellTag">${label}</span></div>

    <div>
      <input class="field" data-field="${priceField}" value="${escapeHtml(String(priceVal))}" placeholder="Price" />
    </div>

    <div class="inputGroup">
      <input class="field" data-field="${linkField}" value="${escapeHtml(linkVal)}" placeholder="${label} link" />
      ${linkVal ? `<a class="miniLink" href="${linkVal}" target="_blank">↗</a>` : ""}
    </div>

    <div class="inputGroup">
      <input class="field" data-field="${imgField}" value="${escapeHtml(imgVal)}" placeholder="${label} image path" />
      ${imgVal ? `<img class="thumb" src="${imgVal}" onerror="this.style.display='none'" />` : ""}
    </div>

    <div>${showMeta ? updatedText : ""}</div>

    <div class="actionsCol">
      ${showMeta ? `<button class="btn smallBtn" data-action="save">Save</button>
                   <button class="btn dangerBtn" data-action="delete">Delete</button>` : ""}
    </div>
  `;

  if (showMeta) {
    row.querySelector('[data-action="save"]').addEventListener("click", async () => {
      await saveProductFromGroup(p.id, row.parentElement, p);
    });

    row.querySelector('[data-action="delete"]').addEventListener("click", async () => {
      await deleteProduct(p.id);
    });
  }

  return row;
}

function platformLabel(platform){
  if (platform === "meesho") return "Meesho";
  if (platform === "myntra") return "Myntra";
  return "Shopsy";
}

function readGroup(groupEl, original) {
  const updated = { ...original };

  // Collect all inputs across the 3 rows
  groupEl.querySelectorAll("input[data-field]").forEach(inp => {
    const field = inp.getAttribute("data-field");
    let val = inp.value;

    if (field.endsWith("_price")) {
      val = val.trim() === "" ? null : Number(val);
      if (val !== null && Number.isNaN(val)) val = null;
    }
    updated[field] = val;
  });

  return updated;
}

async function saveProductFromGroup(id, groupEl, original) {
  setStatus(`Saving product ${id}...`, "");
  try {
    const updated = readGroup(groupEl, original);

    const res = await adminFetch(`${ADMIN_API}/${id}`, {
      method: "PUT",
      body: JSON.stringify(updated)
    });

    if (!res.ok) throw new Error("Save failed");

    setStatus(`Saved product ${id}.`, "ok");
    await loadProducts();
  } catch (e) {
    setStatus(`Save failed for product ${id}.`, "bad");
  }
}

async function deleteProduct(id) {
  if (!confirm(`Delete product ${id}?`)) return;

  setStatus(`Deleting product ${id}...`, "");

  try {
    const res = await adminFetch(`${ADMIN_API}/${id}`, { method: "DELETE" });
    if (!res.ok) throw new Error("Delete failed");

    setStatus(`Deleted product ${id}.`, "ok");
    await loadProducts();
  } catch (e) {
    setStatus(`Delete failed for product ${id}.`, "bad");
  }
}

async function addProduct() {
  setStatus("Adding product...", "");

  const blank = {
    name: "New Product",
    category: "general",

    meesho_price: null,
    meesho_link: "",
    meesho_image: "",

    myntra_price: null,
    myntra_link: "",
    myntra_image: "",

    shopsy_price: null,
    shopsy_link: "",
    shopsy_image: ""
  };

  try {
    const res = await adminFetch(ADMIN_API, {
      method: "POST",
      body: JSON.stringify(blank)
    });

    if (!res.ok) throw new Error("Add failed");

    setStatus("Added. Edit and Save if needed.", "ok");
    await loadProducts();
  } catch (e) {
    setStatus("Add failed. Check admin key.", "bad");
  }
}

function escapeHtml(s) {
  return String(s)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

/* EVENTS */
loginBtn.addEventListener("click", async () => {
  setKeyError("");
  const k = document.getElementById("adminKeyInput").value.trim();
  if (!k) {
    setKeyError("Enter admin key.");
    return;
  }
  setKey(k);

  // Validate BEFORE showing panel
  await openPanelIfValidKey();
});

logoutBtn.addEventListener("click", () => {
  clearKey();
  panel.classList.add("hidden");
  keyBox.classList.remove("hidden");
  rowsWrap.innerHTML = "";
  setStatus("Logged out.", "");
  setKeyError("");
});

refreshBtn.addEventListener("click", loadProducts);
addBtn.addEventListener("click", addProduct);

/* AUTO */
document.addEventListener("DOMContentLoaded", async () => {
  await openPanelIfValidKey();
});
