# ⚡ 빠른 배포 가이드

## 🎯 목표 URL
`https://tworld-app-review-dashboard.vercel.app`

## 📋 3단계 배포 프로세스

### 1️⃣ Supabase 데이터베이스 생성
```
🌐 https://supabase.com
📝 프로젝트명: tworld-app-review-db
🔑 비밀번호: 설정 후 기록
📋 연결 문자열 복사 (Settings > Database)
```

### 2️⃣ GitHub 저장소 생성
```
🌐 https://github.com
📝 저장소명: tworld-app-review-dashboard
📄 설명: T world 앱 리뷰 자동 분석 대시보드
🔓 Public 설정
```

### 3️⃣ 코드 업로드 및 Vercel 배포
```bash
# GitHub 저장소 연결
git remote add origin https://github.com/[YOUR-USERNAME]/tworld-app-review-dashboard.git
git push -u origin main

# Vercel 배포
# 1. https://vercel.com 접속
# 2. GitHub 저장소 import
# 3. 환경변수 설정
# 4. Deploy 클릭
```

## 🔑 필요한 환경변수
```
DATABASE_URL: [Supabase에서 복사한 연결 문자열]
GEMINI_API_KEY: AIzaSyBdjyWfg7c5HN5QomTEHfIfK8FUXVKsAu4
APPSTORE_APP_ID: 428872117
GOOGLE_PLAY_APP_ID: com.sktelecom.minit
```

## ⏱️ 예상 소요 시간
- Supabase 설정: 3분
- GitHub 업로드: 2분  
- Vercel 배포: 5분
- **총 10분 내 완료**

## 🎉 완료 후 결과
- 고정 URL로 전 세계 접속 가능
- 자동 HTTPS 적용
- GitHub 푸시 시 자동 재배포
- 무료 사용 (제한 없음)

## 📱 현재 로컬 공유 (대기 중)
같은 WiFi에서 바로 접속 가능:
`http://192.168.0.35:3000`

---

**다음 단계:** Supabase와 GitHub 설정이 완료되면 알려주세요!
코드 업로드와 Vercel 배포를 자동으로 진행하겠습니다.
