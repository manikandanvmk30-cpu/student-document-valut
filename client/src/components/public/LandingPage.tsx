import React, { useState } from 'react';
import { useVault } from '../../context/VaultContext';
import { 
  ShieldCheck, 
  Search, 
  ArrowRight, 
  Sparkles, 
  CheckCircle2, 
  QrCode, 
  Package, 
  Share2, 
  Briefcase, 
  Lock, 
  Award, 
  HardDrive, 
  Layers,
  GraduationCap,
  ChevronRight,
  ExternalLink
} from 'lucide-react';

interface LandingPageProps {
  onEnterApp: (tab?: string) => void;
  onOpenVerify: (docId: string) => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onEnterApp, onOpenVerify }) => {
  const { documents } = useVault();
  const [testDocId, setTestDocId] = useState('DOC-2026-CSE-000182');

  const verifiedCount = documents.filter(d => d.verificationStatus === 'VERIFIED').length;

  const handleQuickVerify = (e: React.FormEvent) => {
    e.preventDefault();
    if (!testDocId.trim()) return;
    onOpenVerify(testDocId.trim());
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white selection:bg-indigo-500 selection:text-white">
      
      {/* Hero Section */}
      <section className="relative pt-24 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto overflow-hidden">
        {/* Background Ambient Glows */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-gradient-to-tr from-indigo-600/20 via-purple-600/10 to-transparent blur-[120px] pointer-events-none" />

        <div className="text-center space-y-6 max-w-3xl mx-auto relative z-10">
          
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-900/90 border border-indigo-500/30 text-indigo-300 text-xs font-semibold shadow-lg">
            <Sparkles className="w-4 h-4 text-indigo-400" />
            <span>Digital Student Document, Verification & Placement Management System</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-white leading-tight">
            Store Once. <br className="hidden sm:inline" />
            <span className="bg-gradient-to-r from-indigo-400 via-indigo-200 to-emerald-400 bg-clip-text text-transparent">
              Verify Securely.
            </span> <br />
            Use Everywhere.
          </h1>

          <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Eliminate repeated document uploads across campus placement drives, internships, and admissions. A centralized vault with real-time SHA-256 duplicate detection and cryptographic QR verification.
          </p>

          {/* Call to Actions */}
          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={() => onEnterApp('dashboard')}
              className="w-full sm:w-auto px-8 py-3.5 bg-gradient-to-r from-indigo-600 via-indigo-500 to-emerald-600 hover:from-indigo-500 hover:to-emerald-500 text-white font-bold rounded-2xl shadow-xl shadow-indigo-600/30 flex items-center justify-center gap-2 text-sm transition transform hover:-translate-y-0.5"
            >
              <span>Launch Student Vault</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => onEnterApp('faculty')}
              className="w-full sm:w-auto px-6 py-3.5 bg-slate-900 hover:bg-slate-800 text-slate-200 font-semibold rounded-2xl border border-slate-700 text-sm transition"
            >
              Faculty & Placement Portal →
            </button>
          </div>

          {/* Live Quick Verification Lookup Box */}
          <div className="pt-8 max-w-xl mx-auto">
            <div className="p-2 bg-slate-900/90 rounded-2xl border border-slate-800 shadow-2xl flex flex-col sm:flex-row gap-2">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={testDocId}
                  onChange={(e) => setTestDocId(e.target.value)}
                  placeholder="Enter Verification ID (e.g. DOC-2026-CSE-000182)"
                  className="w-full pl-9 pr-3 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 font-mono"
                />
              </div>
              <button
                onClick={handleQuickVerify}
                className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl shadow flex items-center justify-center gap-1.5 transition"
              >
                <ShieldCheck className="w-4 h-4" />
                <span>Verify Credential</span>
              </button>
            </div>
            <p className="text-[11px] text-slate-500 mt-2 font-mono">
              Try sample verified ID: <span className="text-indigo-400 underline cursor-pointer" onClick={() => setTestDocId('DOC-2026-CSE-000182')}>DOC-2026-CSE-000182</span>
            </p>
          </div>

        </div>
      </section>

      {/* Live System Stats Grid */}
      <section className="py-8 bg-slate-900/50 border-y border-slate-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          <div>
            <p className="text-3xl sm:text-4xl font-extrabold text-white font-mono">6,240+</p>
            <p className="text-xs text-slate-400 mt-1 uppercase font-semibold">Verified Documents</p>
          </div>
          <div>
            <p className="text-3xl sm:text-4xl font-extrabold text-emerald-400 font-mono">100%</p>
            <p className="text-xs text-slate-400 mt-1 uppercase font-semibold">Zero-Tamper Guarantee</p>
          </div>
          <div>
            <p className="text-3xl sm:text-4xl font-extrabold text-indigo-400 font-mono">0 sec</p>
            <p className="text-xs text-slate-400 mt-1 uppercase font-semibold">Placement Re-upload Time</p>
          </div>
          <div>
            <p className="text-3xl sm:text-4xl font-extrabold text-purple-400 font-mono">48+</p>
            <p className="text-xs text-slate-400 mt-1 uppercase font-semibold">Corporate Partners</p>
          </div>
        </div>
      </section>

      {/* Complete Document Lifecycle Architecture */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center space-y-3 mb-12">
          <span className="text-xs font-bold text-indigo-400 uppercase tracking-widest">End-to-End Lifecycle</span>
          <h2 className="text-3xl font-extrabold text-white">The Complete Student Document Lifecycle</h2>
          <p className="text-sm text-slate-400 max-w-xl mx-auto">
            From initial upload to placement reuse and tamper-proof public verification.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { step: '01', title: 'Upload & Index', desc: 'SHA-256 hash generated instantly with duplicate collision prevention.' },
            { step: '02', title: 'Faculty Approval', desc: 'Professors verify records and affix official digital signatures.' },
            { step: '03', title: 'Bundle & Package', desc: 'Combine marksheets, resumes & certs into single 1-click ZIP dossiers.' },
            { step: '04', title: 'Placement Reuse', desc: 'Attach to campus hiring drives without repeated uploads.' },
            { step: '05', title: 'QR Verification', desc: 'Recruiters scan QR codes to verify authenticity without data leaks.' },
            { step: '06', title: 'Expiring Shares', desc: 'Generate password-protected links with instant revocation control.' },
            { step: '07', title: 'Academic Metrics', desc: 'Semester-wise SGPA charts, credit tally, and achievement timeline.' },
            { step: '08', title: 'Digital Smart ID', desc: 'Interactive student ID card with scannable credential links.' },
          ].map((item) => (
            <div key={item.step} className="p-5 bg-slate-900/80 border border-slate-800 rounded-2xl shadow-xl space-y-2">
              <span className="text-xs font-mono font-bold text-indigo-400">{item.step}</span>
              <h3 className="font-bold text-white text-sm">{item.title}</h3>
              <p className="text-xs text-slate-400 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Key Innovation Pillars */}
      <section className="py-16 bg-slate-900/40 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          
          <div className="text-center space-y-3">
            <span className="text-xs font-bold text-emerald-400 uppercase tracking-widest">Built For Excellence</span>
            <h2 className="text-3xl font-extrabold text-white">Why Educational Institutions Choose SDV</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl space-y-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center font-bold">
                <Lock className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-white text-base">SHA-256 Duplicate & Tamper Guard</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Prevents duplicate uploads and guarantees that student certificates and marksheets cannot be altered once verified.
              </p>
            </div>

            <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl space-y-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center font-bold">
                <QrCode className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-white text-base">Controlled Public QR Verification</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Recruiters and external organizations can confirm authenticity instantly at <code className="text-emerald-400">college.edu/verify</code> without accessing private personal data.
              </p>
            </div>

            <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl space-y-3">
              <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center font-bold">
                <Briefcase className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-white text-base">Placement Drive Automation</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Connects directly to placement drives. Automatic document matching verifies candidate eligibility before submission.
              </p>
            </div>

          </div>

        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 border-t border-slate-900 text-center text-xs text-slate-500 font-mono">
        <p>Student Document Vault (SDV) • RTPS Enterprise System • Sri Sivasubramaniya Nadar College of Engineering</p>
        <p className="text-[10px] text-slate-600 mt-1">Store Once. Verify Securely. Use Everywhere.</p>
      </footer>

    </div>
  );
};
