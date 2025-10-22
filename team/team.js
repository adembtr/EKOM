/**
 * Basit, çoklu slider kurulum dosyası.
 * - Her .slider kendi içinde çalışır.
 * - data-autoplay="true" ise otomatik kayar.
 * - data-interval="3000" ile süre ms cinsinden verilir.
 */
(function () {
  const sliders = Array.from(document.querySelectorAll(".slider"));

  sliders.forEach(initSlider);

  function initSlider(root) {
    const slidesWrap = root.querySelector(".slides");
    const slideEls = Array.from(root.querySelectorAll(".slide"));
    const prevBtn = root.querySelector(".nav.prev");
    const nextBtn = root.querySelector(".nav.next");
    const dotsWrap = root.querySelector(".dots");

    let index = 0;
    let timer = null;

    // Dots
    slideEls.forEach((_, i) => {
      const b = document.createElement("button");
      b.setAttribute("aria-label", `Slide ${i + 1}`);
      b.addEventListener("click", () => goTo(i, true));
      dotsWrap.appendChild(b);
    });

    function update() {
      slidesWrap.style.transform = `translateX(-${index * 100}%)`;
      Array.from(dotsWrap.children).forEach((d, i) =>
        d.classList.toggle("active", i === index)
      );
    }

    function goTo(i, user = false) {
      index = (i + slideEls.length) % slideEls.length;
      update();
      if (user) restartAutoplay();
    }
    function next() { goTo(index + 1); }
    function prev() { goTo(index - 1); }

    // Buttons
    if (prevBtn) prevBtn.addEventListener("click", prev);
    if (nextBtn) nextBtn.addEventListener("click", next);

    // Autoplay
    const autoplay = root.dataset.autoplay === "true";
    const interval = Number(root.dataset.interval) || 3000;

    function startAutoplay() {
      if (!autoplay) return;
      stopAutoplay();
      timer = setInterval(next, interval);
    }
    function stopAutoplay() {
      if (timer) clearInterval(timer);
      timer = null;
    }
    function restartAutoplay() {
      stopAutoplay();
      startAutoplay();
    }

    // Hover'da durdur, ayrılınca devam et
    root.addEventListener("mouseenter", stopAutoplay);
    root.addEventListener("mouseleave", startAutoplay);

    // İlk durum
    update();
    startAutoplay();
  }

  /**
   * Sidebar aç/kapa ile içerik yan kaydırma:
   * Bunu CSS zaten .sidebar(+|~).team seçicileri ile çözüyor.
   * Ancak bazı temalarda reflow gerekebilir; güvenlik için
   * pencere boyutu değiştiğinde slayt transform'u tazeliyoruz.
   */
  window.addEventListener("resize", () => {
    document.querySelectorAll(".slider .slides").forEach((el) => {
      // Geçerli transform değerini korumak yeterli
      const transform = getComputedStyle(el).transform;
      el.style.transform = transform;
    });
  });
})();
