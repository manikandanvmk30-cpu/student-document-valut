import React, { useState, useRef } from 'react';
import { useVault, calculateSHA256 } from '../../context/VaultContext';
import { DocumentCategory } from '../../types';
import { 
  UploadCloud, 
  FileText, 
  Check, 
  AlertCircle, 
  Loader2, 
  ArrowRight
} from 'lucide-react';

interface UploadViewProps {
  onSuccess: () => void;
}

export const UploadView: React.FC<UploadViewProps> = ({ onSuccess }) => {
  const { uploadDocument, documents } = useVault();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [fileDataUrl, setFileDataUrl] = useState<string | null>(null);
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<DocumentCategory>('Certificates');
  const [isCustomCategory, setIsCustomCategory] = useState(false);
  const [customCategoryName, setCustomCategoryName] = useState('');
  
  const [isProcessing, setIsProcessing] = useState(false);
  const [duplicateWarning, setDuplicateWarning] = useState<string | null>(null);
  const [uploadSuccess, setUploadSuccess] = useState(false);

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
      setDuplicateWarning(`Note: This certificate is already in your vault as "${existing.title}".`);
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
      setUploadSuccess(true);
      setTimeout(() => {
        onSuccess();
      }, 1200);
    } else {
      setDuplicateWarning(res.error || 'Upload failed');
    }
  };

  return (
    <div className="space-y-6 max-w-2xl">
      
      {/* Header */}
      <div>
        <div className="flex items-center space-x-2">
          <UploadCloud className="w-6 h-6 text-indigo-400" />
          <h2 className="text-xl font-extrabold text-white">Upload Certificate</h2>
        </div>
        <p className="text-xs text-slate-400 mt-1">
          Select your certificate file, provide a name and category to store it in your digital vault.
        </p>
      </div>

      {uploadSuccess && (
        <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl text-emerald-300 text-xs flex items-center justify-between">
          <div className="flex items-center gap-2 font-semibold">
            <Check className="w-4 h-4 text-emerald-400" />
            <span>Certificate uploaded successfully! Opening certifications...</span>
          </div>
          <ArrowRight className="w-4 h-4 text-emerald-400 animate-pulse" />
        </div>
      )}

      {/* Main Form */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-xl">
        <form onSubmit={handleSubmit} className="space-y-5 text-xs">
          
          {/* File Upload Drop Zone */}
          <div>
            <label className="block text-slate-300 font-semibold mb-2">Certificate File *</label>
            
            <div
              onDragOver={(e) => e.preventDefault()}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition flex flex-col items-center justify-center ${
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
                <div className="flex items-center space-x-4 text-left">
                  <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-emerald-400">
                    <FileText className="w-7 h-7" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-white truncate max-w-md">{selectedFile.name}</p>
                    <p className="text-xs text-slate-400 mt-0.5 font-mono">
                      {(selectedFile.size / 1024).toFixed(1)} KB
                    </p>
                  </div>
                </div>
              ) : (
                <>
                  <div className="p-3.5 bg-indigo-500/10 text-indigo-400 rounded-full mb-3">
                    <UploadCloud className="w-6 h-6" />
                  </div>
                  <p className="text-sm font-bold text-slate-200">
                    Click to select file or drag & drop here
                  </p>
                  <p className="text-xs text-slate-500 mt-1">
                    Supports PDF, JPG, PNG
                  </p>
                </>
              )}
            </div>
          </div>

          {duplicateWarning && (
            <div className="p-3.5 bg-rose-500/10 border border-rose-500/30 rounded-xl text-rose-300 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
              <span>{duplicateWarning}</span>
            </div>
          )}

          {/* Certificate Name */}
          <div>
            <label className="block text-slate-300 font-semibold mb-1.5">Certification Name *</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. AWS Certified Solutions Architect, 10th Marksheet, Python Certificate"
              className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white text-xs focus:outline-none focus:border-indigo-500"
            />
          </div>

          {/* Category */}
          <div>
            <label className="block text-slate-300 font-semibold mb-1.5">Category *</label>
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
              className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white text-xs focus:outline-none focus:border-indigo-500"
            >
              <option value="Certificates">Technical & Certifications</option>
              <option value="Academic">Academic & Marksheets</option>
              <option value="Internship">Internship & Work</option>
              <option value="Career">Career & Resumes</option>
              <option value="Other">Other Documents</option>
              <option value="CUSTOM">✨ Create your own</option>
            </select>

            {isCustomCategory && (
              <div className="mt-2.5 space-y-1">
                <label className="block text-indigo-400 font-semibold text-[11px]">
                  ✨ Enter Custom Category Name *
                </label>
                <input
                  type="text"
                  required
                  value={customCategoryName}
                  onChange={(e) => setCustomCategoryName(e.target.value)}
                  placeholder="e.g. Sports, Extra-Curricular, Hackathons, Publications, Projects"
                  className="w-full px-4 py-2.5 bg-slate-950 border border-indigo-500/50 rounded-xl text-white text-xs focus:outline-none focus:border-indigo-400 shadow-inner"
                />
              </div>
            )}
          </div>

          {/* Submit Button */}
          <div className="pt-3 border-t border-slate-800 flex justify-end">
            <button
              type="submit"
              disabled={!selectedFile || isProcessing}
              className="px-8 py-3 bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 disabled:opacity-50 text-white font-bold rounded-xl shadow-lg shadow-indigo-600/30 text-xs flex items-center gap-2 transition"
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
