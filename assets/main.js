/**
 * BedWars Parsi - Official Vanilla JavaScript Engine
 * Fully compatible with GitHub Pages Drag & Drop (Zero build required)
 */

document.addEventListener('DOMContentLoaded', () => {
  initMobileMenu();
  initCopyButtons();
  initPingSimulator();
  initProductFilters();
  initModals();
  initTelegramOrderBuilder();
  initContactForm();
  initParticles();
});

/* ==========================================================================
   Toast Notification System
   ========================================================================== */
function showToast(message, type = 'info') {
  let container = document.querySelector('.toast-container');
  if (!container) {
    container = document.createElement('div');
    container.className = 'toast-container';
    document.body.appendChild(container);
  }

  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  
  let iconSvg = `
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#0ea5e9" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
      <path d="M20 6L9 17l-5-5"/>
    </svg>
  `;

  if (type === 'copy') {
    iconSvg = `
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#10b981" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
        <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
        <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
      </svg>
    `;
  }

  toast.innerHTML = `${iconSvg} <span>${message}</span>`;
  container.appendChild(toast);

  // Trigger animation
  requestAnimationFrame(() => {
    toast.classList.add('show');
  });

  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => {
      toast.remove();
    }, 300);
  }, 3500);
}

/* ==========================================================================
   Mobile Menu Toggle
   ========================================================================== */
function initMobileMenu() {
  const toggleBtn = document.querySelector('.mobile-toggle');
  const navMenu = document.querySelector('.nav-menu');

  if (toggleBtn && navMenu) {
    toggleBtn.addEventListener('click', () => {
      navMenu.classList.toggle('open');
      const isOpen = navMenu.classList.contains('open');
      toggleBtn.setAttribute('aria-expanded', isOpen);
    });

    // Close when clicking outside
    document.addEventListener('click', (e) => {
      if (!toggleBtn.contains(e.target) && !navMenu.contains(e.target)) {
        navMenu.classList.remove('open');
      }
    });
  }
}

/* ==========================================================================
   Copy Server IP
   ========================================================================== */
function initCopyButtons() {
  const ipBoxes = document.querySelectorAll('.server-ip-box');
  
  ipBoxes.forEach((box) => {
    box.addEventListener('click', async () => {
      const ip = box.getAttribute('data-ip') || box.querySelector('.server-ip-text')?.textContent?.trim();
      const serverName = box.getAttribute('data-name') || 'سرور';
      
      if (ip) {
        try {
          await navigator.clipboard.writeText(ip);
          showToast(`آدرس آی‌پی ${serverName} (${ip}) با موفقیت کپی شد!`, 'copy');
          
          // Visual click feedback
          box.style.borderColor = '#10b981';
          const originalText = box.querySelector('.copy-icon');
          if (originalText) {
            originalText.style.color = '#10b981';
            setTimeout(() => {
              box.style.borderColor = '';
              originalText.style.color = '';
            }, 1200);
          }
        } catch (err) {
          // Fallback for older browsers
          const textarea = document.createElement('textarea');
          textarea.value = ip;
          document.body.appendChild(textarea);
          textarea.select();
          document.execCommand('copy');
          document.body.removeChild(textarea);
          showToast(`آدرس آی‌پی کپی شد: ${ip}`, 'copy');
        }
      }
    });
  });
}

/* ==========================================================================
   Server Ping & Live Status Simulation
   ========================================================================== */
function initPingSimulator() {
  const pingElements = document.querySelectorAll('[data-ping]');
  
  pingElements.forEach(el => {
    const basePing = parseInt(el.getAttribute('data-ping'), 10) || 60;
    // Slight realistic fluctuation
    setInterval(() => {
      const jitter = Math.floor(Math.random() * 7) - 3;
      const currentPing = Math.max(12, basePing + jitter);
      el.textContent = `${currentPing} ms`;
    }, 4000);
  });
}

/* ==========================================================================
   Product / Resource Pack Filter & Search
   ========================================================================== */
function initProductFilters() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const searchInput = document.querySelector('.search-input');
  const productCards = document.querySelectorAll('.product-card');

  function applyFilters() {
    const activeCategory = document.querySelector('.filter-btn.active')?.getAttribute('data-category') || 'all';
    const searchQuery = searchInput ? searchInput.value.toLowerCase().trim() : '';

    productCards.forEach(card => {
      const category = card.getAttribute('data-category') || '';
      const title = (card.querySelector('.product-title')?.textContent || '').toLowerCase();
      const desc = (card.querySelector('.product-desc')?.textContent || '').toLowerCase();
      const tags = (card.querySelector('.product-tags')?.textContent || '').toLowerCase();

      const matchesCategory = activeCategory === 'all' || category.includes(activeCategory);
      const matchesSearch = !searchQuery || title.includes(searchQuery) || desc.includes(searchQuery) || tags.includes(searchQuery);

      if (matchesCategory && matchesSearch) {
        card.style.display = 'flex';
      } else {
        card.style.display = 'none';
      }
    });
  }

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      applyFilters();
    });
  });

  if (searchInput) {
    searchInput.addEventListener('input', applyFilters);
  }
}

/* ==========================================================================
   Modal Dialogs (Auth, Preview, Details)
   ========================================================================== */
function initModals() {
  // Auth Modal
  const authBtns = document.querySelectorAll('.auth-btn, [data-modal-target="auth-modal"]');
  const authModal = document.getElementById('auth-modal');
  const closeBtns = document.querySelectorAll('.modal-close, [data-modal-close]');

  authBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      if (authModal) {
        authModal.classList.add('active');
      }
    });
  });

  closeBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.modal-overlay').forEach(m => m.classList.remove('active'));
    });
  });

  // Close when clicking overlay backdrop
  document.querySelectorAll('.modal-overlay').forEach(modal => {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        modal.classList.remove('active');
      }
    });
  });

  // Auth Tabs (Login vs Register)
  const tabBtns = document.querySelectorAll('.auth-tab-btn');
  const authForms = document.querySelectorAll('.auth-form-content');
  
  tabBtns.forEach(tab => {
    tab.addEventListener('click', () => {
      tabBtns.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      const target = tab.getAttribute('data-tab');
      authForms.forEach(f => {
        if (f.id === target) {
          f.style.display = 'block';
        } else {
          f.style.display = 'none';
        }
      });
    });
  });

  // Auth form submissions
  const loginForm = document.getElementById('login-form-element');
  if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
      e.preventDefault();
      showToast('ورود با موفقیت انجام شد! خوش آمدید.', 'copy');
      if (authModal) authModal.classList.remove('active');
    });
  }

  const registerForm = document.getElementById('register-form-element');
  if (registerForm) {
    registerForm.addEventListener('submit', (e) => {
      e.preventDefault();
      showToast('ثبت‌نام شما با موفقیت تکمیل شد.', 'copy');
      if (authModal) authModal.classList.remove('active');
    });
  }

  // Product Preview Modal
  const previewBtns = document.querySelectorAll('.btn-preview-pack');
  const previewModal = document.getElementById('preview-modal');

  previewBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const card = btn.closest('.product-card');
      if (card && previewModal) {
        const title = card.querySelector('.product-title')?.textContent || 'ریسورس‌پک بدوارز';
        const desc = card.querySelector('.product-desc')?.textContent || '';
        const tags = card.querySelector('.product-tags')?.innerHTML || '';
        const downloadUrl = card.getAttribute('data-download') || '#';
        const price = card.getAttribute('data-price') || 'رایگان';

        const modalTitle = previewModal.querySelector('.modal-preview-title');
        const modalDesc = previewModal.querySelector('.modal-preview-desc');
        const modalTags = previewModal.querySelector('.modal-preview-tags');
        const modalDlBtn = previewModal.querySelector('.modal-download-btn');
        const modalTgBtn = previewModal.querySelector('.modal-telegram-btn');

        if (modalTitle) modalTitle.textContent = title;
        if (modalDesc) modalDesc.textContent = desc;
        if (modalTags) modalTags.innerHTML = tags;
        if (modalDlBtn) {
          modalDlBtn.href = downloadUrl;
          modalDlBtn.textContent = price === 'رایگان' ? 'دانلود مستقیم فایل' : `خرید VIP (${price})`;
        }
        if (modalTgBtn) {
          const telegramMessage = encodeURIComponent(`سلام و درود! قصد سفارش محصول زیر را دارم:\n📦 محصول: ${title}\n💰 قیمت/نوع: ${price}\nلطفاً راهنمایی بفرمایید.`);
          modalTgBtn.href = `https://t.me/BedWarsParsiSupport?text=${telegramMessage}`;
        }

        previewModal.classList.add('active');
      }
    });
  });
}

/* ==========================================================================
   Interactive Telegram Order Builder (contact.html & products)
   ========================================================================== */
function initTelegramOrderBuilder() {
  const serviceSelect = document.getElementById('order-service');
  const ignInput = document.getElementById('order-ign');
  const contactIdInput = document.getElementById('order-contact');
  const notesInput = document.getElementById('order-notes');
  const addonCheckboxes = document.querySelectorAll('.order-addon-checkbox');
  const sendTelegramBtn = document.getElementById('btn-send-telegram');
  
  const summaryService = document.getElementById('summary-service');
  const summaryIGN = document.getElementById('summary-ign');
  const summaryAddons = document.getElementById('summary-addons');
  const summaryTotal = document.getElementById('summary-total');

  if (!serviceSelect || !sendTelegramBtn) return;

  function updateCalculation() {
    const selectedOption = serviceSelect.options[serviceSelect.selectedIndex];
    const basePrice = parseInt(selectedOption?.getAttribute('data-price') || '0', 10);
    const serviceName = selectedOption?.text || 'انتخاب نشده';
    const ign = ignInput?.value?.trim() || 'ثبت‌نشده';
    const contactId = contactIdInput?.value?.trim() || 'ثبت‌نشده';
    const notes = notesInput?.value?.trim() || 'بدون توضیحات اضافی';

    let addonsPrice = 0;
    let addonsList = [];

    addonCheckboxes.forEach(cb => {
      if (cb.checked) {
        addonsPrice += parseInt(cb.getAttribute('data-price') || '0', 10);
        addonsList.push(cb.getAttribute('data-title') || cb.value);
      }
    });

    const totalPrice = basePrice + addonsPrice;

    if (summaryService) summaryService.textContent = serviceName;
    if (summaryIGN) summaryIGN.textContent = ign;
    if (summaryAddons) {
      summaryAddons.textContent = addonsList.length > 0 ? addonsList.join(' + ') : 'بدون افزونه';
    }
    if (summaryTotal) {
      summaryTotal.textContent = totalPrice === 0 ? 'رایگان / هماهنگی پشتیبانی' : `${totalPrice.toLocaleString('fa-IR')} تومان`;
    }

    // Build Telegram deep link
    const textLines = [
      '👑 درخواست سفارش جدید از پرتال بدوارز پارسی 👑',
      '─────────────────────────',
      `📦 سرویس درخواستی: ${serviceName}`,
      `🎮 نام کاربری ماینکرفت (IGN): ${ign}`,
      `📱 آیدی تلگرام / دیسکورد: ${contactId}`,
      `⚡ افزونه‌های انتخابی: ${addonsList.length > 0 ? addonsList.join(', ') : 'ندارد'}`,
      `💰 مبلغ نهایی برآورد شده: ${totalPrice.toLocaleString('fa-IR')} تومان`,
      `📝 توضیحات تکمیلی: ${notes}`,
      '─────────────────────────',
      'لطفاً جهت ثبت و نهایی‌سازی سفارش راهنمایی بفرمایید.'
    ];

    const encodedText = encodeURIComponent(textLines.join('\n'));
    sendTelegramBtn.href = `https://t.me/BedWarsParsiSupport?text=${encodedText}`;
  }

  serviceSelect.addEventListener('change', updateCalculation);
  if (ignInput) ignInput.addEventListener('input', updateCalculation);
  if (contactIdInput) contactIdInput.addEventListener('input', updateCalculation);
  if (notesInput) notesInput.addEventListener('input', updateCalculation);
  addonCheckboxes.forEach(cb => cb.addEventListener('change', updateCalculation));

  sendTelegramBtn.addEventListener('click', (e) => {
    const ign = ignInput?.value?.trim();
    if (!ign) {
      e.preventDefault();
      showToast('لطفاً ابتدا نام کاربری ماینکرفت (IGN) خود را وارد کنید.', 'error');
      ignInput?.focus();
      return;
    }
    showToast('در حال هدایت به تلگرام پشتیبانی...', 'copy');
  });

  // Initial calculation run
  updateCalculation();
}

/* ==========================================================================
   Contact Form Validation
   ========================================================================== */
function initContactForm() {
  const form = document.getElementById('contact-us-form');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = form.querySelector('[name="name"]')?.value?.trim();
    const email = form.querySelector('[name="email"]')?.value?.trim();
    const message = form.querySelector('[name="message"]')?.value?.trim();

    if (!name || !email || !message) {
      showToast('لطفاً تمامی فیلدهای الزامی را تکمیل نمایید.', 'error');
      return;
    }

    // Direct Telegram redirection option
    const tgMsg = encodeURIComponent(`📬 پیام جدید از فرم تماس سایت بدوارز پارسی\n👤 نام: ${name}\n📧 ایمیل: ${email}\n💬 پیام: ${message}`);
    
    showToast('پیام شما ثبت شد و به واحد پشتیبانی ارجاع داده شد.', 'copy');
    form.reset();

    setTimeout(() => {
      const sendViaTg = confirm('آیا تمایل دارید این پیام مستقیماً در تلگرام نیز برای پشتیبان ارسال شود؟');
      if (sendViaTg) {
        window.open(`https://t.me/BedWarsParsiSupport?text=${tgMsg}`, '_blank');
      }
    }, 800);
  });
}

/* ==========================================================================
   Subtle Particle / Star Background Canvas
   ========================================================================== */
function initParticles() {
  const canvas = document.getElementById('bg-particles');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let width, height;
  let particles = [];

  function resize() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  }

  resize();
  window.addEventListener('resize', resize);

  for (let i = 0; i < 45; i++) {
    particles.push({
      x: Math.random() * width,
      y: Math.random() * height,
      size: Math.random() * 2 + 0.5,
      speedX: (Math.random() - 0.5) * 0.3,
      speedY: (Math.random() - 0.5) * 0.3,
      color: i % 3 === 0 ? 'rgba(139, 92, 246, 0.6)' : i % 3 === 1 ? 'rgba(14, 165, 233, 0.6)' : 'rgba(245, 158, 11, 0.4)'
    });
  }

  function render() {
    ctx.clearRect(0, 0, width, height);
    particles.forEach(p => {
      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fill();

      p.x += p.speedX;
      p.y += p.speedY;

      if (p.x < 0) p.x = width;
      if (p.x > width) p.x = 0;
      if (p.y < 0) p.y = height;
      if (p.y > height) p.y = 0;
    });

    requestAnimationFrame(render);
  }

  render();
}
