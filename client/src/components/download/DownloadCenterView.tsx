import React, { useState } from 'react';
import { useVault } from '../../context/VaultContext';
import { VaultDocument } from '../../types';
import { 
  Download, 
  Eye,
  FileText, 
  Check, 
  Square, 
  CheckSquare, 
  Loader2,
  FileCheck2,
  Sparkles
} from 'lucide-react';

interface DownloadCenterViewProps {
  onOpenReceipt: (doc: VaultDocument) => void;
  onPreviewDoc: (doc: VaultDocument) => void;
}

export const DownloadCenterView: React.FC<DownloadCenterViewProps> = ({
  onOpenReceipt,
  onPreviewDoc
}) => {
  const { documents, generateConsolidatedPdf, downloadCertificatePdf, studentProfile } = useVault();

  const activeDocs = documents.filter(d => !d.isRecycled && !d.isArchived);
  const [selectedDocIds, setSelectedDocIds] = useState<string[]>(activeDocs.map(d => d.id));
  const [dossierTitle, setDossierTitle] = useState('My_Certificates_Portfolio');
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);

  const toggleSelectDoc = (id: string) => {
    setSelectedDocIds(prev =>
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    if (selectedDocIds.length === activeDocs.length) {
      setSelectedDocIds([]);
    } else {
      setSelectedDocIds(activeDocs.map(d => d.id));
    }
  };

  const handleDownloadConsolidatedPdf = async () => {
    if (selectedDocIds.length === 0) return;
    setIsGeneratingPdf(true);
    await generateConsolidatedPdf(selectedDocIds, dossierTitle || 'My_Certificates_Portfolio');
    setIsGeneratingPdf(false);
  };

  const selectedDocs = activeDocs.filter(d => selectedDocIds.includes(d.id));

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <Download className="w-6 h-6 text-emerald-400" />
            <h2 className="text-xl font-extrabold text-white">Download Certifications (PDF)</h2>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Export individual certificates or generate a consolidated multi-page PDF portfolio dossier.
          </p>
        </div>

        <button
          onClick={handleDownloadConsolidatedPdf}
          disabled={selectedDocIds.length === 0 || isGeneratingPdf}
          className="px-6 py-2.5 bg-gradient-to-r from-emerald-600 to-indigo-600 hover:from-emerald-500 hover:to-indigo-500 disabled:opacity-50 text-white font-bold rounded-xl shadow-lg text-xs flex items-center gap-2 transition shrink-0"
        >
          {isGeneratingPdf ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Generating PDF Dossier...</span>
            </>
          ) : (
            <>
              <FileCheck2 className="w-4 h-4" />
              <span>Download Selected as PDF ({selectedDocIds.length} Certificates)</span>
            </>
          )}
        </button>
      </div>

      {/* 1-Click Fast Combined PDF Download Banner */}
      <div className="p-6 bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900 border border-indigo-500/30 rounded-2xl shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <FileCheck2 className="w-5 h-5 text-indigo-400" />
            <h3 className="font-bold text-white text-base">Download All Certifications (Single Combined PDF)</h3>
          </div>
          <p className="text-xs text-slate-400">
            Combines all {activeDocs.length} certificates into one official, beautifully formatted PDF portfolio ready for job and placement submission.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-end gap-2">
          <button
            onClick={() => {
              if (activeDocs.length > 0) onPreviewDoc(activeDocs[0]);
            }}
            className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold rounded-xl text-xs flex items-center justify-center gap-1.5 border border-slate-700 transition shrink-0"
          >
            <Eye className="w-4 h-4 text-indigo-400" />
            <span>Show PDF Preview</span>
          </button>

          <button
            onClick={() => {
              setSelectedDocIds(activeDocs.map(d => d.id));
              generateConsolidatedPdf(activeDocs.map(d => d.id), 'Complete_Student_Certificates_Portfolio');
            }}
            className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-2 shadow-lg transition shrink-0"
          >
            <Download className="w-4 h-4" />
            <span>Download All as PDF ({activeDocs.length} Files)</span>
          </button>
        </div>
      </div>

      {/* Certificate Selector & Individual Download List */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
          <div className="flex items-center space-x-3">
            <button
              onClick={handleSelectAll}
              className="text-slate-400 hover:text-indigo-400 flex items-center gap-2 text-xs font-semibold"
            >
              {selectedDocIds.length === activeDocs.length ? (
                <CheckSquare className="w-4 h-4 text-indigo-400" />
              ) : (
                <Square className="w-4 h-4 text-slate-600" />
              )}
              <span>{selectedDocIds.length === activeDocs.length ? 'Deselect All' : 'Select All'}</span>
            </button>

            <span className="text-xs text-slate-500 font-mono">
              • {selectedDocIds.length} of {activeDocs.length} selected for combined PDF export
            </span>
          </div>

          <div className="flex items-center space-x-2">
            <label className="text-xs text-slate-400 font-medium">PDF Title:</label>
            <input
              type="text"
              value={dossierTitle}
              onChange={(e) => setDossierTitle(e.target.value)}
              className="px-3 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-white font-mono text-xs focus:outline-none focus:border-indigo-500"
            />
          </div>
        </div>

        {/* Certificates List */}
        <div className="space-y-2.5 max-h-[500px] overflow-y-auto pr-1">
          {activeDocs.map((doc) => {
            const isChecked = selectedDocIds.includes(doc.id);
            return (
              <div
                key={doc.id}
                className={`p-4 rounded-xl border transition flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs ${
                  isChecked
                    ? 'bg-indigo-950/30 border-indigo-500/50 text-white'
                    : 'bg-slate-950/70 border-slate-800/80 text-slate-400 hover:bg-slate-950'
                }`}
              >
                <div 
                  onClick={() => toggleSelectDoc(doc.id)}
                  className="flex items-start space-x-3 cursor-pointer"
                >
                  <div className={`w-5 h-5 rounded flex items-center justify-center border mt-0.5 shrink-0 ${
                    isChecked ? 'bg-indigo-600 border-indigo-500 text-white' : 'border-slate-700 bg-slate-900'
                  }`}>
                    {isChecked && <Check className="w-3.5 h-3.5" />}
                  </div>

                  <div>
                    <p className="font-bold text-slate-200 text-xs">{doc.title}</p>
                    <p className="text-slate-400 text-[11px] mt-0.5">{doc.category}</p>
                    <p className="text-[10px] text-slate-500 font-mono mt-0.5">
                      ID: {doc.docVerificationId} • {(doc.fileSize / 1024).toFixed(0)} KB • 2 Pages
                    </p>
                  </div>
                </div>

                {/* Direct Show PDF & Download PDF Buttons */}
                <div className="flex items-center space-x-2 self-end sm:self-center shrink-0">
                  <button
                    onClick={() => onPreviewDoc(doc)}
                    className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition border border-slate-700"
                    title="Show PDF Preview"
                  >
                    <Eye className="w-3.5 h-3.5 text-indigo-400" />
                    <span>Show PDF</span>
                  </button>

                  <button
                    onClick={() => downloadCertificatePdf(doc)}
                    className="px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition shadow"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download PDF</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>

      </div>

    </div>
  );
};
