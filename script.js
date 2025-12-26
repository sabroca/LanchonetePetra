// ===============================
// Lanchonete Petra — script
// Cardápio + Carrinho + Checkout no WhatsApp
// ===============================

// Número da loja (DDI +55 + DDD + número)
const WHATSAPP_NUMBER = "5511998739194";

const storeName = "Lanchonete Petra";

const products = [
  { id: "x-salada", name: "X-Salada", category: "lanches", price: "R$ 18,90", description: "Pão, hambúrguer, queijo, alface e tomate.", image: "assets/img/lanche.png" },
  { id: "x-bacon", name: "X-Bacon", category: "lanches", price: "R$ 22,90", description: "Hambúrguer suculento com bacon crocante e cheddar.", image: "assets/img/lanche.png" },
  { id: "x-frango", name: "X-Frango", category: "lanches", price: "R$ 21,90", description: "Frango grelhado, queijo, salada e molho especial.", image: "assets/img/lanche.png" },

  { id: "batata", name: "Batata Frita", category: "porções", price: "R$ 19,90", description: "Porção generosa de batata frita crocante.", image: "assets/img/batata.png" },
  { id: "calabresa", name: "Calabresa Acebolada", category: "porções", price: "R$ 27,90", description: "Calabresa na chapa com cebola e limão.", image: "assets/img/calabresa.png" },
  { id: "nuggets", name: "Nuggets", category: "porções", price: "R$ 16,90", description: "Nuggets douradinhos com molho da casa.", image: "assets/img/nuggets.png" },

  { id: "refri-coca", name: "Refrigerante Lata Coca-Cola", category: "bebidas", price: "R$ 6,00", description: "Lata 350ml.", image: "assets/img/refrigerante.jpg" },
  { id: "refri-fanta", name: "Refrigerante Lata Fanta Laranja", category: "bebidas", price: "R$ 6,00", description: "Lata 350ml.", image: "assets/img/refrigerante.jpg" },

  { id: "suco-laranja", name: "Suco Natural", category: "bebidas", price: "R$ 9,00", description: "Suco feito na hora — Laranja.", image: "assets/img/suco.jpg" },
  { id: "suco-manga", name: "Suco Natural", category: "bebidas", price: "R$ 9,00", description: "Suco feito na hora — Manga.", image: "assets/img/suco.jpg" },
  { id: "suco-abacaxi", name: "Suco Natural", category: "bebidas", price: "R$ 9,00", description: "Suco feito na hora — Abacaxi.", image: "assets/img/suco.jpg" },
];

// ------------------------------
// Helpers
// ------------------------------
function parseBRL(text){
  const n = (text || "").replace(/[^0-9,]/g, "").replace(",", ".");
  return Number(n || 0);
}
function formatBRL(value){
  return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}
function buildWhatsAppLink(message) {
  const text = encodeURIComponent(message);
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${text}`;
}
function showToast(text) {
  const toast = document.getElementById("toast");
  toast.textContent = text;
  toast.classList.add("show");
  window.clearTimeout(showToast._t);
  showToast._t = window.setTimeout(() => toast.classList.remove("show"), 2400);
}

// ------------------------------
// Cart state (localStorage)
// ------------------------------
const CART_KEY = "petra_cart_v1";

function loadCart(){
  try{ return JSON.parse(localStorage.getItem(CART_KEY)) || {}; }
  catch{ return {}; }
}
function saveCart(cart){
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
}
function getCartItems(){
  const cart = loadCart();
  return Object.entries(cart).map(([id, qty]) => {
    const p = products.find(x => x.id === id);
    if(!p) return null;
    return { ...p, qty };
  }).filter(Boolean);
}
function cartCount(){
  const cart = loadCart();
  return Object.values(cart).reduce((a,b)=>a+b,0);
}
function addToCart(id, qty=1){
  const cart = loadCart();
  cart[id] = (cart[id] || 0) + qty;
  if(cart[id] <= 0) delete cart[id];
  saveCart(cart);
}
function setQty(id, qty){
  const cart = loadCart();
  if(qty <= 0) delete cart[id];
  else cart[id] = qty;
  saveCart(cart);
}
function removeFromCart(id){
  const cart = loadCart();
  delete cart[id];
  saveCart(cart);
}
function cartTotals(){
  const items = getCartItems();
  const subtotal = items.reduce((sum, it)=> sum + parseBRL(it.price) * it.qty, 0);
  return { subtotal, total: subtotal };
}

// ------------------------------
// UI: Menu cards
// ------------------------------
function createCard(p) {
  const article = document.createElement("article");
  article.className = "card";
  article.dataset.category = p.category;

  article.innerHTML = `
    <img class="card__img" src="${p.image}" alt="${p.name}">
    <div class="card__body">
      <div class="card__top">
        <h3 class="card__title">${p.name}</h3>
        <p class="card__price">${p.price}</p>
      </div>
      <p class="card__desc">${p.description}</p>
      <div class="card__meta">
        <span class="pill ${p.category}">${p.category}</span>
      </div>
      <button class="btn btn--primary" data-add="${p.id}">Adicionar ao carrinho</button>
    </div>
  `;

  article.querySelector('[data-add]').addEventListener("click", () => {
    addToCart(p.id, 1);
    updateCartBadge();
    renderCart();
    showToast("Adicionado ao carrinho ✅");
    animateAddToCart();
  });

  return article;
}

function renderMenu(list) {
  const grid = document.getElementById("menuGrid");
  grid.innerHTML = "";
  list.forEach(p => grid.appendChild(createCard(p)));
}

function animateAddToCart(){
  const btn = document.getElementById("cartBtn");
  if(!btn) return;
  btn.classList.remove("pop");
  void btn.offsetWidth;
  btn.classList.add("pop");

  const bubble = document.createElement("div");
  bubble.className = "floating-plus";
  bubble.textContent = "+1";
  document.body.appendChild(bubble);
  window.setTimeout(() => bubble.remove(), 900);
}

// ------------------------------
// Filters
// ------------------------------
function setActiveChip(btn) {
  document.querySelectorAll(".chip").forEach(b => b.classList.remove("is-active"));
  btn.classList.add("is-active");
}
function filterProducts(filter) {
  if (filter === "tudo") return products;
  return products.filter(p => p.category === filter);
}
function initFilters() {
  const chips = document.querySelectorAll(".chip");
  chips.forEach(btn => {
    btn.addEventListener("click", () => {
      const filter = btn.dataset.filter;
      setActiveChip(btn);
      renderMenu(filterProducts(filter));
      showToast(filter === "tudo" ? "Mostrando tudo" : `Filtrando: ${filter}`);
    });
  });
}

// ------------------------------
// WhatsApp buttons (hero/footer)
// ------------------------------
function initWhatsAppButtons() {
  const heroBtn = document.getElementById("btn-whatsapp-hero");
  const footerBtn = document.getElementById("btn-whatsapp-footer");

  const message = `Olá! Quero fazer um pedido na *${storeName}* 🙂`;
  const link = buildWhatsAppLink(message);

  heroBtn.href = link;
  footerBtn.href = link;
}

// ------------------------------
// Mobile nav
// ------------------------------
function initMobileNav() {
  const toggle = document.querySelector(".nav-toggle");
  const nav = document.querySelector(".nav");

  toggle.addEventListener("click", () => {
    const open = nav.classList.toggle("is-open");
    toggle.setAttribute("aria-expanded", String(open));
  });

  document.querySelectorAll(".nav__link").forEach(link => {
    link.addEventListener("click", () => {
      nav.classList.remove("is-open");
      toggle.setAttribute("aria-expanded", "false");
    });
  });
}

function initYear() {
  document.getElementById("year").textContent = new Date().getFullYear();
}

// ------------------------------
// Cart modal
// ------------------------------
const modal = () => document.getElementById("cartModal");

function openCart(){
  modal().classList.add("is-open");
  modal().setAttribute("aria-hidden", "false");
  renderCart();
}
function closeCart(){
  modal().classList.remove("is-open");
  modal().setAttribute("aria-hidden", "true");
}

function initCartModal(){
  const btn = document.getElementById("cartBtn");
  const close = document.getElementById("cartClose");
  const cont = document.getElementById("continueShopping");

  btn.addEventListener("click", () => openCart());
  close.addEventListener("click", () => closeCart());

  if(cont){
    cont.addEventListener("click", () => {
      closeCart();
      document.querySelector("#cardapio")?.scrollIntoView({ behavior: "smooth" });
      showToast("Escolha mais itens no cardápio 😉");
    });
  }

  modal().addEventListener("click", (e) => {
    const closeAttr = e.target?.getAttribute?.("data-close");
    if(closeAttr) closeCart();
  });

  document.addEventListener("keydown", (e) => {
    if(e.key === "Escape" && modal().classList.contains("is-open")) closeCart();
  });
}

function updateCartBadge(){
  document.getElementById("cartCount").textContent = String(cartCount());
  const { total } = cartTotals();
  const miniTotal = document.getElementById("cartMiniTotal");
  if(miniTotal) miniTotal.textContent = formatBRL(total);
}

// ------------------------------
// Render cart
// ------------------------------
function renderCart(){
  const itemsWrap = document.getElementById("cartItems");
  const items = getCartItems();

  itemsWrap.innerHTML = "";

  if(items.length === 0){
    itemsWrap.innerHTML = `
      <div class="info-card" style="margin-top:8px;">
        <div class="info-card__icon">🛒</div>
        <div>
          <h3>Carrinho vazio</h3>
          <p>Adicione itens do cardápio para finalizar seu pedido.</p>
        </div>
      </div>`;
  }else{
    items.forEach(it => {
      const div = document.createElement("div");
      div.className = "cart-item";
      div.innerHTML = `
        <img class="cart-item__img" src="${it.image}" alt="${it.name}">
        <div>
          <p class="cart-item__title">${it.name}</p>
          <p class="cart-item__desc">${it.price} • ${it.category}</p>
          <div class="cart-item__row">
            <div class="qty">
              <button type="button" data-dec="${it.id}">−</button>
              <span>${it.qty}</span>
              <button type="button" data-inc="${it.id}">+</button>
            </div>
            <div style="display:flex;align-items:center;gap:10px;">
              <span class="cart-item__price">${formatBRL(parseBRL(it.price) * it.qty)}</span>
              <button type="button" class="remove" data-remove="${it.id}">Remover</button>
            </div>
          </div>
        </div>
      `;

      div.querySelector(`[data-dec="${it.id}"]`).addEventListener("click", () => {
        setQty(it.id, it.qty - 1);
        updateCartBadge();
        renderCart();
      });
      div.querySelector(`[data-inc="${it.id}"]`).addEventListener("click", () => {
        setQty(it.id, it.qty + 1);
        updateCartBadge();
        renderCart();
      });
      div.querySelector(`[data-remove="${it.id}"]`).addEventListener("click", () => {
        removeFromCart(it.id);
        updateCartBadge();
        renderCart();
        showToast("Item removido");
      });

      itemsWrap.appendChild(div);
    });
  }

  const { subtotal, total } = cartTotals();
  document.getElementById("cartSubtotal").textContent = formatBRL(subtotal);
  document.getElementById("cartTotal").textContent = formatBRL(total);

  document.getElementById("checkoutBtn").disabled = items.length === 0;
  document.getElementById("checkoutBtn").style.opacity = items.length === 0 ? ".6" : "1";
  document.getElementById("checkoutBtn").style.cursor = items.length === 0 ? "not-allowed" : "pointer";
}

// ------------------------------
// Checkout form -> WhatsApp
// ------------------------------
function initCheckout(){
  const form = document.getElementById("checkoutForm");
  const paymentSelect = document.getElementById("paymentMethod");
  const changeRow = document.getElementById("changeRow");

  function setPaymentMode(){
    const v = paymentSelect?.value || "";
    if(!changeRow) return;
    changeRow.style.display = (v === "Dinheiro") ? "grid" : "none";
    if(v !== "Dinheiro"){
      const c = form.querySelector('input[name="needChange"]');
      if(c) c.value = "";
    }
  }

  if(paymentSelect) paymentSelect.addEventListener("change", setPaymentMode);
  setPaymentMode();

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const items = getCartItems();
    if(items.length === 0){
      showToast("Seu carrinho está vazio.");
      return;
    }

    const data = new FormData(form);

    const customerName = String(data.get("customerName") || "").trim();
    const customerWhatsapp = String(data.get("customerWhatsapp") || "").trim();
    const deliveryType = String(data.get("deliveryType") || "entrega").trim();
    const paymentMethod = String(data.get("paymentMethod") || "").trim();

    const needChange = String(data.get("needChange") || "").trim();

    const street = String(data.get("street") || "").trim();
    const number = String(data.get("number") || "").trim();
    const neighborhood = String(data.get("neighborhood") || "").trim();
    const complement = String(data.get("complement") || "").trim();
    const notes = String(data.get("notes") || "").trim();

    if(!customerName || !customerWhatsapp){
      showToast("Preencha Nome e WhatsApp (*)");
      return;
    }
    if(!paymentMethod){
      showToast("Selecione a forma de pagamento (*)");
      return;
    }

    if(deliveryType === "entrega"){
      if(!street || !number || !neighborhood){
        showToast("Preencha o endereço completo (*)");
        return;
      }
    }

    const { subtotal, total } = cartTotals();

    const lines = [];
    lines.push(`Olá! Gostaria de fazer um pedido na *${storeName}* ✅`);
    lines.push("");
    lines.push("*PEDIDO:*");
    items.forEach(it => {
      const itemTotal = parseBRL(it.price) * it.qty;
      lines.push(`• ${it.qty}x ${it.name} — ${formatBRL(itemTotal)}`);
    });

    lines.push("");
    lines.push(`Subtotal: ${formatBRL(subtotal)}`);
    lines.push(`*TOTAL:* ${formatBRL(total)}`);
    lines.push("");

    lines.push("*DADOS DO CLIENTE:*");
    lines.push(`Nome: ${customerName}`);
    lines.push(`WhatsApp: ${customerWhatsapp}`);
    lines.push("");

    lines.push(`*FORMA:* ${deliveryType === "entrega" ? "Entrega" : "Retirada no balcão"}`);
    lines.push(`*PAGAMENTO:* ${paymentMethod}`);

    if(paymentMethod === "Dinheiro" && needChange){
      const v = parseBRL(needChange);
      if(v > 0) lines.push(`Troco para: ${formatBRL(v)}`);
    }

    if(deliveryType === "entrega"){
      lines.push("");
      lines.push("*ENDEREÇO:*");
      lines.push(`Rua: ${street}`);
      lines.push(`Número: ${number}`);
      lines.push(`Bairro: ${neighborhood}`);
      if(complement) lines.push(`Complemento: ${complement}`);
    }

    if(notes){
      lines.push("");
      lines.push("*OBSERVAÇÕES:*");
      lines.push(notes);
    }

    lines.push("");
    lines.push("Obrigado! 😊");

    const message = lines.join("\\n");
    const url = buildWhatsAppLink(message);

    localStorage.removeItem(CART_KEY);
    updateCartBadge();

    window.open(url, "_blank");
    closeCart();
    showToast("Abrindo WhatsApp…");
    renderCart();
  });
}

// ------------------------------
// INIT
// ------------------------------
renderMenu(products);
initFilters();
initWhatsAppButtons();
initMobileNav();
initYear();
initCartModal();
initCheckout();
updateCartBadge();
renderCart();
