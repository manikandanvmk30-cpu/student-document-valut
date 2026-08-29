import React, { useState } from 'react';
import { useVault } from '../../context/VaultContext';
import { VaultDocument, DocumentCategory } from '../../types';
import { 
  Award, 
  Search, 
  Download, 
  Eye, 
  QrCode, 
  FileText, 
  Trash2, 
  Plus, 
  Grid,
  List
} from 'lucide-react';

interface CertificationsViewProps {
  onOpenUpload: (category?: DocumentCategory) => void;
  onPreviewDoc: (doc: VaultDocument) => void;
  onOpenQR: (doc: VaultDocument) => void;
  onOpenReceipt: (doc: VaultDocument) => void;
}

export const CertificationsView: React.FC<CertificationsViewProps> = ({
  onOpenUpload,
  onPreviewDoc,
  onOpenQR,
  onOpenReceipt
}) => {
  const { documents, moveToRecycleBin, downloadCertificatePdf } = useVault();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const activeDocs = documents.filter(d => !d.isRecycled && !d.isArchived);

  const defaultCategoryList = [
    { id: 'ALL', label: 'All Documents' },
    { id: 'Certificates', label: 'Certifications' },
    { id: 'Academic', label: 'Academic' },
    { id: 'Internship', label: 'Internships' },
    { id: 'Career', label: 'Career & Resumes' },
    { id: 'Other', label: 'Other' },
  ];

  const customCategories = Array.from(
    new Set(activeDocs.map(d => d.category))
  ).filter(c => !['Certificates', 'Academic', 'Internship', 'Career', 'Other'].includes(c));

  const categories = [
    ...defaultCategoryList,
    ...customCategories.map(c => ({ id: c, label: `✨ ${c}` }))
  ];

  const filtered = activeDocs.filter(doc => {
    if (selectedCategory !== 'ALL' && doc.category !== selectedCategory) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = doc.title.toLowerCase().includes(q);
      const matchId = doc.docVerificationId.toLowerCase().includes(q);
      const matchCategory = doc.category.toLowerCase().includes(q);
      if (!matchTitle && !matchId && !matchCategory) return false;
    }
    return true;
  });

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <Award className="w-6 h-6 text-indigo-400" />
            <h2 className="text-xl font-extrabold text-white">My Certifications</h2>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Access, view, preview, and download your stored certificate documents in PDF format.
          </p>
        </div>

        <button
          onClick={() => onOpenUpload()}
          className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-white text-xs font-bold rounded-xl shadow-lg flex items-center gap-1.5 transition shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Upload Certificate</span>
        </button>
      </div>

      {/* Filter & Search Bar */}
      <div className="p-4 bg-slate-900/80 border border-slate-800 rounded-2xl shadow-xl space-y-3">
        <div className="flex flex-col sm:flex-row gap-3">
          
          {/* Search Box */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search certificates by name..."
              className="w-full pl-9 pr-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
            />
          </div>

          {/* View Mode Toggle */}
          <div className="flex items-center space-x-1 bg-slate-950 p-1 rounded-xl border border-slate-800 self-end sm:self-auto">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-lg ${viewMode === 'grid' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'}`}
              title="Grid View"
            >
              <Grid className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-1.5 rounded-lg ${viewMode === 'list' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'}`}
              title="List View"
            >
              <List className="w-3.5 h-3.5" />
            </button>
          </div>

        </div>

        {/* Category Tabs */}
        <div className="flex items-center space-x-2 overflow-x-auto pt-1">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition border ${
                selectedCategory === cat.id
                  ? 'bg-indigo-600 text-white border-indigo-500 shadow'
                  : 'bg-slate-950 text-slate-400 border-slate-800 hover:bg-slate-800 hover:text-slate-200'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Certificates Render */}
      {filtered.length === 0 ? (
        <div className="text-center py-16 bg-slate-900/40 rounded-2xl border border-slate-800 p-8 space-y-3">
          <div className="w-12 h-12 bg-slate-900 text-slate-500 rounded-full flex items-center justify-center mx-auto">
            <Award className="w-6 h-6" />
          </div>
          <h3 className="text-sm font-bold text-white">No certificates found</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            No items matched your search. Upload your first certificate below.
          </p>
          <button
            onClick={() => onOpenUpload()}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-xl"
          >
            Upload Certificate Now
          </button>
        </div>
      ) : viewMode === 'grid' ? (
        
        /* GRID VIEW */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((doc) => (
            <div
              key={doc.id}
              className="bg-slate-900/85 hover:bg-slate-900 border border-slate-800 hover:border-indigo-500/40 rounded-2xl p-5 shadow-xl transition flex flex-col justify-between space-y-4"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="px-2.5 py-0.5 text-[10px] font-semibold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 rounded-md">
                    {doc.category}
                  </span>
                  <span className="text-[10px] text-slate-500 font-mono">{(doc.fileSize / 1024).toFixed(0)} KB</span>
                </div>

                <h3 
                  onClick={() => onPreviewDoc(doc)}
                  className="font-bold text-white text-sm hover:text-indigo-300 cursor-pointer transition line-clamp-2"
                >
                  {doc.title}
                </h3>

                <div className="mt-4 p-2.5 bg-slate-950 rounded-xl border border-slate-800/80 text-[11px] font-mono text-slate-400 flex justify-between">
                  <span className="text-slate-500">ID:</span>
                  <span className="text-indigo-300 font-semibold">{doc.docVerificationId}</span>
                </div>
              </div>

              {/* Action Toolbar */}
              <div className="pt-3 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-2 text-xs">
                <div className="flex items-center space-x-1.5">
                  {/* Show / View PDF */}
                  <button
                    onClick={() => onPreviewDoc(doc)}
                    className="px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white rounded-lg transition flex items-center gap-1.5 font-medium border border-slate-700"
                    title="Show PDF Preview (Page 1 Uploaded + Page 2 Issued)"
                  >
                    <Eye className="w-3.5 h-3.5 text-indigo-400" />
                    <span>Show PDF</span>
                  </button>

                  {/* QR Code */}
                  <button
                    onClick={() => onOpenQR(doc)}
                    className="p-1.5 bg-slate-800 hover:bg-slate-700 text-indigo-400 rounded-lg transition border border-slate-700"
                    title="View QR Code"
                  >
                    <QrCode className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="flex items-center space-x-1.5">
                  {/* Download PDF */}
                  <button
                    onClick={() => downloadCertificatePdf(doc)}
                    className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-lg flex items-center gap-1.5 transition shadow"
                    title="Download 2-Page PDF (Uploaded File + Issued Attestation)"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download PDF</span>
                  </button>

                  <button
                    onClick={() => moveToRecycleBin(doc.id)}
                    className="p-1.5 hover:bg-rose-500/10 text-slate-500 hover:text-rose-400 rounded-lg transition"
                    title="Delete"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        
        /* LIST VIEW */
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl shadow-xl overflow-hidden">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950 text-slate-400 uppercase tracking-wider font-semibold border-b border-slate-800 text-[10px]">
              <tr>
                <th className="p-4">Certificate Name</th>
                <th className="p-4">Category</th>
                <th className="p-4">Verification ID</th>
                <th className="p-4">Size</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-sans">
              {filtered.map((doc) => (
                <tr key={doc.id} className="hover:bg-slate-800/30 transition">
                  <td className="p-4">
                    <p 
                      onClick={() => onPreviewDoc(doc)}
                      className="font-bold text-white hover:text-indigo-300 cursor-pointer transition truncate max-w-sm"
                    >
                      {doc.title}
                    </p>
                  </td>
                  <td className="p-4 text-slate-300">{doc.category}</td>
                  <td className="p-4 font-mono text-indigo-300">{doc.docVerificationId}</td>
                  <td className="p-4 font-mono text-slate-400 text-[11px]">{(doc.fileSize / 1024).toFixed(0)} KB</td>
                  <td className="p-4 text-right space-x-1.5">
                    {/* Show PDF */}
                    <button
                      onClick={() => onPreviewDoc(doc)}
                      className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg inline-flex items-center gap-1 border border-slate-700"
                      title="Show PDF Preview"
                    >
                      <Eye className="w-3.5 h-3.5 text-indigo-400" />
                      <span>Show PDF</span>
                    </button>

                    {/* QR Code */}
                    <button
                      onClick={() => onOpenQR(doc)}
                      className="p-1.5 text-indigo-400 hover:text-indigo-300 rounded hover:bg-slate-800"
                      title="QR Code"
                    >
                      <QrCode className="w-3.5 h-3.5" />
                    </button>

                    {/* Download PDF */}
                    <button
                      onClick={() => downloadCertificatePdf(doc)}
                      className="px-3 py-1 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs rounded-lg inline-flex items-center gap-1.5 shadow"
                    >
                      <Download className="w-3 h-3" />
                      <span>Download PDF</span>
                    </button>

                    <button
                      onClick={() => moveToRecycleBin(doc.id)}
                      className="p-1.5 text-slate-500 hover:text-rose-400 rounded hover:bg-slate-800"
                      title="Delete"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

    </div>
  );
};
