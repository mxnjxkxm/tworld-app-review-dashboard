# 설치 가이드

## 1. Node.js 설치

### macOS (Homebrew 사용)
```bash
# Homebrew 설치 (없는 경우)
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

# Node.js 설치
brew install node@20
```

### macOS (공식 설치 파일)
1. https://nodejs.org 방문
2. LTS 버전 (20.x) 다운로드
3. 설치 파일 실행

## 2. pnpm 설치
```bash
npm install -g pnpm
```

## 3. 프로젝트 설정
```bash
# 의존성 설치
pnpm install

# 데이터베이스 설정
pnpm prisma generate
pnpm db:push

# 시드 데이터 생성
pnpm seed

# 개발 서버 실행
pnpm dev
```

## 4. 환경변수 확인
`.env` 파일에서 다음 값들이 올바르게 설정되었는지 확인:
- `GEMINI_API_KEY`: 제공된 API 키
- `APPSTORE_APP_ID`: 428872117
- `GOOGLE_PLAY_APP_ID`: com.sktelecom.minit

## 5. 첫 번째 실행
```bash
# 리뷰 수집 테스트
pnpm fetch

# 토픽 분석 테스트
pnpm summarize

# 대시보드 확인
# 브라우저에서 http://localhost:3000 접속
```

