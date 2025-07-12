import { JobScraper } from '../scraper';
import { ScrapingConfig } from '../types';
import dotenv from 'dotenv';

dotenv.config();

const indeedConfig: ScrapingConfig = {
  source: 'Indeed',
  baseUrl: 'https://www.indeed.com',
  searchPaths: ['/jobs?q='],
  selectors: {
    jobCard: '[data-jk]',
    title: '[data-testid="job-title"] a',
    company: '[data-testid="company-name"]',
    location: '[data-testid="job-location"]',
    salary: '.metadata.salary-snippet-container',
    link: '[data-testid="job-title"] a',
    datePosted: '[data-testid="myJobsStateDate"]'
  },
  pagination: {
    nextButton: 'a[aria-label="Next Page"]',
    maxPages: 3
  },
  rateLimit: 2000 // 2 seconds between requests
};

export async function scrapeIndeedJobs(searchTerms: string[] = ['software engineer', 'data scientist', 'product manager']) {
  const scraper = new JobScraper();
  
  try {
    console.log('🚀 Starting Indeed job scraping...');
    await scraper.initialize();
    
    const result = await scraper.scrapeJobs(indeedConfig, searchTerms);
    
    console.log('📊 Scraping Results:');
    console.log(`✅ Success: ${result.success}`);
    console.log(`🔍 Jobs Found: ${result.jobsFound}`);
    console.log(`💾 Jobs Processed: ${result.jobsProcessed}`);
    console.log(`❌ Errors: ${result.errors.length}`);
    
    if (result.errors.length > 0) {
      console.log('\n⚠️ Errors encountered:');
      result.errors.forEach(error => console.log(`  - ${error}`));
    }
    
    return result;
  } catch (error) {
    console.error('❌ Scraping failed:', error);
    throw error;
  } finally {
    await scraper.close();
  }
}

// Run if called directly
if (require.main === module) {
  scrapeIndeedJobs()
    .then(() => {
      console.log('✨ Indeed scraping completed');
      process.exit(0);
    })
    .catch((error) => {
      console.error('💥 Indeed scraping failed:', error);
      process.exit(1);
    });
}