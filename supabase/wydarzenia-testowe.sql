-- Wydarzenia testowe (2026-11-27): wydarzenia dodane kluczem z flagą test_only (recenzenci Google)
-- widzą tylko organizatorzy (dowolny ważny klucz). Zwykli użytkownicy - także w starszych wersjach
-- aplikacji (list_events, list_events_v2) - ich nie dostają.
-- Powód: recenzent Google dodał „test event”, który zobaczyli wszyscy.
-- Skrypt można uruchamiać wielokrotnie. Te same zmiany są w schema.sql.

alter table public.admin_keys add column if not exists test_only boolean not null default false;
update public.admin_keys set test_only = true where label = 'Google Play review';

-- Czy wydarzenie dodano kluczem testowym (created_by = hash klucza).
create or replace function public.pau_event_is_test(p_created_by text)
returns boolean language sql stable security definer set search_path = public as $$
  select p_created_by is not null and exists (
    select 1 from admin_keys where key_hash = p_created_by and test_only);
$$;

create or replace function public.list_events()
returns table (id uuid, title text, disc text, starts_at timestamptz, place text,
               lat double precision, lon double precision, description text, link text,
               participants bigint)
language sql stable security definer set search_path = public as $$
  select e.id, e.title, e.disc, e.starts_at, e.place, e.lat, e.lon, e.description, e.link,
         (select count(*) from event_participants p where p.event_id = e.id)
  from events e
  where e.starts_at > now() - interval '12 hours' and not pau_event_is_test(e.created_by)
  order by e.starts_at
  limit 100;
$$;

create or replace function public.list_events_v2()
returns table (id uuid, title text, disc text, starts_at timestamptz, place text,
               lat double precision, lon double precision, description text, link text,
               participants bigint, completed bigint)
language sql stable security definer set search_path = public as $$
  select e.id, e.title, e.disc, e.starts_at, e.place, e.lat, e.lon, e.description, e.link,
         (select count(*) from event_participants p where p.event_id = e.id),
         (select count(*) from event_completions c where c.event_id = e.id)
  from events e
  where e.starts_at > now() - interval '7 days' and not pau_event_is_test(e.created_by)
  order by e.starts_at
  limit 100;
$$;

-- Wersja 3: jak v2 + kolumna is_test; wydarzenia testowe tylko dla organizatora (ważny klucz).
create or replace function public.list_events_v3(p_admin_key text default null)
returns table (id uuid, title text, disc text, starts_at timestamptz, place text,
               lat double precision, lon double precision, description text, link text,
               participants bigint, completed bigint, is_test boolean)
language sql stable security definer set search_path = public as $$
  select e.id, e.title, e.disc, e.starts_at, e.place, e.lat, e.lon, e.description, e.link,
         (select count(*) from event_participants p where p.event_id = e.id),
         (select count(*) from event_completions c where c.event_id = e.id),
         pau_event_is_test(e.created_by)
  from events e
  where e.starts_at > now() - interval '7 days'
    and (not pau_event_is_test(e.created_by) or (p_admin_key is not null and is_admin(p_admin_key)))
  order by e.starts_at
  limit 100;
$$;

revoke execute on function public.pau_event_is_test(text) from public, anon, authenticated;
revoke execute on function public.list_events_v3(text) from public;
grant execute on function public.list_events_v3(text) to anon;
