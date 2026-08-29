import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding Student Document Vault database...');

  // 1. Clean existing records
  await prisma.documentAccessLog.deleteMany();
  await prisma.documentShare.deleteMany();
  await prisma.documentVersion.deleteMany();
  await prisma.placementApplication.deleteMany();
  await prisma.placementDrive.deleteMany();
  await prisma.recruiterRequest.deleteMany();
  await prisma.academicSemester.deleteMany();
  await prisma.userSession.deleteMany();
  await prisma.auditLog.deleteMany();
  await prisma.notification.deleteMany();
  await prisma.document.deleteMany();
  await prisma.studentProfile.deleteMany();
  await prisma.user.deleteMany();

  const hashedPassword = await bcrypt.hash('Password@123', 10);

  // 2. Create Users for all 6 Roles
  const studentUser = await prisma.user.create({
    data: {
      email: 'manikandan.v@college.edu',
      password: hashedPassword,
      name: 'Manikandan V',
      role: 'STUDENT',
      department: 'Computer Science and Engineering',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    }
  });

  const facultyUser = await prisma.user.create({
    data: {
      email: 'hod.cse@college.edu',
      password: hashedPassword,
      name: 'Dr. S. Ramanathan',
      role: 'FACULTY',
      department: 'Computer Science and Engineering',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    }
  });

  const placementUser = await prisma.user.create({
    data: {
      email: 'placement@college.edu',
      password: hashedPassword,
      name: 'Dr. Anand Kumar',
      role: 'PLACEMENT_OFFICER',
      department: 'Placement & Training Cell',
    }
  });

  const recruiterUser = await prisma.user.create({
    data: {
      email: 'siddharth@abctech.com',
      password: hashedPassword,
      name: 'Siddharth Roy',
      role: 'RECRUITER',
      department: 'ABC Technologies Talent Acquisition',
    }
  });

  const adminUser = await prisma.user.create({
    data: {
      email: 'admin@college.edu',
      password: hashedPassword,
      name: 'Super Administrator',
      role: 'SUPER_ADMIN',
      department: 'System Operations',
    }
  });

  // 3. Create Student Profile
  await prisma.studentProfile.create({
    data: {
      userId: studentUser.id,
      studentId: '2026CSE042',
      regNo: '710022104042',
      department: 'Computer Science and Engineering',
      batch: '2022 - 2026',
      year: 4,
      cgpa: 8.42,
      phone: '+91 98765 43210',
      skills: JSON.stringify(['Java', 'Spring Boot', 'React', 'TypeScript', 'PostgreSQL', 'Docker', 'REST APIs', 'Tailwind CSS']),
      projects: JSON.stringify([
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
      ]),
      achievements: JSON.stringify([
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
      ]),
      completionPercent: 96,
      emergencyContact: JSON.stringify({
        name: 'Venkatesan R (Father)',
        relation: 'Parent / Guardian',
        phone: '+91 98765 99887',
        allowedDocCategories: ['Academic', 'Certificates']
      })
    }
  });

  // 4. Seed Documents
  const doc1 = await prisma.document.create({
    data: {
      id: 'doc-001',
      docVerificationId: 'DOC-2026-CSE-000182',
      title: '10th Standard Secondary Marksheet',
      originalName: '10th_CBSE_Board_Marksheet.pdf',
      fileName: '10th_CBSE_Board_Marksheet.pdf',
      filePath: '/uploads/sample_10th_marksheet.pdf',
      fileSize: 491520,
      mimeType: 'application/pdf',
      fileHash: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
      category: 'Academic',
      subCategory: '10th',
      tags: JSON.stringify(['#10th', '#BoardExam', '#Academic', '#Verified']),
      issuer: 'Central Board of Secondary Education (CBSE)',
      issueDate: '2020-05-15',
      certNumber: 'CBSE/2020/789124',
      isFavorite: true,
      isPinned: true,
      verificationStatus: 'VERIFIED',
      verifiedBy: 'Dr. S. Ramanathan (HOD CSE)',
      verifiedAt: new Date('2024-08-12T10:30:00Z'),
      currentVersion: 1,
      privacyLevel: 'PUBLIC_VERIFICATION',
      userId: studentUser.id
    }
  });

  await prisma.documentVersion.create({
    data: {
      documentId: doc1.id,
      versionNumber: 1,
      fileName: '10th_CBSE_Board_Marksheet.pdf',
      filePath: '/uploads/sample_10th_marksheet.pdf',
      fileSize: 491520,
      fileHash: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
      changeNotes: 'Initial original certificate scan (CBSE 2020)'
    }
  });

  await prisma.documentShare.create({
    data: {
      documentId: doc1.id,
      shareToken: 'sh_cbse10_99x8',
      expiresAt: new Date('2026-12-31T23:59:59Z'),
      allowDownload: true,
      isRevoked: false,
      viewsCount: 14,
      downloadsCount: 6,
      recipientNote: 'Verified CBSE Record for Campus Placements'
    }
  });

  const doc2 = await prisma.document.create({
    data: {
      id: 'doc-002',
      docVerificationId: 'DOC-2026-CSE-000183',
      title: '12th Standard Higher Secondary Marksheet',
      originalName: '12th_StateBoard_Certificate.pdf',
      fileName: '12th_StateBoard_Certificate.pdf',
      filePath: '/uploads/sample_12th_marksheet.pdf',
      fileSize: 524288,
      mimeType: 'application/pdf',
      fileHash: 'a591a6d40bf420404a011733cfb7b190d62c65bf0bcda32b57b277d9ad9f146e',
      category: 'Academic',
      subCategory: '12th',
      tags: JSON.stringify(['#12th', '#HSC', '#Marksheet', '#Placement']),
      issuer: 'Tamil Nadu State Board of School Examinations',
      issueDate: '2022-06-20',
      certNumber: 'TN/HSC/2022/994102',
      isFavorite: true,
      isPinned: true,
      verificationStatus: 'VERIFIED',
      verifiedBy: 'Dr. S. Ramanathan (HOD CSE)',
      verifiedAt: new Date('2024-08-12T10:32:00Z'),
      currentVersion: 1,
      privacyLevel: 'PUBLIC_VERIFICATION',
      userId: studentUser.id
    }
  });

  const doc3 = await prisma.document.create({
    data: {
      id: 'doc-003',
      docVerificationId: 'DOC-2026-CSE-000184',
      title: 'Consolidated Semester 1-6 Marksheet',
      originalName: 'Consolidated_Grade_Sheet_Sem6.pdf',
      fileName: 'Consolidated_Grade_Sheet_Sem6.pdf',
      filePath: '/uploads/sample_sem_marksheet.pdf',
      fileSize: 870400,
      mimeType: 'application/pdf',
      fileHash: '5f4dbc8001e3557e4e164f9bf5fb0d7a6e76cf0a2d2105151ee68b5a0349ec72',
      category: 'Academic',
      subCategory: 'Semester Marksheets',
      tags: JSON.stringify(['#Consolidated', '#Sem6', '#CGPA8.42', '#AnnaUniversity']),
      issuer: 'Controller of Examinations - Autonomous',
      issueDate: '2026-06-15',
      certNumber: 'COE/2026/CGPA/4042',
      isFavorite: true,
      isPinned: true,
      verificationStatus: 'VERIFIED',
      verifiedBy: 'Prof. K. Meenakshi (Academic Advisor)',
      verifiedAt: new Date('2026-06-20T14:15:00Z'),
      currentVersion: 2,
      privacyLevel: 'COLLEGE_ONLY',
      userId: studentUser.id
    }
  });

  const doc4 = await prisma.document.create({
    data: {
      id: 'doc-004',
      docVerificationId: 'DOC-2026-CSE-000185',
      title: 'Full Stack Software Engineer Resume',
      originalName: 'Manikandan_V_Software_Engineer_Resume.pdf',
      fileName: 'Manikandan_V_Software_Engineer_Resume.pdf',
      filePath: '/uploads/sample_resume_v3.pdf',
      fileSize: 296960,
      mimeType: 'application/pdf',
      fileHash: '7c8651a24d45d8b87c71d2b8b9f1d0b439c2d76537750862089f2cf05d6ab1e2',
      category: 'Career',
      subCategory: 'Resume',
      tags: JSON.stringify(['#Resume', '#Java', '#React', '#Spring', '#Placement2026']),
      issuer: 'Self / Placement Cell Approved',
      issueDate: '2026-08-01',
      certNumber: 'RESUME-2026-V3',
      isFavorite: true,
      isPinned: true,
      verificationStatus: 'VERIFIED',
      verifiedBy: 'Dr. Anand Kumar (Placement Officer)',
      verifiedAt: new Date('2026-08-05T16:00:00Z'),
      currentVersion: 3,
      privacyLevel: 'PUBLIC_VERIFICATION',
      userId: studentUser.id
    }
  });

  const doc5 = await prisma.document.create({
    data: {
      id: 'doc-005',
      docVerificationId: 'DOC-2026-CSE-000186',
      title: 'AWS Certified Solutions Architect Associate Certificate',
      originalName: 'AWS_Solutions_Architect_Certificate.pdf',
      fileName: 'AWS_Solutions_Architect_Certificate.pdf',
      filePath: '/uploads/sample_aws_cert.pdf',
      fileSize: 634880,
      mimeType: 'application/pdf',
      fileHash: '8f14e45fceea167a5a36dedd4bea254329a47d5256d61dac94e03b2b4f87f0d4',
      category: 'Certificates',
      subCategory: 'Technical',
      tags: JSON.stringify(['#AWS', '#Cloud', '#SolutionsArchitect', '#Certification']),
      issuer: 'Amazon Web Services Training & Certification',
      issueDate: '2025-09-10',
      expiryDate: '2028-09-10',
      certNumber: 'AWS-SAA-2025-99201',
      isFavorite: true,
      isPinned: false,
      verificationStatus: 'VERIFIED',
      verifiedBy: 'Prof. K. Meenakshi (Academic Advisor)',
      verifiedAt: new Date('2025-09-15T11:20:00Z'),
      currentVersion: 1,
      privacyLevel: 'PUBLIC_VERIFICATION',
      userId: studentUser.id
    }
  });

  const doc6 = await prisma.document.create({
    data: {
      id: 'doc-006',
      docVerificationId: 'DOC-2026-CSE-000187',
      title: 'Summer Internship Completion Certificate – Zoho Corp',
      originalName: 'Zoho_Internship_Completion_Letter.pdf',
      fileName: 'Zoho_Internship_Completion_Letter.pdf',
      filePath: '/uploads/sample_internship_cert.pdf',
      fileSize: 348160,
      mimeType: 'application/pdf',
      fileHash: '9a31a9bb945d8b87c71d2b8b9f1d0b439c2d76537750862089f2cf05d6ab1e99',
      category: 'Internship',
      subCategory: 'Completion Certificate',
      tags: JSON.stringify(['#Zoho', '#Internship', '#FullStack', '#Experience']),
      issuer: 'Zoho Corporation Pvt Ltd',
      issueDate: '2025-07-28',
      certNumber: 'ZOHO/HR/INT/2025/1102',
      isFavorite: false,
      isPinned: false,
      verificationStatus: 'VERIFIED',
      verifiedBy: 'Dr. Anand Kumar (Placement Officer)',
      verifiedAt: new Date('2025-08-01T15:00:00Z'),
      currentVersion: 1,
      privacyLevel: 'COLLEGE_ONLY',
      userId: studentUser.id
    }
  });

  const doc7 = await prisma.document.create({
    data: {
      id: 'doc-007',
      docVerificationId: 'DOC-2026-CSE-000188',
      title: 'Smart India Hackathon 2025 – Finalist Certificate',
      originalName: 'SIH_2025_Finalist_Certificate.pdf',
      fileName: 'SIH_2025_Finalist_Certificate.pdf',
      filePath: '/uploads/sample_hackathon.pdf',
      fileSize: 419840,
      mimeType: 'application/pdf',
      fileHash: '3c8651a24d45d8b87c71d2b8b9f1d0b439c2d76537750862089f2cf05d6ab1aa',
      category: 'Certificates',
      subCategory: 'Hackathon',
      tags: JSON.stringify(['#SIH2025', '#AICTE', '#MinistryOfEducation', '#1stPlace']),
      issuer: 'Ministry of Education Innovation Cell (MIC) & AICTE',
      issueDate: '2025-11-25',
      certNumber: 'SIH2025/GRAND/TN/044',
      isFavorite: false,
      isPinned: false,
      verificationStatus: 'PENDING',
      currentVersion: 1,
      privacyLevel: 'PUBLIC_VERIFICATION',
      userId: studentUser.id
    }
  });

  const doc8 = await prisma.document.create({
    data: {
      id: 'doc-008',
      docVerificationId: 'DOC-2026-CSE-000189',
      title: 'National Cyber Security Workshop Certificate',
      originalName: 'Cyber_Security_Workshop_2025.pdf',
      fileName: 'Cyber_Security_Workshop_2025.pdf',
      filePath: '/uploads/sample_workshop.pdf',
      fileSize: 317440,
      mimeType: 'application/pdf',
      fileHash: '444444444445d8b87c71d2b8b9f1d0b439c2d76537750862089f2cf05d6ab1bb',
      category: 'Certificates',
      subCategory: 'Workshop',
      tags: JSON.stringify(['#Workshop', '#CyberSecurity', '#EthicalHacking']),
      issuer: 'Center for Cyber Security Excellence',
      issueDate: '2025-03-12',
      certNumber: 'CCSE/WS/2025/904',
      isFavorite: false,
      isPinned: false,
      verificationStatus: 'REJECTED',
      rejectionReason: 'The uploaded image scan is skewed and the certificate seal is cut off at the bottom corner. Please upload a clear flat PDF scan.',
      verifiedBy: 'Prof. K. Meenakshi (Academic Advisor)',
      verifiedAt: new Date('2025-03-20T09:40:00Z'),
      currentVersion: 1,
      privacyLevel: 'PRIVATE',
      userId: studentUser.id
    }
  });

  // 5. Seed Placement Drives
  const drive1 = await prisma.placementDrive.create({
    data: {
      id: 'drv-001',
      companyName: 'ABC Technologies',
      roleTitle: 'Associate Software Engineer (Core Product)',
      packageLpa: 14.5,
      location: 'Bangalore / Chennai (Hybrid)',
      minCgpa: 7.5,
      eligibleDepts: JSON.stringify(['CSE', 'IT', 'ECE']),
      requiredDocTypes: JSON.stringify(['Resume', '10th Marksheet', '12th Marksheet', 'Consolidated Semester 1-6 Marksheet', 'Summer Internship Completion Certificate – Zoho Corp']),
      deadline: new Date('2026-08-30T23:59:59Z'),
      status: 'ACTIVE',
      description: 'We are seeking passionate full-stack engineers with strong foundations in Data Structures, Algorithms, Spring Boot / Node, and modern frontend frameworks.'
    }
  });

  const drive2 = await prisma.placementDrive.create({
    data: {
      id: 'drv-002',
      companyName: 'Zoho Corporation',
      roleTitle: 'Member Technical Staff (MTS)',
      packageLpa: 12.0,
      location: 'Chennai / Tenkasi',
      minCgpa: 7.0,
      eligibleDepts: JSON.stringify(['CSE', 'IT', 'ECE', 'MECH', 'CIVIL', 'EEE']),
      requiredDocTypes: JSON.stringify(['Resume', '10th Marksheet', '12th Marksheet', 'Consolidated Semester 1-6 Marksheet']),
      deadline: new Date('2026-09-05T23:59:59Z'),
      status: 'ACTIVE',
      description: 'Direct campus hiring drive for core engineering product teams. Candidates will undergo coding challenges, system design, and technical interviews.'
    }
  });

  const drive3 = await prisma.placementDrive.create({
    data: {
      id: 'drv-003',
      companyName: 'Google Cloud India',
      roleTitle: 'Cloud Solutions Architect Apprentice',
      packageLpa: 22.0,
      location: 'Hyderabad / Bangalore',
      minCgpa: 8.0,
      eligibleDepts: JSON.stringify(['CSE', 'IT']),
      requiredDocTypes: JSON.stringify(['Resume', 'AWS Certified Solutions Architect Associate Certificate', 'Consolidated Semester 1-6 Marksheet']),
      deadline: new Date('2026-09-15T23:59:59Z'),
      status: 'ACTIVE',
      description: 'Google Cloud enterprise engineering team is looking for exceptional cloud practitioners with hands-on architecture experience.'
    }
  });

  // 6. Placement Application
  await prisma.placementApplication.create({
    data: {
      id: 'app-001',
      driveId: drive1.id,
      studentId: '2026CSE042',
      studentName: 'Manikandan V',
      studentDept: 'CSE',
      studentCgpa: 8.42,
      attachedDocIds: JSON.stringify(['doc-004', 'doc-001', 'doc-002', 'doc-003', 'doc-006']),
      status: 'SHORTLISTED',
      appliedAt: new Date('2026-08-24T10:15:00Z')
    }
  });

  // 7. Recruiter Request
  await prisma.recruiterRequest.create({
    data: {
      id: 'req-001',
      recruiterName: 'Siddharth Roy',
      companyName: 'ABC Technologies HR Campus Team',
      studentId: '2026CSE042',
      studentName: 'Manikandan V',
      requestedDocTypes: JSON.stringify(['Summer Internship Completion Certificate – Zoho Corp', 'AWS Certified Solutions Architect Associate Certificate']),
      deadline: new Date('2026-08-29T18:00:00Z'),
      reason: 'Required for Level 2 Technical Panel Clearance before interview scheduling.',
      status: 'PENDING'
    }
  });

  // 8. Academic Semesters
  const semesterData = [
    {
      sem: 1,
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
      sem: 2,
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
      sem: 3,
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
      sem: 4,
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
      sem: 5,
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
      sem: 6,
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

  for (const s of semesterData) {
    await prisma.academicSemester.create({
      data: {
        studentId: '2026CSE042',
        semesterNumber: s.sem,
        sgpa: s.sgpa,
        credits: s.credits,
        subjects: JSON.stringify(s.subjects)
      }
    });
  }

  // 9. User Sessions
  await prisma.userSession.createMany({
    data: [
      {
        userId: studentUser.id,
        device: 'Dell XPS 15 – Windows 11',
        browser: 'Chrome 128.0 (Desktop)',
        ipAddress: '192.168.1.104 (Chennai, India)',
        isCurrent: true
      },
      {
        userId: studentUser.id,
        device: 'Google Pixel 8 Pro – Android 15',
        browser: 'Chrome Mobile 128.0',
        ipAddress: '103.22.45.18 (Chennai, India)',
        isCurrent: false
      },
      {
        userId: studentUser.id,
        device: 'College Library Lab PC-14 – Ubuntu 24.04',
        browser: 'Firefox 129.0',
        ipAddress: '172.16.10.42 (Campus Network)',
        isCurrent: false
      }
    ]
  });

  // 10. Audit Logs
  await prisma.auditLog.createMany({
    data: [
      {
        action: 'Document Verified',
        category: 'VERIFICATION',
        details: 'Dr. S. Ramanathan approved document DOC-2026-CSE-000182 (10th CBSE Marksheet).',
        userEmail: 'hod.cse@college.edu',
        ipAddress: '192.168.1.45'
      },
      {
        action: 'Placement Application Submitted',
        category: 'PLACEMENT',
        details: 'Manikandan V attached 5 verified documents to ABC Technologies application.',
        userEmail: 'manikandan.v@college.edu',
        ipAddress: '192.168.1.104'
      },
      {
        action: 'Recruiter Document Request',
        category: 'DOCUMENT',
        details: 'ABC Technologies HR requested 2 certified proofs with deadline 29 Aug 2026.',
        userEmail: 'siddharth@abctech.com',
        ipAddress: '103.45.22.10'
      }
    ]
  });

  // 11. Notifications
  await prisma.notification.createMany({
    data: [
      {
        userId: studentUser.id,
        title: 'Document Approved by Faculty',
        message: 'Dr. Anand Kumar approved your "Summer Internship Completion Certificate – Zoho Corp".',
        type: 'VERIFICATION',
        isRead: false,
        link: 'verification'
      },
      {
        userId: studentUser.id,
        title: 'New Recruiter Document Request',
        message: 'ABC Technologies HR requested 2 certificates for technical panel review.',
        type: 'PLACEMENT',
        isRead: false,
        link: 'recruiter-requests'
      }
    ]
  });

  console.log('Database successfully seeded with realistic SDV records!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
