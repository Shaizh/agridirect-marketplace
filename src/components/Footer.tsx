import React from 'react';
import { Sprout, Heart, ShieldCheck, Truck, RefreshCw, Smartphone, Award, ExternalLink } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const Footer: React.FC = () => {
  const { setActiveView, promptInstallPwa } = useApp();

  return (
    <footer className="bg-slate-900 text-slate-300 pt-16 pb-24 md:pb-12 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Value Proposition Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 pb-12 border-b border-slate-800">
          <div className="flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-emerald-900/50 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0">
              <Sprout className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-white font-bold text-sm">100% Direct From Farmers</h4>
              <p className="text-slate-400 text-xs mt-1 leading-relaxed">
                Zero middleman margin. 85-90% of your dollar reaches local family growers directly.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-emerald-900/50 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-white font-bold text-sm">Morning Fresh Harvest</h4>
              <p className="text-slate-400 text-xs mt-1 leading-relaxed">
                Crops picked at sunrise and delivered within hours at peak vitamin density.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-emerald-900/50 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-white font-bold text-sm">Verified Farm Provenance</h4>
              <p className="text-slate-400 text-xs mt-1 leading-relaxed">
                Transparent soil practices, USDA/Bio organic certs, and complete grower traceability.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-emerald-900/50 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0">
              <Smartphone className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-white font-bold text-sm">PWA Installable & Offline</h4>
              <p className="text-slate-400 text-xs mt-1 leading-relaxed">
                Works offline on Android, iOS & Desktop with push alerts and instant loading.
              </p>
            </div>
          </div>
        </div>

        {/* Links & Brand Section */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8 py-12 border-b border-slate-800">
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center text-white font-bold">
                <Sprout className="w-5 h-5" />
              </div>
              <span className="text-xl font-bold text-white font-display">AgriDirect Marketplace</span>
            </div>
            <p className="text-slate-400 text-xs leading-relaxed max-w-sm">
              Empowering farmers with fair income while providing urban families with fresh, chemical-free agricultural produce directly from verified farms.
            </p>
            <div className="flex items-center gap-3 pt-2">
              <button
                onClick={promptInstallPwa}
                className="px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold flex items-center gap-2 transition-colors"
              >
                <Smartphone className="w-3.5 h-3.5" />
                <span>Install Mobile App</span>
              </button>
            </div>
          </div>

          <div>
            <h5 className="text-white font-bold text-xs uppercase tracking-wider mb-3">Consumer Hub</h5>
            <ul className="space-y-2 text-xs text-slate-400">
              <li>
                <button onClick={() => setActiveView('products')} className="hover:text-white transition-colors">
                  Explore Fresh Harvests
                </button>
              </li>
              <li>
                <button onClick={() => setActiveView('cart')} className="hover:text-white transition-colors">
                  My Shopping Basket
                </button>
              </li>
              <li>
                <button onClick={() => setActiveView('orders')} className="hover:text-white transition-colors">
                  Live Order Tracker
                </button>
              </li>
              <li>
                <button onClick={() => setActiveView('about')} className="hover:text-white transition-colors">
                  How Direct Buying Works
                </button>
              </li>
            </ul>
          </div>

          <div>
            <h5 className="text-white font-bold text-xs uppercase tracking-wider mb-3">Farmer Portal</h5>
            <ul className="space-y-2 text-xs text-slate-400">
              <li>
                <button onClick={() => setActiveView('farmer-dashboard')} className="hover:text-white transition-colors">
                  Farmer Dashboard
                </button>
              </li>
              <li>
                <button onClick={() => setActiveView('farmer-add-product')} className="hover:text-white transition-colors">
                  List New Crop / Stock
                </button>
              </li>
              <li>
                <button onClick={() => setActiveView('farmer-orders')} className="hover:text-white transition-colors">
                  Incoming Order Fulfillments
                </button>
              </li>
              <li>
                <button onClick={() => setActiveView('register')} className="hover:text-white transition-colors">
                  Register as a Partner Farmer
                </button>
              </li>
            </ul>
          </div>

          <div>
            <h5 className="text-white font-bold text-xs uppercase tracking-wider mb-3">Platform & Safety</h5>
            <ul className="space-y-2 text-xs text-slate-400">
              <li>
                <button onClick={() => setActiveView('admin-dashboard')} className="hover:text-white transition-colors">
                  Admin Governance
                </button>
              </li>
              <li>
                <button onClick={() => setActiveView('about')} className="hover:text-white transition-colors">
                  Fair Price Guarantee
                </button>
              </li>
              <li>
                <button onClick={() => setActiveView('contact')} className="hover:text-white transition-colors">
                  Farmer & Buyer Support
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© {new Date().getFullYear()} AgriDirect PWA Marketplace. Empowering Sustainable Agriculture.</p>
          <div className="flex items-center gap-2">
            <span>Built for sustainable farmer-to-consumer prosperity</span>
            <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
          </div>
        </div>
      </div>
    </footer>
  );
};
