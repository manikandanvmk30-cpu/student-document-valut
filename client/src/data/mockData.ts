import { 
  VaultDocument, 
  StudentProfile, 
  PlacementDrive, 
  PlacementApplication, 
  RecruiterRequest, 
  AcademicSemester, 
  UserSession, 
  AuditLog, 
  AppNotification, 
  SystemHealthStatus 
} from '../types';

export const INITIAL_STUDENT_PROFILE: StudentProfile = {
  id: 'usr_student_01',
  userId: 'usr_student_01',
  studentId: '2026CSE042',
  name: 'Manikandan V',
  email: 'manikandan.v@college.edu',
  regNo: '710022104042',
  department: 'Computer Science and Engineering',
  batch: '2022 - 2026',
  year: 4,
  cgpa: 8.42,
  phone: '+91 98765 43210',
  college: 'Sri Sivasubramaniya Nadar College of Engineering',
  skills: ['Java', 'Spring Boot', 'React', 'TypeScript', 'PostgreSQL', 'Docker', 'REST APIs', 'Tailwind CSS'],
  projects: [
    {
      title: 'Student Document Vault (SDV)',
      description: 'Centralized digital document repository with SHA-256 duplicate detection, QR verification, and placement checklist integration.',
      tags: ['React', 'TypeScript', 'Node.js', 'Prisma', 'PostgreSQL'],
      link: 'https://github.com/manikandan/sdv-vault'
    },
    {
      title: 'Autonomous Drone Navigation System',
      description: 'Computer vision guided obstacle avoidance algorithm deployed on ROS 2 with 94.2% precision.',
      tags: ['Python', 'OpenCV', 'ROS2', 'PyTorch'],
      link: 'https://github.com/manikandan/drone-vision'
    }
  ],
  achievements: [
    {
      title: '1st Place – Smart India Hackathon 2025 (State Finals)',
      year: '2025',
      category: 'Hackathon',
      verified: true
    },
    {
      title: 'IEEE Best Research Paper Award – Distributed File Systems',
      year: '2026',
      category: 'Paper Presentation',
      verified: true
    },
    {
      title: 'AWS Certified Solutions Architect – Associate',
      year: '2025',
      category: 'Certification',
      verified: true
    }
  ],
  completionPercent: 96,
  emergencyContact: {
    name: 'Venkatesan R (Father)',
    relation: 'Parent / Guardian',
    phone: '+91 98765 99887',
    allowedDocCategories: ['Academic', 'Certificates']
  }
};

export const INITIAL_DOCUMENTS: VaultDocument[] = [
  {
    id: 'doc-001',
    docVerificationId: 'DOC-2026-CSE-000182',
    title: '10th Standard Secondary Marksheet',
    originalName: '10th_CBSE_Board_Marksheet.pdf',
    fileName: '10th_CBSE_Board_Marksheet.pdf',
    filePath: '/uploads/sample_10th_marksheet.pdf',
    fileSize: 1024 * 480, // 480 KB
    mimeType: 'application/pdf',
    fileHash: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
    category: 'Academic',
    subCategory: '10th',
    tags: ['#10th', '#BoardExam', '#Academic'],
    issuer: 'Central Board of Secondary Education (CBSE)',
    issueDate: '2020-05-15',
    certNumber: 'CBSE/2020/789124',
    isFavorite: true,
    isPinned: true,
    isArchived: false,
    isRecycled: false,
    verificationStatus: 'VERIFIED',
    verifiedBy: 'Dr. S. Ramanathan (HOD CSE)',
    verifiedAt: '2024-08-12T10:30:00Z',
    currentVersion: 1,
    privacyLevel: 'PUBLIC_VERIFICATION',
    userId: 'usr_student_01',
    createdAt: '2024-08-10T09:15:00Z',
    updatedAt: '2024-08-12T10:30:00Z',
    versions: [
      {
        id: 'ver-001',
        documentId: 'doc-001',
        versionNumber: 1,
        fileName: '10th_CBSE_Board_Marksheet.pdf',
        filePath: '/uploads/sample_10th_marksheet.pdf',
        fileSize: 1024 * 480,
        fileHash: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
        changeNotes: 'Initial original certificate scan (CBSE 2020)',
        uploadedAt: '2024-08-10T09:15:00Z'
      }
    ],
    shares: [
      {
        id: 'shr-001',
        documentId: 'doc-001',
        shareToken: 'sh_cbse10_99x8',
        expiresAt: '2026-12-31T23:59:59Z',
        allowDownload: true,
        isRevoked: false,
        viewsCount: 14,
        downloadsCount: 6,
        recipientNote: 'CBSE Record for Campus Placements',
        createdAt: '2024-08-15T11:00:00Z'
      }
    ],
    accessLogs: [
      {
        id: 'log-001',
        documentId: 'doc-001',
        action: 'VERIFY',
        performedBy: 'Dr. S. Ramanathan (HOD CSE)',
        ipAddress: '192.168.1.45',
        timestamp: '2024-08-12T10:30:00Z'
      },
      {
        id: 'log-002',
        documentId: 'doc-001',
        action: 'DOWNLOAD',
        performedBy: 'ABC Technologies Recruiter',
        ipAddress: '103.45.22.10',
        timestamp: '2026-08-20T14:22:00Z'
      }
    ]
  },
  {
    id: 'doc-002',
    docVerificationId: 'DOC-2026-CSE-000183',
    title: '12th Standard Higher Secondary Marksheet',
    originalName: '12th_StateBoard_Certificate.pdf',
    fileName: '12th_StateBoard_Certificate.pdf',
    filePath: '/uploads/sample_12th_marksheet.pdf',
    fileSize: 1024 * 512, // 512 KB
    mimeType: 'application/pdf',
    fileHash: 'a591a6d40bf420404a011733cfb7b190d62c65bf0bcda32b57b277d9ad9f146e',
    category: 'Academic',
    subCategory: '12th',
    tags: ['#12th', '#HSC', '#Marksheet', '#Placement'],
    issuer: 'Tamil Nadu State Board of School Examinations',
    issueDate: '2022-06-20',
    certNumber: 'TN/HSC/2022/994102',
    isFavorite: true,
    isPinned: true,
    isArchived: false,
    isRecycled: false,
    verificationStatus: 'VERIFIED',
    verifiedBy: 'Dr. S. Ramanathan (HOD CSE)',
    verifiedAt: '2024-08-12T10:32:00Z',
    currentVersion: 1,
    privacyLevel: 'PUBLIC_VERIFICATION',
    userId: 'usr_student_01',
    createdAt: '2024-08-10T09:18:00Z',
    updatedAt: '2024-08-12T10:32:00Z'
  },
  {
    id: 'doc-003',
    docVerificationId: 'DOC-2026-CSE-000184',
    title: 'Consolidated Semester 1-6 Marksheet',
    originalName: 'Consolidated_Grade_Sheet_Sem6.pdf',
    fileName: 'Consolidated_Grade_Sheet_Sem6.pdf',
    filePath: '/uploads/sample_sem_marksheet.pdf',
    fileSize: 1024 * 850,
    mimeType: 'application/pdf',
    fileHash: '5f4dbc8001e3557e4e164f9bf5fb0d7a6e76cf0a2d2105151ee68b5a0349ec72',
    category: 'Academic',
    subCategory: 'Semester Marksheets',
    tags: ['#Consolidated', '#Sem6', '#CGPA8.42', '#AnnaUniversity'],
    issuer: 'Controller of Examinations - Autonomous',
    issueDate: '2026-06-15',
    certNumber: 'COE/2026/CGPA/4042',
    isFavorite: true,
    isPinned: true,
    isArchived: false,
    isRecycled: false,
    verificationStatus: 'VERIFIED',
    verifiedBy: 'Prof. K. Meenakshi (Academic Advisor)',
    verifiedAt: '2026-06-20T14:15:00Z',
    currentVersion: 2,
    privacyLevel: 'COLLEGE_ONLY',
    userId: 'usr_student_01',
    createdAt: '2026-06-18T11:00:00Z',
    updatedAt: '2026-06-20T14:15:00Z',
    versions: [
      {
        id: 'ver-003-1',
        documentId: 'doc-003',
        versionNumber: 1,
        fileName: 'Sem_1_to_5_GradeSheet.pdf',
        filePath: '/uploads/sample_sem_marksheet_v1.pdf',
        fileSize: 1024 * 720,
        fileHash: '4b227777d4dd1fc61c6f884f48641d02b4d121d3fd328cb08b5531fcacdabf8a',
        changeNotes: 'Semester 1 to 5 provisional sheet',
        uploadedAt: '2026-01-10T08:00:00Z'
      },
      {
        id: 'ver-003-2',
        documentId: 'doc-003',
        versionNumber: 2,
        fileName: 'Consolidated_Grade_Sheet_Sem6.pdf',
        filePath: '/uploads/sample_sem_marksheet.pdf',
        fileSize: 1024 * 850,
        fileHash: '5f4dbc8001e3557e4e164f9bf5fb0d7a6e76cf0a2d2105151ee68b5a0349ec72',
        changeNotes: 'Updated with Semester 6 results and GPA recomputation',
        uploadedAt: '2026-06-18T11:00:00Z'
      }
    ]
  },
  {
    id: 'doc-004',
    docVerificationId: 'DOC-2026-CSE-000185',
    title: 'Full Stack Software Engineer Resume',
    originalName: 'Manikandan_V_Software_Engineer_Resume.pdf',
    fileName: 'Manikandan_V_Software_Engineer_Resume.pdf',
    filePath: '/uploads/sample_resume_v3.pdf',
    fileSize: 1024 * 290,
    mimeType: 'application/pdf',
    fileHash: '7c8651a24d45d8b87c71d2b8b9f1d0b439c2d76537750862089f2cf05d6ab1e2',
    category: 'Career',
    subCategory: 'Resume',
    tags: ['#Resume', '#Java', '#React', '#Spring', '#Placement2026'],
    issuer: 'Self / Placement Cell Approved',
    issueDate: '2026-08-01',
    certNumber: 'RESUME-2026-V3',
    isFavorite: true,
    isPinned: true,
    isArchived: false,
    isRecycled: false,
    verificationStatus: 'VERIFIED',
    verifiedBy: 'Dr. Anand Kumar (Placement Officer)',
    verifiedAt: '2026-08-05T16:00:00Z',
    currentVersion: 3,
    privacyLevel: 'PUBLIC_VERIFICATION',
    userId: 'usr_student_01',
    createdAt: '2026-08-01T09:00:00Z',
    updatedAt: '2026-08-05T16:00:00Z',
    versions: [
      {
        id: 'ver-004-1',
        documentId: 'doc-004',
        versionNumber: 1,
        fileName: 'Resume_General_v1.pdf',
        filePath: '/uploads/sample_resume_v1.pdf',
        fileSize: 1024 * 220,
        fileHash: '1111111111111111111111111111111111111111111111111111111111111111',
        changeNotes: 'Initial template (3rd year internship drive)',
        uploadedAt: '2025-07-10T10:00:00Z'
      },
      {
        id: 'ver-004-2',
        documentId: 'doc-004',
        versionNumber: 2,
        fileName: 'Resume_FullStack_v2.pdf',
        filePath: '/uploads/sample_resume_v2.pdf',
        fileSize: 1024 * 260,
        fileHash: '2222222222222222222222222222222222222222222222222222222222222222',
        changeNotes: 'Added SIH 2025 finalist project and AWS certification',
        uploadedAt: '2026-02-15T14:30:00Z'
      },
      {
        id: 'ver-004-3',
        documentId: 'doc-004',
        versionNumber: 3,
        fileName: 'Manikandan_V_Software_Engineer_Resume.pdf',
        filePath: '/uploads/sample_resume_v3.pdf',
        fileSize: 1024 * 290,
        fileHash: '7c8651a24d45d8b87c71d2b8b9f1d0b439c2d76537750862089f2cf05d6ab1e2',
        changeNotes: 'Refined placement edition with project URLs & metrics',
        uploadedAt: '2026-08-01T09:00:00Z'
      }
    ]
  },
  {
    id: 'doc-005',
    docVerificationId: 'DOC-2026-CSE-000186',
    title: 'AWS Certified Solutions Architect Associate Certificate',
    originalName: 'AWS_Solutions_Architect_Certificate.pdf',
    fileName: 'AWS_Solutions_Architect_Certificate.pdf',
    filePath: '/uploads/sample_aws_cert.pdf',
    fileSize: 1024 * 620,
    mimeType: 'application/pdf',
    fileHash: '8f14e45fceea167a5a36dedd4bea254329a47d5256d61dac94e03b2b4f87f0d4',
    category: 'Certificates',
    subCategory: 'Technical',
    tags: ['#AWS', '#Cloud', '#SolutionsArchitect', '#Certification'],
    issuer: 'Amazon Web Services Training & Certification',
    issueDate: '2025-09-10',
    expiryDate: '2028-09-10',
    certNumber: 'AWS-SAA-2025-99201',
    isFavorite: true,
    isPinned: false,
    isArchived: false,
    isRecycled: false,
    verificationStatus: 'VERIFIED',
    verifiedBy: 'Prof. K. Meenakshi (Academic Advisor)',
    verifiedAt: '2025-09-15T11:20:00Z',
    currentVersion: 1,
    privacyLevel: 'PUBLIC_VERIFICATION',
    userId: 'usr_student_01',
    createdAt: '2025-09-12T10:00:00Z',
    updatedAt: '2025-09-15T11:20:00Z'
  },
  {
    id: 'doc-006',
    docVerificationId: 'DOC-2026-CSE-000187',
    title: 'Summer Internship Completion Certificate – Zoho Corp',
    originalName: 'Zoho_Internship_Completion_Letter.pdf',
    fileName: 'Zoho_Internship_Completion_Letter.pdf',
    filePath: '/uploads/sample_internship_cert.pdf',
    fileSize: 1024 * 340,
    mimeType: 'application/pdf',
    fileHash: '9a31a9bb945d8b87c71d2b8b9f1d0b439c2d76537750862089f2cf05d6ab1e99',
    category: 'Internship',
    subCategory: 'Completion Certificate',
    tags: ['#Zoho', '#Internship', '#FullStack', '#Experience'],
    issuer: 'Zoho Corporation Pvt Ltd',
    issueDate: '2025-07-28',
    certNumber: 'ZOHO/HR/INT/2025/1102',
    isFavorite: false,
    isPinned: false,
    isArchived: false,
    isRecycled: false,
    verificationStatus: 'VERIFIED',
    verifiedBy: 'Dr. Anand Kumar (Placement Officer)',
    verifiedAt: '2025-08-01T15:00:00Z',
    currentVersion: 1,
    privacyLevel: 'COLLEGE_ONLY',
    userId: 'usr_student_01',
    createdAt: '2025-07-30T10:00:00Z',
    updatedAt: '2025-08-01T15:00:00Z'
  },
  {
    id: 'doc-007',
    docVerificationId: 'DOC-2026-CSE-000188',
    title: 'Smart India Hackathon 2025 – Finalist Certificate',
    originalName: 'SIH_2025_Finalist_Certificate.pdf',
    fileName: 'SIH_2025_Finalist_Certificate.pdf',
    filePath: '/uploads/sample_hackathon.pdf',
    fileSize: 1024 * 410,
    mimeType: 'application/pdf',
    fileHash: '3c8651a24d45d8b87c71d2b8b9f1d0b439c2d76537750862089f2cf05d6ab1aa',
    category: 'Certificates',
    subCategory: 'Hackathon',
    tags: ['#SIH2025', '#AICTE', '#MinistryOfEducation', '#1stPlace'],
    issuer: 'Ministry of Education Innovation Cell (MIC) & AICTE',
    issueDate: '2025-11-25',
    certNumber: 'SIH2025/GRAND/TN/044',
    isFavorite: false,
    isPinned: false,
    isArchived: false,
    isRecycled: false,
    verificationStatus: 'VERIFIED',
    currentVersion: 1,
    privacyLevel: 'PUBLIC_VERIFICATION',
    userId: 'usr_student_01',
    createdAt: '2026-08-22T14:10:00Z',
    updatedAt: '2026-08-22T14:10:00Z'
  },
  {
    id: 'doc-008',
    docVerificationId: 'DOC-2026-CSE-000189',
    title: 'National Cyber Security Workshop Certificate',
    originalName: 'Cyber_Security_Workshop_2025.pdf',
    fileName: 'Cyber_Security_Workshop_2025.pdf',
    filePath: '/uploads/sample_workshop.pdf',
    fileSize: 1024 * 310,
    mimeType: 'application/pdf',
    fileHash: '444444444445d8b87c71d2b8b9f1d0b439c2d76537750862089f2cf05d6ab1bb',
    category: 'Certificates',
    subCategory: 'Workshop',
    tags: ['#Workshop', '#CyberSecurity', '#EthicalHacking'],
    issuer: 'Center for Cyber Security Excellence',
    issueDate: '2025-03-12',
    certNumber: 'CCSE/WS/2025/904',
    isFavorite: false,
    isPinned: false,
    isArchived: false,
    isRecycled: false,
    verificationStatus: 'VERIFIED',
    currentVersion: 1,
    privacyLevel: 'PUBLIC_VERIFICATION',
    userId: 'usr_student_01',
    createdAt: '2025-03-15T12:00:00Z',
    updatedAt: '2025-03-20T09:40:00Z'
  }
];

export const INITIAL_PLACEMENT_DRIVES: PlacementDrive[] = [
  {
    id: 'drv-001',
    companyName: 'ABC Technologies',
    roleTitle: 'Associate Software Engineer (Core Product)',
    packageLpa: 14.5,
    location: 'Bangalore / Chennai (Hybrid)',
    minCgpa: 7.5,
    eligibleDepts: ['CSE', 'IT', 'ECE'],
    requiredDocTypes: ['Resume', '10th Marksheet', '12th Marksheet', 'Consolidated Semester 1-6 Marksheet', 'Summer Internship Completion Certificate – Zoho Corp'],
    deadline: '2026-08-30T23:59:59Z',
    status: 'ACTIVE',
    description: 'We are seeking passionate full-stack engineers with strong foundations in Data Structures, Algorithms, Spring Boot / Node, and modern frontend frameworks.',
    appliedCount: 142
  },
  {
    id: 'drv-002',
    companyName: 'Zoho Corporation',
    roleTitle: 'Member Technical Staff (MTS)',
    packageLpa: 12.0,
    location: 'Chennai / Tenkasi',
    minCgpa: 7.0,
    eligibleDepts: ['CSE', 'IT', 'ECE', 'MECH', 'CIVIL', 'EEE'],
    requiredDocTypes: ['Resume', '10th Marksheet', '12th Marksheet', 'Consolidated Semester 1-6 Marksheet'],
    deadline: '2026-09-05T23:59:59Z',
    status: 'ACTIVE',
    description: 'Direct campus hiring drive for core engineering product teams. Candidates will undergo coding challenges, system design, and technical interviews.',
    appliedCount: 285
  },
  {
    id: 'drv-003',
    companyName: 'Google Cloud India',
    roleTitle: 'Cloud Solutions Architect Apprentice',
    packageLpa: 22.0,
    location: 'Hyderabad / Bangalore',
    minCgpa: 8.0,
    eligibleDepts: ['CSE', 'IT'],
    requiredDocTypes: ['Resume', 'AWS Certified Solutions Architect Associate Certificate', 'Consolidated Semester 1-6 Marksheet'],
    deadline: '2026-09-15T23:59:59Z',
    status: 'ACTIVE',
    description: 'Google Cloud enterprise engineering team is looking for exceptional cloud practitioners with hands-on architecture experience.',
    appliedCount: 88
  }
];

export const INITIAL_APPLICATIONS: PlacementApplication[] = [
  {
    id: 'app-001',
    driveId: 'drv-001',
    studentId: '2026CSE042',
    studentName: 'Manikandan V',
    studentDept: 'CSE',
    studentCgpa: 8.42,
    attachedDocIds: ['doc-004', 'doc-001', 'doc-002', 'doc-003', 'doc-006'],
    status: 'SHORTLISTED',
    appliedAt: '2026-08-24T10:15:00Z'
  }
];

export const INITIAL_RECRUITER_REQUESTS: RecruiterRequest[] = [
  {
    id: 'req-001',
    recruiterName: 'Siddharth Roy',
    companyName: 'ABC Technologies HR Campus Team',
    studentId: '2026CSE042',
    studentName: 'Manikandan V',
    requestedDocTypes: ['Summer Internship Completion Certificate – Zoho Corp', 'AWS Certified Solutions Architect Associate Certificate'],
    deadline: '2026-08-29T18:00:00Z',
    reason: 'Required for Level 2 Technical Panel Clearance before interview scheduling.',
    status: 'PENDING',
    createdAt: '2026-08-25T11:00:00Z'
  }
];

export const INITIAL_SEMESTERS: AcademicSemester[] = [
  {
    semesterNumber: 1,
    sgpa: 8.12,
    credits: 22,
    subjects: [
      { code: 'MA3151', name: 'Matrices and Calculus', grade: 'A+', credits: 4 },
      { code: 'PH3151', name: 'Engineering Physics', grade: 'A', credits: 3 },
      { code: 'CY3151', name: 'Engineering Chemistry', grade: 'A', credits: 3 },
      { code: 'GE3151', name: 'Problem Solving and Python Programming', grade: 'O', credits: 3 },
      { code: 'GE3171', name: 'Python Programming Lab', grade: 'O', credits: 2 }
    ]
  },
  {
    semesterNumber: 2,
    sgpa: 8.35,
    credits: 24,
    subjects: [
      { code: 'MA3251', name: 'Statistics and Numerical Methods', grade: 'A+', credits: 4 },
      { code: 'CS3251', name: 'Programming in C', grade: 'O', credits: 3 },
      { code: 'CS3271', name: 'C Programming Laboratory', grade: 'O', credits: 2 },
      { code: 'EE3251', name: 'Basic Electrical and Electronics', grade: 'A', credits: 3 }
    ]
  },
  {
    semesterNumber: 3,
    sgpa: 8.45,
    credits: 23,
    subjects: [
      { code: 'CS3351', name: 'Digital Principles and Computer Organization', grade: 'A+', credits: 4 },
      { code: 'CS3352', name: 'Foundations of Data Science', grade: 'O', credits: 3 },
      { code: 'CS3301', name: 'Data Structures and Algorithms', grade: 'O', credits: 3 },
      { code: 'CS3311', name: 'Data Structures Laboratory', grade: 'O', credits: 2 }
    ]
  },
  {
    semesterNumber: 4,
    sgpa: 8.52,
    credits: 24,
    subjects: [
      { code: 'CS3452', name: 'Theory of Computation', grade: 'A', credits: 3 },
      { code: 'CS3491', name: 'Artificial Intelligence and Machine Learning', grade: 'O', credits: 4 },
      { code: 'CS3492', name: 'Database Management Systems', grade: 'O', credits: 3 },
      { code: 'CS3481', name: 'Database Management Systems Lab', grade: 'O', credits: 2 }
    ]
  },
  {
    semesterNumber: 5,
    sgpa: 8.60,
    credits: 22,
    subjects: [
      { code: 'CS3591', name: 'Computer Networks', grade: 'O', credits: 4 },
      { code: 'CS3551', name: 'Full Stack Web Development', grade: 'O', credits: 4 },
      { code: 'CS3511', name: 'Web Technology Laboratory', grade: 'O', credits: 2 },
      { code: 'CS3501', name: 'Compiler Design', grade: 'A+', credits: 4 }
    ]
  },
  {
    semesterNumber: 6,
    sgpa: 8.48,
    credits: 23,
    subjects: [
      { code: 'CS3691', name: 'Embedded Systems and IoT', grade: 'A+', credits: 4 },
      { code: 'CS3601', name: 'Distributed Systems & Cloud Computing', grade: 'O', credits: 4 },
      { code: 'CS3611', name: 'Mobile App Development Lab', grade: 'O', credits: 2 },
      { code: 'CS3681', name: 'Mini Project and Design Work', grade: 'O', credits: 3 }
    ]
  }
];

export const INITIAL_SESSIONS: UserSession[] = [
  {
    id: 'ses-001',
    device: 'Dell XPS 15 – Windows 11',
    browser: 'Chrome 128.0 (Desktop)',
    ipAddress: '192.168.1.104 (Chennai, India)',
    lastActive: 'Just now',
    isCurrent: true
  },
  {
    id: 'ses-002',
    device: 'Google Pixel 8 Pro – Android 15',
    browser: 'Chrome Mobile 128.0',
    ipAddress: '103.22.45.18 (Chennai, India)',
    lastActive: '22 minutes ago',
    isCurrent: false
  },
  {
    id: 'ses-003',
    device: 'College Library Lab PC-14 – Ubuntu 24.04',
    browser: 'Firefox 129.0',
    ipAddress: '172.16.10.42 (Campus Network)',
    lastActive: '2 days ago',
    isCurrent: false
  }
];

export const INITIAL_AUDIT_LOGS: AuditLog[] = [
  {
    id: 'aud-001',
    action: 'Document Verified',
    category: 'VERIFICATION',
    details: 'Dr. S. Ramanathan approved document DOC-2026-CSE-000182 (10th CBSE Marksheet).',
    userEmail: 'hod.cse@college.edu',
    ipAddress: '192.168.1.45',
    timestamp: '2026-08-20T10:30:00Z'
  },
  {
    id: 'aud-002',
    action: 'Placement Application Submitted',
    category: 'PLACEMENT',
    details: 'Manikandan V attached 5 verified documents to ABC Technologies application.',
    userEmail: 'manikandan.v@college.edu',
    ipAddress: '192.168.1.104',
    timestamp: '2026-08-24T10:15:00Z'
  },
  {
    id: 'aud-003',
    action: 'Recruiter Document Request',
    category: 'DOCUMENT',
    details: 'ABC Technologies HR requested 2 certified proofs with deadline 29 Aug 2026.',
    userEmail: 'siddharth@abctech.com',
    ipAddress: '103.45.22.10',
    timestamp: '2026-08-25T11:00:00Z'
  },
  {
    id: 'aud-004',
    action: 'Document Version 3 Uploaded',
    category: 'DOCUMENT',
    details: 'Uploaded updated resume version with SIH 2025 and AWS certifications.',
    userEmail: 'manikandan.v@college.edu',
    ipAddress: '192.168.1.104',
    timestamp: '2026-08-01T09:00:00Z'
  },
  {
    id: 'aud-005',
    action: 'Two-Factor Authentication Verified',
    category: 'SECURITY',
    details: 'Successful TOTP verification for session from Chrome Windows.',
    userEmail: 'manikandan.v@college.edu',
    ipAddress: '192.168.1.104',
    timestamp: '2026-08-26T08:12:00Z'
  }
];

export const INITIAL_NOTIFICATIONS: AppNotification[] = [
  {
    id: 'notif-001',
    userId: 'usr_student_01',
    title: 'Document Approved by Faculty',
    message: 'Dr. Anand Kumar approved your "Summer Internship Completion Certificate – Zoho Corp".',
    type: 'VERIFICATION',
    isRead: false,
    link: 'verification',
    createdAt: '10 minutes ago'
  },
  {
    id: 'notif-002',
    userId: 'usr_student_01',
    title: 'New Recruiter Document Request',
    message: 'ABC Technologies HR requested 2 certificates for technical panel review.',
    type: 'PLACEMENT',
    isRead: false,
    link: 'recruiter-requests',
    createdAt: '1 hour ago'
  },
  {
    id: 'notif-003',
    userId: 'usr_student_01',
    title: 'Placement Drive Shortlist',
    message: 'Congratulations! Your application for ABC Technologies has been shortlisted.',
    type: 'PLACEMENT',
    isRead: true,
    link: 'placement',
    createdAt: 'Yesterday'
  },
  {
    id: 'notif-004',
    userId: 'usr_student_01',
    title: 'Document Verification Feedback',
    message: 'Action required on "National Cyber Security Workshop Certificate" - scan was unclear.',
    type: 'REJECTION',
    isRead: true,
    link: 'verification',
    createdAt: '3 days ago'
  }
];

export const INITIAL_SYSTEM_HEALTH: SystemHealthStatus = {
  database: 'HEALTHY',
  storage: 'HEALTHY',
  authService: 'HEALTHY',
  notifications: 'HEALTHY',
  backups: 'HEALTHY',
  uptimeSeconds: 849200,
  activeSessionsCount: 48,
  totalDocuments: 6240,
  verifiedDocuments: 5810
};
