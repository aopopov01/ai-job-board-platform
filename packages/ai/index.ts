// Export AI client
export { getOpenAIClient } from './client'
export type { OpenAI } from './client'

// Export matching functionality
export { matchCandidateToJob, getJobRecommendations } from './matching'
export type { JobMatchRequest, JobMatchResponse, JobRecommendationRequest, JobRecommendation } from './matching'

// Export parsing functionality
export { parseCVContent, generateJobRecommendations, screenApplication } from './parsing'
export type { CVParsingRequest, CVParsingResponse, ApplicationScreeningRequest, ApplicationScreeningResponse } from './parsing'

// Export advanced matching functionality
export { performAdvancedMatching, performBatchMatching, detectApplicationFraud } from './advanced-matching'
export type { AdvancedMatchingRequest, AdvancedMatchingResponse, BatchMatchingRequest, BatchMatchingResponse, FraudDetectionRequest, FraudDetectionResponse } from './advanced-matching'

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

export const analyzeApplicationPattern = async (
  applicationData: any
): Promise<{ isSuspicious: boolean; patterns: string[] }> => {
  // This would analyze application patterns for suspicious behavior
  return { isSuspicious: false, patterns: [] }
}
