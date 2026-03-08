-- Supabase migration: username profiles + leaderboard snapshots
-- Adds:
-- 1) Unique username system with availability + claim RPC helpers.
-- 2) Public leaderboard snapshots for money earned and fish caught.
-- 3) 10-minute cron refresh for leaderboard snapshots.

create table if not exists public.user_profiles (
  user_id uuid primary key references auth.users(id) on delete cascade,
  username text,
  username_normalized text,
  username_set_at timestamp with time zone,
  created_at timestamp with time zone not null default timezone('utc'::text, now()),
  updated_at timestamp with time zone not null default timezone('utc'::text, now()),
  constraint user_profiles_username_format
    check (
      username is null
      or username ~ '^[A-Za-z][A-Za-z0-9_]{2,19}$'
    ),
  constraint user_profiles_username_pairing
    check (
      (username is null and username_normalized is null)
      or (username is not null and username_normalized = lower(username))
    )
);

create unique index if not exists user_profiles_username_normalized_unique
  on public.user_profiles (username_normalized)
  where username_normalized is not null;

create index if not exists user_profiles_username_set_idx
  on public.user_profiles (username_set_at desc nulls last);

create or replace function public.set_user_profiles_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = timezone('utc'::text, now());
  return new;
end;
$$;

drop trigger if exists trg_user_profiles_updated_at on public.user_profiles;
create trigger trg_user_profiles_updated_at
before update on public.user_profiles
for each row
execute function public.set_user_profiles_updated_at();

create or replace function public.normalize_username(candidate text)
returns text
language sql
immutable
as $$
  select nullif(lower(trim(candidate)), '');
$$;

create or replace function public.validate_username(candidate text)
returns table (
  is_valid boolean,
  normalized text,
  reason text
)
language plpgsql
immutable
as $$
declare
  v_reserved constant text[] := array[
    'admin', 'administrator', 'system', 'support', 'staff',
    'moderator', 'mod', 'owner', 'developer', 'team',
    'supabase', 'postgres', 'root', 'null', 'undefined',
    'fishit', 'virtualfisher'
  ];
begin
  normalized := public.normalize_username(candidate);

  if normalized is null then
    is_valid := false;
    reason := 'Username is required.';
    return next;
    return;
  end if;

  if length(normalized) < 3 or length(normalized) > 20 then
    is_valid := false;
    reason := 'Username must be 3-20 characters.';
    return next;
    return;
  end if;

  if normalized !~ '^[a-z][a-z0-9_]{2,19}$' then
    is_valid := false;
    reason := 'Use letters, numbers, underscores, and start with a letter.';
    return next;
    return;
  end if;

  if position('__' in normalized) > 0 then
    is_valid := false;
    reason := 'Username cannot contain consecutive underscores.';
    return next;
    return;
  end if;

  if normalized = any(v_reserved) then
    is_valid := false;
    reason := 'That username is reserved.';
    return next;
    return;
  end if;

  is_valid := true;
  reason := 'Username is available.';
  return next;
end;
$$;

create or replace function public.check_username_availability(candidate text)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_validation record;
  v_exists boolean;
  v_uid uuid := auth.uid();
begin
  select *
  into v_validation
  from public.validate_username(candidate)
  limit 1;

  if coalesce(v_validation.is_valid, false) = false then
    return jsonb_build_object(
      'available', false,
      'normalized', v_validation.normalized,
      'reason', coalesce(v_validation.reason, 'Invalid username.')
    );
  end if;

  select exists(
    select 1
    from public.user_profiles up
    where up.username_normalized = v_validation.normalized
      and (v_uid is null or up.user_id <> v_uid)
  )
  into v_exists;

  return jsonb_build_object(
    'available', not v_exists,
    'normalized', v_validation.normalized,
    'reason', case when v_exists then 'That username is already in use.' else 'Username is available.' end
  );
end;
$$;

create or replace function public._claim_username_for_user(target_user_id uuid, candidate text)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_validation record;
  v_conflict_user uuid;
begin
  if target_user_id is null then
    return jsonb_build_object('ok', false, 'reason', 'Missing user id.');
  end if;

  select *
  into v_validation
  from public.validate_username(candidate)
  limit 1;

  if coalesce(v_validation.is_valid, false) = false then
    return jsonb_build_object(
      'ok', false,
      'reason', coalesce(v_validation.reason, 'Invalid username.')
    );
  end if;

  select up.user_id
  into v_conflict_user
  from public.user_profiles up
  where up.username_normalized = v_validation.normalized
    and up.user_id <> target_user_id
  limit 1;

  if v_conflict_user is not null then
    return jsonb_build_object('ok', false, 'reason', 'That username is already in use.');
  end if;

  begin
    insert into public.user_profiles (
      user_id,
      username,
      username_normalized,
      username_set_at
    )
    values (
      target_user_id,
      v_validation.normalized,
      v_validation.normalized,
      timezone('utc'::text, now())
    )
    on conflict (user_id) do update
      set username = excluded.username,
          username_normalized = excluded.username_normalized,
          username_set_at = excluded.username_set_at;
  exception
    when unique_violation then
      return jsonb_build_object('ok', false, 'reason', 'That username is already in use.');
  end;

  return jsonb_build_object(
    'ok', true,
    'username', v_validation.normalized,
    'normalized', v_validation.normalized
  );
end;
$$;

create or replace function public.claim_username(candidate text)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_uid uuid := auth.uid();
begin
  if v_uid is null then
    return jsonb_build_object('ok', false, 'reason', 'You must be signed in.');
  end if;

  return public._claim_username_for_user(v_uid, candidate);
end;
$$;

create or replace function public.handle_new_auth_user_profile()
returns trigger
language plpgsql
security definer
set search_path = public, auth
as $$
declare
  v_candidate text;
  v_result jsonb;
begin
  v_candidate := nullif(trim(coalesce(new.raw_user_meta_data ->> 'username', '')), '');

  if v_candidate is null then
    insert into public.user_profiles (user_id)
    values (new.id)
    on conflict (user_id) do nothing;
    return new;
  end if;

  v_result := public._claim_username_for_user(new.id, v_candidate);

  if coalesce((v_result ->> 'ok')::boolean, false) = false then
    raise exception using message = coalesce(v_result ->> 'reason', 'Username could not be reserved.');
  end if;

  return new;
end;
$$;

drop trigger if exists on_auth_user_created_profile on auth.users;
create trigger on_auth_user_created_profile
after insert on auth.users
for each row
execute function public.handle_new_auth_user_profile();

insert into public.user_profiles (user_id)
select u.id
from auth.users u
on conflict (user_id) do nothing;

alter table public.user_profiles enable row level security;

drop policy if exists "user_profiles_select_own" on public.user_profiles;
create policy "user_profiles_select_own"
on public.user_profiles
for select
using (auth.uid() = user_id);

drop policy if exists "user_profiles_insert_own" on public.user_profiles;
create policy "user_profiles_insert_own"
on public.user_profiles
for insert
with check (auth.uid() = user_id);

drop policy if exists "user_profiles_update_own" on public.user_profiles;
create policy "user_profiles_update_own"
on public.user_profiles
for update
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

revoke all on function public.check_username_availability(text) from public;
grant execute on function public.check_username_availability(text) to anon, authenticated;

revoke all on function public.claim_username(text) from public;
grant execute on function public.claim_username(text) to authenticated;

create table if not exists public.leaderboard_snapshots (
  metric text not null,
  rank integer not null,
  user_id uuid not null references auth.users(id) on delete cascade,
  username text not null,
  score bigint not null,
  refreshed_at timestamp with time zone not null default timezone('utc'::text, now()),
  constraint leaderboard_metric_check check (metric in ('money_earned', 'fish_caught')),
  constraint leaderboard_rank_check check (rank >= 1 and rank <= 100),
  constraint leaderboard_score_check check (score >= 0),
  primary key (metric, rank),
  unique (metric, user_id)
);

create index if not exists leaderboard_metric_score_idx
  on public.leaderboard_snapshots (metric, score desc, rank asc);

create or replace function public.refresh_leaderboards()
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  v_refreshed_at timestamp with time zone := timezone('utc'::text, now());
begin
  delete from public.leaderboard_snapshots;

  with source as (
    select
      gs.user_id,
      up.username,
      up.username_normalized,
      greatest(
        0,
        floor(
          coalesce(
            case when coalesce(gs.save_data ->> 'totalCoinsEarned', '') ~ '^-?[0-9]+(\.[0-9]+)?$' then (gs.save_data ->> 'totalCoinsEarned')::numeric end,
            case when coalesce(gs.save_data ->> 'coins', '') ~ '^-?[0-9]+(\.[0-9]+)?$' then (gs.save_data ->> 'coins')::numeric end,
            0
          )
        )
      )::bigint as money_earned,
      greatest(
        0,
        floor(
          coalesce(
            case when coalesce(gs.save_data ->> 'totalCatches', '') ~ '^-?[0-9]+(\.[0-9]+)?$' then (gs.save_data ->> 'totalCatches')::numeric end,
            0
          )
        )
      )::bigint as fish_caught
    from public.game_saves gs
    inner join public.user_profiles up
      on up.user_id = gs.user_id
    where up.username_normalized is not null
  ),
  ranked_money as (
    select
      s.user_id,
      s.username,
      s.money_earned as score,
      row_number() over (
        order by s.money_earned desc, s.fish_caught desc, s.username_normalized asc
      ) as rank
    from source s
    where s.money_earned > 0
  ),
  ranked_fish as (
    select
      s.user_id,
      s.username,
      s.fish_caught as score,
      row_number() over (
        order by s.fish_caught desc, s.money_earned desc, s.username_normalized asc
      ) as rank
    from source s
    where s.fish_caught > 0
  )
  insert into public.leaderboard_snapshots (
    metric,
    rank,
    user_id,
    username,
    score,
    refreshed_at
  )
  select
    'money_earned',
    rm.rank,
    rm.user_id,
    rm.username,
    rm.score,
    v_refreshed_at
  from ranked_money rm
  where rm.rank <= 100
  union all
  select
    'fish_caught',
    rf.rank,
    rf.user_id,
    rf.username,
    rf.score,
    v_refreshed_at
  from ranked_fish rf
  where rf.rank <= 100;
end;
$$;

alter table public.leaderboard_snapshots enable row level security;

drop policy if exists "leaderboard_snapshots_select_all" on public.leaderboard_snapshots;
create policy "leaderboard_snapshots_select_all"
on public.leaderboard_snapshots
for select
using (true);

select public.refresh_leaderboards();

do $$
declare
  v_job_id bigint;
begin
  if to_regclass('cron.job') is null then
    begin
      create extension if not exists pg_cron with schema extensions;
    exception
      when others then
        raise notice 'pg_cron extension could not be created: %', sqlerrm;
    end;
  end if;

  if to_regclass('cron.job') is null then
    raise notice 'pg_cron is not available. Leaderboard auto-refresh schedule skipped.';
    return;
  end if;

  select j.jobid
  into v_job_id
  from cron.job j
  where j.jobname = 'refresh_leaderboards_every_10_minutes'
  limit 1;

  if v_job_id is not null then
    perform cron.unschedule(v_job_id);
  end if;

  perform cron.schedule(
    'refresh_leaderboards_every_10_minutes',
    '*/10 * * * *',
    'select public.refresh_leaderboards();'
  );
exception
  when others then
    raise notice 'Could not configure leaderboard cron schedule: %', sqlerrm;
end;
$$;

