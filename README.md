# 🍽️ Hungry Hut - Digital Restaurant Menu & Real-Time Cloud Admin Portal

An authentic, enterprise-grade restaurant digital menu system for **Hungry Hut Restaurant & Cafe**, powered by **Node.js, Express, MongoDB Atlas, and Socket.IO** for instantaneous multi-device data synchronization.

---

## ✨ Key Features & Improvements

1. **MongoDB Atlas Cloud Database Integration**
   - Cloud database: `healthcart` cluster.
   - Preserves all 40 authentic dishes, Telugu script translations, categories, dietary types, pricing, and custom images.
   - Robust Mongoose models: `MenuItem`, `Theme`, `Footer`, and `Admin`.
   - Automatic database seeding with duplicate prevention.
   - Data persists reliably across all devices, browser refreshes, and server restarts.

2. **Global Real-Time Multi-Device Synchronization (Socket.IO)**
   - When an administrator modifies prices, applies discounts, adds dishes, deletes items, changes the theme, or updates footer information on **Device A**:
   - The changes are saved to MongoDB Atlas and **immediately broadcast via WebSockets to Device B, Device C, and all connected customer phones** without requiring manual browser refresh!
   - Pulsing **"Live Cloud Sync"** visual indicator in the header.
   - Automatic reconnection and fresh cloud data fetching on tab focus.

3. **Secure Admin Authentication & Account Management**
   - **Password Change**: Authenticated admin can change their password. Requires current password verification using `bcryptjs`. Hashes new password with bcrypt salt before storing.
   - **Email Change**: Admin can change their registered email with current password verification. Validates email format and ensures uniqueness in MongoDB.
   - **Protected Endpoints**: Admin APIs are guarded by JWT (JSON Web Token) bearer authentication middleware.
   - **Brute-Force Rate Limiting**: Max 10 login attempts per 15 minutes to block malicious attacks.
   - Interactive eye icon to show/hide passwords safely.

4. **Mobile-First Application Look**
   - Specially optimized for mobile devices (Android, iOS) to deliver a native mobile application look.
   - Compact Mobile App Bar header (reduced logo to 48px, optimized typography, zero wasted vertical space).
   - **Sticky Category Filter Pills**: Horizontal smooth-scrolling chip bar (`All Dishes`, `Veg Biryani`, `Non-Veg Biryani`, `Fried Rice`, `Veg Starters`, `Veg Curries`, `Non-Veg Starters`) for fast one-tap navigation.
   - **Mobile Bottom Navigation Bar**: Floating thumb-accessible bar with `Call Us`, `Categories`, `Visit Us`, and `Admin` controls.
   - Ergonomic touch targets (min 44px) and zero horizontal overflow.
   - Bottom-sheet modal dialogs on smaller screens.

5. **60+ Color Theme Customizer & Live Footer Editor**
   - 60 curated culinary color presets + custom HTML5 color picker.
   - 16 curated background tones.
   - Live restaurant footer editor (Title, tagline, timings, phone numbers, address).
   - In-app admin confirmation dialogs before making destructive changes.

6. **Environment Variables & Git Security**
   - Sensitive database connection strings and JWT secrets are stored exclusively in `.env`.
   - `.env` is tracked in `.gitignore` and untracked from Git tracking (`git rm --cached .env`).
   - `.env.example` provided for safe deployment on cloud platforms (Render, Railway, Vercel, Heroku, etc.).

---

## 📁 Architecture & File Structure

```
HungryHut/
├── config/
│   └── db.js                 # MongoDB Atlas connection handler
├── models/
│   ├── Admin.js              # Admin schema with bcrypt password hashing
│   ├── Footer.js             # Restaurant footer brand schema
│   ├── MenuItem.js           # Dish schema with Telugu & English names
│   └── Theme.js              # Theme customizer schema
├── routes/
│   ├── adminRoutes.js        # Admin login, password & email change APIs
│   ├── footerRoutes.js       # Footer REST endpoints
│   ├── menuRoutes.js         # Menu CRUD & bulk discount endpoints
│   └── themeRoutes.js        # Color theme endpoints
├── middleware/
│   └── auth.js               # JWT Bearer token authentication middleware
├── seed/
│   └── seedData.js           # 40 authentic dishes, theme & admin seeder
├── images/                   # High-resolution dish photography
├── .env                      # Local environment secrets (IGNORED by Git)
├── .env.example              # Template environment variables
├── .gitignore                # Git ignore configuration
├── app.js                    # Client application controller & Socket.IO client
├── index.html                # Authentic restaurant menu layout & modals
├── menuData.js               # MenuService API connector with in-memory caching
├── package.json              # Backend dependencies & npm scripts
├── server.js                 # Node.js + Express + Socket.IO server
└── style.css                 # Restaurant styling & mobile-first responsive design
```

---

## ⚙️ Environment Variables

Create a `.env` file in the project root:

```env
MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.pawcgi2.mongodb.net/healthcart?appName=Cluster0
PORT=5000
NODE_ENV=development
CLIENT_URL=http://localhost:5000
JWT_SECRET=hungryhut_super_secure_jwt_secret_key_2026_db92a17f
ADMIN_EMAIL=admin@hungryhut.com
ADMIN_PASSWORD=@admin(hungryhut)
```

> **Note**: In production hosting (Render, Railway, Heroku), enter these environment variables into your provider's Environment Variables dashboard. Do not commit `.env` to GitHub.

---

## 🚀 How to Run Locally

1. **Install Dependencies**:
   ```bash
   npm install
   ```

2. **Start the Server**:
   ```bash
   npm start
   ```

3. **Open the Application**:
   Navigate to [http://localhost:5000](http://localhost:5000) in your browser.
   - Click the **Hungry Hut Chef Logo** or the bottom **Admin** tab to open the Admin Portal.
   - Log in using your admin credentials.
   - Any change made by the admin updates MongoDB and instantly reflects on every connected phone or computer!

---

## 🌐 Production Deployment Guide

### Deploying Backend to Render / Railway / Heroku

1. Push the repository to GitHub:
   ```bash
   git add .
   git commit -m "feat: MongoDB Atlas integration, real-time Socket.IO sync and mobile app optimization"
   git push origin main
   ```
2. In your cloud provider dashboard:
   - Create a new **Web Service** and link your GitHub repository.
   - Set **Build Command**: `npm install`
   - Set **Start Command**: `npm start`
   - Add the following **Environment Variables**:
     - `MONGODB_URI`: your MongoDB Atlas connection string
     - `JWT_SECRET`: your secret key
     - `NODE_ENV`: `production`
     - `ADMIN_EMAIL`: `admin@hungryhut.com`
     - `ADMIN_PASSWORD`: your initial admin password
3. Your app is live with real-time multi-device cloud synchronization!
