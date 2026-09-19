export type UserRole = 'farmer' | 'consumer' | 'admin';

export interface FarmDetails {
  farmName: string;
  location: string;
  district: string;
  state: string;
  pincode: string;
  bio: string;
  story: string;
  sizeAcres: number;
  organicCertified: boolean;
  certificationId?: string;
  rating: number;
  totalOrders: number;
  totalRevenue: number;
  avatar: string;
  banner: string;
  sinceYear: number;
  phone: string;
  email: string;
  cropsSpeciality: string[];
  bankAccountVerified: boolean;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  phone: string;
  avatar: string;
  address?: {
    street: string;
    city: string;
    state: string;
    pincode: string;
    landmark?: string;
  };
  farmDetails?: FarmDetails;
  createdAt: string;
  status: 'active' | 'suspended';
}

export type ProductCategory =
  | 'Vegetables'
  | 'Fruits'
  | 'Grains & Pulses'
  | 'Dairy & Honey'
  | 'Herbs & Spices';

export type ProductUnit = 'kg' | 'g' | 'bunch' | 'dozen' | 'liter' | 'box' | 'pack';

export interface Review {
  id: string;
  orderId?: string;
  userId: string;
  userName: string;
  userAvatar: string;
  rating: number;
  comment: string;
  date: string;
  verifiedPurchase: boolean;
  farmerReply?: string;
}

export interface Product {
  id: string;
  farmerId: string;
  farmerName: string;
  farmName: string;
  farmLocation: string;
  title: string;
  category: ProductCategory;
  price: number;
  unit: ProductUnit;
  stock: number;
  harvestDate: string;
  freshnessScore: number; // e.g. 98%
  isOrganic: boolean;
  certificationNumber?: string;
  description: string;
  images: string[];
  ratings: Review[];
  avgRating: number;
  reviewCount: number;
  minOrderQty: number;
  bulkDiscountThreshold?: number;
  bulkDiscountPercent?: number;
  shelfLifeDays: number;
  storageTip?: string;
  featured?: boolean;
  status: 'active' | 'out_of_stock' | 'flagged' | 'hidden';
}

export interface CartItem {
  productId: string;
  product: Product;
  quantity: number;
  selectedUnit: ProductUnit;
}

export type OrderStatus =
  | 'pending'
  | 'confirmed'
  | 'harvesting'
  | 'out_for_delivery'
  | 'delivered'
  | 'cancelled';

export type PaymentMethod = 'cod' | 'upi' | 'card' | 'farm_pay';
export type PaymentStatus = 'pending' | 'completed' | 'failed';

export interface TrackingStep {
  status: OrderStatus;
  title: string;
  description: string;
  timestamp: string;
  completed: boolean;
  current?: boolean;
}

export interface OrderItem {
  productId: string;
  productTitle: string;
  productImage: string;
  farmerId: string;
  farmerName: string;
  farmName: string;
  quantity: number;
  unit: ProductUnit;
  pricePerUnit: number;
  totalPrice: number;
}

export interface Order {
  id: string;
  orderNumber: string;
  consumerId: string;
  consumerName: string;
  consumerPhone: string;
  consumerEmail: string;
  deliveryAddress: {
    street: string;
    city: string;
    state: string;
    pincode: string;
    landmark?: string;
  };
  deliverySlot: string;
  items: OrderItem[];
  subtotal: number;
  deliveryFee: number;
  discount: number;
  total: number;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  status: OrderStatus;
  trackingHistory: TrackingStep[];
  createdAt: string;
  estimatedDelivery: string;
  deliveryOtp: string;
  notes?: string;
  reviewed?: boolean;
  driverName?: string;
  driverPhone?: string;
}

export interface AppNotification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'order' | 'stock' | 'system' | 'payout' | 'promotion';
  read: boolean;
  timestamp: string;
  actionUrl?: string;
}

export type ActiveView =
  | 'home'
  | 'products'
  | 'product-details'
  | 'cart'
  | 'checkout'
  | 'orders'
  | 'order-tracking'
  | 'farmer-dashboard'
  | 'farmer-add-product'
  | 'farmer-manage-products'
  | 'farmer-orders'
  | 'farmer-profile'
  | 'admin-dashboard'
  | 'profile'
  | 'about'
  | 'contact'
  | 'login'
  | 'register';
