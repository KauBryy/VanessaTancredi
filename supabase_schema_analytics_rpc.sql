-- FUNCTION: GET_DASHBOARD_STATS
create or replace function get_dashboard_stats()
returns json
language plpgsql
as $$
declare
  result json;
begin
  select json_build_object(
    'visitors24h', (select count(distinct visitor_id) from site_stats where created_at > now() - interval '24 hours'),
    'views24h', (select count(*) from site_stats where created_at > now() - interval '24 hours'),
    'visitors7d', (select count(distinct visitor_id) from site_stats where created_at > now() - interval '7 days'),
    'visitors30d', (select count(distinct visitor_id) from site_stats where created_at > now() - interval '30 days')
  ) into result;
  return result;
end;
$$;
