document.querySelectorAll(".brand-mark").forEach((mark) => {
  mark.style.backgroundImage = "url('assets/img/logo-mark.svg')";
  mark.style.backgroundSize = "cover";
  mark.innerHTML = "";
});
document.addEventListener("click", (e) => {
  if (e.target.closest('[data-action="logout"]')) {
    localStorage.removeItem("cde-session");
    location.reload();
  }
});
const currentSession = JSON.parse(
  localStorage.getItem("cde-session") || "null",
);
const catalogNav = document.createElement("a");
catalogNav.href = "catalogo.html";
catalogNav.textContent = "Catálogo";
document
  .querySelector(".main-nav")
  .insertBefore(catalogNav, document.querySelector(".admin-link"));
if (currentSession) {
  const accountLink = document.querySelector(".header-action");
  accountLink.querySelector("span").innerHTML =
    `Olá, ${currentSession.name.split(" ")[0]}<br><b>Minha conta</b>`;
  const logoutButton = document.createElement("button");
  logoutButton.className = "icon-btn logout-button";
  logoutButton.dataset.action = "logout";
  logoutButton.title = "Sair da conta";
  logoutButton.setAttribute("aria-label", "Sair da conta");
  logoutButton.innerHTML = '<i data-lucide="log-out"></i>';
  accountLink.parentElement.append(logoutButton);
}
[
  "categoryFilter",
  "sortFilter",
  "promoFilter",
  "stockFilter",
  "newFilter",
].forEach((id) =>
  document.getElementById(id).addEventListener("change", renderCatalog),
);
const products = [
  {
    id: 1,
    name: "Tênis Corre Vento 2",
    brand: "Olympikus",
    category: "Corrida",
    style: "Performance",
    price: 499.9,
    promo: 349.9,
    discount: 30,
    stock: 12,
    sales: 98,
    new: true,
    img: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=85",
    desc: "Leveza e resposta para transformar cada quilômetro. Cabedal respirável e entressola com amortecimento de alta performance.",
  },
  {
    id: 2,
    name: "Camisa Oficial Brasil 2024",
    brand: "Nike",
    category: "Futebol",
    style: "Torcedor",
    price: 349.9,
    promo: 279.9,
    discount: 20,
    stock: 8,
    sales: 145,
    new: false,
    img: "https://images.unsplash.com/photo-1579952363873-27f3bade9f55?auto=format&fit=crop&w=800&q=85",
    desc: "Vista a paixão pelo futebol com conforto e tecnologia que acompanha todos os seus movimentos.",
  },
  {
    id: 3,
    name: "Mochila Training Pro",
    brand: "Adidas",
    category: "Fitness",
    style: "Urbano",
    price: 299.9,
    promo: null,
    discount: 0,
    stock: 24,
    sales: 73,
    new: true,
    img: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=800&q=85",
    desc: "Espaço inteligente para sua rotina. Compartimento exclusivo para tênis e tecido resistente à água.",
  },
  {
    id: 4,
    name: "Bola de Basquete Elite",
    brand: "Spalding",
    category: "Basquete",
    style: "Performance",
    price: 189.9,
    promo: 149.9,
    discount: 21,
    stock: 16,
    sales: 121,
    new: false,
    img: "https://images.unsplash.com/photo-1519861531473-9200262188bf?auto=format&fit=crop&w=800&q=85",
    desc: "Controle preciso e aderência superior para dominar a quadra em qualquer partida.",
  },
  {
    id: 5,
    name: "Regata Essential Dry",
    brand: "Nike",
    category: "Fitness",
    style: "Performance",
    price: 159.9,
    promo: 119.9,
    discount: 25,
    stock: 31,
    sales: 110,
    new: true,
    img: "https://images.unsplash.com/photo-1558611848-73f7eb4001a1?auto=format&fit=crop&w=800&q=85",
    desc: "Tecido leve com tecnologia Dri-FIT que mantém você seco durante o treino.",
  },
  {
    id: 6,
    name: "Jaqueta Windrunner",
    brand: "Adidas",
    category: "Corrida",
    style: "Urbano",
    price: 459.9,
    promo: null,
    discount: 0,
    stock: 5,
    sales: 61,
    new: true,
    img: "https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?auto=format&fit=crop&w=800&q=85",
    desc: "Proteção contra vento com design icônico para acompanhar sua jornada.",
  },
  {
    id: 7,
    name: "Chuteira Phantom GX",
    brand: "Nike",
    category: "Futebol",
    style: "Performance",
    price: 899.9,
    promo: 699.9,
    discount: 22,
    stock: 3,
    sales: 88,
    new: false,
    img: "https://images.unsplash.com/photo-1511886929837-354d827aae26?auto=format&fit=crop&w=800&q=85",
    desc: "Precisão em cada toque. Feita para quem cria espaço e decide o jogo.",
  },
  {
    id: 8,
    name: "Corda Speed Rope",
    brand: "Vollo",
    category: "Fitness",
    style: "Performance",
    price: 89.9,
    promo: null,
    discount: 0,
    stock: 42,
    sales: 180,
    new: false,
    img: "https://images.unsplash.com/photo-1599058917212-d750089bc07e?auto=format&fit=crop&w=800&q=85",
    desc: "Velocidade, coordenação e condicionamento em um só equipamento.",
  },
];
let cart = JSON.parse(localStorage.getItem("cde-cart") || "[]"),
  favorites = JSON.parse(localStorage.getItem("cde-favorites") || "[]");
const money = (v) =>
    v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" }),
  $ = (s) => document.querySelector(s);
function card(p) {
  return `<article class="product-card"><button class="fav ${favorites.includes(p.id) ? "active" : ""}" data-fav="${p.id}" aria-label="Favoritar ${p.name}"><i data-lucide="heart"></i></button><div class="product-image" data-product="${p.id}">${p.promo ? `<span class="tag">-${p.discount}%</span>` : ""}<img src="${p.img}" alt="${p.name}" loading="lazy"></div><div class="product-info" data-product="${p.id}"><span class="product-meta">${p.brand} · ${p.category}</span><h3 class="product-name">${p.name}</h3><span class="price">${money(p.promo || p.price)}</span>${p.promo ? `<span class="old-price">${money(p.price)}</span><span class="discount">-${p.discount}%</span>` : ""}<span class="stock">● ${p.stock} em estoque</span><button class="product-add" data-add="${p.id}">Adicionar ao carrinho</button></div></article>`;
}
function icons() {
  if (window.lucide) lucide.createIcons();
}
function renderHome() {
  $("#promoProducts").innerHTML = products
    .filter((p) => p.promo)
    .slice(0, 4)
    .map(card)
    .join("");
  $("#newProducts").innerHTML = products
    .filter((p) => p.new)
    .slice(0, 4)
    .map(card)
    .join("");
  $("#bestProducts").innerHTML = [...products]
    .sort((a, b) => b.sales - a.sales)
    .slice(0, 4)
    .map(card)
    .join("");
  renderCatalog();
  icons();
}
function renderCatalog() {
  let q = $("#searchInput").value.toLowerCase(),
    category = $("#categoryFilter").value,
    sort = $("#sortFilter").value;
  let result = products.filter(
    (p) =>
      (!q ||
        `${p.name} ${p.brand} ${p.category} ${p.style}`
          .toLowerCase()
          .includes(q)) &&
      (!category || p.category === category) &&
      (!$("#promoFilter").checked || p.promo) &&
      (!$("#stockFilter").checked || p.stock > 0) &&
      (!$("#newFilter").checked || p.new),
  );
  result.sort((a, b) =>
    sort === "low"
      ? (a.promo || a.price) - (b.promo || b.price)
      : sort === "high"
        ? (b.promo || b.price) - (a.promo || a.price)
        : sort === "sales"
          ? b.sales - a.sales
          : sort === "discount"
            ? b.discount - a.discount
            : b.new - a.new,
  );
  $("#catalogProducts").innerHTML = result.map(card).join("");
  icons();
}
function updateCart() {
  let count = cart.reduce((a, i) => a + i.qty, 0);
  $("#cartCount").textContent = count;
  $("#drawerCount").textContent = `${count} ${count === 1 ? "item" : "itens"}`;
  let subtotal = 0,
    discount = 0;
  $("#cartItems").innerHTML = cart.length
    ? cart
        .map((i) => {
          let p = products.find((x) => x.id === i.id);
          subtotal += p.price * i.qty;
          discount += (p.price - (p.promo || p.price)) * i.qty;
          return `<div class="cart-row"><img src="${p.img}" alt="${p.name}"><div><h3>${p.name}</h3><p>${p.brand}</p><div class="qty"><button data-qty="${p.id}" data-delta="-1">−</button><span>${i.qty}</span><button data-qty="${p.id}" data-delta="1">+</button></div></div><div><button class="cart-remove" data-remove="${p.id}" aria-label="Remover"><i data-lucide="trash-2"></i></button><strong>${money((p.promo || p.price) * i.qty)}</strong></div></div>`;
        })
        .join("")
    : '<div class="empty"><i data-lucide="shopping-bag"></i><h3>Seu carrinho está vazio</h3><p>Adicione algo para começar seu próximo movimento.</p></div>';
  $("#cartSubtotal").textContent = money(subtotal);
  $("#cartDiscount").textContent = `- ${money(discount)}`;
  $("#cartTotal").textContent = money(subtotal - discount);
  localStorage.setItem("cde-cart", JSON.stringify(cart));
  icons();
}
function openCart() {
  $("#cartDrawer").classList.add("open");
  $("#overlay").classList.add("show");
  updateCart();
}
function closeLayers() {
  $(".drawer").classList.remove("open");
  $(".modal").classList.remove("show");
  $("#overlay").classList.remove("show");
}
function openProduct(id) {
  let p = products.find((x) => x.id === id);
  $("#productDetail").innerHTML =
    `<div class="product-detail"><div class="detail-photo"><img src="${p.img}" alt="${p.name}"></div><div class="detail-copy"><span class="product-meta">${p.brand} · ${p.category} · ${p.style}</span><h2>${p.name}</h2><p class="description">${p.desc}</p><div class="detail-price">${money(p.promo || p.price)} ${p.promo ? `<span class="old-price">${money(p.price)}</span><span class="discount">-${p.discount}% OFF</span>` : ""}</div><span class="stock">● ${p.stock} unidades disponíveis</span><p class="product-meta" style="margin-top:25px">TAMANHO</p><div class="select-row"><button class="selected">P</button><button>M</button><button>G</button><button>GG</button></div><button class="button button-gold full" data-add="${p.id}">Adicionar ao carrinho <i data-lucide="shopping-bag"></i></button><button class="button full buy-button" data-add="${p.id}" data-buy>Comprar agora <i data-lucide="arrow-right"></i></button></div></div>`;
  $("#productModal").classList.add("show");
  $("#overlay").classList.add("show");
  icons();
}
function toast(msg) {
  $("#toast span").textContent = msg;
  $("#toast").classList.add("show");
  setTimeout(() => $("#toast").classList.remove("show"), 2200);
}
document.addEventListener("click", (e) => {
  let el = e.target.closest(
    "[data-action],[data-add],[data-fav],[data-product],[data-remove],[data-qty],[data-category]",
  );
  if (!el) return;
  if (el.dataset.action === "cart") openCart();
  if (el.dataset.action === "close-cart" || el.dataset.action === "close-modal")
    closeLayers();
  if (el.dataset.action === "account") {
    $("#accountModal").classList.add("show");
    $("#overlay").classList.add("show");
    icons();
  }
  if (el.dataset.action === "admin")
    toast("Área administrativa preparada para Supabase");
  if (el.dataset.add) {
    let id = +el.dataset.add,
      item = cart.find((x) => x.id === id);
    if (item) item.qty++;
    else cart.push({ id, qty: 1 });
    updateCart();
    toast("Produto adicionado ao carrinho");
    if (el.dataset.buy) {
      closeLayers();
      openCart();
    }
  }
  if (el.dataset.fav) {
    let id = +el.dataset.fav;
    favorites.includes(id)
      ? (favorites = favorites.filter((x) => x !== id))
      : favorites.push(id);
    localStorage.setItem("cde-favorites", JSON.stringify(favorites));
    $("#favoritesCount").textContent = favorites.length;
    renderHome();
    toast(
      favorites.includes(id)
        ? "Adicionado aos favoritos"
        : "Removido dos favoritos",
    );
  }
  if (el.dataset.product) openProduct(+el.dataset.product);
  if (el.dataset.remove) {
    cart = cart.filter((x) => x.id !== +el.dataset.remove);
    updateCart();
  }
  if (el.dataset.qty) {
    let item = cart.find((x) => x.id === +el.dataset.qty);
    item.qty += +el.dataset.delta;
    if (item.qty < 1) cart = cart.filter((x) => x !== item);
    updateCart();
  }
  if (el.dataset.category) {
    location.hash = "catalogo";
    toast(`Filtrando por ${el.dataset.category}`);
  }
});
$("#overlay").addEventListener("click", closeLayers);
$("#searchInput").addEventListener("input", (e) => {
  let q = e.target.value.toLowerCase();
  document
    .querySelectorAll(".product-card")
    .forEach(
      (c) =>
        (c.style.display = c.textContent.toLowerCase().includes(q)
          ? ""
          : "none"),
    );
});
$("#accountForm").addEventListener("submit", (e) => {
  e.preventDefault();
  closeLayers();
  toast("Login demonstrativo realizado");
});
$("#favoritesCount").textContent = favorites.length;
renderHome();
updateCart();
