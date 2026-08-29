import React, { useState } from 'react';
import { useVault } from '../../context/VaultContext';
import { VaultDocument } from '../../types';
import { 
  ShieldCheck, 
  CheckCircle2, 
  Building2, 
  Calendar, 
  Hash, 
  ArrowLeft, 
  Printer, 
  Lock, 
  Award,
  AlertTriangle,
  Eye,
  Download,
  FileText
} from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';

interface PublicVerificationPageProps {
  documentId: string;
  onBack: () => void;
}

export const PublicVerificationPage: React.FC<PublicVerificationPageProps> = ({
  documentId,
  onBack
}) => {
  const { documents, studentProfile, downloadCertificatePdf, showCertificatePdf } = useVault();
  const [activeTab, setActiveTab] = useState<'uploaded' | 'attestation'>('uploaded');
  
  const doc = documents.find(d => 
    d.docVerificationId.toLowerCase() === documentId.toLowerCase() || 
    d.id.toLowerCase() === documentId.toLowerCase()
  );

  return (
    <div className="min-h-screen bg-slate-950 text-white p-4 sm:p-8 flex items-center justify-center">
      <div className="w-full max-w-3xl bg-slate-900 border border-slate-700/80 rounded-3xl shadow-2xl overflow-hidden p-6 sm:p-8 space-y-6">
        
        {/* Top Back Navigation & Action Bar */}
        <div className="flex flex-wrap items-center justify-between border-b border-slate-800 pb-4 gap-3">
          <button
            onClick={onBack}
            className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition font-semibold"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Portal</span>
          </button>

          {doc && (
            <div className="flex items-center space-x-2">
              <button
                onClick={() => showCertificatePdf(doc)}
                className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-xl border border-slate-700 flex items-center gap-1.5 transition"
                title="Show Full 2-Page PDF in Browser"
              >
                <Eye className="w-3.5 h-3.5 text-indigo-400" />
                <span>Show PDF</span>
              </button>

              <button
                onClick={() => downloadCertificatePdf(doc)}
                className="px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-xl shadow flex items-center gap-1.5 transition"
                title="Download 2-Page PDF (Uploaded File + Issued File)"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download PDF</span>
              </button>

              <button
                onClick={() => window.print()}
                className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-lg transition"
                title="Print Verification Proof"
              >
                <Printer className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>

        {doc ? (
          <div className="space-y-6 text-xs">
            
            {/* Header */}
            <div className="text-center space-y-2">
              <div className="inline-flex p-3 bg-indigo-500/10 border border-indigo-500/30 rounded-2xl text-indigo-400 mb-1">
                <ShieldCheck className="w-8 h-8" />
              </div>
              <h2 className="text-2xl font-black text-white tracking-wide">Official Credential Record</h2>
              <p className="text-xs text-indigo-300 font-mono tracking-wider">
                Verification ID: <span className="font-bold text-white">{doc.docVerificationId}</span>
              </p>
            </div>

            {/* Document View Mode Tabs */}
            <div className="flex items-center justify-center space-x-2 bg-slate-950 p-1 rounded-xl border border-slate-800 max-w-md mx-auto">
              <button
                onClick={() => setActiveTab('uploaded')}
                className={`flex-1 py-1.5 rounded-lg font-semibold transition text-xs flex items-center justify-center gap-1.5 ${
                  activeTab === 'uploaded'
                    ? 'bg-indigo-600 text-white shadow'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <FileText className="w-3.5 h-3.5" />
                <span>1. Uploaded File</span>
              </button>
              <button
                onClick={() => setActiveTab('attestation')}
                className={`flex-1 py-1.5 rounded-lg font-semibold transition text-xs flex items-center justify-center gap-1.5 ${
                  activeTab === 'attestation'
                    ? 'bg-indigo-600 text-white shadow'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>2. Issued Attestation</span>
              </button>
            </div>

            {activeTab === 'uploaded' ? (
              
              /* TAB 1: Appropriate Uploaded File Preview */
              <div className="bg-slate-950 rounded-2xl border border-slate-800 p-6 space-y-4 font-sans">
                <div className="border-b border-slate-800/80 pb-3 flex items-center justify-between">
                  <div>
                    <span className="text-slate-500 text-[10px] uppercase font-semibold">Uploaded Document</span>
                    <h3 className="font-bold text-white text-base mt-0.5">{doc.title}</h3>
                  </div>
                  <span className="px-2.5 py-1 text-xs font-mono font-bold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 rounded-lg">
                    {doc.category}
                  </span>
                </div>

                {doc.fileDataUrl && doc.fileDataUrl.startsWith('data:application/pdf') ? (
                  <div className="bg-slate-900/60 p-2 rounded-xl border border-slate-800">
                    <iframe 
                      src={doc.fileDataUrl} 
                      className="w-full h-[440px] rounded-lg border border-slate-700/60 bg-white"
                      title={doc.title}
                    />
                  </div>
                ) : doc.fileDataUrl && doc.fileDataUrl.startsWith('data:image/') ? (
                  <div className="flex justify-center bg-slate-900/50 p-4 rounded-xl border border-slate-800">
                    <img 
                      src={doc.fileDataUrl} 
                      alt={doc.title}
                      className="max-h-[380px] object-contain rounded-lg shadow-lg"
                    />
                  </div>
                ) : (
                  <div className="p-6 bg-slate-900 border border-slate-800 rounded-xl space-y-3">
                    <div className="flex items-center space-x-3">
                      <div className="p-3 bg-indigo-500/10 text-indigo-400 rounded-xl">
                        <FileText className="w-6 h-6" />
                      </div>
                      <div>
                        <p className="font-bold text-white text-sm">{doc.title}</p>
                        <p className="text-slate-400 text-xs">{doc.originalName || doc.fileName} • {(doc.fileSize / 1024).toFixed(0)} KB</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-xs pt-2 border-t border-slate-800 text-slate-300">
                      <div>
                        <span className="text-[10px] text-slate-500 block">Category</span>
                        <span>{doc.category}</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-500 block">Candidate</span>
                        <span>{studentProfile.name}</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>

            ) : (

              /* TAB 2: Issued File & Official Attestation */
              <div className="p-6 bg-slate-950 rounded-2xl border border-slate-800 space-y-4 font-sans">
                
                <div className="border-b border-slate-800/80 pb-3 flex items-center justify-between">
                  <div>
                    <span className="text-slate-500 text-[10px] uppercase font-semibold">Institutional Attestation</span>
                    <h3 className="font-bold text-white text-base mt-0.5">{studentProfile.college}</h3>
                    <p className="text-xs text-slate-400">Department of {studentProfile.department}</p>
                  </div>
                  <span className="px-2.5 py-1 text-xs font-mono font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-lg">
                    SDV Attested
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <span className="text-slate-500 block text-[10px] uppercase">Candidate Name</span>
                    <span className="font-bold text-slate-200 text-sm">{studentProfile.name}</span>
                    <span className="text-slate-500 text-[11px] block">Reg: {studentProfile.regNo}</span>
                  </div>

                  <div>
                    <span className="text-slate-500 block text-[10px] uppercase">Document Title</span>
                    <span className="font-semibold text-slate-200">{doc.title}</span>
                  </div>

                  <div>
                    <span className="text-slate-500 block text-[10px] uppercase">Verification ID</span>
                    <span className="font-mono font-bold text-indigo-300">{doc.docVerificationId}</span>
                  </div>

                  <div>
                    <span className="text-slate-500 block text-[10px] uppercase">Issue Date</span>
                    <span className="font-semibold text-slate-200">{doc.issueDate || new Date().toISOString().split('T')[0]}</span>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-800 text-xs text-slate-400">
                  <span className="text-slate-500 block text-[10px] uppercase">Institution</span>
                  <span className="font-semibold text-slate-200">{studentProfile.college}</span>
                </div>

              </div>
            )}

            {/* Bottom Row: Clean QR Code */}
            <div className="flex items-center justify-between pt-2">
              <div className="flex items-center space-x-3">
                <div className="p-1 bg-white rounded-lg shadow">
                  <QRCodeSVG value={window.location.href} size={50} level="M" />
                </div>
                <div className="text-[10px] text-slate-500">
                  <p className="font-semibold text-slate-300 font-mono">Verification ID</p>
                  <p className="font-mono text-indigo-400 font-bold">{doc.docVerificationId}</p>
                </div>
              </div>

              <div className="text-right space-y-1">
                <span className="text-[11px] text-emerald-400 font-semibold block">
                  Official Record
                </span>
                <span className="text-[9px] text-slate-500 font-mono">Sri Sivasubramaniya Nadar College of Engineering</span>
              </div>
            </div>

          </div>
        ) : (
          <div className="text-center py-12 space-y-3">
            <div className="w-12 h-12 rounded-full bg-rose-500/10 text-rose-400 flex items-center justify-center mx-auto">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-white">Record Not Found</h3>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              The Verification ID <strong>{documentId}</strong> does not exist in the active repository or has been revoked.
            </p>
          </div>
        )}

      </div>
    </div>
  );
};
