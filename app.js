/**
 * Hungry Hut Interactive Menu & Admin Controller
 * Supports .env credential authentication, dynamic two-page authentic menu rendering,
 * real-time price updates, discount tags, product removal, 60+ color theme customization,
 * live restaurant footer editing, and dedicated in-app admin confirmation dialogs.
 */

(function () {
  'use strict';

  // Application State
  const state = {
    items: [],
    isAdmin: false,
    adminCredentials: {
      email: "admin@hungryhut.com",
      password: "@admin(hungryhut)"
    },
    editingId: null,
    selectedImagePreset: "images/kaju-biryani.jpg",
    currentTheme: null,
    tempTheme: null
  };

  const IMAGE_PRESETS = [
    { label: "Mutton Biryani", path: "images/mutton-biryani.jpg" },
    { label: "Kaju Biryani", path: "images/kaju-biryani.jpg" },
    { label: "Chicken Lollipop", path: "images/chicken-lollipop.jpg" },
    { label: "Paneer 65", path: "images/paneer-65.jpg" },
    { label: "Paneer Butter Masala", path: "images/paneer-butter-masala.jpg" },
    { label: "Chicken Fried Rice", path: "images/fried-rice.jpg" },
    { label: "Dragon Chicken", path: "images/dragon-chicken.jpg" },
    { label: "Mushroom Chilli", path: "images/mushroom-chilli.jpg" },
    { label: "Egg Chilli", path: "images/egg-chilli.jpg" }
  ];

  // 60 Curated Colors for Header & Theme Accent (Replaces Red)
  const SIXTY_COLORS = [
    // Rich Reds & Maroons (1-10)
    { name: "Hungry Red (Default)", hex: "#800000" },
    { name: "Royal Maroon", hex: "#58111A" },
    { name: "Deep Burgundy", hex: "#6B0F1A" },
    { name: "Crimson Blaze", hex: "#9B111E" },
    { name: "Scarlet Red", hex: "#A61C1C" },
    { name: "Wine Red", hex: "#722F37" },
    { name: "Persian Plum", hex: "#701C1C" },
    { name: "Garnet Ruby", hex: "#8B1E41" },
    { name: "Brick Rust", hex: "#9C3D28" },
    { name: "Terracotta", hex: "#B84A39" },

    // Saffron, Ambers & Warm Oranges (11-20)
    { name: "Paprika Red", hex: "#BA2D0B" },
    { name: "Burnt Orange", hex: "#C0392B" },
    { name: "Tandoori Orange", hex: "#C84B16" },
    { name: "Royal Saffron", hex: "#D35400" },
    { name: "Tikka Ochre", hex: "#C86400" },
    { name: "Golden Amber", hex: "#D48806" },
    { name: "Curry Gold", hex: "#B78103" },
    { name: "Warm Copper", hex: "#B85D19" },
    { name: "Roasted Cinnamon", hex: "#8C3B18" },
    { name: "Deep Mahogany", hex: "#4E2117" },

    // Royal Greens, Emeralds & Olives (21-30)
    { name: "Emerald Royale", hex: "#0B6623" },
    { name: "Forest Green", hex: "#1E4620" },
    { name: "Dark Jade", hex: "#004B49" },
    { name: "Mint Basil", hex: "#165B33" },
    { name: "Pine Tree", hex: "#1A472A" },
    { name: "Olive Orchard", hex: "#4B5320" },
    { name: "Hunter Green", hex: "#133827" },
    { name: "Persian Teal", hex: "#006B5B" },
    { name: "Velvet Teal", hex: "#005C53" },
    { name: "Malachite", hex: "#126E53" },

    // Regal Blues, Navies & Indigos (31-40)
    { name: "Royal Navy", hex: "#002147" },
    { name: "Midnight Blue", hex: "#191970" },
    { name: "Deep Ocean", hex: "#0A3161" },
    { name: "Classic Navy", hex: "#003366" },
    { name: "Sapphire King", hex: "#0F52BA" },
    { name: "Mediterranean", hex: "#005A9C" },
    { name: "Steel Cobalt", hex: "#2B547E" },
    { name: "Persian Blue", hex: "#1C39BB" },
    { name: "Prussian Indigo", hex: "#003153" },
    { name: "Twilight Blue", hex: "#1E2952" },

    // Royal Purples, Violets & Magentas (41-50)
    { name: "Imperial Purple", hex: "#4E085C" },
    { name: "Deep Plum", hex: "#4B0082" },
    { name: "Royal Aubergine", hex: "#3D0C3A" },
    { name: "Mulberry Silk", hex: "#5C1D48" },
    { name: "Dark Boysenberry", hex: "#47193B" },
    { name: "Grape Wine", hex: "#54123F" },
    { name: "Velvet Violet", hex: "#3F1651" },
    { name: "Blackcurrant", hex: "#38122B" },
    { name: "Byzantine", hex: "#7D1252" },
    { name: "Rich Orchid", hex: "#682860" },

    // Earth Tones, Choco & Dark Sleek (51-60)
    { name: "Espresso Brown", hex: "#2B1700" },
    { name: "Dark Chocolate", hex: "#3D2314" },
    { name: "Roasted Coffee", hex: "#4A2C1B" },
    { name: "Warm Chestnut", hex: "#562B17" },
    { name: "Burnt Sienna", hex: "#592720" },
    { name: "Slate Charcoal", hex: "#23272A" },
    { name: "Dark Graphite", hex: "#1F2421" },
    { name: "Obsidian Night", hex: "#1A1A1A" },
    { name: "Gunmetal", hex: "#2C3539" },
    { name: "Pure Onyx", hex: "#111111" }
  ];

  // Curated Background Colors (Replaces White / Cream)
  const BG_COLORS = [
    { name: "Cream (Default)", hex: "#FFF8F0" },
    { name: "Butter Parchment", hex: "#FAF3E0" },
    { name: "Antique Ivory", hex: "#FFFFF0" },
    { name: "Warm Linen", hex: "#F8F4EC" },
    { name: "Warm Rice Tint", hex: "#FFFDF5" },
    { name: "Almond Milk", hex: "#FAF6F0" },
    { name: "Desert Sand", hex: "#F5ECE1" },
    { name: "Peach Silk", hex: "#FFF0E5" },
    { name: "Blush Tint", hex: "#FFF0F0" },
    { name: "Mint Frost", hex: "#F0FFF4" },
    { name: "Sage Mist", hex: "#F4F8F3" },
    { name: "Sky Mist", hex: "#F0F7FF" },
    { name: "Lavender Tint", hex: "#F7F3FF" },
    { name: "Pure White", hex: "#FFFFFF" },
    { name: "Soft Ash", hex: "#F5F5F5" },
    { name: "Night Mode (Dark)", hex: "#1A1A1A" }
  ];

  // DOM Elements Cache
  const elements = {
    headerBrand: document.getElementById('headerBrand'),
    adminToolbar: document.getElementById('adminToolbar'),
    adminLogoutBtn: document.getElementById('adminLogoutBtn'),
    adminAddDishBtn: document.getElementById('adminAddDishBtn'),
    adminManageBtn: document.getElementById('adminManageBtn'),
    adminDiscountBtn: document.getElementById('adminDiscountBtn'),
    adminThemeBtn: document.getElementById('adminThemeBtn'),
    adminFooterBtn: document.getElementById('adminFooterBtn'),
    adminResetBtn: document.getElementById('adminResetBtn'),

    page1Container: document.getElementById('page1Container'),
    page2Container: document.getElementById('page2Container'),

    // Login Modal
    loginModal: document.getElementById('loginModal'),
    loginForm: document.getElementById('loginForm'),
    loginEmailInput: document.getElementById('loginEmailInput'),
    loginPasswordInput: document.getElementById('loginPasswordInput'),
    togglePasswordBtn: document.getElementById('togglePasswordBtn'),
    loginErrorMsg: document.getElementById('loginErrorMsg'),
    closeLoginModalBtn: document.getElementById('closeLoginModalBtn'),

    // Add/Edit Dish Modal
    dishModal: document.getElementById('dishModal'),
    dishModalTitle: document.getElementById('dishModalTitle'),
    dishForm: document.getElementById('dishForm'),
    dishIdInput: document.getElementById('dishIdInput'),
    dishNameInput: document.getElementById('dishNameInput'),
    dishTeluguInput: document.getElementById('dishTeluguInput'),
    dishCategorySelect: document.getElementById('dishCategorySelect'),
    dishNewCategoryInput: document.getElementById('dishNewCategoryInput'),
    dishPriceInput: document.getElementById('dishPriceInput'),
    dishDiscountInput: document.getElementById('dishDiscountInput'),
    dishTypeSelect: document.getElementById('dishTypeSelect'),
    dishPageSelect: document.getElementById('dishPageSelect'),
    imagePresetGrid: document.getElementById('imagePresetGrid'),
    closeDishModalBtn: document.getElementById('closeDishModalBtn'),
    cancelDishModalBtn: document.getElementById('cancelDishModalBtn'),

    // Bulk Discount Modal
    discountModal: document.getElementById('discountModal'),
    discountForm: document.getElementById('discountForm'),
    discountPercentInput: document.getElementById('discountPercentInput'),
    discountScopeSelect: document.getElementById('discountScopeSelect'),
    closeDiscountModalBtn: document.getElementById('closeDiscountModalBtn'),
    cancelDiscountModalBtn: document.getElementById('cancelDiscountModalBtn'),

    // Color Theme Modal
    themeModal: document.getElementById('themeModal'),
    themeColorGrid: document.getElementById('themeColorGrid'),
    themeBgGrid: document.getElementById('themeBgGrid'),
    customHeaderPicker: document.getElementById('customHeaderPicker'),
    customBgPicker: document.getElementById('customBgPicker'),
    themePreviewBox: document.getElementById('themePreviewBox'),
    prevHeader: document.getElementById('prevHeader'),
    prevBody: document.getElementById('prevBody'),
    prevHeading: document.getElementById('prevHeading'),
    applyThemeBtn: document.getElementById('applyThemeBtn'),
    resetThemeBtn: document.getElementById('resetThemeBtn'),
    closeThemeModalBtn: document.getElementById('closeThemeModalBtn'),
    cancelThemeModalBtn: document.getElementById('cancelThemeModalBtn'),

    // Footer Edit Modal
    footerModal: document.getElementById('footerModal'),
    footerForm: document.getElementById('footerForm'),
    footerTitleInput: document.getElementById('footerTitleInput'),
    footerTaglineInput: document.getElementById('footerTaglineInput'),
    footerPhoneInput: document.getElementById('footerPhoneInput'),
    footerTimingsInput: document.getElementById('footerTimingsInput'),
    footerAddressInput: document.getElementById('footerAddressInput'),
    footerServicesInput: document.getElementById('footerServicesInput'),
    closeFooterModalBtn: document.getElementById('closeFooterModalBtn'),
    cancelFooterModalBtn: document.getElementById('cancelFooterModalBtn'),

    // Manage / Remove Products Modal
    manageModal: document.getElementById('manageModal'),
    manageSearchInput: document.getElementById('manageSearchInput'),
    manageProductsList: document.getElementById('manageProductsList'),
    closeManageModalBtn: document.getElementById('closeManageModalBtn'),
    closeManageModalBottomBtn: document.getElementById('closeManageModalBottomBtn'),

    // Confirmation Modal
    confirmModal: document.getElementById('confirmModal'),
    confirmTitle: document.getElementById('confirmTitle'),
    confirmMessage: document.getElementById('confirmMessage'),
    confirmDetailsBox: document.getElementById('confirmDetailsBox'),
    confirmIcon: document.getElementById('confirmIcon'),
    acceptConfirmBtn: document.getElementById('acceptConfirmBtn'),
    cancelConfirmBtn: document.getElementById('cancelConfirmBtn'),

    // Live Footer Display Elements
    footerDisplayTitle: document.getElementById('footerDisplayTitle'),
    footerDisplayTagline: document.getElementById('footerDisplayTagline'),
    footerDisplayServices: document.getElementById('footerDisplayServices'),
    footerDisplayTimings: document.getElementById('footerDisplayTimings'),
    footerDisplayAddress: document.getElementById('footerDisplayAddress'),
    footerDisplayPhone: document.getElementById('footerDisplayPhone')
  };

  /**
   * Load Credentials from .env
   */
  async function loadEnvCredentials() {
    try {
      const response = await fetch('.env');
      if (response.ok) {
        const text = await response.text();
        const lines = text.split('\n');
        lines.forEach(line => {
          const trimmed = line.trim();
          if (trimmed && !trimmed.startsWith('#')) {
            const eqIndex = trimmed.indexOf('=');
            if (eqIndex !== -1) {
              const key = trimmed.slice(0, eqIndex).trim();
              const val = trimmed.slice(eqIndex + 1).trim();
              if (key === 'ADMIN_EMAIL') state.adminCredentials.email = val;
              if (key === 'ADMIN_PASSWORD') state.adminCredentials.password = val;
            }
          }
        });
      }
    } catch (e) {
      console.warn("Could not read .env file directly, using default admin credentials.", e);
    }
  }

  /**
   * In-App Luxury Admin Confirmation Dialog
   * Ensures reliable confirmation across all desktop and automated environments.
   */
  function showAdminConfirm({ title, message, details, icon = '👑', confirmText = 'Confirm & Update', confirmColor = '#16a34a', onConfirm, onCancel }) {
    if (!elements.confirmModal) {
      // Fallback to native confirm if element not found
      if (confirm(`${title || 'Admin Confirmation'}\n\n${message || ''}`)) {
        if (typeof onConfirm === 'function') onConfirm();
      } else {
        if (typeof onCancel === 'function') onCancel();
      }
      return;
    }

    elements.confirmTitle.textContent = title || 'Admin Confirmation';
    elements.confirmMessage.innerHTML = message || 'Are you sure you want to proceed?';
    elements.confirmIcon.textContent = icon;
    elements.acceptConfirmBtn.textContent = confirmText;
    elements.acceptConfirmBtn.style.background = confirmColor;

    if (details) {
      elements.confirmDetailsBox.innerHTML = details;
      elements.confirmDetailsBox.style.display = 'block';
    } else {
      elements.confirmDetailsBox.style.display = 'none';
    }

    const cleanup = () => {
      elements.confirmModal.classList.remove('active');
      elements.acceptConfirmBtn.onclick = null;
      elements.cancelConfirmBtn.onclick = null;
    };

    elements.acceptConfirmBtn.onclick = () => {
      cleanup();
      if (typeof onConfirm === 'function') onConfirm();
    };

    elements.cancelConfirmBtn.onclick = () => {
      cleanup();
      if (typeof onCancel === 'function') onCancel();
    };

    elements.confirmModal.classList.add('active');
  }

  /**
   * Initialize Application
   */
  async function init() {
    await loadEnvCredentials();
    state.items = MenuService.getItems();
    state.isAdmin = MenuService.isAdminLoggedIn();

    // 1. Apply stored color theme
    state.currentTheme = MenuService.getThemeData();
    state.tempTheme = { ...state.currentTheme };
    applyTheme(state.currentTheme);

    // 2. Apply stored footer details
    const footerData = MenuService.getFooterData();
    renderFooter(footerData);

    // 3. Setup UI components
    setupImagePresets();
    setupCategoryDropdown();
    setupThemePickers();
    updateAdminUI();
    bindEvents();
    renderMenu();
  }

  // ==========================================================================
  // COLOR THEME FUNCTIONS (60 COLORS + BACKGROUND OPTIONS)
  // ==========================================================================

  function lightenColor(hex, percent) {
    try {
      const num = parseInt(hex.replace('#', ''), 16);
      const amt = Math.round(2.55 * percent);
      const R = Math.min(255, Math.max(0, (num >> 16) + amt));
      const G = Math.min(255, Math.max(0, ((num >> 8) & 0x00FF) + amt));
      const B = Math.min(255, Math.max(0, (num & 0x0000FF) + amt));
      return '#' + (0x1000000 + R * 0x10000 + G * 0x100 + B).toString(16).slice(1);
    } catch (e) {
      return hex;
    }
  }

  function isColorDark(hex) {
    if (!hex) return false;
    try {
      const clean = hex.replace('#', '');
      const r = parseInt(clean.substring(0, 2), 16) || 0;
      const g = parseInt(clean.substring(2, 4), 16) || 0;
      const b = parseInt(clean.substring(4, 6), 16) || 0;
      const luminance = 0.299 * r + 0.587 * g + 0.114 * b;
      return luminance < 140;
    } catch (e) {
      return false;
    }
  }

  function applyTheme(theme) {
    if (!theme) return;
    const root = document.documentElement;
    root.style.setProperty('--theme-header-bg', theme.headerColor || '#800000');
    root.style.setProperty('--theme-header-grad', theme.headerGrad || lightenColor(theme.headerColor || '#800000', 25));
    root.style.setProperty('--theme-header-border', theme.headerBorder || 'gold');
    root.style.setProperty('--theme-body-bg', theme.bgColor || '#fff8f0');
    root.style.setProperty('--theme-card-bg', theme.cardBg || '#fdfcf9');
    root.style.setProperty('--theme-text-color', theme.textColor || '#222222');
    root.style.setProperty('--theme-accent-color', theme.accentColor || theme.headerColor || '#8B0000');
  }

  function setupThemePickers() {
    if (!elements.themeColorGrid || !elements.themeBgGrid) return;

    // Render 60 Header Colors
    elements.themeColorGrid.innerHTML = SIXTY_COLORS.map(c => `
      <div 
        class="color-swatch-item ${state.currentTheme.headerColor.toLowerCase() === c.hex.toLowerCase() ? 'active' : ''}" 
        data-hex="${c.hex}" 
        title="${c.name} (${c.hex})"
        style="background: ${c.hex};"
      ></div>
    `).join('');

    // Render Background Options
    elements.themeBgGrid.innerHTML = BG_COLORS.map(b => `
      <div 
        class="bg-swatch-item ${state.currentTheme.bgColor.toLowerCase() === b.hex.toLowerCase() ? 'active' : ''}" 
        data-hex="${b.hex}" 
        title="${b.name}"
        style="background: ${b.hex}; color: ${isColorDark(b.hex) ? '#fff' : '#222'};"
      >
        <span class="bg-swatch-name">${b.name}</span>
      </div>
    `).join('');

    // Click handler for 60 Header colors
    elements.themeColorGrid.addEventListener('click', (e) => {
      const swatch = e.target.closest('.color-swatch-item');
      if (swatch) {
        elements.themeColorGrid.querySelectorAll('.color-swatch-item').forEach(el => el.classList.remove('active'));
        swatch.classList.add('active');
        const hex = swatch.dataset.hex;
        elements.customHeaderPicker.value = hex;
        updateTempHeaderColor(hex);
      }
    });

    // Custom Header Color Picker change
    elements.customHeaderPicker.addEventListener('input', (e) => {
      const hex = e.target.value;
      elements.themeColorGrid.querySelectorAll('.color-swatch-item').forEach(el => {
        el.classList.toggle('active', el.dataset.hex.toLowerCase() === hex.toLowerCase());
      });
      updateTempHeaderColor(hex);
    });

    // Click handler for Background options
    elements.themeBgGrid.addEventListener('click', (e) => {
      const swatch = e.target.closest('.bg-swatch-item');
      if (swatch) {
        elements.themeBgGrid.querySelectorAll('.bg-swatch-item').forEach(el => el.classList.remove('active'));
        swatch.classList.add('active');
        const hex = swatch.dataset.hex;
        elements.customBgPicker.value = hex;
        updateTempBgColor(hex);
      }
    });

    // Custom Background Color Picker change
    elements.customBgPicker.addEventListener('input', (e) => {
      const hex = e.target.value;
      elements.themeBgGrid.querySelectorAll('.bg-swatch-item').forEach(el => {
        el.classList.toggle('active', el.dataset.hex.toLowerCase() === hex.toLowerCase());
      });
      updateTempBgColor(hex);
    });
  }

  function updateTempHeaderColor(hex) {
    state.tempTheme.headerColor = hex;
    state.tempTheme.headerGrad = lightenColor(hex, 25);
    state.tempTheme.accentColor = hex;
    updatePreviewBox();
  }

  function updateTempBgColor(hex) {
    state.tempTheme.bgColor = hex;
    if (isColorDark(hex)) {
      state.tempTheme.cardBg = '#222222';
      state.tempTheme.textColor = '#F0F0F0';
    } else {
      state.tempTheme.cardBg = '#FFFFFF';
      state.tempTheme.textColor = '#222222';
    }
    updatePreviewBox();
  }

  function updatePreviewBox() {
    if (!elements.prevHeader || !elements.prevBody) return;
    elements.prevHeader.style.background = `linear-gradient(135deg, ${state.tempTheme.headerColor}, ${state.tempTheme.headerGrad})`;
    elements.prevBody.style.background = state.tempTheme.bgColor;
    elements.prevBody.style.color = state.tempTheme.textColor;

    const card = elements.prevBody.querySelector('div');
    if (card) {
      card.style.background = state.tempTheme.cardBg;
      card.style.color = state.tempTheme.textColor;
    }
    if (elements.prevHeading) {
      elements.prevHeading.style.color = state.tempTheme.accentColor;
    }
  }

  function openThemeModal() {
    state.tempTheme = { ...state.currentTheme };
    elements.customHeaderPicker.value = state.tempTheme.headerColor;
    elements.customBgPicker.value = state.tempTheme.bgColor;

    if (elements.themeColorGrid) {
      elements.themeColorGrid.querySelectorAll('.color-swatch-item').forEach(el => {
        el.classList.toggle('active', el.dataset.hex.toLowerCase() === state.tempTheme.headerColor.toLowerCase());
      });
    }

    if (elements.themeBgGrid) {
      elements.themeBgGrid.querySelectorAll('.bg-swatch-item').forEach(el => {
        el.classList.toggle('active', el.dataset.hex.toLowerCase() === state.tempTheme.bgColor.toLowerCase());
      });
    }

    updatePreviewBox();
    elements.themeModal.classList.add('active');
  }

  function closeThemeModal() {
    elements.themeModal.classList.remove('active');
  }

  function handleApplyTheme() {
    showAdminConfirm({
      icon: '🎨',
      title: 'Apply Color Theme?',
      message: 'Confirm applying this new color theme to the live restaurant menu? All header, border, background, and accent tones will update immediately.',
      details: `
        <div><strong>Primary Theme Color:</strong> <span style="display:inline-block;width:12px;height:12px;background:${state.tempTheme.headerColor};border-radius:2px;vertical-align:middle;margin-right:4px;"></span> ${state.tempTheme.headerColor}</div>
        <div style="margin-top:4px;"><strong>Background Color:</strong> <span style="display:inline-block;width:12px;height:12px;background:${state.tempTheme.bgColor};border:1px solid #aaa;border-radius:2px;vertical-align:middle;margin-right:4px;"></span> ${state.tempTheme.bgColor}</div>
      `,
      confirmText: 'Confirm & Apply Theme',
      confirmColor: '#16a34a',
      onConfirm: () => {
        state.currentTheme = { ...state.tempTheme };
        MenuService.saveThemeData(state.currentTheme);
        applyTheme(state.currentTheme);
        closeThemeModal();
        showToast('🎨 Color theme successfully updated and applied!', '✅');
      }
    });
  }

  function handleResetTheme() {
    showAdminConfirm({
      icon: '🔄',
      title: 'Reset Theme to Default?',
      message: 'Reset color theme back to default Hungry Hut authentic red and warm cream?',
      confirmText: 'Reset to Default Red',
      confirmColor: '#dc2626',
      onConfirm: () => {
        state.currentTheme = MenuService.resetTheme();
        state.tempTheme = { ...state.currentTheme };
        applyTheme(state.currentTheme);
        closeThemeModal();
        showToast('Color theme reset to default Hungry Hut authentic red!', '🔄');
      }
    });
  }

  // ==========================================================================
  // FOOTER EDITING FUNCTIONS
  // ==========================================================================

  function renderFooter(footerData) {
    if (!footerData) return;
    if (elements.footerDisplayTitle) elements.footerDisplayTitle.textContent = footerData.restaurantTitle || "🍽️ Hungry Hut Restaurant & Cafe";
    if (elements.footerDisplayTagline) elements.footerDisplayTagline.textContent = footerData.tagline || "";
    if (elements.footerDisplayServices) elements.footerDisplayServices.textContent = footerData.services || "";
    if (elements.footerDisplayTimings) elements.footerDisplayTimings.textContent = footerData.timings || "";
    if (elements.footerDisplayAddress) elements.footerDisplayAddress.textContent = footerData.address || "";
    if (elements.footerDisplayPhone) elements.footerDisplayPhone.textContent = footerData.phoneNumbers || "";
  }

  function openFooterModal() {
    const footerData = MenuService.getFooterData();
    if (elements.footerTitleInput) elements.footerTitleInput.value = footerData.restaurantTitle || "";
    if (elements.footerTaglineInput) elements.footerTaglineInput.value = footerData.tagline || "";
    if (elements.footerPhoneInput) elements.footerPhoneInput.value = footerData.phoneNumbers || "";
    if (elements.footerTimingsInput) elements.footerTimingsInput.value = footerData.timings || "";
    if (elements.footerAddressInput) elements.footerAddressInput.value = footerData.address || "";
    if (elements.footerServicesInput) elements.footerServicesInput.value = footerData.services || "";
    elements.footerModal.classList.add('active');
  }

  function closeFooterModal() {
    elements.footerModal.classList.remove('active');
  }

  function handleSaveFooter(e) {
    e.preventDefault();

    const title = elements.footerTitleInput.value.trim();
    const tagline = elements.footerTaglineInput.value.trim();
    const phone = elements.footerPhoneInput.value.trim();
    const timings = elements.footerTimingsInput.value.trim();
    const address = elements.footerAddressInput.value.trim();
    const services = elements.footerServicesInput.value.trim();

    showAdminConfirm({
      icon: '📝',
      title: 'Update Restaurant Footer?',
      message: 'Confirm updating restaurant footer details on the live menu?',
      details: `
        <div><strong>Brand Title:</strong> ${escapeHtml(title)}</div>
        <div style="margin-top:4px;"><strong>Contact Numbers:</strong> ${escapeHtml(phone)}</div>
        <div style="margin-top:4px;"><strong>Address:</strong> ${escapeHtml(address)}</div>
      `,
      confirmText: 'Confirm & Save Footer',
      confirmColor: '#16a34a',
      onConfirm: () => {
        const updated = {
          restaurantTitle: title,
          tagline,
          phoneNumbers: phone,
          timings,
          address,
          services
        };

        MenuService.saveFooterData(updated);
        renderFooter(updated);
        closeFooterModal();
        showToast('📝 Restaurant footer details updated successfully!', '✅');
      }
    });
  }

  // ==========================================================================
  // PRODUCT MANAGEMENT & REMOVAL
  // ==========================================================================

  function openManageModal() {
    elements.manageSearchInput.value = '';
    renderManageProductsList('');
    elements.manageModal.classList.add('active');
    elements.manageSearchInput.focus();
  }

  function closeManageModal() {
    elements.manageModal.classList.remove('active');
  }

  function renderManageProductsList(query = '') {
    const q = query.toLowerCase().trim();
    const filtered = state.items.filter(item => {
      if (!q) return true;
      return item.name.toLowerCase().includes(q) ||
        (item.teluguName && item.teluguName.includes(q)) ||
        item.category.toLowerCase().includes(q);
    });

    if (filtered.length === 0) {
      elements.manageProductsList.innerHTML = `
        <div style="padding: 24px; text-align: center; color: #888;">
          No dishes found matching "${escapeHtml(query)}".
        </div>
      `;
      return;
    }

    elements.manageProductsList.innerHTML = filtered.map(item => `
      <div class="manage-item-row" data-id="${item.id}">
        <div style="display: flex; align-items: center; gap: 10px; flex: 1; min-width: 0;">
          <span class="type-dot ${item.type}"></span>
          <div style="min-width: 0;">
            <div style="font-weight: 600; color: #111; font-size: 14.5px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">
              ${escapeHtml(item.name)} ${item.teluguName ? `<span style="font-family: 'Noto Sans Telugu'; color: #666; font-size: 13px;">(${escapeHtml(item.teluguName)})</span>` : ''}
            </div>
            <div style="font-size: 12px; color: #777;">
              ${escapeHtml(item.category)} • ₹${item.price}/- ${item.discountPercent ? `<span style="color: #b91c1c; font-weight: 600;">(${item.discountPercent}% OFF)</span>` : ''}
            </div>
          </div>
        </div>

        <div style="display: flex; align-items: center; gap: 6px;">
          <button class="btn-row-action btn-manage-edit" data-id="${item.id}" title="Edit Dish Details">✏️</button>
          <button class="btn-remove-dish" data-id="${item.id}" title="Remove Product from Menu">
            🗑️ Remove
          </button>
        </div>
      </div>
    `).join('');

    // Bind remove button clicks in the manage modal
    elements.manageProductsList.querySelectorAll('.btn-remove-dish').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const id = btn.dataset.id;
        const item = state.items.find(i => i.id === id);
        if (!item) return;

        showAdminConfirm({
          icon: '🗑️',
          title: 'Remove Product from Menu?',
          message: `Are you sure you want to permanently remove <strong>"${escapeHtml(item.name)}"</strong> from the menu?`,
          details: `
            <div><strong>Category:</strong> ${escapeHtml(item.category)}</div>
            <div style="margin-top:4px;"><strong>Price:</strong> ₹${item.price}/-</div>
          `,
          confirmText: 'Yes, Remove Product',
          confirmColor: '#dc2626',
          onConfirm: () => {
            MenuService.deleteItem(id);
            state.items = MenuService.getItems();
            setupCategoryDropdown();
            renderMenu();
            renderManageProductsList(elements.manageSearchInput.value);
            showToast(`🗑️ Removed "${item.name}" from the menu.`, '✅');
          }
        });
      });
    });

    // Bind edit button clicks in the manage modal
    elements.manageProductsList.querySelectorAll('.btn-manage-edit').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const id = btn.dataset.id;
        closeManageModal();
        openDishModal(id);
      });
    });
  }

  // ==========================================================================
  // DISH IMAGES & CATEGORIES
  // ==========================================================================

  function setupImagePresets() {
    if (!elements.imagePresetGrid) return;
    elements.imagePresetGrid.innerHTML = IMAGE_PRESETS.map((p, idx) => `
      <div class="image-picker-thumb ${idx === 0 ? 'selected' : ''}" data-path="${p.path}" title="${p.label}">
        <img src="${p.path}" alt="${p.label}" loading="lazy">
      </div>
    `).join('');

    elements.imagePresetGrid.addEventListener('click', (e) => {
      const thumb = e.target.closest('.image-picker-thumb');
      if (thumb) {
        elements.imagePresetGrid.querySelectorAll('.image-picker-thumb').forEach(el => el.classList.remove('selected'));
        thumb.classList.add('selected');
        state.selectedImagePreset = thumb.dataset.path;
      }
    });
  }

  function setupCategoryDropdown() {
    if (!elements.dishCategorySelect) return;
    const categories = Array.from(new Set(state.items.map(i => i.category)));
    elements.dishCategorySelect.innerHTML = categories.map(cat => `
      <option value="${escapeHtml(cat)}">${escapeHtml(cat)}</option>
    `).join('') + `<option value="__NEW__">+ Add New Category...</option>`;
  }

  // ==========================================================================
  // EVENT BINDINGS
  // ==========================================================================

  function bindEvents() {
    // Header Logo Click -> Opens Admin Login or highlights Admin Bar
    elements.headerBrand.addEventListener('click', () => {
      if (!state.isAdmin) {
        openLoginModal();
      } else {
        showToast('👑 Admin Mode is currently active! Use the toolbar above to make changes.', 'ℹ️');
        elements.adminToolbar.scrollIntoView({ behavior: 'smooth' });
      }
    });

    // Admin Login Form
    elements.loginForm.addEventListener('submit', handleLoginSubmit);
    elements.closeLoginModalBtn.addEventListener('click', closeLoginModal);
    elements.loginModal.addEventListener('click', (e) => {
      if (e.target === elements.loginModal) closeLoginModal();
    });

    // Password Visibility Toggle (Eye Symbol)
    if (elements.togglePasswordBtn && elements.loginPasswordInput) {
      elements.togglePasswordBtn.addEventListener('click', () => {
        const isPassword = elements.loginPasswordInput.type === 'password';
        elements.loginPasswordInput.type = isPassword ? 'text' : 'password';
        
        const eyeOpen = elements.togglePasswordBtn.querySelector('.eye-open');
        const eyeClosed = elements.togglePasswordBtn.querySelector('.eye-closed');
        if (eyeOpen && eyeClosed) {
          eyeOpen.style.display = isPassword ? 'none' : 'block';
          eyeClosed.style.display = isPassword ? 'block' : 'none';
        }
        elements.togglePasswordBtn.title = isPassword ? 'Enclose/Hide Password' : 'Show Password';
      });
    }

    // Admin Logout
    elements.adminLogoutBtn.addEventListener('click', handleLogout);

    // Add Dish Button in Admin Bar
    elements.adminAddDishBtn.addEventListener('click', () => {
      openDishModal(null);
    });

    // Manage / Remove Dishes Button in Admin Bar
    elements.adminManageBtn.addEventListener('click', openManageModal);
    elements.closeManageModalBtn.addEventListener('click', closeManageModal);
    elements.closeManageModalBottomBtn.addEventListener('click', closeManageModal);
    elements.manageModal.addEventListener('click', (e) => {
      if (e.target === elements.manageModal) closeManageModal();
    });
    elements.manageSearchInput.addEventListener('input', (e) => {
      renderManageProductsList(e.target.value);
    });

    // Theme Customizer Button in Admin Bar
    elements.adminThemeBtn.addEventListener('click', openThemeModal);
    elements.closeThemeModalBtn.addEventListener('click', closeThemeModal);
    elements.cancelThemeModalBtn.addEventListener('click', closeThemeModal);
    elements.themeModal.addEventListener('click', (e) => {
      if (e.target === elements.themeModal) closeThemeModal();
    });
    elements.applyThemeBtn.addEventListener('click', handleApplyTheme);
    elements.resetThemeBtn.addEventListener('click', handleResetTheme);

    // Edit Footer Button in Admin Bar
    elements.adminFooterBtn.addEventListener('click', openFooterModal);
    elements.closeFooterModalBtn.addEventListener('click', closeFooterModal);
    elements.cancelFooterModalBtn.addEventListener('click', closeFooterModal);
    elements.footerModal.addEventListener('click', (e) => {
      if (e.target === elements.footerModal) closeFooterModal();
    });
    elements.footerForm.addEventListener('submit', handleSaveFooter);

    // Category select change in Dish Modal
    elements.dishCategorySelect.addEventListener('change', (e) => {
      if (e.target.value === '__NEW__') {
        elements.dishNewCategoryInput.style.display = 'block';
        elements.dishNewCategoryInput.required = true;
        elements.dishNewCategoryInput.focus();
      } else {
        elements.dishNewCategoryInput.style.display = 'none';
        elements.dishNewCategoryInput.required = false;
      }
    });

    // Add/Edit Dish Modal close
    elements.closeDishModalBtn.addEventListener('click', closeDishModal);
    elements.cancelDishModalBtn.addEventListener('click', closeDishModal);
    elements.dishModal.addEventListener('click', (e) => {
      if (e.target === elements.dishModal) closeDishModal();
    });

    // Save Dish Form Submit
    elements.dishForm.addEventListener('submit', handleSaveDish);

    // Bulk Discount Modal
    elements.adminDiscountBtn.addEventListener('click', openDiscountModal);
    elements.closeDiscountModalBtn.addEventListener('click', closeDiscountModal);
    elements.cancelDiscountModalBtn.addEventListener('click', closeDiscountModal);
    elements.discountModal.addEventListener('click', (e) => {
      if (e.target === elements.discountModal) closeDiscountModal();
    });
    elements.discountForm.addEventListener('submit', handleApplyBulkDiscount);

    // Reset Defaults
    elements.adminResetBtn.addEventListener('click', handleResetDefaults);
  }

  /**
   * Update Admin UI states
   */
  function updateAdminUI() {
    if (state.isAdmin) {
      document.body.classList.add('admin-active');
      elements.adminToolbar.classList.add('active');
    } else {
      document.body.classList.remove('admin-active');
      elements.adminToolbar.classList.remove('active');
    }
  }

  // ==========================================================================
  // AUTHENTIC MENU RENDERING
  // ==========================================================================

  function renderMenu() {
    // Page 1 categories
    const page1Categories = [
      {
        name: "Veg Biryani",
        images: [{ path: "images/kaju-biryani.jpg", round: false }]
      },
      {
        name: "Fried Rice Items",
        images: [
          { path: "images/fried-rice.jpg", round: true },
          { path: "images/egg-chilli.jpg", round: true },
          { path: "images/kaju-biryani.jpg", round: true }
        ]
      },
      {
        name: "Non - Veg Biryani",
        images: [
          { path: "images/mutton-biryani.jpg", round: false },
          { path: "images/chicken-lollipop.jpg", round: false }
        ]
      }
    ];

    // Page 2 categories
    const page2Categories = [
      {
        name: "Veg Starters",
        reverse: true,
        images: [
          { path: "images/paneer-65.jpg", round: false },
          { path: "images/mushroom-chilli.jpg", round: false }
        ]
      },
      {
        name: "Veg Curry Items",
        reverse: true,
        images: [
          { path: "images/paneer-butter-masala.jpg", round: true },
          { path: "images/paneer-butter-masala.jpg", round: true }
        ]
      },
      {
        name: "Non-Veg Starters",
        reverse: false,
        images: [
          { path: "images/dragon-chicken.jpg", round: false },
          { path: "images/egg-chilli.jpg", round: false }
        ]
      }
    ];

    // Check for any newly added custom categories
    const allCategories = Array.from(new Set(state.items.map(i => i.category)));
    const defaultCatNames = [
      "Veg Biryani", "Fried Rice Items", "Non - Veg Biryani",
      "Veg Starters", "Veg Curry Items", "Non-Veg Starters"
    ];
    const customCats = allCategories.filter(c => !defaultCatNames.includes(c));

    // Render Page 1
    let p1Html = page1Categories.map(cat => renderCategorySection(cat.name, cat.images, cat.reverse)).join('');
    customCats.forEach(c => {
      const sample = state.items.find(i => i.category === c);
      if (sample && sample.page === 1) {
        p1Html += renderCategorySection(c, [{ path: sample.image || "images/kaju-biryani.jpg", round: false }], false);
      }
    });
    elements.page1Container.innerHTML = p1Html;

    // Render Page 2
    let p2Html = page2Categories.map(cat => renderCategorySection(cat.name, cat.images, cat.reverse)).join('');
    customCats.forEach(c => {
      const sample = state.items.find(i => i.category === c);
      if (sample && sample.page === 2) {
        p2Html += renderCategorySection(c, [{ path: sample.image || "images/dragon-chicken.jpg", round: false }], true);
      }
    });
    elements.page2Container.innerHTML = p2Html;

    // Bind action listeners for quick edit, discount, and delete on dishes
    bindItemRowActions();
  }

  function renderCategorySection(categoryName, sideImages, isReverse = false) {
    const items = state.items.filter(i => i.category === categoryName);
    if (items.length === 0) return '';

    const imagesHtml = sideImages && sideImages.length > 0 ? `
      <div class="category-images-col">
        ${sideImages.map(img => `
          <div class="menu-side-image-card ${img.round ? 'round' : ''}">
            <img src="${img.path}" alt="${escapeHtml(categoryName)}" loading="lazy">
          </div>
        `).join('')}
      </div>
    ` : '';

    return `
      <div class="menu-category-block" data-category="${escapeHtml(categoryName)}">
        <h2 class="category-heading">${escapeHtml(categoryName)}</h2>
        <div class="category-brush-underline"></div>

        <div class="category-row ${isReverse ? 'reverse' : ''}">
          <div class="category-items-col">
            ${items.map(item => renderDishRow(item)).join('')}
          </div>
          ${imagesHtml}
        </div>
      </div>
    `;
  }

  function renderDishRow(item) {
    const discount = Number(item.discountPercent) || 0;
    let priceHtml = '';

    if (discount > 0) {
      const discountedPrice = Math.round(item.price * (1 - discount / 100));
      priceHtml = `
        <span class="price-colon">:</span>
        <span class="price-original-striked">${item.price}/-</span>
        <span class="price-discounted">${discountedPrice}/-</span>
        <span class="discount-tag">${discount}% OFF</span>
      `;
    } else {
      priceHtml = `
        <span class="price-colon">:</span>
        <span>${item.price}/-</span>
      `;
    }

    const teluguSpan = item.teluguName ? `
      <span class="item-hyphen">-</span>
      <span class="item-telugu">${escapeHtml(item.teluguName)}</span>
    ` : '';

    return `
      <div class="menu-item-row" data-id="${item.id}">
        <div class="item-name-part">
          <span class="type-dot ${item.type}" title="${item.type}"></span>
          <span class="item-english">${escapeHtml(item.name)}</span>
          ${teluguSpan}
        </div>

        <div class="item-price-part">
          ${priceHtml}

          <!-- Admin Quick Action Controls -->
          <div class="item-admin-actions">
            <button class="btn-row-action btn-item-price" data-id="${item.id}" title="Quick Change Price">
              ₹
            </button>
            <button class="btn-row-action btn-item-discount" data-id="${item.id}" title="Add/Change Discount">
              🏷️
            </button>
            <button class="btn-row-action btn-item-edit" data-id="${item.id}" title="Edit Dish Details">
              ✏️
            </button>
            <button class="btn-row-action btn-item-delete" data-id="${item.id}" title="Remove Product">
              🗑️
            </button>
          </div>
        </div>
      </div>
    `;
  }

  function bindItemRowActions() {
    // Quick Change Price
    document.querySelectorAll('.btn-item-price').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const id = btn.dataset.id;
        const item = state.items.find(i => i.id === id);
        if (!item) return;

        const newPrice = prompt(`Enter new price for "${item.name}" (Current: ₹${item.price}):`, item.price);
        if (newPrice !== null && !isNaN(Number(newPrice)) && Number(newPrice) > 0) {
          showAdminConfirm({
            icon: '💰',
            title: 'Confirm Price Update?',
            message: `Update price of <strong>${escapeHtml(item.name)}</strong> on the live menu?`,
            details: `<div><strong>Previous Price:</strong> ₹${item.price}/-</div><div style="margin-top:4px;"><strong>New Price:</strong> ₹${newPrice}/-</div>`,
            confirmText: 'Confirm Price',
            confirmColor: '#16a34a',
            onConfirm: () => {
              MenuService.changePrice(id, Number(newPrice));
              state.items = MenuService.getItems();
              renderMenu();
              showToast(`Price for "${item.name}" updated to ₹${newPrice}/-`, '✅');
            }
          });
        }
      });
    });

    // Quick Change Discount
    document.querySelectorAll('.btn-item-discount').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const id = btn.dataset.id;
        const item = state.items.find(i => i.id === id);
        if (!item) return;

        const discount = prompt(`Enter discount % for "${item.name}" (0 to 100, Current: ${item.discountPercent || 0}%):`, item.discountPercent || 0);
        if (discount !== null && !isNaN(Number(discount))) {
          showAdminConfirm({
            icon: '🏷️',
            title: 'Confirm Dish Discount?',
            message: `Apply ${discount}% discount to <strong>${escapeHtml(item.name)}</strong> on the live menu?`,
            confirmText: 'Apply Discount',
            confirmColor: '#16a34a',
            onConfirm: () => {
              MenuService.setDiscount(id, Number(discount));
              state.items = MenuService.getItems();
              renderMenu();
              showToast(`Discount for "${item.name}" set to ${discount}%!`, '🏷️');
            }
          });
        }
      });
    });

    // Edit Item
    document.querySelectorAll('.btn-item-edit').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const id = btn.dataset.id;
        openDishModal(id);
      });
    });

    // Delete Item directly from menu row
    document.querySelectorAll('.btn-item-delete').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const id = btn.dataset.id;
        const item = state.items.find(i => i.id === id);
        if (!item) return;

        showAdminConfirm({
          icon: '🗑️',
          title: 'Remove Product from Menu?',
          message: `Are you sure you want to permanently remove <strong>"${escapeHtml(item.name)}"</strong> from the menu?`,
          details: `
            <div><strong>Category:</strong> ${escapeHtml(item.category)}</div>
            <div style="margin-top:4px;"><strong>Price:</strong> ₹${item.price}/-</div>
          `,
          confirmText: 'Yes, Remove Product',
          confirmColor: '#dc2626',
          onConfirm: () => {
            MenuService.deleteItem(id);
            state.items = MenuService.getItems();
            setupCategoryDropdown();
            renderMenu();
            showToast(`🗑️ Removed "${item.name}" from the menu.`, '✅');
          }
        });
      });
    });
  }

  // ==========================================================================
  // ADMIN AUTHENTICATION
  // ==========================================================================

  function openLoginModal() {
    elements.loginEmailInput.value = state.adminCredentials.email || 'admin@hungryhut.com';
    elements.loginPasswordInput.value = '';
    elements.loginPasswordInput.type = 'password';
    if (elements.togglePasswordBtn) {
      const eyeOpen = elements.togglePasswordBtn.querySelector('.eye-open');
      const eyeClosed = elements.togglePasswordBtn.querySelector('.eye-closed');
      if (eyeOpen && eyeClosed) {
        eyeOpen.style.display = 'block';
        eyeClosed.style.display = 'none';
      }
      elements.togglePasswordBtn.title = 'Show Password';
    }
    elements.loginErrorMsg.style.display = 'none';
    elements.loginModal.classList.add('active');
    elements.loginPasswordInput.focus();
  }

  function closeLoginModal() {
    elements.loginModal.classList.remove('active');
  }

  function handleLoginSubmit(e) {
    e.preventDefault();
    const email = elements.loginEmailInput.value.trim();
    const password = elements.loginPasswordInput.value;

    if (email === state.adminCredentials.email && password === state.adminCredentials.password) {
      state.isAdmin = true;
      MenuService.setAdminLoggedIn(true);
      closeLoginModal();
      updateAdminUI();
      renderMenu();
      showToast('🎉 Admin login successful! Welcome back.', '👑');
    } else {
      elements.loginErrorMsg.textContent = 'Invalid email or password. Please verify credentials.';
      elements.loginErrorMsg.style.display = 'block';
    }
  }

  function handleLogout() {
    state.isAdmin = false;
    MenuService.setAdminLoggedIn(false);
    updateAdminUI();
    renderMenu();
    showToast('Logged out of Admin Portal.', '👋');
  }

  // ==========================================================================
  // DISH CRUD MODAL
  // ==========================================================================

  function openDishModal(dishId) {
    state.editingId = dishId;
    setupCategoryDropdown();

    if (dishId) {
      const item = state.items.find(i => i.id === dishId);
      if (!item) return;

      elements.dishModalTitle.innerHTML = '✏️ Edit Dish';
      elements.dishIdInput.value = item.id;
      elements.dishNameInput.value = item.name;
      elements.dishTeluguInput.value = item.teluguName || '';
      elements.dishPriceInput.value = item.price;
      elements.dishDiscountInput.value = item.discountPercent || 0;
      elements.dishTypeSelect.value = item.type || 'veg';
      elements.dishPageSelect.value = item.page || 1;

      if (elements.dishCategorySelect.querySelector(`option[value="${item.category}"]`)) {
        elements.dishCategorySelect.value = item.category;
        elements.dishNewCategoryInput.style.display = 'none';
      } else {
        elements.dishCategorySelect.value = '__NEW__';
        elements.dishNewCategoryInput.style.display = 'block';
        elements.dishNewCategoryInput.value = item.category;
      }

      state.selectedImagePreset = item.image || 'images/kaju-biryani.jpg';
      highlightPreset(state.selectedImagePreset);
    } else {
      elements.dishModalTitle.innerHTML = '✨ Add New Product / Dish';
      elements.dishForm.reset();
      elements.dishIdInput.value = '';
      elements.dishDiscountInput.value = 0;
      elements.dishNewCategoryInput.style.display = 'none';
      state.selectedImagePreset = 'images/mutton-biryani.jpg';
      highlightPreset(state.selectedImagePreset);
    }

    elements.dishModal.classList.add('active');
  }

  function highlightPreset(imgPath) {
    elements.imagePresetGrid.querySelectorAll('.image-picker-thumb').forEach(el => {
      el.classList.toggle('selected', el.dataset.path === imgPath);
    });
  }

  function closeDishModal() {
    elements.dishModal.classList.remove('active');
    state.editingId = null;
  }

  function handleSaveDish(e) {
    e.preventDefault();

    const name = elements.dishNameInput.value.trim();
    const teluguName = elements.dishTeluguInput.value.trim();
    const price = Number(elements.dishPriceInput.value);
    const discount = Number(elements.dishDiscountInput.value) || 0;
    const type = elements.dishTypeSelect.value;
    const page = Number(elements.dishPageSelect.value) || 1;

    let category = elements.dishCategorySelect.value;
    if (category === '__NEW__') {
      category = elements.dishNewCategoryInput.value.trim();
    }

    if (!name || isNaN(price) || !category) {
      alert('Please fill out all required fields.');
      return;
    }

    showAdminConfirm({
      icon: '✨',
      title: state.editingId ? 'Confirm Dish Update?' : 'Confirm Add New Dish?',
      message: `Confirm ${state.editingId ? 'updating' : 'adding'} <strong>"${escapeHtml(name)}"</strong> (₹${price}/-) to the live menu?`,
      details: `
        <div><strong>Category:</strong> ${escapeHtml(category)}</div>
        <div style="margin-top:4px;"><strong>Menu Page:</strong> Page ${page}</div>
      `,
      confirmText: 'Confirm & Save Dish',
      confirmColor: '#16a34a',
      onConfirm: () => {
        const payload = {
          name,
          teluguName,
          category,
          price,
          discountPercent: discount,
          type,
          image: state.selectedImagePreset,
          page
        };

        if (state.editingId) {
          MenuService.updateItem(state.editingId, payload);
          showToast(`Updated "${name}" successfully!`, '✅');
        } else {
          MenuService.addItem(payload);
          showToast(`Added new dish "${name}" to the menu!`, '🎉');
        }

        state.items = MenuService.getItems();
        setupCategoryDropdown();
        closeDishModal();
        renderMenu();
      }
    });
  }

  // ==========================================================================
  // BULK DISCOUNTS
  // ==========================================================================

  function openDiscountModal() {
    elements.discountForm.reset();
    elements.discountModal.classList.add('active');
  }

  function closeDiscountModal() {
    elements.discountModal.classList.remove('active');
  }

  function handleApplyBulkDiscount(e) {
    e.preventDefault();
    const discount = Number(elements.discountPercentInput.value);
    const scope = elements.discountScopeSelect.value;

    if (isNaN(discount) || discount < 0 || discount > 100) {
      alert('Please enter a valid discount percentage (0 to 100).');
      return;
    }

    showAdminConfirm({
      icon: '🏷️',
      title: 'Apply Bulk Discount?',
      message: `Confirm applying ${discount}% discount to <strong>${scope.toUpperCase()}</strong> items on the live menu?`,
      confirmText: 'Confirm & Apply Discount',
      confirmColor: '#16a34a',
      onConfirm: () => {
        state.items.forEach(item => {
          if (scope === 'all') {
            item.discountPercent = discount;
          } else if (scope === 'veg' && item.type === 'veg') {
            item.discountPercent = discount;
          } else if (scope === 'non-veg' && item.type === 'non-veg') {
            item.discountPercent = discount;
          } else if (scope === 'biryani' && item.category.toLowerCase().includes('biryani')) {
            item.discountPercent = discount;
          }
        });

        MenuService.saveItems(state.items);
        closeDiscountModal();
        renderMenu();
        showToast(`Applied ${discount}% discount to selected dishes!`, '🏷️');
      }
    });
  }

  // ==========================================================================
  // RESET DEFAULTS
  // ==========================================================================

  function handleResetDefaults() {
    showAdminConfirm({
      icon: '🔄',
      title: 'Reset Entire Menu to Defaults?',
      message: 'Are you sure you want to restore original Hungry Hut dishes? All price modifications, added dishes, and custom discounts will revert to default.',
      confirmText: 'Yes, Reset Menu',
      confirmColor: '#dc2626',
      onConfirm: () => {
        state.items = MenuService.resetDefaults();
        setupCategoryDropdown();
        renderMenu();
        showToast('Menu restored to original dishes!', '🔄');
      }
    });
  }

  // ==========================================================================
  // UTILITY NOTICES & HELPERS
  // ==========================================================================

  function showToast(message, icon = '✨') {
    const existing = document.querySelector('.toast-notice');
    if (existing) existing.remove();

    const toast = document.createElement('div');
    toast.className = 'toast-notice';
    toast.innerHTML = `<span>${icon}</span> <span>${escapeHtml(message)}</span>`;
    document.body.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(20px)';
      toast.style.transition = 'all 0.3s ease';
      setTimeout(() => toast.remove(), 300);
    }, 3500);
  }

  function escapeHtml(str) {
    if (!str) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  // Initialize on load
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
