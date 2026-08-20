import { createClient, type SupabaseClient } from '@supabase/supabase-js'

const url = process.env.NEXT_PUBLIC_SUPABASE_URL
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

/** 환경변수가 없으면 Supabase 없이도 화면은 그대로 동작한다 */
export const isSupabaseConfigured = Boolean(url && anonKey)

let cached: SupabaseClient | null = null

export function getSupabase() {
  if (!url || !anonKey) return null
  if (!cached) {
    cached = createClient(url, anonKey, {
      auth: { persistSession: true, autoRefreshToken: true },
    })
  }
  return cached
}
