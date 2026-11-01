/**
 * Hungry Hut Interactive Menu & Cloud Admin Controller
 * Connected to MongoDB Atlas with Socket.IO Real-Time Synchronization.
 * Supports Admin JWT authentication, Password & Email change, dynamic two-page authentic menu rendering,
 * real-time price updates, discount tags, product removal, 60+ color theme customization,
 * live restaurant footer editing, and dedicated in-app admin confirmation dialogs.
 */

(function () {
  'use strict';

  // Application State
  const state = {
    items: [],
    isAdmin: false,
    editingId: null,
    selectedImagePreset: "images/kaju-biryani.jpg",
    currentTheme: null,
    tempTheme: null,
    activeCategory: "all"
  };

  // Socket.IO Real-Time Instance
  let socket = null;

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
    adminLoggedInEmailDisplay: document.getElementById('adminLoggedInEmailDisplay'),
    adminLogoutBtn: document.getElementById('adminLogoutBtn'),
    adminAddDishBtn: document.getElementById('adminAddDishBtn'),
    adminManageBtn: document.getElementById('adminManageBtn'),
    adminDiscountBtn: document.getElementById('adminDiscountBtn'),
    adminThemeBtn: document.getElementById('adminThemeBtn'),
    adminFooterBtn: document.getElementById('adminFooterBtn'),
    adminResetBtn: document.getElementById('adminResetBtn'),
    adminAccountBtn: document.getElementById('adminAccountBtn'),

    liveSyncBadge: document.getElementById('liveSyncBadge'),
    liveSyncText: document.getElementById('liveSyncText'),
    categoryNavBar: document.getElementById('categoryNavBar'),

    page1Container: document.getElementById('page1Container'),
    page2Container: document.getElementById('page2Container'),

    // Footer & Secret Trigger
    footerDisplayTitle: document.getElementById('footerDisplayTitle'),
    footerBrandBox: document.getElementById('footerBrandBox'),

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
    prevHeader: document.getElementById('prevHeader'),
    prevBody: document.getElementById('prevBody'),
    prevHeading: document.getElementById('prevHeading'),
    closeThemeModalBtn: document.getElementById('closeThemeModalBtn'),
    cancelThemeModalBtn: document.getElementById('cancelThemeModalBtn'),
    applyThemeBtn: document.getElementById('applyThemeBtn'),
    resetThemeBtn: document.getElementById('resetThemeBtn'),

    // Footer Editor Modal
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

    // Admin Credentials / Account Settings Modal
    credentialsModal: document.getElementById('credentialsModal'),
    credentialsForm: document.getElementById('credentialsForm'),
    credCurrentPasswordInput: document.getElementById('credCurrentPasswordInput'),
    credEmailInput: document.getElementById('credEmailInput'),
    credNewPasswordInput: document.getElementById('credNewPasswordInput'),
    credConfirmPasswordInput: document.getElementById('credConfirmPasswordInput'),
    toggleCredCurrentPassBtn: document.getElementById('toggleCredCurrentPassBtn'),
    toggleCredNewPassBtn: document.getElementById('toggleCredNewPassBtn'),
    toggleCredConfirmPassBtn: document.getElementById('toggleCredConfirmPassBtn'),
    closeCredentialsModalBtn: document.getElementById('closeCredentialsModalBtn'),
    cancelCredentialsModalBtn: document.getElementById('cancelCredentialsModalBtn'),
    credsErrorMsg: document.getElementById('credsErrorMsg'),
    credsSuccessMsg: document.getElementById('credsSuccessMsg'),

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
    footerDisplayPhone: document.getElementById('footerDisplayPhone'),

    // Mobile Bottom Navigation Bar
    mobileBottomNav: document.getElementById('mobileBottomNav'),
    navCategoriesBtn: document.getElementById('navCategoriesBtn'),
    navAdminBtn: document.getElementById('navAdminBtn'),
    navAdminLabel: document.getElementById('navAdminLabel'),
    navAdminIcon: document.getElementById('navAdminIcon')
  };

  /**
   * In-App Luxury Admin Confirmation Dialog
   */
  function showAdminConfirm({ title, message, details, icon = '👑', confirmText = 'Confirm & Update', confirmColor = '#16a34a', onConfirm, onCancel }) {
    if (!elements.confirmModal) {
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
   * Update Live Multi-Device Cloud Sync Badge
   */
  function updateLiveSyncBadge(isConnected) {
    if (!elements.liveSyncBadge) return;
    if (isConnected) {
      elements.liveSyncBadge.classList.add('connected');
      elements.liveSyncBadge.classList.remove('disconnected');
      if (elements.liveSyncText) elements.liveSyncText.textContent = 'Live Cloud Sync Active';
    } else {
      elements.liveSyncBadge.classList.remove('connected');
      elements.liveSyncBadge.classList.add('disconnected');
      if (elements.liveSyncText) elements.liveSyncText.textContent = 'Reconnecting...';
    }
  }

  /**
   * Setup Real-Time Socket.IO Synchronization Across All Devices
   */
  function setupRealtimeSocket() {
    try {
      if (typeof io !== 'undefined') {
        socket = io();

        socket.on('connect', () => {
          updateLiveSyncBadge(true);
          refreshCloudData();
        });

        socket.on('disconnect', () => {
          updateLiveSyncBadge(false);
        });

        // Remote database broadcasts from other devices or admin
        socket.on('menu:item_added', (newItem) => {
          const exists = state.items.some(i => i.id === newItem.id);
          if (!exists) {
            state.items.push(newItem);
            MenuService.setCachedItems(state.items);
            setupCategoryDropdown();
            renderMenu();
            showToast(`✨ New dish added: "${newItem.name}"`, '☁️');
          }
        });

        socket.on('menu:item_updated', (updatedItem) => {
          const idx = state.items.findIndex(i => i.id === updatedItem.id);
          if (idx !== -1) {
            state.items[idx] = updatedItem;
            MenuService.setCachedItems(state.items);
            renderMenu();
            showToast(`🔄 Updated dish: "${updatedItem.name}"`, '☁️');
          }
        });

        socket.on('menu:item_deleted', ({ id, name }) => {
          state.items = state.items.filter(i => i.id !== id);
          MenuService.setCachedItems(state.items);
          renderMenu();
          if (elements.manageModal && elements.manageModal.classList.contains('active')) {
            renderManageProductsList(elements.manageSearchInput.value);
          }
          showToast(`🗑️ Dish removed: "${name || id}"`, '☁️');
        });

        socket.on('menu:batch_updated', (items) => {
          if (Array.isArray(items)) {
            state.items = items;
            MenuService.setCachedItems(items);
            setupCategoryDropdown();
            renderMenu();
            showToast('🔄 Live Menu synchronized with database', '☁️');
          }
        });

        socket.on('theme:updated', (theme) => {
          state.currentTheme = theme;
          state.tempTheme = { ...theme };
          MenuService.setCachedTheme(theme);
          applyTheme(theme);
          showToast('🎨 Menu theme updated across all devices', '☁️');
        });

        socket.on('footer:updated', (footer) => {
          MenuService.setCachedFooter(footer);
          renderFooter(footer);
          showToast('📝 Restaurant details updated across all devices', '☁️');
        });
      }
    } catch (e) {
      console.warn('Socket.IO initialization error:', e);
    }
  }

  /**
   * Refresh Cloud Data on Reconnect or Tab Focus
   */
  async function refreshCloudData() {
    try {
      const items = await MenuService.fetchMenu();
      if (Array.isArray(items) && items.length > 0) {
        state.items = items;
        renderMenu();
        setupCategoryDropdown();
        updateLiveSyncBadge(true);
      }

      const theme = await MenuService.fetchTheme();
      if (theme) {
        state.currentTheme = theme;
        applyTheme(theme);
      }

      const footer = await MenuService.fetchFooter();
      if (footer) {
        renderFooter(footer);
      }
    } catch (e) {
      console.warn('Could not refresh cloud data:', e);
      updateLiveSyncBadge(false);
    }
  }

  /**
   * Initialize Application
   */
  async function init() {
    // 1. Setup Socket.IO real-time sync
    setupRealtimeSocket();

    // 2. Load menu items from cache and fetch latest from MongoDB
    state.items = MenuService.getItems();
    state.isAdmin = MenuService.isAdminLoggedIn();

    // 3. Apply color theme
    state.currentTheme = MenuService.getThemeData();
    state.tempTheme = { ...state.currentTheme };
    applyTheme(state.currentTheme);

    // 4. Apply footer details
    const footerData = MenuService.getFooterData();
    renderFooter(footerData);

    // 5. Setup UI components
    setupImagePresets();
    setupCategoryDropdown();
    setupThemePickers();
    setupCategoryNavBar();
    updateAdminUI();
    bindEvents();
    renderMenu();

    // 6. Asynchronously fetch fresh data from MongoDB
    refreshCloudData();

    // 7. Verify admin session with server
    if (state.isAdmin) {
      try {
        const prof = await MenuService.getAdminProfile();
        if (prof && prof.email && elements.adminLoggedInEmailDisplay) {
          elements.adminLoggedInEmailDisplay.textContent = prof.email;
        }
      } catch (e) {
        console.warn('Admin token check:', e);
      }
    }

    // 8. Auto-reconnect / tab focus synchronization
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'visible') {
        refreshCloudData();
      }
    });
    window.addEventListener('focus', () => {
      refreshCloudData();
    });

    // 9. 12-second change-detection polling (avoids full downloads when nothing changed)
    let _pollInterval = null;
    async function pollForChanges() {
      try {
        const result = await MenuService.checkForChanges();
        if (result && result.success) {
          updateLiveSyncBadge(true);
          if (result.changed === true) {
            await refreshCloudData();
          }
        }
      } catch (e) {
        updateLiveSyncBadge(false);
      }
    }

    function startPolling() {
      if (_pollInterval) clearInterval(_pollInterval);
      _pollInterval = setInterval(pollForChanges, 12000);
    }

    function stopPolling() {
      if (_pollInterval) { clearInterval(_pollInterval); _pollInterval = null; }
    }

    // Pause polling when tab is hidden, resume + check when visible
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'hidden') {
        stopPolling();
      } else {
        pollForChanges();
        startPolling();
      }
    });

    // Immediate check + restart polling on network reconnect
    window.addEventListener('online', () => {
      pollForChanges();
      startPolling();
    });

    startPolling();
  }

  // ==========================================================================
  // MOBILE CATEGORY NAVIGATION BAR
  // ==========================================================================

  function setupCategoryNavBar() {
    if (!elements.categoryNavBar) return;

    elements.categoryNavBar.addEventListener('click', (e) => {
      const pill = e.target.closest('.cat-pill');
      if (!pill) return;

      elements.categoryNavBar.querySelectorAll('.cat-pill').forEach(p => p.classList.remove('active'));
      pill.classList.add('active');

      const cat = pill.dataset.cat;
      state.activeCategory = cat;
      filterMenuByCategory(cat);
    });
  }

  function filterMenuByCategory(category) {
    const blocks = document.querySelectorAll('.menu-category-block');
    if (category === 'all') {
      blocks.forEach(b => {
        b.style.display = '';
        b.classList.remove('category-focus');
      });
      document.querySelectorAll('.menu-card').forEach(c => c.style.display = '');
    } else {
      let targetElement = null;
      blocks.forEach(b => {
        if (b.dataset.category === category) {
          b.style.display = '';
          b.classList.add('category-focus');
          targetElement = b;
        } else {
          b.style.display = 'none';
          b.classList.remove('category-focus');
        }
      });

      if (targetElement) {
        targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
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

    elements.themeColorGrid.innerHTML = SIXTY_COLORS.map(c => `
      <div 
        class="color-swatch-item ${state.currentTheme.headerColor.toLowerCase() === c.hex.toLowerCase() ? 'active' : ''}" 
        data-hex="${c.hex}" 
        title="${c.name} (${c.hex})"
        style="background: ${c.hex};"
      ></div>
    `).join('');

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

    elements.customHeaderPicker.addEventListener('input', (e) => {
      const hex = e.target.value;
      elements.themeColorGrid.querySelectorAll('.color-swatch-item').forEach(el => {
        el.classList.toggle('active', el.dataset.hex.toLowerCase() === hex.toLowerCase());
      });
      updateTempHeaderColor(hex);
    });

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
    updatePreviewBox();
  }

  function updatePreviewBox() {
    if (!elements.prevHeader || !elements.prevBody) return;
    elements.prevHeader.style.background = `linear-gradient(135deg, ${state.tempTheme.headerColor}, ${state.tempTheme.headerGrad})`;
    elements.prevBody.style.background = state.tempTheme.bgColor;
    if (elements.prevHeading) {
      elements.prevHeading.style.color = state.tempTheme.accentColor;
    }
  }

  function openThemeModal() {
    state.tempTheme = { ...state.currentTheme };
    elements.customHeaderPicker.value = state.tempTheme.headerColor;
    elements.customBgPicker.value = state.tempTheme.bgColor;

    elements.themeColorGrid.querySelectorAll('.color-swatch-item').forEach(el => {
      el.classList.toggle('active', el.dataset.hex.toLowerCase() === state.tempTheme.headerColor.toLowerCase());
    });
    elements.themeBgGrid.querySelectorAll('.bg-swatch-item').forEach(el => {
      el.classList.toggle('active', el.dataset.hex.toLowerCase() === state.tempTheme.bgColor.toLowerCase());
    });

    updatePreviewBox();
    elements.themeModal.classList.add('active');
  }

  function closeThemeModal() {
    elements.themeModal.classList.remove('active');
  }

  function handleApplyTheme() {
    showAdminConfirm({
      icon: '🎨',
      title: 'Confirm Menu Color Theme?',
      message: 'Apply this new color theme to the live restaurant menu? All connected customers and screens will reflect this theme.',
      details: `
        <div><strong>Header & Accent Color:</strong> <span style="display:inline-block; width:12px; height:12px; background:${state.tempTheme.headerColor}; border-radius:2px; vertical-align:middle;"></span> ${state.tempTheme.headerColor}</div>
        <div style="margin-top:4px;"><strong>Background Color:</strong> <span style="display:inline-block; width:12px; height:12px; background:${state.tempTheme.bgColor}; border:1px solid #ccc; border-radius:2px; vertical-align:middle;"></span> ${state.tempTheme.bgColor}</div>
      `,
      confirmText: 'Confirm & Apply Theme',
      confirmColor: '#2563eb',
      onConfirm: async () => {
        state.currentTheme = { ...state.tempTheme };
        applyTheme(state.currentTheme);
        await MenuService.saveThemeData(state.currentTheme);
        closeThemeModal();
        showToast('🎨 Menu theme updated across all devices!', '✨');
      }
    });
  }

  function handleResetTheme() {
    showAdminConfirm({
      icon: '🔄',
      title: 'Reset Theme to Default Red?',
      message: 'Are you sure you want to restore the original Hungry Hut authentic red theme?',
      confirmText: 'Yes, Reset Theme',
      confirmColor: '#dc2626',
      onConfirm: async () => {
        state.currentTheme = await MenuService.resetTheme();
        state.tempTheme = { ...state.currentTheme };
        applyTheme(state.currentTheme);
        closeThemeModal();
        showToast('Restored default Hungry Hut theme!', '🔄');
      }
    });
  }

  // ==========================================================================
  // FOOTER FUNCTIONS
  // ==========================================================================

  function renderFooter(data) {
    if (!data) return;
    if (elements.footerDisplayTitle) elements.footerDisplayTitle.textContent = `🍽️ ${data.restaurantTitle || 'Hungry Hut Restaurant & Cafe'}`;
    if (elements.footerDisplayTagline) elements.footerDisplayTagline.textContent = data.tagline || 'Authentic Dum Biryanis, Starters, Wok Rice & Curries';
    if (elements.footerDisplayServices) elements.footerDisplayServices.textContent = data.services || 'Dine-In • Takeaway • Bulk Party Orders';
    if (elements.footerDisplayTimings) elements.footerDisplayTimings.textContent = data.timings || 'Open Daily: 11:00 AM - 11:00 PM';
    if (elements.footerDisplayAddress) elements.footerDisplayAddress.textContent = data.address || 'Near K. R. R. School, Kurnool to Nandyal Road, PANYAM, 518112';
    if (elements.footerDisplayPhone) elements.footerDisplayPhone.textContent = data.phoneNumbers || '85559 38190, 63044 54153';
  }

  function openFooterModal() {
    const data = MenuService.getFooterData();
    elements.footerTitleInput.value = data.restaurantTitle || '';
    elements.footerTaglineInput.value = data.tagline || '';
    elements.footerPhoneInput.value = data.phoneNumbers || '';
    elements.footerTimingsInput.value = data.timings || '';
    elements.footerAddressInput.value = data.address || '';
    elements.footerServicesInput.value = data.services || '';
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

    if (!title || !phone || !address) {
      alert('Please fill out Title, Phone Numbers, and Address.');
      return;
    }

    showAdminConfirm({
      icon: '📝',
      title: 'Confirm Footer Details Update?',
      message: 'Confirm updating restaurant brand info, operating timings, and phone numbers in MongoDB?',
      details: `
        <div><strong>Title:</strong> ${escapeHtml(title)}</div>
        <div style="margin-top:4px;"><strong>Contact:</strong> ${escapeHtml(phone)}</div>
      `,
      confirmText: 'Confirm & Save Footer',
      confirmColor: '#16a34a',
      onConfirm: async () => {
        const updated = {
          restaurantTitle: title,
          tagline,
          phoneNumbers: phone,
          timings,
          address,
          services
        };

        await MenuService.saveFooterData(updated);
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
          <button type="button" class="btn-row-action btn-manage-edit" data-id="${item.id}" title="Edit Dish Details">✏️</button>
          <button type="button" class="btn-remove-dish" data-id="${item.id}" title="Remove Product from Menu">
            🗑️ Remove
          </button>
        </div>
      </div>
    `).join('');

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
          onConfirm: async () => {
            await MenuService.deleteItem(id);
            state.items = state.items.filter(i => i.id !== id);
            renderManageProductsList(elements.manageSearchInput.value);
            renderMenu();
            showToast(`Dish "${item.name}" removed from menu.`, '🗑️');
          }
        });
      });
    });

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
  // ADMIN CREDENTIALS & ACCOUNT SETTINGS (PASSWORD & EMAIL CHANGE)
  // ==========================================================================

  function openCredentialsModal() {
    if (!elements.credentialsModal) return;
    elements.credentialsForm.reset();
    elements.credsErrorMsg.style.display = 'none';
    elements.credsSuccessMsg.style.display = 'none';

    const currentEmail = MenuService.getStoredAdminEmail();
    if (elements.credEmailInput) {
      elements.credEmailInput.value = currentEmail;
    }

    elements.credentialsModal.classList.add('active');
    if (elements.credCurrentPasswordInput) {
      elements.credCurrentPasswordInput.focus();
    }
  }

  function closeCredentialsModal() {
    if (elements.credentialsModal) {
      elements.credentialsModal.classList.remove('active');
    }
  }

  async function handleSaveCredentials(e) {
    e.preventDefault();
    elements.credsErrorMsg.style.display = 'none';
    elements.credsSuccessMsg.style.display = 'none';

    const currentPassword = elements.credCurrentPasswordInput.value;
    const newEmail = elements.credEmailInput.value.trim();
    const newPassword = elements.credNewPasswordInput.value;
    const confirmPassword = elements.credConfirmPasswordInput.value;

    if (!currentPassword) {
      elements.credsErrorMsg.textContent = 'Please enter your current password to verify your identity.';
      elements.credsErrorMsg.style.display = 'block';
      return;
    }

    if (newPassword) {
      if (newPassword.length < 6) {
        elements.credsErrorMsg.textContent = 'New password must be at least 6 characters long.';
        elements.credsErrorMsg.style.display = 'block';
        return;
      }
      if (newPassword !== confirmPassword) {
        elements.credsErrorMsg.textContent = 'New password and confirmation password do not match.';
        elements.credsErrorMsg.style.display = 'block';
        return;
      }
    }

    const currentEmail = MenuService.getStoredAdminEmail();
    const emailChanging = newEmail && newEmail.toLowerCase() !== currentEmail.toLowerCase();
    const passChanging = !!newPassword;

    if (!emailChanging && !passChanging) {
      elements.credsErrorMsg.textContent = 'No changes detected. Enter a new email address or new password.';
      elements.credsErrorMsg.style.display = 'block';
      return;
    }

    let changeDesc = [];
    if (emailChanging) changeDesc.push(`Admin Email to "${escapeHtml(newEmail)}"`);
    if (passChanging) changeDesc.push('Admin Password');

    showAdminConfirm({
      icon: '🔑',
      title: 'Confirm Security Changes?',
      message: `Confirm updating your ${changeDesc.join(' and ')} in MongoDB?`,
      confirmText: 'Confirm & Save Changes',
      confirmColor: '#7c3aed',
      onConfirm: async () => {
        try {
          const res = await MenuService.updateAdminCredentials({
            currentPassword,
            newEmail,
            newPassword,
            confirmPassword
          });

          if (res.success) {
            elements.credsSuccessMsg.textContent = res.message || 'Credentials updated successfully!';
            elements.credsSuccessMsg.style.display = 'block';

            if (elements.adminLoggedInEmailDisplay && newEmail) {
              elements.adminLoggedInEmailDisplay.textContent = newEmail;
            }

            elements.credCurrentPasswordInput.value = '';
            elements.credNewPasswordInput.value = '';
            elements.credConfirmPasswordInput.value = '';

            showToast('🔑 Admin credentials saved securely in MongoDB!', '✅');
            setTimeout(() => {
              closeCredentialsModal();
            }, 1800);
          } else {
            elements.credsErrorMsg.textContent = res.message || 'Verification failed. Please check current password.';
            elements.credsErrorMsg.style.display = 'block';
          }
        } catch (err) {
          elements.credsErrorMsg.textContent = 'Network or server error while updating credentials.';
          elements.credsErrorMsg.style.display = 'block';
        }
      }
    });
  }

  // ==========================================================================
  // AUTHENTIC MENU RENDERING
  // ==========================================================================

  function renderMenu() {
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

    bindItemRowActions();

    // Re-apply active category filter if set
    if (state.activeCategory && state.activeCategory !== 'all') {
      filterMenuByCategory(state.activeCategory);
    }
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
            <button type="button" class="btn-row-action btn-item-price" data-id="${item.id}" title="Quick Change Price">
              ₹
            </button>
            <button type="button" class="btn-row-action btn-item-discount" data-id="${item.id}" title="Add/Change Discount">
              🏷️
            </button>
            <button type="button" class="btn-row-action btn-item-edit" data-id="${item.id}" title="Edit Dish Details">
              ✏️
            </button>
            <button type="button" class="btn-row-action btn-item-delete" data-id="${item.id}" title="Remove Product">
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
            onConfirm: async () => {
              await MenuService.changePrice(id, newPrice);
              item.price = Number(newPrice);
              renderMenu();
              showToast(`Updated price for "${item.name}" to ₹${newPrice}/-`, '💰');
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

        const newDisc = prompt(`Enter discount % for "${item.name}" (0 to 100, current: ${item.discountPercent || 0}%):`, item.discountPercent || 0);
        if (newDisc !== null && !isNaN(Number(newDisc)) && Number(newDisc) >= 0 && Number(newDisc) <= 100) {
          showAdminConfirm({
            icon: '🏷️',
            title: 'Confirm Discount Update?',
            message: `Update discount on <strong>${escapeHtml(item.name)}</strong> to <strong>${newDisc}%</strong>?`,
            confirmText: 'Apply Discount',
            confirmColor: '#16a34a',
            onConfirm: async () => {
              await MenuService.setDiscount(id, newDisc);
              item.discountPercent = Number(newDisc);
              renderMenu();
              showToast(`Updated discount for "${item.name}" to ${newDisc}%`, '🏷️');
            }
          });
        }
      });
    });

    // Quick Edit Dish Details
    document.querySelectorAll('.btn-item-edit').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const id = btn.dataset.id;
        openDishModal(id);
      });
    });

    // Quick Delete Dish
    document.querySelectorAll('.btn-item-delete').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const id = btn.dataset.id;
        const item = state.items.find(i => i.id === id);
        if (!item) return;

        showAdminConfirm({
          icon: '🗑️',
          title: 'Remove Dish from Live Menu?',
          message: `Are you sure you want to permanently delete <strong>"${escapeHtml(item.name)}"</strong> from the menu?`,
          details: `<div><strong>Category:</strong> ${escapeHtml(item.category)}</div><div style="margin-top:4px;"><strong>Price:</strong> ₹${item.price}/-</div>`,
          confirmText: 'Yes, Delete Dish',
          confirmColor: '#dc2626',
          onConfirm: async () => {
            await MenuService.deleteItem(id);
            state.items = state.items.filter(i => i.id !== id);
            renderMenu();
            showToast(`Dish "${item.name}" deleted from menu.`, '🗑️');
          }
        });
      });
    });
  }

  // ==========================================================================
  // DISH CRUD MODAL
  // ==========================================================================

  function setupImagePresets() {
    if (!elements.imagePresetGrid) return;
    elements.imagePresetGrid.innerHTML = IMAGE_PRESETS.map(preset => `
      <div 
        class="image-picker-thumb ${preset.path === state.selectedImagePreset ? 'selected' : ''}" 
        data-path="${preset.path}" 
        title="${preset.label}"
      >
        <img src="${preset.path}" alt="${preset.label}">
        <span class="image-picker-label">${preset.label}</span>
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
      onConfirm: async () => {
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
          await MenuService.updateItem(state.editingId, payload);
          showToast(`Updated "${name}" successfully!`, '✅');
        } else {
          await MenuService.addItem(payload);
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
      onConfirm: async () => {
        const updatedItems = await MenuService.applyBulkDiscount(discount, scope);
        state.items = updatedItems;
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
      onConfirm: async () => {
        state.items = await MenuService.resetDefaults();
        setupCategoryDropdown();
        renderMenu();
        showToast('Menu restored to original dishes in MongoDB!', '🔄');
      }
    });
  }

  // ==========================================================================
  // ADMIN AUTHENTICATION
  // ==========================================================================

  function openLoginModal() {
    if (elements.loginForm) elements.loginForm.reset();
    if (elements.loginErrorMsg) elements.loginErrorMsg.style.display = 'none';
    if (elements.loginEmailInput) elements.loginEmailInput.value = MenuService.getStoredAdminEmail();
    if (elements.loginModal) {
      elements.loginModal.classList.add('active');
      elements.loginModal.style.display = 'flex';
    }
    setTimeout(() => {
      if (elements.loginPasswordInput) {
        try { elements.loginPasswordInput.focus(); } catch (e) {}
      }
    }, 150);
  }

  function closeLoginModal() {
    if (elements.loginModal) {
      elements.loginModal.classList.remove('active');
      elements.loginModal.style.display = 'none';
    }
  }

  async function handleLoginSubmit(e) {
    e.preventDefault();
    const email = elements.loginEmailInput.value.trim();
    const password = elements.loginPasswordInput.value;

    elements.loginErrorMsg.style.display = 'none';

    const result = await MenuService.loginAdmin(email, password);
    if (result.success) {
      state.isAdmin = true;
      if (elements.adminLoggedInEmailDisplay && result.admin && result.admin.email) {
        elements.adminLoggedInEmailDisplay.textContent = result.admin.email;
      }
      closeLoginModal();
      updateAdminUI();
      renderMenu();
      showToast('🎉 Admin login successful! Welcome back.', '👑');
    } else {
      elements.loginErrorMsg.textContent = result.message || 'Invalid email or password.';
      elements.loginErrorMsg.style.display = 'block';
    }
  }

  function handleLogout() {
    state.isAdmin = false;
    MenuService.logoutAdmin();
    updateAdminUI();
    renderMenu();
    showToast('Logged out of Admin Portal.', '👋');
  }

  function updateAdminUI() {
    document.body.classList.toggle('admin-mode', state.isAdmin);
    if (elements.adminToolbar) {
      elements.adminToolbar.classList.toggle('active', state.isAdmin);
    }
    if (elements.navAdminLabel) {
      elements.navAdminLabel.textContent = state.isAdmin ? 'Admin Tools' : 'Hungry Hut';
    }
    if (elements.navAdminIcon) {
      elements.navAdminIcon.textContent = state.isAdmin ? '👑' : '🍽️';
    }
    const email = MenuService.getStoredAdminEmail();
    if (elements.adminLoggedInEmailDisplay) {
      elements.adminLoggedInEmailDisplay.textContent = email;
    }
  }

  // ==========================================================================
  // EVENT BINDINGS
  // ==========================================================================

  function bindEvents() {
    // Secret Trigger 1: Clicking anywhere on the Hungry Hut Header brand/details
    if (elements.headerBrand) {
      elements.headerBrand.addEventListener('click', () => {
        if (!state.isAdmin) {
          openLoginModal();
        } else {
          showToast('👑 Admin Mode is active! Manage products, theme, and account using toolbar.', 'ℹ️');
          if (elements.adminToolbar) elements.adminToolbar.scrollIntoView({ behavior: 'smooth' });
        }
      });
    }

    // Secret Trigger 2: Clicking the Footer Hungry Hut Title
    if (elements.footerDisplayTitle) {
      elements.footerDisplayTitle.addEventListener('click', () => {
        if (!state.isAdmin) {
          openLoginModal();
        } else {
          if (elements.adminToolbar) elements.adminToolbar.scrollIntoView({ behavior: 'smooth' });
        }
      });
    }

    // Secret Trigger 3: Secret keyboard shortcut Ctrl+Shift+A or Alt+A
    document.addEventListener('keydown', (e) => {
      if ((e.ctrlKey && e.shiftKey && e.key.toLowerCase() === 'a') || (e.altKey && e.key.toLowerCase() === 'a')) {
        e.preventDefault();
        if (!state.isAdmin) {
          openLoginModal();
        } else {
          if (elements.adminToolbar) elements.adminToolbar.scrollIntoView({ behavior: 'smooth' });
        }
      }
    });

    // Login Form Submit & Modal Controls
    elements.loginForm.addEventListener('submit', handleLoginSubmit);
    elements.closeLoginModalBtn.addEventListener('click', closeLoginModal);
    elements.loginModal.addEventListener('click', (e) => {
      if (e.target === elements.loginModal) closeLoginModal();
    });

    // Password Visibility Toggle for Login
    if (elements.togglePasswordBtn && elements.loginPasswordInput) {
      elements.togglePasswordBtn.addEventListener('click', () => {
        const isPassword = elements.loginPasswordInput.type === 'password';
        elements.loginPasswordInput.type = isPassword ? 'text' : 'password';
        elements.togglePasswordBtn.title = isPassword ? 'Hide Password' : 'Show Password';
      });
    }

    // Admin Logout
    elements.adminLogoutBtn.addEventListener('click', handleLogout);

    // Toolbar Buttons
    elements.adminAddDishBtn.addEventListener('click', () => openDishModal(null));
    elements.adminDiscountBtn.addEventListener('click', openDiscountModal);
    elements.adminThemeBtn.addEventListener('click', openThemeModal);
    elements.adminFooterBtn.addEventListener('click', openFooterModal);
    elements.adminManageBtn.addEventListener('click', openManageModal);
    elements.adminResetBtn.addEventListener('click', handleResetDefaults);

    // Admin Account & Credentials Settings Modal
    if (elements.adminAccountBtn) {
      elements.adminAccountBtn.addEventListener('click', openCredentialsModal);
    }
    if (elements.closeCredentialsModalBtn) {
      elements.closeCredentialsModalBtn.addEventListener('click', closeCredentialsModal);
    }
    if (elements.cancelCredentialsModalBtn) {
      elements.cancelCredentialsModalBtn.addEventListener('click', closeCredentialsModal);
    }
    if (elements.credentialsModal) {
      elements.credentialsModal.addEventListener('click', (e) => {
        if (e.target === elements.credentialsModal) closeCredentialsModal();
      });
    }
    if (elements.credentialsForm) {
      elements.credentialsForm.addEventListener('submit', handleSaveCredentials);
    }

    // Toggle Eye buttons for credentials modal
    setupPasswordToggle(elements.toggleCredCurrentPassBtn, elements.credCurrentPasswordInput);
    setupPasswordToggle(elements.toggleCredNewPassBtn, elements.credNewPasswordInput);
    setupPasswordToggle(elements.toggleCredConfirmPassBtn, elements.credConfirmPasswordInput);

    // Add/Edit Dish Modal Controls
    elements.dishForm.addEventListener('submit', handleSaveDish);
    elements.closeDishModalBtn.addEventListener('click', closeDishModal);
    elements.cancelDishModalBtn.addEventListener('click', closeDishModal);
    elements.dishModal.addEventListener('click', (e) => {
      if (e.target === elements.dishModal) closeDishModal();
    });

    elements.dishCategorySelect.addEventListener('change', (e) => {
      elements.dishNewCategoryInput.style.display = e.target.value === '__NEW__' ? 'block' : 'none';
      if (e.target.value === '__NEW__') elements.dishNewCategoryInput.focus();
    });

    // Bulk Discount Modal Controls
    elements.discountForm.addEventListener('submit', handleApplyBulkDiscount);
    elements.closeDiscountModalBtn.addEventListener('click', closeDiscountModal);
    elements.cancelDiscountModalBtn.addEventListener('click', closeDiscountModal);
    elements.discountModal.addEventListener('click', (e) => {
      if (e.target === elements.discountModal) closeDiscountModal();
    });

    // Theme Customizer Modal Controls
    elements.closeThemeModalBtn.addEventListener('click', closeThemeModal);
    elements.cancelThemeModalBtn.addEventListener('click', closeThemeModal);
    elements.applyThemeBtn.addEventListener('click', handleApplyTheme);
    elements.resetThemeBtn.addEventListener('click', handleResetTheme);
    elements.themeModal.addEventListener('click', (e) => {
      if (e.target === elements.themeModal) closeThemeModal();
    });

    // Footer Editor Modal Controls
    elements.footerForm.addEventListener('submit', handleSaveFooter);
    elements.closeFooterModalBtn.addEventListener('click', closeFooterModal);
    elements.cancelFooterModalBtn.addEventListener('click', closeFooterModal);
    elements.footerModal.addEventListener('click', (e) => {
      if (e.target === elements.footerModal) closeFooterModal();
    });

    // Manage Products Modal Controls
    elements.closeManageModalBtn.addEventListener('click', closeManageModal);
    elements.closeManageModalBottomBtn.addEventListener('click', closeManageModal);
    elements.manageModal.addEventListener('click', (e) => {
      if (e.target === elements.manageModal) closeManageModal();
    });
    elements.manageSearchInput.addEventListener('input', (e) => {
      renderManageProductsList(e.target.value);
    });

    // Mobile Bottom Navigation Bar Controls
    if (elements.navCategoriesBtn) {
      elements.navCategoriesBtn.addEventListener('click', () => {
        if (elements.categoryNavBar) {
          elements.categoryNavBar.scrollIntoView({ behavior: 'smooth' });
        } else {
          window.scrollTo({ top: 120, behavior: 'smooth' });
        }
      });
    }

    if (elements.navAdminBtn) {
      elements.navAdminBtn.addEventListener('click', () => {
        if (!state.isAdmin) {
          openLoginModal();
        } else {
          if (elements.adminToolbar) {
            elements.adminToolbar.scrollIntoView({ behavior: 'smooth' });
          }
          openCredentialsModal();
        }
      });
    }
  }

  function setupPasswordToggle(btn, input) {
    if (!btn || !input) return;
    btn.addEventListener('click', () => {
      const isPass = input.type === 'password';
      input.type = isPass ? 'text' : 'password';
      btn.title = isPass ? 'Hide Password' : 'Show Password';
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

  // Initialize on DOM load
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
