import React, { useState } from 'react';
import { Download, Sparkles, X, WifiOff, BellRing, Smartphone } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const PWAInstallBanner: React.FC = () => {
  const { isOffline, promptInstallPwa, canInstallPwa, requestNotificationPermission } = useApp();
  const [dismissed, setDismissed] = useState(false);
  const [showNotificationPrompt, setShowNotificationPrompt] = useState(false);

  return (
    <>
      {/* Offline Status Top Bar */}
      {isOffline && (
        <div id="offline-bar" className="bg-amber-600 text-white px-4 py-2 text-xs sm:text-sm font-medium flex items-center justify-center gap-2 shadow-inner">
          <WifiOff className="w-4 h-4 animate-pulse" />
          <span>You are currently in Offline Mode. Viewing saved farm catalog & cached orders.</span>
        </div>
      )}

      {/* PWA Install Ribbon */}
      {!dismissed && (
        <div
          id="pwa-install-banner"
          className="bg-[#243B29] border-b border-[#3A5A40] text-[#F7F7F2] px-4 py-2.5 text-xs sm:text-sm"
        >
          <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-full bg-[#3A5A40] flex items-center justify-center text-[#A3B18A]">
                <Smartphone className="w-4 h-4" />
              </div>
              <div>
                <span className="font-bold text-white">Install AgriDirect:</span>{' '}
                <span className="text-[#DAD7CD] hidden sm:inline">
                  Instant morning harvest alerts, offline access, & 1-tap farmer checkout.
                </span>
                <span className="text-[#DAD7CD] sm:hidden">Fast, offline farm shopping.</span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                id="btn-enable-push"
                onClick={requestNotificationPermission}
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#3A5A40] hover:bg-[#476B4E] text-[#DAD7CD] text-xs font-semibold transition-colors"
                title="Enable harvest updates"
              >
                <BellRing className="w-3.5 h-3.5" />
                <span className="hidden md:inline">Enable Alerts</span>
              </button>

              <button
                id="btn-install-pwa"
                onClick={promptInstallPwa}
                className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#A3B18A] hover:bg-[#B5C29F] text-[#1E293B] text-xs font-bold transition-transform active:scale-95 shadow-sm"
              >
                <Download className="w-3.5 h-3.5" />
                <span>{canInstallPwa ? 'Install PWA' : 'How to Install'}</span>
              </button>

              <button
                onClick={() => setDismissed(true)}
                className="p-1 text-[#DAD7CD]/60 hover:text-white rounded-full transition-colors"
                aria-label="Dismiss banner"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
