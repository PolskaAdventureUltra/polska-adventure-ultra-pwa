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
