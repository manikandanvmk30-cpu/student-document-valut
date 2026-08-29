import React, { useState } from 'react';
import { useVault } from '../../context/VaultContext';
import { VaultDocument } from '../../types';
import { 
  ShieldCheck, 
  Search, 
  QrCode, 
  Award, 
  Check, 
  Copy, 
  Eye,
  Download
} from 'lucide-react';

interface VerificationViewProps {
  onOpenQR: (doc: VaultDocument) => void;
  onOpenReceipt: (doc: VaultDocument) => void;
  onPreviewDoc: (doc: VaultDocument) => void;
  onOpenVerifyDirect: (docId: string) => void;
}

export const VerificationView: React.FC<VerificationViewProps> = ({
  onOpenQR,
  onPreviewDoc,
  onOpenVerifyDirect
}) => {
  const { documents, downloadCertificatePdf } = useVault();
  const [lookupId, setLookupId] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const activeDocs = documents.filter(d => !d.isRecycled && !d.isArchived);

  const copyId = (id: string) => {
    navigator.clipboard.writeText(id);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleLookupSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!lookupId.trim()) return;
    onOpenVerifyDirect(lookupId.trim());
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div>
        <div className="flex items-center space-x-2">
          <ShieldCheck className="w-6 h-6 text-indigo-400" />
          <h2 className="text-xl font-extrabold text-white">QR Verification & Lookup</h2>
        </div>
        <p className="text-xs text-slate-400 mt-1">
          Verify digital credentials using cryptographic SHA-256 signatures, dynamic QR codes, and PDF receipts.
        </p>
      </div>

      {/* Lookup Bar */}
      <div className="p-6 bg-slate-900/80 border border-slate-800 rounded-2xl shadow-xl space-y-3">
        <h3 className="font-bold text-white text-sm">Public Credential Verification Lookup</h3>
        <p className="text-xs text-slate-400">
          Enter any Certificate Verification ID to verify authenticity.
        </p>

        <form onSubmit={handleLookupSubmit} className="flex flex-col sm:flex-row gap-2 pt-1 max-w-xl">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={lookupId}
              onChange={(e) => setLookupId(e.target.value)}
              placeholder="e.g. DOC-2026-CSE-000182"
              className="w-full pl-9 pr-3 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 font-mono focus:outline-none focus:border-indigo-500"
            />
          </div>
          <button
            type="submit"
            className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl text-xs shadow flex items-center justify-center gap-1.5 transition shrink-0"
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Verify Credential</span>
          </button>
        </form>
      </div>

      {/* Certificates List with QR & PDF Download */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-white">Stored Certificates & Verification IDs</h3>
            <p className="text-xs text-slate-400 mt-0.5">{activeDocs.length} certificates cryptographically indexed</p>
          </div>
        </div>

        <div className="space-y-3">
          {activeDocs.map((doc) => (
            <div
              key={doc.id}
              className="p-4 bg-slate-950/70 hover:bg-slate-950 border border-slate-800 rounded-xl transition flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
            >
              <div className="space-y-1">
                <h4 
                  onClick={() => onPreviewDoc(doc)}
                  className="font-bold text-white hover:text-indigo-300 cursor-pointer transition text-sm"
                >
                  {doc.title}
                </h4>

                <div className="flex items-center gap-2 text-slate-500 font-mono text-[11px] pt-1">
                  <span>Verification ID:</span>
                  <span className="text-indigo-300 font-bold select-all">{doc.docVerificationId}</span>
                  <button
                    onClick={() => copyId(doc.docVerificationId)}
                    className="text-slate-400 hover:text-white p-0.5"
                    title="Copy ID"
                  >
                    {copiedId === doc.docVerificationId ? (
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                  </button>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center space-x-2 shrink-0">
                <button
                  onClick={() => onPreviewDoc(doc)}
                  className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-slate-200 hover:text-white rounded-lg border border-slate-800 text-xs font-semibold flex items-center gap-1.5 transition"
                  title="Show PDF Preview"
                >
                  <Eye className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Show PDF</span>
                </button>

                <button
                  onClick={() => onOpenQR(doc)}
                  className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-indigo-400 rounded-lg border border-slate-800 text-xs font-semibold flex items-center gap-1.5 transition"
                >
                  <QrCode className="w-3.5 h-3.5" />
                  <span>QR Code</span>
                </button>

                <button
                  onClick={() => downloadCertificatePdf(doc)}
                  className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition shadow"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download PDF</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
