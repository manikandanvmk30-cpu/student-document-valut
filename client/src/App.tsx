import React, { useState, useEffect } from 'react';
import { VaultProvider, useVault } from './context/VaultContext';
import { Navbar } from './components/layout/Navbar';
import { Sidebar } from './components/layout/Sidebar';
import { DashboardView } from './components/dashboard/DashboardView';
import { CertificationsView } from './components/certifications/CertificationsView';
import { UploadView } from './components/upload/UploadView';
import { DownloadCenterView } from './components/download/DownloadCenterView';
import { ProfileView } from './components/profile/ProfileView';
import { VerificationView } from './components/verification/VerificationView';
import { PublicVerificationPage } from './components/public/PublicVerificationPage';
import { PublicProfilePage } from './components/public/PublicProfilePage';
import { DocumentPreviewModal } from './components/common/DocumentPreviewModal';
import { QRModal } from './components/common/QRModal';
import { DigitalReceiptModal } from './components/common/DigitalReceiptModal';
import { UploadModal } from './components/common/UploadModal';
import { VersionDrawer } from './components/common/VersionDrawer';
import { VaultDocument, DocumentCategory } from './types';

const MainApp: React.FC = () => {
  const { studentProfile } = useVault();

  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState<boolean>(false);

  // Modals & Drawers
  const [previewDoc, setPreviewDoc] = useState<VaultDocument | null>(null);
  const [qrDoc, setQrDoc] = useState<VaultDocument | null>(null);
  const [receiptDoc, setReceiptDoc] = useState<VaultDocument | null>(null);
  const [versionDoc, setVersionDoc] = useState<VaultDocument | null>(null);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState<boolean>(false);
  const [uploadCategory, setUploadCategory] = useState<DocumentCategory | undefined>(undefined);

  // Public Direct View States (for /verify/:id or /profile/:id)
  const [publicVerificationId, setPublicVerificationId] = useState<string | null>(null);
  const [publicProfileId, setPublicProfileId] = useState<string | null>(null);

  useEffect(() => {
    const handleLocationChange = () => {
      const path = window.location.pathname;
      const hash = window.location.hash;
      const search = new URLSearchParams(window.location.search);

      // Check query param e.g. ?verify=DOC-2026-CSE-000182
      const verifyParam = search.get('verify');
      if (verifyParam) {
        setPublicVerificationId(verifyParam);
        return;
      }

      // Check path e.g. /verify/DOC-2026-CSE-000182
      if (path.startsWith('/verify/')) {
        const id = path.replace('/verify/', '');
        if (id) {
          setPublicVerificationId(decodeURIComponent(id));
          return;
        }
      }

      // Check hash e.g. #/verify/DOC-2026-CSE-000182
      if (hash.startsWith('#/verify/')) {
        const id = hash.replace('#/verify/', '');
        if (id) {
          setPublicVerificationId(decodeURIComponent(id));
          return;
        }
      }

      // Profile checks
      const profileParam = search.get('profile');
      if (profileParam) {
        setPublicProfileId(profileParam);
        return;
      }

      if (path.startsWith('/profile/')) {
        const pid = path.replace('/profile/', '');
        if (pid) setPublicProfileId(decodeURIComponent(pid));
      } else if (hash.startsWith('#/profile/')) {
        const pid = hash.replace('#/profile/', '');
        if (pid) setPublicProfileId(decodeURIComponent(pid));
      }
    };

    handleLocationChange();
    window.addEventListener('popstate', handleLocationChange);
    window.addEventListener('hashchange', handleLocationChange);
    return () => {
      window.removeEventListener('popstate', handleLocationChange);
      window.removeEventListener('hashchange', handleLocationChange);
    };
  }, []);

  if (publicVerificationId) {
    return (
      <PublicVerificationPage
        documentId={publicVerificationId}
        onBack={() => {
          setPublicVerificationId(null);
          window.history.pushState({}, '', '/');
        }}
      />
    );
  }

  if (publicProfileId) {
    return (
      <PublicProfilePage
        studentId={publicProfileId}
        onBack={() => {
          setPublicProfileId(null);
          window.history.pushState({}, '', '/');
        }}
      />
    );
  }

  const handleOpenUploadModal = (cat?: DocumentCategory) => {
    setUploadCategory(cat);
    setIsUploadModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-indigo-500 selection:text-white">
      
      {/* 1. Top Header Navbar */}
      <Navbar
        onOpenUpload={() => handleOpenUploadModal()}
        onNavigate={(tab) => setActiveTab(tab)}
        activeTab={activeTab}
        toggleMobileMenu={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
      />

      {/* 2. Main Workspace Layout */}
      <div className="flex-1 flex max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 gap-6">
        
        {/* Navigation Sidebar */}
        <Sidebar
          activeTab={activeTab}
          onSelectTab={(tab) => setActiveTab(tab)}
          isOpen={isMobileSidebarOpen}
          onClose={() => setIsMobileSidebarOpen(false)}
        />

        {/* Main Content Area */}
        <main className="flex-1 lg:pl-64 min-w-0">
          
          {/* 1. My Dashboard */}
          {activeTab === 'dashboard' && (
            <DashboardView
              onNavigate={(tab) => setActiveTab(tab)}
              onOpenUpload={() => handleOpenUploadModal()}
              onPreviewDoc={(doc) => setPreviewDoc(doc)}
              onOpenQR={(doc) => setQrDoc(doc)}
              onOpenReceipt={(doc) => setReceiptDoc(doc)}
            />
          )}

          {/* 2. My Certifications */}
          {activeTab === 'certifications' && (
            <CertificationsView
              onOpenUpload={(cat) => handleOpenUploadModal(cat)}
              onPreviewDoc={(doc) => setPreviewDoc(doc)}
              onOpenQR={(doc) => setQrDoc(doc)}
              onOpenReceipt={(doc) => setReceiptDoc(doc)}
            />
          )}

          {/* 3. Upload Certification */}
          {activeTab === 'upload' && (
            <UploadView
              onSuccess={() => setActiveTab('certifications')}
            />
          )}

          {/* 4. Download Center */}
          {activeTab === 'download-center' && (
            <DownloadCenterView
              onOpenReceipt={(doc) => setReceiptDoc(doc)}
              onPreviewDoc={(doc) => setPreviewDoc(doc)}
            />
          )}

          {/* 5. My Profile */}
          {activeTab === 'profile' && (
            <ProfileView
              onNavigate={(tab) => setActiveTab(tab)}
            />
          )}

          {/* 6. QR Verification */}
          {activeTab === 'verification' && (
            <VerificationView
              onOpenQR={(doc) => setQrDoc(doc)}
              onOpenReceipt={(doc) => setReceiptDoc(doc)}
              onPreviewDoc={(doc) => setPreviewDoc(doc)}
              onOpenVerifyDirect={(docId) => setPublicVerificationId(docId)}
            />
          )}

        </main>
      </div>

      {/* Global Modals */}
      <DocumentPreviewModal
        document={previewDoc}
        onClose={() => setPreviewDoc(null)}
        onOpenQR={(doc) => setQrDoc(doc)}
        onOpenReceipt={(doc) => setReceiptDoc(doc)}
      />

      <QRModal
        document={qrDoc}
        onClose={() => setQrDoc(null)}
      />

      <DigitalReceiptModal
        document={receiptDoc}
        student={studentProfile}
        onClose={() => setReceiptDoc(null)}
      />

      <UploadModal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        defaultCategory={uploadCategory}
      />

      <VersionDrawer
        document={versionDoc}
        onClose={() => setVersionDoc(null)}
      />

    </div>
  );
};

export const App: React.FC = () => {
  return (
    <VaultProvider>
      <MainApp />
    </VaultProvider>
  );
};

export default App;
