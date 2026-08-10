-- 사회적협동조합 플러스평택 홈페이지 관리자용 Supabase 설정
-- 주의: Supabase SQL Editor에서 한 번 실행합니다.

create extension if not exists pgcrypto;

create table if not exists public.admin_users (
  user_id uuid primary key references auth.users(id) on delete cascade,
  email text unique,
  created_at timestamptz not null default now()
);

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists(select 1 from public.admin_users where user_id = auth.uid());
$$;
revoke all on function public.is_admin() from public;
grant execute on function public.is_admin() to anon, authenticated;


-- 공개 가능한 기관 기본정보(현재는 팩스번호를 관리자에서 관리)
create table if not exists public.site_settings (
  id text primary key,
  fax text not null default '',
  updated_at timestamptz not null default now()
);
insert into public.site_settings(id,fax) values ('contact','') on conflict (id) do nothing;
alter table public.site_settings enable row level security;
drop policy if exists "public read site settings" on public.site_settings;
create policy "public read site settings" on public.site_settings for select using (true);
drop policy if exists "admin insert site settings" on public.site_settings;
create policy "admin insert site settings" on public.site_settings for insert to authenticated with check (public.is_admin());
drop policy if exists "admin update site settings" on public.site_settings;
create policy "admin update site settings" on public.site_settings for update to authenticated using (public.is_admin()) with check (public.is_admin());

create table if not exists public.posts (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  category text not null default '공지',
  body text not null default '',
  published_at date not null default current_date,
  pinned boolean not null default false,
  published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.gallery (
  id uuid primary key default gen_random_uuid(),
  title text not null default '활동 사진',
  description text not null default '',
  image_url text not null,
  image_path text,
  shot_date date,
  sort_order integer not null default 0,
  published boolean not null default true,
  created_at timestamptz not null default now()
);

alter table public.admin_users enable row level security;
alter table public.posts enable row level security;
alter table public.gallery enable row level security;

drop policy if exists "public read published posts" on public.posts;
create policy "public read published posts" on public.posts for select using (published = true or public.is_admin());
drop policy if exists "admin insert posts" on public.posts;
create policy "admin insert posts" on public.posts for insert to authenticated with check (public.is_admin());
drop policy if exists "admin update posts" on public.posts;
create policy "admin update posts" on public.posts for update to authenticated using (public.is_admin()) with check (public.is_admin());
drop policy if exists "admin delete posts" on public.posts;
create policy "admin delete posts" on public.posts for delete to authenticated using (public.is_admin());

drop policy if exists "public read published gallery" on public.gallery;
create policy "public read published gallery" on public.gallery for select using (published = true or public.is_admin());
drop policy if exists "admin insert gallery" on public.gallery;
create policy "admin insert gallery" on public.gallery for insert to authenticated with check (public.is_admin());
drop policy if exists "admin update gallery" on public.gallery;
create policy "admin update gallery" on public.gallery for update to authenticated using (public.is_admin()) with check (public.is_admin());
drop policy if exists "admin delete gallery" on public.gallery;
create policy "admin delete gallery" on public.gallery for delete to authenticated using (public.is_admin());

-- 관리자 목록은 일반 사용자에게 공개하지 않습니다.
drop policy if exists "admins see admin list" on public.admin_users;
create policy "admins see admin list" on public.admin_users for select to authenticated using (public.is_admin());

-- 사진 저장 버킷
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('media','media',true,10485760,array['image/jpeg','image/png','image/webp'])
on conflict (id) do update set public=true, file_size_limit=10485760, allowed_mime_types=array['image/jpeg','image/png','image/webp'];

drop policy if exists "public read media" on storage.objects;
create policy "public read media" on storage.objects for select using (bucket_id='media');
drop policy if exists "admin upload media" on storage.objects;
create policy "admin upload media" on storage.objects for insert to authenticated with check (bucket_id='media' and public.is_admin());
drop policy if exists "admin update media" on storage.objects;
create policy "admin update media" on storage.objects for update to authenticated using (bucket_id='media' and public.is_admin()) with check (bucket_id='media' and public.is_admin());
drop policy if exists "admin delete media" on storage.objects;
create policy "admin delete media" on storage.objects for delete to authenticated using (bucket_id='media' and public.is_admin());

-- 관리자 계정은 Supabase Authentication > Users에서 먼저 만든 뒤 아래처럼 등록합니다.
-- 아래 UUID는 실제 사용자 UUID로 교체하세요.
-- insert into public.admin_users(user_id,email) values ('관리자1-UUID','pluspt1007@kakao.com');
