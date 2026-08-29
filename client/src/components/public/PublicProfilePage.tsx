import React from 'react';
import { useVault } from '../../context/VaultContext';
import { 
  GraduationCap, 
  Award, 
  CheckCircle2, 
  ExternalLink, 
  ArrowLeft, 
  ShieldCheck, 
  FileText, 
  Briefcase,
  Code2
} from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';

interface PublicProfilePageProps {
  studentId: string;
  onBack: () => void;
}

export const PublicProfilePage: React.FC<PublicProfilePageProps> = ({ studentId, onBack }) => {
  const { studentProfile, documents } = useVault();

  const verifiedDocs = documents.filter(d => d.verificationStatus === 'VERIFIED' && !d.isRecycled && d.privacyLevel !== 'PRIVATE');

  return (
    <div className="min-h-screen bg-slate-950 text-white p-4 sm:p-8 flex items-center justify-center">
      <div className="w-full max-w-4xl bg-slate-900 border border-slate-700/80 rounded-3xl shadow-2xl overflow-hidden p-6 sm:p-10 space-y-8">
        
        {/* Top Navigation */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <button
            onClick={onBack}
            className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition font-semibold"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Vault Home</span>
          </button>

          <div className="flex items-center space-x-1.5 px-3 py-1 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold rounded-full">
            <ShieldCheck className="w-4 h-4" />
            <span>Verified Student Identity</span>
          </div>
        </div>

        {/* Profile Bio Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 bg-slate-950 p-6 rounded-2xl border border-slate-800">
          <div className="flex items-center space-x-5">
            <div className="w-20 h-20 rounded-2xl bg-indigo-600 border-2 border-indigo-400 overflow-hidden shadow-lg shrink-0">
              <img
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80"
                alt="Student"
                className="w-full h-full object-cover"
              />
            </div>

            <div className="space-y-1 text-xs">
              <h2 className="text-2xl font-black text-white">{studentProfile.name}</h2>
              <p className="text-indigo-400 font-mono font-bold">{studentProfile.studentId} • Batch {studentProfile.batch}</p>
              <p className="text-slate-300">{studentProfile.department}</p>
              <p className="text-slate-500 text-[11px]">{studentProfile.college}</p>
            </div>
          </div>

          <div className="p-2 bg-white rounded-xl shadow self-start sm:self-center">
            <QRCodeSVG value={window.location.href} size={70} level="M" />
          </div>
        </div>

        {/* Skills & Verified Credentials */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
          
          {/* Skills */}
          <div className="p-5 bg-slate-950 rounded-2xl border border-slate-800 space-y-3">
            <h3 className="font-bold text-white uppercase tracking-wider text-[11px] flex items-center gap-1.5">
              <Code2 className="w-4 h-4 text-indigo-400" /> Technical Skills & Competencies
            </h3>
            <div className="flex flex-wrap gap-1.5">
              {studentProfile.skills.map((s, idx) => (
                <span key={idx} className="px-3 py-1 bg-slate-900 border border-slate-800 rounded-lg text-slate-300 font-medium">
                  {s}
                </span>
              ))}
            </div>
          </div>

          {/* Academic Standing */}
          <div className="p-5 bg-slate-950 rounded-2xl border border-slate-800 space-y-3">
            <h3 className="font-bold text-white uppercase tracking-wider text-[11px] flex items-center gap-1.5">
              <GraduationCap className="w-4 h-4 text-emerald-400" /> Academic Standing
            </h3>
            <div className="space-y-1.5">
              <div className="flex justify-between">
                <span className="text-slate-400">Cumulative GPA:</span>
                <span className="font-bold text-emerald-400 font-mono text-sm">{studentProfile.cgpa} / 10.0</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Graduation Year:</span>
                <span className="text-slate-200 font-semibold">2026</span>
              </div>
            </div>
          </div>

        </div>

        {/* Verified Documents Portfolio */}
        <div className="space-y-3 text-xs">
          <h3 className="font-bold text-white uppercase tracking-wider text-[11px] flex items-center gap-1.5">
            <Award className="w-4 h-4 text-purple-400" /> Publicly Verifiable Credentials ({verifiedDocs.length})
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {verifiedDocs.map((doc) => (
              <div key={doc.id} className="p-3.5 bg-slate-950 rounded-xl border border-slate-800 flex items-center justify-between">
                <div>
                  <p className="font-bold text-slate-200">{doc.title}</p>
                  <p className="text-[10px] text-slate-500 font-mono mt-0.5">{doc.docVerificationId} • {doc.issuer}</p>
                </div>
                <span className="px-2 py-0.5 text-[9px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded">
                  VERIFIED
                </span>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};
