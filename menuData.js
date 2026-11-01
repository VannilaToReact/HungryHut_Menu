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
 * Menu Service for CRUD & Persistence
 */
const MenuService = {
  getItems() {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch (e) {
      console.warn("Storage error, fallback to defaults", e);
    }
    return [...DEFAULT_MENU_DATA];
  },

  saveItems(items) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch (e) {
      console.error("Storage error saving items", e);
    }
  },

  addItem(itemData) {
    const items = this.getItems();
    const discount = Number(itemData.discountPercent) || 0;
    const newItem = {
      id: "item-" + Date.now(),
      name: itemData.name.trim(),
      teluguName: (itemData.teluguName || "").trim(),
      category: itemData.category.trim(),
      price: Number(itemData.price) || 0,
      discountPercent: discount,
      type: itemData.type || "veg",
      image: itemData.image || "images/kaju-biryani.jpg",
      description: (itemData.description || "").trim(),
      page: itemData.page || (itemData.category.includes('Starters') || itemData.category.includes('Curry') ? 2 : 1)
    };
    items.push(newItem);
    this.saveItems(items);
    return newItem;
  },

  updateItem(id, itemData) {
    const items = this.getItems();
    const index = items.findIndex(i => i.id === id);
    if (index !== -1) {
      items[index] = {
        ...items[index],
        name: itemData.name.trim(),
        teluguName: (itemData.teluguName || "").trim(),
        category: itemData.category.trim(),
        price: Number(itemData.price) || 0,
        discountPercent: Number(itemData.discountPercent) || 0,
        type: itemData.type || "veg",
        image: itemData.image || items[index].image,
        description: (itemData.description || "").trim()
      };
      this.saveItems(items);
      return items[index];
    }
    return null;
  },

  changePrice(id, newPrice, discountPercent = null) {
    const items = this.getItems();
    const item = items.find(i => i.id === id);
    if (item) {
      item.price = Number(newPrice);
      if (discountPercent !== null) {
        item.discountPercent = Number(discountPercent);
      }
      this.saveItems(items);
      return item;
    }
    return null;
  },

  setDiscount(id, discountPercent) {
    const items = this.getItems();
    const item = items.find(i => i.id === id);
    if (item) {
      item.discountPercent = Math.max(0, Math.min(100, Number(discountPercent)));
      this.saveItems(items);
      return item;
    }
    return null;
  },

  deleteItem(id) {
    const items = this.getItems();
    const filtered = items.filter(i => i.id !== id);
    this.saveItems(filtered);
    return filtered;
  },

  resetDefaults() {
    localStorage.removeItem(STORAGE_KEY);
    return [...DEFAULT_MENU_DATA];
  },

  // Footer Management
  getFooterData() {
    try {
      const stored = localStorage.getItem(FOOTER_STORAGE_KEY);
      if (stored) return { ...DEFAULT_FOOTER_DATA, ...JSON.parse(stored) };
    } catch(e) {
      console.warn("Could not read footer data from storage", e);
    }
    return { ...DEFAULT_FOOTER_DATA };
  },

  saveFooterData(data) {
    try {
      localStorage.setItem(FOOTER_STORAGE_KEY, JSON.stringify(data));
    } catch(e) {
      console.error("Could not save footer data", e);
    }
  },

  // Theme Management
  getThemeData() {
    try {
      const stored = localStorage.getItem(THEME_STORAGE_KEY);
      if (stored) return { ...DEFAULT_THEME_DATA, ...JSON.parse(stored) };
    } catch(e) {
      console.warn("Could not read theme data from storage", e);
    }
    return { ...DEFAULT_THEME_DATA };
  },

  saveThemeData(data) {
    try {
      localStorage.setItem(THEME_STORAGE_KEY, JSON.stringify(data));
    } catch(e) {
      console.error("Could not save theme data", e);
    }
  },

  resetTheme() {
    localStorage.removeItem(THEME_STORAGE_KEY);
    return { ...DEFAULT_THEME_DATA };
  },

  // Auth Helpers
  isAdminLoggedIn() {
    return sessionStorage.getItem(AUTH_KEY) === "true";
  },

  setAdminLoggedIn(status) {
    if (status) {
      sessionStorage.setItem(AUTH_KEY, "true");
    } else {
      sessionStorage.removeItem(AUTH_KEY);
    }
  }
};
