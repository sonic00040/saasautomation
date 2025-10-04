import { createClient } from './client'

// Create a singleton instance for backward compatibility
export const supabase = createClient()

// Re-export createClient for explicit usage
export { createClient }
