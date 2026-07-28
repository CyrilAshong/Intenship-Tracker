import { Request, Response } from 'express';
import {
  getDashboardStats,
  getAllStudents,
  verifyStudent,
  getAllCompanies,
  verifyCompany,
  toggleUserActive,
  getAllJobs,
  toggleJobActive,
  getAllApplications,
} from '../services/admin.service';
import { sendSuccess, sendError } from '../utils/responseHelper';
import { VerificationStatus } from '@prisma/client';

// ─── DASHBOARD ────────────────────────────────────────────────────────────────

export const getDashboard = async (req: Request, res: Response): Promise<void> => {
  try {
    const stats = await getDashboardStats();
    sendSuccess(res, stats, 'Dashboard stats fetched successfully.');
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to fetch stats.';
    sendError(res, message, 500);
  }
};

// ─── STUDENTS ─────────────────────────────────────────────────────────────────

export const getStudents = async (req: Request, res: Response): Promise<void> => {
  try {
    const students = await getAllStudents();
    sendSuccess(res, students, 'Students fetched successfully.');
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to fetch students.';
    sendError(res, message, 500);
  }
};

export const updateStudentVerification = async (req: Request, res: Response): Promise<void> => {
  try {
    const { userId } = req.params;
    const { status } = req.body;

    if (!status || !Object.values(VerificationStatus).includes(status)) {
      sendError(res, 'Invalid verification status.', 400);
      return;
    }

    const profile = await verifyStudent(
      Array.isArray(userId) ? userId[0] : userId,
      status as VerificationStatus,
    );
    sendSuccess(res, profile, 'Student verification status updated.');
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to update verification.';
    sendError(res, message, 400);
  }
};

// ─── COMPANIES ────────────────────────────────────────────────────────────────

export const getCompanies = async (req: Request, res: Response): Promise<void> => {
  try {
    const companies = await getAllCompanies();
    sendSuccess(res, companies, 'Companies fetched successfully.');
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to fetch companies.';
    sendError(res, message, 500);
  }
};

export const updateCompanyVerification = async (req: Request, res: Response): Promise<void> => {
  try {
    const { userId } = req.params;
    const { status } = req.body;

    if (!status || !Object.values(VerificationStatus).includes(status)) {
      sendError(res, 'Invalid verification status.', 400);
      return;
    }

    const profile = await verifyCompany(
      Array.isArray(userId) ? userId[0] : userId,
      status as VerificationStatus,
    );
    sendSuccess(res, profile, 'Company verification status updated.');
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to update verification.';
    sendError(res, message, 400);
  }
};

// ─── USER ACCOUNT MANAGEMENT ──────────────────────────────────────────────────

export const toggleUserStatus = async (req: Request, res: Response): Promise<void> => {
  try {
    const { userId } = req.params;
    const { isActive } = req.body;

    if (typeof isActive !== 'boolean') {
      sendError(res, 'isActive must be a boolean.', 400);
      return;
    }

    const user = await toggleUserActive(
      Array.isArray(userId) ? userId[0] : userId,
      isActive,
    );
    sendSuccess(res, user, `User account ${isActive ? 'activated' : 'deactivated'} successfully.`);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to update user status.';
    sendError(res, message, 400);
  }
};

// ─── JOBS ─────────────────────────────────────────────────────────────────────

export const getJobs = async (req: Request, res: Response): Promise<void> => {
  try {
    const jobs = await getAllJobs();
    sendSuccess(res, jobs, 'Jobs fetched successfully.');
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to fetch jobs.';
    sendError(res, message, 500);
  }
};

export const toggleJobStatus = async (req: Request, res: Response): Promise<void> => {
  try {
    const { jobId } = req.params;
    const { isActive } = req.body;

    if (typeof isActive !== 'boolean') {
      sendError(res, 'isActive must be a boolean.', 400);
      return;
    }

    const job = await toggleJobActive(
      Array.isArray(jobId) ? jobId[0] : jobId,
      isActive,
    );
    sendSuccess(res, job, `Job ${isActive ? 'activated' : 'deactivated'} successfully.`);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to update job status.';
    sendError(res, message, 400);
  }
};

// ─── APPLICATIONS ─────────────────────────────────────────────────────────────

export const getApplications = async (req: Request, res: Response): Promise<void> => {
  try {
    const applications = await getAllApplications();
    sendSuccess(res, applications, 'Applications fetched successfully.');
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to fetch applications.';
    sendError(res, message, 500);
  }
};