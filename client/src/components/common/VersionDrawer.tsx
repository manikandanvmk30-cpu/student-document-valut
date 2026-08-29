import React, { useState, useRef } from 'react';
import { VaultDocument, DocumentVersion } from '../../types';
import { useVault } from '../../context/VaultContext';
import { 
  X, 
  History, 
  Upload, 
  FileText, 
  CheckCircle2, 
  Clock, 
  Hash, 
  ArrowUpRight,
  Plus,
  Loader2
} from 'lucide-react';

interface VersionDrawerProps {
  document: VaultDocument | null;
  onClose: () => void;
}

export const VersionDrawer: React.FC<VersionDrawerProps> = ({ document, onClose }) => {
  const { uploadNewVersion } = useVault();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [changeNotes, setChangeNotes] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [showUploadForm, setShowUploadForm] = useState(false);

  if (!document) return null;

  const handleUploadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile) return;

    setIsUploading(true);
    await uploadNewVersion(document.id, selectedFile, changeNotes);
    setIsUploading(false);
    setSelectedFile(null);
    setChangeNotes('');
    setShowUploadForm(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-sm">
      <div className="w-full max-w-md bg-slate-900 border-l border-slate-800 h-full flex flex-col shadow-2xl animate-in slide-in-from-right duration-300">
        
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-800 bg-slate-950">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 bg-indigo-500/10 border border-indigo-500/20 rounded-xl text-indigo-400">
              <History className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">Document Version History</h3>
              <p className="text-xs text-slate-400 truncate max-w-[220px]">{document.title}</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-5 flex-1 overflow-y-auto space-y-5">
          
          {/* Active Version Info Card */}
          <div className="p-4 bg-indigo-950/30 border border-indigo-500/30 rounded-xl">
            <div className="flex items-center justify-between">
              <span className="px-2 py-0.5 text-xs font-bold bg-indigo-500 text-white rounded">
                Current Active: v{document.currentVersion}.0
              </span>
              <span className="text-xs text-indigo-300 font-mono">
                {(document.fileSize / 1024).toFixed(1)} KB
              </span>
            </div>
            <p className="text-xs text-slate-300 font-medium mt-2">{document.fileName}</p>
            <p className="text-[11px] text-slate-400 font-mono break-all mt-1 bg-slate-900/80 p-2 rounded border border-slate-800">
              SHA: {document.fileHash.slice(0, 24)}...
            </p>
          </div>

          {/* New Version Upload Trigger / Form */}
          {!showUploadForm ? (
            <button
              onClick={() => setShowUploadForm(true)}
              className="w-full py-2.5 bg-slate-800 hover:bg-slate-700 text-indigo-400 hover:text-indigo-300 text-xs font-bold rounded-xl border border-dashed border-indigo-500/40 flex items-center justify-center gap-2 transition"
            >
              <Plus className="w-4 h-4" />
              <span>Upload New Version (v{document.currentVersion + 1}.0)</span>
            </button>
          ) : (
            <form onSubmit={handleUploadSubmit} className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-3 text-xs">
              <div className="flex items-center justify-between font-semibold text-slate-200">
                <span>Upload Version {document.currentVersion + 1}.0</span>
                <button 
                  type="button" 
                  onClick={() => setShowUploadForm(false)}
                  className="text-slate-500 hover:text-slate-300 text-xs"
                >
                  Cancel
                </button>
              </div>

              <div
                onClick={() => fileInputRef.current?.click()}
                className="p-4 border border-dashed border-slate-700 hover:border-indigo-500 rounded-lg text-center cursor-pointer bg-slate-900/50"
              >
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={(e) => e.target.files?.[0] && setSelectedFile(e.target.files[0])}
                  className="hidden"
                />
                {selectedFile ? (
                  <p className="font-semibold text-emerald-400 truncate">{selectedFile.name}</p>
                ) : (
                  <span className="text-slate-400">Click to choose revised file</span>
                )}
              </div>

              <div>
                <label className="block text-slate-400 text-[11px] mb-1">Version Change Notes *</label>
                <input
                  type="text"
                  required
                  value={changeNotes}
                  onChange={(e) => setChangeNotes(e.target.value)}
                  placeholder="e.g. Updated project links and SIH certificate"
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white text-xs focus:outline-none focus:border-indigo-500"
                />
              </div>

              <button
                type="submit"
                disabled={!selectedFile || isUploading}
                className="w-full py-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-bold rounded-lg text-xs flex items-center justify-center gap-2 shadow"
              >
                {isUploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
                <span>Save New Version</span>
              </button>
            </form>
          )}

          {/* Timeline List of All Versions */}
          <div>
            <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-3">
              Version Timeline ({document.versions?.length || 1} Total)
            </h4>

            <div className="relative pl-6 space-y-4 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-800">
              {(document.versions || [
                {
                  id: 'v-1',
                  documentId: document.id,
                  versionNumber: 1,
                  fileName: document.fileName,
                  filePath: document.filePath,
                  fileSize: document.fileSize,
                  fileHash: document.fileHash,
                  changeNotes: 'Initial document upload',
                  uploadedAt: document.createdAt
                }
              ]).map((ver) => (
                <div key={ver.id} className="relative group">
                  {/* Timeline dot */}
                  <div className={`absolute -left-6 top-1.5 w-3 h-3 rounded-full border-2 ${
                    ver.versionNumber === document.currentVersion
                      ? 'bg-indigo-500 border-indigo-300 ring-4 ring-indigo-500/20'
                      : 'bg-slate-700 border-slate-500'
                  }`} />

                  <div className="p-3 bg-slate-950/80 rounded-xl border border-slate-800 group-hover:border-slate-700 transition text-xs space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-white">Version {ver.versionNumber}.0</span>
                      <span className="text-[10px] text-slate-500">{new Date(ver.uploadedAt).toLocaleDateString()}</span>
                    </div>

                    <p className="text-slate-400 text-[11px] italic">
                      "{ver.changeNotes || 'No notes specified'}"
                    </p>

                    <div className="pt-1 flex items-center justify-between text-[10px] text-slate-500 font-mono">
                      <span>{(ver.fileSize / 1024).toFixed(1)} KB</span>
                      <span>SHA: {ver.fileHash.slice(0, 10)}...</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
