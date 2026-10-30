-- Polska Adventure Ultra - baza społeczności (Supabase / Postgres)
-- Wklej całość w Supabase: SQL Editor -> New query -> Run. Skrypt można uruchamiać wielokrotnie.
--
-- Zasady bezpieczeństwa:
-- * Tabele mają włączone RLS bez żadnych polityk - z przeglądarki NIE da się ich czytać ani zmieniać bezpośrednio.
-- * Aplikacja ma dostęp wyłącznie do kilku funkcji poniżej (SECURITY DEFINER), które sprawdzają dane wejściowe.
-- * Udostępnione aktywności nie są powiązane z identyfikatorem urządzenia (minimalizacja danych - RODO).
-- * Usunąć aktywność może tylko autor (zna losowy token; w bazie trzymany jest wyłącznie jego hash SHA-256).

create table if not exists public.devices (
  id uuid primary key,
  first_seen timestamptz not null default now(),
  last_seen timestamptz not null default now()
);

create table if not exists public.activities (
  id uuid primary key default gen_random_uuid(),
  nick text not null check (char_length(nick) between 1 and 30),
  disc text not null check (disc in ('Bieg', 'Rower', 'Kajak')),
  activity_date date not null,
  dist_km numeric(7, 2) not null check (dist_km > 0 and dist_km <= 2000),
  time_min numeric(7, 1) check (time_min is null or (time_min >= 0 and time_min <= 20000)),
  route jsonb check (route is null or (jsonb_typeof(route) = 'array' and jsonb_array_length(route) <= 300)),
  delete_token_hash text not null,
  created_at timestamptz not null default now()
);

create index if not exists activities_created_at_idx on public.activities (created_at desc);

-- Zaplanowane trasy udostępnione społeczności (zakładka Trasy -> 📤).
create table if not exists public.community_routes (
  id uuid primary key default gen_random_uuid(),
  nick text not null check (char_length(nick) between 1 and 30),
  name text not null check (char_length(name) between 1 and 60),
  mode text not null check (mode in ('hiking-mountain', 'trekking', 'straight')),
  dist_km numeric(7, 2) not null check (dist_km > 0 and dist_km <= 2000),
  route jsonb not null check (jsonb_typeof(route) = 'array' and jsonb_array_length(route) between 2 and 1500),
  delete_token_hash text not null,
  created_at timestamptz not null default now()
);

create index if not exists community_routes_created_at_idx on public.community_routes (created_at desc);

alter table public.devices enable row level security;
alter table public.activities enable row level security;
alter table public.community_routes enable row level security;
revoke all on public.devices, public.activities, public.community_routes from anon, authenticated;

-- Zliczanie użytkowników (tylko za zgodą użytkownika w aplikacji). Przy okazji kasuje urządzenia
-- nieaktywne dłużej niż 13 miesięcy (retencja danych).
create or replace function public.ping(p_device uuid)
returns void language plpgsql security definer set search_path = public as $$
begin
  insert into devices (id) values (p_device)
  on conflict (id) do update set last_seen = now();
  delete from devices where last_seen < now() - interval '13 months';
end $$;

-- Wycofanie zgody na statystyki: usuwa identyfikator urządzenia z bazy.
create or replace function public.forget_device(p_device uuid)
returns void language sql security definer set search_path = public as $$
  delete from devices where id = p_device;
$$;

create or replace function public.get_stats()
returns json language sql stable security definer set search_path = public as $$
  select json_build_object(
    'users_total', (select count(*) from devices),
    'users_active_7d', (select count(*) from devices where last_seen > now() - interval '7 days'),
    'activities_total', (select count(*) from activities),
    'km_total', (select coalesce(sum(dist_km), 0) from activities),
    'routes_total', (select count(*) from community_routes)
  );
$$;

create or replace function public.share_activity(
  p_nick text, p_disc text, p_date date, p_dist_km numeric, p_time_min numeric,
  p_route jsonb, p_delete_token text
) returns uuid language plpgsql security definer set search_path = public as $$
declare
  new_id uuid;
begin
  if p_delete_token is null or char_length(p_delete_token) < 32 then
    raise exception 'invalid token';
  end if;
  if p_route is not null and octet_length(p_route::text) > 20000 then
    raise exception 'route too large';
  end if;
  -- Prosta ochrona przed spamem: limit udostępnień na minutę dla całej aplikacji.
  if (select count(*) from activities where created_at > now() - interval '1 minute')
     + (select count(*) from community_routes where created_at > now() - interval '1 minute') >= 20 then
    raise exception 'rate limit';
  end if;
  insert into activities (nick, disc, activity_date, dist_km, time_min, route, delete_token_hash)
  values (trim(p_nick), p_disc, p_date, p_dist_km, p_time_min, p_route,
          encode(sha256(convert_to(p_delete_token, 'UTF8')), 'hex'))
  returning id into new_id;
  return new_id;
end $$;

create or replace function public.delete_activity(p_id uuid, p_delete_token text)
returns boolean language plpgsql security definer set search_path = public as $$
begin
  delete from activities
  where id = p_id and delete_token_hash = encode(sha256(convert_to(p_delete_token, 'UTF8')), 'hex');
  return found;
end $$;

create or replace function public.list_activities(p_limit int default 50)
returns table (id uuid, nick text, disc text, activity_date date, dist_km numeric,
               time_min numeric, route jsonb, created_at timestamptz)
language sql stable security definer set search_path = public as $$
  select id, nick, disc, activity_date, dist_km, time_min, route, created_at
  from activities
  order by created_at desc
  limit least(greatest(coalesce(p_limit, 50), 1), 100);
$$;

create or replace function public.share_route(
  p_nick text, p_name text, p_mode text, p_dist_km numeric, p_route jsonb, p_delete_token text
) returns uuid language plpgsql security definer set search_path = public as $$
declare
  new_id uuid;
begin
  if p_delete_token is null or char_length(p_delete_token) < 32 then
    raise exception 'invalid token';
  end if;
  if p_route is null or octet_length(p_route::text) > 60000 then
    raise exception 'route too large';
  end if;
  if (select count(*) from activities where created_at > now() - interval '1 minute')
     + (select count(*) from community_routes where created_at > now() - interval '1 minute') >= 20 then
    raise exception 'rate limit';
  end if;
  insert into community_routes (nick, name, mode, dist_km, route, delete_token_hash)
  values (trim(p_nick), trim(p_name), p_mode, p_dist_km, p_route,
          encode(sha256(convert_to(p_delete_token, 'UTF8')), 'hex'))
  returning id into new_id;
  return new_id;
end $$;

create or replace function public.delete_route(p_id uuid, p_delete_token text)
returns boolean language plpgsql security definer set search_path = public as $$
begin
  delete from community_routes
  where id = p_id and delete_token_hash = encode(sha256(convert_to(p_delete_token, 'UTF8')), 'hex');
  return found;
end $$;

-- Lista bez geometrii (lekka); samą trasę pobiera get_route.
create or replace function public.list_routes(p_limit int default 50)
returns table (id uuid, nick text, name text, mode text, dist_km numeric, created_at timestamptz)
language sql stable security definer set search_path = public as $$
  select id, nick, name, mode, dist_km, created_at
  from community_routes
  order by created_at desc
  limit least(greatest(coalesce(p_limit, 50), 1), 100);
$$;

create or replace function public.get_route(p_id uuid)
returns jsonb language sql stable security definer set search_path = public as $$
  select route from community_routes where id = p_id;
$$;

-- Dostęp z aplikacji tylko do powyższych funkcji.
revoke execute on function public.ping(uuid), public.forget_device(uuid), public.get_stats(),
  public.share_activity(text, text, date, numeric, numeric, jsonb, text),
  public.delete_activity(uuid, text), public.list_activities(int),
  public.share_route(text, text, text, numeric, jsonb, text), public.delete_route(uuid, text),
  public.list_routes(int), public.get_route(uuid) from public;
grant execute on function public.ping(uuid), public.forget_device(uuid), public.get_stats(),
  public.share_activity(text, text, date, numeric, numeric, jsonb, text),
  public.delete_activity(uuid, text), public.list_activities(int),
  public.share_route(text, text, text, numeric, jsonb, text), public.delete_route(uuid, text),
  public.list_routes(int), public.get_route(uuid) to anon;
