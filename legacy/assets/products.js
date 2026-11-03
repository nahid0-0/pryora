/* Pryora catalogue + bag, shared by shop.html, product.html and preorder.html.
   Edit products here: name, type, price (in Taka), photos, sizes, stock.
   A product with `preorder: { ships: '...' }` is sold as a pre-order. */
(function () {
  var IMG = '../public/images/products/';

  var SIZES = {
    ring: ['Adjustable', '6', '7', '8'],
    bangle: ['2.4', '2.6', '2.8'],
    chain: ['16"', '18"', '20"']
  };
  var TONES = ['Gold-tone', 'Silver-tone', 'Rose-tone'];

  var products = [
    { id: 'bow-ring', name: 'Bow Ring', type: 'rings', price: 1350, badge: 'New', added: 11,
      photos: ['bow-hand.jpg'], focus: '50% 55%', sizes: SIZES.ring, tones: TONES, stock: 12,
      blurb: 'A gold-tone band shaped as a single bow. Light enough for every day and adjustable to fit most fingers.' },
    { id: 'laurel-leaf-ring', name: 'Laurel Leaf Ring', type: 'rings', price: 1450, added: 9,
      photos: ['laurel-silk.jpg', 'laurel-velvet.jpg'], focus: '50% 58%', sizes: SIZES.ring, tones: TONES, stock: 20,
      blurb: 'A ring of tiny laurel leaves that wraps the finger and meets at an open back, so it sits comfortably all day.' },
    { id: 'emerald-stone-rings', name: 'Emerald Stone Rings', type: 'rings', price: 1650, added: 6,
      photos: ['emerald-hand.jpg'], focus: '50% 45%', sizes: SIZES.ring, tones: ['Gold-tone'], stock: 0,
      preorder: { ships: '5 December', left: 18 },
      blurb: 'Slim gold-tone bands set with deep green stones, made to be stacked two or three at a time.' },

    { id: 'infinity-pendant', name: 'Infinity Pendant', type: 'necklaces', price: 1800, added: 8,
      photos: ['infinity-silk.jpg', 'pendants-silk.jpg'], focus: '50% 50%', sizes: SIZES.chain, tones: TONES, stock: 15,
      blurb: 'A small pavé infinity on a fine cable chain. A quiet everyday piece and an easy gift.' },
    { id: 'crescent-pendant', name: 'Crescent Moon Pendant', type: 'necklaces', price: 1800, badge: 'New', added: 12,
      photos: ['crescent-silk.jpg', 'pendants-silk.jpg'], focus: '50% 50%', sizes: SIZES.chain, tones: TONES, stock: 3,
      blurb: 'A pavé crescent moon that catches the light as you move, on a fine adjustable chain.' },
    { id: 'bow-pendant', name: 'Bow Pendant', type: 'necklaces', price: 1750, added: 7,
      photos: ['bow-pendant-silk.jpg', 'pendants-silk.jpg'], focus: '50% 50%', sizes: SIZES.chain, tones: TONES, stock: 9,
      blurb: 'The bow from our best-selling ring, made into a tiny pendant with a sparkle at the centre.' },
    { id: 'fine-chain', name: 'Fine Chain Necklace', type: 'necklaces', price: 1500, added: 4,
      photos: ['chain-arch.jpg'], focus: '50% 70%', sizes: SIZES.chain, tones: TONES, stock: 25,
      blurb: 'A delicate gold-tone chain to wear alone or layer under a pendant.' },

    { id: 'crystal-bangle', name: 'Crystal Bangle', type: 'bangles', price: 2800, badge: 'Only 2 left', added: 10,
      photos: ['crystal-hand.jpg', 'crystal-velvet.jpg'], focus: '50% 30%', sizes: SIZES.bangle, tones: TONES, stock: 2,
      blurb: 'A slim bangle lined with small crystals, with a hinge that opens and clicks shut securely.' },
    { id: 'evil-eye-bangle', name: 'Evil Eye Bangle', type: 'bangles', price: 2400, added: 5,
      photos: ['evil-eye-silk.jpg', 'wave-silk.jpg'], focus: '50% 55%', sizes: SIZES.bangle, tones: ['Gold-tone'], stock: 8,
      blurb: 'Blue evil eye charms set between crystal rondelles. Worn for luck, and lovely in a stack.' },
    { id: 'wave-bangle', name: 'Wave Bangle', type: 'bangles', price: 2200, added: 13,
      photos: ['wave-silk.jpg', 'evil-eye-silk.jpg'], focus: '50% 52%', sizes: SIZES.bangle, tones: TONES, stock: 0,
      preorder: { ships: '12 December', left: 30 },
      blurb: 'A polished bangle with a soft wave, engraved with a small repeating mark.' },
    { id: 'stacked-set', name: 'Stacked Bangle Set', type: 'bangles', price: 6500, added: 14,
      photos: ['stack-worn.jpg', 'crystal-velvet.jpg'], focus: '55% 60%', sizes: SIZES.bangle, tones: ['Gold-tone'], stock: 0,
      preorder: { ships: '20 December', left: 10 },
      blurb: 'Five bangles chosen to be worn together: crystal, emerald line and plain polished gold-tone.' }
  ];

  products.forEach(function (p) {
    p.img = IMG + p.photos[0];
    p.gallery = p.photos.map(function (f) { return IMG + f; });
    p.isPre = !!p.preorder;
    p.soldOut = p.stock === 0 && !p.isPre;
  });

  var TYPES = { rings: 'Rings', necklaces: 'Necklaces', bangles: 'Bangles' };

  function money(n) { return '৳' + n.toLocaleString('en-IN'); }
  function byId(id) { for (var i = 0; i < products.length; i++) if (products[i].id === id) return products[i]; return null; }
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }

  /* ---------- bag (localStorage, so it follows you between pages) ---------- */
  var KEY = 'pryora-bag';
  function readBag() { try { return (JSON.parse(localStorage.getItem(KEY)) || []).filter(function (i) { return byId(i.id); }); } catch (e) { return []; } }
  function saveBag(bag) { try { localStorage.setItem(KEY, JSON.stringify(bag)); } catch (e) {} paintBag(); }
  function bagCount() { return readBag().reduce(function (n, i) { return n + i.qty; }, 0); }

  function addToBag(id, size, tone, opts) {
    var bag = readBag(), hit = null;
    bag.forEach(function (i) { if (i.id === id && i.size === size && i.tone === tone) hit = i; });
    if (hit) hit.qty++; else bag.push({ id: id, size: size, tone: tone, qty: 1 });
    saveBag(bag);
    var b = document.querySelector('.bagbtn');
    if (b) { b.classList.remove('bump'); void b.offsetWidth; b.classList.add('bump'); }
    if (!opts || opts.open !== false) openBag();
  }

  var BAG_ICON = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5.5 8.5h13l-1 11.5h-11z"/><path d="M9 8.5V7a3 3 0 0 1 6 0v1.5"/></svg>';

  function paintBag() {
    var n = bagCount();
    document.querySelectorAll('[data-bag-count]').forEach(function (el) { el.textContent = n; el.hidden = n === 0; });
    document.querySelectorAll('.bagbtn').forEach(function (b) { b.setAttribute('aria-label', 'Bag, ' + n + (n === 1 ? ' item' : ' items')); });
    renderDrawer();
  }

  /* drawer markup, injected once on every page */
  var drawer, list, foot;
  function buildDrawer() {
    var wrap = document.createElement('div');
    wrap.innerHTML =
      '<div class="bscrim" id="bscrim"></div>' +
      '<aside class="bdrawer" id="bdrawer" role="dialog" aria-modal="true" aria-labelledby="bdTitle" aria-hidden="true">' +
        '<header class="bdhead"><h2 id="bdTitle">Your bag</h2><button type="button" class="bdclose" aria-label="Close bag">&times;</button></header>' +
        '<div class="bdlist" id="bdlist"></div>' +
        '<div class="bdfoot" id="bdfoot"></div>' +
      '</aside>';
    while (wrap.firstChild) document.body.appendChild(wrap.firstChild);
    drawer = document.getElementById('bdrawer'); list = document.getElementById('bdlist'); foot = document.getElementById('bdfoot');
    document.getElementById('bscrim').addEventListener('click', closeBag);
    drawer.querySelector('.bdclose').addEventListener('click', closeBag);
    drawer.addEventListener('click', function (e) {
      var b = e.target.closest('[data-act]'); if (!b) return;
      var bag = readBag(), i = +b.dataset.i, item = bag[i]; if (!item) return;
      if (b.dataset.act === 'inc') item.qty = Math.min(9, item.qty + 1);
      if (b.dataset.act === 'dec') item.qty--;
      if (b.dataset.act === 'rm' || item.qty < 1) bag.splice(i, 1);
      saveBag(bag);
    });
  }

  function renderDrawer() {
    if (!list) return;
    var bag = readBag();
    if (!bag.length) {
      list.innerHTML = '<div class="bdempty"><svg viewBox="0 0 20 20" aria-hidden="true"><path d="M10 0 C10.8 6 14 9.2 20 10 C14 10.8 10.8 14 10 20 C9.2 14 6 10.8 0 10 C6 9.2 9.2 6 10 0Z"/></svg><p>Your bag is empty.</p><a href="shop.html">Browse the shop</a></div>';
      foot.innerHTML = '';
      return;
    }
    var total = 0, hasPre = false;
    list.innerHTML = bag.map(function (it, i) {
      var p = byId(it.id); total += p.price * it.qty; if (p.isPre) hasPre = true;
      return '<div class="bditem">' +
        '<a class="bdimg" href="product.html?id=' + p.id + '"><img src="' + p.img + '" alt="" style="object-position:' + p.focus + '"></a>' +
        '<div class="bdinfo">' +
          '<a class="bdname" href="product.html?id=' + p.id + '">' + esc(p.name) + '</a>' +
          '<span class="bdmeta">' + esc(it.size) + ' &middot; ' + esc(it.tone) + '</span>' +
          (p.isPre ? '<span class="pretag">Pre-order &middot; ships by ' + p.preorder.ships + '</span>' : '') +
          '<div class="bdrow"><div class="qty"><button type="button" data-act="dec" data-i="' + i + '" aria-label="One less">&minus;</button><span>' + it.qty + '</span><button type="button" data-act="inc" data-i="' + i + '" aria-label="One more">+</button></div>' +
          '<button type="button" class="bdrm" data-act="rm" data-i="' + i + '">Remove</button></div>' +
        '</div>' +
        '<span class="bdprice">' + money(p.price * it.qty) + '</span>' +
      '</div>';
    }).join('');
    foot.innerHTML =
      '<div class="bdtotal"><span>Subtotal</span><b>' + money(total) + '</b></div>' +
      '<p class="bdnote">' + (hasPre ? 'Pre-order pieces ship on their own date. ' : '') + 'Delivery in 2 to 4 days. Cash on delivery available.</p>' +
      '<button type="button" class="bdcheck" id="bdcheck">Checkout</button>' +
      '<p class="bdsoon" id="bdsoon" hidden>Checkout is not connected yet. This is a design preview.</p>';
    document.getElementById('bdcheck').addEventListener('click', function () { document.getElementById('bdsoon').hidden = false; });
  }

  var lastFocus;
  function openBag() {
    if (!drawer) return;
    lastFocus = document.activeElement;
    drawer.classList.add('open'); drawer.setAttribute('aria-hidden', 'false');
    document.getElementById('bscrim').classList.add('open');
    document.documentElement.style.overflow = 'hidden';
    drawer.querySelector('.bdclose').focus();
  }
  function closeBag() {
    if (!drawer || !drawer.classList.contains('open')) return;
    drawer.classList.remove('open'); drawer.setAttribute('aria-hidden', 'true');
    document.getElementById('bscrim').classList.remove('open');
    document.documentElement.style.overflow = '';
    if (lastFocus) lastFocus.focus();
  }

  /* ---------- product card, matching the "rectangle" sample ---------- */
  function card(p) {
    var badge = p.isPre ? 'Pre-order' : p.soldOut ? 'Sold out' : (p.badge || '');
    var href = 'product.html?id=' + p.id;
    var btn = p.isPre
      ? '<a class="qadd pre" href="' + href + '">Pre-order</a>'
      : p.soldOut
        ? '<a class="qadd" href="' + href + '">Notify me</a>'
        : '<button class="qadd" type="button" data-add="' + p.id + '">Add to bag</button>';
    return '<article class="card' + (p.soldOut ? ' sold' : '') + (p.isPre ? ' is-pre' : '') + '">' +
      '<a class="ph" href="' + href + '">' +
        '<img src="' + p.img + '" alt="' + esc(p.name) + '" loading="lazy" decoding="async" style="object-position:' + p.focus + '">' +
        (badge ? '<span class="badge' + (p.isPre ? ' pre' : '') + '">' + badge + '</span>' : '') +
      '</a>' +
      '<h3><a href="' + href + '">' + esc(p.name) + '</a></h3>' +
      '<p class="price">' + money(p.price) + (p.isPre ? ' <span class="ships">Ships by ' + p.preorder.ships + '</span>' : '') + '</p>' +
      btn +
    '</article>';
  }

  /* quick add from any card: uses the first size and tone */
  document.addEventListener('click', function (e) {
    var b = e.target.closest('[data-add]');
    if (b) {
      var p = byId(b.dataset.add); if (!p) return;
      addToBag(p.id, p.sizes[0], p.tones[0]);
      return;
    }
    if (e.target.closest('.bagbtn')) { e.preventDefault(); openBag(); }
  });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') closeBag(); });

  function boot() {
    document.querySelectorAll('.bagbtn').forEach(function (b) {
      if (!b.querySelector('svg')) b.innerHTML = BAG_ICON + '<span class="bagn" data-bag-count hidden>0</span>';
    });
    buildDrawer(); paintBag();
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot); else boot();

  /* keep several open tabs in step */
  window.addEventListener('storage', function (e) { if (e.key === KEY) paintBag(); });

  window.Pryora = { products: products, TYPES: TYPES, money: money, byId: byId, esc: esc, addToBag: addToBag, card: card, paintBag: paintBag, openBag: openBag };
})();
