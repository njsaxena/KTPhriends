// ─────────────────────────────────────────────────────────
// Supabase client helpers
//
// Usage:
//   Browser components  → import { createClient } from "@/lib/supabase/client"
//   Server components   → import { createClient } from "@/lib/supabase/server"
//   Route handlers      → import { createClient } from "@/lib/supabase/server"
// ─────────────────────────────────────────────────────────

// src/lib/supabase/client.ts
import { createBrowserClient } from "@supabase/ssr";
import { getSupabaseAnonKey } from "./config";

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    getSupabaseAnonKey()!
  );
}
