# KTPhriends

Coffee chat matching app for **Kappa Theta Pi** pledges at Boston University.

Built with **Next.js 14 (App Router)**, **TypeScript**, **Tailwind CSS**, and **Supabase**.

---

## Project structure

```
src/
├── app/                   # Next.js App Router pages
│   ├── layout.tsx         # Root layout (fonts, global CSS)
│   ├── page.tsx           # Root redirect → /dashboard
│   ├── login/page.tsx     # Magic-link login
│   ├── auth/callback/     # Supabase OAuth callback
│   ├── dashboard/page.tsx # Home dashboard
│   ├── browse/page.tsx    # Browse & filter brothers
│   ├── chats/page.tsx     # My coffee chats
│   ├── availability/page.tsx  # Weekly availability grid
│   ├── profile/page.tsx   # Profile wizard (5-step)
│   └── admin/page.tsx     # Exec board dashboard
├── components/
│   ├── AppLayout.tsx      # Sidebar + shell (shared)
│   ├── ui.tsx             # Reusable UI primitives
│   ├── BrotherCard.tsx    # Card in browse grid
│   ├── BrotherModal.tsx   # Profile + request modal
│   └── AvailabilityGrid.tsx  # When2Meet-style grid
├── lib/
│   ├── matching.ts        # Weighted matching algorithm (pure functions)
│   ├── mockData.ts        # Dev mock data (replace with Supabase)
│   ├── supabase/
│   │   ├── client.ts      # Browser Supabase client
│   │   └── server.ts      # Server Supabase client
├── styles/
│   └── globals.css        # Design tokens + Tailwind base
└── types/
    └── index.ts           # All TypeScript types
supabase/
└── schema.sql             # Full DB schema — run in Supabase SQL editor
```

---

## Quick start

### 1. Install dependencies
```bash
npm install
```

### 2. Set up Supabase

1. Create a project at [supabase.com](https://supabase.com)
2. Go to **SQL Editor** and run `supabase/schema.sql` to create all tables, RLS policies, and triggers
3. In **Authentication → URL Configuration**, add:
   - Site URL: `http://localhost:3000`
   - Redirect URL: `http://localhost:3000/auth/callback`

### 3. Configure environment variables
```bash
cp .env.local.example .env.local
```

Fill in `.env.local`:
```
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 4. Run dev server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

> **Note:** The app currently runs entirely on **mock data** (see `src/lib/mockData.ts`). All pages work without Supabase. Connect the backend by following the TODO comments in each page file.

---

## Connecting the backend

Each page file has `// TODO:` comments showing exactly where to swap mock data for Supabase queries. The pattern is consistent:

```ts
// BEFORE (mock data):
const brothers = MOCK_BROTHERS;

// AFTER (Supabase):
const supabase = createClient();
const { data: brothers } = await supabase
  .from("profiles")
  .select("*")
  .eq("role", "brother")
  .eq("profile_complete", true);
```

### Key Supabase operations to implement

| Feature | Table | Operation |
|---|---|---|
| Load brothers | `profiles` | `select * where role = 'brother'` |
| Save profile | `profiles` | `upsert` |
| Save availability | `availability` | `upsert` |
| Send chat request | `chat_requests` | `insert` |
| Confirm / complete chat | `chat_requests` | `update status` |
| Admin stats | `chat_requests` + `profiles` | `select + join` |

---

## Matching algorithm

See `src/lib/matching.ts`. All pure functions — no side effects, easy to test.

**Default weights (must sum to 1.0):**

| Dimension | Weight | Scoring method |
|---|---|---|
| Budget | 30% | Interval intersection |
| Proximity | 25% | Tag overlap fraction |
| Time overlap | 20% | Block intersection (capped at 6) |
| Food & drink | 12% | Jaccard similarity |
| Sports | 7% | Jaccard similarity |
| Hobbies | 6% | Jaccard similarity |

To adjust weights, edit `DEFAULT_WEIGHTS` in `matching.ts`. Weights are currently hardcoded but can be made configurable per pledge by storing them in `profiles`.

---

## Deployment (Vercel)

```bash
npm run build   # check for errors first
```

1. Push to GitHub
2. Import repo in [vercel.com](https://vercel.com)
3. Add environment variables (same as `.env.local`)
4. Deploy — Vercel auto-detects Next.js

Update Supabase **Authentication → URL Configuration** to add your production URL.

---

## Design system

**Colors:**
- Primary blue: `#458EFF`
- Blue light: `#8BB9FF`  
- Green: `#538b52`
- Green mid: `#8ddd88`

**Fonts:** DM Sans (UI) + DM Mono (scores/data)

**Spacing:** 8px grid (4 / 8 / 16 / 24 / 32 / 48 / 64px)

All design tokens are CSS variables in `globals.css`.

---

## Roles

| Role | Can do |
|---|---|
| `pledge` | Browse brothers, set availability, request chats, manage own profile |
| `brother` | Set availability + profile, confirm/complete chats |
| `admin` | Everything above + admin dashboard, CSV export |

Role is set in the `profiles` table. Default on signup is `pledge`. An admin must manually promote users to `brother` or `admin` via Supabase dashboard or a future admin UI.
