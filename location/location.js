// Birden fazla "Konumu Kopyala" butonunu destekle
document.querySelectorAll('.copy-location').forEach((copyButton) => {
  copyButton.addEventListener('click', async () => {
    const location = copyButton.dataset.location;
    try {
      await navigator.clipboard.writeText(location);
      const originalText = copyButton.innerHTML;
      copyButton.innerHTML = '<i class="bi bi-check2"></i> Kopyalandı!';
      copyButton.classList.add('copied');
      setTimeout(() => {
        copyButton.innerHTML = originalText;
        copyButton.classList.remove('copied');
      }, 2000);
    } catch (err) {
      console.error('Konum kopyalanamadı:', err);
      alert('Konum kopyalanırken bir hata oluştu.');
    }
  });
});

/* JS tarafında ayrıca margin değiştirmene gerek yok.
   CSS’te .sidebar + .location ve .sidebar.collapsed + .location
   kuralları bunu otomatik yapıyor. HTML’de <aside.sidebar> hemen
   ardından <div class="location"> gelmeye devam etsin, yeter. */
