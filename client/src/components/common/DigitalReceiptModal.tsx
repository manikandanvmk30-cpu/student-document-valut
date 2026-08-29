import React, { useRef } from 'react';
import { VaultDocument, StudentProfile } from '../../types';
import { X, Printer, ShieldCheck, Download, Award, CheckCircle2, Hash } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';

interface DigitalReceiptModalProps {
  document: VaultDocument | null;
  student: StudentProfile;
  onClose: () => void;
}

export const DigitalReceiptModal: React.FC<DigitalReceiptModalProps> = ({
  document,
  student,
  onClose
}) => {
  const receiptRef = useRef<HTMLDivElement>(null);

  if (!document) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[95vh]">
        
        {/* Header Actions */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950 no-print">
          <div className="flex items-center space-x-2 text-indigo-400 font-bold text-sm">
            <Award className="w-5 h-5" />
            <span>Digital Document Verification Receipt</span>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={handlePrint}
              className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-lg flex items-center gap-1.5 transition"
            >
              <Printer className="w-4 h-4" />
              <span>Print / Save as PDF</span>
            </button>

            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Receipt Certificate */}
        <div className="p-8 bg-slate-950 overflow-y-auto flex justify-center">
          <div 
            ref={receiptRef}
            className="w-full bg-white text-slate-900 p-8 rounded-xl shadow-2xl border-4 border-indigo-950/20 relative font-serif"
          >
            {/* Background Watermark */}
            <div className="absolute inset-0 flex items-center justify-center opacity-[0.03] pointer-events-none select-none">
              <div className="text-8xl font-black rotate-[-25deg] tracking-widest text-slate-950">
                SDV VAULT
              </div>
            </div>

            {/* Institutional Header */}
            <div className="text-center border-b-2 border-indigo-950/30 pb-4 mb-6">
              <div className="w-12 h-12 mx-auto bg-indigo-900 text-white rounded-full flex items-center justify-center font-bold text-xl mb-2">
                SDV
              </div>
              <h2 className="text-xl font-bold uppercase tracking-wider text-slate-900 font-sans">
                {student.college}
              </h2>
              <p className="text-xs text-slate-600 font-sans mt-0.5">
                Department of {student.department} • Digital Records Cell
              </p>
              <div className="mt-3 inline-block px-4 py-1 bg-emerald-100 text-emerald-900 text-xs font-bold font-sans rounded-full border border-emerald-300">
                OFFICIAL DIGITAL RECORD CERTIFICATE OF VERIFICATION
              </div>
            </div>

            {/* Receipt Summary Grid */}
            <div className="grid grid-cols-2 gap-4 text-xs font-sans mb-6">
              <div className="p-3 bg-slate-50 rounded border border-slate-200">
                <p className="text-slate-500 font-semibold text-[10px] uppercase">Student Name</p>
                <p className="font-bold text-slate-900 text-sm">{student.name}</p>
                <p className="text-slate-600 text-[11px]">ID: {student.studentId} • Reg: {student.regNo}</p>
              </div>

              <div className="p-3 bg-slate-50 rounded border border-slate-200">
                <p className="text-slate-500 font-semibold text-[10px] uppercase">Verification Identifier</p>
                <p className="font-mono font-bold text-indigo-900 text-sm">{document.docVerificationId}</p>
                <p className="text-slate-600 text-[11px]">Batch: {student.batch}</p>
              </div>
            </div>

            {/* Document Details Table */}
            <table className="w-full text-xs font-sans border-collapse border border-slate-300 mb-6">
              <tbody>
                <tr className="border-b border-slate-200 bg-slate-50">
                  <td className="p-2.5 font-bold text-slate-700 w-1/3">Document Title</td>
                  <td className="p-2.5 font-semibold text-slate-900">{document.title}</td>
                </tr>
                <tr className="border-b border-slate-200">
                  <td className="p-2.5 font-bold text-slate-700">Category & Type</td>
                  <td className="p-2.5 text-slate-800">{document.category} {document.subCategory ? `(${document.subCategory})` : ''}</td>
                </tr>
                <tr className="border-b border-slate-200 bg-slate-50">
                  <td className="p-2.5 font-bold text-slate-700">Issuing Authority</td>
                  <td className="p-2.5 text-slate-800">{document.issuer || 'Institutional Authority'}</td>
                </tr>
                <tr className="border-b border-slate-200">
                  <td className="p-2.5 font-bold text-slate-700">Verification ID</td>
                  <td className="p-2.5 font-mono font-bold text-indigo-900">{document.docVerificationId}</td>
                </tr>
                <tr className="bg-slate-50">
                  <td className="p-2.5 font-bold text-slate-700">Cryptographic Hash</td>
                  <td className="p-2.5 font-mono text-[10px] text-slate-700 break-all">{document.fileHash}</td>
                </tr>
              </tbody>
            </table>

            {/* Bottom Row: QR & Official Seal */}
            <div className="flex items-center justify-between pt-4 border-t-2 border-slate-200 font-sans">
              <div className="flex items-center space-x-3">
                <QRCodeSVG
                  value={`${window.location.origin}/verify/${document.docVerificationId}`}
                  size={70}
                  level="M"
                />
                <div className="text-[10px] text-slate-500">
                  <p className="font-semibold text-slate-800">Scan to Verify Online</p>
                  <p>Immutable Record on SDV</p>
                  <p className="font-mono text-[9px]">{new Date().toLocaleDateString()}</p>
                </div>
              </div>

              <div className="text-right">
                <div className="w-20 h-20 rounded-full border-2 border-dashed border-indigo-900/40 inline-flex flex-col items-center justify-center text-indigo-900 font-bold text-[9px] uppercase leading-tight rotate-[-8deg] p-1">
                  <span>DIGITALLY</span>
                  <span>VERIFIED</span>
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 my-0.5" />
                  <span>SDV 2026</span>
                </div>
              </div>
            </div>

            {/* Institutional Disclaimer */}
            <p className="text-[9px] text-slate-400 text-center font-sans mt-6">
              This digital document receipt is generated by the Student Document Vault (SDV) system. 
              Authenticity can be verified at any time using the cryptographic hash or QR code.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
};
