// Kutu, sidebar açılınca sidebar yüksekliği kadar AKICI şekilde aşağı kayar.
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
/*hazırlayan batuhan özkan*/
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

// --- (Opsiyonel) Resim yapıştırma/sürükle-bırak/tıkla seç + önizleme ---
// Bu bölüm HTML'de ilgili ID'ler yoksa otomatik pas geçer.
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
/*hazırlayan batuhan özkan*/
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

// Textarea otomatik yükseklik (readonly olsa bile metne göre boyut ayarlanır)
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

// --- Derin link: Uygulama varsa aç, yoksa web'e düş ---
(function () {
  function openDeepLink(appUrl, webUrl) {
    const start = Date.now();
    // Uygulama linkini dene
    window.location.href = appUrl;

    // 1200ms içinde uygulama açılmazsa web URL'ine düş
    setTimeout(() => {
      if (Date.now() - start < 1500) {
        window.location.href = webUrl;
      }
    }, 1200);
  }
/*hazırlayan batuhan özkan*/
  // WhatsApp
  const wa = document.getElementById("waLink");
  if (wa) {
    wa.addEventListener("click", function (e) {
      e.preventDefault();
      const phone = "905511225039"; // ülke kodu ile, başında 0 yok
      const text = encodeURIComponent("Merhaba, bilgi almak istiyorum.");
      const appUrl = `whatsapp://send?phone=${phone}&text=${text}`;
      const webUrl = `https://wa.me/${phone}?text=${text}`;
      openDeepLink(appUrl, webUrl);
    });
  }

  // Instagram
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
