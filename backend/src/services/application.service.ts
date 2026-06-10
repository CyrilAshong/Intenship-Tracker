import { prisma } from '../config/db';

interface CreateApplicationInput {
  studentId: string;
  jobPostingId: string;
  coverNote?: string;
}

export const createApplication = async (input: CreateApplicationInput) => {
  // Check if job exists and is active
  const job = await prisma.jobPosting.findUnique({
    where: { id: input.jobPostingId },
  });

  if (!job) throw new Error('Job posting not found.');
  if (!job.isActive) throw new Error('This job posting is no longer active.');

  // Check if student already applied
  const existing = await prisma.application.findUnique({
    where: {
      studentId_jobPostingId: {
        studentId: input.studentId,
        jobPostingId: input.jobPostingId,
      },
    },
  });

  if (existing) throw new Error('You have already applied for this job.');

  const application = await prisma.application.create({
    data: {
      studentId: input.studentId,
      jobPostingId: input.jobPostingId,
      coverNote: input.coverNote,
      status: 'PENDING',
    },
    include: {
      jobPosting: {
        include: {
          company: {
            include: {
              companyProfile: true,
            },
          },
        },
      },
    },
  });

  return application;
};

export const getStudentApplications = async (studentId: string) => {
  const applications = await prisma.application.findMany({
    where: { studentId },
    include: {
      jobPosting: {
        include: {
          company: {
            include: {
              companyProfile: true,
            },
          },
        },
      },
      documents: true,
    },
    orderBy: { appliedAt: 'desc' },
  });

  return applications;
};

export const getApplicationById = async (applicationId: string) => {
  const application = await prisma.application.findUnique({
    where: { id: applicationId },
    include: {
      jobPosting: {
        include: {
          company: {
            include: {
              companyProfile: true,
            },
          },
        },
      },
      documents: true,
    },
  });

  if (!application) throw new Error('Application not found.');
  return application;
};

export const getJobApplications = async (jobPostingId: string) => {
  const applications = await prisma.application.findMany({
    where: { jobPostingId },
    include: {
      student: {
        include: {
          studentProfile: true,
        },
      },
      documents: true,
    },
    orderBy: { appliedAt: 'desc' },
  });

  return applications;
};