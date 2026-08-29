import React, { useRef } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { VaultDocument } from '../../types';
import { X, Download, ShieldCheck, Copy, Check, ExternalLink } from 'lucide-react';
import { useState } from 'react';

interface QRModalProps {
  document: VaultDocument | null;
  onClose: () => void;
}

export const QRModal: React.FC<QRModalProps> = ({ document, onClose }) => {
  const [copiedLink, setCopiedLink] = useState(false);
  const qrRef = useRef<HTMLDivElement>(null);

  if (!document) return null;

  const verificationUrl = `${window.location.origin}/verify/${document.docVerificationId}`;

  const copyUrl = () => {
    navigator.clipboard.writeText(verificationUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const downloadQR = () => {
    if (!qrRef.current) return;
    const svg = qrRef.current.querySelector('svg');
    if (!svg) return;

    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = window.document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();
    
    img.onload = () => {
      canvas.width = 400;
      canvas.height = 400;
      if (ctx) {
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 20, 20, 360, 360);
        const pngFile = canvas.toDataURL('image/png');
        const downloadLink = window.document.createElement('a');
        downloadLink.download = `QR_${document.docVerificationId}.png`;
        downloadLink.href = pngFile;
        downloadLink.click();
      }
    };

    img.src = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svgData)));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
      <div className="relative w-full max-w-md bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl p-6 overflow-hidden text-center">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="inline-flex p-3 bg-indigo-500/10 border border-indigo-500/20 rounded-2xl text-indigo-400 mb-3">
          <ShieldCheck className="w-6 h-6" />
        </div>
        <h3 className="text-lg font-bold text-white">Cryptographic QR Verification</h3>
        <p className="text-xs text-slate-400 mt-1 max-w-xs mx-auto">
          Scan to verify official credentials without exposing private personal student data.
        </p>

        {/* QR Display Card */}
        <div className="my-6 p-6 bg-white rounded-2xl shadow-inner border-2 border-indigo-500/30 inline-block" ref={qrRef}>
          <QRCodeSVG
            value={verificationUrl}
            size={200}
            level="H"
            includeMargin={true}
            imageSettings={{
              src: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%234F46E5'%3E%3Cpath d='M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5'/%3E%3C/svg%3E",
              x: undefined,
              y: undefined,
              height: 36,
              width: 36,
              excavate: true,
            }}
          />
          <div className="mt-2 text-[11px] font-mono font-bold text-slate-800 tracking-wider">
            {document.docVerificationId}
          </div>
        </div>

        {/* Document Info */}
        <div className="bg-slate-950/80 p-3.5 rounded-xl border border-slate-800 text-left mb-6 space-y-2 text-xs">
          <div className="flex justify-between">
            <span className="text-slate-400">Certification Name:</span>
            <span className="font-semibold text-slate-200 truncate max-w-[200px]">{document.title}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">Category:</span>
            <span className="font-semibold text-indigo-300">{document.category}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">Verification ID:</span>
            <span className="font-mono font-semibold text-slate-300">{document.docVerificationId}</span>
          </div>
        </div>

        {/* Actions */}
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={copyUrl}
            className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-xl border border-slate-700 flex items-center justify-center gap-2 transition"
          >
            {copiedLink ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
            <span>{copiedLink ? 'Link Copied!' : 'Copy Verify URL'}</span>
          </button>

          <button
            onClick={downloadQR}
            className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-xl shadow-lg flex items-center justify-center gap-2 transition"
          >
            <Download className="w-4 h-4" />
            <span>Download PNG</span>
          </button>
        </div>

      </div>
    </div>
  );
};
