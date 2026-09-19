import React, { useState, useMemo } from 'react';
import {
  Search,
  SlidersHorizontal,
  ShieldCheck,
  Star,
  Sprout,
  Filter,
  Check,
  ArrowUpDown,
  X,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { ProductCard } from '../components/ProductCard';
import { Product, ProductCategory } from '../types';

const CATEGORIES: ('All' | ProductCategory)[] = [
  'All',
  'Vegetables',
  'Fruits',
  'Grains & Pulses',
  'Dairy & Honey',
  'Herbs & Spices',
];

export const ProductsView: React.FC = () => {
  const {
    products,
    searchQuery,
    setSearchQuery,
    selectedCategory,
    setSelectedCategory,
    organicOnly,
    setOrganicOnly,
    sortBy,
    setSortBy,
    setSelectedProduct,
    setActiveView,
  } = useApp();

  const [priceMax, setPriceMax] = useState<number>(15);
  const [inStockOnly, setInStockOnly] = useState(false);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  // Filtered & Sorted Product List
  const filteredProducts = useMemo(() => {
    return products
      .filter((p) => {
        // Admin flag check
        if (p.status === 'flagged' || p.status === 'hidden') return false;

        // Search match
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchesTitle = p.title.toLowerCase().includes(q);
          const matchesDesc = p.description.toLowerCase().includes(q);
          const matchesFarmer = p.farmerName.toLowerCase().includes(q);
          const matchesFarm = p.farmName.toLowerCase().includes(q);
          const matchesCat = p.category.toLowerCase().includes(q);
          if (!matchesTitle && !matchesDesc && !matchesFarmer && !matchesFarm && !matchesCat) {
            return false;
          }
        }

        // Category match
        if (selectedCategory !== 'All' && p.category !== selectedCategory) {
          return false;
        }

        // Organic filter
        if (organicOnly && !p.isOrganic) {
          return false;
        }

        // In Stock filter
        if (inStockOnly && p.stock <= 0) {
          return false;
        }

        // Price ceiling
        if (p.price > priceMax) {
          return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'price_low') return a.price - b.price;
        if (sortBy === 'price_high') return b.price - a.price;
        if (sortBy === 'rating') return b.avgRating - a.avgRating;
        // Default freshness
        return b.freshnessScore - a.freshnessScore;
      });
  }, [products, searchQuery, selectedCategory, organicOnly, inStockOnly, priceMax, sortBy]);

  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedCategory('All');
    setOrganicOnly(false);
    setInStockOnly(false);
    setPriceMax(15);
    setSortBy('freshness');
  };

  return (
    <div id="products-view" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 pb-20">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-[#E6E8E2]">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-display">
            Direct Farm Harvests
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Showing {filteredProducts.length} farm-fresh items picked directly upon order by certified growers
          </p>
        </div>

        {/* Search Bar on Page */}
        <div className="flex items-center gap-3">
          <div className="relative w-full sm:w-80">
            <input
              id="catalog-search"
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search produce or farmer..."
              className="w-full pl-10 pr-4 py-2 text-xs sm:text-sm bg-white border border-[#E6E8E2] focus:border-[#3A5A40] rounded-full outline-none transition-all placeholder:text-slate-400"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600"
              >
                ×
              </button>
            )}
          </div>

          <button
            onClick={() => setMobileFilterOpen(!mobileFilterOpen)}
            className="md:hidden p-2.5 rounded-full border border-[#E6E8E2] bg-white text-slate-700 flex items-center gap-1.5 text-xs font-bold"
          >
            <Filter className="w-4 h-4 text-[#3A5A40]" />
            <span>Filters</span>
          </button>
        </div>
      </div>

      {/* Category Pills Bar */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            id={`filter-category-${cat.toLowerCase().replace(/[\s&]+/g, '-')}`}
            onClick={() => setSelectedCategory(cat)}
            className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all ${
              selectedCategory === cat
                ? 'bg-[#3A5A40] text-white shadow-xs'
                : 'bg-white text-slate-700 border border-[#E6E8E2] hover:bg-[#FAF6ED]'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Main Content Layout: Sidebar Filters + Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 sm:gap-8">
        {/* Sidebar Filters (Desktop & Collapsible Mobile) */}
        <div className={`md:block space-y-5 ${mobileFilterOpen ? 'block' : 'hidden md:block'}`}>
          <div className="bg-white rounded-3xl border border-[#E6E8E2] p-6 space-y-5 shadow-xs">
            <div className="flex items-center justify-between border-b border-[#E6E8E2] pb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-900 flex items-center gap-1.5">
                <SlidersHorizontal className="w-3.5 h-3.5 text-[#3A5A40]" />
                <span>Filters & Sorting</span>
              </span>
              <button
                onClick={handleResetFilters}
                className="text-[11px] font-bold text-[#3A5A40] hover:underline"
              >
                Reset All
              </button>
            </div>

            {/* Sort Options */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-2">Sort By</label>
              <select
                id="sort-select"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-2xl border border-[#E6E8E2] bg-[#F7F7F2] text-slate-800 outline-none focus:border-[#3A5A40] font-medium"
              >
                <option value="freshness">✨ Harvest Freshness (Highest First)</option>
                <option value="price_low">💲 Price: Low to High</option>
                <option value="price_high">💲 Price: High to Low</option>
                <option value="rating">⭐ Customer Rating</option>
              </select>
            </div>

            {/* Price Range Slider */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-bold text-slate-700">Max Price: ${priceMax}</label>
                <span className="text-[10px] text-slate-400">$0 - $15</span>
              </div>
              <input
                type="range"
                min={1}
                max={15}
                step={0.5}
                value={priceMax}
                onChange={(e) => setPriceMax(Number(e.target.value))}
                className="w-full accent-[#3A5A40] cursor-pointer"
              />
            </div>

            {/* Checkbox Options */}
            <div className="space-y-3 pt-2 border-t border-[#E6E8E2]">
              <label className="flex items-center gap-2.5 text-xs font-medium text-slate-800 cursor-pointer">
                <input
                  type="checkbox"
                  checked={organicOnly}
                  onChange={(e) => setOrganicOnly(e.target.checked)}
                  className="rounded text-[#3A5A40] focus:ring-[#3A5A40] w-4 h-4"
                />
                <span>🌿 100% Organic Certified Only</span>
              </label>

              <label className="flex items-center gap-2.5 text-xs font-medium text-slate-800 cursor-pointer">
                <input
                  type="checkbox"
                  checked={inStockOnly}
                  onChange={(e) => setInStockOnly(e.target.checked)}
                  className="rounded text-[#3A5A40] focus:ring-[#3A5A40] w-4 h-4"
                />
                <span>📦 In Stock Only</span>
              </label>
            </div>
          </div>

          {/* Direct Guarantee Box */}
          <div className="bg-[#EBF0E6] border border-[#D5DEC9] rounded-3xl p-5 text-xs text-[#2F4834] space-y-2">
            <span className="font-bold flex items-center gap-1.5 text-[#2F4834]">
              <ShieldCheck className="w-4 h-4 text-[#3A5A40]" />
              <span>Harvest Fresh Guarantee</span>
            </span>
            <p className="text-[11px] text-[#588157] leading-relaxed">
              If your produce arrives bruised or below farm standards, we offer an instant refund or free farm replacement within 24 hours.
            </p>
          </div>
        </div>

        {/* Products Grid */}
        <div className="md:col-span-3">
          {filteredProducts.length === 0 ? (
            <div className="bg-white rounded-[2rem] border border-[#E6E8E2] p-12 text-center space-y-4 shadow-xs">
              <div className="w-16 h-16 rounded-full bg-[#F7F7F2] text-slate-400 mx-auto flex items-center justify-center">
                <Search className="w-8 h-8 text-[#A3B18A]" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900 font-display">No Produce Matches Your Filter</h3>
                <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1">
                  Try adjusting your price ceiling, category, or search term to discover more farm crops.
                </p>
              </div>
              <button
                onClick={handleResetFilters}
                className="px-5 py-2.5 rounded-full bg-[#3A5A40] hover:bg-[#2F4834] text-white text-xs font-bold transition-colors"
              >
                Clear All Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredProducts.map((product) => (
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
          )}
        </div>
      </div>
    </div>
  );
};
