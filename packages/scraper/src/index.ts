// Main entry point for scraper service
import { JobScraper } from './scraper';
import { indeedConfig } from './scrapers/indeed';
import { linkedinConfig } from './scrapers/linkedin';

async function main() {
  console.log('🕷️  Starting Job Board Scraper Service...');
  
  const scraper = new JobScraper();
  
  try {
    await scraper.initialize();
    console.log('✅ Scraper initialized successfully');
    
    // Run scraping for both platforms
    console.log('🔍 Starting Indeed scraping...');
    const indeedResult = await scraper.scrapeJobs(indeedConfig, ['software engineer', 'developer']);
    console.log(`Indeed: Found ${indeedResult.jobsFound} jobs, processed ${indeedResult.jobsProcessed}`);
    
    console.log('🔍 Starting LinkedIn scraping...');
    const linkedinResult = await scraper.scrapeJobs(linkedinConfig, ['software engineer', 'developer']);
    console.log(`LinkedIn: Found ${linkedinResult.jobsFound} jobs, processed ${linkedinResult.jobsProcessed}`);
    
    console.log('✅ Scraping completed successfully');
    
  } catch (error) {
    console.error('❌ Scraping failed:', error);
    process.exit(1);
  } finally {
    await scraper.close();
    console.log('🏁 Scraper service stopped');
  }
}

// Handle graceful shutdown
process.on('SIGINT', async () => {
  console.log('Received SIGINT, shutting down gracefully...');
  process.exit(0);
});

process.on('SIGTERM', async () => {
  console.log('Received SIGTERM, shutting down gracefully...');
  process.exit(0);
});

if (require.main === module) {
  main().catch(console.error);
}

export { main };