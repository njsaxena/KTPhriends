// ─────────────────────────────────────────────────────────
// KTPhriends — Shared TypeScript Types
// Mirror of the Supabase database schema.
// ─────────────────────────────────────────────────────────

export type UserRole = "pledge" | "brother" | "admin";

export type Profile = {
  id: string;                   // UUID — matches auth.users.id
  email: string;
  full_name: string;
  initials: string;             // Derived: first + last initial
  role: UserRole;
  major: string | null;
  grad_year: number | null;
  ktp_role: string | null;      // e.g. "Treasurer", "VP", "Member"
  bio: string | null;
  avatar_color: "blue" | "green"; // Alternates for visual variety
  available_this_week: boolean;
  budget_max: number;           // Max $/chat (0–40)
  locations: string[];          // Preferred neighborhoods
  transport: string[];          // Walking, T, Bike, Car
  food_prefs: string[];
  sports: string[];
  hobbies: string[];
  preferred_spots: string[];    // Specific café/spot names
  profile_complete: boolean;
  created_at: string;
  updated_at: string;
};

// 98 time blocks: 7 days × 14 half-hour slots (8am–9pm)
// Stored as a flat array of "day,slot" strings e.g. ["0,0","0,1","1,3"]
export type Availability = {
  id: string;
  user_id: string;
  time_blocks: string[];        // ["day,slot", ...] — day 0=Mon, slot 0=8am
  week_of: string | null;       // ISO date string for the Monday of that week
  created_at: string;
  updated_at: string;
};

export type ChatStatus = "requested" | "confirmed" | "completed" | "cancelled";

export type ChatRequest = {
  id: string;
  pledge_id: string;            // FK → profiles.id
  brother_id: string;           // FK → profiles.id
  status: ChatStatus;
  proposed_time: string | null; // ISO datetime
  confirmed_time: string | null;
  location: string | null;
  pledge_note: string | null;   // Optional message from pledge
  pledge_marked_complete: boolean;
  brother_marked_complete: boolean;
  created_at: string;
  updated_at: string;
  // Joined fields (not in DB — populated by queries)
  pledge?: Pick<Profile, "id" | "full_name" | "initials" | "avatar_color">;
  brother?: Pick<Profile, "id" | "full_name" | "initials" | "avatar_color" | "major" | "ktp_role" | "preferred_spots">;
};

// ─── Matching ───────────────────────────────────────────
export type MatchWeights = {
  budget: number;       // default 0.30
  proximity: number;    // default 0.25
  time: number;         // default 0.20
  food: number;         // default 0.12
  sports: number;       // default 0.07
  hobbies: number;      // default 0.06
};

export type ScoreBreakdown = {
  total: number;
  budget: number;
  proximity: number;
  time: number;
  food: number;
  sports: number;
  hobbies: number;
};

export type BrotherWithScore = Profile & {
  score: number;
  scoreBreakdown: ScoreBreakdown;
  availability: Availability | null;
};

// ─── Admin ──────────────────────────────────────────────
export type PledgeStats = {
  pledge: Pick<Profile, "id" | "full_name" | "major" | "grad_year">;
  chats_completed: number;
  chats_confirmed: number;
  chats_requested: number;
  last_chat_date: string | null;
};
