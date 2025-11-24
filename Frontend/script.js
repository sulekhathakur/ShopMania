const PRODUCTS_JSON = 'products.json';
const PLACEHOLDER = 'assets/placeholder.png';

let allProducts = [];

function safeImg(src) {
  return src && src.length ? src : PLACEHOLDER;
}

function determineCategory(productName) {
  const name = productName.toLowerCase();
  if (name.includes('kurti') || name.includes('jacket') || name.includes('shirt') || name.includes('sneaker')) {
    return 'fashion';
  } else if (name.includes('earbud') || name.includes('watch') || name.includes('speaker')) {
    return 'electronics';
  } else if (name.includes('backpack') || name.includes('sunglasses')) {
    return 'accessories';
  }
  return 'general';
}

function createProductCard(product) {
  const card = document.createElement('article');
  card.className = 'product-card';
  
  const category = determineCategory(product.name);
  
  // Calculate best price
  const platforms = [
    { name: 'meesho', price: product.meesho?.price ?? Infinity, data: product.meesho },
    { name: 'myntra', price: product.myntra?.price ?? Infinity, data: product.myntra },
    { name: 'shopsy', price: product.shopsy?.price ?? Infinity, data: product.shopsy }
  ];
  
  const minPrice = Math.min(...platforms.map(p => p.price));
  
  // Product Header
  const header = document.createElement('div');
  header.className = 'product-header';
  
  const title = document.createElement('div');
  title.className = 'product-title';
  title.textContent = product.name;
  header.appendChild(title);
  
  const categoryBadge = document.createElement('div');
  categoryBadge.className = 'category-badge';
  categoryBadge.textContent = category;
  header.appendChild(categoryBadge);
  
  card.appendChild(header);
  
  // Platform Rows - VERTICAL LAYOUT WITH COLORS
  platforms.forEach(({ name, price, data }) => {
    if (price === Infinity) return;
    
    const row = document.createElement('div');
    row.className = `platform-row ${name}-row` + (price === minPrice ? ' best' : '');
    
    // Best Price Badge
    if (price === minPrice) {
      const badge = document.createElement('div');
      badge.className = 'best-badge';
      badge.innerHTML = 'Best Price';
      row.appendChild(badge);
    }
    
    // Platform Info
    const info = document.createElement('div');
    info.className = 'platform-info';
    
    const logo = document.createElement('img');
    logo.className = 'platform-logo';
    logo.src = safeImg(data?.image);
    logo.alt = name;
    logo.onerror = function() { this.src = PLACEHOLDER; };
    info.appendChild(logo);
    
    const platformName = document.createElement('div');
    platformName.className = 'platform-name';
    platformName.textContent = name.charAt(0).toUpperCase() + name.slice(1);
    info.appendChild(platformName);
    
    row.appendChild(info);
    
    // Price
    const priceEl = document.createElement('div');
    priceEl.className = 'platform-price';
    priceEl.textContent = `₹${price}`;
    row.appendChild(priceEl);
    
    // Buy Button
    const btn = document.createElement('button');
    btn.className = 'buy-btn';
    btn.textContent = 'Buy';
    btn.onclick = () => {
      if (data?.link) {
        window.open(data.link, '_blank', 'noopener,noreferrer');
      } else {
        alert('Product link not available');
      }
    };
    row.appendChild(btn);
    
    card.appendChild(row);
  });
  
  return card;
}

function renderProducts(products) {
  const container = document.getElementById('products');
  container.innerHTML = '';
  
  if (products.length === 0) {
    container.innerHTML = '<p style="grid-column: 1/-1; text-align: center; color: #94a3b8; padding: 40px;">No products found matching your criteria.</p>';
    return;
  }
  
  products.forEach(product => {
    container.appendChild(createProductCard(product));
  });
}

function filterAndSort() {
  const sortValue = document.getElementById('sortDropdown')?.value || 'name';
  const categoryValue = document.getElementById('categoryDropdown')?.value || 'all';
  const platformValue = document.getElementById('platformDropdown')?.value || 'all';
  
  let filtered = [...allProducts];
  
  if (categoryValue !== 'all') {
    filtered = filtered.filter(p => determineCategory(p.name) === categoryValue);
  }
  
  if (platformValue !== 'all') {
    filtered = filtered.filter(p => p[platformValue] && p[platformValue].price);
  }
  
  if (sortValue === 'name') {
    filtered.sort((a, b) => a.name.localeCompare(b.name));
  } else if (sortValue === 'price-low') {
    filtered.sort((a, b) => {
      const minA = Math.min(a.meesho?.price ?? Infinity, a.myntra?.price ?? Infinity, a.shopsy?.price ?? Infinity);
      const minB = Math.min(b.meesho?.price ?? Infinity, b.myntra?.price ?? Infinity, b.shopsy?.price ?? Infinity);
      return minA - minB;
    });
  } else if (sortValue === 'price-high') {
    filtered.sort((a, b) => {
      const minA = Math.min(a.meesho?.price ?? Infinity, a.myntra?.price ?? Infinity, a.shopsy?.price ?? Infinity);
      const minB = Math.min(b.meesho?.price ?? Infinity, b.myntra?.price ?? Infinity, b.shopsy?.price ?? Infinity);
      return minB - minA;
    });
  }
  
  renderProducts(filtered);
}

async function loadAndRender() {
  try {
    const res = await fetch(PRODUCTS_JSON, { cache: 'no-store' });
    if (!res.ok) throw new Error('Failed to load products.json');
    allProducts = await res.json();
    
    filterAndSort();
    
    const sortDropdown = document.getElementById('sortDropdown');
    const categoryDropdown = document.getElementById('categoryDropdown');
    const platformDropdown = document.getElementById('platformDropdown');
    const heroSearchBar = document.getElementById('heroSearchBar');
    
    if (sortDropdown) sortDropdown.addEventListener('change', filterAndSort);
    if (categoryDropdown) categoryDropdown.addEventListener('change', filterAndSort);
    if (platformDropdown) platformDropdown.addEventListener('change', filterAndSort);
    
    if (heroSearchBar) {
      heroSearchBar.addEventListener('input', (e) => {
        const query = e.target.value.trim().toLowerCase();
        if (!query) {
          filterAndSort();
          return;
        }
        const filtered = allProducts.filter(p => 
          p.name.toLowerCase().includes(query)
        );
        renderProducts(filtered);
      });
    }
    
  } catch (err) {
    console.error(err);
    const container = document.getElementById('products');
    if (container) {
      container.innerHTML = '<p style="grid-column: 1/-1; text-align: center; color: #ef4444; padding: 40px;">Failed to load products.</p>';
    }
  }
}

document.addEventListener('DOMContentLoaded', loadAndRender);