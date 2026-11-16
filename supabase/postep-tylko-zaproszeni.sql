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
