create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text not null,
  avatar_url text,
  created_at timestamptz not null default now()
);

create table public.stories (
  id uuid primary key default gen_random_uuid(),
  author_id uuid not null references public.profiles(id) on delete cascade,
  title text not null,
  details text not null,
  category text not null check (category in ('technology', 'climate', 'community', 'style')),
  location text,
  image_url text,
  created_at timestamptz not null default now()
);

create table public.comments (
  id uuid primary key default gen_random_uuid(),
  story_id uuid not null references public.stories(id) on delete cascade,
  author_id uuid not null references public.profiles(id) on delete cascade,
  body text not null check (char_length(body) between 1 and 240),
  created_at timestamptz not null default now()
);

create table public.story_likes (
  story_id uuid not null references public.stories(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (story_id, user_id)
);

create table public.story_saves (
  story_id uuid not null references public.stories(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (story_id, user_id)
);

create table public.payment_events (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles(id) on delete set null,
  provider text not null check (provider in ('mpesa', 'stripe', 'paypal')),
  provider_reference text,
  amount numeric(12, 2) not null check (amount >= 0),
  currency text not null default 'KES',
  status text not null default 'pending' check (status in ('pending', 'paid', 'failed', 'refunded')),
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;
alter table public.stories enable row level security;
alter table public.comments enable row level security;
alter table public.story_likes enable row level security;
alter table public.story_saves enable row level security;
alter table public.payment_events enable row level security;

create policy "Public profiles are readable" on public.profiles for select using (true);
create policy "Users manage their profile" on public.profiles for all using (auth.uid() = id) with check (auth.uid() = id);
create policy "Published stories are readable" on public.stories for select using (true);
create policy "Signed-in users create stories" on public.stories for insert with check (auth.uid() = author_id);
create policy "Authors update stories" on public.stories for update using (auth.uid() = author_id);
create policy "Comments are readable" on public.comments for select using (true);
create policy "Signed-in users create comments" on public.comments for insert with check (auth.uid() = author_id);
create policy "Authors delete comments" on public.comments for delete using (auth.uid() = author_id);
create policy "Likes are readable" on public.story_likes for select using (true);
create policy "Users manage their likes" on public.story_likes for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "Users manage their saves" on public.story_saves for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "Users read their payments" on public.payment_events for select using (auth.uid() = user_id);
