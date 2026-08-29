import React from 'react';
import { useVault } from '../../context/VaultContext';
import { 
  LayoutDashboard, 
  Award, 
  UploadCloud, 
  Download, 
  User, 
  ShieldCheck,
  CheckCircle2,
  HardDrive
} from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  onSelectTab: (tab: string) => void;
  isOpen: boolean;
  onClose: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  onSelectTab,
  isOpen,
  onClose
}) => {
  const { documents, studentProfile } = useVault();

  const activeDocs = documents.filter(d => !d.isRecycled && !d.isArchived);

  const navItems = [
    { id: 'dashboard', label: 'My Dashboard', icon: <LayoutDashboard className="w-4 h-4" /> },
    { id: 'certifications', label: 'My Certifications', icon: <Award className="w-4 h-4" />, badge: activeDocs.length },
    { id: 'upload', label: 'Upload Certification', icon: <UploadCloud className="w-4 h-4" /> },
    { id: 'download-center', label: 'Download Center', icon: <Download className="w-4 h-4" />, badge: 'PDF', badgeColor: 'bg-indigo-500/20 text-indigo-300' },
    { id: 'profile', label: 'My Profile', icon: <User className="w-4 h-4" /> },
    { id: 'verification', label: 'QR Verification', icon: <ShieldCheck className="w-4 h-4" /> },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 z-40 bg-black/70 backdrop-blur-sm lg:hidden"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-16 bottom-0 left-0 z-40 w-64 bg-slate-950/95 border-r border-slate-800/80 transform transition-transform duration-200 ease-in-out lg:translate-x-0 flex flex-col ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* User Card */}
        <div className="p-4 border-b border-slate-900">
          <div className="p-3.5 rounded-2xl bg-slate-900/90 border border-slate-800 flex items-center space-x-3">
            <div className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center font-bold text-white text-sm shadow">
              {studentProfile.name.charAt(0)}
            </div>
            <div className="overflow-hidden">
              <p className="text-xs font-bold text-white truncate">{studentProfile.name}</p>
              <p className="text-[10px] text-emerald-400 font-mono flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3 inline" /> Digital Vault
              </p>
            </div>
          </div>
        </div>

        {/* Navigation Links */}
        <div className="flex-1 px-3 py-4 space-y-1.5 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  onSelectTab(item.id);
                  onClose();
                }}
                className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl text-xs font-semibold transition ${
                  isActive
                    ? 'bg-gradient-to-r from-indigo-600 to-indigo-700 text-white shadow-lg shadow-indigo-600/25'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <span className={isActive ? 'text-white' : 'text-slate-400'}>{item.icon}</span>
                  <span>{item.label}</span>
                </div>

                {item.badge !== undefined && (
                  <span
                    className={`px-2 py-0.5 text-[10px] font-bold rounded-full ${
                      item.badgeColor || (isActive ? 'bg-white/20 text-white' : 'bg-slate-800 text-slate-400')
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Footer Info */}
        <div className="p-4 border-t border-slate-900 bg-slate-950 text-[11px] text-slate-500">
          <div className="flex items-center justify-between text-[10px] font-mono">
            <span>Vault Security</span>
            <span className="text-emerald-400">SHA-256 Active</span>
          </div>
        </div>
      </aside>
    </>
  );
};
