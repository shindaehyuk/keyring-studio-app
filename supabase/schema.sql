-- JUICE 사전예약 스키마
-- Supabase 대시보드 > SQL Editor 에 그대로 붙여넣고 실행하면 된다.
-- 여러 번 실행해도 안전하고, 이미 들어온 예약은 지워지지 않는다.

create extension if not exists pgcrypto with schema extensions;

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

-- 예약 확인·취소·수정에 쓰는 4자리 비밀번호 (해시로만 저장된다)
alter table public.reservations
  add column if not exists password text;

create index if not exists reservations_created_at_idx
  on public.reservations (created_at desc);
create index if not exists reservations_lookup_idx
  on public.reservations (name, phone_last4);

-- ---------------------------------------------------------------
-- 2. 비밀번호는 평문으로 두지 않는다
--    클라이언트는 평문을 보내지만, 저장 직전에 해시로 바꿔치기한다.
-- ---------------------------------------------------------------
create or replace function public.hash_reservation_password()
returns trigger
language plpgsql
security definer
set search_path = public, extensions
as $$
begin
  if new.password is null or new.password = '' then
    raise exception '예약 비밀번호가 필요합니다.';
  end if;
  -- 이미 해시된 값이면 그대로 둔다 (수정 시 재해시 방지)
  if new.password !~ '^\$2[aby]\$' then
    new.password := crypt(new.password, gen_salt('bf'));
  end if;
  return new;
end;
$$;

drop trigger if exists reservations_hash_password on public.reservations;
create trigger reservations_hash_password
  before insert or update of password on public.reservations
  for each row execute function public.hash_reservation_password();

-- ---------------------------------------------------------------
-- 3. 접근 권한 (RLS)
--    · 누구나 예약을 넣을 수는 있지만
--    · 목록을 읽고 지우는 것은 로그인한 관리자만 가능하다
--    · 손님은 아래 함수들을 통해서만 자기 예약에 닿을 수 있다
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

drop policy if exists "signed in admins can delete reservations" on public.reservations;
create policy "signed in admins can delete reservations"
  on public.reservations for delete
  to authenticated
  using (true);

-- ---------------------------------------------------------------
-- 4. 남은 수량 계산용 집계 뷰
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
-- 5. 손님용 — 이름 · 휴대폰 뒷 4자리 · 비밀번호가 모두 맞아야 한다
-- ---------------------------------------------------------------

-- 예약 조회
create or replace function public.find_reservations(
  p_name        text,
  p_phone_last4 text,
  p_password    text
)
returns table (
  id          text,
  name        text,
  phone_last4 text,
  items       jsonb,
  product_ids text[],
  created_at  timestamptz
)
language sql
stable
security definer
set search_path = public, extensions
as $$
  select r.id, r.name, r.phone_last4, r.items, r.product_ids, r.created_at
    from public.reservations r
   where r.name = btrim(p_name)
     and r.phone_last4 = p_phone_last4
     and r.password is not null
     and r.password = crypt(p_password, r.password)
   order by r.created_at desc;
$$;

-- 예약 취소
create or replace function public.cancel_reservation(
  p_id          text,
  p_phone_last4 text,
  p_password    text
)
returns boolean
language plpgsql
security definer
set search_path = public, extensions
as $$
declare
  removed int;
begin
  delete from public.reservations r
   where r.id = p_id
     and r.phone_last4 = p_phone_last4
     and r.password is not null
     and r.password = crypt(p_password, r.password);

  get diagnostics removed = row_count;
  return removed > 0;
end;
$$;

-- 예약 수정 — 고른 구성만 바꾼다
create or replace function public.update_reservation(
  p_id          text,
  p_phone_last4 text,
  p_password    text,
  p_items       jsonb,
  p_product_ids text[]
)
returns boolean
language plpgsql
security definer
set search_path = public, extensions
as $$
declare
  changed int;
begin
  update public.reservations r
     set items       = p_items,
         product_ids = p_product_ids
   where r.id = p_id
     and r.phone_last4 = p_phone_last4
     and r.password is not null
     and r.password = crypt(p_password, r.password);

  get diagnostics changed = row_count;
  return changed > 0;
end;
$$;

-- 예전 2-인자 취소 함수가 남아 있으면 정리한다
drop function if exists public.cancel_reservation(text, text);

revoke all on function public.find_reservations(text, text, text) from public;
revoke all on function public.cancel_reservation(text, text, text) from public;
revoke all on function public.update_reservation(text, text, text, jsonb, text[]) from public;

grant execute on function public.find_reservations(text, text, text) to anon, authenticated;
grant execute on function public.cancel_reservation(text, text, text) to anon, authenticated;
grant execute on function public.update_reservation(text, text, text, jsonb, text[]) to anon, authenticated;
