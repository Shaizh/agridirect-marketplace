import React, { useState, useRef, useEffect } from 'react';
import {
  Sprout,
  ShoppingBag,
  Search,
  Bell,
  User as UserIcon,
  ChevronDown,
  ShieldCheck,
  Tractor,
  Store,
  MapPin,
  Clock,
  LogOut,
  Check,
  Sparkles,
  Menu,
  X,
  Package,
  PlusCircle,
  BarChart3,
  SlidersHorizontal,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { UserRole, ActiveView } from '../types';

interface NavbarProps {
  onOpenAiAssist: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenAiAssist }) => {
  const {
    currentUser,
    users,
    cartCount,
    cartTotal,
    notifications,
    markNotificationAsRead,
    clearAllNotifications,
    activeView,
    setActiveView,
    searchQuery,
    setSearchQuery,
    switchUserRole,
    resetToDemoData,
  } = useApp();

  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [roleSwitcherOpen, setRoleSwitcherOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const notifRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);
  const roleRef = useRef<HTMLDivElement>(null);

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setNotificationsOpen(false);
      }
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setProfileOpen(false);
      }
      if (roleRef.current && !roleRef.current.contains(e.target as Node)) {
        setRoleSwitcherOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const unreadNotifs = notifications.filter((n) => !n.read);

  const handleNavClick = (view: ActiveView) => {
    setActiveView(view);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs">
      {/* Top Utility Bar */}
      <div className="bg-[#2F4834] text-[#E6E8E2] text-xs py-1.5 px-4 hidden md:block border-b border-[#3A5A40]">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5 text-[#A3B18A] font-medium">
              <MapPin className="w-3.5 h-3.5 text-[#A3B18A]" />
              <span>Delivering Farm-Fresh To: Metro County & Suburbs</span>
            </span>
            <span className="text-[#588157]">•</span>
            <span className="flex items-center gap-1 text-[#DAD7CD]">
              <Clock className="w-3.5 h-3.5 text-[#A3B18A]" />
              <span>Next Morning Harvest: Orders close at 9:00 PM</span>
            </span>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={onOpenAiAssist}
              className="flex items-center gap-1.5 text-amber-300 hover:text-amber-200 font-semibold transition-colors"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
              <span>AgriAssist AI Hub</span>
            </button>
            <span className="text-[#588157]">•</span>
            <button
              onClick={resetToDemoData}
              className="text-[#A3B18A] hover:text-white transition-colors"
              title="Reset data to initial fresh state"
            >
              Reset Seed Data
            </button>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20 gap-3 sm:gap-6">
          {/* Logo & Brand */}
          <div className="flex items-center gap-3">
            <button
              id="brand-logo"
              onClick={() => handleNavClick('home')}
              className="flex items-center gap-2.5 text-left group"
            >
              <div className="w-10 h-10 rounded-2xl bg-[#3A5A40] flex items-center justify-center text-white shadow-md shadow-[#3A5A40]/25 group-hover:scale-105 transition-transform">
                <Sprout className="w-6 h-6 text-[#DAD7CD]" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-xl font-bold tracking-tight text-slate-900 font-display">AgriDirect</span>
                  <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-[#A3B18A]/25 text-[#2F4834] border border-[#A3B18A]/40">
                    Bento
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 font-medium hidden sm:block">Direct Farm to Table</p>
              </div>
            </button>
          </div>

          {/* Search Bar - Desktop */}
          <div className="hidden lg:flex flex-1 max-w-md mx-4">
            <div className="relative w-full">
              <input
                id="search-input-desktop"
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  if (activeView !== 'products' && activeView !== 'home') {
                    setActiveView('products');
                  }
                }}
                placeholder="Search fresh tomatoes, apples, rice, honey..."
                className="w-full pl-10 pr-4 py-2 text-xs sm:text-sm bg-[#F7F7F2] hover:bg-[#F0F2EA] focus:bg-white border border-[#E6E8E2] focus:border-[#3A5A40] rounded-full outline-none transition-all placeholder:text-slate-400"
              />
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600 bg-slate-200 rounded-full w-4 h-4 flex items-center justify-center"
                >
                  ×
                </button>
              )}
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1 lg:gap-2">
            <button
              id="nav-home"
              onClick={() => handleNavClick('home')}
              className={`px-3.5 py-2 rounded-full text-xs sm:text-sm font-semibold transition-all ${
                activeView === 'home'
                  ? 'text-[#2F4834] bg-[#A3B18A]/20 font-bold border border-[#A3B18A]/40'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-[#F7F7F2]'
              }`}
            >
              Marketplace
            </button>

            <button
              id="nav-products"
              onClick={() => handleNavClick('products')}
              className={`px-3.5 py-2 rounded-full text-xs sm:text-sm font-semibold transition-all ${
                activeView === 'products'
                  ? 'text-[#2F4834] bg-[#A3B18A]/20 font-bold border border-[#A3B18A]/40'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-[#F7F7F2]'
              }`}
            >
              All Harvests
            </button>

            {currentUser.role === 'farmer' && (
              <button
                id="nav-farmer-portal"
                onClick={() => handleNavClick('farmer-dashboard')}
                className={`px-3.5 py-2 rounded-full text-xs sm:text-sm font-semibold transition-all flex items-center gap-1.5 ${
                  activeView.startsWith('farmer-')
                    ? 'text-[#2F4834] bg-[#A3B18A]/20 font-bold border border-[#A3B18A]/40'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-[#F7F7F2]'
                }`}
              >
                <Tractor className="w-4 h-4 text-[#3A5A40]" />
                <span>Farmer Hub</span>
              </button>
            )}

            {currentUser.role === 'admin' && (
              <button
                id="nav-admin-portal"
                onClick={() => handleNavClick('admin-dashboard')}
                className={`px-3.5 py-2 rounded-full text-xs sm:text-sm font-semibold transition-all flex items-center gap-1.5 ${
                  activeView === 'admin-dashboard'
                    ? 'text-purple-800 bg-purple-100 font-bold border border-purple-200'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-[#F7F7F2]'
                }`}
              >
                <ShieldCheck className="w-4 h-4 text-purple-600" />
                <span>Admin Hub</span>
              </button>
            )}

            <button
              id="nav-orders"
              onClick={() => handleNavClick('orders')}
              className={`px-3.5 py-2 rounded-full text-xs sm:text-sm font-semibold transition-all ${
                activeView === 'orders' || activeView === 'order-tracking'
                  ? 'text-[#2F4834] bg-[#A3B18A]/20 font-bold border border-[#A3B18A]/40'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-[#F7F7F2]'
              }`}
            >
              My Orders
            </button>
          </nav>

          {/* Right Action Icons & Controls */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Quick Role Switcher Pill */}
            <div className="relative" ref={roleRef}>
              <button
                id="role-switcher-btn"
                onClick={() => setRoleSwitcherOpen(!roleSwitcherOpen)}
                className="flex items-center gap-1.5 px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-full border border-[#E6E8E2] bg-[#F7F7F2] hover:bg-[#F0F2EA] text-xs font-bold text-slate-800 transition-all shadow-2xs"
                title="Switch role instantly to test Farmer, Consumer, or Admin views"
              >
                <span className="w-2 h-2 rounded-full bg-[#3A5A40]"></span>
                <span className="capitalize">{currentUser.role} Mode</span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-500" />
              </button>

              {roleSwitcherOpen && (
                <div className="absolute right-0 mt-2 w-64 bg-white rounded-3xl shadow-xl border border-[#E6E8E2] py-2 z-50 animate-in fade-in zoom-in-95">
                  <div className="px-4 py-2 border-b border-slate-100">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Demo Persona Switcher</p>
                    <p className="text-xs text-slate-500 mt-0.5">Switch view to test different personas:</p>
                  </div>

                  <div className="p-1.5 space-y-1">
                    <button
                      id="switch-consumer-mode"
                      onClick={() => {
                        switchUserRole('consumer');
                        setRoleSwitcherOpen(false);
                      }}
                      className={`w-full text-left px-3 py-2.5 rounded-2xl flex items-center justify-between text-xs font-medium transition-colors ${
                        currentUser.role === 'consumer'
                          ? 'bg-[#EBF0E6] text-[#2F4834] font-bold border border-[#D5DEC9]'
                          : 'hover:bg-slate-50 text-slate-700'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <Store className="w-4 h-4 text-[#3A5A40]" />
                        <div>
                          <p className="font-semibold">🛒 Consumer (Priya)</p>
                          <p className="text-[10px] text-slate-500">Browse, Cart, Order, Live Tracking</p>
                        </div>
                      </div>
                      {currentUser.role === 'consumer' && <Check className="w-4 h-4 text-[#3A5A40]" />}
                    </button>

                    <button
                      id="switch-farmer-mode"
                      onClick={() => {
                        switchUserRole('farmer');
                        setRoleSwitcherOpen(false);
                      }}
                      className={`w-full text-left px-3 py-2.5 rounded-2xl flex items-center justify-between text-xs font-medium transition-colors ${
                        currentUser.role === 'farmer'
                          ? 'bg-[#EBF0E6] text-[#2F4834] font-bold border border-[#D5DEC9]'
                          : 'hover:bg-slate-50 text-slate-700'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <Tractor className="w-4 h-4 text-amber-700" />
                        <div>
                          <p className="font-semibold">👨🌾 Farmer (Ramesh Patel)</p>
                          <p className="text-[10px] text-slate-500">Manage Stock, Add Crops, Fulfill Orders</p>
                        </div>
                      </div>
                      {currentUser.role === 'farmer' && <Check className="w-4 h-4 text-[#3A5A40]" />}
                    </button>

                    <button
                      id="switch-admin-mode"
                      onClick={() => {
                        switchUserRole('admin');
                        setRoleSwitcherOpen(false);
                      }}
                      className={`w-full text-left px-3 py-2.5 rounded-2xl flex items-center justify-between text-xs font-medium transition-colors ${
                        currentUser.role === 'admin'
                          ? 'bg-purple-50 text-purple-900 font-bold border border-purple-200'
                          : 'hover:bg-slate-50 text-slate-700'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <ShieldCheck className="w-4 h-4 text-purple-600" />
                        <div>
                          <p className="font-semibold">🔧 Admin (Sarah Chen)</p>
                          <p className="text-[10px] text-slate-500">Platform Analytics, Moderate Crops & Users</p>
                        </div>
                      </div>
                      {currentUser.role === 'admin' && <Check className="w-4 h-4 text-purple-600" />}
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Notifications Dropdown */}
            <div className="relative" ref={notifRef}>
              <button
                id="notifications-bell-btn"
                onClick={() => setNotificationsOpen(!notificationsOpen)}
                className="relative p-2 rounded-full text-slate-600 hover:text-slate-900 hover:bg-[#F7F7F2] transition-colors"
                aria-label="View notifications"
              >
                <Bell className="w-5 h-5" />
                {unreadNotifs.length > 0 && (
                  <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-rose-500 text-white text-[10px] font-bold flex items-center justify-center animate-pulse">
                    {unreadNotifs.length}
                  </span>
                )}
              </button>

              {notificationsOpen && (
                <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-3xl shadow-2xl border border-[#E6E8E2] py-3 z-50 animate-in fade-in zoom-in-95">
                  <div className="px-4 py-2 border-b border-slate-100 flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-bold text-slate-900">Notifications</h4>
                      <p className="text-xs text-slate-500">Live harvest & delivery status</p>
                    </div>
                    {notifications.length > 0 && (
                      <button
                        onClick={clearAllNotifications}
                        className="text-xs text-slate-400 hover:text-rose-600 font-medium transition-colors"
                      >
                        Clear All
                      </button>
                    )}
                  </div>

                  <div className="max-h-80 overflow-y-auto divide-y divide-slate-100">
                    {notifications.length === 0 ? (
                      <div className="p-6 text-center text-slate-400 text-xs">
                        <Bell className="w-8 h-8 mx-auto mb-2 text-slate-300" />
                        No notifications yet
                      </div>
                    ) : (
                      notifications.map((notif) => (
                        <div
                          key={notif.id}
                          onClick={() => {
                            markNotificationAsRead(notif.id);
                            if (notif.actionUrl) {
                              handleNavClick(notif.actionUrl as ActiveView);
                              setNotificationsOpen(false);
                            }
                          }}
                          className={`p-3.5 hover:bg-slate-50 cursor-pointer transition-colors flex items-start gap-3 ${
                            !notif.read ? 'bg-[#EBF0E6]/50' : ''
                          }`}
                        >
                          <div className="w-2 h-2 rounded-full mt-1.5 shrink-0 bg-[#3A5A40]" />
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-bold text-slate-900">{notif.title}</p>
                            <p className="text-xs text-slate-600 mt-0.5 line-clamp-2">{notif.message}</p>
                            <span className="text-[10px] text-slate-400 mt-1 block">{notif.timestamp}</span>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Cart Button */}
            <button
              id="cart-drawer-btn"
              onClick={() => handleNavClick('cart')}
              className="relative flex items-center gap-2 px-4 py-2 rounded-full bg-[#3A5A40] hover:bg-[#2F4834] text-white font-semibold text-sm transition-all shadow-md shadow-[#3A5A40]/20 active:scale-95"
            >
              <ShoppingBag className="w-4 h-4 text-[#DAD7CD]" />
              <span className="hidden sm:inline font-bold">{cartCount > 0 ? `$${cartTotal}` : 'Cart'}</span>
              {cartCount > 0 && (
                <span className="w-5 h-5 rounded-full bg-white text-[#2F4834] text-xs font-extrabold flex items-center justify-center shadow-xs">
                  {cartCount}
                </span>
              )}
            </button>

            {/* User Profile Menu */}
            <div className="relative" ref={profileRef}>
              <button
                id="user-profile-btn"
                onClick={() => setProfileOpen(!profileOpen)}
                className="flex items-center gap-2 p-1 rounded-full hover:bg-[#F7F7F2] transition-colors border border-transparent hover:border-[#E6E8E2]"
                aria-label="User profile menu"
              >
                <img
                  src={currentUser.avatar}
                  alt={currentUser.name}
                  className="w-8 h-8 rounded-full object-cover border-2 border-[#A3B18A]"
                  referrerPolicy="no-referrer"
                />
              </button>

              {profileOpen && (
                <div className="absolute right-0 mt-2 w-64 bg-white rounded-3xl shadow-xl border border-[#E6E8E2] py-2 z-50 animate-in fade-in zoom-in-95">
                  <div className="px-4 py-3 border-b border-slate-100">
                    <p className="text-sm font-bold text-slate-900">{currentUser.name}</p>
                    <p className="text-xs text-slate-500 truncate">{currentUser.email}</p>
                    <span className="inline-block mt-1 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#A3B18A]/20 text-[#2F4834]">
                      {currentUser.role} Account
                    </span>
                  </div>

                  <div className="py-1">
                    {currentUser.role === 'farmer' && (
                      <>
                        <button
                          onClick={() => {
                            handleNavClick('farmer-dashboard');
                            setProfileOpen(false);
                          }}
                          className="w-full text-left px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                        >
                          <BarChart3 className="w-4 h-4 text-[#3A5A40]" />
                          <span>Farmer Dashboard</span>
                        </button>
                        <button
                          onClick={() => {
                            handleNavClick('farmer-add-product');
                            setProfileOpen(false);
                          }}
                          className="w-full text-left px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                        >
                          <PlusCircle className="w-4 h-4 text-[#3A5A40]" />
                          <span>Add New Crop</span>
                        </button>
                      </>
                    )}

                    <button
                      onClick={() => {
                        handleNavClick('orders');
                        setProfileOpen(false);
                      }}
                      className="w-full text-left px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                    >
                      <Package className="w-4 h-4 text-[#3A5A40]" />
                      <span>My Orders & Tracking</span>
                    </button>

                    <button
                      onClick={() => {
                        handleNavClick('profile');
                        setProfileOpen(false);
                      }}
                      className="w-full text-left px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                    >
                      <UserIcon className="w-4 h-4 text-[#3A5A40]" />
                      <span>Account Profile</span>
                    </button>

                    <button
                      onClick={() => {
                        handleNavClick('about');
                        setProfileOpen(false);
                      }}
                      className="w-full text-left px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                    >
                      <Sprout className="w-4 h-4 text-[#3A5A40]" />
                      <span>About AgriDirect Mission</span>
                    </button>
                  </div>

                  <div className="border-t border-slate-100 pt-1">
                    <button
                      onClick={() => {
                        handleNavClick('login');
                        setProfileOpen(false);
                      }}
                      className="w-full text-left px-4 py-2 text-xs font-medium text-rose-600 hover:bg-rose-50 flex items-center gap-2"
                    >
                      <LogOut className="w-4 h-4 text-rose-600" />
                      <span>Switch Account / Sign In</span>
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Mobile Hamburger Toggle */}
            <button
              id="mobile-menu-toggle"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-[#F7F7F2]"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-6 space-y-3">
          {/* Mobile Search */}
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search farm fresh produce..."
              className="w-full pl-9 pr-4 py-2 text-sm bg-slate-100 border border-slate-200 rounded-xl outline-none"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          </div>

          <div className="grid grid-cols-2 gap-2 pt-2">
            <button
              onClick={() => handleNavClick('home')}
              className="p-2.5 rounded-xl border border-slate-100 bg-slate-50 text-left text-xs font-bold text-slate-800"
            >
              🌾 Marketplace
            </button>
            <button
              onClick={() => handleNavClick('products')}
              className="p-2.5 rounded-xl border border-slate-100 bg-slate-50 text-left text-xs font-bold text-slate-800"
            >
              🥦 All Produce
            </button>
            <button
              onClick={() => handleNavClick('orders')}
              className="p-2.5 rounded-xl border border-slate-100 bg-slate-50 text-left text-xs font-bold text-slate-800"
            >
              🚚 Track Orders
            </button>
            {currentUser.role === 'farmer' ? (
              <button
                onClick={() => handleNavClick('farmer-dashboard')}
                className="p-2.5 rounded-xl border border-emerald-200 bg-emerald-50 text-left text-xs font-bold text-emerald-900"
              >
                🚜 Farmer Dashboard
              </button>
            ) : currentUser.role === 'admin' ? (
              <button
                onClick={() => handleNavClick('admin-dashboard')}
                className="p-2.5 rounded-xl border border-purple-200 bg-purple-50 text-left text-xs font-bold text-purple-900"
              >
                🔧 Admin Dashboard
              </button>
            ) : (
              <button
                onClick={() => handleNavClick('login')}
                className="p-2.5 rounded-xl border border-slate-100 bg-slate-50 text-left text-xs font-bold text-slate-800"
              >
                👨🌾 Farmer Login
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
