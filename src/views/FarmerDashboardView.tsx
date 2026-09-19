import React, { useState } from 'react';
import {
  Tractor,
  Plus,
  Package,
  DollarSign,
  TrendingUp,
  Star,
  CheckCircle2,
  Clock,
  Edit2,
  Trash2,
  Sparkles,
  ShieldCheck,
  MapPin,
  Eye,
  AlertCircle,
  Truck,
  Layers,
  Search,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Product, Order, OrderStatus, ProductCategory, ProductUnit } from '../types';

interface FarmerDashboardViewProps {
  onOpenAiAssistForFarmer: (applyCallback: (data: any) => void) => void;
}

export const FarmerDashboardView: React.FC<FarmerDashboardViewProps> = ({ onOpenAiAssistForFarmer }) => {
  const {
    currentUser,
    products,
    orders,
    addProduct,
    updateProduct,
    deleteProduct,
    updateOrderStatus,
    updateUserProfile,
    showToast,
    setSelectedOrder,
    setActiveView,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'products' | 'orders' | 'profile'>('products');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // Add / Edit Product Form State
  const [cropTitle, setCropTitle] = useState('');
  const [category, setCategory] = useState<ProductCategory>('Vegetables');
  const [price, setPrice] = useState<number>(3.5);
  const [unit, setUnit] = useState<ProductUnit>('kg');
  const [stock, setStock] = useState<number>(50);
  const [harvestDate, setHarvestDate] = useState('Today, 6:00 AM');
  const [freshnessScore, setFreshnessScore] = useState<number>(99);
  const [isOrganic, setIsOrganic] = useState(true);
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState(
    'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=800&auto=format&fit=crop&q=80'
  );
  const [bulkDiscountThreshold, setBulkDiscountThreshold] = useState<number>(5);
  const [bulkDiscountPercent, setBulkDiscountPercent] = useState<number>(10);
  const [shelfLifeDays, setShelfLifeDays] = useState<number>(7);

  // Farmer's own products
  const farmerProducts = products.filter((p) => p.farmerId === currentUser.id);

  // Orders that contain at least one item from this farmer
  const farmerOrders = orders.filter((o) =>
    o.items.some((item) => item.farmerId === currentUser.id)
  );

  // Calculate Farmer KPI metrics
  const totalFarmerRevenue = farmerOrders
    .filter((o) => o.status !== 'cancelled')
    .reduce((sum, order) => {
      const myItemsTotal = order.items
        .filter((item) => item.farmerId === currentUser.id)
        .reduce((subSum, item) => subSum + item.totalPrice, 0);
      return sum + myItemsTotal;
    }, 0);

  const pendingOrdersCount = farmerOrders.filter(
    (o) => o.status === 'pending' || o.status === 'confirmed' || o.status === 'harvesting'
  ).length;

  const lowStockCount = farmerProducts.filter((p) => p.stock > 0 && p.stock <= 10).length;

  const handleOpenAdd = () => {
    setEditingProduct(null);
    setCropTitle('');
    setCategory('Vegetables');
    setPrice(3.5);
    setUnit('kg');
    setStock(50);
    setHarvestDate('Today, 6:00 AM');
    setFreshnessScore(99);
    setIsOrganic(true);
    setDescription('Freshly picked from morning fields.');
    setImageUrl('https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=800&auto=format&fit=crop&q=80');
    setShowAddModal(true);
  };

  const handleOpenEdit = (p: Product) => {
    setEditingProduct(p);
    setCropTitle(p.title);
    setCategory(p.category);
    setPrice(p.price);
    setUnit(p.unit);
    setStock(p.stock);
    setHarvestDate(p.harvestDate);
    setFreshnessScore(p.freshnessScore);
    setIsOrganic(p.isOrganic);
    setDescription(p.description);
    setImageUrl(p.images[0] || '');
    setBulkDiscountThreshold(p.bulkDiscountThreshold || 5);
    setBulkDiscountPercent(p.bulkDiscountPercent || 10);
    setShelfLifeDays(p.shelfLifeDays || 7);
    setShowAddModal(true);
  };

  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!cropTitle.trim()) {
      showToast('Crop Title Required', 'Please enter a name for the crop.', 'warning');
      return;
    }

    if (editingProduct) {
      updateProduct(editingProduct.id, {
        title: cropTitle,
        category,
        price,
        unit,
        stock,
        harvestDate,
        freshnessScore,
        isOrganic,
        description,
        images: [imageUrl],
        bulkDiscountThreshold,
        bulkDiscountPercent,
        shelfLifeDays,
      });
    } else {
      addProduct({
        title: cropTitle,
        category,
        price,
        unit,
        stock,
        harvestDate,
        freshnessScore,
        isOrganic,
        description,
        images: [imageUrl],
        bulkDiscountThreshold,
        bulkDiscountPercent,
        shelfLifeDays,
        status: 'active',
      });
    }

    setShowAddModal(false);
  };

  // Callback to apply AI generated crop details
  const applyAiCropData = (data: { title: string; price: number; description: string; unit: string; category: string }) => {
    setCropTitle(data.title);
    setPrice(data.price);
    setDescription(data.description);
    if (data.unit) setUnit(data.unit as ProductUnit);
    if (data.category) setCategory(data.category as ProductCategory);
    showToast('Applied AI Crop Pricing & Description', undefined, 'success');
  };

  return (
    <div id="farmer-dashboard-view" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 pb-24">
      {/* Header & Farmer Profile Summary */}
      <div className="bg-[#2F4834] text-[#F7F7F2] rounded-[2rem] p-6 sm:p-8 shadow-xl border border-[#3A5A40] flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <img
            src={currentUser.avatar}
            alt={currentUser.name}
            className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover border-2 border-[#A3B18A] shadow-md"
            referrerPolicy="no-referrer"
          />
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider px-3 py-0.5 rounded-full bg-white/15 text-[#DAD7CD] border border-white/20">
                Verified Farmer Hub
              </span>
              {currentUser.farmDetails?.organicCertified && (
                <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-[#A3B18A] text-[#1E293B]">
                  Organic Certified
                </span>
              )}
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white font-display mt-1">
              {currentUser.farmDetails?.farmName || `${currentUser.name}'s Farm`}
            </h1>
            <p className="text-xs sm:text-sm text-[#DAD7CD] flex items-center gap-1.5 mt-0.5">
              <MapPin className="w-3.5 h-3.5 text-[#A3B18A]" />
              <span>{currentUser.farmDetails?.location || 'Regional Organic District'}</span>
              <span>•</span>
              <span>Grower: {currentUser.name}</span>
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            id="btn-farmer-add-crop"
            onClick={handleOpenAdd}
            className="px-5 py-3 rounded-full bg-[#A3B18A] hover:bg-[#B5C29F] text-[#1E293B] font-bold text-xs shadow-md transition-transform active:scale-95 flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Crop / Harvest</span>
          </button>

          <button
            onClick={() => onOpenAiAssistForFarmer(applyAiCropData)}
            className="px-4 py-3 rounded-full bg-white/10 hover:bg-white/20 text-white font-semibold text-xs border border-white/20 backdrop-blur-md flex items-center gap-1.5 transition-colors"
          >
            <Sparkles className="w-4 h-4 text-amber-300" />
            <span>AI Price Advisor</span>
          </button>
        </div>
      </div>

      {/* KPI Cards Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-3xl border border-[#E6E8E2] p-5 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold mb-2">
            <span>Total Direct Revenue</span>
            <DollarSign className="w-4 h-4 text-[#3A5A40]" />
          </div>
          <span className="text-2xl sm:text-3xl font-extrabold text-[#2F4834] font-display">
            ${totalFarmerRevenue.toFixed(2)}
          </span>
          <p className="text-[10px] text-[#3A5A40] font-medium mt-1">90% net payout to your bank</p>
        </div>

        <div className="bg-white rounded-3xl border border-[#E6E8E2] p-5 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold mb-2">
            <span>Pending Harvest Orders</span>
            <Clock className="w-4 h-4 text-amber-600" />
          </div>
          <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-display">
            {pendingOrdersCount}
          </span>
          <p className="text-[10px] text-slate-500 font-medium mt-1">Requires morning picking/dispatch</p>
        </div>

        <div className="bg-white rounded-3xl border border-[#E6E8E2] p-5 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold mb-2">
            <span>Active Listed Crops</span>
            <Layers className="w-4 h-4 text-[#3A5A40]" />
          </div>
          <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-display">
            {farmerProducts.length}
          </span>
          <p className="text-[10px] text-slate-500 font-medium mt-1">
            {lowStockCount > 0 ? `⚠️ ${lowStockCount} low stock alerts` : 'All inventory healthy'}
          </p>
        </div>

        <div className="bg-white rounded-3xl border border-[#E6E8E2] p-5 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold mb-2">
            <span>Farm Reputation Rating</span>
            <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
          </div>
          <span className="text-2xl sm:text-3xl font-extrabold text-[#2F4834] font-display">
            {currentUser.farmDetails?.rating || 4.9}
          </span>
          <p className="text-[10px] text-[#3A5A40] font-medium mt-1">
            {currentUser.farmDetails?.totalOrders || 120}+ verified buyers
          </p>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="flex items-center gap-2 border-b border-[#E6E8E2] pb-2">
        <button
          id="farmer-tab-products"
          onClick={() => setActiveTab('products')}
          className={`px-4 py-2.5 rounded-full text-xs sm:text-sm font-bold transition-all flex items-center gap-2 ${
            activeTab === 'products'
              ? 'bg-[#3A5A40] text-white shadow-xs'
              : 'bg-white text-slate-700 border border-[#E6E8E2] hover:bg-[#FAF6ED]'
          }`}
        >
          <Package className="w-4 h-4" />
          <span>My Crops & Inventory ({farmerProducts.length})</span>
        </button>

        <button
          id="farmer-tab-orders"
          onClick={() => setActiveTab('orders')}
          className={`px-4 py-2.5 rounded-full text-xs sm:text-sm font-bold transition-all flex items-center gap-2 ${
            activeTab === 'orders'
              ? 'bg-[#3A5A40] text-white shadow-xs'
              : 'bg-white text-slate-700 border border-[#E6E8E2] hover:bg-[#FAF6ED]'
          }`}
        >
          <Tractor className="w-4 h-4" />
          <span>Incoming Customer Orders ({farmerOrders.length})</span>
        </button>

        <button
          id="farmer-tab-profile"
          onClick={() => setActiveTab('profile')}
          className={`px-4 py-2.5 rounded-full text-xs sm:text-sm font-bold transition-all flex items-center gap-2 ${
            activeTab === 'profile'
              ? 'bg-[#3A5A40] text-white shadow-xs'
              : 'bg-white text-slate-700 border border-[#E6E8E2] hover:bg-[#FAF6ED]'
          }`}
        >
          <ShieldCheck className="w-4 h-4" />
          <span>Farm Story & Certification</span>
        </button>
      </div>

      {/* Tab 1: Products & Stock Management */}
      {activeTab === 'products' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-900 font-display">Listed Farm Crops</h2>
            <button
              onClick={handleOpenAdd}
              className="px-4 py-2 rounded-full bg-[#3A5A40] hover:bg-[#2F4834] text-white text-xs font-bold flex items-center gap-1.5 transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Crop</span>
            </button>
          </div>

          <div className="bg-white rounded-3xl border border-[#E6E8E2] overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#FAF6ED] border-b border-[#E6E8E2] text-slate-600 font-bold uppercase tracking-wider">
                  <tr>
                    <th className="p-4">Crop Produce</th>
                    <th className="p-4">Category</th>
                    <th className="p-4">Direct Price</th>
                    <th className="p-4">Available Stock</th>
                    <th className="p-4">Harvest Status</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E6E8E2]">
                  {farmerProducts.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="p-8 text-center text-slate-400">
                        You have not listed any crops yet. Click "Add Crop" to publish your harvest.
                      </td>
                    </tr>
                  ) : (
                    farmerProducts.map((prod) => (
                      <tr key={prod.id} className="hover:bg-[#FAF6ED]/50 transition-colors">
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            <img
                              src={prod.images[0]}
                              alt={prod.title}
                              className="w-10 h-10 rounded-xl object-cover"
                              referrerPolicy="no-referrer"
                            />
                            <div>
                              <span className="font-bold text-slate-900 block">{prod.title}</span>
                              <span className="text-[10px] text-slate-500">
                                {prod.isOrganic ? '🌿 100% Organic' : 'Conventional'}
                              </span>
                            </div>
                          </div>
                        </td>

                        <td className="p-4">
                          <span className="px-2.5 py-0.5 rounded-full bg-[#FAF6ED] border border-[#EBE4D5] text-slate-700 font-semibold">
                            {prod.category}
                          </span>
                        </td>

                        <td className="p-4">
                          <span className="font-extrabold text-[#2F4834] text-sm font-display">
                            ${prod.price.toFixed(2)}
                          </span>
                          <span className="text-slate-400 font-normal"> /{prod.unit}</span>
                        </td>

                        <td className="p-4">
                          <span
                            className={`font-bold px-2.5 py-0.5 rounded-full ${
                              prod.stock > 10
                                ? 'bg-[#EBF0E6] text-[#2F4834] border border-[#D5DEC9]'
                                : prod.stock > 0
                                ? 'bg-amber-100 text-amber-800'
                                : 'bg-rose-100 text-rose-800'
                            }`}
                          >
                            {prod.stock} {prod.unit}
                          </span>
                        </td>

                        <td className="p-4">
                          <span className="text-slate-600 font-medium">{prod.harvestDate}</span>
                        </td>

                        <td className="p-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => handleOpenEdit(prod)}
                              className="p-1.5 rounded-full text-slate-600 hover:text-[#2F4834] hover:bg-[#FAF6ED] transition-colors"
                              title="Edit product"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => deleteProduct(prod.id)}
                              className="p-1.5 rounded-full text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                              title="Delete product"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Incoming Customer Orders */}
      {activeTab === 'orders' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-900 font-display">Incoming Customer Orders</h2>
            <span className="text-xs text-slate-500">Update status to notify buyers in real time</span>
          </div>

          <div className="space-y-4">
            {farmerOrders.length === 0 ? (
              <div className="bg-white rounded-3xl border border-[#E6E8E2] p-8 text-center text-slate-400 text-xs">
                No orders for your farm yet. Once a buyer checks out with your produce, it will appear here.
              </div>
            ) : (
              farmerOrders.map((ord) => {
                const myItems = ord.items.filter((i) => i.farmerId === currentUser.id);
                const myTotal = myItems.reduce((acc, i) => acc + i.totalPrice, 0);

                return (
                  <div
                    key={ord.id}
                    className="bg-white rounded-3xl border border-[#E6E8E2] p-6 space-y-4 shadow-xs"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-[#E6E8E2]">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-extrabold text-slate-900 text-sm font-display">{ord.orderNumber}</span>
                          <span className="text-xs font-bold text-slate-600">for {ord.consumerName}</span>
                          <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-[#EBF0E6] text-[#2F4834] border border-[#D5DEC9] uppercase">
                            {ord.status.replace(/_/g, ' ')}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-400 mt-0.5">
                          Delivery Slot: {ord.deliverySlot} • Pincode: {ord.deliveryAddress.pincode}
                        </p>
                      </div>

                      <div className="text-right">
                        <span className="text-base font-extrabold text-[#2F4834] font-display">
                          ${myTotal.toFixed(2)}
                        </span>
                        <span className="text-[10px] text-[#3A5A40] block font-semibold">Your Share</span>
                      </div>
                    </div>

                    {/* Ordered items for this farm */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {myItems.map((item) => (
                        <div
                          key={item.productId}
                          className="flex items-center gap-3 p-2.5 bg-[#FAF6ED]/60 rounded-2xl border border-[#EBE4D5] text-xs"
                        >
                          <img
                            src={item.productImage}
                            alt={item.productTitle}
                            className="w-10 h-10 rounded-xl object-cover"
                            referrerPolicy="no-referrer"
                          />
                          <div>
                            <p className="font-bold text-slate-900">{item.productTitle}</p>
                            <p className="text-[10px] text-slate-500">
                              Qty: {item.quantity} {item.unit} • ${item.totalPrice.toFixed(2)}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Status update buttons */}
                    <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-[#E6E8E2]">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => {
                            setSelectedOrder(ord);
                            setActiveView('order-tracking');
                          }}
                          className="text-xs font-bold text-[#3A5A40] hover:underline flex items-center gap-1"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>View Consumer Tracker</span>
                        </button>
                      </div>

                      <div className="flex flex-wrap items-center gap-2">
                        {ord.status === 'pending' && (
                          <button
                            onClick={() => updateOrderStatus(ord.id, 'confirmed')}
                            className="px-3.5 py-1.5 rounded-full bg-[#3A5A40] hover:bg-[#2F4834] text-white text-xs font-bold shadow-xs"
                          >
                            ✓ Confirm Harvest
                          </button>
                        )}

                        {(ord.status === 'pending' || ord.status === 'confirmed') && (
                          <button
                            onClick={() => updateOrderStatus(ord.id, 'harvesting')}
                            className="px-3.5 py-1.5 rounded-full bg-[#A3B18A] hover:bg-[#B5C29F] text-[#1E293B] text-xs font-bold shadow-xs"
                          >
                            🚜 Mark as Harvested & Packed
                          </button>
                        )}

                        {ord.status === 'harvesting' && (
                          <button
                            onClick={() => updateOrderStatus(ord.id, 'out_for_delivery')}
                            className="px-3.5 py-1.5 rounded-full bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-xs"
                          >
                            🚚 Dispatch with Van
                          </button>
                        )}

                        {ord.status === 'out_for_delivery' && (
                          <button
                            onClick={() => updateOrderStatus(ord.id, 'delivered')}
                            className="px-3.5 py-1.5 rounded-full bg-[#3A5A40] hover:bg-[#2F4834] text-white text-xs font-bold shadow-xs"
                          >
                            🎉 Mark Delivered
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}

      {/* Tab 3: Farm Story & Certification Profile */}
      {activeTab === 'profile' && (
        <div className="bg-white rounded-3xl border border-[#E6E8E2] p-6 sm:p-8 space-y-6 shadow-xs">
          <div className="border-b border-[#E6E8E2] pb-4">
            <h2 className="text-lg font-bold text-slate-900 font-display">Farm Identity & Organic Verification</h2>
            <p className="text-xs text-slate-500">This info is shown to consumers on all your product pages</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Farm Name</label>
              <input
                type="text"
                defaultValue={currentUser.farmDetails?.farmName}
                className="w-full px-3.5 py-2.5 text-xs rounded-2xl border border-[#E6E8E2] focus:border-[#3A5A40] outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Location / County</label>
              <input
                type="text"
                defaultValue={currentUser.farmDetails?.location}
                className="w-full px-3.5 py-2.5 text-xs rounded-2xl border border-[#E6E8E2] focus:border-[#3A5A40] outline-none"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-700 mb-1">Farm Bio & Mission Story</label>
              <textarea
                rows={3}
                defaultValue={currentUser.farmDetails?.bio}
                className="w-full px-3.5 py-2.5 text-xs rounded-2xl border border-[#E6E8E2] focus:border-[#3A5A40] outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Organic Certification ID</label>
              <input
                type="text"
                defaultValue={currentUser.farmDetails?.certificationId || 'USDA-ORG-849201'}
                className="w-full px-3.5 py-2.5 text-xs rounded-2xl border border-[#E6E8E2] focus:border-[#3A5A40] outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Farm Size (Acres)</label>
              <input
                type="number"
                defaultValue={currentUser.farmDetails?.sizeAcres || 28}
                className="w-full px-3.5 py-2.5 text-xs rounded-2xl border border-[#E6E8E2] focus:border-[#3A5A40] outline-none"
              />
            </div>
          </div>

          <button
            onClick={() => showToast('Farm Profile Saved', 'Updated info is now live on your marketplace items.', 'success')}
            className="px-6 py-2.5 rounded-full bg-[#3A5A40] hover:bg-[#2F4834] text-white font-bold text-xs"
          >
            Save Farm Profile
          </button>
        </div>
      )}

      {/* Add / Edit Crop Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-[#1E293B]/75 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-[2rem] max-w-xl w-full p-6 sm:p-8 space-y-5 border border-[#E6E8E2] shadow-2xl my-8">
            <div className="flex items-center justify-between border-b border-[#E6E8E2] pb-3">
              <div>
                <h3 className="text-lg font-bold text-slate-900 font-display">
                  {editingProduct ? 'Edit Crop Details' : 'Add New Fresh Harvest Crop'}
                </h3>
                <p className="text-xs text-slate-500">List produce for today or upcoming sunrise harvest</p>
              </div>

              <button
                type="button"
                onClick={() => onOpenAiAssistForFarmer(applyAiCropData)}
                className="px-3.5 py-1.5 rounded-full bg-[#FAF6ED] border border-[#EBE4D5] hover:bg-[#F2ECE0] text-[#2F4834] font-bold text-xs flex items-center gap-1.5"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                <span>AI Autofill</span>
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Crop Title</label>
                <input
                  type="text"
                  required
                  value={cropTitle}
                  onChange={(e) => setCropTitle(e.target.value)}
                  placeholder="e.g. Farm Fresh Heirloom Vine Tomatoes"
                  className="w-full px-3.5 py-2.5 text-xs rounded-2xl border border-[#E6E8E2] focus:border-[#3A5A40] outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as ProductCategory)}
                    className="w-full px-3 py-2.5 text-xs rounded-2xl border border-[#E6E8E2] bg-white outline-none focus:border-[#3A5A40] font-medium"
                  >
                    <option value="Vegetables">Vegetables</option>
                    <option value="Fruits">Fruits</option>
                    <option value="Grains & Pulses">Grains & Pulses</option>
                    <option value="Dairy & Honey">Dairy & Honey</option>
                    <option value="Herbs & Spices">Herbs & Spices</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Measurement Unit</label>
                  <select
                    value={unit}
                    onChange={(e) => setUnit(e.target.value as ProductUnit)}
                    className="w-full px-3 py-2.5 text-xs rounded-2xl border border-[#E6E8E2] bg-white outline-none focus:border-[#3A5A40] font-medium"
                  >
                    <option value="kg">Per kg</option>
                    <option value="bunch">Per bunch</option>
                    <option value="box">Per box</option>
                    <option value="pack">Per pack</option>
                    <option value="dozen">Per dozen</option>
                    <option value="liter">Per liter</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Direct Price ($)</label>
                  <input
                    type="number"
                    step="0.01"
                    min="0.1"
                    required
                    value={price}
                    onChange={(e) => setPrice(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 text-xs rounded-2xl border border-[#E6E8E2] focus:border-[#3A5A40] outline-none font-bold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Available Stock ({unit})</label>
                  <input
                    type="number"
                    min="0"
                    required
                    value={stock}
                    onChange={(e) => setStock(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 text-xs rounded-2xl border border-[#E6E8E2] focus:border-[#3A5A40] outline-none font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Product Image URL</label>
                <input
                  type="text"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full px-3.5 py-2.5 text-xs rounded-2xl border border-[#E6E8E2] focus:border-[#3A5A40] outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Harvest Description</label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe freshness, soil cultivation, crisp flavor..."
                  className="w-full px-3.5 py-2.5 text-xs rounded-2xl border border-[#E6E8E2] focus:border-[#3A5A40] outline-none"
                />
              </div>

              <div className="flex items-center gap-4 pt-2">
                <label className="flex items-center gap-2 text-xs font-semibold text-slate-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isOrganic}
                    onChange={(e) => setIsOrganic(e.target.checked)}
                    className="rounded text-[#3A5A40] focus:ring-[#3A5A40] w-4 h-4"
                  />
                  <span>🌿 100% Organic Certified</span>
                </label>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#E6E8E2]">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-full border border-[#E6E8E2] text-slate-700 font-bold text-xs hover:bg-[#FAF6ED]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-full bg-[#3A5A40] hover:bg-[#2F4834] text-white font-bold text-xs shadow-sm"
                >
                  {editingProduct ? 'Save Changes' : 'Publish Crop to Marketplace'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
