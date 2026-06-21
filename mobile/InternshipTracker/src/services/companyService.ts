import api from './api';

export interface CompanyJob {
  id: string;
  title: string;
  isActive: boolean;
  createdAt: string;
  _count: {
    applications: number;
  };
}

export interface Applicant {
  id: string;
  status: string;
  appliedAt: string;
  coverNote: string | null;
  student: {
    id: string;
    studentProfile: {
      firstName: string;
      lastName: string;
      university: string | null;
      course: string | null;
      yearOfStudy: number | null;
      skills: string[];
    } | null;
  };
}

export const fetchCompanyJobs = async (): Promise<CompanyJob[]> => {
  const response = await api.get('/jobs/company/my-jobs');
  return response.data.data;
};

export const fetchJobApplicants = async (jobId: string): Promise<Applicant[]> => {
  const response = await api.get(`/applications/job/${jobId}`);
  return response.data.data;
};

export const updateApplicationStatus = async (
  applicationId: string,
  status: string,
): Promise<void> => {
  await api.patch(`/applications/${applicationId}/status`, { status });
};