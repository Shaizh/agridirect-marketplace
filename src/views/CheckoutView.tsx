import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import {
  MapPin,
  Clock,
  CreditCard,
  QrCode,
  Banknote,
  ShieldCheck,
  CheckCircle2,
  ArrowLeft,
  Truck,
  Sparkles,
  Loader2,
  Lock,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { PaymentMethod } from '../types';

export const CheckoutView: React.FC = () => {
  const {
    currentUser,
    cart,
    cartSubtotal,
    cartTotal,
    cartSavings,
    placeOrder,
    setActiveView,
    showToast,
  } = useApp();

  const [street, setStreet] = useState(currentUser.address?.street || '452 Elmwood Avenue, Apt 4B');
  const [city, setCity] = useState(currentUser.address?.city || 'Metro City');
  const [state, setState] = useState(currentUser.address?.state || 'California');
  const [pincode, setPincode] = useState(currentUser.address?.pincode || '94107');
  const [landmark, setLandmark] = useState(currentUser.address?.landmark || 'Opposite Community Library');
  const [deliverySlot, setDeliverySlot] = useState('Morning Fresh Delivery (7:00 AM - 10:00 AM)');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('upi');
  const [notes, setNotes] = useState('Please place in insulated crate on porch.');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (cart.length === 0) {
    return (
      <div className="max-w-xl mx-auto px-4 py-16 text-center space-y-4">
        <h2 className="text-xl font-bold text-slate-900">Your Basket is Empty</h2>
        <p className="text-xs text-slate-500">Please add farm produce to your basket before checkout.</p>
        <button
          onClick={() => setActiveView('products')}
          className="px-4 py-2 rounded-xl bg-emerald-600 text-white text-xs font-bold"
        >
          Browse Marketplace
        </button>
      </div>
    );
  }

  const handlePlaceOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!street || !city || !pincode) {
      showToast('Incomplete Address', 'Please fill in all address fields.', 'warning');
      return;
    }

    setIsSubmitting(true);

    setTimeout(() => {
      const order = placeOrder({
        deliveryAddress: { street, city, state, pincode, landmark },
        deliverySlot,
        paymentMethod,
        notes,
      });

      // Fire celebratory confetti!
      try {
        confetti({
          particleCount: 120,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#16a34a', '#10b981', '#f59e0b', '#3b82f6'],
        });
      } catch {
        // Fallback
      }

      setIsSubmitting(false);
      setActiveView('order-tracking');
    }, 900);
  };

  const deliveryFee = cartSubtotal > 30 ? 0 : 2.5;

  return (
    <div id="checkout-view" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 pb-24">
      {/* Header */}
      <div className="pb-4 border-b border-[#E6E8E2]">
        <button
          onClick={() => setActiveView('cart')}
          className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-[#2F4834] font-semibold mb-1"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Basket</span>
        </button>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-display">
          Direct Farm Checkout
        </h1>
        <p className="text-xs sm:text-sm text-slate-500">
          Complete your delivery details to schedule tomorrow's sunrise harvest
        </p>
      </div>

      <form onSubmit={handlePlaceOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Side: Address, Time Slot & Payment Methods */}
        <div className="lg:col-span-7 space-y-6">
          {/* 1. Delivery Address */}
          <div className="bg-white rounded-3xl border border-[#E6E8E2] p-6 space-y-4 shadow-xs">
            <div className="flex items-center gap-2 text-slate-900 font-bold text-sm border-b border-[#E6E8E2] pb-3 font-display">
              <MapPin className="w-4 h-4 text-[#3A5A40]" />
              <span>1. Doorstep Delivery Address</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-slate-700 mb-1">Street Address</label>
                <input
                  type="text"
                  required
                  value={street}
                  onChange={(e) => setStreet(e.target.value)}
                  placeholder="e.g. 452 Elmwood Avenue, Apt 4B"
                  className="w-full px-3.5 py-2.5 text-xs rounded-2xl border border-[#E6E8E2] focus:border-[#3A5A40] outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">City</label>
                <input
                  type="text"
                  required
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="Metro City"
                  className="w-full px-3.5 py-2.5 text-xs rounded-2xl border border-[#E6E8E2] focus:border-[#3A5A40] outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">State & Zip/Pincode</label>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    required
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    placeholder="State"
                    className="w-full px-3.5 py-2.5 text-xs rounded-2xl border border-[#E6E8E2] focus:border-[#3A5A40] outline-none"
                  />
                  <input
                    type="text"
                    required
                    value={pincode}
                    onChange={(e) => setPincode(e.target.value)}
                    placeholder="94107"
                    className="w-full px-3.5 py-2.5 text-xs rounded-2xl border border-[#E6E8E2] focus:border-[#3A5A40] outline-none"
                  />
                </div>
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-slate-700 mb-1">Landmark / Gate Instructions</label>
                <input
                  type="text"
                  value={landmark}
                  onChange={(e) => setLandmark(e.target.value)}
                  placeholder="e.g. Opposite Community Library, Gate Code #4412"
                  className="w-full px-3.5 py-2.5 text-xs rounded-2xl border border-[#E6E8E2] focus:border-[#3A5A40] outline-none"
                />
              </div>
            </div>
          </div>

          {/* 2. Scheduled Harvest Delivery Slot */}
          <div className="bg-white rounded-3xl border border-[#E6E8E2] p-6 space-y-4 shadow-xs">
            <div className="flex items-center gap-2 text-slate-900 font-bold text-sm border-b border-[#E6E8E2] pb-3 font-display">
              <Clock className="w-4 h-4 text-[#3A5A40]" />
              <span>2. Scheduled Harvest Delivery Slot</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <label
                className={`p-4 rounded-3xl border cursor-pointer transition-all flex items-start gap-3 ${
                  deliverySlot.includes('Morning')
                    ? 'border-[#3A5A40] bg-[#FAF6ED] shadow-xs'
                    : 'border-[#E6E8E2] hover:bg-[#FAF6ED]'
                }`}
              >
                <input
                  type="radio"
                  name="slot"
                  checked={deliverySlot.includes('Morning')}
                  onChange={() => setDeliverySlot('Morning Fresh Delivery (7:00 AM - 10:00 AM)')}
                  className="mt-0.5 text-[#3A5A40] focus:ring-[#3A5A40]"
                />
                <div>
                  <span className="font-bold text-xs text-slate-900 block font-display">Morning Harvest (7:00 - 10:00 AM)</span>
                  <span className="text-[11px] text-slate-500 block mt-0.5">
                    Picked at sunrise 6 AM, arrives crisp for breakfast.
                  </span>
                </div>
              </label>

              <label
                className={`p-4 rounded-3xl border cursor-pointer transition-all flex items-start gap-3 ${
                  deliverySlot.includes('Evening')
                    ? 'border-[#3A5A40] bg-[#FAF6ED] shadow-xs'
                    : 'border-[#E6E8E2] hover:bg-[#FAF6ED]'
                }`}
              >
                <input
                  type="radio"
                  name="slot"
                  checked={deliverySlot.includes('Evening')}
                  onChange={() => setDeliverySlot('Evening Fresh Delivery (5:00 PM - 8:00 PM)')}
                  className="mt-0.5 text-[#3A5A40] focus:ring-[#3A5A40]"
                />
                <div>
                  <span className="font-bold text-xs text-slate-900 block font-display">Evening Harvest (5:00 - 8:00 PM)</span>
                  <span className="text-[11px] text-slate-500 block mt-0.5">
                    Afternoon field pick, ideal for evening dinner.
                  </span>
                </div>
              </label>
            </div>
          </div>

          {/* 3. Payment Method */}
          <div className="bg-white rounded-3xl border border-[#E6E8E2] p-6 space-y-4 shadow-xs">
            <div className="flex items-center gap-2 text-slate-900 font-bold text-sm border-b border-[#E6E8E2] pb-3 font-display">
              <CreditCard className="w-4 h-4 text-[#3A5A40]" />
              <span>3. Payment Options</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <label
                className={`p-4 rounded-3xl border cursor-pointer transition-all flex flex-col justify-between gap-2 ${
                  paymentMethod === 'upi' ? 'border-[#3A5A40] bg-[#FAF6ED] shadow-xs' : 'border-[#E6E8E2] hover:bg-[#FAF6ED]'
                }`}
              >
                <div className="flex items-center justify-between">
                  <QrCode className="w-5 h-5 text-[#3A5A40]" />
                  <input
                    type="radio"
                    name="payment"
                    checked={paymentMethod === 'upi'}
                    onChange={() => setPaymentMethod('upi')}
                    className="text-[#3A5A40]"
                  />
                </div>
                <div>
                  <span className="font-bold text-xs text-slate-900 block font-display">UPI / Instant QR</span>
                  <span className="text-[10px] text-slate-500">Google Pay, PhonePe, UPI</span>
                </div>
              </label>

              <label
                className={`p-4 rounded-3xl border cursor-pointer transition-all flex flex-col justify-between gap-2 ${
                  paymentMethod === 'card' ? 'border-[#3A5A40] bg-[#FAF6ED] shadow-xs' : 'border-[#E6E8E2] hover:bg-[#FAF6ED]'
                }`}
              >
                <div className="flex items-center justify-between">
                  <CreditCard className="w-5 h-5 text-[#3A5A40]" />
                  <input
                    type="radio"
                    name="payment"
                    checked={paymentMethod === 'card'}
                    onChange={() => setPaymentMethod('card')}
                    className="text-[#3A5A40]"
                  />
                </div>
                <div>
                  <span className="font-bold text-xs text-slate-900 block font-display">Card Payment</span>
                  <span className="text-[10px] text-slate-500">Visa, Mastercard, Amex</span>
                </div>
              </label>

              <label
                className={`p-4 rounded-3xl border cursor-pointer transition-all flex flex-col justify-between gap-2 ${
                  paymentMethod === 'cod' ? 'border-[#3A5A40] bg-[#FAF6ED] shadow-xs' : 'border-[#E6E8E2] hover:bg-[#FAF6ED]'
                }`}
              >
                <div className="flex items-center justify-between">
                  <Banknote className="w-5 h-5 text-amber-600" />
                  <input
                    type="radio"
                    name="payment"
                    checked={paymentMethod === 'cod'}
                    onChange={() => setPaymentMethod('cod')}
                    className="text-[#3A5A40]"
                  />
                </div>
                <div>
                  <span className="font-bold text-xs text-slate-900 block font-display">Cash on Delivery</span>
                  <span className="text-[10px] text-slate-500">Pay driver at door</span>
                </div>
              </label>
            </div>
          </div>
        </div>

        {/* Right Side: Order Summary & Place Order Button */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white rounded-3xl border border-[#E6E8E2] p-6 space-y-5 shadow-sm sticky top-24">
            <h2 className="text-lg font-bold text-slate-900 font-display border-b border-[#E6E8E2] pb-3">
              Order Review
            </h2>

            {/* List of items summary */}
            <div className="max-h-48 overflow-y-auto space-y-2.5 divide-y divide-[#E6E8E2] pr-1">
              {cart.map((item) => (
                <div key={item.productId} className="pt-2 first:pt-0 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2 flex-1 min-w-0">
                    <img
                      src={item.product.images[0]}
                      alt={item.product.title}
                      className="w-8 h-8 rounded-xl object-cover"
                      referrerPolicy="no-referrer"
                    />
                    <div className="truncate">
                      <p className="font-bold text-slate-900 truncate">{item.product.title}</p>
                      <p className="text-[10px] text-slate-500">
                        {item.quantity} {item.selectedUnit} × ${item.product.price.toFixed(2)}
                      </p>
                    </div>
                  </div>
                  <span className="font-extrabold text-[#2F4834] ml-2 font-display">
                    ${(item.product.price * item.quantity).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>

            {/* Financials */}
            <div className="space-y-2 pt-3 border-t border-[#E6E8E2] text-xs text-slate-600">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-bold text-slate-900">${cartSubtotal.toFixed(2)}</span>
              </div>
              {cartSavings > 0 && (
                <div className="flex justify-between text-[#3A5A40] font-semibold">
                  <span>Bulk Discount</span>
                  <span>-${cartSavings.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Farm Delivery Van</span>
                <span className="font-bold text-slate-900">{deliveryFee === 0 ? 'FREE' : `$${deliveryFee}`}</span>
              </div>
              <div className="pt-2 border-t border-[#E6E8E2] flex justify-between text-base font-extrabold text-slate-900">
                <span>Total Payable</span>
                <span className="text-2xl font-display text-[#2F4834]">${cartTotal.toFixed(2)}</span>
              </div>
            </div>

            {/* Submit Button */}
            <button
              id="btn-confirm-place-order"
              type="submit"
              disabled={isSubmitting}
              className="w-full py-4 rounded-full bg-[#3A5A40] hover:bg-[#2F4834] text-white font-bold text-xs sm:text-sm shadow-md transition-all transform active:scale-98 flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Transmitting Harvest Order to Farmers...</span>
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-5 h-5 text-[#DAD7CD]" />
                  <span>Place Direct Farm Order (${cartTotal.toFixed(2)})</span>
                </>
              )}
            </button>

            <div className="flex items-center justify-center gap-2 text-[11px] text-slate-400">
              <Lock className="w-3.5 h-3.5 text-[#3A5A40]" />
              <span>Direct Encrypted Farmer Payout Guarantee</span>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};
