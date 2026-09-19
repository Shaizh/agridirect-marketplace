import React from 'react';
import {
  ShoppingBag,
  Trash2,
  Plus,
  Minus,
  ArrowRight,
  ShieldCheck,
  Tractor,
  Sparkles,
  ArrowLeft,
  CheckCircle2,
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const CartView: React.FC = () => {
  const {
    cart,
    cartCount,
    cartSubtotal,
    cartTotal,
    cartSavings,
    updateCartQuantity,
    removeFromCart,
    clearCart,
    setActiveView,
    setSelectedProduct,
  } = useApp();

  if (cart.length === 0) {
    return (
      <div id="empty-cart-view" className="max-w-3xl mx-auto px-4 py-20 text-center space-y-6">
        <div className="w-24 h-24 rounded-full bg-[#EBF0E6] text-[#3A5A40] mx-auto flex items-center justify-center border border-[#D5DEC9] shadow-xs">
          <ShoppingBag className="w-10 h-10" />
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-slate-900 font-display">Your Farm Basket is Empty</h2>
          <p className="text-sm text-slate-500 max-w-sm mx-auto">
            Discover morning-harvested organic tomatoes, sweet apples, heirloom grains, and raw honey directly from local family growers.
          </p>
        </div>
        <button
          id="btn-explore-harvests-empty"
          onClick={() => setActiveView('products')}
          className="px-6 py-3.5 rounded-full bg-[#3A5A40] hover:bg-[#2F4834] text-white font-bold text-sm shadow-md transition-transform active:scale-95"
        >
          Explore Fresh Harvests
        </button>
      </div>
    );
  }

  const deliveryFee = cartSubtotal > 30 ? 0 : 2.5;
  const farmerShareAmount = Number((cartTotal * 0.9).toFixed(2));

  return (
    <div id="cart-view" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 pb-24">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#E6E8E2]">
        <div>
          <button
            onClick={() => setActiveView('products')}
            className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-[#3A5A40] font-semibold mb-1 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Continue Shopping</span>
          </button>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-display">
            Your Farm Basket ({cartCount} {cartCount === 1 ? 'item' : 'items'})
          </h1>
        </div>

        <button
          onClick={clearCart}
          className="text-xs text-rose-600 hover:text-rose-700 font-semibold flex items-center gap-1 self-start sm:self-auto"
        >
          <Trash2 className="w-3.5 h-3.5" />
          <span>Clear Basket</span>
        </button>
      </div>

      {/* Cart Content: Items List + Order Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Items List */}
        <div className="lg:col-span-7 space-y-4">
          {cart.map((item) => {
            const p = item.product;
            const itemTotal = Number((p.price * item.quantity).toFixed(2));
            return (
              <div
                key={item.productId}
                id={`cart-item-${item.productId}`}
                className="bg-white rounded-3xl border border-[#E6E8E2] p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xs"
              >
                {/* Product Image & Meta */}
                <div className="flex items-center gap-4 flex-1 min-w-0">
                  <img
                    src={p.images[0]}
                    alt={p.title}
                    onClick={() => {
                      setSelectedProduct(p);
                      setActiveView('product-details');
                    }}
                    className="w-20 h-20 rounded-2xl object-cover border border-[#E6E8E2] cursor-pointer hover:opacity-90 transition-opacity shrink-0"
                    referrerPolicy="no-referrer"
                  />
                  <div className="min-w-0 flex-1">
                    <span className="text-[10px] uppercase font-bold text-[#3A5A40] tracking-wider flex items-center gap-1">
                      <Tractor className="w-3 h-3" />
                      <span className="truncate">{p.farmName}</span>
                    </span>
                    <h3
                      onClick={() => {
                        setSelectedProduct(p);
                        setActiveView('product-details');
                      }}
                      className="font-bold text-slate-900 text-sm hover:text-[#3A5A40] transition-colors cursor-pointer truncate font-display"
                    >
                      {p.title}
                    </h3>
                    <p className="text-xs text-slate-500 mt-0.5">
                      ${p.price.toFixed(2)} / {p.unit}
                    </p>
                    {p.isOrganic && (
                      <span className="inline-block mt-1 text-[10px] font-bold text-[#2F4834] bg-[#EBF0E6] border border-[#D5DEC9] px-2 py-0.5 rounded-full">
                        🌿 Organic
                      </span>
                    )}
                  </div>
                </div>

                {/* Quantity Controls & Line Total */}
                <div className="flex items-center justify-between sm:justify-end gap-5 w-full sm:w-auto pt-2 sm:pt-0 border-t sm:border-t-0 border-[#E6E8E2]">
                  <div className="flex items-center bg-[#FAF6ED] rounded-full p-1 border border-[#EBE4D5]">
                    <button
                      type="button"
                      onClick={() => updateCartQuantity(item.productId, item.quantity - 1)}
                      className="p-1.5 hover:bg-white text-slate-700 rounded-full transition-colors"
                      aria-label="Decrease quantity"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="px-3 text-xs font-bold text-slate-900 min-w-8 text-center">
                      {item.quantity} {item.selectedUnit}
                    </span>
                    <button
                      type="button"
                      onClick={() => updateCartQuantity(item.productId, item.quantity + 1)}
                      className="p-1.5 hover:bg-white text-slate-700 rounded-full transition-colors"
                      aria-label="Increase quantity"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="text-right min-w-16">
                    <span className="text-base font-extrabold text-[#2F4834] font-display">
                      ${itemTotal.toFixed(2)}
                    </span>
                  </div>

                  <button
                    onClick={() => removeFromCart(item.productId)}
                    className="p-2 text-slate-400 hover:text-rose-600 transition-colors"
                    title="Remove item"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Order Summary & Farmer Transparency Card */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white rounded-[2rem] border border-[#E6E8E2] p-6 space-y-5 shadow-sm">
            <h2 className="text-lg font-bold text-slate-900 font-display border-b border-[#E6E8E2] pb-3">
              Order Pricing Breakdown
            </h2>

            <div className="space-y-3 text-xs">
              <div className="flex items-center justify-between text-slate-600">
                <span>Produce Subtotal</span>
                <span className="font-bold text-slate-900">${cartSubtotal.toFixed(2)}</span>
              </div>

              {cartSavings > 0 && (
                <div className="flex items-center justify-between text-[#2F4834] font-semibold bg-[#EBF0E6] p-2.5 rounded-2xl border border-[#D5DEC9]">
                  <span>Bulk Farm Discounts</span>
                  <span>-${cartSavings.toFixed(2)}</span>
                </div>
              )}

              <div className="flex items-center justify-between text-slate-600">
                <div className="flex items-center gap-1">
                  <span>Direct Farm Van Delivery</span>
                  {cartSubtotal > 30 && (
                    <span className="text-[10px] bg-[#EBF0E6] text-[#2F4834] border border-[#D5DEC9] font-bold px-2 py-0.5 rounded-full">
                      FREE over $30
                    </span>
                  )}
                </div>
                <span className="font-bold text-slate-900">
                  {deliveryFee === 0 ? 'FREE' : `$${deliveryFee.toFixed(2)}`}
                </span>
              </div>

              <div className="pt-3 border-t border-[#E6E8E2] flex items-baseline justify-between text-base font-extrabold text-slate-900">
                <span>Total Amount</span>
                <span className="text-2xl font-display text-[#2F4834]">${cartTotal.toFixed(2)}</span>
              </div>
            </div>

            {/* Farmer Impact Callout */}
            <div className="bg-[#2F4834] text-[#F7F7F2] rounded-3xl p-5 space-y-2 border border-[#3A5A40]">
              <div className="flex items-center gap-2 text-[#A3B18A] font-bold text-xs">
                <CheckCircle2 className="w-4 h-4 text-[#A3B18A]" />
                <span>100% Direct Transparency</span>
              </div>
              <p className="text-[11px] text-[#DAD7CD] leading-relaxed">
                <strong className="text-white">${farmerShareAmount.toFixed(2)} (90%)</strong> goes directly to your farmers' verified bank accounts within 24 hours of harvest.
              </p>
            </div>

            {/* Proceed to Checkout CTA */}
            <button
              id="btn-proceed-to-checkout"
              onClick={() => setActiveView('checkout')}
              className="w-full py-4 rounded-full bg-[#3A5A40] hover:bg-[#2F4834] text-white font-bold text-sm shadow-md transition-all transform active:scale-98 flex items-center justify-center gap-2"
            >
              <span>Proceed to Checkout</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <div className="text-center">
              <span className="text-[11px] text-slate-400 flex items-center justify-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-[#3A5A40]" />
                <span>Safe Delivery with PIN Verification</span>
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
