import React from 'react';
import { motion } from 'motion/react';
import {
  Sprout,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Truck,
  Heart,
  ChevronRight,
  Search,
  Star,
  CheckCircle2,
  TrendingUp,
  Award,
  Tractor,
  Zap,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { ProductCard } from '../components/ProductCard';
import { Product, ProductCategory } from '../types';

interface HomeViewProps {
  onOpenAiAssist: () => void;
}

const CATEGORIES: { name: ProductCategory; icon: string; bg: string }[] = [
  { name: 'Vegetables', icon: '🥦', bg: 'bg-emerald-50 text-emerald-800 border-emerald-200' },
  { name: 'Fruits', icon: '🍎', bg: 'bg-rose-50 text-rose-800 border-rose-200' },
  { name: 'Grains & Pulses', icon: '🌾', bg: 'bg-amber-50 text-amber-800 border-amber-200' },
  { name: 'Dairy & Honey', icon: '🍯', bg: 'bg-yellow-50 text-yellow-800 border-yellow-200' },
  { name: 'Herbs & Spices', icon: '🌿', bg: 'bg-teal-50 text-teal-800 border-teal-200' },
];

export const HomeView: React.FC<HomeViewProps> = ({ onOpenAiAssist }) => {
  const {
    products,
    users,
    setActiveView,
    setSelectedProduct,
    selectedCategory,
    setSelectedCategory,
    setSearchQuery,
    currentUser,
  } = useApp();

  const farmers = users.filter((u) => u.role === 'farmer' && u.farmDetails);
  const featuredProducts = products.filter((p) => p.featured || p.freshnessScore >= 98).slice(0, 6);
  const todaysHarvest = products.slice(0, 4);

  return (
    <div id="home-view" className="space-y-10 pb-16">
      {/* Bento Grid Hero Layout */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-2">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          
          {/* Bento Card 1: Main Brand Banner (Col 8) */}
          <div className="lg:col-span-8 bg-[#2F4834] text-[#F7F7F2] rounded-[2rem] p-6 sm:p-10 border border-[#3A5A40] shadow-xl relative overflow-hidden flex flex-col justify-between">
            {/* Ambient natural light background */}
            <div className="absolute top-0 right-0 -mt-12 -mr-12 w-80 h-80 rounded-full bg-[#588157]/20 blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 left-0 -mb-12 -ml-12 w-80 h-80 rounded-full bg-[#A3B18A]/15 blur-3xl pointer-events-none" />

            <div className="relative z-10 space-y-5">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#3A5A40] border border-[#588157] text-[#DAD7CD] text-xs font-semibold backdrop-blur-md">
                <Sprout className="w-4 h-4 text-[#A3B18A]" />
                <span>Direct Farmer to Consumer • 0% Intermediary Cuts</span>
              </div>

              <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white font-display leading-[1.12]">
                Fresh from Local Soil <br />
                <span className="text-[#DAD7CD] italic">Direct to Your Kitchen.</span>
              </h1>

              <p className="text-xs sm:text-sm text-[#DAD7CD] leading-relaxed max-w-xl">
                Skip warehouse storage and multi-day supermarket supply chains. Connect with certified family growers who harvest your crops after order confirmation.
              </p>

              {/* CTAs */}
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <button
                  id="hero-explore-btn"
                  onClick={() => setActiveView('products')}
                  className="px-6 py-3 rounded-full bg-[#A3B18A] hover:bg-[#B5C29F] text-[#1E293B] font-bold text-xs sm:text-sm shadow-md transition-all active:scale-95 flex items-center gap-2"
                >
                  <span>Explore Harvests</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <button
                  id="hero-ai-assist-btn"
                  onClick={onOpenAiAssist}
                  className="px-5 py-3 rounded-full bg-[#3A5A40] hover:bg-[#476B4E] text-white font-semibold text-xs sm:text-sm border border-[#588157] transition-all flex items-center gap-2"
                >
                  <Sparkles className="w-4 h-4 text-amber-300" />
                  <span>Ask AgriAssist AI</span>
                </button>
              </div>
            </div>

            {/* Live Bento Metrics Strip */}
            <div className="relative z-10 grid grid-cols-3 gap-3 pt-8 mt-6 border-t border-[#3A5A40]">
              <div className="bg-[#243B29] p-3 rounded-2xl border border-[#3A5A40]/60">
                <span className="text-xl sm:text-2xl font-extrabold text-white font-display">12 Hrs</span>
                <p className="text-[10px] text-[#A3B18A] font-medium">Harvest to Door</p>
              </div>
              <div className="bg-[#243B29] p-3 rounded-2xl border border-[#3A5A40]/60">
                <span className="text-xl sm:text-2xl font-extrabold text-[#A3B18A] font-display">92%</span>
                <p className="text-[10px] text-[#A3B18A] font-medium">Farmer Revenue</p>
              </div>
              <div className="bg-[#243B29] p-3 rounded-2xl border border-[#3A5A40]/60">
                <span className="text-xl sm:text-2xl font-extrabold text-[#E9D8A6] font-display">100%</span>
                <p className="text-[10px] text-[#A3B18A] font-medium">Naturally Grown</p>
              </div>
            </div>
          </div>

          {/* Right Column Bento Cards (Col 4) */}
          <div className="lg:col-span-4 flex flex-col gap-5">
            
            {/* Bento Card 2: Sunrise Harvest Card */}
            <div className="bg-[#FAF6ED] rounded-[2rem] p-6 border border-[#EBE4D5] shadow-xs flex-1 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full bg-[#3A5A40] animate-pulse" />
                    <span className="text-xs font-bold text-[#3A5A40] uppercase tracking-wider">
                      Today's Harvest
                    </span>
                  </div>
                  <span className="text-[11px] text-slate-500 font-medium">Morning Batch</span>
                </div>

                {products[0] && (
                  <div
                    onClick={() => {
                      setSelectedProduct(products[0]);
                      setActiveView('product-details');
                    }}
                    className="bg-white rounded-2xl p-3.5 border border-[#E6E8E2] shadow-2xs hover:shadow-md transition-all cursor-pointer group flex items-center gap-3"
                  >
                    <img
                      src={products[0].images[0]}
                      alt={products[0].title}
                      className="w-16 h-16 rounded-xl object-cover group-hover:scale-105 transition-transform"
                      referrerPolicy="no-referrer"
                    />
                    <div className="flex-1 min-w-0">
                      <span className="text-[10px] font-bold text-[#3A5A40] bg-[#EBF0E6] px-1.5 py-0.5 rounded">
                        {products[0].farmName}
                      </span>
                      <h4 className="text-xs font-bold truncate text-slate-900 mt-1">{products[0].title}</h4>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs font-extrabold text-[#2F4834] font-display">
                          ${products[0].price}/{products[0].unit}
                        </span>
                        <span className="text-[10px] font-bold text-amber-700 bg-amber-100/70 px-1.5 rounded">
                          {products[0].freshnessScore}% Fresh
                        </span>
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
                  </div>
                )}
              </div>

              {/* Farmer Ramesh Quote */}
              <div className="mt-4 pt-3 border-t border-[#EBE4D5] flex items-center gap-3">
                <img
                  src="https://images.unsplash.com/photo-1544717305-2782549b5136?w=200&auto=format&fit=crop&q=80"
                  alt="Farmer Ramesh"
                  className="w-9 h-9 rounded-full object-cover border-2 border-[#A3B18A]"
                  referrerPolicy="no-referrer"
                />
                <div className="text-xs">
                  <p className="font-bold text-slate-900">Ramesh Patel • Green Valley</p>
                  <p className="text-[10px] text-slate-500 italic">"Picked at sunrise, at your table by lunch."</p>
                </div>
              </div>
            </div>

            {/* Bento Card 3: AI Hub Prompt Card */}
            <div className="bg-[#EBF0E6] rounded-[2rem] p-6 border border-[#D5DEC9] shadow-xs flex flex-col justify-between">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-[#2F4834]">
                  <Sparkles className="w-4 h-4 text-[#3A5A40]" />
                  <span className="text-xs font-bold uppercase tracking-wider">AgriAssist AI</span>
                </div>
                <h3 className="text-base font-bold text-[#2F4834] font-display">
                  Need seasonal recipe or crop advice?
                </h3>
                <p className="text-xs text-[#588157]">
                  Instant suggestions on pesticide-free prep, bulk farm savings & seasonal calendar.
                </p>
              </div>

              <button
                onClick={onOpenAiAssist}
                className="mt-4 w-full py-2.5 px-4 rounded-full bg-[#3A5A40] hover:bg-[#2F4834] text-white text-xs font-bold transition-all shadow-2xs flex items-center justify-center gap-2"
              >
                <span>Ask AI Advisor</span>
                <ArrowRight className="w-3.5 h-3.5 text-[#DAD7CD]" />
              </button>
            </div>

          </div>
        </div>
      </section>

      {/* Category Bento Navigation */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 font-display">Fresh Seasonal Categories</h2>
            <p className="text-xs text-slate-500">Curated collections directly from local organic farm clusters</p>
          </div>
          <button
            onClick={() => setActiveView('products')}
            className="text-xs font-bold text-[#3A5A40] hover:underline flex items-center gap-1"
          >
            <span>View All Produce</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.name}
              id={`cat-card-${cat.name.toLowerCase().replace(/[\s&]+/g, '-')}`}
              onClick={() => {
                setSelectedCategory(cat.name);
                setActiveView('products');
              }}
              className="p-4 rounded-3xl border border-[#E6E8E2] bg-white hover:border-[#A3B18A] hover:bg-[#FAF6ED] transition-all text-left flex items-center gap-3 group cursor-pointer shadow-2xs hover:shadow-md"
            >
              <span className="text-2xl p-2.5 rounded-2xl bg-[#F7F7F2] group-hover:scale-110 transition-transform">
                {cat.icon}
              </span>
              <div>
                <h4 className="font-bold text-xs sm:text-sm text-slate-900 group-hover:text-[#3A5A40] transition-colors font-display">
                  {cat.name}
                </h4>
                <p className="text-[10px] text-slate-400 mt-0.5">
                  {products.filter((p) => p.category === cat.name).length} produce items
                </p>
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* Featured Harvest Produce Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#2F4834] bg-[#EBF0E6] px-2.5 py-0.5 rounded-full border border-[#D5DEC9]">
                Peak Season Today
              </span>
              <span className="text-xs text-slate-400">• Directly from Farm gate</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 font-display mt-1">
              Top Featured Harvests
            </h2>
          </div>

          <button
            onClick={() => setActiveView('products')}
            className="text-xs font-bold text-[#3A5A40] hover:underline flex items-center gap-1"
          >
            <span>See all {products.length} items</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onViewDetails={(p) => {
                setSelectedProduct(p);
                setActiveView('product-details');
              }}
            />
          ))}
        </div>
      </section>

      {/* The Direct-From-Farmer Difference Bento Card */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#2F4834] text-white rounded-[2rem] p-6 sm:p-10 border border-[#3A5A40] relative overflow-hidden shadow-xl">
          <div className="max-w-3xl space-y-3 mb-8">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#DAD7CD] bg-[#3A5A40] px-3 py-1 rounded-full border border-[#588157]">
              Supply Chain Transparency
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold font-display text-white">
              Why Direct Farm-to-Fork Wins
            </h2>
            <p className="text-xs sm:text-sm text-[#DAD7CD] leading-relaxed">
              Standard commercial supermarkets store crops for 5 to 9 days across cold lockers, losing 70% of vitamin content and cutting farm income. AgriDirect preserves 100% grower transparency.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Traditional Way */}
            <div className="bg-[#243B29] rounded-3xl p-6 border border-[#3A5A40] space-y-3.5">
              <div className="flex items-center justify-between pb-2 border-b border-[#3A5A40]">
                <span className="font-bold text-rose-300 text-xs sm:text-sm">❌ Supermarket Cold Chain</span>
                <span className="text-[11px] text-slate-300">5 - 9 Days Old</span>
              </div>
              <ul className="space-y-2 text-xs text-[#DAD7CD]">
                <li className="flex items-start gap-2">
                  <span className="text-rose-400 font-bold">•</span>
                  <span><strong>Middlemen markups:</strong> Brokers, commission agents, regional cold stores, wholesale yards.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-rose-400 font-bold">•</span>
                  <span><strong>Artificial ripening:</strong> Harvested unripe and treated with chemicals in transit.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-rose-400 font-bold">•</span>
                  <span><strong>Grower takes:</strong> Less than 25% of total retail price.</span>
                </li>
              </ul>
            </div>

            {/* AgriDirect Way */}
            <div className="bg-[#3A5A40] rounded-3xl p-6 border border-[#588157] space-y-3.5 shadow-lg">
              <div className="flex items-center justify-between pb-2 border-b border-[#588157]">
                <span className="font-bold text-[#EBF0E6] text-xs sm:text-sm flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-[#A3B18A]" />
                  <span>AgriDirect Bento Model</span>
                </span>
                <span className="text-[11px] text-[#A3B18A] font-bold">12 - 24 Hours</span>
              </div>
              <ul className="space-y-2 text-xs text-[#EBF0E6]">
                <li className="flex items-start gap-2">
                  <span className="text-[#A3B18A] font-bold">•</span>
                  <span><strong>Soil-to-door:</strong> Harvested after order placement, straight from the farm gate.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#A3B18A] font-bold">•</span>
                  <span><strong>Peak nutrients:</strong> Naturally sun-ripened with intact bioflavonoids and aroma.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#A3B18A] font-bold">•</span>
                  <span><strong>Grower takes:</strong> 90%+ of consumer payment directly into their bank.</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Meet Local Farmers Bento Cards */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 font-display">
              Meet Verified Family Farmers
            </h2>
            <p className="text-xs text-slate-500">Every crop in your basket is traced to a certified local producer</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {farmers.map((farmer) => {
            const details = farmer.farmDetails!;
            return (
              <div
                key={farmer.id}
                className="bg-white rounded-3xl border border-[#E6E8E2] overflow-hidden shadow-xs hover:shadow-lg transition-all flex flex-col justify-between hover:border-[#A3B18A]"
              >
                {/* Banner & Avatar */}
                <div className="relative h-32 w-full bg-[#F7F7F2]">
                  <img
                    src={details.banner}
                    alt={details.farmName}
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute -bottom-5 left-5">
                    <img
                      src={details.avatar}
                      alt={farmer.name}
                      className="w-12 h-12 rounded-full object-cover border-2 border-white shadow-md"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  {details.organicCertified && (
                    <span className="absolute top-2.5 right-2.5 px-2.5 py-1 rounded-full bg-[#2F4834]/90 backdrop-blur-md text-[#DAD7CD] text-[10px] font-bold border border-[#3A5A40]">
                      Organic Certified
                    </span>
                  )}
                </div>

                {/* Info */}
                <div className="p-6 pt-8 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="font-bold text-slate-900 text-base leading-tight font-display">{details.farmName}</h3>
                    <p className="text-xs text-[#3A5A40] font-semibold mt-0.5">
                      {farmer.name} • Est. {details.sinceYear}
                    </p>
                    <p className="text-xs text-slate-600 mt-2 line-clamp-3 leading-relaxed">
                      {details.bio}
                    </p>

                    <div className="flex flex-wrap gap-1.5 mt-3">
                      {details.cropsSpeciality.map((crop) => (
                        <span key={crop} className="text-[10px] bg-[#F7F7F2] text-slate-700 px-2.5 py-0.5 rounded-full font-medium border border-[#E6E8E2]">
                          {crop}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-[#E6E8E2] flex items-center justify-between">
                    <div className="flex items-center gap-1 text-amber-500 font-bold text-xs">
                      <Star className="w-3.5 h-3.5 fill-amber-400" />
                      <span>{details.rating}</span>
                      <span className="text-slate-400 font-normal">({details.totalOrders} orders)</span>
                    </div>

                    <button
                      onClick={() => {
                        setSearchQuery(farmer.name);
                        setActiveView('products');
                      }}
                      className="text-xs font-bold text-[#3A5A40] hover:text-[#2F4834] flex items-center gap-1"
                    >
                      <span>View Harvests</span>
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
};
