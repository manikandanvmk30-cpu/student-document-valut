import React, { useState, useRef, useEffect } from 'react';
import { useVault } from '../../context/VaultContext';
import { 
  ShieldCheck, 
  Search, 
  Bell, 
  UploadCloud, 
  HardDrive, 
  User, 
  Menu, 
  CheckCheck,
  Award,
  Download
} from 'lucide-react';

interface NavbarProps {
  onOpenUpload: () => void;
  onNavigate: (tab: string) => void;
  activeTab: string;
  toggleMobileMenu?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenUpload,
  onNavigate,
  activeTab,
  toggleMobileMenu
}) => {
  const { 
    studentProfile, 
    notifications, 
    markNotificationAsRead, 
    markAllNotificationsAsRead,
    searchQuery,
    setSearchQuery,
    documents
  } = useVault();

  const [showNotifications, setShowNotifications] = useState(false);
  const notifRef = useRef<HTMLDivElement>(null);

  const unreadCount = notifications.filter(n => !n.isRead).length;
  const activeDocs = documents.filter(d => !d.isRecycled && !d.isArchived);
  const totalBytes = activeDocs.reduce((acc, curr) => acc + curr.fileSize, 0);
  const totalMB = (totalBytes / (1024 * 1024)).toFixed(1);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setShowNotifications(false);
      }
    };
    window.document.addEventListener('mousedown', handleClickOutside);
    return () => window.document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="sticky top-0 z-40 bg-slate-900/90 backdrop-blur-md border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          
          {/* Brand Logo */}
          <div className="flex items-center space-x-3">
            <button
              onClick={toggleMobileMenu}
              className="lg:hidden p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
            >
              <Menu className="w-5 h-5" />
            </button>

            <button
              onClick={() => onNavigate('dashboard')}
              className="flex items-center space-x-3 text-left group"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-indigo-700 flex items-center justify-center text-white shadow-lg shadow-indigo-600/30 group-hover:scale-105 transition">
                <Award className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center space-x-1.5">
                  <span className="text-base font-extrabold text-white tracking-tight">VaultX</span>
                  <span className="text-[10px] font-bold px-2 py-0.5 bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 rounded-full">
                    Certificate Vault
                  </span>
                </div>
                <p className="text-[10px] text-slate-400 font-medium tracking-wide">
                  Store • Verify • Download
                </p>
              </div>
            </button>
          </div>

          {/* Universal Search Bar */}
          <div className="hidden md:flex flex-1 max-w-md mx-4">
            <div className="relative w-full">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  if (activeTab !== 'certifications') onNavigate('certifications');
                }}
                placeholder="Search certificates (e.g. AWS, CBSE, Java)..."
                className="w-full pl-9 pr-4 py-2 bg-slate-950/80 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white text-xs"
                >
                  ×
                </button>
              )}
            </div>
          </div>

          {/* Right Action Controls */}
          <div className="flex items-center space-x-3">
            
            {/* Storage Meter */}
            <div 
              onClick={() => onNavigate('profile')}
              className="hidden sm:flex items-center space-x-2 px-3 py-1.5 bg-slate-950/80 rounded-xl border border-slate-800 text-xs text-slate-400 cursor-pointer hover:border-slate-700 transition"
              title="Storage Allocation"
            >
              <HardDrive className="w-3.5 h-3.5 text-indigo-400" />
              <span className="font-mono text-[11px]">{totalMB} MB / 5 GB</span>
            </div>

            {/* Quick Upload Button */}
            <button
              onClick={onOpenUpload}
              className="px-3.5 py-2 bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-white text-xs font-bold rounded-xl shadow-lg shadow-indigo-600/20 flex items-center gap-1.5 transition"
            >
              <UploadCloud className="w-4 h-4" />
              <span className="hidden sm:inline">Upload Certificate</span>
            </button>

            {/* Notifications */}
            <div className="relative" ref={notifRef}>
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative p-2 bg-slate-800/80 hover:bg-slate-800 text-slate-300 hover:text-white rounded-xl border border-slate-700 transition"
              >
                <Bell className="w-4 h-4" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-indigo-500 text-white font-bold text-[9px] rounded-full flex items-center justify-center animate-pulse">
                    {unreadCount}
                  </span>
                )}
              </button>

              {showNotifications && (
                <div className="absolute right-0 mt-2 w-80 bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl overflow-hidden z-50 animate-in fade-in-50 zoom-in-95">
                  <div className="p-3 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
                    <span className="text-xs font-bold text-white">Notifications</span>
                    {unreadCount > 0 && (
                      <button
                        onClick={markAllNotificationsAsRead}
                        className="text-[10px] text-indigo-400 hover:text-indigo-300"
                      >
                        Mark all read
                      </button>
                    )}
                  </div>

                  <div className="max-h-60 overflow-y-auto divide-y divide-slate-800/50">
                    {notifications.length === 0 ? (
                      <div className="p-4 text-center text-xs text-slate-500">No notifications</div>
                    ) : (
                      notifications.map((notif) => (
                        <div
                          key={notif.id}
                          onClick={() => {
                            markNotificationAsRead(notif.id);
                            onNavigate('certifications');
                            setShowNotifications(false);
                          }}
                          className={`p-3 hover:bg-slate-800/60 cursor-pointer transition text-xs ${
                            !notif.isRead ? 'bg-indigo-950/20' : ''
                          }`}
                        >
                          <p className="font-semibold text-slate-200">{notif.title}</p>
                          <p className="text-slate-400 text-[11px] mt-0.5">{notif.message}</p>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Profile Avatar Pill */}
            <button
              onClick={() => onNavigate('profile')}
              className="flex items-center space-x-2 p-1.5 pr-3 bg-slate-800/80 hover:bg-slate-800 rounded-xl border border-slate-700 transition"
            >
              <div className="w-7 h-7 rounded-lg bg-indigo-600 flex items-center justify-center font-bold text-white text-xs">
                {studentProfile.name.charAt(0)}
              </div>
              <span className="text-xs font-bold text-slate-200 hidden sm:inline truncate max-w-[100px]">
                {studentProfile.name.split(' ')[0]}
              </span>
            </button>

          </div>

        </div>
      </div>
    </header>
  );
};
