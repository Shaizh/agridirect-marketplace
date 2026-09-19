import React, { useState } from 'react';
import {
  User as UserIcon,
  MapPin,
  Phone,
  Mail,
  ShieldCheck,
  Tractor,
  Bell,
  Heart,
  Key,
  Save,
  CheckCircle2,
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const UserProfileView: React.FC = () => {
  const { currentUser, updateUserProfile, showToast, users, setCurrentUser } = useApp();

  const [name, setName] = useState(currentUser.name);
  const [email, setEmail] = useState(currentUser.email);
  const [phone, setPhone] = useState(currentUser.phone || '+1 (555) 234-5678');
  const [street, setStreet] = useState(currentUser.address?.street || '452 Elmwood Avenue, Apt 4B');
  const [city, setCity] = useState(currentUser.address?.city || 'Metro City');
  const [state, setState] = useState(currentUser.address?.state || 'California');
  const [pincode, setPincode] = useState(currentUser.address?.pincode || '94107');
  const [landmark, setLandmark] = useState(currentUser.address?.landmark || 'Opposite Community Library');

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateUserProfile({
      name,
      email,
      phone,
      address: {
        street,
        city,
        state,
        pincode,
        landmark,
      },
    });
  };

  return (
    <div id="user-profile-view" className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 pb-24">
      {/* Profile Card Header */}
      <div className="bg-white rounded-[2rem] border border-[#E6E8E2] p-6 sm:p-8 flex flex-col sm:flex-row items-center gap-6 shadow-xs">
        <img
          src={currentUser.avatar}
          alt={currentUser.name}
          className="w-20 h-20 rounded-2xl object-cover border-2 border-[#A3B18A] shadow-md"
          referrerPolicy="no-referrer"
        />

        <div className="flex-1 text-center sm:text-left space-y-1">
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
            <h1 className="text-2xl font-bold text-slate-900 font-display">{currentUser.name}</h1>
            <span
              className={`px-3 py-0.5 rounded-full text-xs font-bold uppercase ${
                currentUser.role === 'admin'
                  ? 'bg-rose-100 text-rose-800'
                  : currentUser.role === 'farmer'
                  ? 'bg-[#EBF0E6] text-[#2F4834] border border-[#D5DEC9]'
                  : 'bg-blue-100 text-blue-800'
              }`}
            >
              {currentUser.role} Account
            </span>
          </div>

          <p className="text-xs text-slate-500 flex items-center justify-center sm:justify-start gap-2">
            <Mail className="w-3.5 h-3.5 text-[#3A5A40]" />
            <span>{currentUser.email}</span>
            <span>•</span>
            <Phone className="w-3.5 h-3.5 text-[#3A5A40]" />
            <span>{currentUser.phone}</span>
          </p>

          {currentUser.farmDetails && (
            <p className="text-xs text-[#3A5A40] font-semibold flex items-center justify-center sm:justify-start gap-1">
              <Tractor className="w-3.5 h-3.5" />
              <span>Owner of {currentUser.farmDetails.farmName}</span>
            </p>
          )}
        </div>
      </div>

      {/* Profile Edit Form */}
      <form onSubmit={handleSave} className="bg-white rounded-[2rem] border border-[#E6E8E2] p-6 sm:p-8 space-y-6 shadow-xs">
        <h2 className="text-lg font-bold text-slate-900 font-display border-b border-[#E6E8E2] pb-3">
          Account & Delivery Preferences
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Full Legal Name</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3.5 py-2.5 text-xs rounded-2xl border border-[#E6E8E2] focus:border-[#3A5A40] outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Email Address</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3.5 py-2.5 text-xs rounded-2xl border border-[#E6E8E2] focus:border-[#3A5A40] outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Direct Contact Phone</label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full px-3.5 py-2.5 text-xs rounded-2xl border border-[#E6E8E2] focus:border-[#3A5A40] outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">City / Region</label>
            <input
              type="text"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="w-full px-3.5 py-2.5 text-xs rounded-2xl border border-[#E6E8E2] focus:border-[#3A5A40] outline-none"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="block text-xs font-semibold text-slate-700 mb-1">Default Street Delivery Address</label>
            <input
              type="text"
              value={street}
              onChange={(e) => setStreet(e.target.value)}
              className="w-full px-3.5 py-2.5 text-xs rounded-2xl border border-[#E6E8E2] focus:border-[#3A5A40] outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">State / Province</label>
            <input
              type="text"
              value={state}
              onChange={(e) => setState(e.target.value)}
              className="w-full px-3.5 py-2.5 text-xs rounded-2xl border border-[#E6E8E2] focus:border-[#3A5A40] outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Zip / Postal Code</label>
            <input
              type="text"
              value={pincode}
              onChange={(e) => setPincode(e.target.value)}
              className="w-full px-3.5 py-2.5 text-xs rounded-2xl border border-[#E6E8E2] focus:border-[#3A5A40] outline-none"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="block text-xs font-semibold text-slate-700 mb-1">Delivery Landmark / Gate Access</label>
            <input
              type="text"
              value={landmark}
              onChange={(e) => setLandmark(e.target.value)}
              className="w-full px-3.5 py-2.5 text-xs rounded-2xl border border-[#E6E8E2] focus:border-[#3A5A40] outline-none"
            />
          </div>
        </div>

        <div className="flex items-center justify-end pt-4 border-t border-[#E6E8E2]">
          <button
            type="submit"
            className="px-6 py-2.5 rounded-full bg-[#3A5A40] hover:bg-[#2F4834] text-white font-bold text-xs shadow-sm flex items-center gap-2 transition-colors"
          >
            <Save className="w-4 h-4" />
            <span>Update Account Profile</span>
          </button>
        </div>
      </form>
    </div>
  );
};
