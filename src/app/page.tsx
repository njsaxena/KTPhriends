import { redirect } from "next/navigation";

export default async function RootPage() {
  // For now, go straight to dashboard (uses mock data).
  // This avoids crashing when Supabase env vars are not configured yet.
  redirect("/dashboard");
}
