import React, { useState } from 'react';
import { VaultDocument } from '../../types';
import { useVault } from '../../context/VaultContext';
import { 
  X, 
  Download, 
  Eye, 
  QrCode, 
  FileText, 
  ShieldCheck, 
  ChevronLeft,
  ChevronRight,
  ZoomIn,
  ZoomOut
} from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';

interface PdfPreviewModalProps {
  document: VaultDocument | null;
  onClose: () => void;
  onOpenQR: (doc: VaultDocument) => void;
}

export const PdfPreviewModal: React.FC<PdfPreviewModalProps> = ({
  document,
  onClose,
  onOpenQR
}) => {
  const { studentProfile, downloadCertificatePdf, showCertificatePdf } = useVault();
  const [activePage, setActivePage] = useState<1 | 2>(1);
  const [zoomLevel, setZoomLevel] = useState(100);

  if (!document) return null;

  const verifyUrl = `${window.location.origin}/verify/${document.docVerificationId}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-3 sm:p-5 overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[95vh]">
        
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between px-6 py-3.5 border-b border-slate-800 bg-slate-950/80 gap-3">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 rounded-xl">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white tracking-wide truncate max-w-md">
                {document.title}
              </h3>
              <p className="text-[11px] text-slate-400 mt-0.5 flex items-center gap-2">
                <span className="font-mono text-indigo-300">{document.docVerificationId}</span>
                <span>•</span>
                <span>{document.category}</span>
                <span>•</span>
                <span className="text-emerald-400 font-semibold">2 Pages (Uploaded + Issued)</span>
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2 shrink-0">
            {/* Show PDF in Browser Tab */}
            <button
              onClick={() => showCertificatePdf(document)}
              className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-xl border border-slate-700 flex items-center gap-1.5 transition"
              title="Open full PDF in new window"
            >
              <Eye className="w-3.5 h-3.5 text-indigo-400" />
              <span>Show PDF</span>
            </button>

            {/* Download PDF */}
            <button
              onClick={() => downloadCertificatePdf(document)}
              className="px-3.5 py-1.5 bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-white text-xs font-bold rounded-xl shadow-lg flex items-center gap-1.5 transition"
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

        {/* Page Switcher Bar */}
        <div className="px-6 py-2.5 bg-slate-900 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs">
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
              <span>2. Issued File (Record & QR)</span>
            </button>
          </div>

          {/* Zoom Controls */}
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setZoomLevel(prev => Math.max(70, prev - 15))}
              className="p-1.5 bg-slate-800 hover:bg-slate-700 rounded text-slate-300"
              title="Zoom Out"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <span className="text-slate-300 font-mono text-[11px] w-12 text-center">{zoomLevel}%</span>
            <button
              onClick={() => setZoomLevel(prev => Math.min(150, prev + 15))}
              className="p-1.5 bg-slate-800 hover:bg-slate-700 rounded text-slate-300"
              title="Zoom In"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Document Content Canvas */}
        <div className="flex-1 bg-slate-950 p-6 overflow-auto flex justify-center items-start min-h-[420px]">
          <div 
            style={{ transform: `scale(${zoomLevel / 100})`, transformOrigin: 'top center', transition: 'transform 0.15s ease-out' }}
            className="w-full max-w-2xl bg-white text-slate-900 rounded-xl shadow-2xl border border-slate-300 overflow-hidden relative"
          >
            {activePage === 1 ? (
              
              /* PAGE 1: Uploaded File */
              <div className="p-8 space-y-6">
                {/* Header Banner */}
                <div className="bg-slate-900 text-white p-3 rounded-lg flex items-center justify-between text-xs">
                  <div className="flex items-center space-x-2 font-bold tracking-wide">
                    <FileText className="w-4 h-4 text-indigo-400" />
                    <span>PAGE 1: ORIGINAL UPLOADED CERTIFICATE FILE</span>
                  </div>
                  <span className="px-2 py-0.5 bg-indigo-500/20 text-indigo-300 rounded font-mono text-[10px]">
                    {document.category}
                  </span>
                </div>

                {/* Uploaded File Visual Preview */}
                {document.fileDataUrl && document.fileDataUrl.startsWith('data:application/pdf') ? (
                  <div className="bg-slate-100 p-2 rounded-xl border border-slate-200">
                    <iframe 
                      src={document.fileDataUrl} 
                      className="w-full h-[450px] rounded-lg border border-slate-300 bg-white"
                      title={document.title}
                    />
                  </div>
                ) : document.fileDataUrl && document.fileDataUrl.startsWith('data:image/') ? (
                  <div className="flex justify-center bg-slate-100 p-4 rounded-xl border border-slate-200">
                    <img 
                      src={document.fileDataUrl} 
                      alt={document.title}
                      className="max-h-[380px] object-contain rounded-lg shadow"
                    />
                  </div>
                ) : (
                  <div className="p-8 border-4 border-double border-indigo-900/40 rounded-xl bg-gradient-to-b from-slate-50 to-white text-center space-y-5">
                    <div className="space-y-1">
                      <p className="text-xs uppercase tracking-widest text-slate-500 font-bold">Official Credential Document</p>
                      <h2 className="text-2xl font-serif font-extrabold text-slate-900">{document.title}</h2>
                    </div>

                    <div className="py-3 border-y border-indigo-100 space-y-1">
                      <p className="text-xs text-slate-600">This document verifies completion for candidate:</p>
                      <p className="text-lg font-bold text-indigo-900 font-serif">{studentProfile.name}</p>
                      <p className="text-xs text-slate-500 font-mono">ID: {studentProfile.studentId} • {studentProfile.department}</p>
                    </div>

                    <div className="grid grid-cols-2 gap-3 text-left text-xs bg-slate-50 p-4 rounded-lg border border-slate-200">
                      <div>
                        <span className="text-[10px] text-slate-500 uppercase block">Category</span>
                        <span className="font-semibold text-slate-800">{document.category}</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-500 uppercase block">Verification ID</span>
                        <span className="font-mono font-bold text-indigo-900">{document.docVerificationId}</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-500 uppercase block">Original File</span>
                        <span className="font-mono text-slate-700 truncate block">{document.originalName || document.fileName}</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-500 uppercase block">Document Hash</span>
                        <span className="font-mono text-[9px] text-slate-600 truncate block">{document.fileHash.slice(0, 20)}...</span>
                      </div>
                    </div>

                    <div className="pt-4 flex items-center justify-between text-xs text-slate-500 border-t border-slate-200">
                      <span>Authority: {document.issuer || 'Institutional Board'}</span>
                      <span className="font-mono text-[10px]">Attested Scan</span>
                    </div>
                  </div>
                )}

                <div className="text-center text-[10px] text-slate-400">
                  Page 1 of 2 • Stored in Student Document Vault
                </div>
              </div>

            ) : (

              /* PAGE 2: Issued File (Attestation & QR Record) */
              <div className="p-8 space-y-6">
                {/* Header Banner */}
                <div className="bg-slate-900 text-white p-3 rounded-lg flex items-center justify-between text-xs">
                  <div className="flex items-center space-x-2 font-bold tracking-wide">
                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                    <span>PAGE 2: OFFICIAL ISSUED FILE & CERTIFICATE RECORD</span>
                  </div>
                  <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-300 rounded font-mono text-[10px]">
                    SDV Attested
                  </span>
                </div>

                {/* College Title */}
                <div className="text-center space-y-1">
                  <h2 className="text-lg font-bold text-slate-900 uppercase tracking-wide">
                    {studentProfile.college}
                  </h2>
                  <p className="text-xs text-slate-600">
                    Department of {studentProfile.department} • Digital Records Cell
                  </p>
                  <div className="mt-2 inline-block px-3 py-0.5 bg-emerald-100 text-emerald-900 text-[10px] font-bold rounded-full border border-emerald-300">
                    OFFICIAL RECORD CERTIFICATE OF ISSUANCE & VERIFICATION
                  </div>
                </div>

                {/* Attestation Table */}
                <table className="w-full text-xs border-collapse border border-slate-300">
                  <tbody>
                    <tr className="border-b border-slate-200 bg-slate-50">
                      <td className="p-2 font-bold text-slate-700 w-1/3">Document Title</td>
                      <td className="p-2 font-semibold text-slate-900">{document.title}</td>
                    </tr>
                    <tr className="border-b border-slate-200">
                      <td className="p-2 font-bold text-slate-700">Category</td>
                      <td className="p-2 text-slate-800">{document.category}</td>
                    </tr>
                    <tr className="border-b border-slate-200 bg-slate-50">
                      <td className="p-2 font-bold text-slate-700">Verification ID</td>
                      <td className="p-2 font-mono font-bold text-indigo-900">{document.docVerificationId}</td>
                    </tr>
                    <tr className="border-b border-slate-200">
                      <td className="p-2 font-bold text-slate-700">Candidate Name</td>
                      <td className="p-2 font-semibold text-slate-900">{studentProfile.name}</td>
                    </tr>
                    <tr className="border-b border-slate-200 bg-slate-50">
                      <td className="p-2 font-bold text-slate-700">Student ID / Reg No</td>
                      <td className="p-2 font-mono text-slate-800">{studentProfile.studentId} / {studentProfile.regNo}</td>
                    </tr>
                    <tr className="border-b border-slate-200">
                      <td className="p-2 font-bold text-slate-700">Date of Record</td>
                      <td className="p-2 text-slate-800">{new Date(document.createdAt).toLocaleDateString()}</td>
                    </tr>
                    <tr className="bg-slate-50">
                      <td className="p-2 font-bold text-slate-700">Institution</td>
                      <td className="p-2 text-slate-800">{studentProfile.college}</td>
                    </tr>
                  </tbody>
                </table>

                {/* Bottom Row: Clean QR Code */}
                <div className="flex flex-col items-center justify-center pt-3 border-t border-slate-200 space-y-1">
                  <QRCodeSVG
                    value={verifyUrl}
                    size={75}
                    level="M"
                  />
                  <p className="text-[10px] font-mono text-slate-500 font-semibold">Verification ID: {document.docVerificationId}</p>
                </div>

                <div className="text-center text-[10px] text-slate-400">
                  Page 2 of 2 • Official Issued Record
                </div>
              </div>

            )}
          </div>
        </div>

        {/* Footer Navigation */}
        <div className="px-6 py-3 bg-slate-950 border-t border-slate-800 flex items-center justify-between text-xs">
          <button
            onClick={() => setActivePage(activePage === 1 ? 2 : 1)}
            className="px-3.5 py-1.5 bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white rounded-xl border border-slate-800 flex items-center gap-1.5 transition"
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

          <div className="flex items-center space-x-2">
            <button
              onClick={() => onOpenQR(document)}
              className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-indigo-400 rounded-xl border border-slate-800 flex items-center gap-1.5 transition font-semibold"
            >
              <QrCode className="w-3.5 h-3.5" />
              <span>QR Code</span>
            </button>

            <button
              onClick={() => downloadCertificatePdf(document)}
              className="px-4 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl shadow flex items-center gap-1.5 transition"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download 2-Page PDF</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
