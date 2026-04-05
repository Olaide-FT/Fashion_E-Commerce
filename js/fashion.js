// carousel
const slides = document.querySelectorAll(".carousel-slide");
const dots = document.querySelectorAll(".dot");
const nextBtn = document.getElementById("nextSlide");
const prevBtn = document.getElementById("prevSlide");

let current = 0;
let interval;

function showSlide(index) {
  if (!slides.length || !dots.length) return;

  slides.forEach((slide, i) => {
    slide.classList.remove("opacity-100");
    slide.classList.add("opacity-0");

    if (dots[i]) {
      dots[i].classList.remove("opacity-100");
      dots[i].classList.add("opacity-50");
    }
  });

  slides[index].classList.remove("opacity-0");
  slides[index].classList.add("opacity-100");
  if (dots[index]) {
    dots[index].classList.remove("opacity-50");
    dots[index].classList.add("opacity-100");
  }

  current = index;
}

function nextSlide() {
  if (!slides.length) return;
  current = (current + 1) % slides.length;
  showSlide(current);
}

function prevSlide() {
  if (!slides.length) return;
  current = (current - 1 + slides.length) % slides.length;
  showSlide(current);
}

function startAutoSlide() {
  if (!slides.length) return;
  interval = setInterval(nextSlide, 5000);
}

function stopAutoSlide() {
  clearInterval(interval);
}

if (nextBtn) {
  nextBtn.addEventListener("click", () => {
    nextSlide();
    stopAutoSlide();
    startAutoSlide();
  });
}

if (prevBtn) {
  prevBtn.addEventListener("click", () => {
    prevSlide();
    stopAutoSlide();
    startAutoSlide();
  });
}

dots.forEach((dot, index) => {
  dot.addEventListener("click", () => {
    showSlide(index);
    stopAutoSlide();
    startAutoSlide();
  });
});

if (slides.length && dots.length) {
  showSlide(0);
  startAutoSlide();
}

const productGrid = document.getElementById("productGrid");
const loading = document.getElementById("loading");
const CART_KEY = "fashionCart";

function getCart() {
  return JSON.parse(localStorage.getItem(CART_KEY)) || [];
}

function saveCart(cart) {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
}

function addToCart(product) {
  const cart = getCart();
  const existingProduct = cart.find(item => item.id === product.id);

  if (existingProduct) {
    existingProduct.quantity += 1;
  } else {
    cart.push({
      id: product.id,
      title: product.title,
      price: product.price,
      image: product.thumbnail,
      quantity: 1
    });
  }

  saveCart(cart);
  alert(`${product.title} added to cart`);
}

async function fetchProducts() {
  if (!productGrid || !loading) return;
  try {
    loading.style.display = "block";

    const res = await fetch("https://dummyjson.com/products?limit=12");
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();

    loading.style.display = "none";
    renderProducts(data.products || []);
  } catch (error) {
    console.error(error);
    loading.innerText = "Failed to load products";
  }
}

function renderProducts(products) {
  productGrid.innerHTML = "";

  products.forEach(product => {
    const card = document.createElement("div");

    card.className =
      "bg-white border rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition flex flex-col";

    card.innerHTML = `
      <a href="./pages/product-image.html?id=${product.id}" class="block">
        <div class="h-56 bg-gray-100 flex items-center justify-center p-4">
          <img src="${product.thumbnail}" alt="${product.title}" class="h-full object-contain">
        </div>
      </a>
      <div class="p-5 flex flex-col flex-1">
        <h3 class="font-semibold text-gray-900 mb-2 line-clamp-2">${product.title}</h3>
        <p class="text-sm text-gray-500 mb-2">${product.brand || ""}</p>
        <p class="text-lg font-bold text-pink-600 mb-4">$${product.price}</p>
        <button class="mt-auto bg-black text-white py-2 rounded-lg hover:bg-pink-600 transition add-to-cart" data-id="${product.id}">Add to Cart</button>
      </div>
    `;

    productGrid.appendChild(card);
  });

  attachCartEvents(products);
}

function attachCartEvents(products) {
  const buttons = document.querySelectorAll(".add-to-cart");
  buttons.forEach(btn => {
    btn.addEventListener("click", () => {
      const id = Number(btn.dataset.id);
      const product = products.find(p => p.id === id);
      if (product) addToCart(product);
    });
  });
}

fetchProducts();
