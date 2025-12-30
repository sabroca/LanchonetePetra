// ===============================
// Lanchonete Petra — script
// Cardápio + Carrinho + Checkout no WhatsApp
// ===============================

const WHATSAPP_NUMBER = "5511998739194";
const storeName = "Lanchonete Petra";

const products = [
  { id: "combo3", name: "Combo Petra 3", category: "favoritos", price: "R$ 39,90", description: "2 X-Bancon + Batata Frita M + Nuggets + 2 Refrigerante lata.", image: "assets/img/combo3.png" },
  { id: "fav-batata", name: "Batata Frita", category: "favoritos", price: "R$ 39,90", description: "Porção generosa de batata frita SUPREMA.", image: "assets/img/batata2.png" },
  { id: "porcao6", name: "Frango a Passarinho", category: "favoritos", price: "R$ 29,90", description: "Porção crocante com alho e limão.", image: "assets/img/frangopassarinho.png" },
  
  { id: "combo1", name: "Combo Petra 1", category: "combos", price: "R$ 29,90", description: "X-Salada + Batata (M) + Refrigerante lata.", image: "assets/img/combo1.png" },
  { id: "combo2", name: "Combo Petra 2", category: "combos", price: "R$ 34,90", description: "X-Bacon + Nuggets + Refrigerante lata.", image: "assets/img/combo2.png" },
  { id: "combo3", name: "Combo Petra 3", category: "combos", price: "R$ 39,90", description: "2 X-Bancon + Batata Frita M + Nuggets + 2 Refrigerante lata.", image: "assets/img/combo3.png" },

  { id: "lanche1", name: "X-Salada", category: "lanches", price: "R$ 18,90", description: "Pão, hambúrguer, queijo, alface e tomate.", image: "assets/img/X-Salada.png" },
  { id: "lanche2", name: "X-Frango", category: "lanches", price: "R$ 21,90", description: "Frango grelhado, queijo, salada e molho especial.", image: "assets/img/X-Frango.png" },
  { id: "lanche3", name: "X-Tudo", category: "lanches", price: "R$ 26,90", description: "Hambúrguer, bacon, ovo, queijo, salada e molhos.", image: "assets/img/lanche.png" },
  { id: "lanche4", name: "X-Calabresa", category: "lanches", price: "R$ 23,90", description: "Calabresa acebolada, queijo e vinagrete.", image: "assets/img/X-Calabresa.png" },
  { id: "lanche5", name: "X-Egg", category: "lanches", price: "R$ 20,90", description: "Hambúrguer, queijo e ovo na chapa.", image: "assets/img/X-Egg.png" },
  { id: "lanche6", name: "X-Bacon Duplo", category: "lanches", price: "R$ 28,90", description: "Dois hambúrgueres, bacon, cheddar e molho da casa.", image: "assets/img/X-Bacon Duplo.png" },

  { id: "porcao1", name: "Batata Frita (P)", category: "porções", price: "R$ 14,90", description: "Batata frita crocante (tamanho pequeno).", image: "assets/img/batata.png" },
  { id: "porcao2", name: "Batata Frita (M)", category: "porções", price: "R$ 19,90", description: "Batata frita crocante (tamanho médio).", image: "assets/img/batata.png" },
  { id: "porcao3", name: "Batata Frita (G)", category: "porções", price: "R$ 24,90", description: "Batata frita crocante (tamanho grande).", image: "assets/img/batata.png" },
  { id: "porcao4", name: "Calabresa Acebolada", category: "porções", price: "R$ 27,90", description: "Calabresa na chapa com cebola e limão.", image: "assets/img/calabresa.png" },
  { id: "porcao5", name: "Nuggets", category: "porções", price: "R$ 16,90", description: "Nuggets douradinhos com molho da casa.", image: "assets/img/nuggets.png" },
  { id: "porcao6", name: "Frango a Passarinho", category: "porções", price: "R$ 29,90", description: "Porção crocante com alho e limão.", image: "assets/img/frangopassarinho.png" },

  { id: "bebida1", name: "Refrigerante Lata (Coca-Cola)", category: "bebidas", price: "R$ 6,00", description: "350ml.", image: "assets/img/refrigerante.jpg" },
  { id: "bebida1", name: "Refrigerante Lata (Fanta)", category: "bebidas", price: "R$ 6,00", description: "350ml.", image: "assets/img/refrigerante.jpg" },
  { id: "bebida2", name: "Água (500ml)", category: "bebidas", price: "R$ 4,00", description: "Mineral.", image: "assets/img/agua.png" },
  { id: "bebida3", name: "Suco Natural de Manga", category: "bebidas", price: "R$ 9,00", description: "Suco natural, feito na hora.", image: "assets/img/suco.jpg" },
  { id: "bebida4", name: "Suco Natural de Abacaxi", category: "bebidas", price: "R$ 9,00", description: "Suco natural, feito na hora.", image: "assets/img/suco.jpg" },
  { id: "bebida5", name: "Suco Natural de Laranja", category: "bebidas", price: "R$ 9,00", description: "Suco natural, feito na hora.", image: "assets/img/suco.jpg" },
];

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
  if(!toast) return;
  toast.textContent = text;
  toast.classList.add("show");
  window.clearTimeout(showToast._t);
  showToast._t = window.setTimeout(() => toast.classList.remove("show"), 2400);
}

const CART_KEY = "petra_cart_v2";

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
        <span class="pill">${p.category}</span>
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
  if(!grid) return;
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

function initWhatsAppButtons() {
  const heroBtn = document.getElementById("btn-whatsapp-hero");
  const contactBtn = document.getElementById("btn-whatsapp-contact");
  const link = buildWhatsAppLink(`Olá! Quero falar com a ${storeName} 🙂`);
  if(heroBtn) heroBtn.href = link;
  if(contactBtn) contactBtn.href = link;
}

function initMobileNav() {
  const toggle = document.querySelector(".nav-toggle");
  const nav = document.querySelector(".nav");
  if(!toggle || !nav) return;

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
  const y = document.getElementById("year");
  if(y) y.textContent = new Date().getFullYear();
}

const modal = () => document.getElementById("cartModal");
function openCart(){
  modal()?.classList.add("is-open");
  modal()?.setAttribute("aria-hidden", "false");
  renderCart();
}
function closeCart(){
  modal()?.classList.remove("is-open");
  modal()?.setAttribute("aria-hidden", "true");
}
function initCartModal(){
  const btn = document.getElementById("cartBtn");
  const close = document.getElementById("cartClose");
  const cont = document.getElementById("continueShopping");

  if(btn) btn.addEventListener("click", () => openCart());
  if(close) close.addEventListener("click", () => closeCart());
  if(cont){
    cont.addEventListener("click", () => {
      closeCart();
      document.querySelector("#cardapio")?.scrollIntoView({ behavior: "smooth" });
      showToast("Escolha mais itens no cardápio 😉");
    });
  }

  modal()?.addEventListener("click", (e) => {
    const closeAttr = e.target?.getAttribute?.("data-close");
    if(closeAttr) closeCart();
  });

  document.addEventListener("keydown", (e) => {
    if(e.key === "Escape" && modal()?.classList.contains("is-open")) closeCart();
  });
}

function updateCartBadge(){
  const countEl = document.getElementById("cartCount");
  const totalEl = document.getElementById("cartMiniTotal");
  if(countEl) countEl.textContent = String(cartCount());
  const { total } = cartTotals();
  if(totalEl) totalEl.textContent = formatBRL(total);
}

function renderCart(){
  const itemsWrap = document.getElementById("cartItems");
  const items = getCartItems();
  if(!itemsWrap) return;

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
  const subEl = document.getElementById("cartSubtotal");
  const totEl = document.getElementById("cartTotal");
  if(subEl) subEl.textContent = formatBRL(subtotal);
  if(totEl) totEl.textContent = formatBRL(total);

  const btn = document.getElementById("checkoutBtn");
  if(btn){
    btn.disabled = items.length === 0;
    btn.style.opacity = items.length === 0 ? ".6" : "1";
    btn.style.cursor = items.length === 0 ? "not-allowed" : "pointer";
  }
}

function initCheckout(){
  const form = document.getElementById("checkoutForm");
  if(!form) return;

  const addressSection = document.getElementById("addressSection");
  const paymentSelect = document.getElementById("paymentMethod");
  const changeRow = document.getElementById("changeRow");

  const addressInputs = () => [
    form.querySelector('input[name="street"]'),
    form.querySelector('input[name="number"]'),
    form.querySelector('input[name="neighborhood"]'),
  ];

  function setDeliveryMode(){
    const type = form.querySelector('input[name="deliveryType"]:checked')?.value || "entrega";
    const isDelivery = type === "entrega";
    if(addressSection) addressSection.style.display = isDelivery ? "block" : "none";
    addressInputs().forEach(i => {
      if(!i) return;
      i.required = isDelivery;
      if(!isDelivery) i.value = "";
    });
  }

  function setPaymentMode(){
    const v = paymentSelect?.value || "";
    if(!changeRow) return;
    changeRow.style.display = (v === "Dinheiro") ? "grid" : "none";
    if(v !== "Dinheiro"){
      const c = form.querySelector('input[name="needChange"]');
      if(c) c.value = "";
    }
  }

  form.querySelectorAll('input[name="deliveryType"]').forEach(r => r.addEventListener("change", setDeliveryMode));
  if(paymentSelect) paymentSelect.addEventListener("change", setPaymentMode);

  setDeliveryMode();
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

    const deliveryType = String(data.get("deliveryType") || "entrega");
    const street = String(data.get("street") || "").trim();
    const number = String(data.get("number") || "").trim();
    const neighborhood = String(data.get("neighborhood") || "").trim();
    const complement = String(data.get("complement") || "").trim();

    const paymentMethod = String(data.get("paymentMethod") || "").trim();
    const needChange = String(data.get("needChange") || "").trim();
    const notes = String(data.get("notes") || "").trim();

    if(!customerName || !customerWhatsapp){
      showToast("Preencha Nome e WhatsApp (*)");
      return;
    }
    if(!paymentMethod){
      showToast("Selecione a forma de pagamento (*)");
      return;
    }
    if(deliveryType === "entrega" && (!street || !number || !neighborhood)){
      showToast("Preencha o endereço completo (*)");
      return;
    }

    const { subtotal, total } = cartTotals();

    const lines = [];
    lines.push("PEDIDO:");
    items.forEach(it => {
      const itemTotal = parseBRL(it.price) * it.qty;
      lines.push(`• ${it.qty}x ${it.name} — ${formatBRL(itemTotal)}`);
    });
    lines.push("");
    lines.push(`Subtotal: ${formatBRL(subtotal)}`);
    lines.push(`TOTAL: ${formatBRL(total)}`);
    lines.push("");
    lines.push("DADOS DO CLIENTE:");
    lines.push(`Nome: ${customerName}`);
    lines.push(`WhatsApp: ${customerWhatsapp}`);
    lines.push("");
    lines.push(`FORMA DE ENTREGA: ${deliveryType === "entrega" ? "Entrega da loja" : "Retirada no balcão"}`);
    lines.push("");
    lines.push(`PAGAMENTO: ${paymentMethod}`);
    if(paymentMethod === "Dinheiro" && needChange){
      const v = parseBRL(needChange);
      if(v > 0) lines.push(`Troco para: ${formatBRL(v)}`);
    }
    lines.push("");

    if(deliveryType === "entrega"){
      lines.push("ENDEREÇO:");
      lines.push(`Rua: ${street}`);
      lines.push(`Número: ${number}`);
      lines.push(`Bairro: ${neighborhood}`);
      if(complement) lines.push(`Complemento: ${complement}`);
      lines.push("");
    }

    if(notes){
      lines.push("OBSERVAÇÕES:");
      lines.push(notes);
      lines.push("");
    }

    lines.push("Obrigado!");

    const message = lines.join("\n");
    const url = buildWhatsAppLink(message);

    localStorage.removeItem(CART_KEY);
    updateCartBadge();
    renderCart();

    window.open(url, "_blank");
    closeCart();
    showToast("Abrindo WhatsApp…");
  });
}

renderMenu(products);
initFilters();
initWhatsAppButtons();
initMobileNav();
initYear();
initCartModal();
initCheckout();
updateCartBadge();
renderCart();
