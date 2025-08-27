(function(){
  const modal = document.getElementById('imgModal');
  const modalImg = document.getElementById('modalImage');
  const closeBtn = modal?.querySelector('.modal-close');

  function openModal(src, alt) {
    if (!modal || !modalImg) return;
    modalImg.src = src;
    modalImg.alt = alt || '';
    modal.classList.add('show');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }
  function closeModal() {
    if (!modal || !modalImg) return;
    modal.classList.remove('show');
    modal.setAttribute('aria-hidden', 'true');
    modalImg.src = '';
    document.body.style.overflow = '';
  }

  // Delegate clicks from page to intercept image link clicks
  document.addEventListener('click', function(e){
    const a = e.target.closest('.image-links a');
    if (!a) return;
    const href = a.getAttribute('href');
    if (!href) return;
    e.preventDefault();
    openModal(href, a.querySelector('img')?.alt);
  });

  if (closeBtn) closeBtn.addEventListener('click', closeModal);
  modal?.addEventListener('click', function(e){
    if (e.target === modal || e.target === closeBtn) closeModal();
  });
  document.addEventListener('keydown', function(e){
    if (e.key === 'Escape') closeModal();
  });
})();