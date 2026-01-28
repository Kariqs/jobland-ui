export interface Resume {
  _id?: string;
  userId?: string;
  title: string;
  originalFileName?: string;
  mimeType?: string;
  fileUrl?: string | null;
  extractedContent: {
    personalInfo: {
      fullName: string;
      email: string;
      phone: string;
      location: string;
      linkedin: string | null;
      github: string | null;
      portfolio: string | null;
    };
    professionalSummary: string | null;
    experience: Array<{
      position: string;
      company: string;
      location: string | null;
      startDate: string;
      endDate: string;
      description: string[];
    }>;
    education: Array<{
      degree: string;
      field: string;
      institution: string;
      location: string;
      startYear: string | null;
      endYear: string;
      description: string | null;
    }>;
    skills: string[];
    certifications: any[];
    projects: any[];
    languages: any[];
  };
  createdAt?: Date;
  updatedAt?: Date;
}

export interface ResumeListItem {
  _id: string;
  title: string;
  originalFileName: string;
  parsedName?: string;
  createdAt: string;
}

export interface GetResumesResponse {
  messsage: string;
  resumes: ResumeListItem[];
}

export interface GetResumeResponse {
  message: string;
  resume: Resume;
}

export interface UpdateResumeResponse {
  message: string;
  resumeId: string;
}
