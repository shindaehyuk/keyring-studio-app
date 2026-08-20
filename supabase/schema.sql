-- JUICE 사전예약 스키마
-- Supabase 대시보드 > SQL Editor 에 그대로 붙여넣고 실행하면 된다.

-- ---------------------------------------------------------------
-- 1. 예약 테이블
-- ---------------------------------------------------------------
create table if not exists public.reservations (
  id           text primary key,
  name         text not null,
  phone_last4  text not null check (phone_last4 ~ '^[0-9]{4}$'),
  items        jsonb not null default '[]'::jsonb,
  product_ids  text[] not null default '{}',
  created_at   timestamptz not null default now()
);

create index if not exists reservations_created_at_idx
  on public.reservations (created_at desc);

-- ---------------------------------------------------------------
-- 2. 접근 권한 (RLS)
--    · 누구나 예약을 넣을 수는 있지만
--    · 목록을 읽는 것은 로그인한 관리자만 가능하다
-- ---------------------------------------------------------------
alter table public.reservations enable row level security;

drop policy if exists "anyone can insert a reservation" on public.reservations;
create policy "anyone can insert a reservation"
  on public.reservations for insert
  to anon, authenticated
  with check (true);

drop policy if exists "signed in admins can read reservations" on public.reservations;
create policy "signed in admins can read reservations"
  on public.reservations for select
  to authenticated
  using (true);

-- ---------------------------------------------------------------
-- 3. 남은 수량 계산용 집계 뷰
--    개인정보는 넣지 않고 '무엇이 몇 개 나갔는지'만 공개한다.
--    security_invoker 를 켜지 않으므로 뷰 소유자 권한으로 실행되어
--    RLS 를 우회한다. 노출되는 값은 상품 id·사이즈·개수뿐이다.
-- ---------------------------------------------------------------
create or replace view public.reserved_counts as
  select
    item ->> 'productId'      as product_id,
    item ->> 'size'           as size,
    count(*)::int             as count
  from public.reservations,
       lateral jsonb_array_elements(items) as item
  group by 1, 2;

grant select on public.reserved_counts to anon, authenticated;

-- ---------------------------------------------------------------
-- 4. 예약 취소
--    예약 번호만으로 지울 수 있으면 남의 예약도 지울 수 있으므로,
--    번호 + 휴대폰 뒷 4자리가 모두 맞을 때만 지운다.
--    (security definer 라 RLS 를 통과하지만, 조건은 이 함수가 검사한다)
-- ---------------------------------------------------------------
create or replace function public.cancel_reservation(
  p_id          text,
  p_phone_last4 text
)
returns boolean
language plpgsql
security definer
set search_path = public
as $$
declare
  removed int;
begin
  delete from public.reservations
   where id = p_id
     and phone_last4 = p_phone_last4;

  get diagnostics removed = row_count;
  return removed > 0;
end;
$$;

revoke all on function public.cancel_reservation(text, text) from public;
grant execute on function public.cancel_reservation(text, text) to anon, authenticated;
