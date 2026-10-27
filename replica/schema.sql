-- 1. AUTH & PROFILES
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

-- 2. LESSON STRUCTURE
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

-- 3. CHINESE PEDAGOGICAL CONTENT
create table characters (
  id uuid primary key default gen_random_uuid(),
  simplified char(1) not null,
  traditional char(1),
  pinyin text not null,
  tone_number int check (tone_number between 1 and 5),
  radical text,
  stroke_data jsonb not null, -- Stores the order and paths for drawing
  audio_url text,
  hsk_level int default 1,
  created_at timestamptz not null default now()
);

create table lesson_characters (
  lesson_node_id uuid references lesson_nodes(id) on delete cascade,
  character_id uuid references characters(id) on delete cascade,
  primary key (lesson_node_id, character_id)
);

-- 4. USER PROGRESS & SRS
create table user_lesson_progress (
  user_id uuid references profiles(id) on delete cascade,
  node_id uuid references lesson_nodes(id) on delete cascade,
  status text not null default 'unlocked' check (status in ('locked', 'unlocked', 'completed')),
  mastery_level int not null default 0,
  completed_at timestamptz,
  primary key (user_id, node_id)
);

create table user_character_progress (
  user_id uuid references profiles(id) on delete cascade,
  character_id uuid references characters(id) on delete cascade,
  ease_factor float not null default 2.5,
  interval int not null default 0,
  next_review_at timestamptz not null default now(),
  last_reviewed_at timestamptz,
  primary key (user_id, character_id)
);

-- 5. INDEXES
create index idx_profiles_xp on profiles(xp_total desc);
create index idx_lesson_nodes_order on lesson_nodes(order_index);
create index idx_user_srs_next_review on user_character_progress(user_id, next_review_at);

-- 6. SECURITY (RLS)
alter table profiles enable row level security;
alter table user_lesson_progress enable row level security;
alter table user_character_progress enable row level security;

create policy "Users can only view their own profile" on profiles
  for select using (auth.uid() = id);

create policy "Users can only update their own profile" on profiles
  for update using (auth.uid() = id);

create policy "Users can manage their own progress" on user_lesson_progress
  for all using (auth.uid() = user_id);

create policy "Users can manage their own srs data" on user_character_progress
  for all using (auth.uid() = user_id);
