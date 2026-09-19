import React from 'react';
import {
  Package,
  Clock,
  CheckCircle2,
  Truck,
  ChevronRight,
  Sparkles,
  ShoppingBag,
  Star,
  MapPin,
  Tractor,
  AlertCircle,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Order, OrderStatus } from '../types';

export const OrdersView: React.FC = () => {
  const {
    orders,
    currentUser,
    setSelectedOrder,
    setActiveView,
    setSelectedProduct,
    products,
  } = useApp();

  // Filter orders for the current consumer (or show all if admin/farmer)
  const userOrders =
    currentUser.role === 'consumer'
      ? orders.filter((o) => o.consumerId === currentUser.id || o.consumerEmail === currentUser.email)
      : orders;

  const getStatusBadge = (status: OrderStatus) => {
    switch (status) {
      case 'delivered':
        return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'out_for_delivery':
        return 'bg-blue-100 text-blue-800 border-blue-200 animate-pulse';
      case 'harvesting':
        return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'confirmed':
        return 'bg-teal-100 text-teal-800 border-teal-200';
      case 'cancelled':
        return 'bg-rose-100 text-rose-800 border-rose-200';
      default:
        return 'bg-slate-100 text-slate-800 border-slate-200';
    }
  };

  const getStatusText = (status: OrderStatus) => {
    switch (status) {
      case 'delivered':
        return 'Delivered Fresh';
      case 'out_for_delivery':
        return 'Out for Delivery 🚚';
      case 'harvesting':
        return 'Harvesting in Field 🚜';
      case 'confirmed':
        return 'Farmer Confirmed';
      case 'cancelled':
        return 'Cancelled';
      default:
        return 'Order Transmitted';
    }
  };

  return (
    <div id="orders-view" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 pb-24">
      {/* Header */}
      <div className="pb-4 border-b border-[#E6E8E2] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-display">
            My Farm Orders
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Real-time status of your direct farm-to-table harvests
          </p>
        </div>

        <button
          onClick={() => setActiveView('products')}
          className="px-5 py-2.5 rounded-full bg-[#3A5A40] hover:bg-[#2F4834] text-white font-bold text-xs shadow-xs transition-colors self-start sm:self-auto"
        >
          Browse Fresh Harvests
        </button>
      </div>

      {userOrders.length === 0 ? (
        <div className="bg-white rounded-3xl border border-[#E6E8E2] p-12 text-center space-y-4 shadow-xs">
          <div className="w-16 h-16 rounded-full bg-[#FAF6ED] text-[#3A5A40] mx-auto flex items-center justify-center">
            <Package className="w-8 h-8" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900 font-display">No Orders Placed Yet</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1">
              When you order farm fresh produce, you can track sunrise picking, eco-packing, and direct van delivery right here.
            </p>
          </div>
          <button
            onClick={() => setActiveView('products')}
            className="px-5 py-2.5 rounded-full bg-[#3A5A40] hover:bg-[#2F4834] text-white text-xs font-bold transition-colors"
          >
            Explore Today's Harvest
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {userOrders.map((order) => (
            <div
              key={order.id}
              id={`order-card-${order.id}`}
              className="bg-white rounded-3xl border border-[#E6E8E2] p-6 shadow-xs hover:shadow-md transition-all space-y-4"
            >
              {/* Order Card Header */}
              <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-[#E6E8E2]">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-[#FAF6ED] text-[#3A5A40] flex items-center justify-center font-bold">
                    <Package className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-extrabold text-slate-900 text-sm font-display">{order.orderNumber}</span>
                      <span
                        className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${getStatusBadge(
                          order.status
                        )}`}
                      >
                        {getStatusText(order.status)}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      Placed on {new Date(order.createdAt).toLocaleDateString()} • {order.deliverySlot}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <span className="text-base font-extrabold text-[#2F4834] font-display">
                      ${order.total.toFixed(2)}
                    </span>
                    <span className="text-[10px] text-slate-400 block uppercase font-medium">
                      {order.paymentMethod.toUpperCase()} ({order.paymentStatus})
                    </span>
                  </div>

                  <button
                    id={`btn-track-order-${order.id}`}
                    onClick={() => {
                      setSelectedOrder(order);
                      setActiveView('order-tracking');
                    }}
                    className="px-4 py-2 rounded-full bg-[#3A5A40] hover:bg-[#2F4834] text-white font-bold text-xs flex items-center gap-1.5 shadow-xs transition-colors"
                  >
                    <span>Track Live</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Order Items Preview */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {order.items.map((item) => (
                  <div
                    key={item.productId}
                    onClick={() => {
                      const prod = products.find((p) => p.id === item.productId);
                      if (prod) {
                        setSelectedProduct(prod);
                        setActiveView('product-details');
                      }
                    }}
                    className="flex items-center gap-3 p-2.5 rounded-2xl bg-[#FAF6ED]/70 border border-[#EBE4D5] hover:bg-[#FAF6ED] cursor-pointer transition-colors"
                  >
                    <img
                      src={item.productImage}
                      alt={item.productTitle}
                      className="w-12 h-12 rounded-xl object-cover"
                      referrerPolicy="no-referrer"
                    />
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-bold text-slate-900 truncate">{item.productTitle}</p>
                      <p className="text-[10px] text-[#3A5A40] font-semibold truncate">{item.farmName}</p>
                      <span className="text-[10px] text-slate-500 font-medium">
                        {item.quantity} {item.unit} • ${item.totalPrice.toFixed(2)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Delivery OTP pill if in transit or delivered */}
              <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-[#E6E8E2] text-xs">
                <div className="flex items-center gap-2 text-slate-600">
                  <MapPin className="w-3.5 h-3.5 text-[#3A5A40] shrink-0" />
                  <span className="truncate">
                    {order.deliveryAddress.street}, {order.deliveryAddress.city}
                  </span>
                </div>

                <div className="flex items-center gap-2 text-slate-600">
                  <span>Delivery Verification PIN:</span>
                  <span className="font-mono font-bold text-slate-900 bg-[#FAF6ED] px-2.5 py-0.5 rounded-full border border-[#EBE4D5]">
                    {order.deliveryOtp}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
