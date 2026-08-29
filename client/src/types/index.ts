export type UserRole = 
  | 'STUDENT'
  | 'FACULTY'
  | 'PLACEMENT_OFFICER'
  | 'RECRUITER'
  | 'DEPT_ADMIN'
  | 'SUPER_ADMIN';

export type DocumentCategory = 
  | 'Academic'
  | 'Certificates'
  | 'Internship'
  | 'Career'
  | 'Other'
  | (string & {});

export type VerificationStatus = 'PENDING' | 'VERIFIED' | 'REJECTED';

export type PrivacyLevel = 'PRIVATE' | 'COLLEGE_ONLY' | 'RECRUITER_ONLY' | 'PUBLIC_VERIFICATION';

export interface DocumentVersion {
  id: string;
  documentId: string;
  versionNumber: number;
  fileName: string;
  filePath: string;
  fileSize: number;
  fileHash: string;
  changeNotes?: string;
  uploadedAt: string;
}

export interface DocumentShare {
  id: string;
  documentId: string;
  shareToken: string;
  passwordHash?: string;
  expiresAt?: string;
  allowDownload: boolean;
  isRevoked: boolean;
  viewsCount: number;
  downloadsCount: number;
  recipientNote?: string;
  createdAt: string;
}

export interface DocumentAccessLog {
  id: string;
  documentId: string;
  action: 'VIEW' | 'DOWNLOAD' | 'VERIFY' | 'SHARE_CREATED' | 'ACCESS_REVOKED';
  performedBy: string;
  ipAddress?: string;
  userAgent?: string;
  timestamp: string;
}

export interface VaultDocument {
  id: string;
  docVerificationId: string; // e.g. DOC-2026-CSE-000182
  title: string;
  originalName: string;
  fileName: string;
  filePath: string;
  fileSize: number;
  mimeType: string;
  fileHash: string; // SHA-256
  fileDataUrl?: string;
  category: DocumentCategory;
  subCategory?: string; // 10th, 12th, Sem 1, AWS, etc.
  tags: string[]; // ['#Java', '#Placement']
  issuer?: string;
  issueDate?: string;
  expiryDate?: string;
  certNumber?: string;
  isFavorite: boolean;
  isPinned: boolean;
  isArchived: boolean;
  isRecycled: boolean;
  verificationStatus: VerificationStatus;
  rejectionReason?: string;
  verifiedBy?: string;
  verifiedAt?: string;
  currentVersion: number;
  privacyLevel: PrivacyLevel;
  userId: string;
  createdAt: string;
  updatedAt: string;
  versions?: DocumentVersion[];
  shares?: DocumentShare[];
  accessLogs?: DocumentAccessLog[];
}

export interface StudentProfile {
  id: string;
  userId: string;
  studentId: string; // e.g. 2026CSE042
  name: string;
  email: string;
  regNo: string;
  department: string;
  batch: string; // 2022-2026
  year: number;
  cgpa: number;
  phone: string;
  college: string;
  skills: string[];
  projects: {
    title: string;
    description: string;
    tags: string[];
    link?: string;
  }[];
  achievements: {
    title: string;
    year: string;
    category: string;
    verified: boolean;
  }[];
  completionPercent: number;
  emergencyContact?: {
    name: string;
    relation: string;
    phone: string;
    allowedDocCategories: string[];
  };
}

export interface PlacementDrive {
  id: string;
  companyName: string;
  companyLogo?: string;
  roleTitle: string;
  packageLpa: number;
  location: string;
  minCgpa: number;
  eligibleDepts: string[];
  requiredDocTypes: string[];
  deadline: string;
  status: 'ACTIVE' | 'CLOSED' | 'UPCOMING';
  description: string;
  appliedCount?: number;
}

export interface PlacementApplication {
  id: string;
  driveId: string;
  drive?: PlacementDrive;
  studentId: string;
  studentName: string;
  studentDept: string;
  studentCgpa: number;
  attachedDocIds: string[];
  status: 'APPLIED' | 'SHORTLISTED' | 'VERIFIED' | 'REJECTED' | 'OFFERED';
  appliedAt: string;
}

export interface RecruiterRequest {
  id: string;
  recruiterName: string;
  companyName: string;
  studentId: string;
  studentName?: string;
  requestedDocTypes: string[];
  deadline: string;
  reason: string;
  status: 'PENDING' | 'SUBMITTED' | 'VERIFIED' | 'REJECTED';
  submittedDocIds?: string[];
  createdAt: string;
  submittedAt?: string;
}

export interface AcademicSemester {
  semesterNumber: number;
  sgpa: number;
  credits: number;
  subjects: {
    code: string;
    name: string;
    grade: string;
    credits: number;
  }[];
}

export interface UserSession {
  id: string;
  device: string;
  browser: string;
  ipAddress: string;
  lastActive: string;
  isCurrent: boolean;
}

export interface AuditLog {
  id: string;
  action: string;
  category: 'AUTH' | 'DOCUMENT' | 'VERIFICATION' | 'PLACEMENT' | 'SECURITY' | 'ADMIN';
  details: string;
  userEmail: string;
  ipAddress?: string;
  timestamp: string;
}

export interface AppNotification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'VERIFICATION' | 'REJECTION' | 'PLACEMENT' | 'SHARE' | 'EXPIRY' | 'SYSTEM';
  isRead: boolean;
  link?: string;
  createdAt: string;
}

export interface StorageInfo {
  usedBytes: number;
  limitBytes: number;
  documentCount: number;
  breakdown: {
    category: DocumentCategory;
    bytes: number;
    count: number;
  }[];
}

export interface SystemHealthStatus {
  database: 'HEALTHY' | 'DEGRADED' | 'DOWN';
  storage: 'HEALTHY' | 'DEGRADED' | 'DOWN';
  authService: 'HEALTHY' | 'DEGRADED' | 'DOWN';
  notifications: 'HEALTHY' | 'DEGRADED' | 'DOWN';
  backups: 'HEALTHY' | 'DEGRADED' | 'DOWN';
  uptimeSeconds: number;
  activeSessionsCount: number;
  totalDocuments: number;
  verifiedDocuments: number;
}
