import React, { useState } from 'react';
import { VaultDocument } from '../../types';
import { useVault } from '../../context/VaultContext';
import { 
  X, 
  Download, 
  Eye,
  FileText, 
  QrCode, 
  Copy, 
  Check, 
  ZoomIn, 
  ZoomOut, 
  RotateCw, 
  Hash,
  ShieldCheck,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';

interface DocumentPreviewModalProps {
  document: VaultDocument | null;
  onClose: () => void;
  onOpenQR: (doc: VaultDocument) => void;
  onOpenReceipt?: (doc: VaultDocument) => void;
}

export const DocumentPreviewModal: React.FC<DocumentPreviewModalProps> = ({
  document,
  onClose,
  onOpenQR
}) => {
  const { studentProfile, downloadCertificatePdf, showCertificatePdf } = useVault();
  const [activePage, setActivePage] = useState<1 | 2>(1);
  const [copiedHash, setCopiedHash] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(100);

  if (!document) return null;

  const verifyUrl = `${window.location.origin}/verify/${document.docVerificationId}`;

  const copyHash = () => {
    navigator.clipboard.writeText(document.fileHash);
    setCopiedHash(true);
    setTimeout(() => setCopiedHash(false), 2000);
  };

  const handleDownload = () => {
    downloadCertificatePdf(document);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-3 sm:p-5 overflow-y-auto">
      <div className="relative w-full max-w-5xl bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[94vh]">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between px-6 py-3.5 border-b border-slate-800 bg-slate-950/80 gap-3">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 bg-indigo-500/10 border border-indigo-500/20 rounded-xl text-indigo-400">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white tracking-wide truncate max-w-md">{document.title}</h3>
              <p className="text-xs text-slate-400 mt-0.5 flex items-center gap-2">
                <span className="font-mono text-indigo-300">{document.docVerificationId}</span>
                <span>•</span>
                <span>{(document.fileSize / 1024).toFixed(1)} KB</span>
                <span>•</span>
                <span>{document.category}</span>
                <span>•</span>
                <span className="text-emerald-400 font-semibold">2 Pages (Uploaded + Issued)</span>
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2 shrink-0">
            {/* Show PDF in new tab */}
            <button
              onClick={() => showCertificatePdf(document)}
              className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-xl border border-slate-700 flex items-center gap-1.5 transition"
              title="Open full PDF in browser tab"
            >
              <Eye className="w-3.5 h-3.5 text-indigo-400" />
              <span>Show PDF</span>
            </button>

            {/* QR Code */}
            <button
              onClick={() => onOpenQR(document)}
              className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-indigo-300 text-xs font-semibold rounded-xl border border-slate-700 flex items-center gap-1.5 transition"
              title="View Verification QR Code"
            >
              <QrCode className="w-3.5 h-3.5" />
              <span>QR Code</span>
            </button>

            {/* Download PDF */}
            <button
              onClick={handleDownload}
              className="px-4 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-xl shadow flex items-center gap-1.5 transition"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download PDF</span>
            </button>

            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content Body: Left Document Canvas + Right Metadata Panel */}
        <div className="grid grid-cols-1 lg:grid-cols-3 flex-1 overflow-hidden">
          
          {/* Main Document Viewer */}
          <div className="lg:col-span-2 bg-slate-950 flex flex-col items-center justify-between p-4 overflow-auto border-r border-slate-800/80">
            
            {/* Page Selector & Zoom Bar */}
            <div className="w-full flex flex-wrap items-center justify-between pb-3 mb-2 border-b border-slate-800/60 text-xs text-slate-400 gap-2">
              <div className="flex items-center space-x-2">
                <span className="text-slate-400 font-medium">Page:</span>
                <button
                  onClick={() => setActivePage(1)}
                  className={`px-3 py-1 rounded-lg font-semibold transition text-xs flex items-center gap-1.5 ${
                    activePage === 1
                      ? 'bg-indigo-600 text-white shadow'
                      : 'bg-slate-800 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span>1. Uploaded File</span>
                </button>
                <button
                  onClick={() => setActivePage(2)}
                  className={`px-3 py-1 rounded-lg font-semibold transition text-xs flex items-center gap-1.5 ${
                    activePage === 2
                      ? 'bg-indigo-600 text-white shadow'
                      : 'bg-slate-800 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  <span>2. Issued File</span>
                </button>
              </div>

              <div className="flex items-center space-x-2">
                <button 
                  onClick={() => setZoomLevel(prev => Math.max(60, prev - 15))}
                  className="p-1.5 bg-slate-900 hover:bg-slate-800 rounded text-slate-300 transition"
                  title="Zoom Out"
                >
                  <ZoomOut className="w-3.5 h-3.5" />
                </button>
                <span className="font-mono text-xs text-slate-300 w-12 text-center">{zoomLevel}%</span>
                <button 
                  onClick={() => setZoomLevel(prev => Math.min(180, prev + 15))}
                  className="p-1.5 bg-slate-900 hover:bg-slate-800 rounded text-slate-300 transition"
                  title="Zoom In"
                >
                  <ZoomIn className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Document Render Canvas */}
            <div className="flex-1 w-full flex items-start justify-center py-4 overflow-auto min-h-[360px]">
              <div 
                style={{ 
                  transform: `scale(${zoomLevel / 100})`,
                  transformOrigin: 'top center',
                  transition: 'transform 0.15s ease-out'
                }}
                className="w-full max-w-lg bg-white rounded-xl shadow-2xl overflow-hidden border border-slate-300 text-slate-900"
              >
                {activePage === 1 ? (
                  
                  /* PAGE 1: Uploaded File */
                  <div className="p-6 space-y-4">
                    <div className="bg-slate-900 text-white p-2.5 rounded-lg flex items-center justify-between text-xs">
                      <span className="font-bold flex items-center gap-1.5">
                        <FileText className="w-3.5 h-3.5 text-indigo-400" />
                        PAGE 1: ORIGINAL UPLOADED FILE
                      </span>
                      <span className="px-2 py-0.5 bg-indigo-500/20 text-indigo-300 rounded font-mono text-[10px]">
                        {document.category}
                      </span>
                    </div>

                    {document.fileDataUrl && document.fileDataUrl.startsWith('data:application/pdf') ? (
                      <div className="bg-slate-100 p-2 rounded-lg border border-slate-200">
                        <iframe 
                          src={document.fileDataUrl} 
                          className="w-full h-[380px] rounded border border-slate-300 bg-white"
                          title={document.title}
                        />
                      </div>
                    ) : document.fileDataUrl && document.fileDataUrl.startsWith('data:image/') ? (
                      <div className="flex justify-center bg-slate-100 p-3 rounded-lg border border-slate-200">
                        <img 
                          src={document.fileDataUrl} 
                          alt={document.title}
                          className="max-h-[300px] object-contain rounded shadow"
                        />
                      </div>
                    ) : (
                      <div className="p-6 border-2 border-indigo-900/30 rounded-xl bg-slate-50/60 text-center space-y-3">
                        <h2 className="text-xl font-bold text-slate-900 font-serif">{document.title}</h2>
                        <p className="text-xs text-slate-600">Candidate: <strong className="text-indigo-950">{studentProfile.name}</strong></p>
                        <div className="p-3 bg-white rounded border border-slate-200 text-xs text-left grid grid-cols-2 gap-2">
                          <div>
                            <span className="text-[10px] text-slate-500 block uppercase">Category</span>
                            <span className="font-semibold text-slate-800">{document.category}</span>
                          </div>
                          <div>
                            <span className="text-[10px] text-slate-500 block uppercase">ID</span>
                            <span className="font-mono text-indigo-900 font-bold">{document.docVerificationId}</span>
                          </div>
                        </div>
                      </div>
                    )}
                    <p className="text-center text-[10px] text-slate-400">Page 1 of 2 • Uploaded Document Scan</p>
                  </div>

                ) : (

                  /* PAGE 2: Issued File (Attestation & QR) */
                  <div className="p-6 space-y-4">
                    <div className="bg-slate-900 text-white p-2.5 rounded-lg flex items-center justify-between text-xs">
                      <span className="font-bold flex items-center gap-1.5">
                        <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                        PAGE 2: OFFICIAL ISSUED RECORD
                      </span>
                      <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-300 rounded font-mono text-[10px]">
                        SDV Attested
                      </span>
                    </div>

                    <div className="text-center space-y-1">
                      <h3 className="text-sm font-bold text-slate-900 uppercase">{studentProfile.college}</h3>
                      <p className="text-[11px] text-slate-600">Department of {studentProfile.department}</p>
                    </div>

                    <table className="w-full text-xs border border-slate-200">
                      <tbody>
                        <tr className="border-b border-slate-200 bg-slate-50">
                          <td className="p-2 font-bold text-slate-600 w-1/3">Title</td>
                          <td className="p-2 font-semibold text-slate-900">{document.title}</td>
                        </tr>
                        <tr className="border-b border-slate-200">
                          <td className="p-2 font-bold text-slate-600">Category</td>
                          <td className="p-2 text-slate-800">{document.category}</td>
                        </tr>
                        <tr className="border-b border-slate-200 bg-slate-50">
                          <td className="p-2 font-bold text-slate-600">Verification ID</td>
                          <td className="p-2 font-mono font-bold text-indigo-900">{document.docVerificationId}</td>
                        </tr>
                        <tr className="border-b border-slate-200">
                          <td className="p-2 font-bold text-slate-600">Candidate</td>
                          <td className="p-2 font-semibold text-slate-900">{studentProfile.name}</td>
                        </tr>
                        <tr>
                          <td className="p-2 font-bold text-slate-600">Institution</td>
                          <td className="p-2 text-slate-800">{studentProfile.college}</td>
                        </tr>
                      </tbody>
                    </table>

                    <div className="flex flex-col items-center justify-center pt-3 border-t border-slate-200 space-y-1">
                      <QRCodeSVG value={verifyUrl} size={65} level="M" />
                      <p className="text-[10px] font-mono text-slate-500 font-semibold">Verification ID: {document.docVerificationId}</p>
                    </div>
                    <p className="text-center text-[10px] text-slate-400">Page 2 of 2 • Official Issued Record</p>
                  </div>

                )}
              </div>
            </div>

            {/* Page Navigation */}
            <div className="w-full pt-3 border-t border-slate-800/60 flex items-center justify-between text-xs">
              <button
                onClick={() => setActivePage(activePage === 1 ? 2 : 1)}
                className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white rounded-lg border border-slate-800 flex items-center gap-1.5 transition"
              >
                {activePage === 1 ? (
                  <>
                    <span>Next: Page 2 (Issued File)</span>
                    <ChevronRight className="w-4 h-4" />
                  </>
                ) : (
                  <>
                    <ChevronLeft className="w-4 h-4" />
                    <span>Prev: Page 1 (Uploaded File)</span>
                  </>
                )}
              </button>

              <span className="text-slate-500 font-mono text-[11px]">
                Showing Page {activePage} of 2
              </span>
            </div>

          </div>

          {/* Right Metadata */}
          <div className="bg-slate-900 p-6 overflow-y-auto space-y-5 text-xs">

            {/* Properties */}
            <div className="space-y-3">
              <h4 className="font-semibold text-slate-300 uppercase tracking-wider text-[11px]">
                Certificate Details
              </h4>

              <div className="flex justify-between py-2 border-b border-slate-800">
                <span className="text-slate-400">Certificate Name</span>
                <span className="font-medium text-slate-200 truncate max-w-[150px]">{document.title}</span>
              </div>

              <div className="flex justify-between py-2 border-b border-slate-800">
                <span className="text-slate-400">Category</span>
                <span className="font-medium text-slate-200">{document.category}</span>
              </div>

              <div className="flex justify-between py-2 border-b border-slate-800">
                <span className="text-slate-400">Verification ID</span>
                <span className="font-mono text-indigo-300 font-bold">{document.docVerificationId}</span>
              </div>

              <div className="flex justify-between py-2 border-b border-slate-800">
                <span className="text-slate-400">File Size</span>
                <span className="text-slate-200 font-mono">{(document.fileSize / 1024).toFixed(1)} KB</span>
              </div>

              <div className="flex justify-between py-2 border-b border-slate-800">
                <span className="text-slate-400">Structure</span>
                <span className="text-emerald-400 font-semibold">2 Pages (Uploaded + Issued)</span>
              </div>

              <div className="flex justify-between py-2 border-b border-slate-800">
                <span className="text-slate-400">Upload Date</span>
                <span className="text-slate-200">{new Date(document.createdAt).toLocaleDateString()}</span>
              </div>
            </div>

            {/* Direct Actions */}
            <div className="space-y-2 pt-2">
              <button
                onClick={() => showCertificatePdf(document)}
                className="w-full py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold rounded-xl border border-slate-700 flex items-center justify-center gap-2 transition"
              >
                <Eye className="w-4 h-4 text-indigo-400" />
                <span>Show Full PDF in Tab</span>
              </button>

              <button
                onClick={handleDownload}
                className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl shadow-lg flex items-center justify-center gap-2 transition"
              >
                <Download className="w-4 h-4" />
                <span>Download 2-Page PDF</span>
              </button>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};
