/**
 * PPR LIQUOR - Admin Panel & CMS Controller
 * Allows store owner/staff to manage products, specials, store hours, and view inquiries.
 */

document.addEventListener('DOMContentLoaded', () => {
  initAdminAuth();
  initAdminTabs();
  initDashboardMetrics();
  initProductsManager();
  initSpecialsManager();
  initStoreInfoManager();
  initInquiriesManager();
  initSettingsAndBackup();
});

/* -------------------------------------------------------------------------
   1. AUTHENTICATION & LOGIN SCREEN (Hardened Security)
   ------------------------------------------------------------------------- */
function initAdminAuth() {
  const authWrapper = document.getElementById('adminAuthScreen');
  const loginForm = document.getElementById('adminLoginForm');
  const pinInput = document.getElementById('adminPinInput');
  const errorMsg = document.getElementById('authErrorMsg');
  const logoutBtn = document.getElementById('adminLogoutBtn');

  if (!window.pprDB) return;

  // Check session inactivity (30-minute auto timeout)
  const lastActive = sessionStorage.getItem('ppr_admin_last_activity');
  const now = Date.now();
  if (lastActive && (now - parseInt(lastActive, 10)) > 30 * 60 * 1000) {
    window.pprDB.logout();
    sessionStorage.removeItem('ppr_admin_last_activity');
  }

  if (window.pprDB.checkAuth()) {
    sessionStorage.setItem('ppr_admin_last_activity', now.toString());
    if (authWrapper) authWrapper.style.display = 'none';
  } else {
    if (authWrapper) authWrapper.style.display = 'flex';
  }

  // Activity tracker to reset 30-minute timer while in dashboard
  document.addEventListener('mousemove', () => {
    if (window.pprDB.checkAuth()) {
      sessionStorage.setItem('ppr_admin_last_activity', Date.now().toString());
    }
  }, { passive: true });

  let failedAttempts = parseInt(sessionStorage.getItem('ppr_failed_auth_attempts') || '0', 10);
  const lockUntil = parseInt(sessionStorage.getItem('ppr_auth_locked_until') || '0', 10);

  if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const currentTime = Date.now();
      const activeLock = parseInt(sessionStorage.getItem('ppr_auth_locked_until') || '0', 10);
      if (activeLock && currentTime < activeLock) {
        const remainingSec = Math.ceil((activeLock - currentTime) / 1000);
        if (errorMsg) {
          errorMsg.textContent = `Security lockout in effect. Please wait ${remainingSec} seconds before retrying.`;
          errorMsg.style.display = 'block';
        }
        return;
      }

      const pin = pinInput.value.trim();
      if (window.pprDB.login(pin)) {
        sessionStorage.removeItem('ppr_failed_auth_attempts');
        sessionStorage.removeItem('ppr_auth_locked_until');
        sessionStorage.setItem('ppr_admin_last_activity', Date.now().toString());
        if (authWrapper) authWrapper.style.display = 'none';
        if (errorMsg) errorMsg.style.display = 'none';
        pinInput.value = '';
        refreshAllAdminViews();
      } else {
        failedAttempts++;
        sessionStorage.setItem('ppr_failed_auth_attempts', failedAttempts.toString());
        pinInput.value = '';

        if (failedAttempts >= 5) {
          const lockTime = Date.now() + 5 * 60 * 1000; // 5 minute lock
          sessionStorage.setItem('ppr_auth_locked_until', lockTime.toString());
          if (errorMsg) {
            errorMsg.textContent = 'Too many failed login attempts. Dashboard locked for 5 minutes.';
            errorMsg.style.display = 'block';
          }
        } else {
          if (errorMsg) {
            errorMsg.textContent = `Invalid credentials. Access denied. (${5 - failedAttempts} attempts remaining before temporary lockout)`;
            errorMsg.style.display = 'block';
          }
        }
      }
    });
  }

  if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
      window.pprDB.logout();
      sessionStorage.removeItem('ppr_admin_last_activity');
      window.location.reload();
    });
  }
}

/* -------------------------------------------------------------------------
   2. TAB NAVIGATION
   ------------------------------------------------------------------------- */
function initAdminTabs() {
  const navItems = document.querySelectorAll('.admin-nav-item[data-tab]');
  const tabPanels = document.querySelectorAll('.tab-panel');

  navItems.forEach(item => {
    item.addEventListener('click', () => {
      const targetTab = item.getAttribute('data-tab');

      navItems.forEach(i => i.classList.remove('active'));
      tabPanels.forEach(p => p.classList.remove('active'));

      item.classList.add('active');
      const activePanel = document.getElementById(`tab-${targetTab}`);
      if (activePanel) activePanel.classList.add('active');

      // Update page title header
      const pageTitleEl = document.getElementById('adminHeaderTitle');
      if (pageTitleEl) {
        pageTitleEl.textContent = item.querySelector('span:first-of-type')?.textContent || 'Admin';
      }
    });
  });
}

function refreshAllAdminViews() {
  initDashboardMetrics();
  renderProductsTable();
  renderSpecialsTable();
  populateStoreInfoForm();
  renderInquiriesTable();
}

/* -------------------------------------------------------------------------
   3. DASHBOARD METRICS
   ------------------------------------------------------------------------- */
function initDashboardMetrics() {
  if (!window.pprDB) return;

  const products = window.pprDB.getProducts();
  const specials = window.pprDB.getActiveSpecials();
  const inquiries = window.pprDB.getInquiries();

  const totalProductsEl = document.getElementById('statTotalProducts');
  const inStockEl = document.getElementById('statInStock');
  const allocatedEl = document.getElementById('statAllocated');
  const activeSpecialsEl = document.getElementById('statActiveSpecials');
  const unreadInquiriesEl = document.getElementById('statUnreadInquiries');
  const navInquiryBadge = document.getElementById('navInquiryBadge');

  const inStockCount = products.filter(p => p.status === 'In Stock').length;
  const allocatedCount = products.filter(p => p.status === 'Limited Allocation').length;
  const newInquiries = inquiries.filter(i => i.status === 'New').length;

  if (totalProductsEl) totalProductsEl.textContent = products.length;
  if (inStockEl) inStockEl.textContent = inStockCount;
  if (allocatedEl) allocatedEl.textContent = allocatedCount;
  if (activeSpecialsEl) activeSpecialsEl.textContent = specials.length;
  if (unreadInquiriesEl) unreadInquiriesEl.textContent = newInquiries;
  if (navInquiryBadge) {
    navInquiryBadge.textContent = newInquiries;
    navInquiryBadge.style.display = newInquiries > 0 ? 'inline-block' : 'none';
  }
}

/* -------------------------------------------------------------------------
   4. PRODUCTS MANAGEMENT (CRUD)
   ------------------------------------------------------------------------- */
let currentEditProductId = null;

function initProductsManager() {
  const searchInput = document.getElementById('adminProductSearch');
  const catFilter = document.getElementById('adminProductCatFilter');
  const btnNewProduct = document.getElementById('btnNewProduct');
  const modal = document.getElementById('productFormModal');
  const form = document.getElementById('adminProductForm');
  const closeModalBtn = document.getElementById('closeProductModal');

  renderProductsTable();

  if (searchInput) {
    searchInput.addEventListener('input', () => {
      renderProductsTable(searchInput.value, catFilter?.value || 'all');
    });
  }

  if (catFilter) {
    catFilter.addEventListener('change', () => {
      renderProductsTable(searchInput?.value || '', catFilter.value);
    });
  }

  if (btnNewProduct && modal) {
    btnNewProduct.addEventListener('click', () => {
      currentEditProductId = null;
      document.getElementById('productModalTitle').textContent = 'Add New Product to Catalog';
      form.reset();
      document.getElementById('prodIdField').value = '';
      modal.classList.add('active');
    });
  }

  if (closeModalBtn && modal) {
    closeModalBtn.addEventListener('click', () => {
      modal.classList.remove('active');
    });
  }

  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      saveProductFromForm();
    });
  }
}

function renderProductsTable(query = '', categoryFilter = 'all') {
  const tbody = document.getElementById('adminProductsTbody');
  if (!tbody || !window.pprDB) return;

  let products = window.pprDB.getProducts();

  if (categoryFilter !== 'all') {
    products = products.filter(p => p.category === categoryFilter);
  }

  if (query.trim() !== '') {
    const q = query.toLowerCase();
    products = products.filter(p => 
      p.name.toLowerCase().includes(q) || 
      p.brand.toLowerCase().includes(q)
    );
  }

  if (products.length === 0) {
    tbody.innerHTML = `<tr><td colspan="7" style="text-align:center; padding:2rem; color:var(--admin-text-muted);">No products found matching query.</td></tr>`;
    return;
  }

  tbody.innerHTML = products.map(p => {
    const isAllocated = p.status === 'Limited Allocation';
    const statusBadge = isAllocated
      ? `<span class="badge-allocation" style="position:static; font-size:0.7rem;">Limited Allocation</span>`
      : `<span class="badge-instock" style="position:static; font-size:0.7rem;">${p.status || 'In Stock'}</span>`;

    return `
      <tr>
        <td>
          <img src="${p.image || 'assets/images/bourbon-bottle.jpg'}" alt="${p.name}" class="table-product-thumb">
        </td>
        <td>
          <strong style="color:#fff;">${p.name}</strong><br>
          <span style="font-size:0.78rem; color:var(--admin-text-muted);">${p.brand}</span>
        </td>
        <td><span class="product-category-tag" style="font-size:0.72rem;">${p.category}</span></td>
        <td>${p.size}</td>
        <td><strong style="color:var(--color-gold-light);">${p.price || 'Call for Price'}</strong></td>
        <td>
          <button onclick="quickToggleStatus('${p.id}')" title="Click to cycle status" style="cursor:pointer; background:none; border:none;">
            ${statusBadge}
          </button>
        </td>
        <td>
          <div style="display:flex; gap:0.4rem;">
            <button class="action-btn btn-edit" onclick="editProduct('${p.id}')">Edit</button>
            <button class="action-btn btn-delete" onclick="deleteProduct('${p.id}')">Delete</button>
          </div>
        </td>
      </tr>
    `;
  }).join('');
}

function quickToggleStatus(id) {
  const p = window.pprDB.getProductById(id);
  if (!p) return;

  if (p.status === 'In Stock') {
    p.status = 'Limited Allocation';
  } else if (p.status === 'Limited Allocation') {
    p.status = 'Out of Stock';
  } else {
    p.status = 'In Stock';
  }

  window.pprDB.saveProduct(p);
  renderProductsTable(
    document.getElementById('adminProductSearch')?.value || '',
    document.getElementById('adminProductCatFilter')?.value || 'all'
  );
  initDashboardMetrics();
}

function editProduct(id) {
  const p = window.pprDB.getProductById(id);
  if (!p) return;

  currentEditProductId = id;
  const modal = document.getElementById('productFormModal');
  document.getElementById('productModalTitle').textContent = `Edit Product: ${p.name}`;

  document.getElementById('prodIdField').value = p.id;
  document.getElementById('prodName').value = p.name || '';
  document.getElementById('prodBrand').value = p.brand || '';
  document.getElementById('prodCategory').value = p.category || 'Kentucky Bourbon';
  document.getElementById('prodSize').value = p.size || '750ml';
  document.getElementById('prodProof').value = p.proof || '';
  document.getElementById('prodPrice').value = p.price || '';
  document.getElementById('prodStatus').value = p.status || 'In Stock';
  document.getElementById('prodImage').value = p.image || '';
  document.getElementById('prodDescription').value = p.description || '';
  document.getElementById('prodTastingNotes').value = (p.tastingNotes || []).join(', ');

  modal.classList.add('active');
}

function saveProductFromForm() {
  const modal = document.getElementById('productFormModal');
  const id = document.getElementById('prodIdField').value;
  const name = document.getElementById('prodName').value.trim();
  const brand = document.getElementById('prodBrand').value.trim();
  const category = document.getElementById('prodCategory').value;
  const size = document.getElementById('prodSize').value.trim();
  const proof = document.getElementById('prodProof').value.trim();
  const price = document.getElementById('prodPrice').value.trim();
  const status = document.getElementById('prodStatus').value;
  const image = document.getElementById('prodImage').value.trim();
  const description = document.getElementById('prodDescription').value.trim();
  const tastingStr = document.getElementById('prodTastingNotes').value.trim();

  const tastingNotes = tastingStr ? tastingStr.split(',').map(s => s.trim()).filter(Boolean) : [];

  const productData = {
    id: id || ('prod-' + Date.now()),
    name,
    brand,
    category,
    size: size || '750ml',
    proof: proof || 'N/A',
    price: price || 'Inquire in Store',
    status,
    image: image || (category.includes('Wine') ? 'assets/images/wine-bottle.jpg' : (category.includes('Tequila') ? 'assets/images/tequila-bottle.jpg' : 'assets/images/bourbon-bottle.jpg')),
    description,
    tastingNotes,
    featured: true
  };

  window.pprDB.saveProduct(productData);
  modal.classList.remove('active');
  renderProductsTable();
  initDashboardMetrics();
}

function deleteProduct(id) {
  const p = window.pprDB.getProductById(id);
  if (!p) return;
  if (confirm(`Are you sure you want to remove "${p.name}" from the store catalog?`)) {
    window.pprDB.deleteProduct(id);
    renderProductsTable();
    initDashboardMetrics();
  }
}

/* -------------------------------------------------------------------------
   5. SPECIALS & PROMOTIONS MANAGEMENT (CRUD)
   ------------------------------------------------------------------------- */
let currentEditSpecialId = null;

function initSpecialsManager() {
  const btnNewSpecial = document.getElementById('btnNewSpecial');
  const modal = document.getElementById('specialFormModal');
  const form = document.getElementById('adminSpecialForm');
  const closeModalBtn = document.getElementById('closeSpecialModal');

  renderSpecialsTable();

  if (btnNewSpecial && modal) {
    btnNewSpecial.addEventListener('click', () => {
      currentEditSpecialId = null;
      document.getElementById('specialModalTitle').textContent = 'Create New Promotion / Deal';
      form.reset();
      document.getElementById('specialIdField').value = '';
      modal.classList.add('active');
    });
  }

  if (closeModalBtn && modal) {
    closeModalBtn.addEventListener('click', () => {
      modal.classList.remove('active');
    });
  }

  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      saveSpecialFromForm();
    });
  }
}

function renderSpecialsTable() {
  const tbody = document.getElementById('adminSpecialsTbody');
  if (!tbody || !window.pprDB) return;

  const specials = window.pprDB.getSpecials();

  if (specials.length === 0) {
    tbody.innerHTML = `<tr><td colspan="6" style="text-align:center; padding:2rem; color:var(--admin-text-muted);">No promotions created yet. Click "Add New Promotion" above.</td></tr>`;
    return;
  }

  tbody.innerHTML = specials.map(s => {
    return `
      <tr>
        <td>
          <span class="special-badge-pill" style="margin-bottom:0; font-size:0.68rem;">${s.badge || 'Deal'}</span><br>
          <strong style="color:#fff;">${s.title}</strong>
        </td>
        <td>${s.product || s.subtitle}</td>
        <td><strong style="color:var(--color-gold-light);">${s.dealText}</strong></td>
        <td>${s.startDate || '-'} to ${s.endDate || 'Ongoing'}</td>
        <td>
          <span style="font-weight:600; color:${s.active ? '#4ade80' : '#f87171'};">
            ${s.active ? '● Active' : '○ Paused'}
          </span>
        </td>
        <td>
          <div style="display:flex; gap:0.4rem;">
            <button class="action-btn btn-edit" onclick="editSpecial('${s.id}')">Edit</button>
            <button class="action-btn btn-delete" onclick="deleteSpecial('${s.id}')">Delete</button>
          </div>
        </td>
      </tr>
    `;
  }).join('');
}

function editSpecial(id) {
  const specials = window.pprDB.getSpecials();
  const s = specials.find(x => x.id === id);
  if (!s) return;

  currentEditSpecialId = id;
  const modal = document.getElementById('specialFormModal');
  document.getElementById('specialModalTitle').textContent = `Edit Deal: ${s.title}`;

  document.getElementById('specialIdField').value = s.id;
  document.getElementById('specialTitle').value = s.title || '';
  document.getElementById('specialSubtitle').value = s.subtitle || '';
  document.getElementById('specialProduct').value = s.product || '';
  document.getElementById('specialBadge').value = s.badge || 'Featured Deal';
  document.getElementById('specialDealText').value = s.dealText || '';
  document.getElementById('specialTerms').value = s.terms || '';
  document.getElementById('specialStartDate').value = s.startDate || '';
  document.getElementById('specialEndDate').value = s.endDate || '';
  document.getElementById('specialActive').checked = !!s.active;

  modal.classList.add('active');
}

function saveSpecialFromForm() {
  const modal = document.getElementById('specialFormModal');
  const id = document.getElementById('specialIdField').value;
  const title = document.getElementById('specialTitle').value.trim();
  const subtitle = document.getElementById('specialSubtitle').value.trim();
  const product = document.getElementById('specialProduct').value.trim();
  const badge = document.getElementById('specialBadge').value.trim();
  const dealText = document.getElementById('specialDealText').value.trim();
  const terms = document.getElementById('specialTerms').value.trim();
  const startDate = document.getElementById('specialStartDate').value;
  const endDate = document.getElementById('specialEndDate').value;
  const active = document.getElementById('specialActive').checked;

  const specialData = {
    id: id || ('spec-' + Date.now()),
    title,
    subtitle,
    product,
    badge,
    dealText,
    terms,
    startDate,
    endDate,
    active
  };

  window.pprDB.saveSpecial(specialData);
  modal.classList.remove('active');
  renderSpecialsTable();
  initDashboardMetrics();
}

function deleteSpecial(id) {
  if (confirm("Delete this promotional deal?")) {
    window.pprDB.deleteSpecial(id);
    renderSpecialsTable();
    initDashboardMetrics();
  }
}

/* -------------------------------------------------------------------------
   6. STORE HOURS & INFO MANAGER
   ------------------------------------------------------------------------- */
function initStoreInfoManager() {
  populateStoreInfoForm();

  const form = document.getElementById('adminStoreInfoForm');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      saveStoreInfoFromForm();
    });
  }
}

function populateStoreInfoForm() {
  if (!window.pprDB) return;
  const info = window.pprDB.getStoreInfo();

  const phoneInput = document.getElementById('storePhoneInput');
  const emailInput = document.getElementById('storeEmailInput');
  const addressInput = document.getElementById('storeAddressInput');
  const announceInput = document.getElementById('storeAnnounceInput');

  if (phoneInput) phoneInput.value = info.phone || '(502) 370-4392';
  if (emailInput) emailInput.value = info.email || 'pprliquor@gmail.com';
  if (addressInput) addressInput.value = info.fullAddress || '1601 Paris Pike, Georgetown, Kentucky 40324';
  if (announceInput) announceInput.value = info.announcement || '';

  // Populate days
  const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
  days.forEach(d => {
    const openEl = document.getElementById(`hours_${d}_open`);
    const closeEl = document.getElementById(`hours_${d}_close`);
    if (info.hours && info.hours[d]) {
      if (openEl) openEl.value = info.hours[d].open;
      if (closeEl) closeEl.value = info.hours[d].close;
    }
  });
}

function saveStoreInfoFromForm() {
  const current = window.pprDB.getStoreInfo();

  current.phone = document.getElementById('storePhoneInput')?.value.trim() || current.phone;
  current.email = document.getElementById('storeEmailInput')?.value.trim() || current.email;
  current.fullAddress = document.getElementById('storeAddressInput')?.value.trim() || current.fullAddress;
  current.announcement = document.getElementById('storeAnnounceInput')?.value.trim() || current.announcement;

  const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
  days.forEach(d => {
    const openVal = document.getElementById(`hours_${d}_open`)?.value.trim();
    const closeVal = document.getElementById(`hours_${d}_close`)?.value.trim();
    if (current.hours[d]) {
      current.hours[d].open = openVal || current.hours[d].open;
      current.hours[d].close = closeVal || current.hours[d].close;
    }
  });

  window.pprDB.saveStoreInfo(current);
  alert("Store information and hours saved successfully! All live web pages have been updated.");
}

/* -------------------------------------------------------------------------
   7. CUSTOMER INQUIRIES INBOX
   ------------------------------------------------------------------------- */
function initInquiriesManager() {
  renderInquiriesTable();
}

function renderInquiriesTable() {
  const tbody = document.getElementById('adminInquiriesTbody');
  if (!tbody || !window.pprDB) return;

  const inquiries = window.pprDB.getInquiries();

  if (inquiries.length === 0) {
    tbody.innerHTML = `<tr><td colspan="6" style="text-align:center; padding:2rem; color:var(--admin-text-muted);">No inquiries received yet.</td></tr>`;
    return;
  }

  tbody.innerHTML = inquiries.map(i => {
    const isNew = i.status === 'New';
    return `
      <tr>
        <td>
          <span style="font-size:0.75rem; color:var(--admin-text-muted);">${i.date}</span><br>
          <strong style="color:#fff;">${i.name}</strong>
        </td>
        <td>
          <a href="mailto:${i.email}" style="color:var(--color-gold-light); text-decoration:underline;">${i.email}</a><br>
          <span style="font-size:0.8rem; color:var(--admin-text-muted);">${i.phone || '-'}</span>
        </td>
        <td><strong style="color:#fff;">${i.subject}</strong></td>
        <td>
          <div style="max-width:280px; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; font-size:0.85rem;">
            ${i.message}
          </div>
        </td>
        <td>
          <span style="font-size:0.75rem; font-weight:700; padding:0.2rem 0.6rem; border-radius:9999px; ${isNew ? 'background:rgba(239,68,68,0.2); color:#fca5a5; border:1px solid rgba(239,68,68,0.4);' : 'background:rgba(34,197,94,0.2); color:#86efac; border:1px solid rgba(34,197,94,0.4);'}">
            ${i.status}
          </span>
        </td>
        <td>
          <div style="display:flex; gap:0.4rem;">
            <button class="action-btn btn-edit" onclick="viewInquiryModal('${i.id}')">View</button>
            <a href="mailto:${i.email}?subject=RE: ${encodeURIComponent(i.subject)} - PPR LIQUOR" class="action-btn btn-edit" style="background:rgba(34,197,94,0.15); color:#86efac; border-color:rgba(34,197,94,0.3);">Reply</a>
            <button class="action-btn btn-delete" onclick="deleteInquiry('${i.id}')">Delete</button>
          </div>
        </td>
      </tr>
    `;
  }).join('');
}

function viewInquiryModal(id) {
  const inquiries = window.pprDB.getInquiries();
  const inq = inquiries.find(x => x.id === id);
  if (!inq) return;

  // Mark as read/responded
  window.pprDB.updateInquiryStatus(id, "Responded");
  renderInquiriesTable();
  initDashboardMetrics();

  alert(`CUSTOMER INQUIRY DETAILS:\n\nDate: ${inq.date}\nFrom: ${inq.name}\nEmail: ${inq.email}\nPhone: ${inq.phone}\nTopic: ${inq.subject}\n\nMessage:\n${inq.message}`);
}

function deleteInquiry(id) {
  if (confirm("Delete this customer message?")) {
    window.pprDB.deleteInquiry(id);
    renderInquiriesTable();
    initDashboardMetrics();
  }
}

/* -------------------------------------------------------------------------
   8. SETTINGS, BACKUP EXPORT & RESTORE
   ------------------------------------------------------------------------- */
function initSettingsAndBackup() {
  const btnExport = document.getElementById('btnExportBackup');
  const btnReset = document.getElementById('btnResetDefaults');
  const pinForm = document.getElementById('changePinForm');
  const importFile = document.getElementById('importBackupFile');

  if (btnExport) {
    btnExport.addEventListener('click', () => {
      const dataStr = window.pprDB.exportAll();
      const blob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      const date = new Date().toISOString().split('T')[0];
      a.href = url;
      a.download = `ppr_liquor_database_backup_${date}.json`;
      a.click();
      URL.revokeObjectURL(url);
    });
  }

  if (importFile) {
    importFile.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = (event) => {
        const success = window.pprDB.importAll(event.target.result);
        if (success) {
          alert("Database backup restored successfully!");
          refreshAllAdminViews();
        } else {
          alert("Error restoring backup. Please ensure the file is valid JSON.");
        }
      };
      reader.readAsText(file);
    });
  }

  if (btnReset) {
    btnReset.addEventListener('click', () => {
      if (confirm("Reset all products, specials, and hours to factory demo defaults? This will erase any custom entries.")) {
        window.pprDB.resetAll();
        refreshAllAdminViews();
        alert("Reset to default Kentucky bourbon inventory complete!");
      }
    });
  }

  if (pinForm) {
    pinForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const currentPin = document.getElementById('currentPinInput').value.trim();
      const newPin = document.getElementById('newPinInput').value.trim();

      if (currentPin !== window.pprDB.getAdminPin()) {
        alert("Current PIN is incorrect.");
        return;
      }

      if (newPin.length < 4) {
        alert("New PIN must be at least 4 characters long.");
        return;
      }

      window.pprDB.setAdminPin(newPin);
      alert("Admin PIN updated successfully! Remember your new PIN: " + newPin);
      pinForm.reset();
    });
  }
}
