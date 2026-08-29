-- Full schema for a fresh Supabase project backing this storefront.
-- Run this once in the Supabase SQL editor. Safe to re-run (idempotent).
-- After running, tell Claude — it'll migrate the built-in blog articles
-- via the service role key.

create table if not exists products (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text unique not null,
  description text,
  short_description text,
  price numeric(10,2) not null default 0,
  compare_at_price numeric(10,2),
  sku text,
  volume_ml integer not null default 0,
  active_ingredient text,
  units_in_stock integer not null default 0,
  is_featured boolean not null default false,
  is_active boolean not null default true,
  image_urls text[] not null default '{}',
  dosage_form text not null default 'Solid',
  therapeutic_class text,
  requires_prescription boolean not null default false,
  manufacturer text,
  storage_instructions text,
  side_effects text,
  min_quantity integer not null default 1,
  created_at timestamptz not null default now()
);

-- Nothing in the current checkout flow writes to this yet (orders are only
-- emailed, not persisted) — kept so the admin dashboard's stats query works
-- instead of erroring on a missing table.
create table if not exists orders (
  id uuid primary key default gen_random_uuid(),
  customer_name text,
  customer_email text,
  total_amount numeric(10,2) not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text,
  role text not null default 'admin',
  created_at timestamptz not null default now()
);

create table if not exists blog_posts (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  title text not null,
  category text not null,
  excerpt text not null,
  content_html text not null default '',
  featured_image text,
  is_published boolean not null default true,
  is_safety_content boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table products enable row level security;
alter table orders enable row level security;
alter table profiles enable row level security;
alter table blog_posts enable row level security;

drop policy if exists "Public can read active products" on products;
create policy "Public can read active products" on products for select to anon using (is_active = true);

drop policy if exists "Authenticated full access products" on products;
create policy "Authenticated full access products" on products for all to authenticated using (true) with check (true);

drop policy if exists "Authenticated full access orders" on orders;
create policy "Authenticated full access orders" on orders for all to authenticated using (true) with check (true);

drop policy if exists "Users manage own profile" on profiles;
create policy "Users manage own profile" on profiles for all to authenticated using (auth.uid() = id) with check (auth.uid() = id);

drop policy if exists "Public can read published posts" on blog_posts;
create policy "Public can read published posts" on blog_posts for select to anon using (is_published = true);

-- Insert/update/delete happen only through the /api/blog* routes (service role,
-- gated by the blog admin passcode + a valid Supabase session) — authenticated
-- users get read access only, not direct write access via the client.
drop policy if exists "Authenticated users have full access" on blog_posts;
drop policy if exists "Authenticated can read all posts" on blog_posts;
create policy "Authenticated can read all posts" on blog_posts for select to authenticated using (true);
