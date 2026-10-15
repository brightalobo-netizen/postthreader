alter table scheduled_posts add column if not exists title text;
alter table scheduled_posts add column if not exists scheduled_date date;
alter table scheduled_posts add column if not exists impressions int default 0;
alter table scheduled_posts add column if not exists published_at timestamptz;
alter table scheduled_posts add column if not exists threads_post_id text;

update scheduled_posts 
set scheduled_date = (scheduled_at AT TIME ZONE 'UTC')::date
where scheduled_date is null and scheduled_at is not null;

create or replace function set_scheduled_date()
returns trigger as @supabase/supabase-js
begin
  if NEW.scheduled_at is not null then
    NEW.scheduled_date := (NEW.scheduled_at AT TIME ZONE 'UTC')::date;
  end if;
  return NEW;
end;
@supabase/supabase-js language plpgsql;

drop trigger if exists trg_set_scheduled_date on scheduled_posts;
create trigger trg_set_scheduled_date
before insert or update of scheduled_at on scheduled_posts
for each row execute function set_scheduled_date();

create table if not exists thread_posts (
  id uuid primary key default gen_random_uuid(),
  scheduled_post_id uuid references scheduled_posts(id) on delete cascade not null,
  content text not null,
  order_num int not null,
  media_url text,
  created_at timestamptz default now()
);

alter table thread_posts enable row level security;

drop policy if exists "Users can manage their own thread posts" on thread_posts;
create policy "Users can manage their own thread posts"
on thread_posts for all
using (
  exists (
    select 1 from scheduled_posts sp
    where sp.id = thread_posts.scheduled_post_id
    and sp.user_id = auth.uid()
  )
)
with check (
  exists (
    select 1 from scheduled_posts sp
    where sp.id = thread_posts.scheduled_post_id
    and sp.user_id = auth.uid()
  )
);

create index if not exists idx_scheduled_user_date on scheduled_posts (user_id, scheduled_date, scheduled_at);
create index if not exists idx_scheduled_user_status on scheduled_posts (user_id, status);
create index if not exists idx_thread_posts_parent on thread_posts (scheduled_post_id, order_num);

-- new table here
