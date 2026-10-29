import { createClient } from "@supabase/supabase-js";

const rawUrl = (import.meta.env.VITE_SUPABASE_URL as string | undefined)?.trim() ?? "";
const anonKey = (import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined)?.trim() ?? "";

function isValidSupabaseUrl(value: string) {
  if (!value) return false;
  try {
    const parsed = new URL(value);
    return (parsed.protocol === "https:" || parsed.protocol === "http:") && Boolean(parsed.hostname);
  } catch {
    return false;
  }
}

// Invalid/missing environment values must not crash module initialization.
// The auth screen can then show a setup warning instead of a blank page.
export const supabase = isValidSupabaseUrl(rawUrl) && anonKey
  ? createClient(rawUrl, anonKey, {
      auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true },
    })
  : null;

if (!supabase && import.meta.env.DEV) {
  console.warn("Supabase auth is not configured. Set a valid VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.");
}

export const ADMIN_EMAIL = "kshitiz2007@gmail.com";

export function isAdminEmail(email?: string | null) {
  return (email ?? "").trim().toLowerCase() === ADMIN_EMAIL;
}
