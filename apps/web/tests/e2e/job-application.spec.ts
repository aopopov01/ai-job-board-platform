import { test, expect } from '@playwright/test'

test.describe('Job Application Flow', () => {
  test.beforeEach(async ({ page }) => {
    // Start from the jobs page
    await page.goto('/jobs')
  })

  test('complete job application flow', async ({ page }) => {
    // Search for a job
    await page.fill('[placeholder*="Search jobs"]', 'Software Engineer')
    await page.press('[placeholder*="Search jobs"]', 'Enter')
    
    // Wait for search results
    await expect(page.locator('[data-testid="job-card"]').first()).toBeVisible()
    
    // Click on first job
    await page.locator('[data-testid="job-card"]').first().click()
    
    // Should navigate to job details page
    await expect(page.locator('h1')).toContainText('Software Engineer')
    
    // Check job details are visible
    await expect(page.locator('[data-testid="job-description"]')).toBeVisible()
    await expect(page.locator('[data-testid="company-info"]')).toBeVisible()
    await expect(page.locator('[data-testid="job-requirements"]')).toBeVisible()
    
    // Click apply button
    await page.click('[data-testid="apply-button"]')
    
    // Should redirect to login if not authenticated
    await expect(page).toHaveURL(/.*\/auth\/login/)
    
    // Fill login form
    await page.fill('[data-testid="email-input"]', 'test@example.com')
    await page.fill('[data-testid="password-input"]', 'password123')
    await page.click('[data-testid="login-button"]')
    
    // After login, should be redirected back to job or application form
    await expect(page).toHaveURL(/.*\/(jobs|apply)/)
    
    // Fill application form
    await page.fill('[data-testid="cover-letter"]', 'I am very interested in this position...')
    
    // Upload CV (mock file upload)
    const fileChooserPromise = page.waitForEvent('filechooser')
    await page.click('[data-testid="cv-upload"]')
    const fileChooser = await fileChooserPromise
    await fileChooser.setFiles({
      name: 'resume.pdf',
      mimeType: 'application/pdf',
      buffer: Buffer.from('Mock PDF content'),
    })
    
    // Submit application
    await page.click('[data-testid="submit-application"]')
    
    // Should show success message
    await expect(page.locator('[data-testid="success-message"]')).toBeVisible()
    await expect(page.locator('[data-testid="success-message"]')).toContainText('Application submitted')
  })

  test('prevents duplicate applications', async ({ page }) => {
    // Assume user is already logged in and has applied
    await page.goto('/jobs/test-job-id')
    
    // Apply button should be disabled or show "Already Applied"
    const applyButton = page.locator('[data-testid="apply-button"]')
    await expect(applyButton).toHaveText(/already applied|applied/i)
    await expect(applyButton).toBeDisabled()
  })

  test('validates application form', async ({ page }) => {
    // Navigate to application form (assume user is logged in)
    await page.goto('/jobs/test-job-id/apply')
    
    // Try to submit without required fields
    await page.click('[data-testid="submit-application"]')
    
    // Should show validation errors
    await expect(page.locator('[data-testid="error-message"]')).toBeVisible()
    await expect(page.locator('[data-testid="error-message"]')).toContainText('required')
  })

  test('shows application status to user', async ({ page }) => {
    // Navigate to user dashboard
    await page.goto('/dashboard/applications')
    
    // Should show list of applications
    await expect(page.locator('[data-testid="application-list"]')).toBeVisible()
    
    // Check application statuses
    const applications = page.locator('[data-testid="application-item"]')
    await expect(applications.first()).toBeVisible()
    
    // Should show status badges
    await expect(page.locator('[data-testid="application-status"]').first()).toBeVisible()
  })

  test('allows companies to review applications', async ({ page }) => {
    // Login as company user
    await page.goto('/auth/login')
    await page.fill('[data-testid="email-input"]', 'company@example.com')
    await page.fill('[data-testid="password-input"]', 'password123')
    await page.click('[data-testid="login-button"]')
    
    // Navigate to company dashboard
    await page.goto('/dashboard/jobs')
    
    // Click on a job with applications
    await page.click('[data-testid="view-applications"]')
    
    // Should show applications list
    await expect(page.locator('[data-testid="applications-list"]')).toBeVisible()
    
    // Click on an application to review
    await page.click('[data-testid="application-item"]')
    
    // Should show application details
    await expect(page.locator('[data-testid="applicant-info"]')).toBeVisible()
    await expect(page.locator('[data-testid="cover-letter"]')).toBeVisible()
    await expect(page.locator('[data-testid="cv-viewer"]')).toBeVisible()
    
    // Should have action buttons
    await expect(page.locator('[data-testid="approve-button"]')).toBeVisible()
    await expect(page.locator('[data-testid="reject-button"]')).toBeVisible()
  })

  test('sends application status notifications', async ({ page }) => {
    // Assume company updates application status
    await page.goto('/dashboard/applications/test-application-id')
    await page.click('[data-testid="approve-button"]')
    
    // Should show confirmation
    await expect(page.locator('[data-testid="status-updated"]')).toBeVisible()
    
    // Simulate checking as candidate
    await page.goto('/dashboard/applications')
    
    // Should show updated status
    await expect(page.locator('[data-testid="application-status"]')).toContainText('approved')
  })
})

test.describe('Job Search and Filtering', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/jobs')
  })

  test('searches jobs by keyword', async ({ page }) => {
    await page.fill('[placeholder*="Search jobs"]', 'React Developer')
    await page.press('[placeholder*="Search jobs"]', 'Enter')
    
    // Wait for search results
    await page.waitForSelector('[data-testid="search-results"]')
    
    // Should show relevant results
    const jobTitles = page.locator('[data-testid="job-title"]')
    await expect(jobTitles.first()).toContainText(/react/i)
  })

  test('filters jobs by location', async ({ page }) => {
    await page.fill('[data-testid="location-filter"]', 'New York')
    await page.press('[data-testid="location-filter"]', 'Enter')
    
    // Should filter results
    const jobLocations = page.locator('[data-testid="job-location"]')
    await expect(jobLocations.first()).toContainText(/new york/i)
  })

  test('filters jobs by salary range', async ({ page }) => {
    await page.fill('[data-testid="salary-min"]', '80000')
    await page.fill('[data-testid="salary-max"]', '120000')
    await page.click('[data-testid="apply-filters"]')
    
    // Should show jobs within salary range
    await expect(page.locator('[data-testid="job-salary"]').first()).toBeVisible()
  })

  test('clears all filters', async ({ page }) => {
    // Apply some filters
    await page.fill('[placeholder*="Search jobs"]', 'Engineer')
    await page.fill('[data-testid="location-filter"]', 'San Francisco')
    
    // Clear filters
    await page.click('[data-testid="clear-filters"]')
    
    // Should reset all filter inputs
    await expect(page.locator('[placeholder*="Search jobs"]')).toHaveValue('')
    await expect(page.locator('[data-testid="location-filter"]')).toHaveValue('')
  })
})