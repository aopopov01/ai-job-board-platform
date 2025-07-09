// Environment validation utility

export function validateEnvironment(): void {
  const requiredEnvVars = [
    'NEXT_PUBLIC_SUPABASE_URL',
    'SUPABASE_SERVICE_ROLE_KEY'
  ]

  const missingVars = requiredEnvVars.filter(varName => !process.env[varName])

  if (missingVars.length > 0) {
    throw new Error(`Missing required environment variables: ${missingVars.join(', ')}`)
  }
}

export function getEnvVar(name: string, defaultValue?: string): string {
  const value = process.env[name]
  if (!value && defaultValue === undefined) {
    throw new Error(`Environment variable ${name} is required but not set`)
  }
  return value || defaultValue!
}

export function getSupabaseConfig() {
  return {
    url: getEnvVar('NEXT_PUBLIC_SUPABASE_URL'),
    serviceRoleKey: getEnvVar('SUPABASE_SERVICE_ROLE_KEY'),
    anonKey: getEnvVar('NEXT_PUBLIC_SUPABASE_ANON_KEY', '')
  }
}