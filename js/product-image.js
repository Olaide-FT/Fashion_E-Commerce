const productDetails = document.getElementById("productDetails");
const relatedProducts = document.getElementById("relatedProducts");
const loading = document.getElementById("loading");
const errorMessage = document.getElementById("errorMessage");
const CART = "fashionCart";

// I used URLSearchParams to extract the product ID from 
// the URL query string, allowing me to make the fetch 
// and display the correct product on the detail page
function getProductIdFromURL() {
  const params = new URLSearchParams(window.location.search);
  return params.get("id");
}

function getCart() {
  return JSON.parse(localStorage.getItem(CART)) || [];
}

function saveCart(cart) {
  localStorage.setItem(CART, JSON.stringify(cart));
}

function addToCart(product) {
  const cart = getCart();

  const existing = cart.find(item => item.id === product.id);

  if (existing) {
    existing.quantity += 1;
  } else {
    cart.push({ 
      id: product.id, 
      title: product.title, 
      price: product.price, 
      image: product.thumbnail || product.image, 
      quantity: 1 
    });
  }

  saveCart(cart);
  alert(`${product.title} added to cart`);
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
        <div class="grid grid-cols-1 gap-4 mb-8">
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
