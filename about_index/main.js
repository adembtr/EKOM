/* Otomatik slider (5 sn) */
(function(){
  const track = document.getElementById('slides');
  if(!track) return;
  const n = track.children.length;
  let i = 0;
  const go = k => { i = (k+n)%n; track.style.transform = `translateX(-${i*100}%)`; };
  setInterval(()=>go(i+1), 5000);
  go(0);
})();

/* Sidebar açılıp kapanınca içerik alanını kaydır */
(function(){
  const sidebar = document.querySelector('.sidebar');
  const content = document.querySelector('.content');

  function adjustContentMargin(){
    if(window.innerWidth > 1024){
      // Masaüstü: sidebar genişliği kadar boşluk bırak
      const sidebarWidth = sidebar.classList.contains('collapsed') ? 85 : 270;
      content.style.marginLeft = (sidebarWidth + 32) + 'px';
      content.style.marginTop = '0px';
    } else {
      // Mobil: sidebar sabit üstte, içerik aşağıda
      const header = sidebar.querySelector('.sidebar-header');
      const headerBottom = header.getBoundingClientRect().bottom;
      content.style.marginLeft = '16px';
      content.style.marginRight = '16px';
      content.style.marginTop = (headerBottom + 20) + 'px';
    }
  }

  // Sidebar aç/kapa olaylarını dinle
  ['click','transitionend','load','resize'].forEach(evt =>
    window.addEventListener(evt, ()=>setTimeout(adjustContentMargin,10))
  );

  adjustContentMargin();
})();
