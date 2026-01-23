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
  features text[], -- Array of strings
  marketing_status text default 'Disponible', -- 'Nouveauté', 'Exclusivité', 'Sous Offre', 'Vendu'
  dpe_energy text, -- 'A' to 'G'
  dpe_ges text -- 'A' to 'G'
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

-- TABLE: CITIES
create table public.cities (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  name text not null unique
);

-- Enable RLS for Cities
alter table public.cities enable row level security;

-- Policies for Cities
-- Everyone can read
create policy "Public cities are viewable by everyone."
  on public.cities for select
  using ( true );

-- Only admins can insert/update/delete
create policy "Admins can insert cities."
  on public.cities for insert
  with check ( auth.role() = 'authenticated' );

create policy "Admins can update cities."
  on public.cities for update
  using ( auth.role() = 'authenticated' );

  using ( auth.role() = 'authenticated' );

-- Update Cities Table to include Sector
alter table public.cities add column if not exists sector text;

-- Insert Default Data (Safe insert)
insert into public.cities (name, sector)
values 
  ('Longwy', 'Bassin de Longwy & Frontières'),
  ('Mont-Saint-Martin', 'Bassin de Longwy & Frontières'),
  ('Herserange', 'Bassin de Longwy & Frontières'),
  ('Réhon', 'Bassin de Longwy & Frontières'),
  ('Lexy', 'Bassin de Longwy & Frontières'),
  ('Villers-la-Montagne', 'Bassin de Longwy & Frontières'),
  ('Saulnes', 'Bassin de Longwy & Frontières'),
  
  ('Mercy-le-Bas', 'Cœur de Secteur (Pays-Haut)'),
  ('Joppécourt', 'Cœur de Secteur (Pays-Haut)'),
  ('Boismont', 'Cœur de Secteur (Pays-Haut)'),
  ('Bazailles', 'Cœur de Secteur (Pays-Haut)'),
  ('Ville-au-Montois', 'Cœur de Secteur (Pays-Haut)'),
  ('Fillières', 'Cœur de Secteur (Pays-Haut)'),
  ('Boudrezy', 'Cœur de Secteur (Pays-Haut)'),
  
  ('Longuyon', 'Secteur Longuyon & Environs'),
  ('Pierrepont', 'Secteur Longuyon & Environs'),
  ('Arrancy-sur-Crusnes', 'Secteur Longuyon & Environs'),
  ('Beuveille', 'Secteur Longuyon & Environs'),
  ('Doncourt-lès-Longuyon', 'Secteur Longuyon & Environs'),
  ('Spincourt', 'Secteur Longuyon & Environs'),
  
  ('Boulange', 'Secteur Boulange / Audun'),
  ('Aumetz', 'Secteur Boulange / Audun'),
  ('Audun-le-Roman', 'Secteur Boulange / Audun'),
  ('Ottange', 'Secteur Boulange / Audun'),
  ('Trieux', 'Secteur Boulange / Audun'),
  ('Hayange', 'Secteur Boulange / Audun')
on conflict (name) do update set sector = excluded.sector;

