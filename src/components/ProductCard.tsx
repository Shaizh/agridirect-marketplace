import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  Sparkles,
  ShoppingBag,
  Star,
  ShieldCheck,
  MapPin,
  Clock,
  Plus,
  Minus,
  Check,
  Eye,
  Tractor,
} from 'lucide-react';
import { Product } from '../types';
import { useApp } from '../context/AppContext';

interface ProductCardProps {
  product: Product;
  onViewDetails: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onViewDetails }) => {
  const { addToCart, cart } = useApp();
  const [selectedQty, setSelectedQty] = useState(1);
  const [justAdded, setJustAdded] = useState(false);

  const cartItem = cart.find((item) => item.productId === product.id);
  const inCartQty = cartItem ? cartItem.quantity : 0;
  const isOutOfStock = product.stock <= 0;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isOutOfStock) return;
    addToCart(product, selectedQty);
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1200);
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
      id={`product-card-${product.id}`}
      onClick={() => onViewDetails(product)}
      className="group bg-white rounded-3xl border border-[#E6E8E2] hover:border-[#A3B18A] shadow-xs hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col cursor-pointer relative"
    >
      {/* Image Container */}
      <div className="relative aspect-4/3 w-full bg-[#F7F7F2] overflow-hidden">
        <img
          src={product.images[0] || 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=800&auto=format&fit=crop&q=80'}
          alt={product.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
          referrerPolicy="no-referrer"
        />

        {/* Badges Top Overlay */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between gap-1 pointer-events-none">
          <div className="flex flex-wrap gap-1.5">
            {product.isOrganic && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#2F4834]/90 backdrop-blur-md text-[#DAD7CD] text-[10px] font-bold tracking-wide shadow-xs border border-[#3A5A40]">
                <ShieldCheck className="w-3 h-3 text-[#A3B18A]" />
                <span>100% Organic</span>
              </span>
            )}
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-slate-900/80 backdrop-blur-md text-[#A3B18A] text-[10px] font-semibold shadow-xs">
              <Clock className="w-3 h-3 text-[#A3B18A]" />
              <span>{product.harvestDate}</span>
            </span>
          </div>

          {/* Freshness Score Pill */}
          <span className="px-2.5 py-1 rounded-full bg-[#EBF0E6] text-[#2F4834] border border-[#D5DEC9] text-[10px] font-extrabold shadow-2xs">
            {product.freshnessScore}% Fresh
          </span>
        </div>

        {/* Quick View Button on Hover */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onViewDetails(product);
          }}
          className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity p-2 px-3 rounded-full bg-white/95 backdrop-blur-md hover:bg-white text-slate-800 shadow-md text-xs font-bold flex items-center gap-1.5 border border-[#E6E8E2]"
        >
          <Eye className="w-3.5 h-3.5 text-[#3A5A40]" />
          <span>Quick View</span>
        </button>

        {isOutOfStock && (
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center">
            <span className="px-3.5 py-1.5 rounded-full bg-rose-600 text-white text-xs font-bold uppercase tracking-wider shadow-lg">
              Sold Out Today
            </span>
          </div>
        )}
      </div>

      {/* Content Section */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          {/* Farm Origin & Farmer Name */}
          <div className="flex items-center justify-between text-[11px] text-slate-500 mb-1.5 gap-2">
            <span className="font-semibold text-[#3A5A40] truncate flex items-center gap-1 bg-[#EBF0E6] px-2 py-0.5 rounded-md">
              <Tractor className="w-3 h-3 shrink-0 text-[#3A5A40]" />
              <span className="truncate">{product.farmName}</span>
            </span>
            <div className="flex items-center gap-0.5 text-amber-500 font-bold shrink-0">
              <Star className="w-3 h-3 fill-amber-400" />
              <span>{product.avgRating}</span>
              <span className="text-slate-400 font-normal">({product.reviewCount})</span>
            </div>
          </div>

          {/* Product Title */}
          <h3 className="font-bold text-slate-900 text-base leading-snug group-hover:text-[#3A5A40] transition-colors line-clamp-1 font-display">
            {product.title}
          </h3>

          {/* Short Description */}
          <p className="text-xs text-slate-600 mt-1 line-clamp-2 leading-relaxed">
            {product.description}
          </p>

          {/* Bulk Discount notice if available */}
          {product.bulkDiscountThreshold && product.bulkDiscountPercent && (
            <div className="mt-2 text-[10px] font-bold text-amber-900 bg-amber-50/80 border border-amber-200/80 rounded-full px-2.5 py-0.5 inline-block">
              Save {product.bulkDiscountPercent}% on ≥ {product.bulkDiscountThreshold} {product.unit}
            </div>
          )}
        </div>

        {/* Pricing & Cart Action Row */}
        <div className="mt-4 pt-3 border-t border-[#E6E8E2] flex items-center justify-between gap-2">
          <div>
            <div className="flex items-baseline gap-1">
              <span className="text-xl font-extrabold text-[#2F4834] font-display">
                ${product.price.toFixed(2)}
              </span>
              <span className="text-xs font-semibold text-slate-500">/{product.unit}</span>
            </div>
            <span className="text-[10px] text-slate-400 block">
              {product.stock > 0 ? `${product.stock} ${product.unit} left` : 'Out of stock'}
            </span>
          </div>

          {/* Add To Cart Controls */}
          {!isOutOfStock ? (
            <div className="flex items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
              <div className="flex items-center bg-[#F7F7F2] rounded-full p-0.5 border border-[#E6E8E2]">
                <button
                  type="button"
                  onClick={() => setSelectedQty((prev) => Math.max(1, prev - 1))}
                  className="p-1 hover:bg-white text-slate-600 rounded-full transition-colors"
                  aria-label="Decrease quantity"
                >
                  <Minus className="w-3 h-3" />
                </button>
                <span className="px-2 text-xs font-bold text-slate-800 min-w-5 text-center">
                  {selectedQty}
                </span>
                <button
                  type="button"
                  onClick={() => setSelectedQty((prev) => Math.min(product.stock, prev + 1))}
                  className="p-1 hover:bg-white text-slate-600 rounded-full transition-colors"
                  aria-label="Increase quantity"
                >
                  <Plus className="w-3 h-3" />
                </button>
              </div>

              <button
                id={`add-to-cart-${product.id}`}
                type="button"
                onClick={handleAddToCart}
                className={`p-2.5 rounded-full font-bold text-xs flex items-center justify-center transition-all active:scale-95 shadow-xs ${
                  justAdded
                    ? 'bg-[#2F4834] text-white'
                    : 'bg-[#3A5A40] hover:bg-[#2F4834] text-white'
                }`}
                title="Add to basket"
              >
                {justAdded ? <Check className="w-4 h-4 text-[#A3B18A]" /> : <ShoppingBag className="w-4 h-4 text-[#DAD7CD]" />}
              </button>
            </div>
          ) : (
            <button
              disabled
              className="px-3 py-1.5 rounded-full bg-slate-100 text-slate-400 text-xs font-medium cursor-not-allowed"
            >
              Sold Out
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
};
