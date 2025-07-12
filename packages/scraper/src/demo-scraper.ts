import dotenv from 'dotenv';

dotenv.config();

/**
 * Demo job scraping using Puppeteer MCP
 * This demonstrates how to scrape job listings from a demo job board
 */
export async function demoJobScraping() {
  console.log('🎯 Starting demo job scraping...');
  
  const results = {
    timestamp: new Date(),
    jobsFound: 0,
    jobsProcessed: 0,
    source: 'demo-jobs',
    jobs: [] as any[]
  };

  try {
    // Simulate scraping popular job sites
    const demoJobs = [
      {
        id: 'demo-1',
        title: 'Senior Full Stack Developer',
        company: 'TechCorp Inc.',
        location: 'San Francisco, CA',
        description: 'Join our team to build cutting-edge web applications using React, Node.js, and cloud technologies.',
        salary: '$120,000 - $180,000',
        type: 'Full-time',
        remote: 'Hybrid',
        datePosted: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
        url: 'https://example.com/jobs/senior-fullstack-dev'
      },
      {
        id: 'demo-2',
        title: 'Data Scientist',
        company: 'AI Solutions Ltd.',
        location: 'New York, NY',
        description: 'Analyze large datasets and build machine learning models to drive business insights.',
        salary: '$100,000 - $150,000',
        type: 'Full-time',
        remote: 'Remote',
        datePosted: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
        url: 'https://example.com/jobs/data-scientist'
      },
      {
        id: 'demo-3',
        title: 'Product Manager',
        company: 'Innovation Labs',
        location: 'Austin, TX',
        description: 'Lead product strategy and work with cross-functional teams to deliver exceptional user experiences.',
        salary: '$110,000 - $160,000',
        type: 'Full-time',
        remote: 'Onsite',
        datePosted: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
        url: 'https://example.com/jobs/product-manager'
      },
      {
        id: 'demo-4',
        title: 'DevOps Engineer',
        company: 'CloudScale Systems',
        location: 'Seattle, WA',
        description: 'Build and maintain CI/CD pipelines, manage cloud infrastructure, and ensure system reliability.',
        salary: '$95,000 - $140,000',
        type: 'Full-time',
        remote: 'Hybrid',
        datePosted: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
        url: 'https://example.com/jobs/devops-engineer'
      },
      {
        id: 'demo-5',
        title: 'UX/UI Designer',
        company: 'Design Studio Pro',
        location: 'Los Angeles, CA',
        description: 'Create beautiful and intuitive user interfaces for web and mobile applications.',
        salary: '$80,000 - $120,000',
        type: 'Full-time',
        remote: 'Remote',
        datePosted: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 1 week ago
        url: 'https://example.com/jobs/ux-ui-designer'
      }
    ];

    console.log('🔍 Processing demo job listings...');
    
    for (const job of demoJobs) {
      try {
        console.log(`  📝 Processing: ${job.title} at ${job.company}`);
        
        // Simulate processing time
        await new Promise(resolve => setTimeout(resolve, 500));
        
        results.jobs.push({
          ...job,
          scrapedAt: new Date(),
          processed: true
        });
        
        results.jobsProcessed++;
        console.log(`  ✅ Processed: ${job.title}`);
      } catch (error) {
        console.error(`  ❌ Failed to process ${job.title}:`, error);
      }
    }
    
    results.jobsFound = demoJobs.length;
    
    console.log('\n📊 Demo Scraping Results:');
    console.log(`🔍 Jobs Found: ${results.jobsFound}`);
    console.log(`💾 Jobs Processed: ${results.jobsProcessed}`);
    console.log(`⏰ Completed at: ${results.timestamp.toISOString()}`);
    
    // Display sample jobs
    console.log('\n🎯 Sample Jobs Found:');
    results.jobs.slice(0, 3).forEach((job, index) => {
      console.log(`\n${index + 1}. ${job.title}`);
      console.log(`   🏢 Company: ${job.company}`);
      console.log(`   📍 Location: ${job.location}`);
      console.log(`   💰 Salary: ${job.salary}`);
      console.log(`   🏠 Remote: ${job.remote}`);
      console.log(`   📅 Posted: ${job.datePosted.toLocaleDateString()}`);
    });
    
    return results;
  } catch (error) {
    console.error('❌ Demo scraping failed:', error);
    throw error;
  }
}

// Run if called directly
if (require.main === module) {
  demoJobScraping()
    .then((results) => {
      console.log('\n✨ Demo scraping completed successfully!');
      console.log(`📈 Summary: ${results.jobsProcessed}/${results.jobsFound} jobs processed`);
      process.exit(0);
    })
    .catch((error) => {
      console.error('💥 Demo scraping failed:', error);
      process.exit(1);
    });
}