import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  User,
  UserRole,
  Product,
  CartItem,
  Order,
  OrderStatus,
  AppNotification,
  ActiveView,
  ProductCategory,
  ProductUnit,
  Review,
} from '../types';
import {
  INITIAL_USERS,
  INITIAL_PRODUCTS,
  INITIAL_ORDERS,
  INITIAL_NOTIFICATIONS,
} from '../data/mockData';

export interface ToastMessage {
  id: string;
  title: string;
  message?: string;
  type: 'success' | 'info' | 'warning' | 'error';
}

interface AppContextType {
  currentUser: User;
  users: User[];
  products: Product[];
  cart: CartItem[];
  orders: Order[];
  notifications: AppNotification[];
  activeView: ActiveView;
  selectedProduct: Product | null;
  selectedOrder: Order | null;
  searchQuery: string;
  selectedCategory: string;
  organicOnly: boolean;
  sortBy: string;
  isOffline: boolean;
  toasts: ToastMessage[];
  canInstallPwa: boolean;
  promptInstallPwa: () => void;
  requestNotificationPermission: () => Promise<boolean>;
  
  // Navigation & View Actions
  setActiveView: (view: ActiveView) => void;
  setSelectedProduct: (product: Product | null) => void;
  setSelectedOrder: (order: Order | null) => void;
  setSearchQuery: (query: string) => void;
  setSelectedCategory: (cat: string) => void;
  setOrganicOnly: (organic: boolean) => void;
  setSortBy: (sort: string) => void;

  // User Actions
  switchUserRole: (role: UserRole) => void;
  loginUser: (email: string, role: UserRole) => boolean;
  registerUser: (newUser: Partial<User>) => User;
  updateUserProfile: (updatedUser: Partial<User>) => void;
  adminToggleUserStatus: (userId: string) => void;

  // Product Actions (Farmer & Admin)
  addProduct: (productData: Omit<Product, 'id' | 'farmerId' | 'farmerName' | 'farmName' | 'farmLocation' | 'ratings' | 'avgRating' | 'reviewCount'>) => Product;
  updateProduct: (id: string, productData: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  adminToggleProductFlag: (id: string) => void;
  addReviewToProduct: (productId: string, rating: number, comment: string, orderId?: string) => void;

  // Cart Actions
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  updateCartQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  cartCount: number;
  cartSubtotal: number;
  cartTotal: number;
  cartSavings: number;

  // Order Actions
  placeOrder: (orderData: {
    deliveryAddress: { street: string; city: string; state: string; pincode: string; landmark?: string };
    deliverySlot: string;
    paymentMethod: 'cod' | 'upi' | 'card' | 'farm_pay';
    notes?: string;
  }) => Order;
  updateOrderStatus: (orderId: string, newStatus: OrderStatus, note?: string) => void;
  cancelOrder: (orderId: string) => void;

  // Notification Actions
  addNotification: (notif: Omit<AppNotification, 'id' | 'timestamp' | 'read'>) => void;
  markNotificationAsRead: (id: string) => void;
  clearAllNotifications: () => void;

  // Toast System
  showToast: (title: string, message?: string, type?: 'success' | 'info' | 'warning' | 'error') => void;
  removeToast: (id: string) => void;

  // Reset to Factory Demo State
  resetToDemoData: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const STORAGE_PREFIX = 'agridirect_pwa_';

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Load from localStorage or defaults
  const [users, setUsers] = useState<User[]>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_PREFIX}users`);
      return saved ? JSON.parse(saved) : INITIAL_USERS;
    } catch {
      return INITIAL_USERS;
    }
  });

  const [currentUser, setCurrentUser] = useState<User>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_PREFIX}currentUser`);
      if (saved) return JSON.parse(saved);
      // Default to Consumer for intuitive buyer experience
      return INITIAL_USERS.find((u) => u.role === 'consumer') || INITIAL_USERS[0];
    } catch {
      return INITIAL_USERS[0];
    }
  });

  const [products, setProducts] = useState<Product[]>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_PREFIX}products`);
      return saved ? JSON.parse(saved) : INITIAL_PRODUCTS;
    } catch {
      return INITIAL_PRODUCTS;
    }
  });

  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_PREFIX}cart`);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [orders, setOrders] = useState<Order[]>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_PREFIX}orders`);
      return saved ? JSON.parse(saved) : INITIAL_ORDERS;
    } catch {
      return INITIAL_ORDERS;
    }
  });

  const [notifications, setNotifications] = useState<AppNotification[]>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_PREFIX}notifications`);
      return saved ? JSON.parse(saved) : INITIAL_NOTIFICATIONS;
    } catch {
      return INITIAL_NOTIFICATIONS;
    }
  });

  const [activeView, setActiveView] = useState<ActiveView>('home');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [organicOnly, setOrganicOnly] = useState(false);
  const [sortBy, setSortBy] = useState<'freshness' | 'price_low' | 'price_high' | 'rating'>('freshness');

  // PWA & Network State
  const [isOffline, setIsOffline] = useState(!navigator.onLine);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [canInstallPwa, setCanInstallPwa] = useState(false);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Persist State Changes to LocalStorage
  useEffect(() => {
    try {
      localStorage.setItem(`${STORAGE_PREFIX}users`, JSON.stringify(users));
      localStorage.setItem(`${STORAGE_PREFIX}currentUser`, JSON.stringify(currentUser));
      localStorage.setItem(`${STORAGE_PREFIX}products`, JSON.stringify(products));
      localStorage.setItem(`${STORAGE_PREFIX}cart`, JSON.stringify(cart));
      localStorage.setItem(`${STORAGE_PREFIX}orders`, JSON.stringify(orders));
      localStorage.setItem(`${STORAGE_PREFIX}notifications`, JSON.stringify(notifications));
    } catch (err) {
      console.warn('LocalStorage save error:', err);
    }
  }, [users, currentUser, products, cart, orders, notifications]);

  // Network & PWA Install Listener
  useEffect(() => {
    const handleOnline = () => {
      setIsOffline(false);
      showToast('Back Online', 'Connected to real-time farm updates.', 'success');
    };
    const handleOffline = () => {
      setIsOffline(true);
      showToast('Offline Mode Active', 'Browsing cached farm produce.', 'warning');
    };

    const handleBeforeInstall = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setCanInstallPwa(true);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    window.addEventListener('beforeinstallprompt', handleBeforeInstall);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
    };
  }, []);

  // Toast System Helper
  const showToast = (title: string, message?: string, type: 'success' | 'info' | 'warning' | 'error' = 'success') => {
    const id = Date.now().toString() + Math.random().toString(36).substring(2, 5);
    setToasts((prev) => [...prev, { id, title, message, type }]);
    setTimeout(() => {
      removeToast(id);
    }, 4000);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // PWA Install Trigger
  const promptInstallPwa = async () => {
    if (!deferredPrompt) {
      showToast('PWA Installed or Ready', 'To install on iOS/Safari, tap Share then "Add to Home Screen". On desktop Chrome, click the install icon in address bar.', 'info');
      return;
    }
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      showToast('Installed Successfully', 'AgriDirect is now installed on your home screen.', 'success');
      setCanInstallPwa(false);
    }
    setDeferredPrompt(null);
  };

  // Push notification permission request
  const requestNotificationPermission = async (): Promise<boolean> => {
    if (!('Notification' in window)) {
      showToast('Notifications Not Supported', 'Your browser does not support web notifications.', 'warning');
      return false;
    }
    try {
      const permission = await Notification.requestPermission();
      if (permission === 'granted') {
        showToast('Push Alerts Enabled', 'You will receive instant alerts when your harvest order updates!', 'success');
        if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
          navigator.serviceWorker.controller.postMessage({ type: 'SUBSCRIBE_NOTIFICATIONS' });
        }
        return true;
      } else {
        showToast('Notifications Blocked', 'You can enable notifications anytime in browser settings.', 'info');
        return false;
      }
    } catch {
      return false;
    }
  };

  // User Switching & Auth
  const switchUserRole = (role: UserRole) => {
    const targetUser = users.find((u) => u.role === role);
    if (targetUser) {
      setCurrentUser(targetUser);
      showToast(`Switched to ${role.toUpperCase()} View`, `Active as: ${targetUser.name}`, 'info');
      if (role === 'farmer') {
        setActiveView('farmer-dashboard');
      } else if (role === 'admin') {
        setActiveView('admin-dashboard');
      } else {
        setActiveView('home');
      }
    }
  };

  const loginUser = (email: string, role: UserRole): boolean => {
    const user = users.find((u) => u.email.toLowerCase() === email.toLowerCase() && u.role === role);
    if (user) {
      if (user.status === 'suspended') {
        showToast('Account Suspended', 'Please contact support@agridirect.org', 'error');
        return false;
      }
      setCurrentUser(user);
      showToast('Welcome back!', `Signed in as ${user.name}`, 'success');
      if (role === 'farmer') setActiveView('farmer-dashboard');
      else if (role === 'admin') setActiveView('admin-dashboard');
      else setActiveView('home');
      return true;
    }
    showToast('Invalid Credentials', 'User not found. Try one of our demo accounts or register below.', 'error');
    return false;
  };

  const registerUser = (userData: Partial<User>): User => {
    const newId = `${userData.role || 'consumer'}-${Date.now()}`;
    const newUser: User = {
      id: newId,
      name: userData.name || 'New Member',
      email: userData.email || `user_${Date.now()}@agridirect.org`,
      role: userData.role || 'consumer',
      phone: userData.phone || '+1 (555) 000-0000',
      avatar: userData.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&auto=format&fit=crop&q=80',
      address: userData.address || {
        street: '123 Market Street',
        city: 'Greenfield',
        state: 'CA',
        pincode: '95616',
      },
      farmDetails: userData.role === 'farmer' ? userData.farmDetails || {
        farmName: userData.name ? `${userData.name}'s Farm` : 'Green Acres Farm',
        location: 'Local County, CA',
        district: 'Regional District',
        state: 'California',
        pincode: '95616',
        bio: 'Fresh, sustainably grown agricultural produce directly from our soil to your family table.',
        story: 'We are committed to transparent harvesting and clean farm-to-consumer delivery without middlemen markups.',
        sizeAcres: 12,
        organicCertified: true,
        certificationId: `CERT-${Math.floor(100000 + Math.random() * 900000)}`,
        rating: 5.0,
        totalOrders: 0,
        totalRevenue: 0,
        avatar: 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=200&auto=format&fit=crop&q=80',
        banner: 'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?w=1200&auto=format&fit=crop&q=80',
        sinceYear: new Date().getFullYear(),
        phone: userData.phone || '+1 (555) 000-0000',
        email: userData.email || '',
        cropsSpeciality: ['Vegetables', 'Fruits'],
        bankAccountVerified: true,
      } : undefined,
      createdAt: new Date().toISOString().split('T')[0],
      status: 'active',
    };

    setUsers((prev) => [newUser, ...prev]);
    setCurrentUser(newUser);
    showToast('Registration Complete!', `Welcome to AgriDirect, ${newUser.name}!`, 'success');
    if (newUser.role === 'farmer') setActiveView('farmer-dashboard');
    else setActiveView('home');
    return newUser;
  };

  const updateUserProfile = (updatedData: Partial<User>) => {
    setUsers((prev) =>
      prev.map((u) => {
        if (u.id === currentUser.id) {
          const merged = { ...u, ...updatedData };
          setCurrentUser(merged);
          return merged;
        }
        return u;
      })
    );
    showToast('Profile Updated', 'Your details have been saved.', 'success');
  };

  const adminToggleUserStatus = (userId: string) => {
    setUsers((prev) =>
      prev.map((u) => {
        if (u.id === userId) {
          const newStatus = u.status === 'active' ? 'suspended' : 'active';
          showToast(
            `User ${u.name} is now ${newStatus.toUpperCase()}`,
            newStatus === 'suspended' ? 'User access restricted' : 'User access restored',
            newStatus === 'active' ? 'success' : 'warning'
          );
          return { ...u, status: newStatus };
        }
        return u;
      })
    );
  };

  // Product Management
  const addProduct = (
    productData: Omit<Product, 'id' | 'farmerId' | 'farmerName' | 'farmName' | 'farmLocation' | 'ratings' | 'avgRating' | 'reviewCount'>
  ): Product => {
    const farm = currentUser.farmDetails;
    const newProduct: Product = {
      ...productData,
      id: `prod-${Date.now()}`,
      farmerId: currentUser.id,
      farmerName: currentUser.name,
      farmName: farm?.farmName || `${currentUser.name}'s Organic Farm`,
      farmLocation: farm?.location || 'Local Regional Farm',
      ratings: [],
      avgRating: 5.0,
      reviewCount: 0,
      featured: false,
      status: 'active',
    };

    setProducts((prev) => [newProduct, ...prev]);
    showToast('Crop Added to Market!', `${newProduct.title} is now visible to all consumers.`, 'success');
    
    // Add notification
    addNotification({
      userId: currentUser.id,
      title: '🌱 New Crop Listed',
      message: `${newProduct.title} ($${newProduct.price}/${newProduct.unit}) is live in the marketplace.`,
      type: 'stock',
      actionUrl: 'farmer-manage-products',
    });

    return newProduct;
  };

  const updateProduct = (id: string, productData: Partial<Product>) => {
    setProducts((prev) =>
      prev.map((p) => {
        if (p.id === id) {
          return { ...p, ...productData };
        }
        return p;
      })
    );
    showToast('Product Updated', 'Stock and pricing changes are live.', 'success');
  };

  const deleteProduct = (id: string) => {
    const target = products.find((p) => p.id === id);
    setProducts((prev) => prev.filter((p) => p.id !== id));
    setCart((prev) => prev.filter((item) => item.productId !== id));
    showToast('Product Removed', target ? `${target.title} deleted from marketplace.` : 'Product deleted.', 'info');
  };

  const adminToggleProductFlag = (id: string) => {
    setProducts((prev) =>
      prev.map((p) => {
        if (p.id === id) {
          const newStatus = p.status === 'flagged' ? 'active' : 'flagged';
          showToast(
            `Product ${p.title}`,
            newStatus === 'flagged' ? 'Flagged and hidden from consumer feed' : 'Approved and made visible',
            newStatus === 'active' ? 'success' : 'warning'
          );
          return { ...p, status: newStatus };
        }
        return p;
      })
    );
  };

  const addReviewToProduct = (productId: string, rating: number, comment: string, orderId?: string) => {
    const newReview: Review = {
      id: `rev-${Date.now()}`,
      orderId,
      userId: currentUser.id,
      userName: currentUser.name,
      userAvatar: currentUser.avatar,
      rating,
      comment,
      date: 'Just now',
      verifiedPurchase: true,
    };

    setProducts((prev) =>
      prev.map((p) => {
        if (p.id === productId) {
          const updatedRatings = [newReview, ...p.ratings];
          const sum = updatedRatings.reduce((acc, r) => acc + r.rating, 0);
          const avg = Number((sum / updatedRatings.length).toFixed(1));
          return {
            ...p,
            ratings: updatedRatings,
            avgRating: avg,
            reviewCount: updatedRatings.length,
          };
        }
        return p;
      })
    );

    // Update order reviewed status if orderId provided
    if (orderId) {
      setOrders((prev) =>
        prev.map((ord) => (ord.id === orderId ? { ...ord, reviewed: true } : ord))
      );
    }

    showToast('Review Submitted!', 'Thank you for supporting our local farmers with your verified feedback.', 'success');
  };

  // Cart Operations
  const addToCart = (product: Product, quantity = 1) => {
    if (product.stock <= 0) {
      showToast('Out of Stock', 'This harvest is currently sold out.', 'error');
      return;
    }

    setCart((prev) => {
      const existing = prev.find((item) => item.productId === product.id);
      if (existing) {
        const newQty = Math.min(existing.quantity + quantity, product.stock);
        showToast('Cart Updated', `Updated quantity to ${newQty} ${product.unit} of ${product.title}`, 'success');
        return prev.map((item) =>
          item.productId === product.id ? { ...item, quantity: newQty } : item
        );
      }
      showToast('Added to Cart 🧺', `${quantity} ${product.unit} of ${product.title}`, 'success');
      return [...prev, { productId: product.id, product, quantity, selectedUnit: product.unit }];
    });
  };

  const removeFromCart = (productId: string) => {
    setCart((prev) => prev.filter((item) => item.productId !== productId));
    showToast('Item Removed', 'Product removed from your basket.', 'info');
  };

  const updateCartQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart((prev) =>
      prev.map((item) => {
        if (item.productId === productId) {
          const maxQty = item.product.stock || 99;
          const finalQty = Math.min(quantity, maxQty);
          return { ...item, quantity: finalQty };
        }
        return item;
      })
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  const cartCount = cart.reduce((total, item) => total + item.quantity, 0);

  const cartSubtotal = Number(
    cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0).toFixed(2)
  );

  // Calculate bulk discount savings
  const cartSavings = Number(
    cart
      .reduce((sum, item) => {
        const threshold = item.product.bulkDiscountThreshold || 999;
        const discountPct = item.product.bulkDiscountPercent || 0;
        if (item.quantity >= threshold && discountPct > 0) {
          return sum + (item.product.price * item.quantity * discountPct) / 100;
        }
        return sum;
      }, 0)
      .toFixed(2)
  );

  const deliveryFee = cartSubtotal > 30 || cartSubtotal === 0 ? 0 : 2.5;
  const cartTotal = Number(Math.max(0, cartSubtotal - cartSavings + deliveryFee).toFixed(2));

  // Orders Operations
  const placeOrder = (orderData: {
    deliveryAddress: { street: string; city: string; state: string; pincode: string; landmark?: string };
    deliverySlot: string;
    paymentMethod: 'cod' | 'upi' | 'card' | 'farm_pay';
    notes?: string;
  }): Order => {
    const orderNum = `AGR-${Math.floor(1000 + Math.random() * 9000)}`;
    const newOrderId = `ord-${Date.now()}`;
    const otp = Math.floor(1000 + Math.random() * 9000).toString();

    const orderItems = cart.map((item) => ({
      productId: item.productId,
      productTitle: item.product.title,
      productImage: item.product.images[0] || 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=800&auto=format&fit=crop&q=80',
      farmerId: item.product.farmerId,
      farmerName: item.product.farmerName,
      farmName: item.product.farmName,
      quantity: item.quantity,
      unit: item.selectedUnit,
      pricePerUnit: item.product.price,
      totalPrice: Number((item.product.price * item.quantity).toFixed(2)),
    }));

    const newOrder: Order = {
      id: newOrderId,
      orderNumber: orderNum,
      consumerId: currentUser.id,
      consumerName: currentUser.name,
      consumerPhone: currentUser.phone || '+1 (555) 203-8891',
      consumerEmail: currentUser.email,
      deliveryAddress: orderData.deliveryAddress,
      deliverySlot: orderData.deliverySlot,
      items: orderItems,
      subtotal: cartSubtotal,
      deliveryFee,
      discount: cartSavings,
      total: cartTotal,
      paymentMethod: orderData.paymentMethod,
      paymentStatus: orderData.paymentMethod === 'cod' ? 'pending' : 'completed',
      status: 'pending',
      trackingHistory: [
        {
          status: 'pending',
          title: 'Order Placed Directly with Farmers',
          description: `Order transmitted to ${new Set(orderItems.map((i) => i.farmerName)).size} local farm(s).`,
          timestamp: 'Just now',
          completed: true,
          current: true,
        },
        {
          status: 'confirmed',
          title: 'Farmer Harvest Confirmation',
          description: 'Farmer inspects morning field availability and prepares crates.',
          timestamp: 'Expected within 30 mins',
          completed: false,
        },
        {
          status: 'harvesting',
          title: 'Fresh Field Harvesting & Eco-Packing',
          description: 'Picked at sunrise, washed in filtered spring water, and packaged.',
          timestamp: 'Scheduled for morning pick',
          completed: false,
        },
        {
          status: 'out_for_delivery',
          title: 'Dispatched in Temperature Van',
          description: 'Direct route from farm road to your address.',
          timestamp: 'On schedule',
          completed: false,
        },
        {
          status: 'delivered',
          title: 'Delivered Fresh to Doorstep',
          description: 'Verified with secure delivery PIN.',
          timestamp: 'Pending Delivery',
          completed: false,
        },
      ],
      createdAt: new Date().toISOString(),
      estimatedDelivery: 'Tomorrow Morning (7:00 - 10:00 AM)',
      deliveryOtp: otp,
      notes: orderData.notes,
      reviewed: false,
      driverName: 'Carlos Rivera (AgriDirect Express)',
      driverPhone: '+1 (555) 332-9011',
    };

    // Deduct stock from products
    setProducts((prev) =>
      prev.map((p) => {
        const matchedItem = cart.find((c) => c.productId === p.id);
        if (matchedItem) {
          const newStock = Math.max(0, p.stock - matchedItem.quantity);
          return { ...p, stock: newStock, status: newStock === 0 ? 'out_of_stock' : p.status };
        }
        return p;
      })
    );

    // Save order
    setOrders((prev) => [newOrder, ...prev]);

    // Send notifications to involved farmers
    const uniqueFarmersMap = new Map<string, string>();
    orderItems.forEach((i) => uniqueFarmersMap.set(i.farmerId, i.farmerName));
    uniqueFarmersMap.forEach((_farmerName, farmerId) => {
      addNotification({
        userId: farmerId,
        title: '🚜 New Harvest Order Received!',
        message: `Order #${orderNum} placed by ${currentUser.name}. Ready for confirmation.`,
        type: 'order',
        actionUrl: 'farmer-orders',
      });
    });

    // Notify consumer
    addNotification({
      userId: currentUser.id,
      title: '🌱 Order Placed Successfully!',
      message: `Order #${orderNum} confirmed. Your farmers have been notified to harvest your produce.`,
      type: 'order',
      actionUrl: 'orders',
    });

    // Clear cart & route
    clearCart();
    setSelectedOrder(newOrder);
    return newOrder;
  };

  const updateOrderStatus = (orderId: string, newStatus: OrderStatus, note?: string) => {
    setOrders((prev) =>
      prev.map((ord) => {
        if (ord.id === orderId) {
          const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
          const statusMap: Record<OrderStatus, { title: string; desc: string }> = {
            pending: { title: 'Order Placed', desc: 'Order received by farm team.' },
            confirmed: { title: 'Farmer Confirmed Harvest', desc: 'Farmer confirmed field harvest schedule.' },
            harvesting: { title: 'Harvested & Packed', desc: 'Fresh produce harvested and boxed in eco-crates.' },
            out_for_delivery: { title: 'Out for Direct Delivery', desc: 'Driver dispatched to customer doorstep.' },
            delivered: { title: 'Delivered to Doorstep', desc: 'Delivered successfully. Thank you for supporting local growers!' },
            cancelled: { title: 'Order Cancelled', desc: note || 'Order was cancelled.' },
          };

          const updatedHistory = ord.trackingHistory.map((step) => {
            if (step.status === newStatus) {
              return {
                ...step,
                completed: true,
                current: true,
                timestamp: `Today, ${timeStr}`,
                description: note || step.description,
              };
            }
            if (
              (newStatus === 'delivered' && step.status !== 'cancelled') ||
              (newStatus === 'out_for_delivery' && (step.status === 'pending' || step.status === 'confirmed' || step.status === 'harvesting')) ||
              (newStatus === 'harvesting' && (step.status === 'pending' || step.status === 'confirmed')) ||
              (newStatus === 'confirmed' && step.status === 'pending')
            ) {
              return { ...step, completed: true, current: false };
            }
            return { ...step, current: false };
          });

          // Notification to consumer
          addNotification({
            userId: ord.consumerId,
            title: `📦 Order #${ord.orderNumber} Status: ${newStatus.replace(/_/g, ' ').toUpperCase()}`,
            message: statusMap[newStatus].desc,
            type: 'order',
            actionUrl: 'order-tracking',
          });

          showToast(
            `Order #${ord.orderNumber} Updated`,
            `Status changed to: ${newStatus.replace(/_/g, ' ')}`,
            'success'
          );

          const updatedOrder = {
            ...ord,
            status: newStatus,
            paymentStatus: newStatus === 'delivered' ? ('completed' as const) : ord.paymentStatus,
            trackingHistory: updatedHistory,
          };

          if (selectedOrder?.id === orderId) {
            setSelectedOrder(updatedOrder);
          }

          return updatedOrder;
        }
        return ord;
      })
    );
  };

  const cancelOrder = (orderId: string) => {
    updateOrderStatus(orderId, 'cancelled', 'Cancelled upon request.');
    showToast('Order Cancelled', 'The order has been cancelled.', 'info');
  };

  // Notification Operations
  const addNotification = (notif: Omit<AppNotification, 'id' | 'timestamp' | 'read'>) => {
    const newNotif: AppNotification = {
      ...notif,
      id: `notif-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      timestamp: 'Just now',
      read: false,
    };
    setNotifications((prev) => [newNotif, ...prev]);

    // If browser supports web notification, send system push
    if ('Notification' in window && Notification.permission === 'granted') {
      try {
        new Notification(newNotif.title, {
          body: newNotif.message,
          icon: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=192&auto=format&fit=crop&q=80',
        });
      } catch {
        // Fallback for sandboxed frames
      }
    }
  };

  const markNotificationAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const clearAllNotifications = () => {
    setNotifications([]);
    showToast('Notifications Cleared', undefined, 'info');
  };

  // Reset to default
  const resetToDemoData = () => {
    localStorage.clear();
    setUsers(INITIAL_USERS);
    setCurrentUser(INITIAL_USERS.find((u) => u.role === 'consumer') || INITIAL_USERS[0]);
    setProducts(INITIAL_PRODUCTS);
    setCart([]);
    setOrders(INITIAL_ORDERS);
    setNotifications(INITIAL_NOTIFICATIONS);
    setActiveView('home');
    showToast('Demo Data Reset', 'Marketplace restored to fresh harvest seed state.', 'success');
  };

  return (
    <AppContext.Provider
      value={{
        currentUser,
        users,
        products,
        cart,
        orders,
        notifications,
        activeView,
        selectedProduct,
        selectedOrder,
        searchQuery,
        selectedCategory,
        organicOnly,
        sortBy,
        isOffline,
        toasts,
        canInstallPwa,
        promptInstallPwa,
        requestNotificationPermission,
        setActiveView,
        setSelectedProduct,
        setSelectedOrder,
        setSearchQuery,
        setSelectedCategory,
        setOrganicOnly,
        setSortBy,
        switchUserRole,
        loginUser,
        registerUser,
        updateUserProfile,
        adminToggleUserStatus,
        addProduct,
        updateProduct,
        deleteProduct,
        adminToggleProductFlag,
        addReviewToProduct,
        addToCart,
        removeFromCart,
        updateCartQuantity,
        clearCart,
        cartCount,
        cartSubtotal,
        cartTotal,
        cartSavings,
        placeOrder,
        updateOrderStatus,
        cancelOrder,
        addNotification,
        markNotificationAsRead,
        clearAllNotifications,
        showToast,
        removeToast,
        resetToDemoData,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
