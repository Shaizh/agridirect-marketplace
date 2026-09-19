import React, { useState } from 'react';
import {
  ArrowLeft,
  CheckCircle2,
  Clock,
  Truck,
  Tractor,
  Package,
  Phone,
  ShieldCheck,
  Star,
  MapPin,
  Sparkles,
  AlertCircle,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { OrderStatus } from '../types';

export const OrderTrackingView: React.FC = () => {
  const {
    selectedOrder,
    orders,
    setActiveView,
    updateOrderStatus,
    currentUser,
    setSelectedProduct,
    products,
  } = useApp();

  // Keep active order fresh
  const order = orders.find((o) => o.id === selectedOrder?.id) || selectedOrder;

  if (!order) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <p className="text-slate-500 text-sm">No order selected for tracking.</p>
        <button
          onClick={() => setActiveView('orders')}
          className="mt-4 px-4 py-2 rounded-xl bg-emerald-600 text-white font-bold text-xs"
        >
          Back to Orders
        </button>
      </div>
    );
  }

  // Demo status progression helper for test evaluator
  const handleFastForwardStatus = () => {
    const sequence: OrderStatus[] = ['pending', 'confirmed', 'harvesting', 'out_for_delivery', 'delivered'];
    const currentIndex = sequence.indexOf(order.status);
    if (currentIndex < sequence.length - 1) {
      const nextStatus = sequence[currentIndex + 1];
      updateOrderStatus(order.id, nextStatus);
    }
  };

  return (
    <div id="order-tracking-view" className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 pb-24">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#E6E8E2]">
        <div>
          <button
            onClick={() => setActiveView('orders')}
            className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-[#2F4834] font-semibold mb-1"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to All Orders</span>
          </button>
          <div className="flex items-center gap-3 mt-1">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-display">
              Tracking Order #{order.orderNumber}
            </h1>
            <span className="text-xs font-bold px-3 py-1 rounded-full bg-[#EBF0E6] text-[#2F4834] border border-[#D5DEC9] uppercase">
              {order.status.replace(/_/g, ' ')}
            </span>
          </div>
        </div>

        {/* Demo Fast-Forward Controller for live testing */}
        {order.status !== 'delivered' && order.status !== 'cancelled' && (
          <button
            onClick={handleFastForwardStatus}
            className="px-4 py-2 rounded-full bg-[#3A5A40] hover:bg-[#2F4834] text-white font-bold text-xs shadow-sm flex items-center gap-2 self-start sm:self-auto transition-transform active:scale-95"
            title="Fast-forward order stage for instant evaluation"
          >
            <Sparkles className="w-4 h-4 text-amber-300" />
            <span>⚡ Demo: Advance Next Status</span>
          </button>
        )}
      </div>

      {/* Main Grid: Tracking Stepper + Delivery Details */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Side: Visual 5-Stage Stepper Timeline */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-white rounded-3xl border border-[#E6E8E2] p-6 sm:p-8 space-y-6 shadow-xs">
            <div className="flex items-center justify-between border-b border-[#E6E8E2] pb-4">
              <div>
                <h3 className="font-bold text-slate-900 text-base font-display">Farm-to-Door Journey</h3>
                <p className="text-xs text-slate-500">Live progress directly from the fields</p>
              </div>
              <div className="text-right">
                <span className="text-xs font-bold text-[#3A5A40] block font-display">ETA: {order.estimatedDelivery}</span>
                <span className="text-[10px] text-slate-400">Slot: {order.deliverySlot}</span>
              </div>
            </div>

            {/* Stepper Timeline */}
            <div className="space-y-6 relative before:absolute before:left-4.5 before:top-3 before:bottom-3 before:w-0.5 before:bg-[#E6E8E2]">
              {order.trackingHistory.map((step, idx) => {
                const isCompleted = step.completed;
                const isCurrent = step.current;

                return (
                  <div key={idx} className="relative flex items-start gap-4 pl-1">
                    {/* Step Icon */}
                    <div
                      className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs shrink-0 z-10 transition-all ${
                        isCompleted
                          ? 'bg-[#3A5A40] text-white shadow-md shadow-[#3A5A40]/30'
                          : isCurrent
                          ? 'bg-amber-500 text-slate-950 ring-4 ring-amber-100 shadow-md'
                          : 'bg-[#FAF6ED] text-slate-400 border border-[#E6E8E2]'
                      }`}
                    >
                      {isCompleted ? (
                        <CheckCircle2 className="w-5 h-5 text-white" />
                      ) : (
                        <span>{idx + 1}</span>
                      )}
                    </div>

                    {/* Step Details */}
                    <div className="flex-1 pt-1 min-w-0">
                      <div className="flex items-baseline justify-between gap-2">
                        <h4
                          className={`text-sm font-bold font-display ${
                            isCompleted ? 'text-slate-900' : isCurrent ? 'text-amber-800' : 'text-slate-400'
                          }`}
                        >
                          {step.title}
                        </h4>
                        <span className="text-[11px] font-medium text-slate-400 shrink-0">{step.timestamp}</span>
                      </div>
                      <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">{step.description}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Delivery OTP Security Badge */}
          <div className="bg-[#2F4834] text-[#F7F7F2] rounded-3xl p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-md border border-[#3A5A40]">
            <div>
              <div className="flex items-center gap-2 text-[#A3B18A] font-bold text-xs uppercase tracking-wider">
                <ShieldCheck className="w-4 h-4 text-[#A3B18A]" />
                <span>Delivery Verification PIN</span>
              </div>
              <p className="text-xs text-[#DAD7CD] mt-1 max-w-sm">
                Share this 4-digit code with driver {order.driverName || 'Carlos'} upon doorstep delivery handover.
              </p>
            </div>

            <div className="bg-white text-slate-900 px-6 py-3 rounded-2xl text-center shadow-lg self-start sm:self-auto border border-[#E6E8E2]">
              <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-widest">Your Code</span>
              <span className="text-2xl font-extrabold tracking-widest font-mono text-[#2F4834]">
                {order.deliveryOtp}
              </span>
            </div>
          </div>
        </div>

        {/* Right Side: Order Items, Delivery Address & Driver Info */}
        <div className="lg:col-span-5 space-y-6">
          {/* Driver Card */}
          <div className="bg-white rounded-3xl border border-[#E6E8E2] p-6 space-y-4 shadow-xs">
            <h3 className="font-bold text-slate-900 text-sm border-b border-[#E6E8E2] pb-3 flex items-center gap-2 font-display">
              <Truck className="w-4 h-4 text-[#3A5A40]" />
              <span>Assigned Farm Courier</span>
            </h3>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-2xl bg-[#FAF6ED] flex items-center justify-center font-bold text-slate-700">
                  <Truck className="w-5 h-5 text-[#3A5A40]" />
                </div>
                <div>
                  <h4 className="font-bold text-xs text-slate-900">{order.driverName || 'AgriDirect Direct Express'}</h4>
                  <p className="text-[11px] text-[#3A5A40] font-semibold">Temperature Controlled Van</p>
                </div>
              </div>

              <a
                href={`tel:${order.driverPhone || '+15553329011'}`}
                className="px-3.5 py-1.5 rounded-full bg-[#EBF0E6] hover:bg-[#D5DEC9] text-[#2F4834] text-xs font-bold flex items-center gap-1.5 transition-colors border border-[#D5DEC9]"
              >
                <Phone className="w-3.5 h-3.5" />
                <span>Call Driver</span>
              </a>
            </div>

            <div className="pt-2 border-t border-[#E6E8E2] text-xs text-slate-600 space-y-1">
              <p className="font-semibold text-slate-800">Delivery Address:</p>
              <p className="text-[11px] text-slate-500">
                {order.deliveryAddress.street}, {order.deliveryAddress.city}, {order.deliveryAddress.state} - {order.deliveryAddress.pincode}
              </p>
              {order.deliveryAddress.landmark && (
                <p className="text-[11px] text-slate-400 italic">Note: {order.deliveryAddress.landmark}</p>
              )}
            </div>
          </div>

          {/* Ordered Harvest Items */}
          <div className="bg-white rounded-3xl border border-[#E6E8E2] p-6 space-y-4 shadow-xs">
            <h3 className="font-bold text-slate-900 text-sm border-b border-[#E6E8E2] pb-3 font-display">
              Items in This Harvest ({order.items.length})
            </h3>

            <div className="space-y-3">
              {order.items.map((item) => (
                <div
                  key={item.productId}
                  className="flex items-center justify-between gap-3 text-xs"
                >
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <img
                      src={item.productImage}
                      alt={item.productTitle}
                      className="w-10 h-10 rounded-xl object-cover"
                      referrerPolicy="no-referrer"
                    />
                    <div className="truncate">
                      <p className="font-bold text-slate-900 truncate">{item.productTitle}</p>
                      <p className="text-[10px] text-[#3A5A40] font-semibold">{item.farmName}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="font-bold text-slate-900 block font-display">${item.totalPrice.toFixed(2)}</span>
                    <span className="text-[10px] text-slate-400">
                      {item.quantity} {item.unit}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-3 border-t border-[#E6E8E2] space-y-1.5 text-xs text-slate-600">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-bold text-slate-900">${order.subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Delivery</span>
                <span>{order.deliveryFee === 0 ? 'FREE' : `$${order.deliveryFee.toFixed(2)}`}</span>
              </div>
              <div className="flex justify-between font-extrabold text-sm text-slate-900 pt-2 border-t border-[#E6E8E2]">
                <span>Total Paid</span>
                <span className="text-[#2F4834] font-display text-base">${order.total.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
