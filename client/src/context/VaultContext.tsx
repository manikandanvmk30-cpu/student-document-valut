import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  VaultDocument, 
  StudentProfile, 
  UserRole, 
  AcademicSemester, 
  UserSession, 
  AuditLog, 
  AppNotification, 
  SystemHealthStatus,
  DocumentCategory,
  DocumentVersion,
  DocumentShare
} from '../types';
import { 
  INITIAL_STUDENT_PROFILE, 
  INITIAL_DOCUMENTS, 
  INITIAL_SEMESTERS, 
  INITIAL_SESSIONS, 
  INITIAL_AUDIT_LOGS, 
  INITIAL_NOTIFICATIONS, 
  INITIAL_SYSTEM_HEALTH 
} from '../data/mockData';
import { jsPDF } from 'jspdf';
import { PDFDocument } from 'pdf-lib';
import QRCode from 'qrcode';
import confetti from 'canvas-confetti';

interface VaultContextType {
  // User Profile
  studentProfile: StudentProfile;
  updateStudentProfile: (profile: Partial<StudentProfile>) => void;
  
  // Documents / Certifications
  documents: VaultDocument[];
  uploadDocument: (
    file: File, 
    metadata: { 
      title: string; 
      category: DocumentCategory;
      fileDataUrl?: string;
    }
  ) => Promise<{ success: boolean; error?: string; isDuplicate?: boolean; doc?: VaultDocument }>;
  
  updateDocument: (docId: string, updates: Partial<VaultDocument>) => void;
  uploadNewVersion: (docId: string, file: File, changeNotes: string) => Promise<void>;
  moveToRecycleBin: (docId: string) => void;
  restoreFromRecycleBin: (docId: string) => void;
  permanentDeleteDocument: (docId: string) => void;

  // PDF Generation & Download (1st page Uploaded File, Last page Issued File)
  generateConsolidatedPdf: (docIds: string[], title?: string) => Promise<void>;
  downloadCertificatePdf: (doc: VaultDocument) => Promise<void>;
  getCertificatePdfUrl: (doc: VaultDocument) => Promise<string>;
  showCertificatePdf: (doc: VaultDocument) => Promise<void>;

  // Search & Filter Helper
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedCategory: DocumentCategory | 'ALL';
  setSelectedCategory: (cat: DocumentCategory | 'ALL') => void;

  // Notifications
  notifications: AppNotification[];
  markNotificationAsRead: (notifId: string) => void;
  markAllNotificationsAsRead: () => void;
}

const VaultContext = createContext<VaultContextType | undefined>(undefined);

// Web Crypto SHA-256 calculation
export async function calculateSHA256(file: File): Promise<string> {
  const arrayBuffer = await file.arrayBuffer();
  const hashBuffer = await crypto.subtle.digest('SHA-256', arrayBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  return hashHex;
}

export const VaultProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [studentProfile, setStudentProfile] = useState<StudentProfile>(() => {
    const saved = localStorage.getItem('sdv_profile');
    return saved ? JSON.parse(saved) : INITIAL_STUDENT_PROFILE;
  });
  
  const [documents, setDocuments] = useState<VaultDocument[]>(() => {
    const saved = localStorage.getItem('sdv_documents');
    return saved ? JSON.parse(saved) : INITIAL_DOCUMENTS;
  });

  const [notifications, setNotifications] = useState<AppNotification[]>(() => {
    const saved = localStorage.getItem('sdv_notifs');
    return saved ? JSON.parse(saved) : INITIAL_NOTIFICATIONS;
  });

  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<DocumentCategory | 'ALL'>('ALL');

  useEffect(() => {
    localStorage.setItem('sdv_documents', JSON.stringify(documents));
  }, [documents]);

  useEffect(() => {
    localStorage.setItem('sdv_profile', JSON.stringify(studentProfile));
  }, [studentProfile]);

  useEffect(() => {
    localStorage.setItem('sdv_notifs', JSON.stringify(notifications));
  }, [notifications]);

  const updateStudentProfile = (updates: Partial<StudentProfile>) => {
    setStudentProfile(prev => ({ ...prev, ...updates }));
  };

  // Upload Certification (Only Title + Category + File)
  const uploadDocument = async (
    file: File, 
    metadata: { 
      title: string; 
      category: DocumentCategory;
      fileDataUrl?: string;
    }
  ) => {
    const fileHash = await calculateSHA256(file);

    // Duplicate check
    const existingDoc = documents.find(d => !d.isRecycled && d.fileHash === fileHash);
    if (existingDoc) {
      return { 
        success: false, 
        isDuplicate: true, 
        error: `This certificate already exists in your vault as "${existingDoc.title}".` 
      };
    }

    const randomSuffix = Math.floor(100000 + Math.random() * 900000);
    const docVerificationId = `CERT-2026-${randomSuffix}`;
    const objectUrl = URL.createObjectURL(file);

    const newDoc: VaultDocument = {
      id: `doc-${Date.now()}`,
      docVerificationId,
      title: metadata.title || file.name.replace(/\.[^/.]+$/, ''),
      originalName: file.name,
      fileName: file.name.endsWith('.pdf') ? file.name : `${file.name.replace(/\.[^/.]+$/, '')}.pdf`,
      filePath: objectUrl,
      fileDataUrl: metadata.fileDataUrl || objectUrl,
      fileSize: file.size,
      mimeType: file.type || 'application/pdf',
      fileHash,
      category: metadata.category,
      tags: ['#Certificate'],
      issuer: 'Sri Sivasubramaniya Nadar College of Engineering',
      issueDate: new Date().toISOString().split('T')[0],
      isFavorite: false,
      isPinned: false,
      isArchived: false,
      isRecycled: false,
      verificationStatus: 'VERIFIED',
      currentVersion: 1,
      privacyLevel: 'PUBLIC_VERIFICATION',
      userId: studentProfile.userId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    setDocuments(prev => [newDoc, ...prev]);

    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.7 }
    });

    return { success: true, doc: newDoc };
  };

  const updateDocument = (docId: string, updates: Partial<VaultDocument>) => {
    setDocuments(prev => prev.map(d => d.id === docId ? { ...d, ...updates, updatedAt: new Date().toISOString() } : d));
  };

  const uploadNewVersion = async (docId: string, file: File, changeNotes: string) => {
    const fileHash = await calculateSHA256(file);
    const objectUrl = URL.createObjectURL(file);
    setDocuments(prev => prev.map(d => {
      if (d.id !== docId) return d;
      const nextVerNumber = (d.currentVersion || 1) + 1;
      const newVersionObj: DocumentVersion = {
        id: `ver-${Date.now()}`,
        documentId: docId,
        versionNumber: nextVerNumber,
        fileName: file.name,
        filePath: objectUrl,
        fileSize: file.size,
        fileHash,
        changeNotes,
        uploadedAt: new Date().toISOString()
      };
      return {
        ...d,
        fileName: file.name,
        filePath: objectUrl,
        fileSize: file.size,
        fileHash,
        currentVersion: nextVerNumber,
        updatedAt: new Date().toISOString(),
        versions: [...(d.versions || []), newVersionObj]
      };
    }));
  };

  const moveToRecycleBin = (docId: string) => {
    setDocuments(prev => prev.map(d => d.id === docId ? { ...d, isRecycled: true } : d));
  };

  const restoreFromRecycleBin = (docId: string) => {
    setDocuments(prev => prev.map(d => d.id === docId ? { ...d, isRecycled: false } : d));
  };

  const permanentDeleteDocument = (docId: string) => {
    setDocuments(prev => prev.filter(d => d.id !== docId));
  };

  // Generate Consolidated PDF Portfolio containing all selected certificates (Each with Uploaded File + Issued File)
  const generateConsolidatedPdf = async (docIds: string[], title = 'My_Certificates_Portfolio') => {
    const selectedDocs = documents.filter(d => docIds.includes(d.id));
    if (selectedDocs.length === 0) return;

    try {
      const mergedPdf = await PDFDocument.create();

      for (const docItem of selectedDocs) {
        const itemBlob = await buildCompleteDocumentPdfBlob(docItem, studentProfile);
        const itemArrayBuffer = await itemBlob.arrayBuffer();
        const itemPdf = await PDFDocument.load(itemArrayBuffer);
        const pageIndices = itemPdf.getPageIndices();
        const copiedPages = await mergedPdf.copyPages(itemPdf, pageIndices);
        copiedPages.forEach(p => mergedPdf.addPage(p));
      }

      const mergedPdfBytes = await mergedPdf.save();
      const blob = new Blob([mergedPdfBytes.buffer as ArrayBuffer], { type: 'application/pdf' });
      
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${title.toLowerCase().replace(/\s+/g, '_')}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      setTimeout(() => URL.revokeObjectURL(url), 10000);

      confetti({
        particleCount: 50,
        spread: 50
      });
    } catch (err) {
      console.error('Error generating consolidated PDF:', err);
    }
  };

  // Direct single certificate PDF download: User's actual uploaded file + Issued attestation as last page
  const downloadCertificatePdf = async (docItem: VaultDocument) => {
    try {
      const pdfBlob = await buildCompleteDocumentPdfBlob(docItem, studentProfile);
      const safeTitle = docItem.title.replace(/[^a-zA-Z0-9_-]/g, '_');
      const fileName = `${safeTitle}.pdf`;

      const url = URL.createObjectURL(pdfBlob);
      const a = document.createElement('a');
      a.href = url;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      setTimeout(() => URL.revokeObjectURL(url), 10000);

      confetti({
        particleCount: 40,
        spread: 45
      });
    } catch (err) {
      console.error('Error downloading certificate PDF:', err);
    }
  };

  // Get Blob URL for Show / Preview PDF
  const getCertificatePdfUrl = async (docItem: VaultDocument): Promise<string> => {
    const blob = await buildCompleteDocumentPdfBlob(docItem, studentProfile);
    return URL.createObjectURL(blob);
  };

  // Direct Show PDF in new tab
  const showCertificatePdf = async (docItem: VaultDocument) => {
    const url = await getCertificatePdfUrl(docItem);
    window.open(url, '_blank');
  };

  const markNotificationAsRead = (notifId: string) => {
    setNotifications(prev => prev.map(n => n.id === notifId ? { ...n, isRead: true } : n));
  };

  const markAllNotificationsAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
  };

  return (
    <VaultContext.Provider
      value={{
        studentProfile,
        updateStudentProfile,
        documents,
        uploadDocument,
        updateDocument,
        uploadNewVersion,
        moveToRecycleBin,
        restoreFromRecycleBin,
        permanentDeleteDocument,
        generateConsolidatedPdf,
        downloadCertificatePdf,
        getCertificatePdfUrl,
        showCertificatePdf,
        searchQuery,
        setSearchQuery,
        selectedCategory,
        setSelectedCategory,
        notifications,
        markNotificationAsRead,
        markAllNotificationsAsRead
      }}
    >
      {children}
    </VaultContext.Provider>
  );
};

// Generate the Official Issued File Attestation Record Page as PDF bytes
export async function createIssuedAttestationPdfBytes(item: VaultDocument, student: StudentProfile): Promise<Uint8Array> {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });

  // Header Banner for Issued File
  doc.setFillColor(30, 41, 59); // Slate 800
  doc.rect(0, 0, 210, 24, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(13);
  doc.setFont('helvetica', 'bold');
  doc.text('OFFICIAL ISSUED FILE & CERTIFICATE RECORD', 14, 13);
  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(203, 213, 225);
  doc.text('Digital Verification Manifest & Official College Attestation', 14, 20);

  // College & Attestation Header
  doc.setTextColor(15, 23, 42);
  doc.setFontSize(15);
  doc.setFont('helvetica', 'bold');
  doc.text(student.college, 105, 38, { align: 'center' });

  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(71, 85, 105);
  doc.text(`Department of ${student.department}  •  Digital Document Vault`, 105, 45, { align: 'center' });

  // Attestation Pill
  doc.setFillColor(236, 253, 245); // Emerald 50
  doc.rect(40, 50, 130, 8, 'F');
  doc.setDrawColor(52, 211, 153); // Emerald 400
  doc.rect(40, 50, 130, 8, 'S');
  doc.setTextColor(6, 95, 70); // Emerald 800
  doc.setFontSize(8);
  doc.setFont('helvetica', 'bold');
  doc.text('OFFICIAL RECORD CERTIFICATE OF ISSUANCE & VERIFICATION', 105, 55.5, { align: 'center' });

  // Summary Metadata Table
  const tableY = 64;
  doc.setFillColor(248, 250, 252);
  doc.rect(14, tableY, 182, 115, 'F');
  doc.setDrawColor(203, 213, 225);
  doc.rect(14, tableY, 182, 115, 'S');

  const rows = [
    ['Document Title:', item.title],
    ['Category:', item.category],
    ['Verification ID:', item.docVerificationId],
    ['Candidate Name:', student.name],
    ['Student ID / Reg No:', `${student.studentId}  |  ${student.regNo}`],
    ['Department:', student.department],
    ['Institution:', student.college],
    ['Issuing Authority:', item.issuer || 'Sri Sivasubramaniya Nadar College of Engineering'],
    ['Original File Name:', item.originalName || item.fileName],
    ['Record Issue Date:', item.issueDate || new Date().toISOString().split('T')[0]],
    ['Record Status:', 'Attested & Active on SDV'],
  ];

  let currentY = tableY + 9;
  rows.forEach(([label, val], idx) => {
    if (idx % 2 === 1) {
      doc.setFillColor(241, 245, 249);
      doc.rect(15, currentY - 6, 180, 9, 'F');
    }
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(30, 41, 59);
    doc.setFontSize(8.5);
    doc.text(label, 20, currentY);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(51, 65, 85);
    doc.text(String(val), 75, currentY);
    currentY += 10;
  });

  // Bottom section: Clean QR Code
  const verifyUrl = `${window.location.origin}/verify/${item.docVerificationId}`;
  try {
    const qrDataUrl = await QRCode.toDataURL(verifyUrl, { margin: 1, width: 250 });
    doc.addImage(qrDataUrl, 'PNG', 85, 195, 40, 40);
  } catch (e) {
    // fallback if qr fails
  }

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(100, 116, 139);
  doc.text(`Verification ID: ${item.docVerificationId}`, 105, 242, { align: 'center' });

  return new Uint8Array(doc.output('arraybuffer'));
}

// Build the complete combined PDF: User's actual uploaded file (all pages) + Issued Attestation Page as the last page
export async function buildCompleteDocumentPdfBlob(item: VaultDocument, student: StudentProfile): Promise<Blob> {
  const issuedPageBytes = await createIssuedAttestationPdfBytes(item, student);
  const issuedPdfDoc = await PDFDocument.load(issuedPageBytes);

  // Case 1: Uploaded file is a PDF (e.g. user uploaded resume or course certificate PDF)
  if (item.fileDataUrl && item.fileDataUrl.startsWith('data:application/pdf')) {
    try {
      const base64Data = item.fileDataUrl.split(',')[1];
      const binaryStr = atob(base64Data);
      const bytes = new Uint8Array(binaryStr.length);
      for (let i = 0; i < binaryStr.length; i++) {
        bytes[i] = binaryStr.charCodeAt(i);
      }

      // Load user's uploaded PDF
      const uploadedPdf = await PDFDocument.load(bytes);
      
      // Copy the issued attestation page and append to the end of user's PDF
      const [copiedIssuedPage] = await uploadedPdf.copyPages(issuedPdfDoc, [0]);
      uploadedPdf.addPage(copiedIssuedPage);

      const mergedPdfBytes = await uploadedPdf.save();
      return new Blob([mergedPdfBytes.buffer as ArrayBuffer], { type: 'application/pdf' });
    } catch (err) {
      console.warn('Could not merge uploaded PDF directly, falling back to renderer:', err);
    }
  }

  // Case 2: Uploaded file is an Image (JPG, PNG, WebP)
  if (item.fileDataUrl && item.fileDataUrl.startsWith('data:image/')) {
    try {
      const base64Data = item.fileDataUrl.split(',')[1];
      const binaryStr = atob(base64Data);
      const imgBytes = new Uint8Array(binaryStr.length);
      for (let i = 0; i < binaryStr.length; i++) {
        imgBytes[i] = binaryStr.charCodeAt(i);
      }

      const pdfDoc = await PDFDocument.create();
      let embeddedImg;
      if (item.fileDataUrl.startsWith('data:image/png')) {
        embeddedImg = await pdfDoc.embedPng(imgBytes);
      } else {
        embeddedImg = await pdfDoc.embedJpg(imgBytes);
      }

      // A4 page dimensions in points: 595.28 x 841.89
      const page1 = pdfDoc.addPage([595.28, 841.89]);
      const { width: imgW, height: imgH } = embeddedImg;
      
      // Scale image to fit within margins
      const maxW = 535;
      const maxH = 760;
      const scale = Math.min(maxW / imgW, maxH / imgH, 1);
      const drawW = imgW * scale;
      const drawH = imgH * scale;
      const x = (595.28 - drawW) / 2;
      const y = (841.89 - drawH) / 2;

      page1.drawImage(embeddedImg, {
        x,
        y,
        width: drawW,
        height: drawH,
      });

      // Append issued page as last page
      const [copiedIssuedPage] = await pdfDoc.copyPages(issuedPdfDoc, [0]);
      pdfDoc.addPage(copiedIssuedPage);

      const finalPdfBytes = await pdfDoc.save();
      return new Blob([finalPdfBytes.buffer as ArrayBuffer], { type: 'application/pdf' });
    } catch (err) {
      console.warn('Could not embed image directly, falling back to visual generator:', err);
    }
  }

  // Case 3: Mock / Generated Document (using jsPDF)
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });
  await renderDocumentPagesToPdf(doc, item, student, true);
  return doc.output('blob');
}

// Fallback Helper: Render Page 1 (Uploaded File Scan) + Page 2 (Issued File)
export async function renderDocumentPagesToPdf(
  doc: jsPDF, 
  item: VaultDocument, 
  student: StudentProfile, 
  isFirstDoc = true
) {
  // PAGE 1: Uploaded File
  if (!isFirstDoc) {
    doc.addPage();
  }

  // Header Banner for Page 1
  doc.setFillColor(15, 23, 42); // Dark slate
  doc.rect(0, 0, 210, 22, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.text('PAGE 1: ORIGINAL UPLOADED CERTIFICATE FILE', 14, 11);
  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(203, 213, 225);
  doc.text(`Title: ${item.title}  |  Category: ${item.category}`, 14, 18);

  // Body of Page 1: If image dataUrl is available, embed it; otherwise render styled certificate visual
  if (item.fileDataUrl && item.fileDataUrl.startsWith('data:image/')) {
    try {
      doc.addImage(item.fileDataUrl, 'PNG', 15, 28, 180, 240);
    } catch (e) {
      renderStyledCertificateVisual(doc, item, student);
    }
  } else {
    renderStyledCertificateVisual(doc, item, student);
  }

  // PAGE 2: Issued File (Official Attestation & QR Record)
  doc.addPage();

  // Header Banner for Page 2
  doc.setFillColor(30, 41, 59); // Slate 800
  doc.rect(0, 0, 210, 24, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(13);
  doc.setFont('helvetica', 'bold');
  doc.text('PAGE 2: OFFICIAL ISSUED FILE & CERTIFICATE RECORD', 14, 13);
  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(203, 213, 225);
  doc.text('Digital Verification Manifest & Official College Attestation', 14, 20);

  // College & Attestation Header
  doc.setTextColor(15, 23, 42);
  doc.setFontSize(15);
  doc.setFont('helvetica', 'bold');
  doc.text(student.college, 105, 38, { align: 'center' });

  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(71, 85, 105);
  doc.text(`Department of ${student.department}  •  Digital Document Vault`, 105, 45, { align: 'center' });

  // Attestation Pill
  doc.setFillColor(236, 253, 245); // Emerald 50
  doc.rect(40, 50, 130, 8, 'F');
  doc.setDrawColor(52, 211, 153); // Emerald 400
  doc.rect(40, 50, 130, 8, 'S');
  doc.setTextColor(6, 95, 70); // Emerald 800
  doc.setFontSize(8);
  doc.setFont('helvetica', 'bold');
  doc.text('OFFICIAL RECORD CERTIFICATE OF ISSUANCE & VERIFICATION', 105, 55.5, { align: 'center' });

  // Summary Metadata Table
  const tableY = 64;
  doc.setFillColor(248, 250, 252);
  doc.rect(14, tableY, 182, 115, 'F');
  doc.setDrawColor(203, 213, 225);
  doc.rect(14, tableY, 182, 115, 'S');

  const rows = [
    ['Document Title:', item.title],
    ['Category:', item.category],
    ['Verification ID:', item.docVerificationId],
    ['Candidate Name:', student.name],
    ['Student ID / Reg No:', `${student.studentId}  |  ${student.regNo}`],
    ['Department:', student.department],
    ['Institution:', student.college],
    ['Issuing Authority:', item.issuer || 'Institutional Authority'],
    ['Original File Name:', item.originalName || item.fileName],
    ['Record Issue Date:', item.issueDate || new Date().toISOString().split('T')[0]],
    ['Record Status:', 'Attested & Active on SDV'],
  ];

  let currentY = tableY + 9;
  rows.forEach(([label, val], idx) => {
    if (idx % 2 === 1) {
      doc.setFillColor(241, 245, 249);
      doc.rect(15, currentY - 6, 180, 9, 'F');
    }
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(30, 41, 59);
    doc.setFontSize(8.5);
    doc.text(label, 20, currentY);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(51, 65, 85);
    doc.text(String(val), 75, currentY);
    currentY += 10;
  });

  // Bottom section: Clean QR Code
  const verifyUrl = `${window.location.origin}/verify/${item.docVerificationId}`;
  try {
    const qrDataUrl = await QRCode.toDataURL(verifyUrl, { margin: 1, width: 250 });
    doc.addImage(qrDataUrl, 'PNG', 85, 195, 40, 40);
  } catch (e) {
    // fallback if qr fails
  }

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(100, 116, 139);
  doc.text(`Verification ID: ${item.docVerificationId}`, 105, 242, { align: 'center' });
}

function renderStyledCertificateVisual(doc: jsPDF, item: VaultDocument, student: StudentProfile) {
  const isResume = item.title.toLowerCase().includes('resume') || item.category === 'Career';

  if (isResume) {
    // Outer border
    doc.setDrawColor(203, 213, 225);
    doc.setLineWidth(0.8);
    doc.rect(14, 28, 182, 248, 'S');

    // Header: Candidate Name & Title
    doc.setFillColor(15, 23, 42); // Dark slate
    doc.rect(14, 28, 182, 32, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(17);
    doc.setFont('helvetica', 'bold');
    doc.text(student.name, 22, 42);

    doc.setFontSize(9.5);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(199, 210, 254);
    doc.text(item.title, 22, 50);

    // Contact Bar
    doc.setFillColor(241, 245, 249);
    doc.rect(14, 60, 182, 12, 'F');
    doc.setTextColor(51, 65, 85);
    doc.setFontSize(8);
    doc.setFont('helvetica', 'normal');
    doc.text(`Email: ${student.email}   |   Phone: ${student.phone}   |   Reg No: ${student.regNo}`, 20, 68);

    // Education Section
    doc.setTextColor(15, 23, 42);
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.text('EDUCATION & ACADEMICS', 20, 82);
    doc.setDrawColor(79, 70, 229);
    doc.setLineWidth(0.5);
    doc.line(20, 84, 190, 84);

    doc.setFontSize(9.5);
    doc.setFont('helvetica', 'bold');
    doc.text(`Bachelor of Engineering in ${student.department}`, 20, 92);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(71, 85, 105);
    doc.text(`${student.college}   •   Batch ${student.batch}   •   CGPA: ${student.cgpa}/10.0`, 20, 98);

    // Technical Skills Section
    doc.setTextColor(15, 23, 42);
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.text('TECHNICAL & ENGINEERING SKILLS', 20, 112);
    doc.line(20, 114, 190, 114);

    doc.setFontSize(8.5);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(51, 65, 85);
    doc.text(`Core Languages & Tools: ${student.skills.join(', ')}`, 20, 122);
    doc.text('Architecture: Microservices, REST APIs, Cryptographic Hash Verification, Distributed Systems', 20, 128);

    // Projects Section
    doc.setTextColor(15, 23, 42);
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.text('FEATURED PROJECTS', 20, 142);
    doc.line(20, 144, 190, 144);

    let projY = 152;
    student.projects.slice(0, 2).forEach(p => {
      doc.setFontSize(9.5);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(30, 41, 59);
      doc.text(`• ${p.title}`, 20, projY);
      doc.setFontSize(8);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(71, 85, 105);
      doc.text(p.description, 24, projY + 6, { maxWidth: 165 });
      projY += 16;
    });

    // Key Achievements Section
    doc.setTextColor(15, 23, 42);
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.text('CERTIFICATIONS & HONORS', 20, projY + 4);
    doc.line(20, projY + 6, 190, projY + 6);

    let achY = projY + 14;
    student.achievements.slice(0, 3).forEach(a => {
      doc.setFontSize(8.5);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(51, 65, 85);
      doc.text(`✓ ${a.title} (${a.year})`, 22, achY);
      achY += 7;
    });

    // Footer note
    doc.setFontSize(7.5);
    doc.setTextColor(148, 163, 184);
    doc.text('Verified Candidate Resume Document Scan  •  Student Document Vault 2026', 105, 270, { align: 'center' });
    return;
  }

  // Outer decorative border
  doc.setDrawColor(79, 70, 229); // Indigo 600
  doc.setLineWidth(1.2);
  doc.rect(14, 28, 182, 248, 'S');

  // Inner border
  doc.setDrawColor(199, 210, 254); // Indigo 200
  doc.setLineWidth(0.4);
  doc.rect(17, 31, 176, 242, 'S');

  // Certificate Header
  doc.setTextColor(30, 41, 59);
  doc.setFontSize(20);
  doc.setFont('helvetica', 'bold');
  doc.text('CERTIFICATE OF RECORD', 105, 54, { align: 'center' });

  doc.setFontSize(8.5);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(100, 116, 139);
  doc.text('ORIGINAL UPLOADED CREDENTIAL DOCUMENT', 105, 63, { align: 'center' });

  // Recipient Name
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(79, 70, 229);
  doc.text(student.name, 105, 80, { align: 'center' });

  // Detail
  doc.setFontSize(9.5);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(51, 65, 85);
  doc.text('for verified completion / attainment of:', 105, 92, { align: 'center' });

  // Document Title
  doc.setFontSize(13);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(15, 23, 42);
  doc.text(item.title, 105, 108, { align: 'center' });

  // Category Badge
  doc.setFillColor(238, 242, 255);
  doc.rect(75, 118, 60, 8, 'F');
  doc.setDrawColor(199, 210, 254);
  doc.rect(75, 118, 60, 8, 'S');
  doc.setFontSize(8);
  doc.setTextColor(79, 70, 229);
  doc.setFont('helvetica', 'bold');
  doc.text(item.category, 105, 123.5, { align: 'center' });

  // Credential Details Box
  doc.setFillColor(248, 250, 252);
  doc.rect(26, 136, 158, 52, 'F');
  doc.setDrawColor(226, 232, 240);
  doc.rect(26, 136, 158, 52, 'S');

  doc.setFontSize(8.5);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(71, 85, 105);
  doc.text('Issuing Organization:', 32, 148);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(15, 23, 42);
  doc.text(item.issuer || 'Sri Sivasubramaniya Nadar College of Engineering', 76, 148);

  doc.setFont('helvetica', 'bold');
  doc.setTextColor(71, 85, 105);
  doc.text('Verification Ref ID:', 32, 160);
  doc.setFont('courier', 'bold');
  doc.setTextColor(79, 70, 229);
  doc.text(item.docVerificationId, 76, 160);

  doc.setFont('helvetica', 'bold');
  doc.setTextColor(71, 85, 105);
  doc.text('Issue / Record Date:', 32, 172);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(15, 23, 42);
  doc.text(item.issueDate || new Date().toISOString().split('T')[0], 76, 172);

  doc.setFont('helvetica', 'bold');
  doc.setTextColor(71, 85, 105);
  doc.text('Original File Name:', 32, 182);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(15, 23, 42);
  doc.text(item.originalName || item.fileName, 76, 182);

  // Bottom Signature & Seal
  doc.setDrawColor(148, 163, 184);
  doc.line(36, 236, 85, 236);
  doc.setFontSize(7.5);
  doc.setTextColor(100, 116, 139);
  doc.text('Original Document Signatory', 42, 242);

  doc.setDrawColor(148, 163, 184);
  doc.line(125, 236, 174, 236);
  doc.text('Institutional Archive Seal', 132, 242);

  // Golden / Emerald Seal Center
  doc.setFillColor(254, 243, 199); // Amber 100
  doc.circle(105, 220, 13, 'F');
  doc.setDrawColor(217, 119, 6); // Amber 600
  doc.setLineWidth(0.6);
  doc.circle(105, 220, 13, 'S');
  doc.setFontSize(6.5);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(180, 83, 9);
  doc.text('AUTHENTIC', 105, 218, { align: 'center' });
  doc.text('DOCUMENT', 105, 224, { align: 'center' });
}

export const useVault = () => {
  const context = useContext(VaultContext);
  if (!context) {
    throw new Error('useVault must be used within a VaultProvider');
  }
  return context;
};
