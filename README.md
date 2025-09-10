# T world 리뷰 분석 시스템

iOS App Store와 Google Play의 T world 앱 리뷰를 자동으로 수집하고 AI로 분석하는 시스템입니다.

## 🎯 주요 기능

- **자동 리뷰 수집**: iOS/Android 스토어에서 매일 최신 리뷰 수집
- **AI 토픽 분석**: Gemini 2.5 Flash로 반복 언급 토픽 자동 분석
- **실시간 대시보드**: 수집된 데이터를 시각화하여 표시
- **스케줄링**: GitHub Actions로 매일 자동 실행 (KST 02:00)

## 🛠 기술 스택

- **Frontend**: Next.js 15 (App Router), Tailwind CSS
- **Backend**: Node.js, TypeScript
- **Database**: Prisma + SQLite (Supabase 전환 가능)
- **AI**: Google Gemini 2.5 Flash
- **스케줄링**: GitHub Actions
- **패키지 매니저**: pnpm

## 🚀 빠른 시작

### 1. 환경 설정

```bash
# 저장소 클론
git clone <repository-url>
cd tworld-review-analyzer

# 의존성 설치
pnpm install

# 환경변수 설정
cp env.example .env
# .env 파일에서 API 키 확인/수정
```

### 2. 데이터베이스 설정

```bash
# Prisma 클라이언트 생성
pnpm prisma generate

# 데이터베이스 스키마 적용
pnpm db:push

# 시드 데이터 생성
pnpm seed
```

### 3. 개발 서버 실행

```bash
# 개발 모드 실행
pnpm dev

# 브라우저에서 http://localhost:3000 접속
```

## 📋 사용 가능한 명령어

```bash
# 개발 서버
pnpm dev

# 프로덕션 빌드
pnpm build
pnpm start

# 데이터베이스 관리
pnpm db:push          # 스키마 적용
pnpm seed             # 시드 데이터 생성

# 리뷰 수집 및 분석
pnpm fetch            # 리뷰 수집
pnpm summarize        # 토픽 분석 및 요약
pnpm daily            # 전체 작업 (수집 + 분석)
```

## ⚙️ 환경변수

`.env` 파일에 다음 변수들을 설정하세요:

```bash
# 데이터베이스
DATABASE_URL="file:./dev.db"

# AI API
GEMINI_API_KEY="your-gemini-api-key"

# 앱 정보
APPSTORE_APP_ID="428872117"
GOOGLE_PLAY_APP_ID="com.sktelecom.minit"

# 선택사항 (대용량 처리 시)
REDIS_URL=""
```

## 🤖 AI 분석 기능

### 토픽 클러스터링
- 키워드 추출 및 유사도 기반 그룹화
- 자동 토픽명 생성
- 감성 분석 (긍정/중립/부정)

### AI 요약 생성
- 각 토픽별 핵심 내용 요약
- 긴급도 평가 (낮음/보통/높음)
- 개선 제안 자동 생성

## 📊 대시보드 기능

### KPI 카드
- 일일 수집 리뷰 수
- 7일간 총 리뷰 수
- 평균 평점
- 발견된 토픽 수

### 토픽 분석 테이블
- 토픽명 및 키워드
- 발생 빈도
- 감성 및 긴급도
- AI 요약 및 개선 제안

### 리뷰 목록
- 스토어별/평점별 필터링
- 키워드 검색
- 작성자 정보 마스킹 (개인정보 보호)

## ⏰ 자동 스케줄링

GitHub Actions를 통해 매일 KST 02:00에 자동 실행됩니다.

### 필요한 GitHub Secrets

```
DATABASE_URL=your-database-url
GEMINI_API_KEY=your-gemini-api-key
APPSTORE_APP_ID=428872117
GOOGLE_PLAY_APP_ID=com.sktelecom.minit
```

### 수동 실행

GitHub Actions 탭에서 "Daily Review Collection" 워크플로우를 수동으로 실행할 수 있습니다.

## 🔒 보안 및 컴플라이언스

- API 키는 환경변수로 관리 (코드에 하드코딩 금지)
- 개인정보 마스킹 (작성자명 등)
- 스토어 API 레이트 리밋 준수
- 재시도 로직 및 에러 핸들링

## 📈 확장성

### 데이터베이스 전환 (Supabase)
```bash
# DATABASE_URL을 PostgreSQL 연결 문자열로 변경
DATABASE_URL="postgresql://user:pass@host:5432/dbname"

# 마이그레이션 실행
pnpm prisma migrate deploy
```

### Redis 캐싱 (대용량 처리)
```bash
# REDIS_URL 환경변수 설정
REDIS_URL="redis://localhost:6379"
```

## 🐛 문제 해결

### 리뷰 수집 실패
1. 네트워크 연결 확인
2. API 레이트 리밋 확인
3. 앱 ID 정확성 확인

### AI 요약 생성 실패
1. Gemini API 키 확인
2. API 할당량 확인
3. 네트워크 연결 확인

### 데이터베이스 오류
```bash
# 데이터베이스 재설정
rm dev.db
pnpm db:push
pnpm seed
```

## 📝 개발 가이드

### 새로운 스토어 추가
1. `prisma/schema.prisma`에서 Store enum 수정
2. `src/lib/scrapers.ts`에 새 스크래퍼 함수 추가
3. `src/jobs/fetch-reviews.ts`에 수집 로직 추가

### 새로운 분석 기능 추가
1. `src/lib/text.ts`에 분석 함수 추가
2. `src/jobs/summarize-topics.ts`에 처리 로직 추가
3. 대시보드 컴포넌트 업데이트

## 📞 지원

문제가 발생하거나 기능 요청이 있으시면 GitHub Issues를 통해 연락해주세요.

## 📄 라이선스

이 프로젝트는 MIT 라이선스 하에 배포됩니다.

