# 밥터뷰 (Babterview) 🍽️

> "우리동네 맛평가단" - 중소 식품 사업자와 소비자를 잇는 솔직한 맛 평가 & 홍보 플랫폼

## ✨ 지금 바로 방문하기 **[🔗 Demo 바로가기](https://local-food-review-app.vercel.app/)**

<p align="center">

<img width="1236" height="824" alt="ChatGPT Image 2026년 6월 10일 오후 06_36_31" src="https://github.com/user-attachments/assets/f618d540-8e29-4aa3-8161-f1f6206d9bcf" />

-----

## 📖 소개

**밥터뷰**는 동네 식당 사장님과 손님을 "체험단"으로 연결하는 모바일 웹 서비스입니다.

사장님은 신메뉴나 주력 메뉴를 체험단에게 제공하고, 손님(맛평가단)은 저렴하거나 무료로 음식을 경험한 뒤 **장점 / 단점 / 개선점**으로 구분된 솔직한 리뷰를 남깁니다. 사장님은 이렇게 모인 리뷰를 대시보드에서 분석해 메뉴 개선과 홍보에 활용하고, 손님은 리뷰를 쓸 때마다 포인트를 적립해 등급을 올리고 상점에서 사용합니다.

배달앱의 단순 별점 대신 **구조화된 정성 피드백**을 주고받는 것이 밥터뷰의 핵심입니다.

## 🤔 어떤 문제를 푸나요

- 대형 브랜드가 마케팅을 독점해, 동네 식당·중소 식품 사업자는 인지도를 쌓기 어렵고 광고비 부담이 큽니다.
- 기존 별점 리뷰는 신뢰도가 낮고, "무엇을 어떻게 고쳐야 하는지"에 대한 구체적 피드백을 얻기 어렵습니다.

밥터뷰는 무신사·화해류의 **체험단 모델**을 동네 식품에 적용해, 사장님에게는 실질적인 개선 인사이트를, 손님에게는 새로운 맛집을 저렴하게 경험할 기회를 제공합니다.

## ✨ 주요 기능

밥터뷰는 사장님(B2B)과 맛평가단(B2C) 두 종류의 사용자를 하나의 앱에서 지원합니다.

### 🧑‍🍳 사장님 (B2B)

- **체험단 모집** — 가게와 메뉴를 등록해 맛평가단을 모집합니다.
- **신청자 관리** — 신청한 리뷰어(이름·연락처·등급)를 확인하고 선정 / 거절 처리합니다.
- **리뷰 관리** — 받은 리뷰를 모아보고, 부적절한 리뷰는 비공개 처리할 수 있습니다.
- **통계 대시보드** — 기간별(주/월/전체) 신청·리뷰 추이, 모집률, 리뷰 작성률, 체험단별 성과를 차트로 확인합니다.
- **리뷰 분석 리포트** — 리뷰의 장점·단점 텍스트를 분석해 **자주 언급된 키워드 TOP 5**, **긍정/부정 비중**, 요약 코멘트를 자동으로 보여줍니다. "무엇이 좋았고 무엇을 고쳐야 하는지"를 한눈에 파악할 수 있습니다.

### ✍️ 맛평가단 (B2C)

- **위치 기반 탐색** — 현재 위치를 기준으로 가까운 체험단을 거리순으로 보고, 반경(500m~3km)으로 필터링합니다.
- **탐색·찜·신청** — 카테고리/검색/정렬로 체험단을 찾고, 찜하거나 바로 신청합니다.
- **신청 현황 추적** — 마이페이지에서 신청 상태(대기중·선정·미선정)를 확인합니다.
- **실시간 알림** — 선정/미선정 결과를 알림으로 받습니다.
- **구조화 리뷰 작성** — 선정 후 장점 / 단점 / 개선점으로 나눠 사진과 함께 리뷰를 남깁니다.
- **레벨 & 포인트** — 리뷰를 쓰면 포인트가 적립되고, 5단계 등급(새싹 → 전문 평가단)으로 성장합니다. 등급이 오르면 리뷰 포인트 보너스와 우선 선정 등 혜택이 커지고, 포인트는 상점에서 사용합니다.

## 🧩 눈여겨볼 만한 구현

- **위치 계산** — 브라우저 Geolocation으로 현재 좌표를 얻고, **하버사인(Haversine) 공식**으로 각 체험단까지 거리를 계산해 정렬·필터링합니다. (`utils/locationUtils.ts`)
- **리뷰 텍스트 분석** — 리뷰의 장점/단점을 토큰화·불용어 제거 후 빈도 집계해 키워드를 추출하고, 텍스트 비중으로 긍정/부정 감성을 추정합니다. (`utils/reviewAnalytics.ts`)
- **게이미피케이션** — 포인트 구간 기반 5단계 레벨, 레벨별 포인트 배수·혜택, 다음 레벨까지 진행률 계산. (`data/levelSystem.ts`, `stores/pointStore.ts`)
- **PWA / 오프라인 캐싱** — Service Worker에 App Shell은 Cache-First, 이미지 Stale-While-Revalidate, 내비게이션 Network-First + 오프라인 폴백 페이지를 적용하고, 웹 푸시 알림을 지원합니다. (`public/sw.js`)
- **폼 검증** — 로그인/회원가입/리뷰/체험단 등록 폼을 **Zod 스키마**로 검증하고, 필드별 에러 메시지를 정규화해 제공합니다. (`utils/validation.ts`)
- **접근성** — SkipLink, LiveRegion(스크린리더 안내), VisuallyHidden, 포커스 트랩 훅 등 접근성 컴포넌트를 갖췄습니다.

## 🗂️ 상태 관리 & 데이터 저장

도메인별로 분리된 **Zustand** 스토어로 전역 상태를 관리합니다.

| 스토어 | 역할 |
| --- | --- |
| `authStore` | 로그인 사용자 정보 / 토큰 |
| `productStore` | 체험단(상품) 목록, 찜, 선택 상품 |
| `applicationStore` | 체험단 신청 내역 |
| `reviewStore` | 작성된 리뷰, 공개/비공개 |
| `notificationStore` | 알림 |
| `pointStore` | 포인트 적립·사용, 레벨 |

각 스토어는 브라우저 `localStorage`와 연동되어, 새로고침하거나 로그아웃 후 다시 로그인해도 체험단·신청·리뷰·포인트 데이터가 유지됩니다. 인증과 서버 API는 **Supabase**(Auth, Edge Functions)를 사용합니다.

## 🛠️ 기술 스택

| 구분 | 사용 기술 |
| --- | --- |
| Core | React 18, TypeScript, Vite |
| Routing | React Router (react-router-dom v6) |
| State | Zustand (도메인별 스토어) |
| Styling | Tailwind CSS, Radix UI, motion |
| Form & Validation | React Hook Form, Zod |
| Charts | Recharts |
| Backend | Supabase (Auth, Edge Functions) |
| PWA | Web App Manifest + Service Worker |
| Test | Vitest, Testing Library |
| Deploy | Vercel |

## 🚀 빠른 시작

### 요구사항

- Node.js 20+ 권장
- npm
- Supabase 프로젝트 정보

### 로컬 실행

```bash
git clone https://github.com/Duckcchun/Local-Food-Review-App.git
cd Local-Food-Review-App

npm install
```

프로젝트 루트에 `.env.local` 파일을 생성하고 아래 값을 채웁니다. (참고: 저장소에는 예시용 `.env.example`이 포함되어 있습니다.)

```bash
VITE_SUPABASE_PROJECT_ID=your-project-id
VITE_SUPABASE_ANON_KEY=your-anon-public-key
```

```bash
npm run dev
```

브라우저에서 **[http://localhost:3000](http://localhost:3000/)** 접속

### 프로덕션 빌드 확인

```bash
npm run build
npm run preview
```

### 테스트 실행

```bash
npm run test           # 단위 테스트 (Vitest, 1회 실행)
npm run test:watch     # 감시 모드
npm run test:coverage  # 커버리지 리포트
```

현재 리뷰 분석, 폼 검증, 이미지 업로드 검증, 레벨/포인트 로직에 대한 단위 테스트가 포함되어 있습니다.

## 📂 폴더 구조

```
/
├─ public/                # favicon, service worker(sw.js) 등 정적 에셋
├─ src/
│  ├─ components/          # 화면 및 재사용 UI 컴포넌트
│  │  ├─ common/            # EmptyState, LiveRegion, SkipLink 등 공용/접근성 컴포넌트
│  │  ├─ ui/                # Radix 기반 UI 프리미티브 (button, dialog, tabs 등)
│  │  └─ *.tsx              # HomePage, BusinessDashboard, ReviewWritePage 등 화면 컴포넌트
│  ├─ pages/               # 라우트 진입점 (*Route.tsx) — URL과 화면 컴포넌트 연결
│  ├─ layouts/             # MainLayout 등 공통 레이아웃
│  ├─ stores/              # Zustand 스토어 (auth, product, application, review, notification, point)
│  ├─ hooks/               # 커스텀 훅 (useLocalStorage, useDarkMode, usePWA, useFocusTrap 등)
│  ├─ data/                # categories, levelSystem, pointShop, mockData 등 정적/시드 데이터
│  ├─ supabase/            # Supabase Edge Functions (functions/server)
│  ├─ utils/               # locationUtils, reviewAnalytics, validation, imageUpload, statsUtils 등
│  │  └─ supabase/          # Supabase 클라이언트 정보(info)
│  ├─ types/               # 전역 TypeScript 타입 정의 (index.ts, types.ts)
│  ├─ figma/               # 디자인 연동 자산 (ImageWithFallback)
│  ├─ styles/              # 전역 스타일 (globals.css)
│  ├─ test/                # 테스트 셋업 (Vitest)
│  ├─ routes.tsx           # 라우트 정의
│  ├─ App.tsx              # 메인 애플리케이션
│  └─ main.tsx             # 애플리케이션 진입점
├─ .env.example           # 환경 변수 예시 (Supabase 키 등)
├─ manifest.webmanifest   # PWA 매니페스트
├─ package.json
├─ postcss.config.js
└─ vite.config.ts         # Vite 설정
```

## 📬 Contact

- **GitHub:** [@Duckcchun](https://github.com/Duckcchun)
- **Email:** qasw1733@gmail.com
