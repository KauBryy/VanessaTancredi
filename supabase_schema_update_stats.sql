-- TABLE: SITE_STATS
create table public.site_stats (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  page_path text,
  page_title text,
  visitor_id text, -- stored in localStorage for uniqueness tracking
  is_admin boolean default false
);

-- Enable RLS
alter table public.site_stats enable row level security;

-- Policies for Site Stats
-- Anyone can insert (anonymous tracking)
create policy "Anyone can insert stats."
  on public.site_stats for insert
  with check ( true );

-- Only admins can view stats
create policy "Admins can view stats."
  on public.site_stats for select
  using ( auth.role() = 'authenticated' );
