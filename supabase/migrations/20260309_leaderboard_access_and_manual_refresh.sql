-- Ensure leaderboard rows are readable from the web client and add
-- an authenticated fallback refresh RPC for environments without pg_cron.

grant select on table public.leaderboard_snapshots to anon, authenticated;

grant select, insert, update on table public.user_profiles to authenticated;

create or replace function public.request_leaderboard_refresh()
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_uid uuid := auth.uid();
  v_now timestamp with time zone := timezone('utc'::text, now());
  v_last_refreshed_at timestamp with time zone;
begin
  if v_uid is null then
    return jsonb_build_object(
      'ok', false,
      'refreshed', false,
      'reason', 'You must be signed in.'
    );
  end if;

  select max(ls.refreshed_at)
  into v_last_refreshed_at
  from public.leaderboard_snapshots ls;

  if v_last_refreshed_at is not null and (v_now - v_last_refreshed_at) < interval '60 seconds' then
    return jsonb_build_object(
      'ok', true,
      'refreshed', false,
      'reason', 'Leaderboard was refreshed recently.'
    );
  end if;

  perform public.refresh_leaderboards();

  return jsonb_build_object(
    'ok', true,
    'refreshed', true
  );
exception
  when others then
    return jsonb_build_object(
      'ok', false,
      'refreshed', false,
      'reason', sqlerrm
    );
end;
$$;

revoke all on function public.request_leaderboard_refresh() from public;
grant execute on function public.request_leaderboard_refresh() to authenticated;
