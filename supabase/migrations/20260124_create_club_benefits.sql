-- Create club_benefits table
create table public.club_benefits (
  id uuid not null default gen_random_uuid(),
  created_at timestamp with time zone not null default now(),
  updated_at timestamp with time zone not null default now(),
  
  partner_name text not null,
  description text not null,
  discount_code text,
  image_url text, -- URL to partner logo or promo image
  category text not null, -- e.g., 'restauracion', 'deporte', 'ocio'
  
  is_active boolean default true,
  priority integer default 0, -- Higher number = show first
  
  constraint club_benefits_pkey primary key (id)
);

-- Enable RLS
alter table public.club_benefits enable row level security;

-- Policies
-- 1. Everyone can view active benefits
create policy "Public can view active benefits" 
on public.club_benefits for select 
using (is_active = true);

-- 2. Admins can do everything (insert, update, delete)
-- Assuming you have a way to identify admins, e.g., checking public.user_roles
create policy "Admins can manage club benefits" 
on public.club_benefits for all 
using (
  exists (
    select 1 from public.user_roles ur
    where ur.user_id = auth.uid()
    and ur.role = 'admin'
  )
);
