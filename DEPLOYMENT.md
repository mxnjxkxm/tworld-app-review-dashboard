# 🚀 배포 가이드 (Vercel + Supabase)

## 📋 배포 체크리스트

### ✅ 1단계: Supabase 설정

1. **Supabase 프로젝트 생성**
   - https://supabase.com 접속
   - "New project" 생성
   - 프로젝트명: `tworld-review-analyzer`

2. **데이터베이스 연결 정보 복사**
   - Settings > Database
   - Connection string 복사
   - 형태: `postgresql://postgres:[PASSWORD]@db.[PROJECT].supabase.co:5432/postgres`

### ✅ 2단계: GitHub 저장소 생성

```bash
# 현재 디렉토리에서 실행
git add .
git commit -m "T world 리뷰 분석 시스템 초기 버전"
git branch -M main

# GitHub에서 새 저장소 생성 후
git remote add origin https://github.com/[YOUR-USERNAME]/tworld-review-analyzer.git
git push -u origin main
```

### ✅ 3단계: Vercel 배포

1. **Vercel 프로젝트 생성**
   - https://vercel.com 접속
   - "Import Git Repository"
   - GitHub 저장소 선택

2. **환경변수 설정** (Vercel 대시보드에서)
   ```
   DATABASE_URL: [Supabase 연결 문자열]
   GEMINI_API_KEY: AIzaSyBdjyWfg7c5HN5QomTEHfIfK8FUXVKsAu4
   APPSTORE_APP_ID: 428872117
   GOOGLE_PLAY_APP_ID: com.sktelecom.minit
   ```

3. **배포 실행**
   - "Deploy" 버튼 클릭
   - 약 2-3분 후 완료

### ✅ 4단계: 데이터베이스 마이그레이션

배포 완료 후 Vercel 프로젝트 설정에서:
```bash
# Functions > Settings에서 실행
npx prisma db push
npx tsx src/seed.ts
```

## 🎯 최종 결과

- **고정 URL**: `https://tworld-review-analyzer.vercel.app`
- **자동 배포**: GitHub 푸시 시 자동 업데이트
- **무료 사용**: 월 100GB 대역폭, 무제한 요청
- **SSL**: 자동 HTTPS 적용

## 📱 로컬 WiFi 공유 (현재 사용 중)

**현재 접속 가능한 주소:**
- 로컬: `http://localhost:3000`
- 네트워크: `http://192.168.0.35:3000`

**같은 WiFi 사용자들이 접속 방법:**
1. 스마트폰/태블릿에서 `http://192.168.0.35:3000` 입력
2. QR 코드 생성기로 URL을 QR 코드로 변환
3. 다른 사람들에게 QR 코드 공유

## 🔄 자동 업데이트

### GitHub Actions (이미 설정됨)
- 매일 KST 02:00에 자동 리뷰 수집
- Vercel 환경에서도 동일하게 작동

### 수동 업데이트
- Vercel 대시보드에서 "Redeploy" 버튼
- 또는 GitHub에 새 코드 푸시

## 🛡️ 보안 설정 (선택사항)

### 간단한 비밀번호 보호
```typescript
// middleware.ts 생성
export function middleware(request: NextRequest) {
  const auth = request.headers.get('authorization');
  if (!auth || auth !== 'Basic ' + btoa('admin:your-password')) {
    return new Response('Unauthorized', { 
      status: 401,
      headers: { 'WWW-Authenticate': 'Basic realm="Dashboard"' }
    });
  }
}
```

## 📊 모니터링

### Vercel 대시보드에서 확인 가능:
- 방문자 수
- 응답 시간
- 에러 로그
- 사용량 통계

## 🆘 문제 해결

### 배포 실패 시
1. 환경변수 확인
2. Supabase 연결 테스트
3. Vercel 빌드 로그 확인

### 데이터 없음
1. 시드 스크립트 실행
2. 리뷰 수집 스크립트 실행
3. 토픽 분석 스크립트 실행
