# Supabase · Vercel 연결 가이드

사이트 코드는 준비돼 있습니다. 아래 값만 채우면 예약이 서버에 쌓이고,
남은 수량이 실제 접수분을 반영하며, `/admin` 에서 예약을 볼 수 있습니다.

환경변수가 비어 있으면 예전처럼 **브라우저에만 저장되는 모드**로 그대로 동작하니,
설정 전에도 사이트는 깨지지 않습니다.

---

## 1. Supabase 프로젝트 만들기

1. <https://supabase.com> 에서 프로젝트를 만듭니다. (Region 은 `Northeast Asia (Seoul)` 권장)
2. 왼쪽 메뉴 **SQL Editor** 에 [`supabase/schema.sql`](../supabase/schema.sql) 내용을 붙여넣고 **Run**.
   - `reservations` 테이블
   - 접근 규칙(RLS) — 누구나 예약을 넣을 수 있고, **읽는 것은 로그인한 관리자만**
   - `reserved_counts` 뷰 — 개인정보 없이 "무엇이 몇 개 나갔는지"만 공개 (남은 수량 계산용)

## 2. 관리자 계정 만들기

`/admin` 은 Supabase 로그인으로 들어갑니다. 비밀번호를 코드나 환경변수에 두지 않아
유출 위험이 없고, 권한은 Supabase 가 서버에서 검사합니다.

1. **Authentication → Users → Add user** 로 이동
2. 이메일과 비밀번호를 정해 계정을 하나 만듭니다 (Auto Confirm User 켜기)
3. 이 계정으로만 `/admin` 에 로그인됩니다. 사람이 늘면 계정을 더 추가하면 됩니다.

> **Authentication → Providers → Email** 에서 "Enable sign ups" 는 **꺼두세요.**
> 켜져 있으면 아무나 계정을 만들어 예약 목록을 볼 수 있습니다.

## 3. 키 확인

**Project Settings → API Keys** 에서 두 값을 복사합니다.

| 이름 | 환경변수 |
| --- | --- |
| `Project URL` | `NEXT_PUBLIC_SUPABASE_URL` |
| `publishable` 키 (`sb_publishable_...`) | `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` |

publishable 키는 브라우저에 실려 나가는 공개 키이고, 권한은 RLS 가 막습니다.
예전 프로젝트에서 쓰던 `anon` 키를 그대로 두고 싶다면
`NEXT_PUBLIC_SUPABASE_ANON_KEY` 로 넣어도 동작합니다. 둘 다 있으면 publishable 쪽을 씁니다.

`secret` 키(예전 `service_role`)는 **쓰지 않습니다.** 브라우저에 들어가면 안 되는 키입니다.

## 4. Vercel 연결

1. <https://vercel.com> 에서 **Add New → Project** → 이 GitHub 저장소를 선택
2. 프레임워크는 Next.js 로 자동 인식됩니다. 빌드 설정은 건드릴 필요 없습니다.
3. **Environment Variables** 에 위 두 값을 넣습니다.

   ```
   NEXT_PUBLIC_SUPABASE_URL             = https://xxxxxxxx.supabase.co
   NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY = sb_publishable_xxxxxxxx
   ```

   `NEXT_PUBLIC_BASE_PATH` 는 **넣지 마세요.** 서브경로 배포용이라,
   Vercel 에서 설정하면 링크가 전부 깨집니다.

4. Deploy 를 누르면 끝입니다.

환경변수를 나중에 추가했다면 **Deployments → 최신 배포 → Redeploy** 를 한 번 돌려야 반영됩니다.
`NEXT_PUBLIC_` 값은 빌드할 때 코드에 박히기 때문입니다.

---

## 확인해볼 것

- 사전예약을 한 건 넣어보고 Supabase **Table Editor → reservations** 에 줄이 생기는지
- `/admin` 에 로그인해 그 예약이 보이는지
- 예약한 사이즈의 남은 수량이 하나 줄어드는지

## 수량을 바꾸려면

준비 수량은 `src/data/products.ts` 에 있습니다.

- 키링·명찰: `stock: 50`
- 티셔츠: `sizeStock: { S: 3, M: 5, ... }`

여기 적힌 수에서 실제 접수분을 뺀 값이 "남은 수량" 으로 표시됩니다.
숫자를 고치고 다시 배포하면 반영됩니다.
