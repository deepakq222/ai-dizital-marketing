// Header scroll state
const header = document.querySelector('header');
const onScroll = () => header && header.classList.toggle('scrolled', window.scrollY > 8);
document.addEventListener('scroll', onScroll, {passive:true});
onScroll();

// Mobile nav
const burger = document.querySelector('.burger');
const drawer = document.querySelector('.mobile-drawer');
if(burger && drawer){
  const toggle = (open) => { burger.classList.toggle('open', open); drawer.classList.toggle('open', open); };
  burger.addEventListener('click', () => toggle(!drawer.classList.contains('open')));
  drawer.addEventListener('click', (e) => { if(e.target === drawer) toggle(false); });
  drawer.querySelectorAll('a').forEach(a => a.addEventListener('click', () => toggle(false)));
}

// Scroll reveal
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const revealEls = document.querySelectorAll('.reveal');
if(reduceMotion){
  revealEls.forEach(el => el.classList.add('in'));
} else {
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => { if(e.isIntersecting){ e.target.classList.add('in'); io.unobserve(e.target); } });
  }, {threshold:.15, rootMargin:'0px 0px -40px 0px'});
  revealEls.forEach(el => io.observe(el));
}

// Animated counters
const counters = document.querySelectorAll('[data-count]');
const countIO = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if(!e.isIntersecting) return;
    countIO.unobserve(e.target);
    const el = e.target, target = parseFloat(el.dataset.count), suffix = el.dataset.suffix || '';
    if(reduceMotion){ el.textContent = target + suffix; return; }
    const dur = 1400, start = performance.now();
    const tick = (now) => {
      const p = Math.min((now - start) / dur, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      el.textContent = Math.round(target * eased) + suffix;
      if(p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  });
}, {threshold:.4});
counters.forEach(el => countIO.observe(el));

// Testimonial slider
const slider = document.querySelector('.t-slider');
if(slider){
  const slides = slider.querySelectorAll('.t-slide');
  const dotsWrap = document.querySelector('.t-dots');
  let idx = 0;
  slides.forEach((_, i) => {
    const d = document.createElement('button');
    d.setAttribute('aria-label', 'Show testimonial ' + (i+1));
    if(i === 0) d.classList.add('active');
    d.addEventListener('click', () => go(i));
    dotsWrap && dotsWrap.appendChild(d);
  });
  function go(i){
    slides[idx].classList.remove('active');
    dotsWrap && dotsWrap.children[idx].classList.remove('active');
    idx = (i + slides.length) % slides.length;
    slides[idx].classList.add('active');
    dotsWrap && dotsWrap.children[idx].classList.add('active');
  }
  document.querySelector('.t-next')?.addEventListener('click', () => go(idx+1));
  document.querySelector('.t-prev')?.addEventListener('click', () => go(idx-1));
  if(!reduceMotion) setInterval(() => go(idx+1), 6000);
}

// Portfolio filter
const filterBtns = document.querySelectorAll('.filter-btn');
const portCards = document.querySelectorAll('.port-card');
filterBtns.forEach(btn => btn.addEventListener('click', () => {
  filterBtns.forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  const f = btn.dataset.filter;
  portCards.forEach(card => {
    const match = f === 'all' || card.dataset.cat === f;
    card.style.transition = 'opacity .35s ease, transform .35s ease';
    if(match){ card.style.display = ''; requestAnimationFrame(()=>{card.style.opacity=1; card.style.transform='';}); }
    else { card.style.opacity = 0; card.style.transform = 'scale(.96)'; setTimeout(()=>{ if(btn.dataset.filter===f) card.style.display='none'; }, 350); }
  });
}));

// Mouse parallax on chakra/hero visuals
document.querySelectorAll('[data-parallax]').forEach(el => {
  document.addEventListener('mousemove', (e) => {
    if(reduceMotion) return;
    const x = (e.clientX / window.innerWidth - .5) * 16;
    const y = (e.clientY / window.innerHeight - .5) * 16;
    el.style.transform = `translate(${x}px, ${y}px)`;
  }, {passive:true});
});




// Blog filter
(function(){
  const btns = document.querySelectorAll('[data-bfilter]');
  const cards = document.querySelectorAll('#blogGrid .blog-card');
  btns.forEach(b => b.addEventListener('click', () => {
    btns.forEach(x => x.classList.remove('active')); b.classList.add('active');
    const f = b.dataset.bfilter;
    cards.forEach(c => {
      const ok = f === 'all' || c.dataset.cat === f;
      if(ok){ c.style.display = ''; requestAnimationFrame(() => { c.style.opacity = 1; }); }
      else { c.style.opacity = 0; setTimeout(() => { if(b.classList.contains('active')) c.style.display = 'none'; }, 300); }
    });
  }));
})();

// ===== Next-level hover effects =====
(function(){
  const rm = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const fine = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  document.querySelectorAll('.card, .port-card, .blog-card, .info-card').forEach(el => {
    el.classList.add('fx');
    el.addEventListener('pointermove', e => {
      const r = el.getBoundingClientRect(), x = e.clientX - r.left, y = e.clientY - r.top;
      el.style.setProperty('--mx', x + 'px'); el.style.setProperty('--my', y + 'px');
      if(fine && !rm){
        el.style.setProperty('--ry', ((x / r.width) - .5) * 9 + 'deg');
        el.style.setProperty('--rx', (.5 - (y / r.height)) * 9 + 'deg');
      }
    });
    el.addEventListener('pointerleave', () => { el.style.setProperty('--rx','0deg'); el.style.setProperty('--ry','0deg'); });
  });
  document.querySelectorAll('.btn').forEach(b => {
    if(fine && !rm){
      b.addEventListener('pointermove', e => {
        const r = b.getBoundingClientRect();
        b.style.setProperty('--bx', (e.clientX - r.left - r.width/2) * .18 + 'px');
        b.style.setProperty('--by', (e.clientY - r.top - r.height/2) * .3 + 'px');
      });
      b.addEventListener('pointerleave', () => { b.style.setProperty('--bx','0px'); b.style.setProperty('--by','0px'); });
    }
    b.addEventListener('pointerdown', e => {
      if(rm) return;
      const r = b.getBoundingClientRect(), s = Math.max(r.width, r.height), d = document.createElement('span');
      d.className = 'ripple'; d.style.width = d.style.height = s + 'px';
      d.style.left = (e.clientX - r.left - s/2) + 'px'; d.style.top = (e.clientY - r.top - s/2) + 'px';
      b.appendChild(d); setTimeout(() => d.remove(), 700);
    });
  });
  document.querySelectorAll('.dark-section').forEach(s => s.addEventListener('pointermove', e => {
    const r = s.getBoundingClientRect();
    s.style.setProperty('--sx', (e.clientX - r.left) + 'px'); s.style.setProperty('--sy', (e.clientY - r.top) + 'px');
  }));
  // remove stagger delay once revealed so hover feels instant
  const mo = new MutationObserver(list => list.forEach(m => {
    const t = m.target; if(t.classList.contains('in') && !t.classList.contains('done')) setTimeout(() => t.classList.add('done'), 900);
  }));
  document.querySelectorAll('.stagger .reveal').forEach(el => {
    if(el.classList.contains('in')) setTimeout(() => el.classList.add('done'), 900);
    mo.observe(el, {attributes:true, attributeFilter:['class']});
  });
})();

// ===== Blog article page: reading progress + table of contents =====
(function(){
  const bar = document.querySelector('.progress');
  if(bar){
    const upd = () => { const h = document.documentElement, max = h.scrollHeight - h.clientHeight; bar.style.width = (max > 0 ? h.scrollTop / max * 100 : 0) + '%'; };
    document.addEventListener('scroll', upd, {passive:true}); upd();
  }
  const links = [...document.querySelectorAll('.toc a')];
  if(links.length){
    const io = new IntersectionObserver(es => es.forEach(e => {
      if(e.isIntersecting) links.forEach(a => a.classList.toggle('on', a.getAttribute('href') === '#' + e.target.id));
    }), {rootMargin:'-20% 0px -70% 0px'});
    document.querySelectorAll('.prose h2[id]').forEach(h => io.observe(h));
  }
})();

// ===== Call button (above WhatsApp) =====
(function(){
  if (document.querySelector('.call-float')) return;
  var css = document.createElement('style');
  css.textContent =
    '.call-float{position:fixed;right:22px;bottom:92px;width:56px;height:56px;border-radius:50%;background:#155EEF;display:flex;align-items:center;justify-content:center;box-shadow:0 10px 26px -6px rgba(21,94,239,.6);z-index:80;transition:transform .3s}' +
    '.call-float:hover{transform:translateY(-3px) scale(1.06)}' +
    '@media(max-width:620px){.call-float{width:50px;height:50px;right:16px;bottom:78px}}';
  document.head.appendChild(css);
  var a = document.createElement('a');
  a.className = 'call-float';
  a.href = 'tel:+919548606063';
  a.setAttribute('aria-label', 'Call AI Dizital Marketing');
  a.innerHTML = '<svg viewBox="0 0 24 24" fill="#fff" width="24" height="24"><path d="M6.6 10.8a15.1 15.1 0 006.6 6.6l2.2-2.2a1 1 0 011-.25 11.4 11.4 0 003.6.57 1 1 0 011 1V20a1 1 0 01-1 1A17 17 0 013 4a1 1 0 011-1h3.5a1 1 0 011 1c0 1.25.2 2.45.57 3.57a1 1 0 01-.25 1z"/></svg>';
  document.body.appendChild(a);
})();
