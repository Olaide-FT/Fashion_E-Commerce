// mobileMenu
const menuBtn = document.getElementById("menuBtn");
const mobileMenu = document.getElementById("mobileMenu");

menuBtn.addEventListener("click", () => {
    mobileMenu.classList.toggle("hidden");
});

// carousel
const slides = document.querySelectorAll(".carousel-slide");
const dots = document.querySelectorAll(".dot");
const nextBtn = document.getElementById("nextSlide");
const prevBtn = document.getElementById("prevSlide");

let current = 0;
let interval;

function showSlide(index) {
    slides.forEach((slide, i) => {
        slide.classList.remove("opacity-100");
        slide.classList.add("opacity-0");

        dots[i].classList.remove("opacity-100");
        dots[i].classList.add("opacity-50");
    });

    slides[index].classList.add("opacity-100");
    dots[index].classList.add("opacity-100");

    current = index;
}

function nextSlide() {
    current = (current + 1) % slides.length;
    showSlide(current);
}

function prevSlide() {
    current = (current - 1 + slides.length) % slides.length;
    showSlide(current);
}

// Auto Slide
function startAutoSlide() {
    interval = setInterval(nextSlide, 5000);
}

function stopAutoSlide() {
    clearInterval(interval);
}

// Events
nextBtn.addEventListener("click", () => {
    nextSlide();
    stopAutoSlide();
    startAutoSlide();
});

prevBtn.addEventListener("click", () => {
    prevSlide();
    stopAutoSlide();
    startAutoSlide();
});

dots.forEach((dot, index) => {
    dot.addEventListener("click", () => {
        showSlide(index);
        stopAutoSlide();
        startAutoSlide();
    });
});

// Init
showSlide(0);
startAutoSlide();




  const productGrid = document.getElementById("productGrid");
  const loading = document.getElementById("loading");

  // Fetch products from DummyJSON
  async function fetchProducts() {
    try {
      loading.style.display = "block";

      const res = await fetch("https://dummyjson.com/products?limit=12");
      const data = await res.json();

      loading.style.display = "none";

      renderProducts(data.products);
    } catch (error) {
      console.error(error);
      loading.innerText = "Failed to load products";
    }
  }

  // Render products
  function renderProducts(products) {
    productGrid.innerHTML = "";

    products.forEach(product => {
      const card = document.createElement("div");

      card.className =
        "bg-white border rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition flex flex-col";

      card.innerHTML = `
        <div class="h-56 bg-gray-100 flex items-center justify-center p-4">
          <img src="${product.thumbnail}" alt="${product.title}" 
               class="h-full object-contain">
        </div>

        <div class="p-5 flex flex-col flex-1">
          <h3 class="font-semibold text-gray-900 mb-2 line-clamp-2">
            ${product.title}
          </h3>

          <p class="text-sm text-gray-500 mb-2">
            ${product.brand || ""}
          </p>

          <p class="text-lg font-bold text-pink-600 mb-4">
            $${product.price}
          </p>

          <button 
            class="mt-auto bg-black text-white py-2 rounded-lg hover:bg-pink-600 transition add-to-cart"
            data-id="${product.id}">
            Add to Cart
          </button>
        </div>
      `;

      productGrid.appendChild(card);
    });

    attachCartEvents(products);
  }

  // Add to cart (basic version)
  function attachCartEvents(products) {
    const buttons = document.querySelectorAll(".add-to-cart");

    buttons.forEach(btn => {
      btn.addEventListener("click", () => {
        const id = btn.dataset.id;

        const product = products.find(p => p.id == id);

        console.log("Added:", product);

        alert(`${product.title} added to cart`);
      });
    });
  }

  // Init
  fetchProducts();
