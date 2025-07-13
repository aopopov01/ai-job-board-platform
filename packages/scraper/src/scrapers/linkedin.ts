import { JobScraper } from '../scraper';
import { ScrapingConfig } from '../types';
import dotenv from 'dotenv';

dotenv.config();

export const linkedinConfig: ScrapingConfig = {
  source: 'LinkedIn',
  baseUrl: 'https://www.linkedin.com',
  searchPaths: ['/jobs/search?keywords='],
  selectors: {
    jobCard: '.job-search-card',
    title: '.base-search-card__title',
    company: '.base-search-card__subtitle',
    location: '.job-search-card__location',
    link: '.base-card__full-link',
    datePosted: '.job-search-card__listdate'
  },
  pagination: {
    nextButton: 'button[aria-label="View next page"]',
    maxPages: 3
  },
  rateLimit: 3000 // 3 seconds between requests (LinkedIn is strict)
};

export async function scrapeLinkedInJobs(searchTerms: string[] = ['software engineer', 'frontend developer', 'backend developer']) {
  const scraper = new JobScraper();
  
  try {
    console.log('🔗 Starting LinkedIn job scraping...');
    console.log('⚠️  Note: LinkedIn has strict anti-bot measures. Use responsibly.');
    
    await scraper.initialize();
    
    const result = await scraper.scrapeJobs(linkedinConfig, searchTerms);
    
    console.log('📊 LinkedIn Scraping Results:');
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
    console.error('❌ LinkedIn scraping failed:', error);
    throw error;
  } finally {
    await scraper.close();
  }
}

// Run if called directly
if (require.main === module) {
  scrapeLinkedInJobs()
    .then(() => {
      console.log('✨ LinkedIn scraping completed');
      process.exit(0);
    })
    .catch((error) => {
      console.error('💥 LinkedIn scraping failed:', error);
      process.exit(1);
    });
}