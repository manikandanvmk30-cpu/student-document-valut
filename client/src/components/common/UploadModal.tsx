import React, { useState, useRef } from 'react';
import { useVault, calculateSHA256 } from '../../context/VaultContext';
import { DocumentCategory } from '../../types';
import { 
  X, 
  UploadCloud, 
  FileText, 
  AlertCircle, 
  Loader2 
} from 'lucide-react';

interface UploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultCategory?: DocumentCategory;
}

export const UploadModal: React.FC<UploadModalProps> = ({
  isOpen,
  onClose,
  defaultCategory = 'Certificates'
}) => {
  const { uploadDocument, documents } = useVault();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [fileDataUrl, setFileDataUrl] = useState<string | null>(null);
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<DocumentCategory>(defaultCategory);
  const [isCustomCategory, setIsCustomCategory] = useState(false);
  const [customCategoryName, setCustomCategoryName] = useState('');
  
  const [isProcessing, setIsProcessing] = useState(false);
  const [duplicateWarning, setDuplicateWarning] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleFileSelected = async (file: File) => {
    setSelectedFile(file);
    if (!title) {
      setTitle(file.name.replace(/\.[^/.]+$/, ''));
    }

    // Read as Data URL
    const reader = new FileReader();
    reader.onload = () => {
      setFileDataUrl(reader.result as string);
    };
    reader.readAsDataURL(file);

    setIsProcessing(true);
    setDuplicateWarning(null);

    const hash = await calculateSHA256(file);
    const existing = documents.find(d => !d.isRecycled && d.fileHash === hash);
    if (existing) {
      setDuplicateWarning(`Note: This certificate already exists as "${existing.title}".`);
    }

    setIsProcessing(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelected(e.dataTransfer.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile) return;

    const finalCategory: DocumentCategory = (isCustomCategory && customCategoryName.trim())
      ? customCategoryName.trim()
      : category;

    setIsProcessing(true);
    const res = await uploadDocument(selectedFile, {
      title: title.trim(),
      category: finalCategory,
      fileDataUrl: fileDataUrl || undefined
    });

    setIsProcessing(false);

    if (res.success) {
      onClose();
      setSelectedFile(null);
      setFileDataUrl(null);
      setTitle('');
      setCustomCategoryName('');
      setIsCustomCategory(false);
      setDuplicateWarning(null);
    } else {
      setDuplicateWarning(res.error || 'Upload failed');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 overflow-y-auto">
      <div className="relative w-full max-w-lg bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden p-6">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-5">
          <div className="flex items-center space-x-2">
            <div className="p-2 bg-indigo-500/10 text-indigo-400 rounded-xl">
              <UploadCloud className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Upload Certificate</h3>
              <p className="text-xs text-slate-400">Save certificate directly to your vault</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-white rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          
          {/* File Picker Zone */}
          <div
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition flex flex-col items-center justify-center ${
              selectedFile
                ? 'border-emerald-500/50 bg-emerald-500/5'
                : 'border-slate-700 hover:border-indigo-500 hover:bg-slate-800/40'
            }`}
          >
            <input
              type="file"
              ref={fileInputRef}
              onChange={(e) => e.target.files?.[0] && handleFileSelected(e.target.files[0])}
              accept=".pdf,.jpg,.jpeg,.png"
              className="hidden"
            />

            {selectedFile ? (
              <div className="flex items-center space-x-3 text-left">
                <FileText className="w-6 h-6 text-emerald-400 shrink-0" />
                <div>
                  <p className="font-bold text-white truncate max-w-xs">{selectedFile.name}</p>
                  <p className="text-[11px] text-slate-400 font-mono">
                    {(selectedFile.size / 1024).toFixed(1)} KB
                  </p>
                </div>
              </div>
            ) : (
              <>
                <UploadCloud className="w-6 h-6 text-indigo-400 mb-2" />
                <p className="font-bold text-slate-200">Click to select or drag & drop</p>
                <p className="text-[11px] text-slate-500 mt-0.5">PDF, JPG, PNG</p>
              </>
            )}
          </div>

          {duplicateWarning && (
            <div className="p-3 bg-rose-500/10 border border-rose-500/30 rounded-xl text-rose-300 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
              <span>{duplicateWarning}</span>
            </div>
          )}

          {/* Certificate Name */}
          <div>
            <label className="block text-slate-300 font-semibold mb-1">Certification Name *</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. AWS Solutions Architect or 12th HSC Marksheet"
              className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white text-xs focus:outline-none focus:border-indigo-500"
            />
          </div>

          {/* Category */}
          <div>
            <label className="block text-slate-300 font-semibold mb-1">Category *</label>
            <select
              value={isCustomCategory ? 'CUSTOM' : category}
              onChange={(e) => {
                if (e.target.value === 'CUSTOM') {
                  setIsCustomCategory(true);
                } else {
                  setIsCustomCategory(false);
                  setCategory(e.target.value as DocumentCategory);
                }
              }}
              className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white text-xs focus:outline-none focus:border-indigo-500"
            >
              <option value="Certificates">Technical & Certifications</option>
              <option value="Academic">Academic & Marksheets</option>
              <option value="Internship">Internship & Work</option>
              <option value="Career">Career & Resumes</option>
              <option value="Other">Other Documents</option>
              <option value="CUSTOM">✨ Create your own</option>
            </select>

            {isCustomCategory && (
              <div className="mt-2 space-y-1">
                <label className="block text-indigo-400 font-semibold text-[11px]">
                  ✨ Enter Custom Category Name *
                </label>
                <input
                  type="text"
                  required
                  value={customCategoryName}
                  onChange={(e) => setCustomCategoryName(e.target.value)}
                  placeholder="e.g. Sports, Extra-Curricular, Hackathons, Publications"
                  className="w-full px-3.5 py-2 bg-slate-950 border border-indigo-500/50 rounded-xl text-white text-xs focus:outline-none focus:border-indigo-400"
                />
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="pt-3 border-t border-slate-800 flex justify-end space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-slate-400 hover:text-white"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!selectedFile || isProcessing}
              className="px-5 py-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-bold rounded-xl shadow flex items-center gap-1.5"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Uploading...</span>
                </>
              ) : (
                <>
                  <UploadCloud className="w-4 h-4" />
                  <span>Save to Vault</span>
                </>
              )}
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
