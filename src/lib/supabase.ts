import { createClient, type SupabaseClient } from '@supabase/supabase-js'

const url = process.env.NEXT_PUBLIC_SUPABASE_URL

/**
 * 브라우저에 실려 나가는 공개 키.
 * Supabase가 새로 권장하는 publishable 키(sb_publishable_...)를 먼저 쓰고,
 * 예전 anon 키만 설정된 환경도 그대로 동작하도록 뒤에 둔다.
 */
const publicKey =
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

/** 환경변수가 없으면 Supabase 없이도 화면은 그대로 동작한다 */
export const isSupabaseConfigured = Boolean(url && publicKey)

let cached: SupabaseClient | null = null

export function getSupabase() {
  if (!url || !publicKey) return null
  if (!cached) {
    cached = createClient(url, publicKey, {
      auth: { persistSession: true, autoRefreshToken: true },
    })
  }
  return cached
}
