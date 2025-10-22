// Basit, yeniden kullanılabilir slider.
// HTML: .slider > .slides > img* , .nav.prev/.nav.next , .dots
document.addEventListener("DOMContentLoaded", () => {
  const sliders = document.querySelectorAll(".slider");

  sliders.forEach((slider) => {
    const track = slider.querySelector(".slides");
    const slides = Array.from(track.querySelectorAll("img"));
    const prevBtn = slider.querySelector(".prev");
    const nextBtn = slider.querySelector(".next");
    const dotsWrap = slider.querySelector(".dots");

    if (!track || slides.length === 0) return;

    // dots
    const dots = slides.map((_, i) => {
      const b = document.createElement("button");
      b.setAttribute("aria-label", `Slide ${i + 1}`);
      dotsWrap.appendChild(b);
      return b;
    });

    let index = 0;
    let autoplay = slider.dataset.autoplay === "true";
    let interval = Number(slider.dataset.interval || 3000);
    let timer = null;

    function setIndex(i) {
      index = (i + slides.length) % slides.length;
      track.style.transform = `translateX(-${index * 100}%)`;
      dots.forEach((d, k) => d.classList.toggle("active", k === index));
    }

    function next() { setIndex(index + 1); }
    function prev() { setIndex(index - 1); }

    // events
    nextBtn?.addEventListener("click", () => { next(); resetAuto(); });
    prevBtn?.addEventListener("click", () => { prev(); resetAuto(); });
    dots.forEach((d, i) => d.addEventListener("click", () => { setIndex(i); resetAuto(); }));

    // swipe (touch)
    let startX = null;
    slider.addEventListener("touchstart", (e) => { startX = e.touches[0].clientX; }, {passive:true});
    slider.addEventListener("touchmove", (e) => {
      if (startX == null) return;
      const dx = e.touches[0].clientX - startX;
      if (Math.abs(dx) > 50) {
        dx > 0 ? prev() : next();
        startX = null; resetAuto();
      }
    }, {passive:true});
    slider.addEventListener("touchend", () => { startX = null; });

    // autoplay
    function startAuto() {
      if (!autoplay || slides.length < 2) return;
      stopAuto();
      timer = setInterval(next, interval);
    }
    function stopAuto() { if (timer) clearInterval(timer); timer = null; }
    function resetAuto() { if (autoplay) { stopAuto(); startAuto(); } }

    slider.addEventListener("mouseenter", stopAuto);
    slider.addEventListener("mouseleave", startAuto);

    // init
    setIndex(0);
    startAuto();
  });

  // (Opsiyonel) Sidebar bulunuyor mu uyarısı
  const sidebar = document.querySelector(".sidebar");
  if (!sidebar) console.warn("Sidebar bulunamadı. Lütfen sidebar bileşenini ekleyin.");
});
