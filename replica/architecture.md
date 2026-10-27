# Architecture: Hybrid Mandarin Learning App

## 1. The Stack

| Layer | Choice | Why |
| --- | --- | --- |
| Web App | React (Vite) + TypeScript | Modern, fast development, and matches the existing project structure. |
| Styling | Tailwind CSS | Rapid UI building and consistent design tokens. |
| Database | Postgres (Supabase) | Robust relational data with built-in Auth and Realtime for heart refills. |
| ORM | Drizzle | Type-safe SQL builder that plays well with Supabase and TypeScript. |
| Auth | Supabase Auth | Seamless integration with the database and social login support. |
| State Management | React Context + XState | Context for global gamification; XState for the complex lesson loop logic. |
| Hosting | Vercel | Native support for Vite and excellent edge function performance. |

## 2. The Schema

```sql
-- Users and Gamification
create table profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  username text unique,
  streak_count int not null default 0,
  hearts_balance int not null default 5 check (hearts_balance between 0 and 5),
  last_heart_refill timestamptz not null default now(),
  xp_total bigint not null default 0,
  daily_goal_xp int not null default 50,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- The Snake Path Structure
create table lesson_nodes (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  category text not null,
  position_x int not null,
  position_y int not null,
  order_index int not null unique,
  is_bonus boolean default false,
  created_at timestamptz not null default now()
);

-- Pedagogical Content
create table characters (
  id uuid primary key default gen_random_uuid(),
  simplified char(1) not null,
  traditional char(1),
  pinyin text not null,
  tone_number int check (tone_number between 1 and 5),
  radical text,
  stroke_data jsonb not null, -- SVG path coordinates for animation/validation
  audio_url text,
  hsk_level int default 1,
  created_at timestamptz not null default now()
);

-- Junction for characters in lessons
create table lesson_characters (
  lesson_node_id uuid references lesson_nodes(id) on delete cascade,
  character_id uuid references characters(id) on delete cascade,
  primary key (lesson_node_id, character_id)
);

-- User Progress Tracking
create table user_lesson_progress (
  user_id uuid references profiles(id) on delete cascade,
  node_id uuid references lesson_nodes(id) on delete cascade,
  status text not null default 'unlocked' check (status in ('locked', 'unlocked', 'completed')),
  mastery_level int not null default 0,
  completed_at timestamptz,
  primary key (user_id, node_id)
);

-- Spaced Repetition (SRS)
create table user_character_progress (
  user_id uuid references profiles(id) on delete cascade,
  character_id uuid references characters(id) on delete cascade,
  ease_factor float not null default 2.5,
  interval int not null default 0,
  next_review_at timestamptz not null default now(),
  last_reviewed_at timestamptz,
  primary key (user_id, character_id)
);

-- Enable RLS
alter table profiles enable row level security;
create policy "Users can update their own profile." on profiles for update using (auth.uid() = id);
create policy "Profiles are viewable by owner." on profiles for select using (auth.uid() = id);
```

## 3. The API (Actions & Hooks)

| Method/Action | What it does | Who | Input | Output |
| --- | --- | --- | --- | --- |
| `usePathData` | Fetches snake nodes + user progress | User | - | `LessonNode[]`, `UserProgress[]` |
| `completeLesson` | Updates XP, checks streak, increments mastery | User | `node_id`, `xp_earned` | `UpdatedProfile`, `Progress` |
| `depleteHeart` | Deducts 1 heart on error | User | - | `NewHeartCount`, `RefillTimestamp` |
| `saveReview` | Updates SRS data for a character | User | `character_id`, `quality (0-5)` | `NextReviewDate` |
| `getCharacterData` | Fetches stroke/audio for specific char | All | `char_id` | `CharacterDetail` |

## 4. The Parts that Bite

- **Pitch Normalization:** Comparing a deep male voice to a high female reference in Tone Training requires normalizing frequency to a 0-1 scale based on individual range.
- **Stroke "Sloppiness" Tolerance:** Users rarely write perfect SVG paths; validation needs a distance threshold and direction tolerance.
- **Heart Refill Sync:** Clientside timer must stay perfectly in sync with server-side `last_heart_refill` to prevent "infinite hearts" exploits.
- **Offline Sync:** If a user completes a lesson in a subway, the completion must be queued and retried when online to preserve streaks.

## 5. Build Order

1. **Vertical Slice (S01, S02, S05):** 
   - Static Snake Map.
   - Lesson Player with MCQ only.
   - Profile update (XP + Streak) on completion.
   - Tables: `profiles`, `lesson_nodes`, `user_lesson_progress`.

2. **Must-Haves (Pedagogy focus):**
   - Stroke Order Trainer integration (`<HanziCanvas />`).
   - Tables: `characters`, `lesson_characters`.

3. **Gamification Polish:**
   - Hearts System with background refill timers.
   - Streak fire animations and sound effects.

4. **Advanced Pedagogy (S04, S06):**
   - Tone Trainer with Web Audio visualization.
   - SRS Review module with Spaced Repetition logic.
   - Table: `user_character_progress`.
