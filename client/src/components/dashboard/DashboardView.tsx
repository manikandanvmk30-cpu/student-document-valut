import React from 'react';
import { useVault } from '../../context/VaultContext';
import { VaultDocument } from '../../types';
import { 
  Award, 
  UploadCloud, 
  Download, 
  QrCode, 
  FileText, 
  ArrowRight, 
  Eye, 
  Calendar,
  Building,
  HardDrive,
  GraduationCap,
  Briefcase
} from 'lucide-react';

interface DashboardViewProps {
  onNavigate: (tab: string) => void;
  onOpenUpload: () => void;
  onPreviewDoc: (doc: VaultDocument) => void;
  onOpenQR: (doc: VaultDocument) => void;
  onOpenReceipt?: (doc: VaultDocument) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  onNavigate,
  onOpenUpload,
  onPreviewDoc,
  onOpenQR,
  onOpenReceipt
}) => {
  const { studentProfile, documents, downloadCertificatePdf } = useVault();

  const activeDocs = documents.filter(d => !d.isRecycled && !d.isArchived);
  
  const totalBytes = activeDocs.reduce((acc, curr) => acc + curr.fileSize, 0);
  const totalMB = (totalBytes / (1024 * 1024)).toFixed(1);

  const technicalCount = activeDocs.filter(d => d.category === 'Certificates').length;
  const academicCount = activeDocs.filter(d => d.category === 'Academic').length;
  const internshipCount = activeDocs.filter(d => d.category === 'Internship').length;

  return (
    <div className="space-y-6">
      
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-indigo-950 via-slate-900 to-slate-900 border border-indigo-500/20 p-6 md:p-8 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-500/30 text-indigo-300 text-xs font-semibold">
              <Award className="w-3.5 h-3.5 text-indigo-400" />
              <span>Digital Certificate Vault • {studentProfile.studentId}</span>
            </div>
            
            <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
              Welcome back, {studentProfile.name}
            </h1>
            <p className="text-xs md:text-sm text-slate-300 max-w-xl">
              Store your certificates and marksheets in one centralized vault. View, preview, and download anytime in PDF format.
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-3 text-xs text-slate-400">
              <span className="text-slate-300 font-medium">{studentProfile.department}</span>
              <span>•</span>
              <span className="text-indigo-300">{studentProfile.college}</span>
            </div>
          </div>

          {/* Quick Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 shrink-0">
            <button
              onClick={onOpenUpload}
              className="px-5 py-3 bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-white font-bold rounded-xl shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-2 text-xs transition"
            >
              <UploadCloud className="w-4 h-4" />
              <span>Upload Certificate</span>
            </button>

            <button
              onClick={() => onNavigate('download-center')}
              className="px-5 py-3 bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold rounded-xl border border-slate-700 flex items-center justify-center gap-2 text-xs transition"
            >
              <Download className="w-4 h-4 text-emerald-400" />
              <span>Download PDF</span>
            </button>
          </div>

        </div>
      </div>

      {/* 4 Clean Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div 
          onClick={() => onNavigate('certifications')}
          className="p-5 bg-slate-900/80 hover:bg-slate-900 border border-slate-800 hover:border-indigo-500/40 rounded-2xl shadow-lg transition cursor-pointer"
        >
          <div className="flex items-center justify-between text-slate-400 text-xs font-semibold uppercase">
            <span>Total Certificates</span>
            <div className="p-2 bg-indigo-500/10 text-indigo-400 rounded-lg">
              <Award className="w-4 h-4" />
            </div>
          </div>
          <p className="text-3xl font-extrabold text-white font-mono mt-3">{activeDocs.length}</p>
          <p className="text-[11px] text-slate-400 mt-1">Stored in Vault</p>
        </div>

        <div 
          onClick={() => onNavigate('certifications')}
          className="p-5 bg-slate-900/80 hover:bg-slate-900 border border-slate-800 hover:border-indigo-500/40 rounded-2xl shadow-lg transition cursor-pointer"
        >
          <div className="flex items-center justify-between text-slate-400 text-xs font-semibold uppercase">
            <span>Technical & Courses</span>
            <div className="p-2 bg-indigo-500/10 text-indigo-400 rounded-lg">
              <Award className="w-4 h-4" />
            </div>
          </div>
          <p className="text-3xl font-extrabold text-indigo-300 font-mono mt-3">{technicalCount}</p>
          <p className="text-[11px] text-slate-400 mt-1">Licenses & Certifications</p>
        </div>

        <div 
          onClick={() => onNavigate('certifications')}
          className="p-5 bg-slate-900/80 hover:bg-slate-900 border border-slate-800 hover:border-indigo-500/40 rounded-2xl shadow-lg transition cursor-pointer"
        >
          <div className="flex items-center justify-between text-slate-400 text-xs font-semibold uppercase">
            <span>Academic Records</span>
            <div className="p-2 bg-emerald-500/10 text-emerald-400 rounded-lg">
              <GraduationCap className="w-4 h-4" />
            </div>
          </div>
          <p className="text-3xl font-extrabold text-emerald-400 font-mono mt-3">{academicCount}</p>
          <p className="text-[11px] text-slate-400 mt-1">Marksheets & Degrees</p>
        </div>

        <div 
          onClick={() => onNavigate('profile')}
          className="p-5 bg-slate-900/80 hover:bg-slate-900 border border-slate-800 hover:border-purple-500/40 rounded-2xl shadow-lg transition cursor-pointer"
        >
          <div className="flex items-center justify-between text-slate-400 text-xs font-semibold uppercase">
            <span>Storage Space</span>
            <div className="p-2 bg-purple-500/10 text-purple-400 rounded-lg">
              <HardDrive className="w-4 h-4" />
            </div>
          </div>
          <p className="text-3xl font-extrabold text-white font-mono mt-3">{totalMB} MB</p>
          <p className="text-[11px] text-slate-400 mt-1">of 5.0 GB Quota</p>
        </div>

      </div>

      {/* Recent Certifications List */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-white">Recent Certifications</h3>
            <p className="text-xs text-slate-400 mt-0.5">Quick preview and instant PDF download</p>
          </div>

          <button
            onClick={() => onNavigate('certifications')}
            className="px-3.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-xl border border-slate-700 transition"
          >
            View All ({activeDocs.length})
          </button>
        </div>

        <div className="space-y-3">
          {activeDocs.slice(0, 4).map((doc) => (
            <div
              key={doc.id}
              className="p-4 bg-slate-950/70 hover:bg-slate-950 border border-slate-800 hover:border-slate-700 rounded-xl transition flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
            >
              <div className="flex items-start space-x-3.5">
                <div className="p-2.5 bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 rounded-xl shrink-0 mt-0.5">
                  <FileText className="w-5 h-5" />
                </div>

                <div>
                  <h4 
                    onClick={() => onPreviewDoc(doc)}
                    className="font-bold text-slate-200 hover:text-indigo-300 cursor-pointer transition text-sm"
                  >
                    {doc.title}
                  </h4>

                  <div className="flex items-center gap-3 text-[11px] text-slate-400 mt-1">
                    <span className="px-2 py-0.5 bg-slate-900 text-indigo-300 rounded border border-slate-800 font-medium">
                      {doc.category}
                    </span>
                    <span>•</span>
                    <span>{(doc.fileSize / 1024).toFixed(0)} KB</span>
                    <span>•</span>
                    <span className="font-mono text-slate-500">{doc.docVerificationId}</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center space-x-2 self-end sm:self-center shrink-0">
                <button
                  onClick={() => onPreviewDoc(doc)}
                  className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-slate-200 hover:text-white rounded-lg text-xs font-medium border border-slate-800 transition flex items-center gap-1.5"
                  title="Show PDF Preview"
                >
                  <Eye className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Show PDF</span>
                </button>

                <button
                  onClick={() => onOpenQR(doc)}
                  className="p-2 bg-slate-900 hover:bg-slate-800 text-indigo-400 rounded-lg transition border border-slate-800"
                  title="QR Code"
                >
                  <QrCode className="w-3.5 h-3.5" />
                </button>

                <button
                  onClick={() => downloadCertificatePdf(doc)}
                  className="px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg font-bold text-xs flex items-center gap-1.5 transition shadow"
                  title="Download 2-Page PDF"
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
