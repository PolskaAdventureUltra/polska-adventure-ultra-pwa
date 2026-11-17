-- Wiarygodność udostępnianych treningów (2026-11-17, wersja 90).
-- Powód: w Aktywności pojawił się nierealny wpis (bieg 87 km w 7 minut, 6767 kroków).
-- Aplikacja sprawdza to samo przed zapisem (PLAUSIBLE_LIMITS w app.js) - limity zmieniać w obu miejscach.
-- Wkleić całość w Supabase -> SQL Editor -> Run. Można uruchamiać wielokrotnie.

create or replace function public.pau_activity_plausible(
  p_disc text, p_date date, p_dist_km numeric, p_time_min numeric, p_steps integer
) returns boolean language plpgsql immutable as $$
declare
  v_max_kmh numeric;
  v_max_km numeric;
begin
  select l.kmh, l.km into v_max_kmh, v_max_km
  from (values ('Bieg', 25, 400), ('Trekking', 15, 200), ('Rower', 70, 1200),
               ('Kajak', 25, 300), ('Basen', 8, 30), ('WodyOtwarte', 8, 100)) as l(disc, kmh, km)
  where l.disc = p_disc;
  if v_max_km is null or p_dist_km is null or p_dist_km <= 0 or p_dist_km > v_max_km then return false; end if;
  if p_time_min is not null and p_time_min > 0 then
    if p_dist_km / (p_time_min / 60) > v_max_kmh then return false; end if;
    if p_time_min > 7 * 24 * 60 then return false; end if;
  end if;
  if p_steps is not null and p_steps > 0 then
    if p_dist_km * 1000 / p_steps > 2.5 or p_dist_km * 1000 / p_steps < 0.3 then return false; end if;
    if p_time_min is not null and p_time_min > 0 and p_steps / p_time_min > 300 then return false; end if;
  end if;
  return true;
end $$;

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
  if p_date is null or p_date > current_date + 1
     or not pau_activity_plausible(p_disc, p_date, p_dist_km, p_time_min, p_steps) then
    raise exception 'implausible activity';
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

revoke execute on function public.pau_activity_plausible(text, date, numeric, numeric, integer) from public, anon, authenticated;

-- Podgląd wpisów, które NIE przeszłyby nowego sprawdzenia (tylko odczyt):
-- select id, nick, disc, activity_date, dist_km, time_min, steps, created_at
-- from public.activities
-- where not public.pau_activity_plausible(disc, activity_date, dist_km, time_min, steps)
-- order by created_at desc;
