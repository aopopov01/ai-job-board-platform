import puppeteer, { Browser, Page } from 'puppeteer';
import { createClient } from '@supabase/supabase-js';
import { JobListing, ScrapingConfig, ScrapingResult } from './types';

export class JobScraper {
  private browser: Browser | null = null;
  private supabase;
  
  constructor() {
    const supabaseUrl = process.env.SUPABASE_URL || '';
    const supabaseKey = process.env.SUPABASE_ANON_KEY || '';
    this.supabase = createClient(supabaseUrl, supabaseKey);
  }

  async initialize(): Promise<void> {
    this.browser = await puppeteer.launch({
      headless: true,
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-accelerated-2d-canvas',
        '--disable-gpu',
        '--window-size=1920x1080'
      ]
    });
  }

  async scrapeJobs(config: ScrapingConfig, searchTerms: string[] = ['software engineer']): Promise<ScrapingResult> {
    if (!this.browser) {
      throw new Error('Browser not initialized. Call initialize() first.');
    }

    const result: ScrapingResult = {
      success: false,
      jobsFound: 0,
      jobsProcessed: 0,
      errors: [],
      timestamp: new Date()
    };

    const page = await this.browser.newPage();
    
    try {
      // Set user agent to avoid detection
      await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36');
      
      // Enable stealth mode
      await page.setViewport({ width: 1920, height: 1080 });
      
      for (const searchTerm of searchTerms) {
        for (const searchPath of config.searchPaths) {
          const url = `${config.baseUrl}${searchPath}${encodeURIComponent(searchTerm)}`;
          
          try {
            await page.goto(url, { waitUntil: 'networkidle2', timeout: 30000 });
            await this.delay(config.rateLimit);
            
            // Extract job listings from current page
            const jobs = await this.extractJobsFromPage(page, config);
            result.jobsFound += jobs.length;
            
            // Process and save jobs
            for (const job of jobs) {
              try {
                await this.saveJob(job, config.source);
                result.jobsProcessed++;
              } catch (error) {
                result.errors.push(`Failed to save job: ${job.title} - ${error}`);
              }
            }
            
            // Handle pagination if configured
            if (config.pagination) {
              await this.handlePagination(page, config, result);
            }
            
          } catch (error) {
            result.errors.push(`Failed to scrape ${url}: ${error}`);
          }
        }
      }
      
      result.success = result.errors.length === 0;
    } catch (error) {
      result.errors.push(`Scraping failed: ${error}`);
    } finally {
      await page.close();
    }
    
    return result;
  }

  private async extractJobsFromPage(page: Page, config: ScrapingConfig): Promise<JobListing[]> {
    return await page.evaluate((selectors) => {
      const jobCards = document.querySelectorAll(selectors.jobCard);
      const jobs: JobListing[] = [];
      
      jobCards.forEach((card: any) => {
        try {
          const titleElement = card.querySelector(selectors.title);
          const companyElement = card.querySelector(selectors.company);
          const linkElement = card.querySelector(selectors.link);
          
          if (titleElement && companyElement && linkElement) {
            const job: JobListing = {
              externalId: linkElement.getAttribute('href') || '',
              title: titleElement.textContent?.trim() || '',
              company: companyElement.textContent?.trim() || '',
              description: '',
              url: linkElement.getAttribute('href') || '',
            };
            
            // Extract optional fields
            if (selectors.location) {
              const locationElement = card.querySelector(selectors.location);
              if (locationElement) {
                job.location = locationElement.textContent?.trim();
              }
            }
            
            if (selectors.salary) {
              const salaryElement = card.querySelector(selectors.salary);
              if (salaryElement) {
                const salaryText = salaryElement.textContent?.trim() || '';
                // Basic salary parsing - could be enhanced
                const salaryMatch = salaryText.match(/[\d,]+/g);
                if (salaryMatch && salaryMatch.length >= 1) {
                  job.salaryMin = parseInt(salaryMatch[0].replace(/,/g, ''));
                  if (salaryMatch.length >= 2) {
                    job.salaryMax = parseInt(salaryMatch[1].replace(/,/g, ''));
                  }
                }
              }
            }
            
            if (selectors.datePosted) {
              const dateElement = card.querySelector(selectors.datePosted);
              if (dateElement) {
                job.datePosted = new Date(dateElement.textContent?.trim() || '');
              }
            }
            
            jobs.push(job);
          }
        } catch (error) {
          console.error('Error extracting job:', error);
        }
      });
      
      return jobs;
    }, config.selectors);
  }

  private async handlePagination(page: Page, config: ScrapingConfig, result: ScrapingResult): Promise<void> {
    if (!config.pagination) return;
    
    const maxPages = config.pagination.maxPages || 5;
    let currentPage = 1;
    
    while (currentPage < maxPages) {
      if (config.pagination.nextButton) {
        const nextButton = await page.$(config.pagination.nextButton);
        if (!nextButton) break;
        
        await nextButton.click();
        await page.waitForSelector('body', { timeout: 2000 });
        await this.delay(config.rateLimit);
        
        const jobs = await this.extractJobsFromPage(page, config);
        result.jobsFound += jobs.length;
        
        for (const job of jobs) {
          try {
            await this.saveJob(job, config.source);
            result.jobsProcessed++;
          } catch (error) {
            result.errors.push(`Failed to save job on page ${currentPage}: ${error}`);
          }
        }
      }
      
      currentPage++;
    }
  }

  private async saveJob(job: JobListing, source: string): Promise<void> {
    // First, ensure the job source exists
    const { data: sourceData, error: sourceError } = await this.supabase
      .from('job_sources')
      .select('id')
      .eq('name', source)
      .single();
    
    let sourceId = sourceData?.id;
    
    if (!sourceId) {
      // Create the source if it doesn't exist
      const { data: newSource, error: createError } = await this.supabase
        .from('job_sources')
        .insert({
          name: source,
          url: job.url,
          type: 'scraping',
          is_active: true
        })
        .select('id')
        .single();
      
      if (createError) throw createError;
      sourceId = newSource.id;
    }
    
    // Save the scraped job
    const { error } = await this.supabase
      .from('scraped_jobs')
      .insert({
        source_id: sourceId,
        external_id: job.externalId,
        title: job.title,
        company_name: job.company,
        description: job.description,
        location: job.location,
        salary_min: job.salaryMin,
        salary_max: job.salaryMax,
        job_type: job.jobType,
        remote_type: job.remoteType,
        scraped_at: new Date().toISOString()
      });
    
    if (error) throw error;
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  async close(): Promise<void> {
    if (this.browser) {
      await this.browser.close();
      this.browser = null;
    }
  }
}