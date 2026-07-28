import { prisma } from '../config/db';
import { VerificationStatus } from '@prisma/client';

// ─── DASHBOARD STATS ───────────────────────────────────────────────────────────

export const getDashboardStats = async () => {
  const [
    totalStudents,
    totalCompanies,
    totalJobs,
    totalApplications,
    pendingStudents,
    pendingCompanies,
  ] = await Promise.all([
    prisma.user.count({ where: { role: 'STUDENT' } }),
    prisma.user.count({ where: { role: 'COMPANY' } }),
    prisma.jobPosting.count({ where: { isActive: true } }),
    prisma.application.count(),
    prisma.studentProfile.count({ where: { verificationStatus: 'PENDING' } }),
    prisma.companyProfile.count({ where: { verificationStatus: 'PENDING' } }),
  ]);

  return {
    totalStudents,
    totalCompanies,
    totalJobs,
    totalApplications,
    pendingVerifications: pendingStudents + pendingCompanies,
    pendingStudents,
    pendingCompanies,
  };
};

// ─── STUDENT MANAGEMENT ────────────────────────────────────────────────────────

export const getAllStudents = async () => {
  const students = await prisma.user.findMany({
    where: { role: 'STUDENT' },
    include: { studentProfile: true },
    orderBy: { createdAt: 'desc' },
  });
  return students;
};

export const verifyStudent = async (userId: string, status: VerificationStatus) => {
  const profile = await prisma.studentProfile.update({
    where: { userId },
    data: {
      verificationStatus: status,
      verifiedAt: status === 'VERIFIED' ? new Date() : null,
    },
  });
  return profile;
};

// ─── COMPANY MANAGEMENT ────────────────────────────────────────────────────────

export const getAllCompanies = async () => {
  const companies = await prisma.user.findMany({
    where: { role: 'COMPANY' },
    include: { companyProfile: true },
    orderBy: { createdAt: 'desc' },
  });
  return companies;
};

export const verifyCompany = async (userId: string, status: VerificationStatus) => {
  const profile = await prisma.companyProfile.update({
    where: { userId },
    data: {
      verificationStatus: status,
      verifiedAt: status === 'VERIFIED' ? new Date() : null,
    },
  });
  return profile;
};

// ─── USER ACCOUNT MANAGEMENT ──────────────────────────────────────────────────

export const toggleUserActive = async (userId: string, isActive: boolean) => {
  const user = await prisma.user.update({
    where: { id: userId },
    data: { isActive },
    include: {
      studentProfile: true,
      companyProfile: true,
    },
  });
  return user;
};

// ─── CONTENT MANAGEMENT ────────────────────────────────────────────────────────

export const getAllJobs = async () => {
  const jobs = await prisma.jobPosting.findMany({
    orderBy: { createdAt: 'desc' },
    include: {
      company: {
        include: { companyProfile: true },
      },
      _count: {
        select: { applications: true },
      },
    },
  });
  return jobs;
};

export const toggleJobActive = async (jobId: string, isActive: boolean) => {
  const job = await prisma.jobPosting.update({
    where: { id: jobId },
    data: { isActive },
  });
  return job;
};

export const getAllApplications = async () => {
  const applications = await prisma.application.findMany({
    orderBy: { appliedAt: 'desc' },
    include: {
      student: {
        include: { studentProfile: true },
      },
      jobPosting: {
        include: {
          company: {
            include: { companyProfile: true },
          },
        },
      },
    },
  });
  return applications;
};