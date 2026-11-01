/**
 * Hungry Hut Menu Data & Storage Management
 * Contains default items transcribed from original menu cards,
 * with Telugu names, prices, discounts, and image associations.
 */

const DEFAULT_MENU_DATA = [
  // ==========================================
  // PAGE 1: VEG BIRYANI
  // ==========================================
  {
    id: "veg-biryani-1",
    name: "Kaju Biryani",
    teluguName: "కాజు బిర్యానీ",
    category: "Veg Biryani",
    price: 220,
    discountPercent: 0,
    type: "veg",
    image: "images/kaju-biryani.jpg",
    description: "Royal saffron basmati rice loaded with roasted cashews and aromatic whole spices.",
    page: 1
  },
  {
    id: "veg-biryani-2",
    name: "Paneer Biryani",
    teluguName: "పనీర్ బిర్యానీ",
    category: "Veg Biryani",
    price: 220,
    discountPercent: 0,
    type: "veg",
    image: "images/kaju-biryani.jpg",
    description: "Marinated cottage cheese layered with spiced fragrant basmati rice.",
    page: 1
  },
  {
    id: "veg-biryani-3",
    name: "Mashroom Biryani",
    teluguName: "మష్రూమ్ బిర్యానీ",
    category: "Veg Biryani",
    price: 200,
    discountPercent: 0,
    type: "veg",
    image: "images/mushroom-chilli.jpg",
    description: "Fresh button mushrooms cooked dum style with herbs and biryani spices.",
    page: 1
  },

  // ==========================================
  // PAGE 1: FRIED RICE ITEMS
  // ==========================================
  {
    id: "fried-rice-1",
    name: "Ghee Fried Rice",
    teluguName: "ఘీ ఫ్రైడ్ రైస్",
    category: "Fried Rice Items",
    price: 130,
    discountPercent: 0,
    type: "veg",
    image: "images/fried-rice.jpg",
    description: "Aromatic basmati rice tossed in pure desi ghee with mild spices.",
    page: 1
  },
  {
    id: "fried-rice-2",
    name: "Chicken Fried Rice",
    teluguName: "చికెన్ ఫ్రైడ్ రైస్",
    category: "Fried Rice Items",
    price: 130,
    discountPercent: 0,
    type: "non-veg",
    image: "images/fried-rice.jpg",
    description: "Wok tossed rice with tender shredded chicken, egg, and spring onions.",
    page: 1
  },
  {
    id: "fried-rice-3",
    name: "Paneer Fried Rice",
    teluguName: "పనీర్ ఫ్రైడ్ రైస్",
    category: "Fried Rice Items",
    price: 130,
    discountPercent: 0,
    type: "veg",
    image: "images/fried-rice.jpg",
    description: "Savory stir-fried rice with golden paneer cubes and veggies.",
    page: 1
  },
  {
    id: "fried-rice-4",
    name: "Kaju Rice",
    teluguName: "కాజు రైస్",
    category: "Fried Rice Items",
    price: 130,
    discountPercent: 0,
    type: "veg",
    image: "images/kaju-biryani.jpg",
    description: "Rich flavorful rice tempered with crunchy roasted cashews.",
    page: 1
  },
  {
    id: "fried-rice-5",
    name: "Egg Rice",
    teluguName: "ఎగ్ రైస్",
    category: "Fried Rice Items",
    price: 110,
    discountPercent: 0,
    type: "egg",
    image: "images/egg-chilli.jpg",
    description: "Street-style fried rice scrambled with fresh eggs and pepper.",
    page: 1
  },
  {
    id: "fried-rice-6",
    name: "Jeera Rice",
    teluguName: "జీర రైస్",
    category: "Fried Rice Items",
    price: 110,
    discountPercent: 0,
    type: "veg",
    image: "images/fried-rice.jpg",
    description: "Basmati rice tempered with roasted cumin seeds and desi ghee.",
    page: 1
  },
  {
    id: "fried-rice-7",
    name: "Tomato Rice",
    teluguName: "టమోట రైస్",
    category: "Fried Rice Items",
    price: 110,
    discountPercent: 0,
    type: "veg",
    image: "images/fried-rice.jpg",
    description: "Tangy rice tempered with ripe country tomatoes and mustard seeds.",
    page: 1
  },
  {
    id: "fried-rice-8",
    name: "Veg Fried Rice",
    teluguName: "వెజ్ ఫ్రైడ్ రైస్",
    category: "Fried Rice Items",
    price: 110,
    discountPercent: 0,
    type: "veg",
    image: "images/fried-rice.jpg",
    description: "Classic stir-fried rice with finely chopped garden vegetables.",
    page: 1
  },
  {
    id: "fried-rice-9",
    name: "Mashroom Rice",
    teluguName: "మష్రూమ్ రైస్",
    category: "Fried Rice Items",
    price: 130,
    discountPercent: 0,
    type: "veg",
    image: "images/mushroom-chilli.jpg",
    description: "Stir-fried rice loaded with fresh sliced button mushrooms.",
    page: 1
  },

  // ==========================================
  // PAGE 1: NON - VEG BIRYANI
  // ==========================================
  {
    id: "nonveg-biryani-1",
    name: "Hungry Hut S.P Biryani",
    teluguName: "హాంక్రీ హాట్ బిర్యానీ",
    category: "Non - Veg Biryani",
    price: 240,
    discountPercent: 0,
    type: "non-veg",
    image: "images/mutton-biryani.jpg",
    description: "House special biryani with boneless juicy chicken and chef's secret masala.",
    page: 1
  },
  {
    id: "nonveg-biryani-2",
    name: "Mutton Dum Biryani",
    teluguName: "మటన్ దమ్ బిర్యానీ",
    category: "Non - Veg Biryani",
    price: 250,
    discountPercent: 0,
    type: "non-veg",
    image: "images/mutton-biryani.jpg",
    description: "Slow dum-cooked tender mutton layered with fragrant basmati rice.",
    page: 1
  },
  {
    id: "nonveg-biryani-3",
    name: "Mutton Rost Biryani",
    teluguName: "మటన్ రోస్ట్ బిర్యానీ",
    category: "Non - Veg Biryani",
    price: 250,
    discountPercent: 0,
    type: "non-veg",
    image: "images/mutton-biryani.jpg",
    description: "Spicy pan-roasted mutton pieces served over steaming biryani rice.",
    page: 1
  },
  {
    id: "nonveg-biryani-4",
    name: "Chicken S.P Biryani",
    teluguName: "చికెన్ ఎస్పీ బిర్యానీ",
    category: "Non - Veg Biryani",
    price: 220,
    discountPercent: 0,
    type: "non-veg",
    image: "images/mutton-biryani.jpg",
    description: "Succulent chicken cooked in special masala with saffron rice.",
    page: 1
  },
  {
    id: "nonveg-biryani-5",
    name: "Lollipop Biryani",
    teluguName: "లాలీపాప్ బిర్యానీ",
    category: "Non - Veg Biryani",
    price: 220,
    discountPercent: 0,
    type: "non-veg",
    image: "images/chicken-lollipop.jpg",
    description: "Crisp chicken lollipops served on a fragrant bed of dum biryani.",
    page: 1
  },
  {
    id: "nonveg-biryani-6",
    name: "Chicken Dum Biryani",
    teluguName: "చికెన్ దమ్ బిర్యానీ",
    category: "Non - Veg Biryani",
    price: 150,
    discountPercent: 0,
    type: "non-veg",
    image: "images/mutton-biryani.jpg",
    description: "Authentic Hyderabadi chicken dum biryani with rich spices.",
    page: 1
  },
  {
    id: "nonveg-biryani-7",
    name: "Chicken Rost Biryani",
    teluguName: "చికెన్ రోస్ట్ బిర్యానీ",
    category: "Non - Veg Biryani",
    price: 150,
    discountPercent: 0,
    type: "non-veg",
    image: "images/mutton-biryani.jpg",
    description: "Pan-roasted country-style chicken pieces over aromatic biryani rice.",
    page: 1
  },

  // ==========================================
  // PAGE 2: VEG STARTERS
  // ==========================================
  {
    id: "veg-starter-1",
    name: "Paneer 65",
    teluguName: "పనీర్ 65",
    category: "Veg Starters",
    price: 220,
    discountPercent: 0,
    type: "veg",
    image: "images/paneer-65.jpg",
    description: "Crispy batter-fried paneer tossed with curry leaves and green chillies.",
    page: 2
  },
  {
    id: "veg-starter-2",
    name: "Paneer Manchuriya",
    teluguName: "పనీర్ మంచూరియా",
    category: "Veg Starters",
    price: 220,
    discountPercent: 0,
    type: "veg",
    image: "images/paneer-65.jpg",
    description: "Golden paneer cubes tossed in savory ginger-garlic Manchurian glaze.",
    page: 2
  },
  {
    id: "veg-starter-3",
    name: "Chilli Paneer",
    teluguName: "చిల్లి పనీర్",
    category: "Veg Starters",
    price: 220,
    discountPercent: 0,
    type: "veg",
    image: "images/paneer-65.jpg",
    description: "Spicy wok-tossed paneer with capsicum, onions, and red chilli sauce.",
    page: 2
  },
  {
    id: "veg-starter-4",
    name: "Mashroom 65",
    teluguName: "మష్రూమ్ 65",
    category: "Veg Starters",
    price: 200,
    discountPercent: 0,
    type: "veg",
    image: "images/mushroom-chilli.jpg",
    description: "Crispy spiced button mushrooms tempered with South Indian 65 masala.",
    page: 2
  },
  {
    id: "veg-starter-5",
    name: "Mushroom Chilli",
    teluguName: "మష్రూమ్ చిల్లి",
    category: "Veg Starters",
    price: 200,
    discountPercent: 0,
    type: "veg",
    image: "images/mushroom-chilli.jpg",
    description: "Batter-fried button mushrooms tossed in spicy Indo-Chinese chilli gravy.",
    page: 2
  },

  // ==========================================
  // PAGE 2: VEG CURRY ITEMS
  // ==========================================
  {
    id: "veg-curry-1",
    name: "Kaju Paneer Curry",
    teluguName: "కాజు పనీర్ కర్రీ",
    category: "Veg Curry Items",
    price: 250,
    discountPercent: 0,
    type: "veg",
    image: "images/paneer-butter-masala.jpg",
    description: "Royal gravy combining roasted cashews and soft paneer in creamy gravy.",
    page: 2
  },
  {
    id: "veg-curry-2",
    name: "Kaju Curry",
    teluguName: "కాజు కర్రీ",
    category: "Veg Curry Items",
    price: 220,
    discountPercent: 0,
    type: "veg",
    image: "images/paneer-butter-masala.jpg",
    description: "Rich creamy cashew gravy loaded with golden fried whole cashews.",
    page: 2
  },
  {
    id: "veg-curry-3",
    name: "Kadai Paneer",
    teluguName: "కడాయి పనీర్",
    category: "Veg Curry Items",
    price: 220,
    discountPercent: 0,
    type: "veg",
    image: "images/paneer-butter-masala.jpg",
    description: "Paneer cubes and capsicum in freshly roasted and ground kadai spices.",
    page: 2
  },
  {
    id: "veg-curry-4",
    name: "Paneer Butter Masala",
    teluguName: "పనీర్ బటర్ మసాలా",
    category: "Veg Curry Items",
    price: 220,
    discountPercent: 0,
    type: "veg",
    image: "images/paneer-butter-masala.jpg",
    description: "Smooth tomato-butter gravy with succulent paneer and fresh cream.",
    page: 2
  },
  {
    id: "veg-curry-5",
    name: "Mushroom Curry",
    teluguName: "మష్రూమ్ కర్రీ",
    category: "Veg Curry Items",
    price: 200,
    discountPercent: 0,
    type: "veg",
    image: "images/paneer-butter-masala.jpg",
    description: "Fresh button mushrooms simmered in traditional spiced onion gravy.",
    page: 2
  },
  {
    id: "veg-curry-6",
    name: "Mushroom Masala",
    teluguName: "మష్రూమ్ మసాలా",
    category: "Veg Curry Items",
    price: 200,
    discountPercent: 0,
    type: "veg",
    image: "images/paneer-butter-masala.jpg",
    description: "Semi-dry spicy mushroom masala with fragrant coriander and garam masala.",
    page: 2
  },

  // ==========================================
  // PAGE 2: NON-VEG STARTERS
  // ==========================================
  {
    id: "nonveg-starter-1",
    name: "Hungry Hut Chicken",
    teluguName: "హాంక్రీ హాట్ చికెన్",
    category: "Non-Veg Starters",
    price: 220,
    discountPercent: 0,
    type: "non-veg",
    image: "images/dragon-chicken.jpg",
    description: "House special starter: crispy chicken tossed with secret house masalas.",
    page: 2
  },
  {
    id: "nonveg-starter-2",
    name: "Dragon Chicken",
    teluguName: "డ్రాగన్ చికెన్",
    category: "Non-Veg Starters",
    price: 220,
    discountPercent: 0,
    type: "non-veg",
    image: "images/dragon-chicken.jpg",
    description: "Fiery crispy chicken glazed with spicy-sweet chilli sauce and cashews.",
    page: 2
  },
  {
    id: "nonveg-starter-3",
    name: "Chicken Rost",
    teluguName: "చికెన్ రోస్ట్",
    category: "Non-Veg Starters",
    price: 220,
    discountPercent: 0,
    type: "non-veg",
    image: "images/dragon-chicken.jpg",
    description: "South Indian country roast chicken with pepper, garlic, and curry leaves.",
    page: 2
  },
  {
    id: "nonveg-starter-4",
    name: "Chicken 65",
    teluguName: "చికెన్ 65",
    category: "Non-Veg Starters",
    price: 220,
    discountPercent: 0,
    type: "non-veg",
    image: "images/dragon-chicken.jpg",
    description: "Classic deep-fried chicken cubes spiced with authentic red 65 masala.",
    page: 2
  },
  {
    id: "nonveg-starter-5",
    name: "Chilli Chicken",
    teluguName: "చిల్లి చికెన్",
    category: "Non-Veg Starters",
    price: 220,
    discountPercent: 0,
    type: "non-veg",
    image: "images/dragon-chicken.jpg",
    description: "Crispy chicken tossed with bell peppers, green chillies, and soy glaze.",
    page: 2
  },
  {
    id: "nonveg-starter-6",
    name: "Chicken Manchuriya",
    teluguName: "చికెన్ మంచూరియా",
    category: "Non-Veg Starters",
    price: 220,
    discountPercent: 0,
    type: "non-veg",
    image: "images/dragon-chicken.jpg",
    description: "Golden fried chicken bites tossed in savoury garlic Manchurian sauce.",
    page: 2
  },
  {
    id: "nonveg-starter-7",
    name: "Lollipop Chicken",
    teluguName: "చికెన్ లాలీపప్",
    category: "Non-Veg Starters",
    price: 220,
    discountPercent: 0,
    type: "non-veg",
    image: "images/chicken-lollipop.jpg",
    description: "Crisp fried chicken winglets served with spicy Schezwan sauce.",
    page: 2
  },
  {
    id: "nonveg-starter-8",
    name: "Egg Chilli",
    teluguName: "ఎగ్ చిల్లి",
    category: "Non-Veg Starters",
    price: 150,
    discountPercent: 0,
    type: "egg",
    image: "images/egg-chilli.jpg",
    description: "Batter-coated boiled egg wedges tossed with spicy chillies and capsicum.",
    page: 2
  },
  {
    id: "nonveg-starter-9",
    name: "Egg Manchuriya",
    teluguName: "ఎగ్ మంచూరియా",
    category: "Non-Veg Starters",
    price: 150,
    discountPercent: 0,
    type: "egg",
    image: "images/egg-chilli.jpg",
    description: "Crispy egg fritters tossed in tangy ginger-garlic Manchurian gravy.",
    page: 2
  },
  {
    id: "nonveg-starter-10",
    name: "Egg 65",
    teluguName: "ఎగ్ 65",
    category: "Non-Veg Starters",
    price: 150,
    discountPercent: 0,
    type: "egg",
    image: "images/egg-chilli.jpg",
    description: "Crispy coated boiled egg halves tempered with red spices and curry leaves.",
    page: 2
  }
];

const STORAGE_KEY = "hungryhut_menu_v2";
const AUTH_KEY = "hungryhut_admin_auth";
const FOOTER_STORAGE_KEY = "hungryhut_footer_v1";
const THEME_STORAGE_KEY = "hungryhut_theme_v1";

const DEFAULT_FOOTER_DATA = {
  restaurantTitle: "Hungry Hut Restaurant & Cafe",
  tagline: "Authentic Dum Biryanis, Starters, Wok Rice & Curries",
  address: "Near K. R. R. School, Kurnool to Nandyal Road, PANYAM, 518112",
  phoneNumbers: "85559 38190, 63044 54153",
  timings: "Open Daily: 11:00 AM - 11:00 PM",
  services: "Dine-In • Takeaway • Bulk Party Orders"
};

const DEFAULT_THEME_DATA = {
  headerColor: "#800000",
  headerGrad: "#b30000",
  headerBorder: "#FFD700",
  bgColor: "#fff8f0",
  cardBg: "#fdfcf9",
  textColor: "#222222",
  accentColor: "#8B0000"
};

/**
 * Resolve the backend API base URL.
 * Supports: window.VITE_API_BASE_URL, window.HUNGRYHUT_API_BASE_URL, or direct GitHub Pages production URL.
 */
const API_BASE = (function () {
  if (typeof window === 'undefined') return '';
  if (window.VITE_API_BASE_URL) return window.VITE_API_BASE_URL.replace(/\/$/, '');
  if (window.HUNGRYHUT_API_BASE_URL) return window.HUNGRYHUT_API_BASE_URL.replace(/\/$/, '');
  
  // Environment variable support for Vite/bundlers if ever bundled
  try {
    if (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_API_BASE_URL) {
      return import.meta.env.VITE_API_BASE_URL.replace(/\/$/, '');
    }
  } catch (e) {}

  const host = window.location.hostname || '';
  // Default to deployed Vercel production API for GitHub Pages, remote hosts, and local file preview
  if (host.includes('github.io') || host.includes('vannilatoreact') || host === '' || window.location.protocol === 'file:') {
    return 'https://hungryhutmenu-api-service.vercel.app';
  }
  return '';
})();

/**
 * Menu Service for CRUD & Persistence
 */
const MenuService = {
  // In-memory cache for instant synchronous rendering
  _cache: {
    items: null,
    footer: null,
    theme: null,
    admin: null
  },


  // Sync state tracking for change-detection polling
  _lastSyncTimestamp: null,

  getSyncTimestamp() { return this._lastSyncTimestamp; },
  setSyncTimestamp(ts) { this._lastSyncTimestamp = ts; },

  async checkForChanges() {
    try {
      const since = this._lastSyncTimestamp ? ('?since=' + encodeURIComponent(this._lastSyncTimestamp)) : '';
      const res = await fetch(`${API_BASE}/api/sync/check${since}`);
      if (res.ok) {
        const data = await res.json();
        if (data.success && data.lastUpdated) this._lastSyncTimestamp = data.lastUpdated;
        return data;
      }
    } catch (e) { /* network issue */ }
    return { changed: false };
  },

  // Auth Helpers (JWT & Session Management)
  getAdminToken() {
    return localStorage.getItem('hungryhut_jwt_token') || sessionStorage.getItem('hungryhut_jwt_token');
  },

  setAdminToken(token, remember = true) {
    if (token) {
      if (remember) {
        localStorage.setItem('hungryhut_jwt_token', token);
      }
      sessionStorage.setItem('hungryhut_jwt_token', token);
      sessionStorage.setItem(AUTH_KEY, 'true');
    } else {
      localStorage.removeItem('hungryhut_jwt_token');
      sessionStorage.removeItem('hungryhut_jwt_token');
      sessionStorage.removeItem(AUTH_KEY);
    }
  },

  isAdminLoggedIn() {
    return !!this.getAdminToken();
  },

  getStoredAdminEmail() {
    return localStorage.getItem('hungryhut_admin_email') || 'admin@hungryhut.com';
  },

  setStoredAdminEmail(email) {
    if (email) localStorage.setItem('hungryhut_admin_email', email);
  },

  getAuthHeaders() {
    const token = this.getAdminToken();
    return {
      'Content-Type': 'application/json',
      ...(token ? { 'Authorization': `Bearer ${token}` } : {})
    };
  },

  // Admin Authentication APIs
  async loginAdmin(email, password) {
    try {
      const response = await fetch(`${API_BASE}/api/admin/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await response.json();
      if (data.success && data.token) {
        this.setAdminToken(data.token);
        if (data.admin && data.admin.email) {
          this.setStoredAdminEmail(data.admin.email);
        }
        return { success: true, admin: data.admin };
      }
      return { success: false, message: data.message || 'Login failed' };
    } catch (e) {
      console.error('Login network error', e);
      return { success: false, message: 'Server unreachable. Please check backend connection.' };
    }
  },

  async updateAdminCredentials({ currentPassword, newEmail, newPassword, confirmPassword }) {
    try {
      const response = await fetch(`${API_BASE}/api/admin/update-credentials`, {
        method: 'POST',
        headers: this.getAuthHeaders(),
        body: JSON.stringify({ currentPassword, newEmail, newPassword, confirmPassword })
      });
      const data = await response.json();
      if (data.success) {
        if (data.token) this.setAdminToken(data.token);
        if (data.admin && data.admin.email) this.setStoredAdminEmail(data.admin.email);
      }
      return data;
    } catch (e) {
      console.error('Update credentials error', e);
      return { success: false, message: 'Could not connect to server to update credentials.' };
    }
  },

  async getAdminProfile() {
    try {
      const response = await fetch(`${API_BASE}/api/admin/me`, {
        headers: this.getAuthHeaders()
      });
      if (response.ok) {
        const data = await response.json();
        if (data.success && data.admin) {
          this.setStoredAdminEmail(data.admin.email);
          return data.admin;
        }
      }
    } catch (e) {
      console.warn('Profile fetch error', e);
    }
    return { email: this.getStoredAdminEmail() };
  },

  logoutAdmin() {
    this.setAdminToken(null);
  },

  // Synchronous Getters (From Cache or localStorage fallback)
  getItems() {
    if (this._cache.items && Array.isArray(this._cache.items) && this._cache.items.length > 0) {
      return this._cache.items;
    }
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          this._cache.items = parsed;
          return parsed;
        }
      }
    } catch (e) {
      console.warn('Error reading stored items', e);
    }
    return [...DEFAULT_MENU_DATA];
  },

  setCachedItems(items) {
    if (Array.isArray(items)) {
      this._cache.items = items;
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
      } catch (e) {
        console.warn('Could not cache items locally', e);
      }
    }
  },

  // Cloud Database Fetching APIs
  async fetchMenu() {
    try {
      const response = await fetch(`${API_BASE}/api/menu`);
      if (response.ok) {
        const res = await response.json();
        if (res.success && Array.isArray(res.data)) {
          this.setCachedItems(res.data);
          return res.data;
        }
      }
    } catch (e) {
      console.warn('Could not fetch menu from MongoDB server, falling back to cache', e);
    }
    return this.getItems();
  },

  async addItem(itemData) {
    try {
      const response = await fetch(`${API_BASE}/api/menu`, {
        method: 'POST',
        headers: this.getAuthHeaders(),
        body: JSON.stringify(itemData)
      });
      const data = await response.json();
      if (data.success && data.data) {
        const current = this.getItems();
        current.push(data.data);
        this.setCachedItems(current);
        return data.data;
      }
      throw new Error(data.message || 'Failed to add item');
    } catch (e) {
      console.error('Error adding item to MongoDB', e);
      throw e;
    }
  },

  async updateItem(id, itemData) {
    try {
      const response = await fetch(`${API_BASE}/api/menu/${id}`, {
        method: 'PUT',
        headers: this.getAuthHeaders(),
        body: JSON.stringify(itemData)
      });
      const data = await response.json();
      if (data.success && data.data) {
        const current = this.getItems();
        const idx = current.findIndex(i => i.id === id);
        if (idx !== -1) current[idx] = data.data;
        this.setCachedItems(current);
        return data.data;
      }
      throw new Error(data.message || 'Failed to update item');
    } catch (e) {
      console.error('Error updating item in MongoDB', e);
      throw e;
    }
  },

  async changePrice(id, newPrice, discountPercent = null) {
    try {
      const body = { price: Number(newPrice) };
      if (discountPercent !== null) body.discountPercent = Number(discountPercent);

      const response = await fetch(`${API_BASE}/api/menu/${id}/price`, {
        method: 'PATCH',
        headers: this.getAuthHeaders(),
        body: JSON.stringify(body)
      });
      const data = await response.json();
      if (data.success && data.data) {
        const current = this.getItems();
        const idx = current.findIndex(i => i.id === id);
        if (idx !== -1) current[idx] = data.data;
        this.setCachedItems(current);
        return data.data;
      }
      throw new Error(data.message || 'Failed to change price');
    } catch (e) {
      console.error('Error updating price in MongoDB', e);
      throw e;
    }
  },

  async setDiscount(id, discountPercent) {
    return this.changePrice(id, undefined, discountPercent);
  },

  async deleteItem(id) {
    try {
      const response = await fetch(`${API_BASE}/api/menu/${id}`, {
        method: 'DELETE',
        headers: this.getAuthHeaders()
      });
      const data = await response.json();
      if (data.success) {
        const current = this.getItems().filter(i => i.id !== id);
        this.setCachedItems(current);
        return current;
      }
      throw new Error(data.message || 'Failed to delete item');
    } catch (e) {
      console.error('Error deleting item from MongoDB', e);
      throw e;
    }
  },

  async applyBulkDiscount(percent, scope) {
    try {
      const response = await fetch(`${API_BASE}/api/menu/discount`, {
        method: 'POST',
        headers: this.getAuthHeaders(),
        body: JSON.stringify({ percent, scope })
      });
      const data = await response.json();
      if (data.success && Array.isArray(data.data)) {
        this.setCachedItems(data.data);
        return data.data;
      }
      throw new Error(data.message || 'Failed to apply discount');
    } catch (e) {
      console.error('Error applying bulk discount', e);
      throw e;
    }
  },

  async resetDefaults() {
    try {
      const response = await fetch(`${API_BASE}/api/menu/reset`, {
        method: 'POST',
        headers: this.getAuthHeaders()
      });
      const data = await response.json();
      if (data.success && Array.isArray(data.data)) {
        this.setCachedItems(data.data);
        return data.data;
      }
    } catch (e) {
      console.error('Error resetting menu in MongoDB', e);
    }
    return [...DEFAULT_MENU_DATA];
  },

  // Footer Management
  getFooterData() {
    if (this._cache.footer) return this._cache.footer;
    try {
      const stored = localStorage.getItem(FOOTER_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        this._cache.footer = { ...DEFAULT_FOOTER_DATA, ...parsed };
        return this._cache.footer;
      }
    } catch(e) {}
    return { ...DEFAULT_FOOTER_DATA };
  },

  setCachedFooter(data) {
    this._cache.footer = { ...DEFAULT_FOOTER_DATA, ...data };
    try {
      localStorage.setItem(FOOTER_STORAGE_KEY, JSON.stringify(this._cache.footer));
    } catch(e) {}
  },

  async fetchFooter() {
    try {
      const res = await fetch(`${API_BASE}/api/footer`);
      if (res.ok) {
        const data = await res.json();
        if (data.success && data.data) {
          this.setCachedFooter(data.data);
          return this._cache.footer;
        }
      }
    } catch (e) {
      console.warn('Error fetching footer from MongoDB', e);
    }
    return this.getFooterData();
  },

  async saveFooterData(data) {
    this.setCachedFooter(data);
    try {
      const res = await fetch(`${API_BASE}/api/footer`, {
        method: 'POST',
        headers: this.getAuthHeaders(),
        body: JSON.stringify(data)
      });
      const result = await res.json();
      if (result.success && result.data) {
        this.setCachedFooter(result.data);
        return result.data;
      }
    } catch (e) {
      console.error('Error saving footer to MongoDB', e);
    }
    return data;
  },

  // Theme Management
  getThemeData() {
    if (this._cache.theme) return this._cache.theme;
    try {
      const stored = localStorage.getItem(THEME_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        this._cache.theme = { ...DEFAULT_THEME_DATA, ...parsed };
        return this._cache.theme;
      }
    } catch(e) {}
    return { ...DEFAULT_THEME_DATA };
  },

  setCachedTheme(data) {
    this._cache.theme = { ...DEFAULT_THEME_DATA, ...data };
    try {
      localStorage.setItem(THEME_STORAGE_KEY, JSON.stringify(this._cache.theme));
    } catch(e) {}
  },

  async fetchTheme() {
    try {
      const res = await fetch(`${API_BASE}/api/theme`);
      if (res.ok) {
        const data = await res.json();
        if (data.success && data.data) {
          this.setCachedTheme(data.data);
          return this._cache.theme;
        }
      }
    } catch (e) {
      console.warn('Error fetching theme from MongoDB', e);
    }
    return this.getThemeData();
  },

  async saveThemeData(data) {
    this.setCachedTheme(data);
    try {
      const res = await fetch(`${API_BASE}/api/theme`, {
        method: 'POST',
        headers: this.getAuthHeaders(),
        body: JSON.stringify(data)
      });
      const result = await res.json();
      if (result.success && result.data) {
        this.setCachedTheme(result.data);
        return result.data;
      }
    } catch (e) {
      console.error('Error saving theme to MongoDB', e);
    }
    return data;
  },

  async resetTheme() {
    try {
      const res = await fetch(`${API_BASE}/api/theme/reset`, {
        method: 'POST',
        headers: this.getAuthHeaders()
      });
      const result = await res.json();
      if (result.success && result.data) {
        this.setCachedTheme(result.data);
        return result.data;
      }
    } catch (e) {
      console.error('Error resetting theme in MongoDB', e);
    }
    this.setCachedTheme(DEFAULT_THEME_DATA);
    return { ...DEFAULT_THEME_DATA };
  }
};
