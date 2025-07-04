import OpenAI from 'openai'

let openai: OpenAI | null = null

export const getOpenAIClient = (): OpenAI => {
  if (!openai) {
    const apiKey = process.env.OPENAI_API_KEY
    
    if (!apiKey) {
      throw new Error('OPENAI_API_KEY environment variable is not set')
    }
    
    openai = new OpenAI({
      apiKey: apiKey
    })
  }
  
  return openai
}

export type { OpenAI }
