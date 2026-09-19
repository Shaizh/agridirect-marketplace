import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/Navbar';
import { MobileBottomNav } from './components/MobileBottomNav';
import { Footer } from './components/Footer';
import { ToastContainer } from './components/ToastContainer';
import { PWAInstallBanner } from './components/PWAInstallBanner';
import { AgriAssistModal } from './components/AgriAssistModal';

import { HomeView } from './views/HomeView';
import { ProductsView } from './views/ProductsView';
import { ProductDetailsView } from './views/ProductDetailsView';
import { CartView } from './views/CartView';
import { CheckoutView } from './views/CheckoutView';
import { OrdersView } from './views/OrdersView';
import { OrderTrackingView } from './views/OrderTrackingView';
import { FarmerDashboardView } from './views/FarmerDashboardView';
import { AdminDashboardView } from './views/AdminDashboardView';
import { UserProfileView } from './views/UserProfileView';

const MainLayout: React.FC = () => {
  const { activeView } = useApp();
  const [aiModalOpen, setAiModalOpen] = useState(false);
  const [farmerAiCallback, setFarmerAiCallback] = useState<((data: any) => void) | null>(null);

  const handleOpenAiAssist = () => {
    setFarmerAiCallback(null);
    setAiModalOpen(true);
  };

  const handleOpenAiForFarmer = (applyCallback: (data: any) => void) => {
    setFarmerAiCallback(() => applyCallback);
    setAiModalOpen(true);
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 selection:bg-emerald-200 selection:text-emerald-950 font-sans">
      {/* Toast notifications container */}
      <ToastContainer />

      {/* PWA Offline / Install Top Alert */}
      <PWAInstallBanner />

      {/* Primary Sticky Header */}
      <Navbar onOpenAiAssist={handleOpenAiAssist} />

      {/* Main Dynamic View Content */}
      <main className="flex-1">
        {activeView === 'home' && <HomeView onOpenAiAssist={handleOpenAiAssist} />}
        {activeView === 'products' && <ProductsView />}
        {activeView === 'product-details' && <ProductDetailsView />}
        {activeView === 'cart' && <CartView />}
        {activeView === 'checkout' && <CheckoutView />}
        {activeView === 'orders' && <OrdersView />}
        {activeView === 'order-tracking' && <OrderTrackingView />}
        {activeView === 'farmer-dashboard' && (
          <FarmerDashboardView onOpenAiAssistForFarmer={handleOpenAiForFarmer} />
        )}
        {activeView === 'admin-dashboard' && <AdminDashboardView />}
        {activeView === 'profile' && <UserProfileView />}
      </main>

      {/* AI Assistant Modal Hub */}
      <AgriAssistModal
        isOpen={aiModalOpen}
        onClose={() => {
          setAiModalOpen(false);
          setFarmerAiCallback(null);
        }}
        onApplyToFarmerCrop={
          farmerAiCallback
            ? (data) => {
                farmerAiCallback(data);
                setAiModalOpen(false);
                setFarmerAiCallback(null);
              }
            : undefined
        }
      />

      {/* Footer */}
      <Footer />

      {/* Mobile Bottom Navigation Bar for PWA */}
      <MobileBottomNav onOpenAiAssist={handleOpenAiAssist} />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainLayout />
    </AppProvider>
  );
}
