import React, { useState } from 'react';
import {
  ArrowLeft,
  Star,
  ShieldCheck,
  Tractor,
  Clock,
  Calendar,
  ShoppingBag,
  Plus,
  Minus,
  Check,
  MessageSquare,
  Sparkles,
  MapPin,
  Leaf,
  Info,
  Heart,
  Share2,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Product } from '../types';

export const ProductDetailsView: React.FC = () => {
  const {
    selectedProduct,
    setSelectedProduct,
    setActiveView,
    addToCart,
    cart,
    addReviewToProduct,
    currentUser,
    showToast,
  } = useApp();

  const [quantity, setQuantity] = useState(1);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [justAdded, setJustAdded] = useState(false);

  if (!selectedProduct) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <p className="text-slate-500 text-sm">Product not found.</p>
        <button
          onClick={() => setActiveView('products')}
          className="mt-4 px-4 py-2 rounded-xl bg-emerald-600 text-white font-bold text-xs"
        >
          Return to Marketplace
        </button>
      </div>
    );
  }

  const p = selectedProduct;
  const isOutOfStock = p.stock <= 0;

  // Bulk discount calculation
  const qualifiesForDiscount =
    p.bulkDiscountThreshold && p.bulkDiscountPercent && quantity >= p.bulkDiscountThreshold;
  const effectivePrice = qualifiesForDiscount
    ? Number((p.price * (1 - (p.bulkDiscountPercent || 0) / 100)).toFixed(2))
    : p.price;
  const totalItemCost = Number((effectivePrice * quantity).toFixed(2));

  const handleAddToCart = () => {
    if (isOutOfStock) return;
    addToCart(p, quantity);
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1500);
  };

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewComment.trim()) {
      showToast('Review Required', 'Please enter your thoughts before submitting.', 'warning');
      return;
    }
    addReviewToProduct(p.id, reviewRating, reviewComment);
    setReviewComment('');
    setShowReviewForm(false);
  };

  return (
    <div id="product-details-view" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 pb-24">
      {/* Back Button */}
      <button
        id="btn-back-to-products"
        onClick={() => setActiveView('products')}
        className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-slate-600 hover:text-[#2F4834] transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Farm Marketplace</span>
      </button>

      {/* Main Grid: Gallery + Product Info */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
        {/* Left Column: Image Gallery */}
        <div className="lg:col-span-6 space-y-4">
          <div className="relative aspect-4/3 w-full rounded-[2rem] bg-[#F7F7F2] overflow-hidden border border-[#E6E8E2] shadow-md">
            <img
              src={p.images[activeImageIndex] || p.images[0]}
              alt={p.title}
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />

            {/* Freshness & Organic Badges */}
            <div className="absolute top-4 left-4 flex flex-wrap gap-2 pointer-events-none">
              {p.isOrganic && (
                <span className="px-3 py-1 rounded-full bg-[#2F4834]/95 backdrop-blur-md text-[#DAD7CD] text-xs font-bold shadow-md flex items-center gap-1.5 border border-[#3A5A40]">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#A3B18A]" />
                  <span>100% Organic</span>
                </span>
              )}
              <span className="px-3 py-1 rounded-full bg-[#1E293B]/80 backdrop-blur-md text-[#DAD7CD] text-xs font-semibold shadow-md flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-[#A3B18A]" />
                <span>{p.harvestDate}</span>
              </span>
            </div>

            <div className="absolute top-4 right-4">
              <span className="px-3 py-1 rounded-full bg-amber-500 text-[#1E293B] text-xs font-extrabold shadow-md">
                {p.freshnessScore}% Freshness Score
              </span>
            </div>
          </div>

          {/* Thumbnail Strip */}
          {p.images.length > 1 && (
            <div className="flex items-center gap-3">
              {p.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImageIndex(idx)}
                  className={`w-20 h-20 rounded-2xl overflow-hidden border-2 transition-all ${
                    activeImageIndex === idx ? 'border-[#3A5A40] scale-105 shadow-md' : 'border-[#E6E8E2] opacity-70'
                  }`}
                >
                  <img src={img} alt="thumbnail" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                </button>
              ))}
            </div>
          )}

          {/* Storage & Shelf Life Info Card */}
          <div className="bg-[#FAF6ED] border border-[#EBE4D5] rounded-3xl p-5 space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#3A5A40] flex items-center gap-1.5 font-display">
              <Info className="w-4 h-4 text-[#3A5A40]" />
              <span>Farm Fresh Storage Tips</span>
            </h4>
            <p className="text-xs text-slate-700 leading-relaxed">
              {p.storageTip || 'Keep in a cool, ventilated dry area away from direct sunlight.'}
            </p>
            <div className="pt-2 flex items-center justify-between text-xs text-slate-500 border-t border-[#EBE4D5]">
              <span>Expected Fresh Shelf Life:</span>
              <span className="font-bold text-[#2F4834]">{p.shelfLifeDays} Days from Delivery</span>
            </div>
          </div>
        </div>

        {/* Right Column: Product Meta, Pricing, Farmer Info, Add to Cart */}
        <div className="lg:col-span-6 space-y-6">
          {/* Category & Farm Origin */}
          <div className="space-y-1">
            <div className="flex items-center justify-between text-xs text-[#3A5A40] font-bold">
              <span className="uppercase tracking-wider bg-[#EBF0E6] px-3 py-1 rounded-full border border-[#D5DEC9]">
                {p.category}
              </span>
              <div className="flex items-center gap-1 text-amber-500 font-bold">
                <Star className="w-4 h-4 fill-amber-400" />
                <span>{p.avgRating}</span>
                <span className="text-slate-400 font-normal">({p.reviewCount} customer reviews)</span>
              </div>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-display mt-2">
              {p.title}
            </h1>
          </div>

          {/* Price Block */}
          <div className="bg-white border border-[#E6E8E2] rounded-3xl p-6 space-y-3 shadow-xs">
            <div className="flex items-baseline justify-between">
              <div>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl sm:text-4xl font-extrabold text-slate-900 font-display">
                    ${effectivePrice.toFixed(2)}
                  </span>
                  <span className="text-sm font-semibold text-slate-500">per {p.unit}</span>
                  {qualifiesForDiscount && (
                    <span className="text-xs line-through text-slate-400">${p.price.toFixed(2)}</span>
                  )}
                </div>
                <p className="text-xs text-[#3A5A40] font-semibold mt-1">
                  100% Direct Farmer Pricing (Zero Retailer Markup)
                </p>
              </div>

              <div className="text-right">
                <span className={`text-xs font-bold px-3 py-1 rounded-full ${
                  p.stock > 10 ? 'bg-[#EBF0E6] text-[#2F4834] border border-[#D5DEC9]' : p.stock > 0 ? 'bg-amber-100 text-amber-900' : 'bg-rose-100 text-rose-900'
                }`}>
                  {p.stock > 0 ? `${p.stock} ${p.unit} in stock` : 'Sold Out Today'}
                </span>
              </div>
            </div>

            {/* Bulk Discount Notice */}
            {p.bulkDiscountThreshold && p.bulkDiscountPercent && (
              <div className="bg-[#FAF6ED] border border-[#EBE4D5] rounded-2xl p-3 text-xs text-amber-900 flex items-center justify-between">
                <span>
                  🔥 <strong>Bulk Saver:</strong> Buy {p.bulkDiscountThreshold}+ {p.unit} and get {p.bulkDiscountPercent}% OFF instantly!
                </span>
                {quantity >= p.bulkDiscountThreshold && (
                  <span className="font-bold text-[#3A5A40] flex items-center gap-1">
                    <Check className="w-3.5 h-3.5" /> Applied!
                  </span>
                )}
              </div>
            )}
          </div>

          {/* Product Description */}
          <div className="space-y-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">Harvest Details & Notes</h3>
            <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">{p.description}</p>
          </div>

          {/* Farmer & Farm Card */}
          <div className="bg-[#FAF6ED] border border-[#EBE4D5] rounded-3xl p-5 flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-[#3A5A40] text-white flex items-center justify-center font-bold text-lg shrink-0 shadow-sm">
              <Tractor className="w-6 h-6 text-[#DAD7CD]" />
            </div>
            <div className="flex-1 min-w-0">
              <span className="text-[10px] uppercase font-bold text-[#3A5A40] tracking-wider">Cultivated & Harvested By</span>
              <h4 className="text-sm font-bold text-slate-900 truncate font-display">{p.farmerName}</h4>
              <p className="text-xs text-slate-600 truncate flex items-center gap-1 mt-0.5">
                <MapPin className="w-3.5 h-3.5 text-[#3A5A40] shrink-0" />
                <span>{p.farmName} ({p.farmLocation})</span>
              </p>
            </div>
          </div>

          {/* Add To Cart Controls */}
          {!isOutOfStock ? (
            <div className="space-y-3 pt-2">
              <div className="flex items-center gap-3">
                <div className="flex items-center bg-white rounded-full p-1 border border-[#E6E8E2] shadow-xs">
                  <button
                    type="button"
                    onClick={() => setQuantity((prev) => Math.max(1, prev - 1))}
                    className="p-2.5 hover:bg-[#F7F7F2] text-slate-700 rounded-full transition-colors"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="px-4 text-base font-extrabold text-slate-900 min-w-10 text-center font-display">
                    {quantity} <span className="text-xs text-slate-500 font-normal">{p.unit}</span>
                  </span>
                  <button
                    type="button"
                    onClick={() => setQuantity((prev) => Math.min(p.stock, prev + 1))}
                    className="p-2.5 hover:bg-[#F7F7F2] text-slate-700 rounded-full transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>

                <button
                  id="btn-add-product-detail"
                  onClick={handleAddToCart}
                  className={`flex-1 py-3.5 px-6 rounded-full font-bold text-xs sm:text-sm shadow-md transition-all flex items-center justify-center gap-2 active:scale-98 ${
                    justAdded
                      ? 'bg-[#2F4834] text-white'
                      : 'bg-[#3A5A40] hover:bg-[#2F4834] text-white'
                  }`}
                >
                  {justAdded ? (
                    <>
                      <Check className="w-5 h-5 text-[#DAD7CD]" />
                      <span>Added to Basket!</span>
                    </>
                  ) : (
                    <>
                      <ShoppingBag className="w-5 h-5" />
                      <span>Add {quantity} {p.unit} • ${totalItemCost.toFixed(2)}</span>
                    </>
                  )}
                </button>
              </div>

              <div className="flex items-center justify-between text-xs text-slate-500 pt-1">
                <span>⚡ Same-day morning harvest & direct dispatch</span>
                <span>🔒 Fresh Guarantee</span>
              </div>
            </div>
          ) : (
            <div className="bg-rose-50 border border-rose-200 rounded-2xl p-4 text-center text-rose-800 text-xs font-bold">
              This harvest is completely sold out for today. Fresh picking resumes tomorrow morning!
            </div>
          )}
        </div>
      </div>

      {/* Verified Reviews Section */}
      <section className="pt-8 border-t border-[#E6E8E2] space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 font-display">
              Verified Buyer Reviews
            </h2>
            <p className="text-xs sm:text-sm text-slate-500">
              Direct ratings from consumers who tasted this harvest
            </p>
          </div>

          <button
            onClick={() => setShowReviewForm(!showReviewForm)}
            className="px-5 py-2.5 rounded-full bg-[#3A5A40] hover:bg-[#2F4834] text-white text-xs font-bold transition-colors flex items-center gap-1.5 self-start sm:self-auto shadow-xs"
          >
            <MessageSquare className="w-4 h-4" />
            <span>{showReviewForm ? 'Cancel Review' : 'Write a Review'}</span>
          </button>
        </div>

        {/* Review Form */}
        {showReviewForm && (
          <form
            onSubmit={handleReviewSubmit}
            className="bg-white rounded-3xl border border-[#E6E8E2] p-6 space-y-4 shadow-md max-w-xl animate-in fade-in"
          >
            <h3 className="font-bold text-slate-900 text-sm font-display">Write a Verified Review for {p.title}</h3>
            
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Your Rating</label>
              <div className="flex items-center gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setReviewRating(star)}
                    className="p-1 text-amber-400 hover:scale-110 transition-transform"
                  >
                    <Star
                      className={`w-6 h-6 ${star <= reviewRating ? 'fill-amber-400 text-amber-400' : 'text-slate-300'}`}
                    />
                  </button>
                ))}
                <span className="text-xs font-bold text-slate-700 ml-2">{reviewRating} out of 5 Stars</span>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Your Feedback & Taste Experience</label>
              <textarea
                value={reviewComment}
                onChange={(e) => setReviewComment(e.target.value)}
                placeholder="Share how fresh the produce tasted, crispness, aroma, or how you cooked it..."
                rows={3}
                className="w-full px-3.5 py-2.5 text-xs rounded-2xl border border-[#E6E8E2] focus:border-[#3A5A40] focus:ring-1 focus:ring-[#3A5A40] outline-none"
              />
            </div>

            <button
              type="submit"
              className="px-5 py-2.5 rounded-full bg-[#3A5A40] hover:bg-[#2F4834] text-white font-bold text-xs shadow-sm transition-colors"
            >
              Post Verified Review
            </button>
          </form>
        )}

        {/* Reviews List */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {p.ratings.length === 0 ? (
            <div className="md:col-span-2 bg-[#F7F7F2] rounded-3xl p-8 text-center text-slate-400 text-xs">
              No reviews yet for this harvest. Be the first consumer to review!
            </div>
          ) : (
            p.ratings.map((rev) => (
              <div
                key={rev.id}
                className="bg-white rounded-3xl border border-[#E6E8E2] p-5 space-y-3 shadow-2xs"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <img
                      src={rev.userAvatar}
                      alt={rev.userName}
                      className="w-8 h-8 rounded-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                    <div>
                      <p className="font-bold text-xs text-slate-900">{rev.userName}</p>
                      <span className="text-[10px] text-[#3A5A40] font-semibold flex items-center gap-1">
                        <Check className="w-3 h-3" /> Verified Purchase
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center text-amber-400">
                    {Array.from({ length: rev.rating }).map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />
                    ))}
                  </div>
                </div>

                <p className="text-xs text-slate-700 leading-relaxed">{rev.comment}</p>

                {rev.farmerReply && (
                  <div className="bg-[#EBF0E6] rounded-2xl p-3 border-l-3 border-[#3A5A40] text-xs text-[#2F4834] space-y-1">
                    <span className="font-bold text-[10px] text-[#3A5A40] uppercase tracking-wider block">
                      👨🌾 Farmer Reply ({p.farmerName})
                    </span>
                    <p className="text-[11px] text-[#588157] italic">"{rev.farmerReply}"</p>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </section>
    </div>
  );
};
