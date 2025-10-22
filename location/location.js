/* =========================
   1) "Konumu Kopyala" – çoklu buton desteği + toast
   ========================= */
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

/* =========================
   2) Scroll’da yumuşak giriş (IntersectionObserver)
   ========================= */
(function revealOnScroll(){
  const items = document.querySelectorAll('.animate-on-scroll');
  if (!items.length) return;

  const io = new IntersectionObserver((entries)=>{
    entries.forEach((e)=>{
      if (e.isIntersecting) {
        e.target.classList.add('in-view');
        io.unobserve(e.target); // bir kez animasyon
      }
    });
  }, { rootMargin: '0px 0px -10% 0px', threshold: .1 });

  items.forEach(el => io.observe(el));
})();

/* =========================
   3) (İsteğe bağlı) "Konuma Git" butonları için destek
      HTML’de data-go ile eklenirse çalışır:
      <button class="btn go-location" data-go="https://maps.app.goo.gl/...">
   ========================= */
(function goLocationSupport(){
  document.addEventListener('click', (ev)=>{
    const btn = ev.target.closest('.go-location');
    if (!btn) return;
    const url = btn.dataset.go;
    if (url) window.open(url, '_blank', 'noopener,noreferrer');
  });
})();
