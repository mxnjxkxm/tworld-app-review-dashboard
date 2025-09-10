# 🔑 Vercel 환경변수 설정 가이드

## 🎯 목표
배포 완료 후 환경변수 설정하여 완전한 기능 활성화

## 📋 설정할 환경변수 (정확히 복사하세요)

### 1. DATABASE_URL
```
postgresql://postgres:tworldappreview@db.rruzbruehaubtwekkung.supabase.co:5432/postgres
```

### 2. GEMINI_API_KEY  
```
AIzaSyBdjyWfg7c5HN5QomTEHfIfK8FUXVKsAu4
```

### 3. APPSTORE_APP_ID
```
428872117
```

### 4. GOOGLE_PLAY_APP_ID
```
com.sktelecom.minit
```

## 🛠️ Vercel에서 설정하는 방법

### 배포 완료 후:
1. **Vercel 프로젝트 페이지**에서 **"Settings"** 탭 클릭
2. 좌측 메뉴에서 **"Environment Variables"** 클릭
3. **"Add New"** 버튼 클릭
4. 위 4개 변수를 하나씩 추가:
   - **Name**: `DATABASE_URL`
   - **Value**: `postgresql://postgres:tworldappreview@db.rruzbruehaubtwekkung.supabase.co:5432/postgres`
   - **Environment**: `Production, Preview, Development` 모두 선택
   - **"Save"** 클릭
5. 나머지 3개 변수도 동일하게 추가

### 환경변수 설정 완료 후:
1. **"Deployments"** 탭으로 이동
2. 최신 배포의 **"⋯"** 메뉴 클릭
3. **"Redeploy"** 선택
4. **"Redeploy"** 버튼 클릭

## ⏱️ 예상 소요 시간
- 환경변수 설정: 3분
- 재배포: 2분
- **총 5분**

## 🎉 완료 확인
재배포 완료 후 URL 접속하여 확인:
- 리뷰 데이터 표시
- 탭 필터 작동
- AI 요약 표시

---

**배포가 완료되면 알려주세요! 환경변수 설정을 도와드리겠습니다.**
