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
  // Check company is verified
  const company = await prisma.user.findUnique({
    where: { id: input.companyId },
    include: { companyProfile: true },
  });

  if (!company?.companyProfile) {
    throw new Error('Company profile not found.');
  }

  if (company.companyProfile.verificationStatus !== 'VERIFIED') {
    throw new Error('Your company must be verified by an admin before posting internships.');
  }
  
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

export const getAllJobs = async (filters: JobFilters, page: number = 1, limit: number = 10) => {
  const { search, location, type, isPaid } = filters;
  const skip = (page - 1) * limit;

  const where = {
    isActive: true,
    OR: [
      { deadline: null },
      { deadline: { gte: new Date() } },
    ],
    ...(search && {
      OR: [
        { title: { contains: search, mode: 'insensitive' as const } },
        { description: { contains: search, mode: 'insensitive' as const } },
        { skillsRequired: { has: search } },
        {
          company: {
            companyProfile: {
              companyName: { contains: search, mode: 'insensitive' as const },
            },
          },
        },
      ],
    }),
    ...(location && {
      location: { contains: location, mode: 'insensitive' as const },
    }),
    ...(type && { type: type as InternshipType }),
    ...(isPaid !== undefined && { isPaid: isPaid === 'true' }),
  };

  const [jobs, total] = await Promise.all([
    prisma.jobPosting.findMany({
      where,
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
      skip,
      take: limit,
    }),
    prisma.jobPosting.count({ where }),
  ]);

  return {
    jobs,
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
      hasNextPage: page < Math.ceil(total / limit),
      hasPrevPage: page > 1,
    },
  };
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

export const updateJob = async (jobId: string, companyId: string, input: Partial<CreateJobInput>) => {
  const job = await prisma.jobPosting.findUnique({
    where: { id: jobId },
  });

  if (!job) throw new Error('Job posting not found.');
  if (job.companyId !== companyId) throw new Error('You do not own this job posting.');

  const updated = await prisma.jobPosting.update({
    where: { id: jobId },
    data: {
      ...(input.title !== undefined && { title: input.title }),
      ...(input.description !== undefined && { description: input.description }),
      ...(input.skillsRequired !== undefined && { skillsRequired: input.skillsRequired }),
      ...(input.responsibilities !== undefined && { responsibilities: input.responsibilities }),
      ...(input.academicRequirements !== undefined && { academicRequirements: input.academicRequirements }),
      ...(input.imageUrl !== undefined && { imageUrl: input.imageUrl }),
      ...(input.location !== undefined && { location: input.location }),
      ...(input.type !== undefined && { type: input.type }),
      ...(input.isPaid !== undefined && { isPaid: input.isPaid }),
      ...(input.stipend !== undefined && { stipend: input.stipend }),
      ...(input.duration !== undefined && { duration: input.duration }),
      ...(input.vacancies !== undefined && { vacancies: input.vacancies }),
      ...(input.deadline !== undefined && { deadline: input.deadline ? new Date(input.deadline) : null }),
    },
    include: {
      company: {
        include: { companyProfile: true },
      },
      _count: {
        select: { applications: true },
      },
    },
  });

  return updated;
};