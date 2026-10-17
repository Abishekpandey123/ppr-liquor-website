/**
 * PPR LIQUOR - Main Public Website Interactions & Logic
 * 1601 Paris Pike, Georgetown, Kentucky 40324
 */

document.addEventListener('DOMContentLoaded', () => {
  initAgeGate();
  initStoreStatus();
  initNavigation();
  initAnnouncementBar();
  initProductModal();
  initContactForm();
  initFaqAccordion();
});

/* -------------------------------------------------------------------------
   1. AGE VERIFICATION MODAL (21+ Strict Compliance)
   ------------------------------------------------------------------------- */
function initAgeGate() {
  const ageGateOverlay = document.getElementById('ageGateModal');
  if (!ageGateOverlay) return;

  const isVerified = localStorage.getItem('ppr_age_verified_v1');
  if (isVerified === 'true') {
    ageGateOverlay.classList.add('hidden');
  } else {
    ageGateOverlay.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
  }

  const btnConfirm = document.getElementById('btnAgeConfirm');
  const btnReject = document.getElementById('btnAgeReject');

  if (btnConfirm) {
    btnConfirm.addEventListener('click', () => {
      localStorage.setItem('ppr_age_verified_v1', 'true');
      ageGateOverlay.classList.add('hidden');
      document.body.style.overflow = '';
    });
  }

  if (btnReject) {
    btnReject.addEventListener('click', () => {
      alert("You must be 21 years of age or older to enter PPR LIQUOR. Redirecting you to Google.");
      window.location.href = "https://www.responsibility.org/";
    });
  }
}

/* -------------------------------------------------------------------------
   2. REAL-TIME STORE HOURS & OPEN/CLOSED STATUS
   ------------------------------------------------------------------------- */
function initStoreStatus() {
  if (!window.pprDB) return;
  const statusObj = window.pprDB.getStoreLiveStatus();

  // Update all elements with class 'js-store-status'
  const statusBadges = document.querySelectorAll('.js-store-status');
  statusBadges.forEach(badge => {
    badge.className = `top-bar-status js-store-status ${statusObj.badgeClass}`;
    badge.innerHTML = `<span class="status-dot"></span> <span>${statusObj.statusText}</span>`;
  });

  // Update today's row in hours table if present
  if (statusObj.dayKey) {
    const todayRow = document.querySelector(`.hours-row[data-day="${statusObj.dayKey}"]`);
    if (todayRow) {
      todayRow.classList.add('current-day');
      const badge = todayRow.querySelector('.day-badge');
      if (badge) badge.textContent = "Today";
    }
  }

  // Set address copy button functionality
  const copyBtn = document.getElementById('btnCopyAddress');
  if (copyBtn) {
    copyBtn.addEventListener('click', () => {
      const address = "1601 Paris Pike, Georgetown, Kentucky 40324";
      navigator.clipboard.writeText(address).then(() => {
        const orig = copyBtn.innerHTML;
        copyBtn.innerHTML = `✓ Copied Address`;
        setTimeout(() => { copyBtn.innerHTML = orig; }, 2200);
      }).catch(() => {
        alert("PPR LIQUOR Address: 1601 Paris Pike, Georgetown, KY 40324");
      });
    });
  }
}

/* -------------------------------------------------------------------------
   3. MOBILE NAVIGATION DRAWER
   ------------------------------------------------------------------------- */
function initNavigation() {
  const toggleBtn = document.getElementById('mobileMenuToggle');
  const mobileMenu = document.getElementById('mobileMenu');
  const closeBtn = document.getElementById('mobileMenuClose');

  if (toggleBtn && mobileMenu) {
    toggleBtn.addEventListener('click', () => {
      mobileMenu.classList.toggle('active');
      document.body.style.overflow = mobileMenu.classList.contains('active') ? 'hidden' : '';
    });
  }

  if (closeBtn && mobileMenu) {
    closeBtn.addEventListener('click', () => {
      mobileMenu.classList.remove('active');
      document.body.style.overflow = '';
    });
  }

  // Close when clicking mobile nav links
  const mobileLinks = document.querySelectorAll('.mobile-nav-link');
  mobileLinks.forEach(link => {
    link.addEventListener('click', () => {
      if (mobileMenu) {
        mobileMenu.classList.remove('active');
        document.body.style.overflow = '';
      }
    });
  });
}

/* -------------------------------------------------------------------------
   4. ANNOUNCEMENT BAR TICKER
   ------------------------------------------------------------------------- */
function initAnnouncementBar() {
  if (!window.pprDB) return;
  const storeInfo = window.pprDB.getStoreInfo();
  const tickerEl = document.getElementById('announcementTicker');
  if (tickerEl && storeInfo.announcement) {
    tickerEl.innerHTML = storeInfo.announcement;
  }
}

/* -------------------------------------------------------------------------
   5. PRODUCT QUICK-VIEW MODAL
   ------------------------------------------------------------------------- */
let currentModalProductId = null;

function initProductModal() {
  const modalOverlay = document.getElementById('productModal');
  const closeBtn = document.getElementById('modalCloseBtn');

  if (closeBtn && modalOverlay) {
    closeBtn.addEventListener('click', () => {
      modalOverlay.classList.remove('active');
      document.body.style.overflow = '';
    });

    modalOverlay.addEventListener('click', (e) => {
      if (e.target === modalOverlay) {
        modalOverlay.classList.remove('active');
        document.body.style.overflow = '';
      }
    });
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modalOverlay && modalOverlay.classList.contains('active')) {
      modalOverlay.classList.remove('active');
      document.body.style.overflow = '';
    }
  });
}

function openProductModal(productId) {
  if (!window.pprDB) return;
  const product = window.pprDB.getProductById(productId);
  if (!product) return;

  const modalOverlay = document.getElementById('productModal');
  const imgEl = document.getElementById('modalProductImg');
  const catEl = document.getElementById('modalProductCategory');
  const titleEl = document.getElementById('modalProductTitle');
  const specsEl = document.getElementById('modalProductSpecs');
  const descEl = document.getElementById('modalProductDesc');
  const tagsEl = document.getElementById('modalProductTags');
  const priceEl = document.getElementById('modalProductPrice');
  const statusEl = document.getElementById('modalProductStatus');
  const callBtn = document.getElementById('modalProductCallBtn');

  if (imgEl) imgEl.src = product.image || 'assets/images/bourbon-bottle.jpg';
  if (catEl) catEl.textContent = `${product.category} • ${product.brand}`;
  if (titleEl) titleEl.textContent = product.name;
  if (specsEl) specsEl.textContent = `Size: ${product.size} | Proof/ABV: ${product.proof || 'N/A'}`;
  if (descEl) descEl.textContent = product.description || "Authentic quality selection at PPR LIQUOR Georgetown, Kentucky.";

  if (tagsEl) {
    tagsEl.innerHTML = '';
    if (product.tastingNotes && product.tastingNotes.length > 0) {
      product.tastingNotes.forEach(tag => {
        const span = document.createElement('span');
        span.className = 'tasting-tag';
        span.textContent = tag;
        tagsEl.appendChild(span);
      });
    }
  }

  if (priceEl) priceEl.textContent = product.price || "Inquire in Store";
  
  if (statusEl) {
    statusEl.textContent = product.status || "In Stock";
    statusEl.className = product.status === "Limited Allocation" ? "badge-allocation" : "badge-instock";
    statusEl.style.position = "static";
    statusEl.style.display = "inline-block";
  }

  if (callBtn) {
    callBtn.href = `tel:+15023704392`;
    callBtn.innerHTML = `📞 Call PPR LIQUOR to Inquire: (502) 370-4392`;
  }

  if (modalOverlay) {
    modalOverlay.classList.add('active');
    document.body.style.overflow = 'hidden';
  }
}

/* -------------------------------------------------------------------------
   6. CONTACT FORM SUBMISSION
   ------------------------------------------------------------------------- */
function initContactForm() {
  const form = document.getElementById('contactForm');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    // Check honeypot for anti-spam
    const honeypot = form.querySelector('input[name="website_hp"]');
    if (honeypot && honeypot.value.trim() !== '') {
      console.warn("Spam bot detected");
      return;
    }

    const name = form.querySelector('#contactName')?.value.trim();
    const email = form.querySelector('#contactEmail')?.value.trim();
    const phone = form.querySelector('#contactPhone')?.value.trim();
    const subject = form.querySelector('#contactSubject')?.value.trim();
    const message = form.querySelector('#contactMessage')?.value.trim();

    if (!name || !email || !message) {
      alert("Please fill in your name, email, and message.");
      return;
    }

    if (window.pprDB) {
      window.pprDB.addInquiry({
        name,
        email,
        phone: phone || "Not provided",
        subject: subject || "General Inquiry",
        message
      });
    }

    const successBanner = document.getElementById('contactSuccessBanner');
    if (successBanner) {
      successBanner.style.display = 'block';
      successBanner.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }

    form.reset();
  });
}

/* -------------------------------------------------------------------------
   7. FAQ ACCORDION INTERACTION
   ------------------------------------------------------------------------- */
function initFaqAccordion() {
  const faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach(item => {
    const questionBtn = item.querySelector('.faq-question');
    if (questionBtn) {
      questionBtn.addEventListener('click', () => {
        const isActive = item.classList.contains('active');
        // close others
        faqItems.forEach(i => i.classList.remove('active'));
        if (!isActive) {
          item.classList.add('active');
        }
      });
    }
  });
}

/* -------------------------------------------------------------------------
   8. CARD RENDERING HELPER (Used across Home & Catalog)
   ------------------------------------------------------------------------- */
function renderProductCardHTML(product) {
  const isAllocated = product.status === "Limited Allocation";
  const badgeHTML = isAllocated
    ? `<span class="badge-allocation">★ Limited Allocation</span>`
    : `<span class="badge-instock">✓ ${product.status || 'In Stock'}</span>`;

  const tagsHTML = (product.tastingNotes || []).slice(0, 3).map(tag => 
    `<span class="tasting-tag">${tag}</span>`
  ).join('');

  return `
    <article class="product-card" data-id="${product.id}" data-category="${product.category}">
      <div class="product-image-box" onclick="openProductModal('${product.id}')">
        ${badgeHTML}
        <span class="badge-size">${product.size}</span>
        <img src="${product.image || 'assets/images/bourbon-bottle.jpg'}" alt="${product.name}" class="product-card-img" loading="lazy">
      </div>
      <div class="product-body">
        <span class="product-category-tag">${product.category}</span>
        <h3 class="product-title" onclick="openProductModal('${product.id}')" style="cursor:pointer;">${product.name}</h3>
        <div class="product-meta-specs">
          <span>${product.brand}</span>
          <span>•</span>
          <span>${product.proof || 'N/A'}</span>
        </div>
        <div class="product-tasting-tags">
          ${tagsHTML}
        </div>
        <div class="product-footer-row">
          <div class="product-price-row">
            <span class="product-price">${product.price || 'Call for Price'}</span>
            <span class="price-disclaimer">Prices subject to change</span>
          </div>
          <a href="tel:+15023704392" class="btn-ask-availability">
            <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24"><path d="M6.62 10.79a15.05 15.05 0 006.59 6.59l2.2-2.2a1 1 0 011.02-.24 11.72 11.72 0 003.68.59 1 1 0 011 1V20a1 1 0 01-1 1A17 17 0 013 4a1 1 0 011-1h3.5a1 1 0 011 1 11.72 11.72 0 00.59 3.68 1 1 0 01-.25 1.02l-2.22 2.09z"/></svg>
            Call to Ask About Availability
          </a>
        </div>
      </div>
    </article>
  `;
}
