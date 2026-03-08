-- Fix username validation false positives for consecutive underscores.
-- In SQL LIKE patterns, '_' is a wildcard; use literal substring detection instead.

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
