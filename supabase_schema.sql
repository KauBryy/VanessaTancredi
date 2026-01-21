-- Enable Row Level Security
alter default privileges in schema public grant all on tables to postgres, anon, authenticated, service_role;

-- TABLE: PROPERTIES
create table public.properties (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  title text not null,
  catch_phrase text,
  price numeric not null,
  type text not null, -- 'Maison', 'Appartement', 'Terrain'
  status text not null default 'Vente', -- 'Vente', 'Location'
  surface numeric,
  rooms numeric,
  city text not null,
  description text,
  image_url text,
  images text[], -- Array of image URLs (gallery)
  features text[] -- Array of strings
);

-- Enable RLS
alter table public.properties enable row level security;

-- Policies for Properties
-- Everyone can read
create policy "Public properties are viewable by everyone."
  on public.properties for select
  using ( true );

-- Only authenticated users (admins) can insert/update/delete
create policy "Admins can insert properties."
  on public.properties for insert
  with check ( auth.role() = 'authenticated' );

create policy "Admins can update properties."
  on public.properties for update
  using ( auth.role() = 'authenticated' );

create policy "Admins can delete properties."
  on public.properties for delete
  using ( auth.role() = 'authenticated' );


-- TABLE: LEADS (Contact forms)
create table public.leads (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  name text not null,
  phone text,
  email text,
  message text,
  treated boolean default false
);

-- Enable RLS
alter table public.leads enable row level security;

-- Policies for Leads
-- Anyone can insert (submit form)
create policy "Anyone can submit a lead."
  on public.leads for insert
  with check ( true );

-- Only admins can view leads
create policy "Admins can view leads."
  on public.leads for select
  using ( auth.role() = 'authenticated' );


-- STORAGE BUCKET: property-images
insert into storage.buckets (id, name, public) 
values ('property-images', 'property-images', true);

-- Storage Policies
create policy "Property images are publicly accessible."
  on storage.objects for select
  using ( bucket_id = 'property-images' );

create policy "Admins can upload property images."
  on storage.objects for insert
  with check ( bucket_id = 'property-images' and auth.role() = 'authenticated' );

create policy "Admins can delete property images."
  on storage.objects for delete
  using ( bucket_id = 'property-images' and auth.role() = 'authenticated' );
