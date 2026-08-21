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

-- 예약 시점에 안내한 총 금액 (원). 나중에 값이 바뀌어도 그때 금액이 남는다
alter table public.reservations
  add column if not exists total_price integer not null default 0;

-- 입금을 확인한 시각. 비어 있으면 아직 확인 전이다
alter table public.reservations
  add column if not exists paid_at timestamptz;

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

-- 관리자는 입금 확인만 표시할 수 있다.
-- RLS로는 칸을 나눌 수 없어서, 아예 paid_at 한 칸에만 update 권한을 준다.
-- (손님용 예약 수정은 security definer 함수가 소유자 권한으로 도니 영향이 없다)
revoke update on public.reservations from anon, authenticated;
grant update (paid_at) on public.reservations to authenticated;

drop policy if exists "signed in admins can mark payment" on public.reservations;
create policy "signed in admins can mark payment"
  on public.reservations for update
  to authenticated
  using (true)
  with check (true);

-- ---------------------------------------------------------------
-- 4. 남은 수량 계산용 집계 뷰
--    개인정보는 넣지 않고 '무엇이 몇 개 나갔는지'만 공개한다.
--    security_invoker 를 켜지 않으므로 뷰 소유자 권한으로 실행되어
--    RLS 를 우회한다. 노출되는 값은 상품 id·사이즈·개수뿐이다.
-- ---------------------------------------------------------------
drop view if exists public.reserved_counts;
create view public.reserved_counts as
  select
    item ->> 'productId'      as product_id,
    item ->> 'size'           as size,
    count(*)::int             as count
  from public.reservations,
       lateral jsonb_array_elements(items) as item
  group by 1, 2;

grant select on public.reserved_counts to anon, authenticated;

-- ---------------------------------------------------------------
-- 4-1. 준비 수량
--      서버도 '무엇을 몇 개 준비했는지' 알아야 초과 접수를 막을 수 있다.
--      아래 목록은 src/data/products.ts 에서 자동으로 만들어진다.
--      수량을 바꿨다면 이 파일을 SQL Editor 에서 다시 실행하면 된다.
-- ---------------------------------------------------------------
create table if not exists public.product_stock (
  key      text primary key,          -- 'sponge-lion' 또는 'tshirt-1:L'
  prepared integer not null check (prepared >= 0)
);

alter table public.product_stock enable row level security;

drop policy if exists "anyone can read prepared counts" on public.product_stock;
create policy "anyone can read prepared counts"
  on public.product_stock for select
  to anon, authenticated
  using (true);

-- >>> 준비 수량 (scripts/stock-sql.mjs 가 자동으로 채운다 — 직접 고치지 말 것)
insert into public.product_stock (key, prepared) values
  ('sponge-lion', 50),
  ('spatula-lion', 50),
  ('coffee-lion', 50),
  ('snack-lion', 50),
  ('bible-lion', 50),
  ('tshirt-1:S', 3),
  ('tshirt-1:M', 5),
  ('tshirt-1:L', 15),
  ('tshirt-1:XL', 10),
  ('tshirt-1:XXL', 2),
  ('tshirt-2:M', 5),
  ('tshirt-2:L', 18),
  ('tshirt-2:XL', 10),
  ('tshirt-2:XXL', 2),
  ('tshirt-3:S', 3),
  ('tshirt-3:M', 5),
  ('tshirt-3:L', 15),
  ('tshirt-3:XL', 5),
  ('tshirt-3:XXL', 2),
  ('nametag-keyring', 50)
on conflict (key) do update set prepared = excluded.prepared;

-- 더 이상 팔지 않는 항목은 정리한다
delete from public.product_stock where key <> all (array['sponge-lion', 'spatula-lion', 'coffee-lion', 'snack-lion', 'bible-lion', 'tshirt-1:S', 'tshirt-1:M', 'tshirt-1:L', 'tshirt-1:XL', 'tshirt-1:XXL', 'tshirt-2:M', 'tshirt-2:L', 'tshirt-2:XL', 'tshirt-2:XXL', 'tshirt-3:S', 'tshirt-3:M', 'tshirt-3:L', 'tshirt-3:XL', 'tshirt-3:XXL', 'nametag-keyring']);
-- <<< 준비 수량 끝

-- ---------------------------------------------------------------
-- 5. 손님용 — 이름 · 휴대폰 뒷 4자리 · 비밀번호가 모두 맞아야 한다
--
--    create or replace 는 함수의 반환 타입을 바꾸지 못한다.
--    이 파일을 다시 실행할 때 컬럼이 늘어난 경우에도 통과하도록
--    만들기 전에 예전 함수를 먼저 지운다. (예전 시그니처도 함께)
-- ---------------------------------------------------------------
drop function if exists public.find_reservations(text, text, text);
drop function if exists public.cancel_reservation(text, text);
drop function if exists public.cancel_reservation(text, text, text);
drop function if exists public.update_reservation(text, text, text, jsonb, text[]);
drop function if exists public.update_reservation(text, text, text, jsonb, text[], integer);
drop function if exists public.create_reservation(text, text, text, text, jsonb, text[], integer);
drop function if exists public.short_of_stock(jsonb, text);

-- 담으려는 구성이 남은 수량을 넘는지 본다.
-- 넘으면 모자란 항목의 키('tshirt-1:L')를, 괜찮으면 null 을 준다.
-- p_exclude_id 는 수정 중인 예약 자신의 몫을 빼기 위한 값이다.
create or replace function public.short_of_stock(
  p_items      jsonb,
  p_exclude_id text default null
)
returns text
language plpgsql
security definer
set search_path = public, extensions
as $$
declare
  need     record;
  taken    integer;
  prepared integer;
begin
  for need in
    select (item ->> 'productId') || coalesce(':' || (item ->> 'size'), '') as key,
           count(*)::int                                                   as want
      from jsonb_array_elements(p_items) as item
     group by 1
  loop
    select ps.prepared into prepared
      from public.product_stock ps
     where ps.key = need.key;

    -- 준비 수량을 모르는 항목은 막지 않는다 (상품을 새로 넣고 이 파일을
    -- 아직 실행하지 않았더라도 접수는 계속되도록)
    if prepared is null then
      continue;
    end if;

    select count(*)::int into taken
      from public.reservations r,
           lateral jsonb_array_elements(r.items) as it
     where (p_exclude_id is null or r.id <> p_exclude_id)
       and (it ->> 'productId') || coalesce(':' || (it ->> 'size'), '') = need.key;

    if taken + need.want > prepared then
      return need.key;
    end if;
  end loop;

  return null;
end;
$$;

-- 예약 접수 — 수량 확인과 저장을 한 번에 한다.
--
-- 화면에서도 담기 전에 남은 수량을 보지만, 마지막 하나를 두 사람이 같은
-- 순간에 누르면 둘 다 통과해 버린다. 여기서는 접수를 한 줄로 세워
-- (advisory lock) 확인과 저장 사이에 끼어들 틈을 없앤다.
--
-- 돌려주는 값
--   'ok'             접수됨
--   'sold_out:<키>'  그 사이에 수량이 찼음
--   'duplicate'      예약번호가 이미 있음
create or replace function public.create_reservation(
  p_id          text,
  p_name        text,
  p_phone_last4 text,
  p_password    text,
  p_items       jsonb,
  p_product_ids text[],
  p_total_price integer
)
returns text
language plpgsql
security definer
set search_path = public, extensions
as $$
declare
  short text;
begin
  -- 같은 순간에 들어온 접수를 차례로 처리한다 (트랜잭션이 끝나면 자동 해제)
  perform pg_advisory_xact_lock(hashtext('juice:reservation'));

  short := public.short_of_stock(p_items, null);
  if short is not null then
    return 'sold_out:' || short;
  end if;

  insert into public.reservations (id, name, phone_last4, password, items, product_ids, total_price)
  values (p_id, btrim(p_name), p_phone_last4, p_password, p_items, p_product_ids, p_total_price);

  return 'ok';
exception
  when unique_violation then
    return 'duplicate';
end;
$$;

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
  total_price integer,
  created_at  timestamptz
)
language sql
stable
security definer
set search_path = public, extensions
as $$
  select r.id, r.name, r.phone_last4, r.items, r.product_ids, r.total_price, r.created_at
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
  p_product_ids text[],
  p_total_price integer
)
returns boolean
language plpgsql
security definer
set search_path = public, extensions
as $$
declare
  changed int;
  short   text;
begin
  perform pg_advisory_xact_lock(hashtext('juice:reservation'));

  -- 수정으로도 준비 수량을 넘길 수 있다. 자기 몫은 빼고 센다.
  short := public.short_of_stock(p_items, p_id);
  if short is not null then
    return false;
  end if;

  update public.reservations r
     set items       = p_items,
         product_ids = p_product_ids,
         total_price = p_total_price
   where r.id = p_id
     and r.phone_last4 = p_phone_last4
     and r.password is not null
     and r.password = crypt(p_password, r.password);

  get diagnostics changed = row_count;
  return changed > 0;
end;
$$;

revoke all on function public.short_of_stock(jsonb, text) from public;
revoke all on function public.find_reservations(text, text, text) from public;
revoke all on function public.cancel_reservation(text, text, text) from public;
revoke all on function public.create_reservation(text, text, text, text, jsonb, text[], integer) from public;
revoke all on function public.update_reservation(text, text, text, jsonb, text[], integer) from public;

grant execute on function public.find_reservations(text, text, text) to anon, authenticated;
grant execute on function public.cancel_reservation(text, text, text) to anon, authenticated;
grant execute on function public.create_reservation(text, text, text, text, jsonb, text[], integer) to anon, authenticated;
grant execute on function public.update_reservation(text, text, text, jsonb, text[], integer) to anon, authenticated;
