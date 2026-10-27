-- Function to handle heart refill
create or replace function handle_heart_refill()
returns void as $$
begin
  update profiles
  set hearts_balance = 5,
      last_heart_refill = now()
  where hearts_balance < 5
  and last_heart_refill < now() - interval '4 hours';
end;
$$ language plpgsql;
