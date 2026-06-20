import api from './api';
import { Job } from '../types';

export const fetchJobs = async (search?: string): Promise<Job[]> => {
  const params = search ? `?search=${search}` : '';
  const response = await api.get(`/jobs${params}`);
  return response.data.data;
};

export const fetchJobById = async (id: string): Promise<Job> => {
  const response = await api.get(`/jobs/${id}`);
  return response.data.data;
};

export const applyForJob = async (
  jobPostingId: string,
  coverNote?: string,
): Promise<void> => {
  await api.post('/applications', { jobPostingId, coverNote });
};

export const fetchMyApplications = async () => {
  const response = await api.get('/applications/my-applications');
  return response.data.data;
};