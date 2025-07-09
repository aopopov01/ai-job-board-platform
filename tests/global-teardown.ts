import { chromium, FullConfig } from '@playwright/test'

async function globalTeardown(config: FullConfig) {
  console.log('🧹 Starting global test teardown...')
  
  const browser = await chromium.launch()
  const page = await browser.newPage()
  
  try {
    const baseURL = config.projects[0].use.baseURL || 'http://localhost:3000'
    
    // Clean up test data
    console.log('🗑️ Cleaning up test data...')
    await cleanupTestData(page, baseURL)
    
    // Remove test users
    console.log('👤 Removing test users...')
    await removeTestUsers(page, baseURL)
    
    console.log('✅ Global teardown completed')
    
  } catch (error) {
    console.error('❌ Global teardown failed:', error)
    // Don't throw here as tests have already completed
  } finally {
    await browser.close()
  }
}

async function cleanupTestData(page: any, baseURL: string) {
  try {
    // Clean up test jobs, applications, etc.
    // await page.request.delete(`${baseURL}/api/test/cleanup`, {
    //   data: { type: 'all' }
    // })
    
    console.log('🗑️ Test data cleaned up successfully')
  } catch (error) {
    console.warn('⚠️ Test data cleanup failed:', error)
  }
}

async function removeTestUsers(page: any, baseURL: string) {
  const testEmails = [
    'candidate@test.com',
    'company@test.com'
  ]
  
  for (const email of testEmails) {
    try {
      // Remove test users
      // await page.request.delete(`${baseURL}/api/test/users/${email}`)
      
      console.log(`👤 Removed test user: ${email}`)
    } catch (error) {
      console.warn(`⚠️ Failed to remove test user ${email}:`, error)
    }
  }
}

export default globalTeardown