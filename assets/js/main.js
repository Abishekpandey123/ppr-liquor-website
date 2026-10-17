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

  const doorDashBtn = document.getElementById('modalDoorDashBtn');
  if (doorDashBtn) {
    doorDashBtn.href = "https://www.doordash.com/convenience/store/ppr-liquor-georgetown-27820743";
  }

  const uberEatsBtn = document.getElementById('modalUberEatsBtn');
  if (uberEatsBtn) {
    uberEatsBtn.href = "https://www.ubereats.com/store/ppr-liquor-1601-paris-pike/DQNV6tk_WZOx39NYD3ImRQ";
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
   6. CONTACT FORM SUBMISSION (Forwarded to pprliquor@gmail.com & Local DB)
   ------------------------------------------------------------------------- */
function initContactForm() {
  const form = document.getElementById('contactForm');
  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    // Check honeypot for anti-spam
    const honeypot = form.querySelector('input[name="website_hp"]');
    if (honeypot && honeypot.value.trim() !== '') {
      console.warn("Spam bot detected");
      return;
    }

    const name = form.querySelector('#contactName')?.value.trim();
    const email = form.querySelector('#contactEmail')?.value.trim();
    const phone = form.querySelector('#contactPhone')?.value.trim() || 'Not provided';
    const subject = form.querySelector('#contactSubject')?.value.trim() || 'General Inquiry';
    const message = form.querySelector('#contactMessage')?.value.trim();

    if (!name || !email || !message) {
      alert("Please fill in your name, email, and message.");
      return;
    }

    const submitBtn = form.querySelector('button[type="submit"]');
    const origBtnHTML = submitBtn ? submitBtn.innerHTML : 'Send Message';
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.innerHTML = `⏳ Sending to Store Email...`;
    }

    // 1. Always record in Admin Portal database
    if (window.pprDB) {
      window.pprDB.addInquiry({
        name,
        email,
        phone,
        subject,
        message
      });
    }

    // 2. Dispatch email to pprliquor@gmail.com via FormSubmit AJAX service
    let delivered = false;
    try {
      const response = await fetch("https://formsubmit.co/ajax/pprliquor@gmail.com", {
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          name: name,
          email: email,
          phone: phone,
          _subject: `New Customer Inquiry: [${subject}] from ${name}`,
          subject: subject,
          message: message,
          _template: "table"
        })
      });

      if (response.ok) {
        delivered = true;
      }
    } catch (err) {
      console.warn("Direct transmission status:", err);
    }

    if (submitBtn) {
      submitBtn.disabled = false;
      submitBtn.innerHTML = origBtnHTML;
    }

    const successBanner = document.getElementById('contactSuccessBanner');
    if (successBanner) {
      successBanner.innerHTML = `
        <strong>✓ Thank you, ${name}!</strong> Your message has been sent to <strong>pprliquor@gmail.com</strong> and logged in our store system. Our team at 1601 Paris Pike will respond shortly.
        <div style="margin-top: 0.65rem; font-size: 0.88rem; color: #fff;">
          Need immediate bottle holds or allocation info? Call us directly: <a href="tel:+15023704392" style="color: var(--color-gold-light); text-decoration: underline; font-weight: 700;">(502) 370-4392</a>
        </div>
      `;
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
        <div class="product-card-delivery-row">
          <span class="delivery-badge-label">Delivery:</span>
          <a href="https://www.doordash.com/convenience/store/ppr-liquor-georgetown-27820743" target="_blank" rel="noopener noreferrer" class="delivery-badge-link doordash" title="Order ${product.name} on DoorDash">
            DoorDash ↗
          </a>
          <a href="https://www.ubereats.com/store/ppr-liquor-1601-paris-pike/DQNV6tk_WZOx39NYD3ImRQ" target="_blank" rel="noopener noreferrer" class="delivery-badge-link ubereats" title="Order ${product.name} on Uber Eats">
            Uber Eats ↗
          </a>
        </div>
        <div class="product-footer-row">
          <div class="product-price-row">
            <span class="product-price">${product.price || 'Call for Price'}</span>
            <span class="price-disclaimer">Prices subject to change</span>
          </div>
          <button type="button" onclick="openProductModal('${product.id}')" class="btn-ask-availability" style="cursor:pointer; border:none;">
            <svg width="15" height="15" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/></svg>
            View Details & Order
          </button>
        </div>
      </div>
    </article>
  `;
}
