// Carousel functionality
document.addEventListener('DOMContentLoaded', function() {
  const carouselTrack = document.getElementById('carouselTrack');
  const prevBtn = document.getElementById('prevBtn');
  const nextBtn = document.getElementById('nextBtn');
  
  if (carouselTrack && prevBtn && nextBtn) {
    let currentPosition = 0;
    const cardWidth = 250 + 24; // card width + gap
    const cardsToShow = window.innerWidth < 768 ? 1 : window.innerWidth < 1024 ? 2 : 3;
    const totalCards = document.querySelectorAll('.category-card').length;
    const maxPosition = -(totalCards - cardsToShow) * cardWidth;

    prevBtn.addEventListener('click', function() {
      if (currentPosition < 0) {
        currentPosition += cardWidth;
        carouselTrack.style.transform = `translateX(${currentPosition}px)`;
      }
    });

    nextBtn.addEventListener('click', function() {
      if (currentPosition > maxPosition) {
        currentPosition -= cardWidth;
        carouselTrack.style.transform = `translateX(${currentPosition}px)`;
      }
    });
  }

  // Cart functionality
  const cartBtn = document.getElementById('cartBtn');
  const cartDrawer = document.getElementById('cartDrawer');
  const cartBackdrop = document.getElementById('cartBackdrop');
  const cartCloseBtn = document.getElementById('cartCloseBtn');
  const cartClearBtn = document.getElementById('cartClearBtn');

  if (cartBtn && cartDrawer && cartBackdrop && cartCloseBtn) {
    cartBtn.addEventListener('click', function() {
      cartDrawer.classList.add('open');
      cartBackdrop.classList.add('open');
    });

    cartCloseBtn.addEventListener('click', closeCart);
    cartBackdrop.addEventListener('click', closeCart);

    function closeCart() {
      cartDrawer.classList.remove('open');
      cartBackdrop.classList.remove('open');
    }
  }

  if (cartClearBtn) {
    cartClearBtn.addEventListener('click', function() {
      const cartItems = document.getElementById('cartItems');
      const cartCount = document.getElementById('cartCount');
      const cartTotal = document.getElementById('cartTotal');
      
      if (cartItems) cartItems.innerHTML = '<p style="text-align: center; color: var(--gray-500); padding: 2rem;">Your cart is empty</p>';
      if (cartCount) cartCount.textContent = '0';
      if (cartTotal) cartTotal.textContent = '₹0';
    });
  }

  // Search functionality
  const heroSearchBar = document.getElementById('heroSearchBar');
  if (heroSearchBar) {
    heroSearchBar.addEventListener('keypress', function(e) {
      if (e.key === 'Enter') {
        performSearch(this.value);
      }
    });
  }

  const searchBtn = document.querySelector('.search-btn');
  if (searchBtn) {
    searchBtn.addEventListener('click', function() {
      const searchValue = document.getElementById('heroSearchBar').value;
      performSearch(searchValue);
    });
  }

  function performSearch(query) {
    console.log('Searching for:', query);
    // Add your search logic here
    // This would typically filter the products grid
  }
});