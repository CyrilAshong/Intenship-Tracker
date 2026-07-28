import { prisma } from '../config/db';
import { InternshipType } from '@prisma/client';

interface CreateJobInput {
  companyId: string;
  title: string;
  description: string;
  skillsRequired: string[];
  responsibilities?: string[];
  academicRequirements?: string;
  imageUrl?: string;
  location?: string;
  type?: InternshipType;
  isPaid?: boolean;
  stipend?: number;
  duration?: string;
  vacancies?: number;
  deadline?: string;
}

interface JobFilters {
  search?: string | undefined;
  location?: string | undefined;
  type?: string | undefined;
  isPaid?: string | undefined;
}

export const createJob = async (input: CreateJobInput) => {
  const job = await prisma.jobPosting.create({
    data: {
      companyId: input.companyId,
      title: input.title,
      description: input.description,
      skillsRequired: input.skillsRequired,
      responsibilities: input.responsibilities ?? [],
      academicRequirements: input.academicRequirements,
      imageUrl: input.imageUrl,
      location: input.location,
      type: input.type ?? 'FULL_TIME',
      isPaid: input.isPaid ?? false,
      stipend: input.stipend,
      duration: input.duration,
      vacancies: input.vacancies ?? 1,
      deadline: input.deadline ? new Date(input.deadline) : undefined,
    },
    include: {
      company: {
        include: {
          companyProfile: true,
        },
      },
    },
  });
  return job;
};

export const getAllJobs = async (filters: JobFilters) => {
  const { search, location, type, isPaid } = filters;

  const jobs = await prisma.jobPosting.findMany({
    where: {
      isActive: true,
      ...(search && {
        OR: [
          { title: { contains: search, mode: 'insensitive' } },
          { description: { contains: search, mode: 'insensitive' } },
          { skillsRequired: { has: search } },
        ],
      }),
      ...(location && {
        location: { contains: location, mode: 'insensitive' },
      }),
      ...(type && { type: type as InternshipType }),
      ...(isPaid !== undefined && { isPaid: isPaid === 'true' }),
    },
    include: {
      company: {
        include: {
          companyProfile: true,
        },
      },
      _count: {
        select: { applications: true },
      },
    },
    orderBy: { createdAt: 'desc' },
  });

  return jobs;
};

export const getJobById = async (jobId: string) => {
  const job = await prisma.jobPosting.findUnique({
    where: { id: jobId },
    include: {
      company: {
        include: {
          companyProfile: true,
        },
      },
      _count: {
        select: { applications: true },
      },
    },
  });

  if (!job) throw new Error('Job posting not found.');
  return job;
};

export const getCompanyJobs = async (companyId: string) => {
  const jobs = await prisma.jobPosting.findMany({
    where: { companyId },
    orderBy: { createdAt: 'desc' },
    include: {
      _count: {
        select: { applications: true },
      },
    },
  });
  return jobs;
};

export const getCompanyPublicProfile = async (companyId: string) => {
  const company = await prisma.user.findUnique({
    where: { id: companyId, role: 'COMPANY' },
    include: {
      companyProfile: true,
    },
  });

  if (!company) throw new Error('Company not found.');

  const jobs = await prisma.jobPosting.findMany({
    where: { companyId, isActive: true },
    orderBy: { createdAt: 'desc' },
    include: {
      _count: {
        select: { applications: true },
      },
    },
  });

  return {
    id: company.id,
    companyProfile: company.companyProfile,
    jobs,
  };
};

export const toggleJobPosting = async (jobId: string, companyId: string, isActive: boolean) => {
  const job = await prisma.jobPosting.findUnique({
    where: { id: jobId },
  });

  if (!job) throw new Error('Job posting not found.');
  if (job.companyId !== companyId) throw new Error('You do not own this job posting.');

  const updated = await prisma.jobPosting.update({
    where: { id: jobId },
    data: { isActive },
  });

  return updated;
};