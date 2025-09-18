// ===== Login guard =====
(function guard() {
  const user = JSON.parse(localStorage.getItem("loggedInUser") || "null");
  if (!user) {
    window.location.href = "login.html";
  } else {
    const w = document.getElementById("welcomeUser");
    if (w) w.textContent = `Hi, ${user.name}`;
  }
})();

// ===== Data =====
const MENU = [
  {id:'pancakes', name:'Pancakes', cat:'Breakfast', price:120, mrp:299, off:60, veg:true, customizable:true, rating:4.7, pop:98, img:'images/pancake.jpg'},
  {id:'masala-dosa', name:'Masala Dosa', cat:'Breakfast', price:90, mrp:140, off:35, veg:true, customizable:false, rating:4.6, pop:96, img:'https://images.unsplash.com/photo-1604908554026-3f61f3a1f2f1?q=80&w=1200&auto=format&fit=crop'},
  {id:'paneer-tikka', name:'Paneer Tikka', cat:'Lunch', price:220, mrp:320, off:31, veg:true, customizable:false, rating:4.5, pop:91, img:'https://images.unsplash.com/photo-1625944528103-5b0c9f33e31f?q=80&w=1200&auto=format&fit=crop'},
  {id:'chicken-biryani', name:'Chicken Biryani', cat:'Lunch', price:250, mrp:350, off:29, veg:false, customizable:true, rating:4.8, pop:99, img:'https://images.unsplash.com/photo-1645125243907-6a83ac88a8f8?q=80&w=1200&auto=format&fit=crop'},
  {id:'margherita', name:'Margherita Pizza', cat:'Dinner', price:199, mrp:279, off:28, veg:true, customizable:true, rating:4.4, pop:90, img:'https://images.unsplash.com/photo-1548365328-9f547fb0956f?q=80&w=1200&auto=format&fit=crop'},
  {id:'butter-chicken', name:'Butter Chicken', cat:'Dinner', price:260, mrp:360, off:28, veg:false, customizable:false, rating:4.7, pop:94, img:'https://images.unsplash.com/photo-1604908176997-431f86b0aa16?q=80&w=1200&auto=format&fit=crop'},

  {id:'omelette', name:'Cheese Omelette', cat:'Breakfast', price:80, mrp:110, off:27, veg:false, customizable:false, rating:4.3, pop:75, img:'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?q=80&w=1200&auto=format&fit=crop'},
  {id:'idli', name:'Idli Sambar', cat:'Breakfast', price:60, mrp:90, off:33, veg:true, customizable:false, rating:4.6, pop:83, img:'https://images.unsplash.com/photo-1628294895950-9807fbc2d7ee?q=80&w=1200&auto=format&fit=crop'},
  {id:'waffles', name:'Choco Waffles', cat:'Breakfast', price:140, mrp:210, off:33, veg:true, customizable:true, rating:4.2, pop:70, img:'https://images.unsplash.com/photo-1509460913899-35fd1e1c0b01?q=80&w=1200&auto=format&fit=crop'},

  {id:'veg-biryani', name:'Veg Biryani', cat:'Lunch', price:180, mrp:260, off:31, veg:true, customizable:true, rating:4.5, pop:82, img:'https://images.unsplash.com/photo-1604908177113-5b94b3a2f9ef?q=80&w=1200&auto=format&fit=crop'},
  {id:'noodles', name:'Hakka Noodles', cat:'Lunch', price:160, mrp:220, off:27, veg:true, customizable:false, rating:4.1, pop:66, img:'https://images.unsplash.com/photo-1604908177347-3d8a020f8da4?q=80&w=1200&auto=format&fit=crop'},
  {id:'wrap', name:'Chicken Wrap', cat:'Lunch', price:150, mrp:210, off:29, veg:false, customizable:false, rating:4.0, pop:62, img:'https://images.unsplash.com/photo-1606756790138-261d2b21b0d9?q=80&w=1200&auto=format&fit=crop'},

  {id:'naan-gravy', name:'Butter Naan & Gravy', cat:'Dinner', price:190, mrp:260, off:27, veg:true, customizable:true, rating:4.3, pop:68, img:'https://images.unsplash.com/photo-1562967914-608f82629710?q=80&w=1200&auto=format&fit=crop'},
  {id:'kebab', name:'Seekh Kebab', cat:'Dinner', price:230, mrp:320, off:28, veg:false, customizable:false, rating:4.2, pop:64, img:'https://images.unsplash.com/photo-1625944527971-229e756784b1?q=80&w=1200&auto=format&fit=crop'},
  {id:'pasta', name:'Creamy Pasta', cat:'Dinner', price:170, mrp:240, off:29, veg:true, customizable:false, rating:4.1, pop:61, img:'https://images.unsplash.com/photo-1526318472351-c75fcf070305?q=80&w=1200&auto=format&fit=crop'},

  {id:'fries', name:'French Fries', cat:'Snacks', price:99, mrp:130, off:24, veg:true, customizable:false, rating:4.2, pop:72, img:'https://images.unsplash.com/photo-1541592106381-b31e9677c0e5?q=80&w=1200&auto=format&fit=crop'},
  {id:'momos', name:'Veg Momos', cat:'Snacks', price:110, mrp:150, off:27, veg:true, customizable:false, rating:4.4, pop:74, img:'https://images.unsplash.com/photo-1604908177047-9e5bb2d7b8a3?q=80&w=1200&auto=format&fit=crop'},
  {id:'samosa', name:'Samosa', cat:'Snacks', price:30, mrp:40, off:25, veg:true, customizable:false, rating:4.0, pop:59, img:'https://images.unsplash.com/photo-1589307004173-3c95204b4b3b?q=80&w=1200&auto=format&fit=crop'}
];

const qs = (s, el=document) => el.querySelector(s);
const qsa = (s, el=document) => [...el.querySelectorAll(s)];
const fmt = n => new Intl.NumberFormat('en-IN').format(n);

// ===== Hero slider =====
const slides = qsa('.slide');
let sIdx = 0;
setInterval(() => {
  slides[sIdx].classList.remove('active');
  sIdx = (sIdx + 1) % slides.length;
  slides[sIdx].classList.add('active');
}, 3000);

// ===== Dropdown =====
const categoryBtn = qs('#categoryBtn');
const categoryMenu = qs('#categoryMenu');
categoryBtn.addEventListener('click', (e)=>{
  e.stopPropagation();
  categoryMenu.parentElement.classList.toggle('open');
});
document.addEventListener('click', ()=> categoryMenu.parentElement.classList.remove('open'));

// ===== Render cards =====
const buckets = {
  Popular: qs('#popularGrid'),
  Breakfast: qs('#breakfastGrid'),
  Lunch: qs('#lunchGrid'),
  Dinner: qs('#dinnerGrid'),
  Snacks: qs('#snacksGrid')
};

function star() {
  return `<svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16"><path d="M12 .587l3.668 7.431 8.207 1.193-5.938 5.79 1.403 8.168L12 18.897l-7.34 3.872 1.403-8.168L.125 9.211l8.207-1.193z"/></svg>`;
}

function cardTpl(item){
  return `
  <article class="card" data-id="${item.id}" data-veg="${item.veg}" data-custom="${item.customizable}" data-price="${item.price}" data-rating="${item.rating}" data-pop="${item.pop}" data-name="${item.name.toLowerCase()}">
    <div class="thumb">
      <img src="${item.img}" alt="${item.name}" onerror="this.src='https://images.unsplash.com/photo-1550547660-d9450f859349?q=80&w=1200&auto=format&fit=crop'"/>
      <span class="${item.veg ? 'veg-dot' : 'nonveg-dot'}" title="${item.veg ? 'Veg' : 'Non-Veg'}"></span>
      ${item.off ? `<span class="off">${item.off}% OFF</span>` : ''}
    </div>
    <div class="body">
      <h4 class="title">${item.name}</h4>
      <div class="sub">${item.cat}${item.customizable ? ' · Customisable' : ''}</div>
      <div class="rating">${star()} <span>${item.rating.toFixed(1)}</span></div>
      <div class="priceRow">
        <div class="prices"><span class="price">₹${fmt(item.price)}</span> <span class="old">₹${fmt(item.mrp)}</span></div>
        <div class="add-area">
          <button class="add" data-id="${item.id}">ADD +</button>
          <div class="qty-ctrl" data-id="${item.id}">
            <button class="minus" aria-label="decrease">−</button>
            <span class="qty">0</span>
            <button class="plus" aria-label="increase">+</button>
          </div>
        </div>
      </div>
    </div>
  </article>`;
}

function render(){
  Object.values(buckets).forEach(el=> el.innerHTML = '');
  const filtered = applyFilters(MENU);

  filtered.forEach(item => {
    const host = buckets[item.cat] || buckets.Popular;
    host.insertAdjacentHTML('beforeend', cardTpl(item));
  });

  // Popular section is always top-pop, but filtered by current filters
  const popularTop = [...MENU].sort((a,b)=> b.pop - a.pop).slice(0,8);
  buckets.Popular.innerHTML = '';
  applyFilters(popularTop).forEach(i=> buckets.Popular.insertAdjacentHTML('beforeend', cardTpl(i)));

  attachCardHandlers();
  refreshCardQtyUI();
}

// ===== Filters/Search/Sort =====
const vegOnly = qs('#vegOnly');
const nonVegOnly = qs('#nonVegOnly');
const customizableOnly = qs('#customizableOnly');
const sortSelect = qs('#sortSelect');
const searchInput = qs('#searchInput');

function applyFilters(list){
  let rows = list.filter(i => (
    (!vegOnly.checked || i.veg) &&
    (!nonVegOnly.checked || !i.veg) &&
    (!customizableOnly.checked || i.customizable) &&
    (i.name.toLowerCase().includes(searchInput.value.trim().toLowerCase()))
  ));
  switch(sortSelect.value){
    case 'priceLow': rows.sort((a,b)=> a.price - b.price); break;
    case 'priceHigh': rows.sort((a,b)=> b.price - a.price); break;
    case 'rating': rows.sort((a,b)=> b.rating - a.rating); break;
    default: rows.sort((a,b)=> b.pop - a.pop);
  }
  return rows;
}

[vegOnly, nonVegOnly, customizableOnly, sortSelect].forEach(el=> el.addEventListener('change', render));
searchInput.addEventListener('input', render);
qs('#searchBtn').addEventListener('click', ()=> searchInput.focus());
vegOnly.addEventListener('change', ()=>{ if(vegOnly.checked) nonVegOnly.checked=false; render(); });
nonVegOnly.addEventListener('change', ()=>{ if(nonVegOnly.checked) vegOnly.checked=false; render(); });

// ===== Cart =====
const cart = new Map(); // id -> {qty, item}
const cartCount = qs('#cartCount');
const cartDrawer = qs('#cartDrawer');
const cartBody = qs('#cartBody');
const cartTotal = qs('#cartTotal');

function attachCardHandlers(){
  qsa('.add').forEach(btn => btn.addEventListener('click', () => addFromCard(btn.dataset.id)));
  qsa('.qty-ctrl .minus').forEach(b => b.addEventListener('click', () => changeQty(getCardId(b), -1)));
  qsa('.qty-ctrl .plus').forEach(b => b.addEventListener('click', () => changeQty(getCardId(b), +1)));
}

function getCardId(el){
  const wrapper = el.closest('.qty-ctrl');
  return wrapper ? wrapper.dataset.id : null;
}

function addFromCard(id){
  const row = cart.get(id) || {qty:0, item: MENU.find(x=>x.id===id)};
  row.qty += 1;
  cart.set(id, row);
  animateBadge();
  drawCart();
  refreshCardQtyUI();
}

function changeQty(id, delta){
  const row = cart.get(id);
  if(!row) return;
  row.qty += delta;
  if(row.qty <= 0) cart.delete(id); else cart.set(id, row);
  animateBadge();
  drawCart();
  refreshCardQtyUI();
}

function animateBadge(){
  cartCount.textContent = [...cart.values()].reduce((s,{qty})=> s+qty, 0);
  cartCount.animate([
    { transform: 'scale(1)', offset: 0 },
    { transform: 'scale(1.2)', offset: .4 },
    { transform: 'scale(1)', offset: 1 }
  ], { duration: 300, easing: 'ease-out' });
}

function drawCart(){
  if(cart.size===0){
    cartBody.innerHTML = '<p class="drawer-empty">Your cart is empty. Add some tasty dishes! 😋</p>';
    cartTotal.textContent = '0';
    return;
  }
  cartBody.innerHTML = '';
  let total = 0;
  cart.forEach(({qty,item})=>{
    total += item.price * qty;
    const el = document.createElement('div');
    el.className='cart-item';
    el.innerHTML = `
      <img src="${item.img}" alt="${item.name}" style="width:64px;height:64px;object-fit:cover;border-radius:10px"/>
      <div>
        <div style="font-weight:700">${item.name}</div>
        <div style="color:var(--muted);font-size:.9rem">₹${fmt(item.price)} × ${qty}</div>
      </div>
      <div class="qty">
        <button aria-label="decrease">−</button>
        <span>${qty}</span>
        <button aria-label="increase">+</button>
      </div>`;
    const [minus, , plus] = el.querySelectorAll('button, span, button');
    minus.addEventListener('click', ()=>{ changeQty(item.id, -1); });
    plus.addEventListener('click', ()=>{ changeQty(item.id, +1); });
    cartBody.appendChild(el);
  });
  cartTotal.textContent = fmt(total);
}

function refreshCardQtyUI(){
  qsa('.card').forEach(card=>{
    const id = card.dataset.id;
    const addBtn = card.querySelector('.add');
    const qtyCtrl = card.querySelector('.qty-ctrl');
    const qtySpan = qtyCtrl.querySelector('.qty');
    const row = cart.get(id);
    const qty = row ? row.qty : 0;
    qtySpan.textContent = qty;
    if(qty > 0){
      addBtn.style.display = 'none';
      qtyCtrl.classList.add('show');
    } else {
      qtyCtrl.classList.remove('show');
      addBtn.style.display = 'inline-flex';
    }
  });
}

// Drawer open/close
qs('#cartBtn').addEventListener('click', ()=>{ cartDrawer.classList.add('open'); cartDrawer.setAttribute('aria-hidden','false'); });
qs('#closeCart').addEventListener('click', ()=>{ cartDrawer.classList.remove('open'); cartDrawer.setAttribute('aria-hidden','true'); });

// ===== Help button / modal =====
const helpBtn = qs('#helpBtn');
const helpModal = qs('#helpModal');
const helpClose = qs('#helpClose');

helpBtn.addEventListener('click', ()=> { helpModal.classList.add('show'); helpModal.setAttribute('aria-hidden','false'); });
helpClose.addEventListener('click', ()=> { helpModal.classList.remove('show'); helpModal.setAttribute('aria-hidden','true'); });
helpModal.addEventListener('click', (e)=> { if(e.target === helpModal){ helpClose.click(); }});

// ===== Logout =====
qs('#logoutBtn').addEventListener('click', ()=>{
  localStorage.removeItem("loggedInUser");
  window.location.href = "login.html";
});

// ===== Init =====
(function init(){
  render();
  qs('#year').textContent = new Date().getFullYear();
})();
