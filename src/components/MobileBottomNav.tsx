import React from 'react';
import { Home, Store, Package, Tractor, ShoppingBag, ShieldCheck } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { ActiveView } from '../types';

export const MobileBottomNav: React.FC = () => {
  const { activeView, setActiveView, cartCount, currentUser } = useApp();

  const navItems = [
    {
      id: 'home',
      label: 'Home',
      icon: Home,
      view: 'home' as ActiveView,
    },
    {
      id: 'products',
      label: 'Produce',
      icon: Store,
      view: 'products' as ActiveView,
    },
    {
      id: 'portal',
      label: currentUser.role === 'farmer' ? 'Farmer' : currentUser.role === 'admin' ? 'Admin' : 'Cart',
      icon:
        currentUser.role === 'farmer'
          ? Tractor
          : currentUser.role === 'admin'
          ? ShieldCheck
          : ShoppingBag,
      view:
        currentUser.role === 'farmer'
          ? ('farmer-dashboard' as ActiveView)
          : currentUser.role === 'admin'
          ? ('admin-dashboard' as ActiveView)
          : ('cart' as ActiveView),
      badge: currentUser.role === 'consumer' ? cartCount : 0,
    },
    {
      id: 'orders',
      label: 'Orders',
      icon: Package,
      view: 'orders' as ActiveView,
    },
  ];

  return (
    <nav
      id="mobile-bottom-nav"
      className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 px-2 py-1.5 flex items-center justify-around shadow-lg"
    >
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive =
          activeView === item.view ||
          (item.view === 'orders' && activeView === 'order-tracking') ||
          (item.view === 'farmer-dashboard' && activeView.startsWith('farmer-'));

        return (
          <button
            key={item.id}
            id={`bottom-nav-${item.id}`}
            onClick={() => setActiveView(item.view)}
            className={`flex flex-col items-center justify-center flex-1 py-1 relative transition-colors ${
              isActive ? 'text-emerald-700 font-bold' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <div className="relative">
              <Icon className="w-5 h-5" />
              {item.badge && item.badge > 0 ? (
                <span className="absolute -top-1.5 -right-2 bg-emerald-600 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center shadow-xs">
                  {item.badge}
                </span>
              ) : null}
            </div>
            <span className="text-[10px] mt-1 tracking-tight">{item.label}</span>
          </button>
        );
      })}
    </nav>
  );
};
