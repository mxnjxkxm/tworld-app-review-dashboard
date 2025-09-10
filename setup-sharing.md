# 🌐 T world 대시보드 공유 가이드

## 즉시 사용 가능한 방법

### 1. 로컬 네트워크 공유 (현재 상태)
```
📱 로컬: http://localhost:3000
🌍 네트워크: http://192.168.0.35:3000
```

**사용법:**
- 같은 WiFi에 연결된 기기에서 `http://192.168.0.35:3000` 접속
- 스마트폰, 태블릿에서도 접속 가능

## 인터넷 공유 방법

### 2. ngrok 터널링 (추천)

**설치:**
```bash
# Homebrew로 설치
brew install ngrok

# 또는 다운로드
# https://ngrok.com/download
```

**사용법:**
```bash
# 새 터미널에서 실행
ngrok http 3000
```

**결과:**
```
Forwarding  https://abc123.ngrok.io -> http://localhost:3000
```
→ 전 세계 어디서나 `https://abc123.ngrok.io` 접속 가능

### 3. 클라우드 배포 (영구 공유)

#### A. Vercel 배포 (무료)
1. 데이터베이스를 Supabase로 전환 필요
2. GitHub에 코드 업로드
3. Vercel과 연결하여 자동 배포

#### B. Railway 배포 (유료)
1. 현재 SQLite 그대로 사용 가능
2. GitHub 연결 또는 CLI 배포
3. 자동 도메인 제공

#### C. Docker + Cloud Run
1. Docker 이미지 생성
2. Google Cloud Run에 배포
3. 사용량 기반 과금

## 보안 고려사항

### 🔒 인증 추가
현재는 누구나 접속 가능하므로 필요시 인증 추가:

```typescript
// middleware.ts
export function middleware(request: NextRequest) {
  const password = request.headers.get('authorization');
  if (password !== 'Basic your-password') {
    return new Response('Unauthorized', { status: 401 });
  }
}
```

### 🛡️ 환경변수 보호
- Gemini API 키 등 민감 정보 보호
- 프로덕션 환경에서는 별도 키 사용

## 추천 방법

### 🚀 빠른 공유 (임시)
1. **로컬 네트워크**: 같은 WiFi 사용자들과 즉시 공유
2. **ngrok**: 인터넷을 통한 임시 공유 (8시간 제한)

### 🏢 업무용 공유 (영구)
1. **Railway**: 설정 간단, SQLite 지원 ($5/월)
2. **Vercel + Supabase**: 무료, 확장성 좋음 (설정 복잡)

### 📊 데모/프레젠테이션용
1. **ngrok**: 발표 시 실시간 공유
2. **스크린샷/비디오**: 정적 공유

## 다음 단계

어떤 방법을 선택하시겠나요?
- 즉시 공유: ngrok 설치 도움
- 영구 배포: Vercel/Railway 설정 도움
- 로컬만: 현재 상태 유지
