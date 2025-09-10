# 🚀 무료 배포 가이드 (Vercel + Supabase)

## 1. Supabase 설정 (무료 PostgreSQL)

### 1-1. Supabase 계정 생성
1. https://supabase.com 접속
2. "Start your project" 클릭
3. GitHub 계정으로 로그인
4. "New project" 생성

### 1-2. 데이터베이스 정보 복사
- Project Settings > Database
- Connection string 복사 (postgres://...)

## 2. 환경변수 업데이트

`.env` 파일 수정:
```bash
# Supabase PostgreSQL
DATABASE_URL="postgresql://postgres:[YOUR-PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres"

# 기존 설정 유지
GEMINI_API_KEY="AIzaSyBdjyWfg7c5HN5QomTEHfIfK8FUXVKsAu4"
APPSTORE_APP_ID="428872117"
GOOGLE_PLAY_APP_ID="com.sktelecom.minit"
```

## 3. Vercel 배포

### 3-1. GitHub 저장소 생성
```bash
git init
git add .
git commit -m "T world 리뷰 분석 시스템"
git branch -M main
git remote add origin https://github.com/[YOUR-USERNAME]/tworld-review-analyzer.git
git push -u origin main
```

### 3-2. Vercel 연결
1. https://vercel.com 접속
2. GitHub 계정으로 로그인
3. "Import Git Repository" 선택
4. 생성한 저장소 선택

### 3-3. 환경변수 설정
Vercel 프로젝트 설정에서:
- `DATABASE_URL`: Supabase 연결 문자열
- `GEMINI_API_KEY`: AI API 키
- `APPSTORE_APP_ID`: 428872117
- `GOOGLE_PLAY_APP_ID`: com.sktelecom.minit

## 4. 최종 결과

- **고정 URL**: `https://your-project.vercel.app`
- **자동 배포**: GitHub 푸시 시 자동 업데이트
- **무료 사용**: Vercel + Supabase 모두 무료 티어
- **SSL 인증서**: 자동 적용

## 로컬 테스트 방법

현재 WiFi에서 바로 테스트:
```
📱 모바일: http://192.168.0.35:3000
💻 PC: http://192.168.0.35:3000
🖥️ 태블릿: http://192.168.0.35:3000
```
