export type Role = 'STUDENT' | 'COMPANY' | 'ADMIN';

export interface StudentProfile {
  id: string;
  firstName: string;
  lastName: string;
  phone: string | null;
  university: string | null;
  course: string | null;
  yearOfStudy: number | null;
  skills: string[];
  biography: string | null;
  gpa: number | null;
  verificationStatus: string;
}

export interface CompanyProfile {
  id: string;
  companyName: string;
  industry: string | null;
  description: string | null;
  website: string | null;
  location: string | null;
  verificationStatus: string;
}

export interface User {
  id: string;
  email: string;
  role: Role;
  studentProfile: StudentProfile | null;
  companyProfile: CompanyProfile | null;
}

export interface AuthResponse {
  token: string;
  user: User;
}

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