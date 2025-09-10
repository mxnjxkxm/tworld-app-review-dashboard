# 🚀 최종 배포 단계 (웹 기반)

## ✅ 완료된 작업
- ✅ GitHub 저장소: https://github.com/mxnjxkxm/tworld-app-review-dashboard
- ✅ 코드 업로드 완료
- ✅ Supabase 프로젝트 생성 완료
- ✅ 연결 문자열 확인 완료

## 🎯 목표 URL
`https://tworld-app-review-dashboard.vercel.app`

## 📋 3단계 웹 배포 (5분 소요)

### 1️⃣ Vercel 프로젝트 생성 (2분)
1. **https://vercel.com** 접속
2. **"Continue with GitHub"** 클릭 (같은 구글 계정)
3. **"Import Git Repository"** 선택
4. **"tworld-app-review-dashboard"** 저장소 선택
5. **프로젝트명 확인**: `tworld-app-review-dashboard`
6. **"Deploy"** 클릭 (환경변수는 나중에 설정)

### 2️⃣ 환경변수 설정 (2분)
Vercel 프로젝트 > Settings > Environment Variables에서:

```
DATABASE_URL
postgresql://postgres:tworldappreview@db.rruzbruehaubtwekkung.supabase.co:5432/postgres

GEMINI_API_KEY
AIzaSyBdjyWfg7c5HN5QomTEHfIfK8FUXVKsAu4

APPSTORE_APP_ID
428872117

GOOGLE_PLAY_APP_ID
com.sktelecom.minit
```

### 3️⃣ 재배포 및 데이터베이스 설정 (1분)
1. **"Redeploy"** 버튼 클릭 (환경변수 적용)
2. 배포 완료 후 **Functions** 탭에서 실행:
   ```bash
   npx prisma db push
   npx tsx src/seed.ts
   ```

## 🎉 완료 후 결과

### 📊 접속 가능한 URL들
- **클라우드**: `https://tworld-app-review-dashboard.vercel.app`
- **로컬**: `http://localhost:3000`
- **WiFi**: `http://192.168.0.35:3000`

### 🔄 자동 기능들
- **매일 자동 리뷰 수집** (GitHub Actions)
- **AI 토픽 분석** (Gemini 2.5 Flash)
- **GitHub 푸시 시 자동 재배포**

### 📱 데이터 현황
- **총 602건 리뷰** (iOS 227 + Android 375)
- **6개 AI 토픽 분석**
- **실시간 필터링** (탭 방식)

## ⚡ 빠른 시작
1. Vercel 배포 (위 단계)
2. 환경변수 설정
3. 재배포
4. **완료!** 🎯

---

**Vercel 배포를 시작하시면 실시간으로 도와드리겠습니다!**
