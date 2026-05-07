const productKey = "shopflow_products";
const cartKey = "shopflow_cart";
const historyKey = "shopflow_orders";

const loginScreen = document.getElementById("loginScreen");
const appShell = document.getElementById("appShell");
const userNameInput = document.getElementById("userName");
const userRoleSelect = document.getElementById("userRole");
const loginForm = document.getElementById("loginForm");
const welcomeText = document.getElementById("welcomeText");
const categoryFilter = document.getElementById("categoryFilter");
const searchInput = document.getElementById("searchInput");
const productGrid = document.getElementById("productGrid");
const productCount = document.getElementById("productCount");
const categoryCount = document.getElementById("categoryCount");
const cartCount = document.getElementById("cartCount");
const cartPanel = document.getElementById("cartPanel");
const showCartBtn = document.getElementById("showCartBtn");
const closeCartBtn = document.getElementById("closeCartBtn");
const cartItems = document.getElementById("cartItems");
const cartTotal = document.getElementById("cartTotal");
const checkoutBtn = document.getElementById("checkoutBtn");
const checkoutModal = document.getElementById("checkoutModal");
const closeCheckoutBtn = document.getElementById("closeCheckoutBtn");
const checkoutForm = document.getElementById("checkoutForm");
const checkoutSummary = document.getElementById("checkoutSummary");
const checkoutTotal = document.getElementById("checkoutTotal");
const orderHistorySection = document.getElementById("orderHistorySection");
const historyList = document.getElementById("historyList");
const showOrdersBtn = document.getElementById("showOrdersBtn");
const closeOrdersBtn = document.getElementById("closeOrdersBtn");
const signOutBtn = document.getElementById("signOutBtn");
const adminPanelCard = document.getElementById("adminPanelCard");
const addProductBtn = document.getElementById("addProductBtn");
const productModal = document.getElementById("productModal");
const modalTitle = document.getElementById("modalTitle");
const closeModalBtn = document.getElementById("closeModalBtn");
const productForm = document.getElementById("productForm");
const productName = document.getElementById("productName");
const productCategory = document.getElementById("productCategory");
const productPrice = document.getElementById("productPrice");
const productImage = document.getElementById("productImage");
const productDescription = document.getElementById("productDescription");
const productRating = document.getElementById("productRating");
const themeToggle = document.getElementById("themeToggle");

const productCardTemplate = document.getElementById("productCardTemplate");
const cartItemTemplate = document.getElementById("cartItemTemplate");

let products = [];
let cart = [];
let orderHistory = [];
let currentUser = null;
let editingProductId = null;

const initialProducts = [
  {
    id: "coffee-mug",
    name: "Sunrise Coffee Mug",
    category: "Home",
    price: 16.99,
    description: "A premium ceramic mug with cheerful sunrise art.",
    image: "https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=800&q=80",
    rating: 4,
    wishlist: false,
  },
  {
    id: "urban-backpack",
    name: "Urban Backpack",
    category: "Accessories",
    price: 49.0,
    description: "Durable backpack built for everyday adventures.",
    image: "https://images.unsplash.com/photo-1520975914997-55e54134b217?auto=format&fit=crop&w=800&q=80",
    rating: 5,
    wishlist: false,
  },
  {
    id: "studio-headphones",
    name: "Studio Headphones",
    category: "Electronics",
    price: 89.5,
    description: "Clear sound and comfortable design for long listening sessions.",
    image: "https://images.unsplash.com/photo-1518445680336-712e7f0b4872?auto=format&fit=crop&w=800&q=80",
    rating: 4,
    wishlist: false,
  },
  {
    id: "plant-pot",
    name: "Mini Plant Pot",
    category: "Home",
    price: 12.5,
    description: "A stylish small pot for desk plants and herbs.",
    image: "https://images.unsplash.com/photo-1501004318641-b39e6451bec6?auto=format&fit=crop&w=800&q=80",
    rating: 4,
    wishlist: false,
  },
  {
    id: "retro-watch",
    name: "Retro Watch",
    category: "Accessories",
    price: 64.0,
    description: "Classic analog watch with leather strap.",
    image: "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=800&q=80",
    rating: 4,
    wishlist: false,
  },
];

function loadData() {
  const storedProducts = localStorage.getItem(productKey);
  const storedCart = localStorage.getItem(cartKey);
  const storedHistory = localStorage.getItem(historyKey);

  products = storedProducts ? JSON.parse(storedProducts) : [...initialProducts];
  cart = storedCart ? JSON.parse(storedCart) : [];
  orderHistory = storedHistory ? JSON.parse(storedHistory) : [];

  if (!storedProducts) {
    localStorage.setItem(productKey, JSON.stringify(products));
  }
}

function saveProducts() {
  localStorage.setItem(productKey, JSON.stringify(products));
}

function saveCart() {
  localStorage.setItem(cartKey, JSON.stringify(cart));
}

function saveOrders() {
  localStorage.setItem(historyKey, JSON.stringify(orderHistory));
}

function getUniqueCategories() {
  const categories = products.map((product) => product.category);
  return ["all", ...new Set(categories)];
}

function populateFilters() {
  categoryFilter.innerHTML = "";
  getUniqueCategories().forEach((category) => {
    const option = document.createElement("option");
    option.value = category.toLowerCase();
    option.textContent = category === "all" ? "All Categories" : category;
    categoryFilter.appendChild(option);
  });
}

function formatPrice(value) {
  return `$${value.toFixed(2)}`;
}

function renderProducts() {
  const query = searchInput.value.trim().toLowerCase();
  const selectedCategory = categoryFilter.value;

  const filtered = products.filter((product) => {
    const matchesText = product.name.toLowerCase().includes(query) || product.description.toLowerCase().includes(query);
    const matchesCategory = selectedCategory === "all" || product.category.toLowerCase() === selectedCategory;
    return matchesText && matchesCategory;
  });

  productGrid.innerHTML = "";

  if (!filtered.length) {
    productGrid.innerHTML = `<div class="card"><p>No products found. Try another search or filter.</p></div>`;
    return;
  }

  filtered.forEach((product) => {
    const card = productCardTemplate.content.cloneNode(true);
    const productCard = card.querySelector(".product-card");
    const image = card.querySelector(".product-image");
    const name = card.querySelector(".product-name");
    const desc = card.querySelector(".product-desc");
    const category = card.querySelector(".product-category");
    const price = card.querySelector(".product-price");
    const rating = card.querySelector(".product-rating");
    const wishlistBtn = card.querySelector(".wishlist-btn");
    const addCartBtn = card.querySelector(".add-cart-btn");

    image.style.backgroundImage = `url('${product.image}')`;
    name.textContent = product.name;
    desc.textContent = product.description;
    category.textContent = product.category;
    price.textContent = formatPrice(product.price);
    rating.textContent = "★".repeat(product.rating) + "☆".repeat(5 - product.rating);
    wishlistBtn.classList.toggle("active", product.wishlist);

    wishlistBtn.addEventListener("click", () => {
      product.wishlist = !product.wishlist;
      saveProducts();
      renderProducts();
    });

    addCartBtn.addEventListener("click", () => addToCart(product.id));

    if (currentUser.role === "admin") {
      const adminTools = document.createElement("div");
      adminTools.className = "admin-tools";
      adminTools.style.display = "flex";
      adminTools.style.justifyContent = "space-between";
      adminTools.style.gap = "10px";
      adminTools.style.padding = "0 18px 18px";
      adminTools.innerHTML = `
        <button class="secondary-btn edit-btn">Edit</button>
        <button class="ghost-btn delete-btn">Delete</button>
      `;

      productCard.appendChild(adminTools);

      adminTools.querySelector(".edit-btn").addEventListener("click", () => openProductForm(product));
      adminTools.querySelector(".delete-btn").addEventListener("click", () => removeProduct(product.id));
    }

    productGrid.appendChild(card);
  });

  productCount.textContent = filtered.length;
  categoryCount.textContent = getUniqueCategories().length - 1;
}

function renderCart() {
  cartItems.innerHTML = "";
  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  if (!cart.length) {
    cartItems.innerHTML = `<p style="color: var(--muted);">Your cart is empty. Add a product to begin.</p>`;
  }

  cart.forEach((item) => {
    const row = cartItemTemplate.content.cloneNode(true);
    row.querySelector(".cart-item-name").textContent = item.name;
    row.querySelector(".cart-item-meta").textContent = `${item.quantity} × ${formatPrice(item.price)}`;
    row.querySelector(".quantity-value").textContent = item.quantity;

    row.querySelector(".quantity-increase").addEventListener("click", () => updateQuantity(item.id, item.quantity + 1));
    row.querySelector(".quantity-decrease").addEventListener("click", () => updateQuantity(item.id, item.quantity - 1));
    row.querySelector(".remove-item").addEventListener("click", () => removeFromCart(item.id));

    cartItems.appendChild(row);
  });

  cartTotal.textContent = formatPrice(total);
  cartCount.textContent = cart.length;
  saveCart();
}

function updateQuantity(productId, newQuantity) {
  cart = cart.map((item) => {
    if (item.id === productId) {
      return { ...item, quantity: Math.max(1, newQuantity) };
    }
    return item;
  });
  renderCart();
}

function removeFromCart(productId) {
  cart = cart.filter((item) => item.id !== productId);
  renderCart();
}

function addToCart(productId) {
  const product = products.find((item) => item.id === productId);
  if (!product) return;

  const itemInCart = cart.find((item) => item.id === productId);
  if (itemInCart) {
    updateQuantity(productId, itemInCart.quantity + 1);
  } else {
    cart.push({ ...product, quantity: 1 });
    saveCart();
    renderCart();
  }
}

function openCart() {
  cartPanel.classList.remove("hidden");
}

function closeCart() {
  cartPanel.classList.add("hidden");
}

function openCheckout() {
  if (!cart.length) {
    alert("Add items to your cart before checking out.");
    return;
  }

  checkoutSummary.innerHTML = "";
  cart.forEach((item) => {
    const itemRow = document.createElement("p");
    itemRow.textContent = `${item.quantity} × ${item.name}`;
    checkoutSummary.appendChild(itemRow);
  });

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  checkoutTotal.textContent = formatPrice(total);
  checkoutModal.classList.remove("hidden");
}

function closeCheckout() {
  checkoutModal.classList.add("hidden");
}

function openOrderHistory() {
  orderHistorySection.classList.remove("hidden");
  renderHistory();
}

function closeOrderHistory() {
  orderHistorySection.classList.add("hidden");
}

function renderHistory() {
  historyList.innerHTML = "";
  if (!orderHistory.length) {
    historyList.innerHTML = `<div class="card"><p>No orders yet. Place your first order to track it here.</p></div>`;
    return;
  }

  orderHistory.slice().reverse().forEach((order) => {
    const card = document.createElement("div");
    card.className = "order-card";
    card.innerHTML = `
      <h4>${order.customerName} - ${order.date}</h4>
      <p><strong>Total:</strong> ${formatPrice(order.total)}</p>
      <p><strong>Items:</strong> ${order.items.length}</p>
      <p><strong>Address:</strong> ${order.address}</p>
    `;
    historyList.appendChild(card);
  });
}

function openProductForm(product = null) {
  productModal.classList.remove("hidden");
  if (product) {
    editingProductId = product.id;
    modalTitle.textContent = "Edit Product";
    productName.value = product.name;
    productCategory.value = product.category;
    productPrice.value = product.price;
    productImage.value = product.image;
    productDescription.value = product.description;
    productRating.value = product.rating;
  } else {
    editingProductId = null;
    modalTitle.textContent = "Add Product";
    productForm.reset();
    productRating.value = 4;
  }
}

function closeProductForm() {
  productModal.classList.add("hidden");
}

function removeProduct(productId) {
  if (!confirm("Delete this product from the store?")) return;
  products = products.filter((product) => product.id !== productId);
  saveProducts();
  populateFilters();
  renderProducts();
}

function saveProduct(event) {
  event.preventDefault();
  const newProduct = {
    id: editingProductId || `${productName.value.trim().toLowerCase().replace(/\s+/g, "-")}-${Date.now()}`,
    name: productName.value.trim(),
    category: productCategory.value.trim(),
    price: parseFloat(productPrice.value),
    image: productImage.value.trim(),
    description: productDescription.value.trim(),
    rating: Number(productRating.value),
    wishlist: false,
  };

  if (editingProductId) {
    products = products.map((product) => (product.id === editingProductId ? newProduct : product));
  } else {
    products.unshift(newProduct);
  }

  saveProducts();
  populateFilters();
  renderProducts();
  closeProductForm();
}

function displayWelcome() {
  welcomeText.textContent = `Hello, ${currentUser.name}! (${currentUser.role})`;
  adminPanelCard.classList.toggle("hidden", currentUser.role !== "admin");
  showOrdersBtn.classList.toggle("hidden", currentUser.role !== "user");
}

function signOut() {
  currentUser = null;
  loginScreen.classList.remove("hidden");
  appShell.classList.add("hidden");
}

function applyTheme(theme) {
  document.documentElement.setAttribute("data-theme", theme);
  themeToggle.textContent = theme === "dark" ? "Light Mode" : "Dark Mode";
  localStorage.setItem("shopflow_theme", theme);
}

function toggleTheme() {
  const currentTheme = document.documentElement.getAttribute("data-theme") === "dark" ? "light" : "dark";
  applyTheme(currentTheme);
}

function initTheme() {
  const stored = localStorage.getItem("shopflow_theme") || "light";
  applyTheme(stored);
}

loginForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const name = userNameInput.value.trim();
  const role = userRoleSelect.value;
  if (!name) return;
  currentUser = { name, role };
  loginScreen.classList.add("hidden");
  appShell.classList.remove("hidden");
  displayWelcome();
  renderProducts();
  renderCart();
});

searchInput.addEventListener("input", renderProducts);
categoryFilter.addEventListener("change", renderProducts);
showCartBtn.addEventListener("click", openCart);
closeCartBtn.addEventListener("click", closeCart);
checkoutBtn.addEventListener("click", openCheckout);
closeCheckoutBtn.addEventListener("click", closeCheckout);
showOrdersBtn.addEventListener("click", openOrderHistory);
closeOrdersBtn.addEventListener("click", closeOrderHistory);
signOutBtn.addEventListener("click", signOut);
addProductBtn.addEventListener("click", () => openProductForm());
closeModalBtn.addEventListener("click", closeProductForm);
productForm.addEventListener("submit", saveProduct);
checkoutForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const name = document.getElementById("customerName").value.trim();
  const email = document.getElementById("customerEmail").value.trim();
  const address = document.getElementById("customerAddress").value.trim();

  if (!name || !email || !address) return;

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const order = {
    id: `order-${Date.now()}`,
    customerName: name,
    email,
    address,
    items: cart,
    total,
    date: new Date().toLocaleString(),
  };

  orderHistory.push(order);
  saveOrders();
  cart = [];
  saveCart();
  renderCart();
  closeCheckout();
  closeCart();
  alert(`Thank you, ${name}! Your order has been placed. Total: ${formatPrice(total)}`);
});

themeToggle.addEventListener("click", toggleTheme);

window.addEventListener("click", (event) => {
  if (!event.target.closest(".modal-card") && !event.target.closest(".modal")) return;
});

loadData();
populateFilters();
initTheme();
renderCart();
