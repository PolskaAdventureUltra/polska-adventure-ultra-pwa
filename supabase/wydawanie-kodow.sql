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
