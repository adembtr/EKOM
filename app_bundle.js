/* === EKOM — Tek JS Bundle ================================================
   Kaynaklar: main.js, built.js, team.js, nalbur.js, location.js, comminucation.js
   NOT: sidebar.js bu bundle'ın DIŞINDADIR ve otorite dosyadır.
========================================================================== */

/* 1) ANASAYFA: #slides için basit otomatik kaydırma (5 sn) */
(function(){
  const track = document.getElementById('slides');
  if(!track) return;
  const n = track.children.length;
  let i = 0;
  const go = k => { i = (k+n)%n; track.style.transform = `translateX(-${i*100}%)`; };
  setInterval(()=>go(i+1), 5000);
  go(0);
})();

/* 2) GENEL SLIDER MOTORU
   .slider kökünde çalışır.
   Yapı:
   - .slides içinde ya .slide elemanları ya da direkt <img> dizisi olabilir.
   - .nav.prev / .nav.next butonları opsiyonel.
   - .dots konteyneri opsiyonel; varsa noktalar oluşturulur.
   - data-autoplay="true" ve data-interval="3000" desteklenir.
*/
(function () {
  const sliders = Array.from(document.querySelectorAll(".slider"));
  sliders.forEach(initSlider);

  function collectSlides(root, wrap) {
    // .slide varsa onları al; yoksa .slides altındaki img'leri slayt say.
    const slideEls = wrap.querySelectorAll(".slide");
    if (slideEls.length) return Array.from(slideEls);
    const imgs = wrap.querySelectorAll("img");
    if (imgs.length) {
      // Görselleri slayt gibi kabul edelim; her img genişliği %100
      return Array.from(imgs);
    }
    return [];
  }

  function initSlider(root) {
    const slidesWrap = root.querySelector(".slides");
    if (!slidesWrap) return;

    const items = collectSlides(root, slidesWrap);
    if (!items.length) return;

    const prevBtn = root.querySelector(".nav.prev");
    const nextBtn = root.querySelector(".nav.next");
    const dotsWrap = root.querySelector(".dots");

    let index = 0;
    let timer = null;

    // Dots (varsa)
    let dots = [];
    if (dotsWrap) {
      dots = items.map((_, i) => {
        const b = document.createElement("button");
        b.setAttribute("aria-label", `Slide ${i + 1}`);
        b.addEventListener("click", () => goTo(i, true));
        dotsWrap.appendChild(b);
        return b;
      });
    }

    function update() {
      slidesWrap.style.transform = `translateX(-${index * 100}%)`;
      if (dots.length) dots.forEach((d, i) => d.classList.toggle("active", i === index));
    }

    function goTo(i, user = false) {
      index = (i + items.length) % items.length;
      update();
      if (user) restartAutoplay();
    }
    function next() { goTo(index + 1); }
    function prev() { goTo(index - 1); }

    // Buttons
    if (prevBtn) prevBtn.addEventListener("click", () => { prev(); restartAutoplay(); });
    if (nextBtn) nextBtn.addEventListener("click", () => { next(); restartAutoplay(); });

    // Swipe (touch)
    let startX = null;
    root.addEventListener("touchstart", (e) => { startX = e.touches[0].clientX; }, {passive:true});
    root.addEventListener("touchmove", (e) => {
      if (startX == null) return;
      const dx = e.touches[0].clientX - startX;
      if (Math.abs(dx) > 50) {
        dx > 0 ? prev() : next();
        startX = null; restartAutoplay();
      }
    }, {passive:true});
    root.addEventListener("touchend", () => { startX = null; });

    // Autoplay
    const autoplay = root.dataset.autoplay === "true";
    const interval = Number(root.dataset.interval) || 3000;

    function startAutoplay() {
      if (!autoplay || items.length < 2) return;
      stopAutoplay();
      timer = setInterval(next, interval);
    }
    function stopAutoplay() { if (timer) clearInterval(timer); timer = null; }
    function restartAutoplay() { stopAutoplay(); startAutoplay(); }

    // Hover durdurma
    root.addEventListener("mouseenter", stopAutoplay);
    root.addEventListener("mouseleave", startAutoplay);

    // İlk durum
    update();
    startAutoplay();

    // Reflow güvenliği (pencere değişince mevcut transform'u koru)
    window.addEventListener("resize", () => {
      const t = getComputedStyle(slidesWrap).transform;
      slidesWrap.style.transform = t;
    });
  }
})();

/* 3) NALBUR: .hero-slider otomatik (3 sn) — yalın şerit */
(function(){
  const track = document.querySelector(".hero-slider .slides");
  if (!track) return;
  const slides = Array.from(track.querySelectorAll("img"));
  if (!slides.length) return;
  let index = 0;
  const goTo = (i) => { track.style.transform = `translateX(-${i * 100}%)`; };
  setInterval(() => { index = (index + 1) % slides.length; goTo(index); }, 3000);
})();

/* 4) LOCATION: "Konumu Kopyala" + toast; reveal-on-scroll; go-location */
(function attachCopyHandlers(){
  const buttons = document.querySelectorAll('.copy-location');
  if (!buttons.length) return;

  // Basit toast
  const toast = document.createElement('div');
  toast.style.cssText = `
    position: fixed; inset: auto 16px 16px auto;
    background: #111; color: #fff; padding: 10px 14px;
    border-radius: 12px; font-weight: 600; z-index: 99999;
    box-shadow: 0 8px 24px rgba(0,0,0,.2); opacity: 0; transform: translateY(8px);
    transition: opacity .25s ease, transform .25s ease; pointer-events: none;
  `;
  document.body.appendChild(toast);

  function showToast(msg){
    toast.textContent = msg;
    toast.style.opacity = '1';
    toast.style.transform = 'translateY(0)';
    clearTimeout(showToast._t);
    showToast._t = setTimeout(()=>{
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(8px)';
    }, 1600);
  }

  buttons.forEach((btn) => {
    btn.addEventListener('click', async () => {
      const locationUrl = btn.dataset.location || '';
      try {
        await navigator.clipboard.writeText(locationUrl);
        btn.classList.add('copied');
        showToast('Konum kopyalandı');
        setTimeout(()=> btn.classList.remove('copied'), 1200);
      } catch (err) {
        console.error('Konum kopyalanamadı:', err);
        showToast('Kopyalanamadı');
      }
    });
  });
})();

(function revealOnScroll(){
  const items = document.querySelectorAll('.animate-on-scroll');
  if (!items.length) return;

  const io = new IntersectionObserver((entries)=>{
    entries.forEach((e)=>{
      if (e.isIntersecting) {
        e.target.classList.add('in-view');
        io.unobserve(e.target);
      }
    });
  }, { rootMargin: '0px 0px -10% 0px', threshold: .1 });

  items.forEach(el => io.observe(el));
})();

(function goLocationSupport(){
  document.addEventListener('click', (ev)=>{
    const btn = ev.target.closest('.go-location');
    if (!btn) return;
    const url = btn.dataset.go;
    if (url) window.open(url, '_blank', 'noopener,noreferrer');
  });
})();

/* 5) COMMUNICATION: kutuyu sidebar açılmasına göre aşağı kaydır (mobil) */
(function () {
  const sidebar = document.querySelector(".sidebar");
  const html = document.documentElement;
  if (!sidebar) return;

  const toPx = (v) => {
    if (!v) return 0;
    if (typeof v === "number") return v;
    const n = parseFloat(v.toString());
    return isNaN(n) ? 0 : n;
  };

  const CLOSED_H = 56;  // mobil kapalı yükseklik (px)
  const EXTRA = 10;     // hafif ekstra kayma

  const updateShift = () => {
    let h = sidebar.style.height && sidebar.style.height.endsWith("px")
      ? sidebar.style.height
      : getComputedStyle(sidebar).height;

    const openPx = Math.max(0, toPx(h) - CLOSED_H) + EXTRA;
    const isOpen = sidebar.classList.contains("menu-active");
    html.style.setProperty("--box-shift", isOpen ? `${openPx}px` : "0px");
  };

  updateShift();

  const mo = new MutationObserver((muts) => {
    for (const m of muts) {
      if (m.type === "attributes" && (m.attributeName === "class" || m.attributeName === "style")) {
        updateShift();
      }
    }
  });
  mo.observe(sidebar, { attributes: true, attributeFilter: ["class", "style"] });
  window.addEventListener("resize", updateShift);
})();

/* 6) COMMUNICATION: Dropzone + paste + tıkla seç + önizleme (opsiyonel) */
(function(){
  const dz = document.getElementById('imageDropzone');
  const fileInput = document.getElementById('imageInput');
  const preview = document.getElementById('imagePreview');
  const hint = dz?.querySelector('.dropzone-hint');

  if(!dz || !fileInput || !preview) return;

  const showPreview = (file) => {
    if(!file || !file.type.startsWith('image/')) return;
    const reader = new FileReader();
    reader.onload = () => {
      preview.src = reader.result;
      preview.style.display = 'block';
      if (hint) hint.style.display = 'none';
    };
    reader.readAsDataURL(file);
  };

  dz.addEventListener('click', () => fileInput.click());
  dz.addEventListener('keydown', (e) => {
    if(e.key === 'Enter' || e.key === ' '){ e.preventDefault(); fileInput.click(); }
  });

  fileInput.addEventListener('change', (e) => {
    const file = e.target.files?.[0];
    showPreview(file);
  });

  ['dragenter','dragover'].forEach(evt=>{
    dz.addEventListener(evt, (e)=>{
      e.preventDefault(); e.stopPropagation();
      dz.classList.add('dragover');
    });
  });
  ['dragleave','drop'].forEach(evt=>{
    dz.addEventListener(evt, (e)=>{
      e.preventDefault(); e.stopPropagation();
      dz.classList.remove('dragover');
    });
  });
  dz.addEventListener('drop', (e)=>{
    const file = e.dataTransfer?.files?.[0];
    showPreview(file);
  });

  document.addEventListener('paste', (e)=>{
    const items = e.clipboardData?.items;
    if(!items) return;
    for(const it of items){
      if(it.type && it.type.startsWith('image/')){
        const file = it.getAsFile();
        showPreview(file);
        break;
      }
    }
  });
})();

/* 7) COMMUNICATION: textarea autosize */
(function(){
  const ta = document.getElementById('descInput');
  if(!ta) return;
  const autosize = () => {
    ta.style.height = 'auto';
    ta.style.height = ta.scrollHeight + 'px';
  };
  ['input','change'].forEach(evt => ta.addEventListener(evt, autosize));
  requestAnimationFrame(autosize);
})();

/* 8) COMMUNICATION: Deep link (WhatsApp / Instagram) */
(function () {
  function openDeepLink(appUrl, webUrl) {
    const start = Date.now();
    window.location.href = appUrl;
    setTimeout(() => {
      if (Date.now() - start < 1500) window.location.href = webUrl;
    }, 1200);
  }

  const wa = document.getElementById("waLink");
  if (wa) {
    wa.addEventListener("click", function (e) {
      e.preventDefault();
      const phone = "905511225039";
      const text = encodeURIComponent("Merhaba, bilgi almak istiyorum.");
      const appUrl = `whatsapp://send?phone=${phone}&text=${text}`;
      const webUrl = `https://wa.me/${phone}?text=${text}`;
      openDeepLink(appUrl, webUrl);
    });
  }

  const ig = document.getElementById("igLink");
  if (ig) {
    ig.addEventListener("click", function (e) {
      e.preventDefault();
      const username = "batuhanozkan.38";
      const appUrl = `instagram://user?username=${username}`;
      const webUrl = `https://www.instagram.com/${username}`;
      openDeepLink(appUrl, webUrl);
    });
  }
})();
