const productGrid = document.getElementById("productGrid");
const loading = document.getElementById("loading");
const errorMessage = document.getElementById("errorMessage");
const searchInput = document.getElementById("searchInput");
const sortSelect = document.getElementById("sortSelect");
const CART_KEY = "fashionCart";
let allProducts = [];


function getCart() { return JSON.parse(localStorage.getItem(CART_KEY)) || []; }
function saveCart(cart) { localStorage.setItem(CART_KEY, JSON.stringify(cart)); }
function addToCart(product) {
  const cart = getCart();
  const existing = cart.find(item => item.id === product.id);
  if (existing) existing.quantity += 1;
  else cart.push({ id: product.id, title: product.title, price: product.price, image: product.thumbnail, quantity: 1 });
  saveCart(cart);
  alert(`${product.title} added to cart`);
}

function renderProducts(products) {
  productGrid.innerHTML = "";
  if (!products.length) {
    productGrid.innerHTML = `<div class="col-span-full text-center py-16"><p class="text-gray-500 text-lg">No products found.</p></div>`;
    return;
  }

  products.forEach(product => {
    const productCard = document.createElement("div");
    productCard.className = "group bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition duration-300 flex flex-col";
    productCard.innerHTML = `
      <a href="product-image.html?id=${product.id}" class="block">
        <div class="relative h-72 bg-gray-100 overflow-hidden">
          <img src="${product.thumbnail}" alt="${product.title}" class="w-full h-full object-cover group-hover:scale-105 transition duration-500" />
          <div class="absolute top-4 left-4">
            <span class="bg-white text-pink-600 text-xs font-semibold px-3 py-1 rounded-full shadow">${product.brand || "Fashion"}</span>
          </div>
        </div>
      </a>
      <div class="p-5 flex flex-col flex-1">
        <p class="text-sm text-gray-500 mb-2 capitalize">${product.category}</p>
        <a href="product-image.html?id=${product.id}">
          <h3 class="text-lg font-semibold text-gray-900 mb-3 min-h-[56px] hover:text-pink-600 transition">${product.title}</h3>
        </a>
        <p class="text-sm text-gray-600 leading-6 mb-4 min-h-[72px] overflow-hidden">${product.description.slice(0, 90)}...</p>
        <div class="mt-auto flex items-center justify-between">
          <p class="text-xl font-bold text-pink-600">$${product.price}</p>
          <button class="add-to-cart bg-black text-white px-4 py-2 rounded-lg hover:bg-pink-600 transition" data-id="${product.id}">Add to Cart</button>
        </div>
      </div>`;
    productGrid.appendChild(productCard);
  });

  document.querySelectorAll('.add-to-cart').forEach(button => {
    button.addEventListener('click', () => {
      const product = products.find(item => item.id === Number(button.dataset.id));
      if (product) addToCart(product);
    });
  });
}

function applyFilters() {
  let filtered = [...allProducts];
  const query = (searchInput?.value || '').trim().toLowerCase();
  const sort = sortSelect?.value || 'default';

  if (query) filtered = filtered.filter(p => p.title.toLowerCase().includes(query) || p.category.toLowerCase().includes(query) || (p.brand || '').toLowerCase().includes(query));
  if (sort === 'low-high') filtered.sort((a,b) => a.price - b.price);
  if (sort === 'high-low') filtered.sort((a,b) => b.price - a.price);
  if (sort === 'title-az') filtered.sort((a,b) => a.title.localeCompare(b.title));

  renderProducts(filtered);
}

async function fetchProducts() {
  try {
    const response = await fetch('https://dummyjson.com/products?limit=40');
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const data = await response.json();
    allProducts = data.products || [];
    loading.classList.add('hidden');
    renderProducts(allProducts);
  } catch (error) {
    console.error('Error fetching products:', error);
    loading.classList.add('hidden');
    errorMessage.classList.remove('hidden');
  }
}

searchInput?.addEventListener('input', applyFilters);
sortSelect?.addEventListener('change', applyFilters);
fetchProducts();
