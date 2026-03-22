const products = {
  mods: [
    { id: 1, name: "OptiFine HD", desc: "Улучшение графики и FPS. Поддержка шейдеров.", price: 149, version: "1.8 – 1.21", emoji: "⚡" },
    { id: 2, name: "JourneyMap", desc: "Мини-карта в реальном времени с метками.", price: 99, version: "1.12 – 1.21", emoji: "🗺️" },
    { id: 3, name: "Inventory Tweaks", desc: "Автосортировка инвентаря одной кнопкой.", price: 79, version: "1.12 – 1.20", emoji: "🎒" },
    { id: 4, name: "Biomes O' Plenty", desc: "80+ новых биомов с уникальной флорой.", price: 199, version: "1.16 – 1.21", emoji: "🌿" },
  ],
  modpacks: [
    { id: 5, name: "DedPack Ultimate", desc: "200+ модов: магия, технологии, приключения.", price: 499, version: "1.20.1", emoji: "📦" },
    { id: 6, name: "SkyFactory 5", desc: "Скайблок с автоматизацией и прогрессией.", price: 399, version: "1.20.1", emoji: "☁️" },
    { id: 7, name: "RLCraft Hardcore", desc: "Хардкорное выживание с реалистичной физикой.", price: 349, version: "1.12.2", emoji: "💀" },
  ],
  shaders: [
    { id: 8, name: "SEUS Renewed", desc: "Реалистичное освещение и тени. Топ качество.", price: 249, version: "1.16+", emoji: "🌅" },
    { id: 9, name: "Complementary Shaders", desc: "Баланс красоты и производительности.", price: 179, version: "1.16+", emoji: "✨" },
    { id: 10, name: "BSL Shaders", desc: "Мягкие цвета, красивые закаты, лёгкий FPS.", price: 199, version: "1.12+", emoji: "🌄" },
  ]
};

let cart = [];

function renderGrid(containerId, items) {
  const grid = document.getElementById(containerId);
  grid.innerHTML = items.map(item => `
    <div class="card">
      <div class="card-img">${item.emoji}</div>
      <div class="card-body">
        <span class="badge">${item.version}</span>
        <h3>${item.name}</h3>
        <p>${item.desc}</p>
        <div class="card-footer">
          <span class="price">${item.price} ₽</span>
          <button class="add-btn" onclick="addToCart(${item.id})">В корзину</button>
        </div>
      </div>
    </div>
  `).join('');
}

function addToCart(id) {
  const all = [...products.mods, ...products.modpacks, ...products.shaders];
  const item = all.find(p => p.id === id);
  const existing = cart.find(c => c.id === id);
  if (existing) {
    existing.qty++;
  } else {
    cart.push({ ...item, qty: 1 });
  }
  updateCartCount();
  showToast(`${item.name} добавлен в корзину`);
}

function removeFromCart(id) {
  cart = cart.filter(c => c.id !== id);
  renderCart();
  updateCartCount();
}

function updateCartCount() {
  document.getElementById('cart-count').textContent = cart.reduce((s, c) => s + c.qty, 0);
}

function renderCart() {
  const list = document.getElementById('cart-items');
  const total = cart.reduce((s, c) => s + c.price * c.qty, 0);
  list.innerHTML = cart.length
    ? cart.map(c => `
        <li>
          <span>${c.emoji} ${c.name} × ${c.qty}</span>
          <span>${c.price * c.qty} ₽ <button onclick="removeFromCart(${c.id})">✕</button></span>
        </li>`).join('')
    : '<li style="color:#888">Корзина пуста</li>';
  document.getElementById('cart-total').textContent = total;
}

function toggleCart() {
  const overlay = document.getElementById('cart');
  const box = overlay.querySelector('.cart-box');

  if (overlay.classList.contains('hidden')) {
    // Открыть
    overlay.classList.remove('hidden');
    overlay.classList.add('visible');
    box.classList.remove('closing');
    renderCart();
  } else {
    // Закрыть с анимацией
    box.classList.add('closing');
    overlay.classList.remove('visible');
    setTimeout(() => {
      overlay.classList.add('hidden');
      box.classList.remove('closing');
    }, 250);
  }
}

function checkout() {
  if (!cart.length) return showToast('Корзина пуста');
  showToast('Заказ оформлен! Спасибо за покупку 🎉');
  cart = [];
  updateCartCount();
  renderCart();
  setTimeout(() => toggleCart(), 1500);
}

function showToast(msg) {
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.classList.remove('hidden');
  setTimeout(() => t.classList.add('hidden'), 2500);
}

// Плавный скролл для навигации
document.querySelectorAll('nav a:not(.cart-btn)').forEach(link => {
  link.addEventListener('click', (e) => {
    const href = link.getAttribute('href');
    if (href && href.startsWith('#')) {
      e.preventDefault();
      const target = document.querySelector(href);
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  });
});

// Плавный скролл для кнопки "Смотреть каталог"
document.querySelector('.hero .btn-primary').addEventListener('click', (e) => {
  e.preventDefault();
  document.querySelector('#mods').scrollIntoView({ behavior: 'smooth', block: 'start' });
});

// Клик по кнопке корзины в хедере
document.querySelector('.cart-btn').addEventListener('click', (e) => {
  e.preventDefault();
  toggleCart();
});

// Закрыть корзину по клику на фон
document.getElementById('cart').addEventListener('click', (e) => {
  if (e.target === e.currentTarget) toggleCart();
});

// Рендер
renderGrid('mods-grid', products.mods);
renderGrid('modpacks-grid', products.modpacks);
renderGrid('shaders-grid', products.shaders);
