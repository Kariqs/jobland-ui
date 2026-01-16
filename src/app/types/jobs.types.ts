export interface Job {
  id: string;
  title: string;
  company: string;
  postedTime: string;
  locationType: 'Remote' | 'Hybrid' | 'Onsite' | 'Unknown';
  visaStatus: string[];
  source: string;
  applyUrl: string;
  applied: boolean;
}

export interface JobResponse {
  success: boolean;
  count: number;
  jobs: Job[];
  hasMore?: boolean;
}
