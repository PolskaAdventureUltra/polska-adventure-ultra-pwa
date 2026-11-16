-- Polska Adventure Ultra - baza społeczności (Supabase / Postgres)
-- Wklej całość w Supabase: SQL Editor -> New query -> Run. Skrypt można uruchamiać wielokrotnie.
--
-- Zasady bezpieczeństwa:
-- * Tabele mają włączone RLS bez żadnych polityk - z przeglądarki NIE da się ich czytać ani zmieniać bezpośrednio.
-- * Aplikacja ma dostęp wyłącznie do kilku funkcji poniżej (SECURITY DEFINER), które sprawdzają dane wejściowe.
-- * Udostępnione aktywności nie są powiązane z identyfikatorem urządzenia (minimalizacja danych - RODO).
-- * Usunąć aktywność może tylko autor (zna losowy token; w bazie trzymany jest wyłącznie jego hash SHA-256).
-- * Wydarzenia dodaje i usuwa wyłącznie administrator (klucz organizatora; w bazie tylko jego hash SHA-256).
--   Klucz dodaje się ręcznie: insert into public.admin_keys (key_hash, label) values ('<hash>', 'opis');
-- * Kody zaproszenia pozwalają wybranym osobom dołączyć do wyzwania przed oficjalnymi zapisami
--   (tylko hash SHA-256 kodu): insert into public.challenge_invites (code_hash, label) values ('<hash>', 'imię');
--   Kod przypisuje się do pierwszego urządzenia; zwolnienie (np. nowy telefon):
--   update public.challenge_invites set claimed_token_hash = null, claimed_at = null where label = 'imię';

create table if not exists public.devices (
  id uuid primary key,
  first_seen timestamptz not null default now(),
  last_seen timestamptz not null default now()
);

create table if not exists public.activities (
  id uuid primary key default gen_random_uuid(),
  nick text not null check (char_length(nick) between 1 and 30),
  disc text not null check (disc in ('Bieg', 'Rower', 'Kajak', 'Basen', 'WodyOtwarte', 'Trekking')),
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

-- Wydarzenia (wspólne treningi, spływy, rajdy) - dodaje wyłącznie administrator.
create table if not exists public.admin_keys (
  key_hash text primary key,
  label text,
  created_at timestamptz not null default now()
);

create table if not exists public.events (
  id uuid primary key default gen_random_uuid(),
  title text not null check (char_length(title) between 1 and 80),
  disc text not null check (disc in ('Bieg', 'Rower', 'Kajak', 'Basen', 'WodyOtwarte', 'Trekking', 'Multi')),
  starts_at timestamptz not null,
  place text not null check (char_length(place) between 1 and 120),
  lat double precision check (lat is null or lat between -90 and 90),
  lon double precision check (lon is null or lon between -180 and 180),
  description text not null default '' check (char_length(description) <= 1500),
  link text check (link is null or (char_length(link) <= 300 and link ~ '^https://')),
  created_at timestamptz not null default now()
);

create index if not exists events_starts_at_idx on public.events (starts_at);

-- Anonimowe zapisy "Biorę udział": tylko hash losowego tokenu z telefonu, bez nicku i id urządzenia.
create table if not exists public.event_participants (
  event_id uuid not null references public.events (id) on delete cascade,
  token_hash text not null,
  created_at timestamptz not null default now(),
  primary key (event_id, token_hash)
);

-- Anonimowe "Ukończyłem": tylko hash losowego tokenu z telefonu (zapis opcjonalny - użytkownik decyduje).
create table if not exists public.event_completions (
  event_id uuid not null references public.events (id) on delete cascade,
  token_hash text not null,
  created_at timestamptz not null default now(),
  primary key (event_id, token_hash)
);
-- Wynik z wydarzenia (opcjonalny, wysyła go autor ukończenia): nick (null = anonimowo), dystans, czas
-- i profil wysokości jako [[km, m n.p.m.], ...] - bez współrzędnych, więc nie zdradza miejsca.
alter table public.event_completions add column if not exists nick text;
alter table public.event_completions add column if not exists dist_km numeric;
alter table public.event_completions add column if not exists time_min numeric;
alter table public.event_completions add column if not exists elev jsonb;
alter table public.event_completions add column if not exists result_at timestamptz;

-- Nowe dyscypliny (2026-11-04): pływanie (basen / wody otwarte) i trekking - poza wyzwaniem 4000 km.
-- „create table if not exists” nie zmienia istniejących tabel, więc ograniczenia podmieniamy wprost.
alter table public.activities drop constraint if exists activities_disc_check;
alter table public.activities add constraint activities_disc_check
  check (disc in ('Bieg', 'Rower', 'Kajak', 'Basen', 'WodyOtwarte', 'Trekking'));
-- Kto dodał wydarzenie (hash klucza organizatora) i którzy organizatorzy mogą usuwać wszystkie wydarzenia.
-- Pozostali organizatorzy usuwają tylko własne. Nadanie: update public.admin_keys set superadmin = true where label = '...';
alter table public.events add column if not exists created_by text;
alter table public.admin_keys add column if not exists superadmin boolean not null default false;
alter table public.events drop constraint if exists events_disc_check;
alter table public.events add constraint events_disc_check
  check (disc in ('Bieg', 'Rower', 'Kajak', 'Basen', 'WodyOtwarte', 'Trekking', 'Multi'));

-- Postęp uczestników wyzwania 4000 km (2026-11-13). Tylko za zgodą uczestnika: nick + km, bez tras i treningów.
-- Wiersz identyfikuje hash losowego tokenu z telefonu uczestnika (nie identyfikator urządzenia).
create table if not exists public.challenge_progress (
  token_hash text primary key,
  nick text not null check (char_length(nick) between 1 and 30),
  start_date date not null,
  km_bieg numeric(8, 1) not null default 0 check (km_bieg between 0 and 20000),
  km_rower numeric(8, 1) not null default 0 check (km_rower between 0 and 20000),
  km_kajak numeric(8, 1) not null default 0 check (km_kajak between 0 and 20000),
  updated_at timestamptz not null default now()
);
-- Ustawienia wyzwania: czy obserwatorzy widzą listę uczestników (włącza superadmin w aplikacji).
create table if not exists public.challenge_settings (
  id int primary key default 1 check (id = 1),
  observers_visible boolean not null default false,
  changed_at timestamptz not null default now()
);
insert into public.challenge_settings (id) values (1) on conflict (id) do nothing;

alter table public.devices enable row level security;
-- Kroki (2026-11-13): tylko bieg i trekking, z zegarka lub wpisane ręcznie.
alter table public.activities add column if not exists steps integer;
alter table public.activities drop constraint if exists activities_steps_check;
alter table public.activities add constraint activities_steps_check
  check (steps is null or (steps > 0 and steps <= 300000 and disc in ('Bieg', 'Trekking')));

alter table public.activities enable row level security;
alter table public.community_routes enable row level security;
alter table public.admin_keys enable row level security;
alter table public.events enable row level security;
-- Kody zaproszenia do wyzwania (wcześniejsze dołączenie, bez uprawnień organizatora).
create table if not exists public.challenge_invites (
  code_hash text primary key,
  label text,
  created_at timestamptz not null default now()
);
-- Kod działa tylko na jednym urządzeniu: hash losowego tokenu urządzenia, które wpisało go pierwsze.
alter table public.challenge_invites add column if not exists claimed_token_hash text;
alter table public.challenge_invites add column if not exists claimed_at timestamptz;

alter table public.event_participants enable row level security;
alter table public.event_completions enable row level security;
alter table public.challenge_invites enable row level security;
alter table public.challenge_progress enable row level security;
alter table public.challenge_settings enable row level security;
revoke all on public.devices, public.activities, public.community_routes,
  public.admin_keys, public.events, public.event_participants, public.event_completions, public.challenge_invites,
  public.challenge_progress, public.challenge_settings from anon, authenticated;

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

-- Stara wersja bez kroków - usuwamy, żeby nie było dwóch funkcji o tej samej nazwie.
-- p_steps ma wartość domyślną, więc starsze wersje aplikacji (bez kroków) nadal działają.
drop function if exists public.share_activity(text, text, date, numeric, numeric, jsonb, text);
create or replace function public.share_activity(
  p_nick text, p_disc text, p_date date, p_dist_km numeric, p_time_min numeric,
  p_route jsonb, p_delete_token text, p_steps integer default null
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
  insert into activities (nick, disc, activity_date, dist_km, time_min, steps, route, delete_token_hash)
  values (trim(p_nick), p_disc, p_date, p_dist_km, p_time_min, p_steps, p_route,
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

-- Zmiana zwracanych kolumn wymaga usunięcia funkcji (uprawnienia nadawane są ponownie na końcu skryptu).
drop function if exists public.list_activities(int);
create function public.list_activities(p_limit int default 50)
returns table (id uuid, nick text, disc text, activity_date date, dist_km numeric,
               time_min numeric, route jsonb, created_at timestamptz, steps integer)
language sql stable security definer set search_path = public as $$
  select id, nick, disc, activity_date, dist_km, time_min, route, created_at, steps
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

-- --- Wydarzenia ---
-- Funkcja pomocnicza (niedostępna z aplikacji): czy podany klucz jest kluczem organizatora.
create or replace function public.is_admin(p_admin_key text)
returns boolean language sql stable security definer set search_path = public as $$
  select coalesce(char_length(p_admin_key), 0) >= 32 and exists (
    select 1 from admin_keys where key_hash = encode(sha256(convert_to(p_admin_key, 'UTF8')), 'hex'));
$$;

create or replace function public.admin_check(p_admin_key text)
returns boolean language sql stable security definer set search_path = public as $$
  select is_admin(p_admin_key);
$$;

create or replace function public.admin_create_event(
  p_admin_key text, p_title text, p_disc text, p_starts_at timestamptz, p_place text,
  p_lat double precision, p_lon double precision, p_description text, p_link text
) returns uuid language plpgsql security definer set search_path = public as $$
declare
  new_id uuid;
begin
  if not is_admin(p_admin_key) then
    raise exception 'not authorized';
  end if;
  -- Retencja: wydarzenia (i zapisy na nie) znikają 30 dni po terminie.
  delete from events where starts_at < now() - interval '30 days';
  insert into events (title, disc, starts_at, place, lat, lon, description, link, created_by)
  values (trim(p_title), p_disc, p_starts_at, trim(p_place), p_lat, p_lon,
          coalesce(trim(p_description), ''), nullif(trim(p_link), ''),
          encode(sha256(convert_to(p_admin_key, 'UTF8')), 'hex'))
  returning id into new_id;
  return new_id;
end $$;

create or replace function public.admin_delete_event(p_admin_key text, p_id uuid)
returns boolean language plpgsql security definer set search_path = public as $$
begin
  if not is_admin(p_admin_key) then
    raise exception 'not authorized';
  end if;
  delete from events where id = p_id and id in (select e_id from admin_deletable_event_ids(p_admin_key) e_id);
  return found;
end $$;

-- Wydarzenia, które ten organizator może usunąć: własne, a superadmin - wszystkie.
create or replace function public.admin_deletable_event_ids(p_admin_key text)
returns setof uuid language sql stable security definer set search_path = public as $$
  select e.id from events e
  where is_admin(p_admin_key) and (
    e.created_by = encode(sha256(convert_to(p_admin_key, 'UTF8')), 'hex')
    or exists (select 1 from admin_keys k
               where k.key_hash = encode(sha256(convert_to(p_admin_key, 'UTF8')), 'hex') and k.superadmin));
$$;

-- Nadchodzące wydarzenia (oraz te sprzed max. 12 godzin) z liczbą chętnych.
create or replace function public.list_events()
returns table (id uuid, title text, disc text, starts_at timestamptz, place text,
               lat double precision, lon double precision, description text, link text,
               participants bigint)
language sql stable security definer set search_path = public as $$
  select e.id, e.title, e.disc, e.starts_at, e.place, e.lat, e.lon, e.description, e.link,
         (select count(*) from event_participants p where p.event_id = e.id)
  from events e
  where e.starts_at > now() - interval '12 hours'
  order by e.starts_at
  limit 100;
$$;

-- Wersja 2: nadchodzące + zakończone w ostatnich 7 dniach, z liczbą chętnych i liczbą ukończeń.
-- (list_events zostaje bez zmian dla starszych wersji aplikacji w cache telefonów.)
create or replace function public.list_events_v2()
returns table (id uuid, title text, disc text, starts_at timestamptz, place text,
               lat double precision, lon double precision, description text, link text,
               participants bigint, completed bigint)
language sql stable security definer set search_path = public as $$
  select e.id, e.title, e.disc, e.starts_at, e.place, e.lat, e.lon, e.description, e.link,
         (select count(*) from event_participants p where p.event_id = e.id),
         (select count(*) from event_completions c where c.event_id = e.id)
  from events e
  where e.starts_at > now() - interval '7 days'
  order by e.starts_at
  limit 100;
$$;

-- "Ukończyłem" / cofnięcie; zwraca aktualną liczbę ukończeń. Tylko po starcie, max 7 dni po.
create or replace function public.complete_event(p_id uuid, p_token text)
returns bigint language plpgsql security definer set search_path = public as $$
begin
  if p_token is null or char_length(p_token) < 32 then
    raise exception 'invalid token';
  end if;
  if not exists (select 1 from events where id = p_id
                 and starts_at <= now() and starts_at > now() - interval '7 days') then
    raise exception 'event not found';
  end if;
  if (select count(*) from event_completions where created_at > now() - interval '1 minute') >= 60 then
    raise exception 'rate limit';
  end if;
  insert into event_completions (event_id, token_hash)
  values (p_id, encode(sha256(convert_to(p_token, 'UTF8')), 'hex'))
  on conflict do nothing;
  return (select count(*) from event_completions where event_id = p_id);
end $$;

create or replace function public.uncomplete_event(p_id uuid, p_token text)
returns bigint language plpgsql security definer set search_path = public as $$
begin
  delete from event_completions
  where event_id = p_id and token_hash = encode(sha256(convert_to(p_token, 'UTF8')), 'hex');
  return (select count(*) from event_completions where event_id = p_id);
end $$;

-- Wynik z wydarzenia - tylko właściciel tokenu ukończenia; p_dist_km null = usuń wynik.
create or replace function public.set_event_result(
  p_id uuid, p_token text, p_nick text, p_dist_km numeric, p_time_min numeric, p_elev jsonb
) returns boolean language plpgsql security definer set search_path = public as $$
declare
  v_nick text := nullif(trim(p_nick), '');
begin
  if p_token is null or char_length(p_token) < 32 then
    raise exception 'invalid token';
  end if;
  if v_nick is not null and char_length(v_nick) > 30 then
    raise exception 'invalid nick';
  end if;
  if p_dist_km is not null and (p_dist_km <= 0 or p_dist_km > 1000) then
    raise exception 'invalid distance';
  end if;
  if p_time_min is not null and (p_time_min < 0 or p_time_min > 20000) then
    raise exception 'invalid time';
  end if;
  if p_elev is not null and (
       jsonb_typeof(p_elev) <> 'array' or jsonb_array_length(p_elev) > 150
       or octet_length(p_elev::text) > 4000
       or exists (select 1 from jsonb_array_elements(p_elev) x
                  where jsonb_typeof(x) <> 'array' or jsonb_array_length(x) <> 2
                     or jsonb_typeof(x -> 0) <> 'number' or jsonb_typeof(x -> 1) <> 'number'
                     or (x ->> 0)::numeric not between 0 and 1000
                     or (x ->> 1)::numeric not between -500 and 9000)) then
    raise exception 'invalid elevation';
  end if;
  if not exists (select 1 from events where id = p_id and starts_at > now() - interval '7 days') then
    raise exception 'event not found';
  end if;
  update event_completions
  set nick = v_nick,
      dist_km = round(p_dist_km, 2),
      time_min = case when p_dist_km is null then null else round(p_time_min, 1) end,
      elev = case when p_dist_km is null then null else p_elev end,
      result_at = case when p_dist_km is null then null else now() end
  where event_id = p_id and token_hash = encode(sha256(convert_to(p_token, 'UTF8')), 'hex');
  return found;
end $$;

-- Wyniki wydarzenia dla wszystkich, w kolejności ukończenia (bez rankingu).
create or replace function public.list_event_results(p_id uuid)
returns table (nick text, dist_km numeric, time_min numeric, elev jsonb, done_at timestamptz)
language sql stable security definer set search_path = public as $$
  select c.nick, c.dist_km, c.time_min, c.elev, c.created_at
  from event_completions c
  join events e on e.id = c.event_id
  where c.event_id = p_id and c.dist_km is not null and e.starts_at > now() - interval '7 days'
  order by c.created_at
  limit 200;
$$;

-- Zapis / wypis; zwraca aktualną liczbę chętnych.
create or replace function public.join_event(p_id uuid, p_token text)
returns bigint language plpgsql security definer set search_path = public as $$
begin
  if p_token is null or char_length(p_token) < 32 then
    raise exception 'invalid token';
  end if;
  if not exists (select 1 from events where id = p_id and starts_at > now() - interval '12 hours') then
    raise exception 'event not found';
  end if;
  if (select count(*) from event_participants where created_at > now() - interval '1 minute') >= 60 then
    raise exception 'rate limit';
  end if;
  insert into event_participants (event_id, token_hash)
  values (p_id, encode(sha256(convert_to(p_token, 'UTF8')), 'hex'))
  on conflict do nothing;
  return (select count(*) from event_participants where event_id = p_id);
end $$;

create or replace function public.leave_event(p_id uuid, p_token text)
returns bigint language plpgsql security definer set search_path = public as $$
begin
  delete from event_participants
  where event_id = p_id and token_hash = encode(sha256(convert_to(p_token, 'UTF8')), 'hex');
  return (select count(*) from event_participants where event_id = p_id);
end $$;

-- --- Wyzwanie: kody zaproszenia ---
-- Kod porównywany bez spacji i wielkości liter (aplikacja i tak go normalizuje).
create or replace function public.check_challenge_invite(p_code text)
returns boolean language sql stable security definer set search_path = public as $$
  select coalesce(char_length(p_code), 0) >= 8 and exists (
    select 1 from challenge_invites
    where code_hash = encode(sha256(convert_to(upper(replace(trim(p_code), ' ', '')), 'UTF8')), 'hex'));
$$;

-- Przypisuje kod do urządzenia przy pierwszym użyciu. true = kod ważny i należy do tego urządzenia;
-- false = brak kodu (np. wycofany) albo kod przypisany już do innego urządzenia.
create or replace function public.claim_challenge_invite(p_code text, p_token text)
returns boolean language plpgsql security definer set search_path = public as $$
declare
  v_code_hash text;
  v_token_hash text;
  v_claimed text;
begin
  if coalesce(char_length(p_code), 0) < 8 or coalesce(char_length(p_token), 0) < 32 then
    return false;
  end if;
  v_code_hash := encode(sha256(convert_to(upper(replace(trim(p_code), ' ', '')), 'UTF8')), 'hex');
  v_token_hash := encode(sha256(convert_to(p_token, 'UTF8')), 'hex');
  select claimed_token_hash into v_claimed from challenge_invites where code_hash = v_code_hash for update;
  if not found then
    return false;
  end if;
  if v_claimed is null then
    update challenge_invites set claimed_token_hash = v_token_hash, claimed_at = now() where code_hash = v_code_hash;
    return true;
  end if;
  return v_claimed = v_token_hash;
end $$;

-- --- Postęp uczestników wyzwania ---
-- Zapis / aktualizacja własnego postępu (token zna tylko telefon uczestnika).
create or replace function public.save_challenge_progress(
  p_token text, p_nick text, p_start date, p_km_bieg numeric, p_km_rower numeric, p_km_kajak numeric
) returns boolean language plpgsql security definer set search_path = public as $$
declare
  v_hash text;
begin
  if p_token is null or char_length(p_token) < 32 then
    raise exception 'invalid token';
  end if;
  if p_start is null or p_start < date '2026-01-01' or p_start > current_date + 1 then
    raise exception 'invalid start';
  end if;
  v_hash := encode(sha256(convert_to(p_token, 'UTF8')), 'hex');
  -- Prosta ochrona przed spamem: nowych uczestników najwyżej 20 na minutę.
  if not exists (select 1 from challenge_progress where token_hash = v_hash)
     and (select count(*) from challenge_progress where updated_at > now() - interval '1 minute') >= 20 then
    raise exception 'rate limit';
  end if;
  insert into challenge_progress (token_hash, nick, start_date, km_bieg, km_rower, km_kajak, updated_at)
  values (v_hash, trim(p_nick), p_start, round(coalesce(p_km_bieg, 0), 1), round(coalesce(p_km_rower, 0), 1),
          round(coalesce(p_km_kajak, 0), 1), now())
  on conflict (token_hash) do update set
    nick = excluded.nick, start_date = excluded.start_date, km_bieg = excluded.km_bieg,
    km_rower = excluded.km_rower, km_kajak = excluded.km_kajak, updated_at = now();
  return true;
end $$;

-- Wycofanie zgody / rezygnacja z wyzwania: usuwa wiersz uczestnika.
create or replace function public.delete_challenge_progress(p_token text)
returns boolean language plpgsql security definer set search_path = public as $$
begin
  delete from challenge_progress where token_hash = encode(sha256(convert_to(p_token, 'UTF8')), 'hex');
  return found;
end $$;

-- Lista uczestników: obserwatorzy dostają ją dopiero po włączeniu przez superadmina;
-- organizator (ważny klucz) widzi ją zawsze jako podgląd.
create or replace function public.list_challenge_progress(p_admin_key text default null)
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  v_visible boolean;
  v_admin boolean := p_admin_key is not null and is_admin(p_admin_key);
  v_super boolean := v_admin and exists (select 1 from admin_keys
    where key_hash = encode(sha256(convert_to(p_admin_key, 'UTF8')), 'hex') and superadmin);
begin
  select observers_visible into v_visible from challenge_settings where id = 1;
  v_visible := coalesce(v_visible, false);
  return jsonb_build_object(
    'visible', v_visible, 'admin', v_admin, 'superadmin', v_super,
    'participants', case when v_visible or v_admin then coalesce((
      select jsonb_agg(jsonb_build_object('nick', nick, 'start', start_date, 'km_bieg', km_bieg,
               'km_rower', km_rower, 'km_kajak', km_kajak, 'updated_at', updated_at)
             order by km_bieg + km_rower + km_kajak desc, updated_at)
      from challenge_progress), '[]'::jsonb) else '[]'::jsonb end);
end $$;

-- Włączenie / wyłączenie widoczności listy dla obserwatorów - tylko superadmin.
create or replace function public.admin_set_challenge_visible(p_admin_key text, p_visible boolean)
returns boolean language plpgsql security definer set search_path = public as $$
begin
  if not exists (select 1 from admin_keys
                 where key_hash = encode(sha256(convert_to(p_admin_key, 'UTF8')), 'hex') and superadmin) then
    raise exception 'not allowed';
  end if;
  update challenge_settings set observers_visible = coalesce(p_visible, false), changed_at = now() where id = 1;
  return coalesce(p_visible, false);
end $$;

-- Dostęp z aplikacji tylko do powyższych funkcji (bez is_admin).
revoke execute on function public.ping(uuid), public.forget_device(uuid), public.get_stats(),
  public.share_activity(text, text, date, numeric, numeric, jsonb, text, integer),
  public.delete_activity(uuid, text), public.list_activities(int),
  public.share_route(text, text, text, numeric, jsonb, text), public.delete_route(uuid, text),
  public.list_routes(int), public.get_route(uuid),
  public.is_admin(text), public.admin_check(text),
  public.admin_create_event(text, text, text, timestamptz, text, double precision, double precision, text, text),
  public.admin_delete_event(text, uuid), public.admin_deletable_event_ids(text), public.list_events(),
  public.join_event(uuid, text), public.leave_event(uuid, text),
  public.list_events_v2(), public.complete_event(uuid, text), public.uncomplete_event(uuid, text),
  public.set_event_result(uuid, text, text, numeric, numeric, jsonb), public.list_event_results(uuid),
  public.check_challenge_invite(text), public.claim_challenge_invite(text, text),
  public.save_challenge_progress(text, text, date, numeric, numeric, numeric), public.delete_challenge_progress(text),
  public.list_challenge_progress(text), public.admin_set_challenge_visible(text, boolean) from public;
grant execute on function public.ping(uuid), public.forget_device(uuid), public.get_stats(),
  public.share_activity(text, text, date, numeric, numeric, jsonb, text, integer),
  public.delete_activity(uuid, text), public.list_activities(int),
  public.share_route(text, text, text, numeric, jsonb, text), public.delete_route(uuid, text),
  public.list_routes(int), public.get_route(uuid),
  public.admin_check(text),
  public.admin_create_event(text, text, text, timestamptz, text, double precision, double precision, text, text),
  public.admin_delete_event(text, uuid), public.admin_deletable_event_ids(text), public.list_events(),
  public.join_event(uuid, text), public.leave_event(uuid, text),
  public.list_events_v2(), public.complete_event(uuid, text), public.uncomplete_event(uuid, text),
  public.set_event_result(uuid, text, text, numeric, numeric, jsonb), public.list_event_results(uuid),
  public.claim_challenge_invite(text, text),
  public.save_challenge_progress(text, text, date, numeric, numeric, numeric), public.delete_challenge_progress(text),
  public.list_challenge_progress(text), public.admin_set_challenge_visible(text, boolean) to anon;
-- Stara funkcja sprawdzania kodu (bez przypisania do urządzenia) była wcześniej dostępna - odbieramy ją wprost.
revoke execute on function public.check_challenge_invite(text) from anon;

-- Postęp wyzwania tylko dla zaproszonych (2026-11-16).
-- Powód: recenzenci Google (kod/klucz z "Dostęp do aplikacji") pojawiali się na liście uczestników,
-- a stara funkcja zapisu nie sprawdzała zaproszenia (dało się dopisać z pominięciem aplikacji).
-- Zapis dozwolony, gdy: telefon ma przypisany kod zaproszenia (nie kod recenzentów Google)
-- ALBO klucz superadmina ALBO zaczęły się oficjalne zapisy (od 2027-09-01, jak CHALLENGE_SIGNUP_FROM w app.js).
-- Niedozwolony zapis zwraca false (bez błędu) - aplikacja nic nie pokazuje, wpis nie trafia na listę.
create or replace function public.save_challenge_progress_v2(
  p_token text, p_nick text, p_start date, p_km_bieg numeric, p_km_rower numeric, p_km_kajak numeric,
  p_invite_token text default null, p_admin_key text default null
) returns boolean language plpgsql security definer set search_path = public as $$
declare
  v_hash text;
  v_allowed boolean;
begin
  if p_token is null or char_length(p_token) < 32 then
    raise exception 'invalid token';
  end if;
  if p_start is null or p_start < date '2026-01-01' or p_start > current_date + 1 then
    raise exception 'invalid start';
  end if;
  v_allowed := current_date >= date '2027-09-01'
    or (coalesce(char_length(p_invite_token), 0) >= 32 and exists (
          select 1 from challenge_invites
          where claimed_token_hash = encode(sha256(convert_to(p_invite_token, 'UTF8')), 'hex')
            and label <> 'Google Play review'))
    or (coalesce(char_length(p_admin_key), 0) >= 32 and exists (
          select 1 from admin_keys
          where key_hash = encode(sha256(convert_to(p_admin_key, 'UTF8')), 'hex') and superadmin));
  if not v_allowed then
    return false;
  end if;
  v_hash := encode(sha256(convert_to(p_token, 'UTF8')), 'hex');
  if not exists (select 1 from challenge_progress where token_hash = v_hash)
     and (select count(*) from challenge_progress where updated_at > now() - interval '1 minute') >= 20 then
    raise exception 'rate limit';
  end if;
  insert into challenge_progress (token_hash, nick, start_date, km_bieg, km_rower, km_kajak, updated_at)
  values (v_hash, trim(p_nick), p_start, round(coalesce(p_km_bieg, 0), 1), round(coalesce(p_km_rower, 0), 1),
          round(coalesce(p_km_kajak, 0), 1), now())
  on conflict (token_hash) do update set
    nick = excluded.nick, start_date = excluded.start_date, km_bieg = excluded.km_bieg,
    km_rower = excluded.km_rower, km_kajak = excluded.km_kajak, updated_at = now();
  return true;
end $$;

revoke execute on function public.save_challenge_progress_v2(text, text, date, numeric, numeric, numeric, text, text) from public;
grant execute on function public.save_challenge_progress_v2(text, text, date, numeric, numeric, numeric, text, text) to anon;
-- Stara funkcja zapisu (bez sprawdzania zaproszenia) - zamykamy dostęp z aplikacji/internetu.
revoke execute on function public.save_challenge_progress(text, text, date, numeric, numeric, numeric) from anon;

-- Wydawanie kodów zaproszenia do wyzwania prosto z Supabase (2026-11-16).
-- Użycie (SQL Editor -> Run):
--   select * from public.wydaj_kod('Jan Kowalski');          -- imię i nazwisko albo nick
--   select * from public.wydaj_kod('Kasia', 17);             -- + numer startowy
--   select * from public.nowy_kod('Kasia');                  -- zgubiony kod: nowy kod, stary przestaje działać
--   select * from public.lista_kodow;                        -- kto ma kod, numer, czy już użyty
-- Kod pokazuje się TYLKO raz (w bazie jest wyłącznie jego hash SHA-256) - skopiuj go od razu i wyślij.
-- Funkcje działają tylko z SQL Editora (konto właściciela bazy) - aplikacja i internet nie mają do nich dostępu.

alter table public.challenge_invites add column if not exists bib int;
create unique index if not exists challenge_invites_label_uq on public.challenge_invites (lower(label));
create unique index if not exists challenge_invites_bib_uq on public.challenge_invites (bib) where bib is not null;

-- Losowy kod PAU-XXXX-XXXX (bez 0/O/1/I/L), losowość z gen_random_uuid().
create or replace function public.pau_losuj_kod() returns text language plpgsql volatile as $$
declare
  v_abc constant text := 'ABCDEFGHJKMNPQRSTUVWXYZ23456789';
  v_b bytea := uuid_send(gen_random_uuid()) || uuid_send(gen_random_uuid());
  v_out text := '';
  i int;
begin
  for i in 0..7 loop
    -- bajty 0-3 i 16-19 obu UUID są w pełni losowe
    v_out := v_out || substr(v_abc, (get_byte(v_b, case when i < 4 then i else 12 + i end) % 31) + 1, 1);
  end loop;
  return 'PAU-' || substr(v_out, 1, 4) || '-' || substr(v_out, 5, 4);
end $$;

create or replace function public.wydaj_kod(p_dla text, p_numer int default null, p_limit int default 60)
returns table (kod text, dla text, numer int, wydanych int)
language plpgsql security definer set search_path = public as $$
declare
  v_kod text;
  v_ile int;
begin
  if coalesce(trim(p_dla), '') = '' then
    raise exception 'Podaj imię i nazwisko, nick albo opis osoby';
  end if;
  if exists (select 1 from challenge_invites where lower(label) = lower(trim(p_dla))) then
    raise exception 'Kod dla "%" już istnieje. Zgubiony kod? Użyj: select * from public.nowy_kod(''%'');', trim(p_dla), trim(p_dla);
  end if;
  if p_numer is not null and exists (select 1 from challenge_invites where bib = p_numer) then
    raise exception 'Numer startowy % jest już przypisany', p_numer;
  end if;
  select count(*) into v_ile from challenge_invites where label <> 'Google Play review';
  if v_ile >= p_limit then
    raise exception 'Osiągnięto limit % kodów. Większy limit: select * from public.wydaj_kod(''%'', %, 80);', p_limit, trim(p_dla), coalesce(p_numer::text, 'null');
  end if;
  loop
    v_kod := pau_losuj_kod();
    exit when not exists (select 1 from challenge_invites where code_hash = encode(sha256(convert_to(v_kod, 'UTF8')), 'hex'));
  end loop;
  insert into challenge_invites (code_hash, label, bib)
  values (encode(sha256(convert_to(v_kod, 'UTF8')), 'hex'), trim(p_dla), p_numer);
  return query select v_kod, trim(p_dla), p_numer, v_ile + 1;
end $$;

-- Nowy kod dla osoby, która już miała kod (zgubiła go / zmienia telefon i chce nowy).
-- Stary kod przestaje działać, przypisanie do telefonu jest kasowane.
create or replace function public.nowy_kod(p_dla text)
returns table (kod text, dla text, numer int)
language plpgsql security definer set search_path = public as $$
declare
  v_kod text;
  v_label text;
  v_bib int;
begin
  select label, bib into v_label, v_bib from challenge_invites where lower(label) = lower(trim(p_dla));
  if not found then
    raise exception 'Brak kodu dla "%". Nowa osoba? Użyj: select * from public.wydaj_kod(''%'');', trim(p_dla), trim(p_dla);
  end if;
  loop
    v_kod := pau_losuj_kod();
    exit when not exists (select 1 from challenge_invites where code_hash = encode(sha256(convert_to(v_kod, 'UTF8')), 'hex'));
  end loop;
  update challenge_invites
     set code_hash = encode(sha256(convert_to(v_kod, 'UTF8')), 'hex'), claimed_token_hash = null, claimed_at = null
   where lower(label) = lower(trim(p_dla));
  return query select v_kod, v_label, v_bib;
end $$;

create or replace view public.lista_kodow with (security_invoker = true) as
  select label as dla, bib as numer, created_at::date as wydany,
         case when claimed_at is null then 'nie' else 'tak, ' || to_char(claimed_at, 'YYYY-MM-DD') end as uzyty
  from public.challenge_invites
  order by bib nulls last, label;

-- Tylko właściciel bazy (SQL Editor). Aplikacja (anon) i zalogowani nie mają dostępu.
revoke all on function public.pau_losuj_kod(), public.wydaj_kod(text, int, int), public.nowy_kod(text) from public, anon, authenticated;
revoke all on public.lista_kodow from public, anon, authenticated;

-- Komunikaty organizatora dla uczestników wyzwania (2026-11-16).
-- Pisze i usuwa tylko superadmin (z aplikacji, kluczem organizatora z flagą superadmin).
-- Czytają: uczestnicy z przypisanym kodem zaproszenia (także recenzenci Google - widzą funkcję),
-- organizatorzy (dowolny klucz) i - od oficjalnych zapisów 2027-09-01 - wszyscy.
create table if not exists public.challenge_messages (
  id uuid primary key default gen_random_uuid(),
  body text not null check (char_length(body) between 1 and 1000),
  important boolean not null default false,
  created_at timestamptz not null default now(),
  expires_at timestamptz
);
alter table public.challenge_messages enable row level security;
revoke all on public.challenge_messages from anon, authenticated;

create or replace function public.pau_is_superadmin(p_admin_key text)
returns boolean language sql stable security definer set search_path = public as $$
  select coalesce(char_length(p_admin_key), 0) >= 32 and exists (
    select 1 from admin_keys where key_hash = encode(sha256(convert_to(p_admin_key, 'UTF8')), 'hex') and superadmin);
$$;

create or replace function public.list_challenge_messages(p_invite_token text default null, p_admin_key text default null)
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  v_ok boolean;
begin
  v_ok := current_date >= date '2027-09-01'
    or (coalesce(char_length(p_admin_key), 0) >= 32 and is_admin(p_admin_key))
    or (coalesce(char_length(p_invite_token), 0) >= 32 and exists (
          select 1 from challenge_invites
          where claimed_token_hash = encode(sha256(convert_to(p_invite_token, 'UTF8')), 'hex')));
  if not v_ok then
    return jsonb_build_object('allowed', false, 'superadmin', false, 'messages', '[]'::jsonb);
  end if;
  return jsonb_build_object(
    'allowed', true,
    'superadmin', pau_is_superadmin(p_admin_key),
    'messages', coalesce((
      select jsonb_agg(jsonb_build_object('id', id, 'body', body, 'important', important,
               'created_at', created_at, 'expires_at', expires_at) order by created_at desc)
      from (select * from challenge_messages
            where expires_at is null or expires_at > now()
            order by created_at desc limit 50) m), '[]'::jsonb));
end $$;

create or replace function public.admin_post_challenge_message(
  p_admin_key text, p_body text, p_important boolean default false, p_expires_at timestamptz default null
) returns uuid language plpgsql security definer set search_path = public as $$
declare
  v_id uuid;
begin
  if not pau_is_superadmin(p_admin_key) then
    raise exception 'not allowed';
  end if;
  if coalesce(char_length(trim(p_body)), 0) = 0 then
    raise exception 'empty message';
  end if;
  if (select count(*) from challenge_messages where created_at > now() - interval '1 minute') >= 10 then
    raise exception 'rate limit';
  end if;
  insert into challenge_messages (body, important, expires_at)
  values (left(trim(p_body), 1000), coalesce(p_important, false), p_expires_at)
  returning id into v_id;
  return v_id;
end $$;

create or replace function public.admin_delete_challenge_message(p_admin_key text, p_id uuid)
returns boolean language plpgsql security definer set search_path = public as $$
begin
  if not pau_is_superadmin(p_admin_key) then
    raise exception 'not allowed';
  end if;
  delete from challenge_messages where id = p_id;
  return found;
end $$;

revoke execute on function public.pau_is_superadmin(text) from public, anon, authenticated;
revoke execute on function public.list_challenge_messages(text, text),
  public.admin_post_challenge_message(text, text, boolean, timestamptz),
  public.admin_delete_challenge_message(text, uuid) from public;
grant execute on function public.list_challenge_messages(text, text),
  public.admin_post_challenge_message(text, text, boolean, timestamptz),
  public.admin_delete_challenge_message(text, uuid) to anon;
