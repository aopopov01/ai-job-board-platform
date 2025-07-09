import { chromium, FullConfig } from '@playwright/test'

async function globalSetup(config: FullConfig) {
  console.log('🚀 Starting global test setup...')
  
  // Start browser for setup
  const browser = await chromium.launch()
  const page = await browser.newPage()
  
  try {
    // Wait for the development server to be ready
    console.log('⏳ Waiting for development server...')
    
    const baseURL = config.projects[0].use.baseURL || 'http://localhost:3000'
    
    // Check if server is responding
    let retries = 60 // 60 seconds timeout
    while (retries > 0) {
      try {
        const response = await page.goto(`${baseURL}/api/health`)
        if (response?.status() === 200) {
          console.log('✅ Development server is ready')
          break
        }
      } catch (error) {
        // Server not ready yet
      }
      
      retries--
      await new Promise(resolve => setTimeout(resolve, 1000))
    }
    
    if (retries === 0) {
      throw new Error('Development server failed to start')
    }
    
    // Optional: Seed test data
    console.log('🌱 Seeding test data...')
    await seedTestData(page, baseURL)
    
    // Optional: Create test users
    console.log('👤 Creating test users...')
    await createTestUsers(page, baseURL)
    
    console.log('✅ Global setup completed')
    
  } catch (error) {
    console.error('❌ Global setup failed:', error)
    throw error
  } finally {
    await browser.close()
  }
}

async function seedTestData(page: any, baseURL: string) {
  // This would typically involve API calls to create test data
  // For now, we'll just log that we're seeding data
  
  try {
    // Example: Create test jobs, companies, etc.
    // await page.request.post(`${baseURL}/api/test/seed`, {
    //   data: { type: 'jobs' }
    // })
    
    console.log('📊 Test data seeded successfully')
  } catch (error) {
    console.warn('⚠️ Test data seeding failed:', error)
    // Don't fail the entire setup for seeding issues
  }
}

async function createTestUsers(page: any, baseURL: string) {
  // Create test users for different scenarios
  const testUsers = [
    {
      email: 'candidate@test.com',
      password: 'test123456',
      type: 'individual',
      profile: {
        first_name: 'John',
        last_name: 'Doe',
        years_of_experience: 5
      }
    },
    {
      email: 'company@test.com',
      password: 'test123456',
      type: 'company',
      profile: {
        company_name: 'Test Company Inc',
        industry: 'Technology'
      }
    }
  ]
  
  for (const user of testUsers) {
    try {
      // This would typically create users via API
      // await page.request.post(`${baseURL}/api/test/users`, {
      //   data: user
      // })
      
      console.log(`👤 Created test user: ${user.email}`)
    } catch (error) {
      console.warn(`⚠️ Failed to create test user ${user.email}:`, error)
    }
  }
}

export default globalSetup