import React, { useState } from 'react';
import {
  ShieldAlert,
  Users,
  Package,
  DollarSign,
  TrendingUp,
  Ban,
  CheckCircle2,
  Trash2,
  Eye,
  Search,
  Award,
  AlertTriangle,
  FileText,
  SlidersHorizontal,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { User, Product, Order } from '../types';

export const AdminDashboardView: React.FC = () => {
  const {
    users,
    products,
    orders,
    toggleUserBan,
    deleteProduct,
    updateProduct,
    setSelectedOrder,
    setActiveView,
    showToast,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'overview' | 'users' | 'products' | 'orders'>('overview');
  const [userSearch, setUserSearch] = useState('');
  const [productSearch, setProductSearch] = useState('');

  // Platform Metrics
  const totalGMV = orders
    .filter((o) => o.status !== 'cancelled')
    .reduce((sum, o) => sum + o.total, 0);

  const farmerUsers = users.filter((u) => u.role === 'farmer');
  const consumerUsers = users.filter((u) => u.role === 'consumer');
  const totalCompletedOrders = orders.filter((o) => o.status === 'delivered').length;

  const filteredUsers = users.filter((u) => {
    if (!userSearch) return true;
    const q = userSearch.toLowerCase();
    return (
      u.name.toLowerCase().includes(q) ||
      u.email.toLowerCase().includes(q) ||
      u.role.toLowerCase().includes(q) ||
      (u.farmDetails?.farmName && u.farmDetails.farmName.toLowerCase().includes(q))
    );
  });

  const filteredProducts = products.filter((p) => {
    if (!productSearch) return true;
    const q = productSearch.toLowerCase();
    return (
      p.title.toLowerCase().includes(q) ||
      p.farmerName.toLowerCase().includes(q) ||
      p.farmName.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q)
    );
  });

  const handleToggleProductStatus = (product: Product) => {
    const nextStatus = product.status === 'active' ? 'flagged' : 'active';
    updateProduct(product.id, { status: nextStatus });
    showToast(
      nextStatus === 'flagged' ? 'Produce Flagged' : 'Produce Activated',
      `${product.title} status is now ${nextStatus}`,
      'info'
    );
  };

  const handleToggleFeatured = (product: Product) => {
    updateProduct(product.id, { featured: !product.featured });
    showToast(
      product.featured ? 'Removed from Featured' : 'Marked as Featured Produce',
      undefined,
      'success'
    );
  };

  return (
    <div id="admin-dashboard-view" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 pb-24">
      {/* Admin Header */}
      <div className="bg-[#2F4834] text-[#F7F7F2] rounded-[2rem] p-6 sm:p-8 shadow-xl border border-[#3A5A40] flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 text-[#DAD7CD] border border-white/20 text-xs font-bold mb-2">
            <ShieldAlert className="w-4 h-4 text-[#A3B18A]" />
            <span>Platform Governance & Trust Authority</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white font-display">
            AgriDirect Administration Central
          </h1>
          <p className="text-xs sm:text-sm text-[#DAD7CD] mt-1">
            Supervise direct farmers, consumers, dispute mediation, product compliance, and escrow payouts.
          </p>
        </div>

        <div className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-full border border-white/20">
          <div className="w-2.5 h-2.5 rounded-full bg-[#A3B18A] animate-pulse" />
          <span className="text-xs font-semibold text-[#F7F7F2]">Live Escrow Engine Active</span>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-3xl border border-[#E6E8E2] p-5 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold mb-2">
            <span>Gross Platform Value (GMV)</span>
            <DollarSign className="w-4 h-4 text-[#3A5A40]" />
          </div>
          <span className="text-2xl sm:text-3xl font-extrabold text-[#2F4834] font-display">
            ${totalGMV.toFixed(2)}
          </span>
          <p className="text-[10px] text-[#3A5A40] font-medium mt-1">100% fair grower settlement</p>
        </div>

        <div className="bg-white rounded-3xl border border-[#E6E8E2] p-5 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold mb-2">
            <span>Verified Family Farmers</span>
            <Users className="w-4 h-4 text-[#3A5A40]" />
          </div>
          <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-display">
            {farmerUsers.length}
          </span>
          <p className="text-[10px] text-slate-500 font-medium mt-1">All with certified bio-records</p>
        </div>

        <div className="bg-white rounded-3xl border border-[#E6E8E2] p-5 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold mb-2">
            <span>Active Consumer Accounts</span>
            <Users className="w-4 h-4 text-[#3A5A40]" />
          </div>
          <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-display">
            {consumerUsers.length}
          </span>
          <p className="text-[10px] text-slate-500 font-medium mt-1">Direct recurring purchasers</p>
        </div>

        <div className="bg-white rounded-3xl border border-[#E6E8E2] p-5 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold mb-2">
            <span>Fulfilled Farm Deliveries</span>
            <Package className="w-4 h-4 text-amber-600" />
          </div>
          <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-display">
            {totalCompletedOrders} / {orders.length}
          </span>
          <p className="text-[10px] text-slate-500 font-medium mt-1">Avg delivery time: 9.4 hrs</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-[#E6E8E2] pb-2">
        <button
          onClick={() => setActiveTab('overview')}
          className={`px-4 py-2.5 rounded-full text-xs sm:text-sm font-bold transition-all flex items-center gap-2 ${
            activeTab === 'overview'
              ? 'bg-[#3A5A40] text-white shadow-xs'
              : 'bg-white text-slate-700 border border-[#E6E8E2] hover:bg-[#FAF6ED]'
          }`}
        >
          <TrendingUp className="w-4 h-4" />
          <span>System Transactions</span>
        </button>

        <button
          id="admin-tab-users"
          onClick={() => setActiveTab('users')}
          className={`px-4 py-2.5 rounded-full text-xs sm:text-sm font-bold transition-all flex items-center gap-2 ${
            activeTab === 'users'
              ? 'bg-[#3A5A40] text-white shadow-xs'
              : 'bg-white text-slate-700 border border-[#E6E8E2] hover:bg-[#FAF6ED]'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>User Governance ({users.length})</span>
        </button>

        <button
          id="admin-tab-products"
          onClick={() => setActiveTab('products')}
          className={`px-4 py-2.5 rounded-full text-xs sm:text-sm font-bold transition-all flex items-center gap-2 ${
            activeTab === 'products'
              ? 'bg-[#3A5A40] text-white shadow-xs'
              : 'bg-white text-slate-700 border border-[#E6E8E2] hover:bg-[#FAF6ED]'
          }`}
        >
          <Package className="w-4 h-4" />
          <span>Listed Produce Moderation ({products.length})</span>
        </button>
      </div>

      {/* Tab: System Transactions Overview */}
      {activeTab === 'overview' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-slate-900 text-base font-display">Direct Platform Transactions</h3>
            <span className="text-xs text-slate-500">Live escrow settlements and delivery status</span>
          </div>

          <div className="bg-white rounded-3xl border border-[#E6E8E2] overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#FAF6ED] border-b border-[#E6E8E2] text-slate-600 font-bold uppercase tracking-wider">
                  <tr>
                    <th className="p-4">Order #</th>
                    <th className="p-4">Consumer</th>
                    <th className="p-4">Items / Total</th>
                    <th className="p-4">Payment Method</th>
                    <th className="p-4">Status</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E6E8E2]">
                  {orders.map((ord) => (
                    <tr key={ord.id} className="hover:bg-[#FAF6ED]/50 transition-colors">
                      <td className="p-4 font-mono font-bold text-slate-900">{ord.orderNumber}</td>
                      <td className="p-4">
                        <span className="font-bold text-slate-900 block">{ord.consumerName}</span>
                        <span className="text-[10px] text-slate-400">{ord.consumerEmail}</span>
                      </td>
                      <td className="p-4">
                        <span className="font-extrabold text-[#2F4834] text-sm font-display">${ord.total.toFixed(2)}</span>
                        <span className="text-[10px] text-slate-500 block">({ord.items.length} items)</span>
                      </td>
                      <td className="p-4">
                        <span className="px-2.5 py-0.5 rounded-full bg-[#FAF6ED] border border-[#EBE4D5] font-semibold uppercase text-[10px] text-slate-700">
                          {ord.paymentMethod} • {ord.paymentStatus}
                        </span>
                      </td>
                      <td className="p-4">
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#EBF0E6] text-[#2F4834] border border-[#D5DEC9] uppercase">
                          {ord.status.replace(/_/g, ' ')}
                        </span>
                      </td>
                      <td className="p-4 text-right">
                        <button
                          onClick={() => {
                            setSelectedOrder(ord);
                            setActiveView('order-tracking');
                          }}
                          className="px-3.5 py-1.5 rounded-full bg-[#FAF6ED] hover:bg-[#EBE4D5] border border-[#EBE4D5] text-[#2F4834] font-bold text-xs transition-colors"
                        >
                          View Tracker
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Tab: Users Management */}
      {activeTab === 'users' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <h3 className="font-bold text-slate-900 text-base font-display">All Registered Marketplace Accounts</h3>
            <div className="relative w-full sm:w-72">
              <input
                type="text"
                value={userSearch}
                onChange={(e) => setUserSearch(e.target.value)}
                placeholder="Search by name, email, farm..."
                className="w-full pl-8 pr-3 py-2 text-xs rounded-full border border-[#E6E8E2] outline-none focus:border-[#3A5A40] bg-white"
              />
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            </div>
          </div>

          <div className="bg-white rounded-3xl border border-[#E6E8E2] overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#FAF6ED] border-b border-[#E6E8E2] text-slate-600 font-bold uppercase tracking-wider">
                  <tr>
                    <th className="p-4">User</th>
                    <th className="p-4">Role</th>
                    <th className="p-4">Farm Details</th>
                    <th className="p-4">Account Status</th>
                    <th className="p-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E6E8E2]">
                  {filteredUsers.map((u) => (
                    <tr key={u.id} className="hover:bg-[#FAF6ED]/50 transition-colors">
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={u.avatar}
                            alt={u.name}
                            className="w-8 h-8 rounded-full object-cover"
                            referrerPolicy="no-referrer"
                          />
                          <div>
                            <span className="font-bold text-slate-900 block">{u.name}</span>
                            <span className="text-[10px] text-slate-400">{u.email}</span>
                          </div>
                        </div>
                      </td>

                      <td className="p-4">
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                            u.role === 'admin'
                              ? 'bg-rose-100 text-rose-800'
                              : u.role === 'farmer'
                              ? 'bg-[#EBF0E6] text-[#2F4834] border border-[#D5DEC9]'
                              : 'bg-blue-100 text-blue-800'
                          }`}
                        >
                          {u.role}
                        </span>
                      </td>

                      <td className="p-4">
                        {u.farmDetails ? (
                          <div>
                            <span className="font-bold text-slate-800 block">{u.farmDetails.farmName}</span>
                            <span className="text-[10px] text-slate-500">{u.farmDetails.location}</span>
                          </div>
                        ) : (
                          <span className="text-slate-400 text-[11px]">N/A (Consumer)</span>
                        )}
                      </td>

                      <td className="p-4">
                        {u.isBanned ? (
                          <span className="px-2.5 py-0.5 rounded-full bg-rose-100 text-rose-800 font-bold text-[10px]">
                            Banned / Suspended
                          </span>
                        ) : (
                          <span className="px-2.5 py-0.5 rounded-full bg-[#EBF0E6] text-[#2F4834] border border-[#D5DEC9] font-bold text-[10px]">
                            Active & Verified
                          </span>
                        )}
                      </td>

                      <td className="p-4 text-right">
                        {u.role !== 'admin' && (
                          <button
                            onClick={() => toggleUserBan(u.id)}
                            className={`px-3 py-1 rounded-full text-xs font-bold transition-colors ${
                              u.isBanned
                                ? 'bg-[#EBF0E6] hover:bg-[#D5DEC9] text-[#2F4834] border border-[#D5DEC9]'
                                : 'bg-rose-50 hover:bg-rose-100 text-rose-700'
                            }`}
                          >
                            {u.isBanned ? 'Unban Account' : 'Suspend / Ban'}
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Tab: Products Moderation */}
      {activeTab === 'products' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <h3 className="font-bold text-slate-900 text-base font-display">Listed Produce Compliance & Moderation</h3>
            <div className="relative w-full sm:w-72">
              <input
                type="text"
                value={productSearch}
                onChange={(e) => setProductSearch(e.target.value)}
                placeholder="Search crop or farmer..."
                className="w-full pl-8 pr-3 py-2 text-xs rounded-full border border-[#E6E8E2] outline-none focus:border-[#3A5A40] bg-white"
              />
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            </div>
          </div>

          <div className="bg-white rounded-3xl border border-[#E6E8E2] overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#FAF6ED] border-b border-[#E6E8E2] text-slate-600 font-bold uppercase tracking-wider">
                  <tr>
                    <th className="p-4">Produce</th>
                    <th className="p-4">Farmer / Farm</th>
                    <th className="p-4">Price / Unit</th>
                    <th className="p-4">Status</th>
                    <th className="p-4">Featured</th>
                    <th className="p-4 text-right">Moderation Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E6E8E2]">
                  {filteredProducts.map((p) => (
                    <tr key={p.id} className="hover:bg-[#FAF6ED]/50 transition-colors">
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={p.images[0]}
                            alt={p.title}
                            className="w-10 h-10 rounded-xl object-cover"
                            referrerPolicy="no-referrer"
                          />
                          <div>
                            <span className="font-bold text-slate-900 block">{p.title}</span>
                            <span className="text-[10px] text-slate-400">{p.category}</span>
                          </div>
                        </div>
                      </td>

                      <td className="p-4">
                        <span className="font-bold text-slate-800 block">{p.farmerName}</span>
                        <span className="text-[10px] text-[#3A5A40] font-semibold">{p.farmName}</span>
                      </td>

                      <td className="p-4 font-extrabold text-[#2F4834] font-display">
                        ${p.price.toFixed(2)} / {p.unit}
                      </td>

                      <td className="p-4">
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                            p.status === 'active'
                              ? 'bg-[#EBF0E6] text-[#2F4834] border border-[#D5DEC9]'
                              : 'bg-rose-100 text-rose-800'
                          }`}
                        >
                          {p.status}
                        </span>
                      </td>

                      <td className="p-4">
                        <button
                          onClick={() => handleToggleFeatured(p)}
                          className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                            p.featured
                              ? 'bg-amber-100 text-amber-800 border border-amber-300'
                              : 'bg-[#FAF6ED] text-slate-600 border border-[#EBE4D5]'
                          }`}
                        >
                          {p.featured ? '⭐ Featured' : 'Standard'}
                        </button>
                      </td>

                      <td className="p-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleToggleProductStatus(p)}
                            className={`px-3 py-1 rounded-full text-xs font-bold ${
                              p.status === 'active'
                                ? 'bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200'
                                : 'bg-[#EBF0E6] hover:bg-[#D5DEC9] text-[#2F4834] border border-[#D5DEC9]'
                            }`}
                          >
                            {p.status === 'active' ? 'Flag' : 'Unflag'}
                          </button>
                          <button
                            onClick={() => deleteProduct(p.id)}
                            className="p-1.5 rounded-full text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                            title="Remove inappropriate product"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
