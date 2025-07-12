export interface JobListing {
  id?: string;
  externalId: string;
  title: string;
  company: string;
  description: string;
  location?: string;
  salaryMin?: number;
  salaryMax?: number;
  jobType?: 'full_time' | 'part_time' | 'contract' | 'internship' | 'freelance';
  remoteType?: 'remote' | 'hybrid' | 'onsite';
  url: string;
  datePosted?: Date;
  requirements?: string[];
  benefits?: string[];
  experienceLevel?: 'entry' | 'mid' | 'senior' | 'lead' | 'executive';
}

export interface ScrapingConfig {
  source: string;
  baseUrl: string;
  searchPaths: string[];
  selectors: {
    jobCard: string;
    title: string;
    company: string;
    location?: string;
    salary?: string;
    description?: string;
    link: string;
    datePosted?: string;
  };
  pagination?: {
    nextButton?: string;
    pageParam?: string;
    maxPages?: number;
  };
  rateLimit: number; // milliseconds between requests
}

export interface ScrapingResult {
  success: boolean;
  jobsFound: number;
  jobsProcessed: number;
  errors: string[];
  timestamp: Date;
}