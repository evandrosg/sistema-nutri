import { createClient, SupabaseAuthAdapter } from '@neondatabase/neon-js'

const neonAuthUrl = import.meta.env.VITE_NEON_AUTH_URL || 'https://ep-fancy-dew-ackm4d31.neonauth.sa-east-1.aws.neon.tech/neondb/auth'
const neonDataApiUrl = import.meta.env.VITE_NEON_DATA_API_URL || 'https://ep-fancy-dew-ackm4d31.apirest.sa-east-1.aws.neon.tech/neondb/rest/v1'

export const supabase = createClient({
  auth: {
    url: neonAuthUrl,
    adapter: SupabaseAuthAdapter(),
  },
  dataApi: {
    url: neonDataApiUrl,
  },
})
