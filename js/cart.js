const cartContainer = document.getElementById("cartContainer");
const CART_KEY = "fashionCart";


function getCart() { return JSON.parse(localStorage.getItem(CART_KEY)) || []; }
function saveCart(cart) { localStorage.setItem(CART_KEY, JSON.stringify(cart)); }

function removeFromCart(productId) {
  const cart = getCart().filter(item => item.id !== productId);
  saveCart(cart);
  renderCart();
}
function increaseQuantity(productId) {
  const cart = getCart();
  const item = cart.find(product => product.id === productId);
  if (item) item.quantity += 1;
  saveCart(cart);
  renderCart();
}

function decreaseQuantity(productId) {
  const cart = getCart();
  const item = cart.find(product => product.id === productId);
  if (item) {
    item.quantity -= 1;
    if (item.quantity <= 0) saveCart(cart.filter(product => product.id !== productId));
    else saveCart(cart);
  }
  renderCart();
}

function renderCart() {
  const cart = getCart();
  if (!cartContainer) return;
  if (!cart.length) {
    cartContainer.innerHTML = `
      <div class="bg-white rounded-3xl p-10 text-center shadow-sm border border-gray-200">
        <h2 class="text-3xl font-bold mb-4">Your cart is empty</h2>
        <p class="text-gray-500 mb-8">Looks like you haven’t added any products yet.</p>
        <a href="product.html" class="inline-block bg-pink-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-pink-700 transition">Start Shopping</a>
      </div>`;
    return;
  }

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  cartContainer.innerHTML = `
    <div class="grid lg:grid-cols-3 gap-10">
      <div class="lg:col-span-2 space-y-5">
        ${cart.map(item => `
          <div class="bg-white rounded-3xl p-5 shadow-sm border border-gray-200 flex flex-col sm:flex-row gap-5 items-center">
            <div class="w-28 h-28 rounded-2xl bg-gray-100 overflow-hidden shrink-0">
              <img src="${item.thumbnail}" alt="${item.title}" class="w-full h-full object-cover">
            </div>
            <div class="flex-1 text-center sm:text-left">
              <h3 class="text-xl font-semibold text-gray-900 mb-2">${item.title}</h3>
              <p class="text-pink-600 text-lg font-bold">$${item.price}</p>
            </div>
            <div class="flex items-center gap-3">
              <button class="decrease w-10 h-10 rounded-full border border-gray-300 hover:border-pink-600 hover:text-pink-600 transition" data-id="${item.id}">-</button>
              <span class="w-8 text-center font-semibold">${item.quantity}</span>
              <button class="increase w-10 h-10 rounded-full border border-gray-300 hover:border-pink-600 hover:text-pink-600 transition" data-id="${item.id}">+</button>
            </div>
            <div class="text-center sm:text-right">
              <p class="text-lg font-bold text-gray-900 mb-3">$${(item.price * item.quantity).toFixed(2)}</p>
              <button class="remove text-red-500 hover:text-red-600 font-medium" data-id="${item.id}">Remove</button>
            </div>
          </div>`).join("")}
      </div>
      <div>
        <div class="bg-white rounded-3xl p-6 shadow-sm border border-gray-200 sticky top-24">
          <h3 class="text-2xl font-bold mb-6">Order Summary</h3>
          <div class="space-y-4 text-gray-600">
            <div class="flex items-center justify-between"><span>Total Items</span><span>${totalItems}</span></div>
            <div class="flex items-center justify-between"><span>Shipping</span><span>Free</span></div>
            <div class="border-t border-gray-200 pt-4 flex items-center justify-between text-lg font-bold text-gray-900"><span>Total</span><span>$${subtotal.toFixed(2)}</span></div>
          </div>
          <button class="w-full mt-6 bg-black text-white py-3 rounded-xl font-medium hover:bg-pink-600 transition">Proceed to Checkout</button>
        </div>
      </div>
    </div>`;

  document.querySelectorAll('.remove').forEach(button => button.addEventListener('click', () => removeFromCart(Number(button.dataset.id))));
  document.querySelectorAll('.increase').forEach(button => button.addEventListener('click', () => increaseQuantity(Number(button.dataset.id))));
  document.querySelectorAll('.decrease').forEach(button => button.addEventListener('click', () => decreaseQuantity(Number(button.dataset.id))));
}

renderCart();





