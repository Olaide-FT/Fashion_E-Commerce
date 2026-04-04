const menuBtn = document.getElementById("menuBtn");
const mobileMenu = document.getElementById("mobileMenu");
const productDetails = document.getElementById("productDetails");
const relatedProducts = document.getElementById("relatedProducts");
const loading = document.getElementById("loading");
const errorMessage = document.getElementById("errorMessage");
const CART_KEY = "fashionCart";

if (menuBtn && mobileMenu) {
  menuBtn.addEventListener("click", () => mobileMenu.classList.toggle("hidden"));
}

function getProductIdFromURL() {
  const params = new URLSearchParams(window.location.search);
  return params.get("id");
}

function getCart() { return JSON.parse(localStorage.getItem(CART_KEY)) || []; }
function saveCart(cart) { localStorage.setItem(CART_KEY, JSON.stringify(cart)); }
function addToCart(product) {
  const cart = getCart();
  const existing = cart.find(item => item.id === product.id);
  if (existing) existing.quantity += 1;
  else cart.push({ id: product.id, title: product.title, price: product.price, image: product.thumbnail, quantity: 1 });
  saveCart(cart);
  alert(product.title + " added to cart");
}

function renderProduct(product) {
  productDetails.innerHTML = `
    <div class="grid lg:grid-cols-2 gap-12 items-start">
      <div class="bg-gray-100 rounded-3xl overflow-hidden">
        <img src="${product.thumbnail}" alt="${product.title}" class="w-full h-[500px] object-cover" />
      </div>
      <div>
        <p class="text-sm uppercase tracking-widest text-pink-600 font-semibold mb-3">${product.brand || 'Fashion'}</p>
        <h1 class="text-3xl md:text-4xl font-bold text-gray-900 mb-4">${product.title}</h1>
        <p class="text-gray-500 capitalize mb-4">${product.category}</p>
        <div class="flex items-center gap-4 mb-6">
          <p class="text-3xl font-bold text-pink-600">$${product.price}</p>
          <span class="bg-green-100 text-green-700 text-sm font-medium px-3 py-1 rounded-full">${product.discountPercentage}% off</span>
        </div>
        <p class="text-gray-600 leading-8 mb-8">${product.description}</p>
        <div class="grid grid-cols-2 gap-4 mb-8">
          <div class="bg-gray-50 rounded-2xl p-4"><p class="text-sm text-gray-500 mb-1">Rating</p><p class="font-semibold text-lg">${product.rating} / 5</p></div>
          <div class="bg-gray-50 rounded-2xl p-4"><p class="text-sm text-gray-500 mb-1">Stock</p><p class="font-semibold text-lg">${product.stock} available</p></div>
        </div>
        <div class="flex flex-col sm:flex-row gap-4">
          <button id="addToCartBtn" class="bg-black text-white px-8 py-4 rounded-xl font-medium hover:bg-pink-600 transition">Add to Cart</button>
          <a href="cart.html" class="border border-gray-300 px-8 py-4 rounded-xl font-medium hover:border-pink-600 hover:text-pink-600 transition text-center">View Cart</a>
        </div>
      </div>
    </div>`;
  document.getElementById("addToCartBtn")?.addEventListener("click", () => addToCart(product));
}

function renderRelatedProducts(products) {
  relatedProducts.innerHTML = "";
  products.forEach(product => {
    const card = document.createElement("div");
    card.className = "group bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition duration-300 flex flex-col";
    card.innerHTML = `
      <a href="product-image.html?id=${product.id}" class="block">
        <div class="h-64 bg-gray-100 overflow-hidden">
          <img src="${product.thumbnail}" alt="${product.title}" class="w-full h-full object-cover group-hover:scale-105 transition duration-500" />
        </div>
      </a>
      <div class="p-5 flex flex-col flex-1">
        <p class="text-sm text-gray-500 mb-2 capitalize">${product.category}</p>
        <a href="product-image.html?id=${product.id}">
          <h3 class="text-lg font-semibold text-gray-900 mb-3 min-h-[56px] hover:text-pink-600 transition">${product.title}</h3>
        </a>
        <div class="mt-auto flex items-center justify-between">
          <p class="text-xl font-bold text-pink-600">$${product.price}</p>
          <button class="related-add-to-cart bg-black text-white px-4 py-2 rounded-lg hover:bg-pink-600 transition" data-id="${product.id}">Add to Cart</button>
        </div>
      </div>`;
    relatedProducts.appendChild(card);
  });
  document.querySelectorAll('.related-add-to-cart').forEach(button => {
    button.addEventListener('click', () => {
      const id = Number(button.dataset.id);
      const product = products.find(item => item.id === id);
      if (product) addToCart(product);
    });
  });
}

async function fetchProduct() {
  const productId = getProductIdFromURL();
  if (!productId) {
    loading.classList.add('hidden');
    errorMessage.classList.remove('hidden');
    return;
  }
  try {
    const response = await fetch(`https://dummyjson.com/products/${productId}`);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const product = await response.json();
    renderProduct(product);
    loading.classList.add('hidden');
    fetchRelatedProducts(product.category, product.id);
  } catch (error) {
    console.error('Error fetching product:', error);
    loading.classList.add('hidden');
    errorMessage.classList.remove('hidden');
  }
}

async function fetchRelatedProducts(category, currentId) {
  try {
    const response = await fetch('https://dummyjson.com/products?limit=40');
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const data = await response.json();
    const related = (data.products || []).filter(product => product.category === category && product.id !== currentId).slice(0, 4);
    renderRelatedProducts(related);
  } catch (error) {
    console.error('Error fetching related products:', error);
  }
}

fetchProduct();
