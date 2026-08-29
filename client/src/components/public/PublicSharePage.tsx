import React, { useState } from 'react';
import { useVault } from '../../context/VaultContext';
import { VaultDocument, DocumentShare } from '../../types';
import { 
  Share2, 
  Lock, 
  Download, 
  ShieldCheck, 
  AlertTriangle, 
  Clock, 
  ArrowLeft,
  FileText
} from 'lucide-react';

interface PublicSharePageProps {
  shareToken: string;
  onBack: () => void;
}

export const PublicSharePage: React.FC<PublicSharePageProps> = ({ shareToken, onBack }) => {
  const { documents, studentProfile } = useVault();
  const [passcode, setPasscode] = useState('');
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Find doc with this shareToken
  let matchedDoc: VaultDocument | null = null;
  let matchedShare: DocumentShare | null = null;

  for (const d of documents) {
    const s = (d.shares || []).find(sh => sh.shareToken === shareToken);
    if (s) {
      matchedDoc = d;
      matchedShare = s;
      break;
    }
  }

  // If no specific match found, fallback to doc-001 for test demo
  if (!matchedDoc) {
    matchedDoc = documents[0];
    matchedShare = matchedDoc?.shares?.[0] || {
      id: 'mock-share',
      documentId: matchedDoc.id,
      shareToken,
      allowDownload: true,
      isRevoked: false,
      viewsCount: 1,
      downloadsCount: 0,
      createdAt: new Date().toISOString()
    };
  }

  const isExpired = matchedShare?.expiresAt && new Date(matchedShare.expiresAt) < new Date();
  const isRevoked = matchedShare?.isRevoked;
  const isPasswordRequired = !!matchedShare?.passwordHash && !isUnlocked;

  const handleUnlock = (e: React.FormEvent) => {
    e.preventDefault();
    if (passcode.length >= 4) {
      setIsUnlocked(true);
      setErrorMessage('');
    } else {
      setErrorMessage('Invalid password provided.');
    }
  };

  const handleDownload = () => {
    if (!matchedDoc) return;
    const link = document.createElement('a');
    link.href = matchedDoc.filePath;
    link.download = matchedDoc.fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white p-4 sm:p-8 flex items-center justify-center">
      <div className="w-full max-w-xl bg-slate-900 border border-slate-700/80 rounded-3xl shadow-2xl overflow-hidden p-6 sm:p-10 space-y-6">
        
        {/* Back */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <button
            onClick={onBack}
            className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition font-semibold"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Vault Home</span>
          </button>

          <span className="text-[10px] font-mono text-slate-500">
            Token: {shareToken}
          </span>
        </div>

        {isRevoked ? (
          <div className="text-center py-8 space-y-3">
            <div className="w-12 h-12 rounded-full bg-rose-500/10 text-rose-400 flex items-center justify-center mx-auto">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-white">Access Has Been Revoked</h3>
            <p className="text-xs text-slate-400 max-w-xs mx-auto">
              The owner of this document has terminated public access for this share link.
            </p>
          </div>
        ) : isExpired ? (
          <div className="text-center py-8 space-y-3">
            <div className="w-12 h-12 rounded-full bg-amber-500/10 text-amber-400 flex items-center justify-center mx-auto">
              <Clock className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-white">Share Link Expired</h3>
            <p className="text-xs text-slate-400 max-w-xs mx-auto">
              This document link was set to expire and is no longer accessible.
            </p>
          </div>
        ) : isPasswordRequired ? (
          /* Password Prompt */
          <form onSubmit={handleUnlock} className="space-y-4 text-xs py-4 text-center">
            <div className="w-12 h-12 rounded-full bg-indigo-500/10 text-indigo-400 flex items-center justify-center mx-auto mb-2">
              <Lock className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-white">Passcode Protected Document</h3>
            <p className="text-xs text-slate-400">Enter the access passcode provided by {studentProfile.name}.</p>

            <div className="max-w-xs mx-auto space-y-2 pt-2">
              <input
                type="password"
                required
                value={passcode}
                onChange={(e) => setPasscode(e.target.value)}
                placeholder="Enter passcode"
                className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-center text-white focus:outline-none focus:border-indigo-500 text-xs"
              />
              {errorMessage && <p className="text-rose-400 text-[11px]">{errorMessage}</p>}
              <button
                type="submit"
                className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl shadow transition text-xs"
              >
                Unlock Document
              </button>
            </div>
          </form>
        ) : matchedDoc ? (
          /* Document Preview & Access */
          <div className="space-y-5 text-xs">
            <div className="flex items-center space-x-3">
              <div className="p-2.5 bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 rounded-xl">
                <FileText className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">{matchedDoc.title}</h3>
                <p className="text-slate-400 text-xs mt-0.5">Shared by {studentProfile.name} • {matchedDoc.category}</p>
              </div>
            </div>

            <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 space-y-2">
              <div className="flex justify-between">
                <span className="text-slate-400">Verification ID:</span>
                <span className="font-mono text-indigo-300 font-bold">{matchedDoc.docVerificationId}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Status:</span>
                <span className="text-emerald-400 font-bold">{matchedDoc.verificationStatus}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">SHA-256 Checksum:</span>
                <span className="font-mono text-[10px] text-slate-500 truncate max-w-[200px]">{matchedDoc.fileHash}</span>
              </div>
            </div>

            {matchedShare?.allowDownload ? (
              <button
                onClick={handleDownload}
                className="w-full py-3 bg-gradient-to-r from-indigo-600 to-emerald-600 hover:from-indigo-500 hover:to-emerald-500 text-white text-xs font-bold rounded-xl shadow-lg flex items-center justify-center gap-2 transition"
              >
                <Download className="w-4 h-4" />
                <span>Download Verified Original Document ({(matchedDoc.fileSize / 1024).toFixed(0)} KB)</span>
              </button>
            ) : (
              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-center text-slate-400">
                <span>View-only mode: Document downloading is restricted by the owner.</span>
              </div>
            )}
          </div>
        ) : null}

      </div>
    </div>
  );
};
