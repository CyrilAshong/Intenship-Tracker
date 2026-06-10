import api from './api';

export interface Job {
  id: string;
  title: string;
  description: string;
  skillsRequired: string[];
  location: string | null;
  type: string;
  isPaid: boolean;
  stipend: number | null;
  duration: string | null;
  vacancies: number;
  deadline: string | null;
  createdAt: string;
  company: {
    id: string;
    companyProfile: {
      companyName: string;
      industry: string | null;
      logoUrl: string | null;
      location: string | null;
    } | null;
  };
  _count: {
    applications: number;
  };
}

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