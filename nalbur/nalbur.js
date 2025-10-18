// ----- Basit otomatik slider (ok/tuş yok, 3 sn'de bir kaydırır) -----
document.addEventListener("DOMContentLoaded", () => {
  const track = document.querySelector(".hero-slider .slides");
  if (!track) return;

  const slides = Array.from(track.querySelectorAll("img"));
  const slideCount = slides.length;
  let index = 0;

  const goTo = (i) => {
    track.style.transform = `translateX(-${i * 100}%)`;
  };

  setInterval(() => {
    index = (index + 1) % slideCount;
    goTo(index);
  }, 3000);
});
