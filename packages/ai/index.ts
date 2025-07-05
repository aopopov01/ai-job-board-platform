// Export AI client
export { getOpenAIClient } from './client'
export type { OpenAI } from './client'

// Export matching functionality
export { matchCandidateToJob, getJobRecommendations } from './matching'
export type { JobMatchRequest, JobMatchResponse, JobRecommendationRequest, JobRecommendation } from './matching'

// Export parsing functionality
export { parseCVContent, generateJobRecommendations } from './parsing'
export type { CVParsingRequest, CVParsingResponse } from './parsing'

// AI utilities
export const extractSkillsFromText = async (text: string): Promise<string[]> => {
  // This would use OpenAI to extract skills from any text
  // Implementation would be similar to the parsing functions above
  return []
}

export const generateJobDescription = async (
  title: string,
  requirements: string[],
  companyInfo: string
): Promise<string> => {
  // This would use OpenAI to generate compelling job descriptions
  // Implementation would use the OpenAI client to create job postings
  return ''
}

export const detectApplicationFraud = async (
  applicationData: any
): Promise<{ isFraudulent: boolean; reasons: string[] }> => {
  // This would analyze application patterns for fraud detection
  return { isFraudulent: false, reasons: [] }
}
