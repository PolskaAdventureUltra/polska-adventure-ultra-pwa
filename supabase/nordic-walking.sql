-- Nordic walking (2026-11-23, wersja 115): nowa dyscyplina, udostępniana w Aktywności i w wydarzeniach,
-- z krokami, poza wyzwaniem 4000 km. Limity jak trekking (PLAUSIBLE_LIMITS w app.js - zmieniać razem).
-- Wkleić całość w Supabase -> SQL Editor -> Run. Można uruchamiać wielokrotnie.

alter table public.activities drop constraint if exists activities_disc_check;
alter table public.activities add constraint activities_disc_check
  check (disc in ('Bieg', 'Rower', 'Kajak', 'Basen', 'WodyOtwarte', 'Trekking', 'NordicWalking'));

alter table public.events drop constraint if exists events_disc_check;
alter table public.events add constraint events_disc_check
  check (disc in ('Bieg', 'Rower', 'Kajak', 'Basen', 'WodyOtwarte', 'Trekking', 'NordicWalking', 'Multi'));

alter table public.activities drop constraint if exists activities_steps_check;
alter table public.activities add constraint activities_steps_check
  check (steps is null or (steps > 0 and steps <= 300000 and disc in ('Bieg', 'Trekking', 'NordicWalking')));

create or replace function public.pau_activity_plausible(
  p_disc text, p_date date, p_dist_km numeric, p_time_min numeric, p_steps integer
) returns boolean language plpgsql immutable as $$
declare
  v_max_kmh numeric;
  v_max_km numeric;
begin
  select l.kmh, l.km into v_max_kmh, v_max_km
  from (values ('Bieg', 25, 400), ('Trekking', 15, 200), ('NordicWalking', 15, 200), ('Rower', 70, 1200),
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
revoke execute on function public.pau_activity_plausible(text, date, numeric, numeric, integer) from public, anon, authenticated;

-- Sprawdzenie (powinno zwrócić true, false):
select public.pau_activity_plausible('NordicWalking', current_date, 8, 90, 11000) as nw_ok,
       public.pau_activity_plausible('NordicWalking', current_date, 30, 60, null) as nw_za_szybko;
