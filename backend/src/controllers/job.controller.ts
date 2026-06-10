import { Request, Response } from 'express';
import {
  createJob,
  getAllJobs,
  getJobById,
  getCompanyJobs,
} from '../services/job.service';
import { sendSuccess, sendCreated, sendError } from '../utils/responseHelper';

export const postJob = async (req: Request, res: Response): Promise<void> => {
  try {
    const {
      title,
      description,
      skillsRequired,
      location,
      type,
      isPaid,
      stipend,
      duration,
      vacancies,
      deadline,
    } = req.body;

    if (!title || !description || !skillsRequired) {
      sendError(res, 'Title, description and skills are required.', 400);
      return;
    }

    if (!Array.isArray(skillsRequired) || skillsRequired.length === 0) {
      sendError(res, 'Skills required must be a non-empty array.', 400);
      return;
    }

    const job = await createJob({
      companyId: req.user!.userId,
      title,
      description,
      skillsRequired,
      location,
      type,
      isPaid,
      stipend,
      duration,
      vacancies,
      deadline,
    });

    sendCreated(res, job, 'Job posting created successfully.');
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to create job.';
    sendError(res, message, 400);
  }
};

export const fetchAllJobs = async (req: Request, res: Response): Promise<void> => {
  try {
    const { search, location, type, isPaid } = req.query;

    const jobs = await getAllJobs({
      search: (Array.isArray(search) ? search[0] : search)?.toString(),
      location: (Array.isArray(location) ? location[0] : location)?.toString(),
      type: (Array.isArray(type) ? type[0] : type)?.toString(),
      isPaid: (Array.isArray(isPaid) ? isPaid[0] : isPaid)?.toString(),
    });

    sendSuccess(res, jobs, 'Jobs fetched successfully.');
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to fetch jobs.';
    sendError(res, message, 500);
  }
};

export const fetchJobById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const job = await getJobById(Array.isArray(id) ? id[0] : id);
    sendSuccess(res, job, 'Job fetched successfully.');
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to fetch job.';
    sendError(res, message, 404);
  }
};

export const fetchCompanyJobs = async (req: Request, res: Response): Promise<void> => {
  try {
    const jobs = await getCompanyJobs(req.user!.userId);
    sendSuccess(res, jobs, 'Company jobs fetched successfully.');
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to fetch jobs.';
    sendError(res, message, 500);
  }
};