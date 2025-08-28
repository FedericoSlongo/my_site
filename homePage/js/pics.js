document.addEventListener('DOMContentLoaded', function(){
  (function(){
    // create modal overlay if page doesn't include it
    function createModalIfMissing() {
      let modal = document.getElementById('imgModal');
      if (modal) return modal;
      modal = document.createElement('div');
      modal.id = 'imgModal';
      modal.className = 'modal-overlay';
      modal.setAttribute('aria-hidden', 'true');

      const closeBtn = document.createElement('button');
      closeBtn.className = 'modal-close';
      closeBtn.setAttribute('aria-label', 'Close');
      closeBtn.textContent = '×';

      const content = document.createElement('div');
      content.className = 'modal-content';
      content.setAttribute('role', 'dialog');
      content.setAttribute('aria-modal', 'true');

      const img = document.createElement('img');
      img.id = 'modalImage';
      img.src = '';
      img.alt = 'Full-size image';

      content.appendChild(img);
      modal.appendChild(closeBtn);
      modal.appendChild(content);
      document.body.appendChild(modal);
      return modal;
    }

    const modal = createModalIfMissing();
    const modalImg = document.getElementById('modalImage');
    const closeBtn = modal.querySelector('.modal-close');

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
      // resolve relative URL against document location to avoid issues with spaces
      try {
        const resolved = new URL(href, document.baseURI).href;
        openModal(resolved, a.querySelector('img')?.alt);
      } catch (err) {
        openModal(href, a.querySelector('img')?.alt);
      }
    });

    if (closeBtn) closeBtn.addEventListener('click', closeModal);
    modal.addEventListener('click', function(e){
      if (e.target === modal || e.target === closeBtn) closeModal();
    });
    document.addEventListener('keydown', function(e){
      if (e.key === 'Escape') closeModal();
    });

    // signal loaded
    window.__pics_loaded__ = true;
  })();
});