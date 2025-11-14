# 🚀 서버 연동 완전 가이드

## 📌 현재 상태

### ✅ 완료된 작업
- ✅ Supabase 프로젝트 생성 (`pqvtdkcapilwfrzduosn`)
- ✅ 백엔드 API 구현 완료 (`src/supabase/functions/server/index.tsx`)
- ✅ 프론트엔드 API 클라이언트 구현 (`src/utils/api.ts`)
- ✅ localStorage 기반 오프라인 모드 동작
- ✅ 서버 연동 활성화 완료 (하이브리드 모드)

### 🔄 현재 동작 방식
**하이브리드 모드**: 서버 우선 + localStorage 백업
- 서버 연결 성공 시: 서버 데이터 사용 + localStorage 동기화
- 서버 연결 실패 시: localStorage 데이터로 대체 (오프라인 모드)

---

## 🛠️ 서버 배포 3단계

### **1단계: Supabase CLI 설치 및 로그인**

```bash
# Homebrew로 CLI 설치 (macOS)
brew install supabase/tap/supabase

# 또는 npm으로 설치
npm install -g supabase

# Supabase 로그인
supabase login
```

---

### **2단계: 프로젝트 연결 및 Edge Function 배포**

```bash
# 프로젝트 폴더로 이동
cd "/Users/SonDongMin/Desktop/Local Food Review App"

# Supabase 프로젝트 연결
supabase link --project-ref pqvtdkcapilwfrzduosn

# Edge Function 배포
supabase functions deploy make-server-98b21042

# 환경 변수는 Supabase가 자동으로 설정합니다:
# - SUPABASE_URL
# - SUPABASE_SERVICE_ROLE_KEY
# - SUPABASE_ANON_KEY
```

#### 배포 후 확인
```bash
# 헬스체크 엔드포인트 테스트
curl https://pqvtdkcapilwfrzduosn.supabase.co/functions/v1/make-server-98b21042/health

# 응답 예시: {"status":"ok"}
```

---

### **3단계: 프론트엔드 테스트**

배포 완료 후 앱에서 다음 기능 테스트:

#### ✅ 테스트 체크리스트
1. **회원가입/로그인**
   - 새 계정 생성 → 서버에 저장되는지 확인
   - 로그인 → 토큰 발급 확인

2. **체험단 등록** (사업자)
   - 새 체험단 생성 → 서버에 저장 확인
   - 브라우저 새로고침 후에도 유지되는지 확인

3. **체험단 신청** (리뷰어)
   - 신청하기 → 서버에 저장 확인
   - 내 신청 목록에서 확인

4. **리뷰 작성**
   - 리뷰 작성 → 서버 저장 확인
   - 포인트 적립 확인

5. **오프라인 모드**
   - 서버 끄기 (또는 네트워크 차단)
   - 앱이 여전히 localStorage로 작동하는지 확인
   - "서버 연결 실패, 로컬 데이터 사용" 토스트 메시지 확인

---

## 📡 API 엔드포인트 목록

### 인증
- `POST /make-server-98b21042/signup` - 회원가입
- `POST /make-server-98b21042/signin` - 로그인
- `GET /make-server-98b21042/profile` - 프로필 조회

### 체험단 (Products)
- `POST /make-server-98b21042/products` - 체험단 등록
- `GET /make-server-98b21042/products` - 내 체험단 목록

### 신청 (Applications)
- `POST /make-server-98b21042/applications` - 체험단 신청
- `GET /make-server-98b21042/applications` - 내 신청 목록
- `PUT /make-server-98b21042/applications/:id` - 신청 상태 변경 (승인/거절)

### 찜하기 (Favorites)
- `POST /make-server-98b21042/favorites` - 찜 추가/제거
- `GET /make-server-98b21042/favorites` - 찜 목록 조회

### 리뷰 (Reviews)
- `POST /make-server-98b21042/reviews` - 리뷰 작성
- `GET /make-server-98b21042/reviews` - 내 리뷰 목록

### 알림 (Notifications)
- `POST /make-server-98b21042/notifications` - 알림 생성
- `GET /make-server-98b21042/notifications` - 알림 목록
- `PUT /make-server-98b21042/notifications/:id` - 알림 읽음 처리

---

## 🔍 디버깅 및 모니터링

### Supabase 대시보드에서 확인
1. **Functions 탭**: Edge Function 로그 확인
2. **Logs 탭**: 실시간 요청/응답 로그
3. **Database 탭**: KV Store 데이터 (실제로는 함수 내부 메모리 사용)

### 브라우저 개발자 도구
```javascript
// localStorage 데이터 확인
console.log('Applications:', localStorage.getItem('applications'));
console.log('Favorites:', localStorage.getItem('favorites'));
console.log('Reviews:', localStorage.getItem('completedReviews'));
console.log('User Points:', localStorage.getItem('userPoints'));

// 모든 localStorage 데이터 삭제 (테스트용)
localStorage.clear();
```

### 네트워크 요청 확인
1. 개발자 도구 → Network 탭
2. `/make-server-98b21042/` 필터링
3. 요청/응답 헤더 및 페이로드 확인

---

## 🔒 보안 고려사항

### ✅ 이미 구현된 보안 기능
- Supabase Auth 기반 사용자 인증
- JWT 토큰 기반 API 보호
- CORS 설정으로 출처 검증
- 환경 변수로 민감 정보 분리

### 🚧 추가 권장 사항
1. **Rate Limiting**: API 호출 제한 (Supabase 자동 적용)
2. **Input Validation**: 서버 측 데이터 검증 강화
3. **SSL/TLS**: Supabase가 자동으로 HTTPS 적용
4. **백업**: 정기적인 KV Store 데이터 백업

---

## 📊 성능 최적화

### 현재 구현
- ✅ localStorage를 통한 오프라인 캐싱
- ✅ 필요한 경우에만 서버 호출
- ✅ 낙관적 UI 업데이트 (즉시 반영 후 서버 동기화)

### 추가 최적화 가능
1. **데이터 페이징**: 대량 데이터 조회 시 페이지네이션
2. **이미지 최적화**: CDN 사용 또는 Supabase Storage
3. **캐시 전략**: SWR 또는 React Query 도입

---

## 🆘 문제 해결

### "npm command not found" 에러
```bash
# Node.js 설치 확인
which node

# nvm으로 Node.js 설치 (권장)
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
nvm install node
nvm use node
```

### "서버 연결 실패" 토스트 메시지
- Edge Function이 배포되지 않았을 가능성
- `supabase functions deploy` 명령 재실행
- Supabase 대시보드에서 Function 상태 확인

### 데이터가 서버에 저장되지 않음
1. 브라우저 콘솔에서 네트워크 에러 확인
2. Supabase Function 로그 확인
3. 인증 토큰이 올바른지 확인 (`accessToken`)

### localStorage와 서버 데이터 불일치
```javascript
// 서버 데이터로 localStorage 재동기화
localStorage.clear();
// 로그아웃 후 재로그인하면 서버 데이터로 다시 채워짐
```

---

## 📚 추가 참고 자료

- [Supabase Edge Functions 문서](https://supabase.com/docs/guides/functions)
- [Supabase Auth 가이드](https://supabase.com/docs/guides/auth)
- [Hono 프레임워크](https://hono.dev/)
- [Deno 런타임](https://deno.land/)

---

## 🎯 다음 단계

서버 배포 완료 후:

1. **실제 데이터베이스 연동** (선택사항)
   - 현재는 KV Store (메모리) 사용
   - PostgreSQL로 영구 저장소 전환 가능

2. **이미지 업로드**
   - Supabase Storage 활용
   - 리뷰 사진 업로드 기능

3. **실시간 알림**
   - Supabase Realtime 구독
   - 체험단 선정 시 실시간 알림

4. **분석 대시보드**
   - 사업자용 상세 통계
   - Google Analytics 연동

---

## ✅ 체크리스트

배포 전:
- [ ] Supabase CLI 설치 완료
- [ ] Supabase 로그인 완료
- [ ] 프로젝트 연결 완료

배포:
- [ ] Edge Function 배포 완료
- [ ] 헬스체크 엔드포인트 확인

테스트:
- [ ] 회원가입/로그인 테스트
- [ ] 체험단 CRUD 테스트
- [ ] 신청/승인 플로우 테스트
- [ ] 오프라인 모드 테스트

운영:
- [ ] 에러 모니터링 설정
- [ ] 백업 전략 수립
- [ ] 사용자 피드백 수집

---

**🎉 이제 서버 연동 준비가 완료되었습니다!**

`supabase functions deploy` 명령만 실행하면 바로 실시간 서버와 연동됩니다.
