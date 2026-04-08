const menuBtn = document.getElementById("menuBtn");
const mobileMenu = document.getElementById("mobileMenu");

menuBtn.addEventListener("click", () => {
    mobileMenu.classList.toggle("hidden");
});


const sections = document.querySelectorAll("#main");
const navLinks = document.querySelectorAll(".nav-link");

function updateActiveNav() {
    const currentId = "";

    sections.forEach((section) => {
        const sectionTop = section.offsetTop - 120;
        const sectionHeight = section.offsetHeight;

        if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
            currentId = section.getAttribute("id");
        }
    });

    navLinks.forEach((link) => {
        link.classList.remove("text-accent");

        if (link.getAttribute("href") === `#${currentId}`) {
            link.classList.add("text-accent");
        }
    });
}

window.addEventListener("scroll", updateActiveNav);
updateActiveNav();


const revealItems = document.querySelectorAll("main");

revealItems.forEach((item) => {
    item.classList.add(
        "opacity-0",
        "translate-y-6",
        "transition",
        "duration-700",
        "ease-out"
    );
});

const revealObserver = new IntersectionObserver(
    (entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.remove("opacity-0", "translate-y-6");
                entry.target.classList.add("opacity-100", "translate-y-0");
                revealObserver.unobserve(entry.target);
            }
        });
    },
    {
        threshold: 0.12,
    }
);

revealItems.forEach((item) => revealObserver.observe(item));

const backToTop = document.getElementById("backToTop");

if (backToTop) {
    // hide it on first load
    backToTop.classList.add("hidden");

    window.addEventListener("scroll", () => {
        if (window.scrollY > 10) {
            backToTop.classList.remove("hidden");
            backToTop.classList.add("flex");
        } else {
            backToTop.classList.add("hidden");
            backToTop.classList.remove("flex");
        }
    });

    backToTop.addEventListener("click", () => {
        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    });
}



// Global variable
let cartItemsCount = 0;

// Function to update count
function updateCartCount(change) {
  cartItemsCount += change;

  // Prevent going below 0
  if (cartItemsCount < 0) {
    cartItemsCount = 0;
  }

  // Update UI
  const cartCountEl = document.getElementById("cartCount");
  if (cartCountEl) {
    cartCountEl.textContent = cartItemsCount;
  }
}

// Add buttons
document.querySelectorAll(".add-btn").forEach(button => {
  button.addEventListener("click", () => {
    updateCartCount(+1);
  });
});

// Remove buttons
document.querySelectorAll(".remove-btn").forEach(button => {
  button.addEventListener("click", () => {
    updateCartCount(-1);
  });
});


function addToCart(product) {
  const cart = getCart();
  const existingItem = cart.find(item => item.id === product.id);
  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cart.push({ ...product, quantity: 1 });
  }
  saveCart(cart);
  alert(`${product.title} added to cart`);
}