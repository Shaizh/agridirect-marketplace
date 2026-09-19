# 🌾 AgriDirect Marketplace

AgriDirect is a modern digital agricultural marketplace designed to connect farmers and customers through a simple, accessible, and user-friendly platform.

The application allows users to explore agricultural products, view product details, add products to a cart, place orders, track orders, and manage their profiles. Farmers can manage their products and view marketplace activity through a dedicated dashboard.

It also includes an AI-powered agricultural assistant to provide intelligent assistance within the application.

---

## 🚀 Features

### 🛒 Marketplace

- Browse agricultural products
- View detailed product information
- Product categories and listings
- Add products to cart
- Manage cart items
- Checkout and order creation
- Responsive marketplace interface

### 👨‍🌾 Farmer Dashboard

- Dedicated farmer interface
- Manage agricultural products
- View marketplace activity
- Manage farmer-related information
- Farmer-focused dashboard experience

### 🤖 AgriAssist AI

- AI-powered agricultural assistant
- Interactive AI assistance
- Farmer-focused support
- Google Gemini API integration

### 📦 Orders

- View placed orders
- Order history
- Order details
- Order tracking interface
- Order status management

### 👤 User Profile

- User profile management
- Account information
- User-specific application experience

### 🛡️ Admin Dashboard

- Administrative dashboard
- Marketplace management interface
- Overview of application activity

### 📱 Progressive Web App

AgriDirect includes PWA functionality for an app-like experience on supported devices.

- Web app manifest
- Service worker
- PWA installation support
- Mobile-friendly interface

### 🎨 User Experience

- Responsive design
- Modern agricultural marketplace interface
- Mobile-friendly navigation
- Reusable React components
- Animated interactions
- Toast notifications
- Clean and simple UI

---

## 🏗️ Application Structure

```text
agridirect-marketplace/
│
├── public/
│   ├── manifest.json
│   └── sw.js
│
├── src/
│   ├── components/
│   │   ├── AgriAssistModal.tsx
│   │   ├── Footer.tsx
│   │   ├── MobileBottomNav.tsx
│   │   ├── Navbar.tsx
│   │   ├── PWAInstallBanner.tsx
│   │   ├── ProductCard.tsx
│   │   └── ToastContainer.tsx
│   │
│   ├── context/
│   │   └── AppContext.tsx
│   │
│   ├── data/
│   │   └── mockData.ts
│   │
│   ├── views/
│   │   ├── AdminDashboardView.tsx
│   │   ├── CartView.tsx
│   │   ├── CheckoutView.tsx
│   │   ├── FarmerDashboardView.tsx
│   │   ├── HomeView.tsx
│   │   ├── OrderTrackingView.tsx
│   │   ├── OrdersView.tsx
│   │   ├── ProductDetailsView.tsx
│   │   ├── ProductsView.tsx
│   │   └── UserProfileView.tsx
│   │
│   ├── types.ts
│   └── App.tsx
│
├── index.html
├── package.json
├── tsconfig.json
├── vite.config.ts
└── README.md