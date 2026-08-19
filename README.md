# JUICE

나만의 이야기를 담은 아크릴 키링 — **굿즈 홍보 & 사전예약 사이트** (모바일 웹).

판매/결제 없이 굿즈를 소개하고 정식 오픈 전 사전예약을 받는 마이크로사이트입니다.
굿즈 일러스트는 이미지 에셋 없이 전부 인라인 SVG로 그려집니다.

## 화면

- **홈(랜딩)** — 히어로 배너 · 오픈 카운트다운 · 대표 굿즈 · 사전예약 혜택 · CTA
- **컬렉션** — 카테고리 필터 + 굿즈 그리드
- **굿즈 상세** — 일러스트 · 예약가 · 굿즈 정보 · 공유/관심 · 사전예약 진입
- **사전예약** — 이름/연락처 + 관심 키링 다중 선택 → 예약 번호 발급
- **관심 굿즈 / 내 예약** — 하트 목록, 예약 내역 확인·취소

관심 굿즈·예약 내역은 `localStorage`에 보관됩니다(MVP). 백엔드 수집은 로드맵 M5 참고.

## 기술 스택

Next.js 15 (App Router) · React 19 · TypeScript · CSS(디자인 토큰)

SEO/OG 메타데이터는 Next Metadata API로 페이지·굿즈별 생성됩니다.

## 실행

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # 프로덕션 빌드
npm start
```

## 배포 (GitHub Pages)

`master` 브랜치에 push하면 GitHub Actions가 정적 빌드 후 GitHub Pages로 자동 배포합니다.

- 배포 주소: `https://<계정>.github.io/keyring-studio-app/`
- 워크플로: [.github/workflows/deploy.yml](./.github/workflows/deploy.yml) — Next.js `output: 'export'`로 `out/`을 생성해 업로드
- 첫 배포 전 저장소 **Settings → Pages → Source**가 `GitHub Actions`인지 확인하세요 (워크플로가 자동 활성화를 시도하지만, 실패 시 수동으로 한 번 설정 필요)
- Actions 탭에서 `Deploy to GitHub Pages` 워크플로를 수동 실행(workflow_dispatch)할 수도 있습니다

## 문서

- [PLAN.md](./PLAN.md) — 서비스 기획서 (IA, 화면 정의, 디자인 시스템, 로드맵)
